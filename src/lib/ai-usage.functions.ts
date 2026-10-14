import { createServerFn } from "@tanstack/react-start";
import { requireD1Auth as requireSupabaseAuth, getServiceDb } from "@/lib/db/server-db.server";
import { z } from "zod";

type Log = {
  id: string;
  user_id: string | null;
  feature: string;
  model: string | null;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
  response_ms: number;
  status: string;
  country: string | null;
  plan: string | null;
  created_at: string;
};

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (!isAdmin) throw new Error("Forbidden");
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}
function monthKey(d: Date) {
  return d.toISOString().slice(0, 7);
}

export type AiUsageOverview = {
  kpis: {
    totalRequests: number;
    today: number;
    week: number;
    month: number;
    totalTokens: number;
    totalCost: number;
    avgCostPerUser: number;
    avgTokensPerRequest: number;
    activeUsers: number;
    premiumUsers: number;
    freeUsers: number;
    mostUsedFeature: string;
  };
  daily: { date: string; requests: number; tokens: number; cost: number }[];
  monthly: { month: string; requests: number; tokens: number; cost: number }[];
  features: {
    feature: string;
    requests: number;
    tokens: number;
    avgTokens: number;
    cost: number;
    successRate: number;
    avgMs: number;
  }[];
  planSplit: { name: string; value: number }[];
  byCountry: { country: string; requests: number }[];
  alerts: { type: string; message: string; severity: "info" | "warning" | "critical" }[];
};

