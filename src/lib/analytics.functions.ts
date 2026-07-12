import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Point = { date: string; value: number };
export type AdminAnalytics = {
  totals: {
    users: number;
    pro: number;
    resumes: number;
    coverLetters: number;
    applications: number;
    downloads: number;
    revenue: number;
  };
  funnel: { label: string; value: number }[];
  signups: Point[];
  planSplit: { name: string; value: number }[];
};

function lastNDays(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export const getAdminAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminAnalytics> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [profilesRes, resumesRes, coversRes, appsRes, downloadsRes, invoicesRes] =
      await Promise.all([
        supabaseAdmin.from("profiles").select("id, plan, created_at"),
        supabaseAdmin.from("resumes").select("user_id", { count: "exact", head: true }),
        supabaseAdmin.from("cover_letters").select("user_id", { count: "exact", head: true }),
        supabaseAdmin.from("job_applications").select("user_id", { count: "exact", head: true }),
        supabaseAdmin.from("downloads").select("user_id", { count: "exact", head: true }),
        supabaseAdmin.from("invoices").select("amount, status"),
      ]);

    const profiles = profilesRes.data ?? [];
    const users = profiles.length;
    const pro = profiles.filter((p) => (p.plan ?? "").toLowerCase() === "pro").length;

    // Distinct users who created resumes / downloads for the funnel
    const [{ data: resumeUsers }, { data: downloadUsers }] = await Promise.all([
      supabaseAdmin.from("resumes").select("user_id"),
      supabaseAdmin.from("downloads").select("user_id"),
    ]);
    const withResume = new Set((resumeUsers ?? []).map((r) => r.user_id)).size;
    const withDownload = new Set((downloadUsers ?? []).map((r) => r.user_id)).size;

    const revenue = (invoicesRes.data ?? [])
      .filter((i) => i.status === "pagado")
      .reduce((s, i) => s + Number(i.amount), 0);

    const days = lastNDays(30);
    const byDay = new Map(days.map((d) => [d, 0]));
    for (const p of profiles) {
      const d = (p.created_at ?? "").slice(0, 10);
      if (byDay.has(d)) byDay.set(d, (byDay.get(d) ?? 0) + 1);
    }
    const signups: Point[] = days.map((d) => ({ date: d, value: byDay.get(d) ?? 0 }));

    return {
      totals: {
        users,
        pro,
        resumes: resumesRes.count ?? 0,
        coverLetters: coversRes.count ?? 0,
        applications: appsRes.count ?? 0,
        downloads: downloadsRes.count ?? 0,
        revenue,
      },
      funnel: [
        { label: "Registrados", value: users },
        { label: "CV creado", value: withResume },
        { label: "Descarga", value: withDownload },
        { label: "Pro", value: pro },
      ],
      signups,
      planSplit: [
        { name: "Free", value: users - pro },
        { name: "Pro", value: pro },
      ],
    };
  });