export const getAiUsageOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AiUsageOverview> => {
    await assertAdmin(context);
    const supabaseAdmin = getServiceDb();

    const { data: rows } = await supabaseAdmin
      .from("ai_usage_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20000);
    const logs: Log[] = (rows ?? []) as Log[];

    const now = new Date();
    const todayKey = dayKey(now);
    const weekAgo = new Date(now.getTime() - 7 * 864e5);
    const monthAgo = new Date(now.getTime() - 30 * 864e5);

    let totalTokens = 0;
    let totalCost = 0;
    let today = 0;
    let week = 0;
    let month = 0;
    const users = new Set<string>();

    const dailyMap = new Map<string, { requests: number; tokens: number; cost: number }>();
    const monthlyMap = new Map<string, { requests: number; tokens: number; cost: number }>();
    const featMap = new Map<
      string,
      { requests: number; tokens: number; cost: number; ok: number; ms: number }
    >();
    const countryMap = new Map<string, number>();

    for (const l of logs) {
      const c = new Date(l.created_at);
      totalTokens += l.total_tokens;
      totalCost += Number(l.cost);
      if (dayKey(c) === todayKey) today++;
      if (c >= weekAgo) week++;
      if (c >= monthAgo) month++;
      if (l.user_id) users.add(l.user_id);

      const dk = dayKey(c);
      const dd = dailyMap.get(dk) ?? { requests: 0, tokens: 0, cost: 0 };
      dd.requests++; dd.tokens += l.total_tokens; dd.cost += Number(l.cost);
      dailyMap.set(dk, dd);

      const mk = monthKey(c);
      const mm = monthlyMap.get(mk) ?? { requests: 0, tokens: 0, cost: 0 };
      mm.requests++; mm.tokens += l.total_tokens; mm.cost += Number(l.cost);
      monthlyMap.set(mk, mm);

      const f = featMap.get(l.feature) ?? { requests: 0, tokens: 0, cost: 0, ok: 0, ms: 0 };
      f.requests++; f.tokens += l.total_tokens; f.cost += Number(l.cost);
      f.ok += l.status === "success" ? 1 : 0; f.ms += l.response_ms;
      featMap.set(l.feature, f);

      const ck = l.country || "Desconocido";
      countryMap.set(ck, (countryMap.get(ck) ?? 0) + 1);
    }

    // plan split from profiles
    const { data: profs } = await supabaseAdmin.from("profiles").select("id, plan");
    const planByUser = new Map((profs ?? []).map((p: any) => [p.id, (p.plan ?? "free").toLowerCase()]));
    let premiumUsers = 0;
    let freeUsers = 0;
    for (const u of users) {
      const p = planByUser.get(u) ?? "free";
      if (p === "free") freeUsers++; else premiumUsers++;
    }

    const days: { date: string; requests: number; tokens: number; cost: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const k = dayKey(new Date(now.getTime() - i * 864e5));
      const v = dailyMap.get(k) ?? { requests: 0, tokens: 0, cost: 0 };
      days.push({ date: k, ...v });
    }
    const months: { month: string; requests: number; tokens: number; cost: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const k = monthKey(d);
      const v = monthlyMap.get(k) ?? { requests: 0, tokens: 0, cost: 0 };
      months.push({ month: k, ...v });
    }

    const features = Array.from(featMap.entries())
      .map(([feature, f]) => ({
        feature,
        requests: f.requests,
        tokens: f.tokens,
        avgTokens: f.requests ? Math.round(f.tokens / f.requests) : 0,
        cost: f.cost,
        successRate: f.requests ? (f.ok / f.requests) * 100 : 100,
        avgMs: f.requests ? Math.round(f.ms / f.requests) : 0,
      }))
      .sort((a, b) => b.requests - a.requests);

    const totalRequests = logs.length;
    const activeUsers = users.size;

    const alerts: AiUsageOverview["alerts"] = [];
    const failures = logs.filter((l) => l.status !== "success").length;
    if (failures > 0)
      alerts.push({
        type: "api_failures",
        message: `${failures} solicitudes de IA fallaron.`,
        severity: failures > 20 ? "critical" : "warning",
      });
    if (totalCost > 50)
      alerts.push({
        type: "cost_threshold",
        message: `El costo estimado de IA (${totalCost.toFixed(2)} USD) superó el umbral.`,
        severity: "warning",
      });
    // unusual activity: any user with > 200 requests today
    const perUserToday = new Map<string, number>();
    for (const l of logs) {
      if (dayKey(new Date(l.created_at)) === todayKey && l.user_id)
        perUserToday.set(l.user_id, (perUserToday.get(l.user_id) ?? 0) + 1);
    }
    for (const [u, n] of perUserToday) {
      if (n > 200)
        alerts.push({
          type: "unusual_activity",
          message: `Actividad inusual: un usuario realizó ${n} solicitudes hoy.`,
          severity: "critical",
        });
    }

    return {
      kpis: {
        totalRequests,
        today,
        week,
        month,
        totalTokens,
        totalCost,
        avgCostPerUser: activeUsers ? totalCost / activeUsers : 0,
        avgTokensPerRequest: totalRequests ? Math.round(totalTokens / totalRequests) : 0,
        activeUsers,
        premiumUsers,
        freeUsers,
        mostUsedFeature: features[0]?.feature ?? "—",
      },
      daily: days,
      monthly: months,
      features,
      planSplit: [
        { name: "Free", value: freeUsers },
        { name: "Premium", value: premiumUsers },
      ],
      byCountry: Array.from(countryMap.entries())
        .map(([country, requests]) => ({ country, requests }))
        .sort((a, b) => b.requests - a.requests),
      alerts,
    };
  });

export type AiUserRow = {
  userId: string;
  name: string;
  email: string;
  plan: string;
  createdAt: string;
  totalRequests: number;
  today: number;
  week: number;
  month: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  lastRequest: string | null;
  topFeature: string;
  unlimited: boolean;
  disabled: boolean;
  dailyLimit: number | null;
  monthlyLimit: number | null;
  lifetimeLimit: number | null;
  bonusCredits: number;
};

export const getAiUserUsage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AiUserRow[]> => {
    await assertAdmin(context);
    const supabaseAdmin = getServiceDb();

    const [{ data: profs }, { data: logs }, { data: limits }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, full_name, email, plan, created_at"),
      supabaseAdmin.from("ai_usage_logs").select("*").order("created_at", { ascending: false }).limit(20000),
      supabaseAdmin.from("ai_user_limits").select("*"),
    ]);

    const now = new Date();
    const todayKey = dayKey(now);
    const weekAgo = new Date(now.getTime() - 7 * 864e5);
    const monthAgo = new Date(now.getTime() - 30 * 864e5);

    const limitByUser = new Map((limits ?? []).map((l: any) => [l.user_id, l]));
    type Agg = {
      total: number; today: number; week: number; month: number;
      input: number; output: number; tokens: number; cost: number;
      last: string | null; feats: Map<string, number>;
    };
    const agg = new Map<string, Agg>();
    for (const l of (logs ?? []) as Log[]) {
      if (!l.user_id) continue;
      const a = agg.get(l.user_id) ?? {
        total: 0, today: 0, week: 0, month: 0, input: 0, output: 0, tokens: 0, cost: 0, last: null, feats: new Map(),
      };
      const c = new Date(l.created_at);
      a.total++;
      if (dayKey(c) === todayKey) a.today++;
      if (c >= weekAgo) a.week++;
      if (c >= monthAgo) a.month++;
      a.input += l.input_tokens; a.output += l.output_tokens; a.tokens += l.total_tokens; a.cost += Number(l.cost);
      if (!a.last || l.created_at > a.last) a.last = l.created_at;
      a.feats.set(l.feature, (a.feats.get(l.feature) ?? 0) + 1);
      agg.set(l.user_id, a);
    }

    return (profs ?? []).map((p: any) => {
      const a = agg.get(p.id);
      const lim: any = limitByUser.get(p.id);
      const topFeature = a
        ? Array.from(a.feats.entries()).sort((x, y) => y[1] - x[1])[0]?.[0] ?? "—"
        : "—";
      return {
        userId: p.id,
        name: p.full_name ?? "—",
        email: p.email ?? "—",
        plan: (p.plan ?? "free"),
        createdAt: p.created_at,
        totalRequests: a?.total ?? 0,
        today: a?.today ?? 0,
        week: a?.week ?? 0,
        month: a?.month ?? 0,
        inputTokens: a?.input ?? 0,
        outputTokens: a?.output ?? 0,
        totalTokens: a?.tokens ?? 0,
        cost: a?.cost ?? 0,
        lastRequest: a?.last ?? null,
        topFeature,
        unlimited: lim?.unlimited ?? false,
        disabled: lim?.disabled ?? false,
        dailyLimit: lim?.daily_limit ?? null,
        monthlyLimit: lim?.monthly_limit ?? null,
        lifetimeLimit: lim?.lifetime_limit ?? null,
        bonusCredits: lim?.bonus_credits ?? 0,
      };
    }).sort((a, b) => b.totalRequests - a.totalRequests);
  });

const HistoryInput = z.object({
  page: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(100).default(25),
  search: z.string().optional().default(""),
  feature: z.string().optional().default(""),
  status: z.string().optional().default(""),
  userId: z.string().optional().default(""),
  from: z.string().optional().default(""),
  to: z.string().optional().default(""),
});

export type AiHistoryRow = Log & { name: string; email: string };

export const getAiRequestHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => HistoryInput.parse(d))
  .handler(async ({ data, context }): Promise<{ rows: AiHistoryRow[]; total: number }> => {
    await assertAdmin(context);
    const supabaseAdmin = getServiceDb();

    let q = supabaseAdmin.from("ai_usage_logs").select("*", { count: "exact" });
    if (data.feature) q = q.eq("feature", data.feature);
    if (data.status) q = q.eq("status", data.status);
    if (data.userId) q = q.eq("user_id", data.userId);
    if (data.from) q = q.gte("created_at", data.from);
    if (data.to) q = q.lte("created_at", data.to);
    q = q.order("created_at", { ascending: false }).range(
      data.page * data.pageSize,
      data.page * data.pageSize + data.pageSize - 1,
    );
    const { data: rows, count } = await q;
    const logs = (rows ?? []) as Log[];

    const ids = Array.from(new Set(logs.map((l) => l.user_id).filter(Boolean))) as string[];
    const { data: profs } = ids.length
      ? await supabaseAdmin.from("profiles").select("id, full_name, email").in("id", ids)
      : { data: [] as any[] };
    const pById = new Map((profs ?? []).map((p: any) => [p.id, p]));

    let enriched: AiHistoryRow[] = logs.map((l) => ({
      ...l,
      name: (l.user_id && pById.get(l.user_id)?.full_name) || "—",
      email: (l.user_id && pById.get(l.user_id)?.email) || "—",
    }));

    if (data.search) {
      const s = data.search.toLowerCase();
      enriched = enriched.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          r.email.toLowerCase().includes(s) ||
          r.feature.toLowerCase().includes(s),
      );
    }

    return { rows: enriched, total: count ?? enriched.length };
  });

const CreditInput = z.object({
  userId: z.string().uuid(),
  action: z.enum([
    "add_credits",
    "remove_credits",
    "reset_usage",
    "set_limits",
    "enable_unlimited",
    "disable_unlimited",
    "disable_access",
    "enable_access",
    "bonus_credits",
    "send_warning",
  ]),
  amount: z.number().int().optional(),
  dailyLimit: z.number().int().nullable().optional(),
  monthlyLimit: z.number().int().nullable().optional(),
  lifetimeLimit: z.number().int().nullable().optional(),
  note: z.string().optional().default(""),
});

export const manageAiCredit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CreditInput.parse(d))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await assertAdmin(context);
    const supabaseAdmin = getServiceDb();

    const { data: existing } = await supabaseAdmin
      .from("ai_user_limits")
      .select("*")
      .eq("user_id", data.userId)
      .maybeSingle();
    const cur: any = existing ?? {
      user_id: data.userId, daily_limit: null, monthly_limit: null,
      lifetime_limit: null, bonus_credits: 0, unlimited: false, disabled: false,
    };

    switch (data.action) {
      case "add_credits":
      case "bonus_credits":
        cur.bonus_credits = (cur.bonus_credits ?? 0) + (data.amount ?? 0);
        break;
      case "remove_credits":
        cur.bonus_credits = Math.max(0, (cur.bonus_credits ?? 0) - (data.amount ?? 0));
        break;
      case "set_limits":
        cur.daily_limit = data.dailyLimit ?? null;
        cur.monthly_limit = data.monthlyLimit ?? null;
        cur.lifetime_limit = data.lifetimeLimit ?? null;
        break;
      case "enable_unlimited":
        cur.unlimited = true;
        break;
      case "disable_unlimited":
        cur.unlimited = false;
        break;
      case "disable_access":
        cur.disabled = true;
        break;
      case "enable_access":
        cur.disabled = false;
        break;
      case "reset_usage":
        await supabaseAdmin.from("ai_usage_logs").delete().eq("user_id", data.userId);
        break;
      case "send_warning":
        break;
    }

    if (data.action !== "reset_usage" && data.action !== "send_warning") {
      await supabaseAdmin.from("ai_user_limits").upsert({
        user_id: cur.user_id,
        daily_limit: cur.daily_limit,
        monthly_limit: cur.monthly_limit,
        lifetime_limit: cur.lifetime_limit,
        bonus_credits: cur.bonus_credits,
        unlimited: cur.unlimited,
        disabled: cur.disabled,
      });
    }

    await supabaseAdmin.from("ai_credit_events").insert({
      user_id: data.userId,
      admin_id: context.userId,
      action: data.action,
      amount: data.amount ?? null,
      note: data.note || null,
    });

    return { ok: true };
  });

export const getUserCreditHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const supabaseAdmin = getServiceDb();
    const { data: rows } = await supabaseAdmin
      .from("ai_credit_events")
      .select("*")
      .eq("user_id", data.userId)
      .order("created_at", { ascending: false })
      .limit(100);
    return rows ?? [];
  });
