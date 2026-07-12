import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Crown,
  Gift,
  DollarSign,
  TrendingUp,
  FileText,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: DashboardPage,
});

type Row = { plan: string; created_at: string };

function DashboardPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [invoices, setInvoices] = useState<any[] | null>(null);
  const [resumesCount, setResumesCount] = useState<number>(0);
  const [aiUsageCount, setAiUsageCount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const [{ data: prof }, { data: invs }, { count: resCount }, { count: usageCount }] = await Promise.all([
        supabase.from("profiles").select("plan, created_at"),
        supabase.from("invoices").select("amount, status, issued_at, currency"),
        supabase.from("resumes").select("*", { count: "exact", head: true }),
        supabase.from("ai_usage_logs").select("*", { count: "exact", head: true }),
      ]);
      setRows(prof ?? []);
      setInvoices(invs ?? []);
      setResumesCount(resCount ?? 0);
      setAiUsageCount(usageCount ?? 0);
    })();
  }, []);

  const stats = useMemo(() => {
    if (!rows || !invoices) return null;
    const total = rows.length;
    const pro = rows.filter((r) => r.plan === "pro").length;
    const today = new Date().toISOString().slice(0, 10);
    const newToday = rows.filter((r) => r.created_at.slice(0, 10) === today).length;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyRevenue = invoices
      .filter((i) => i.status === "pagado" && i.issued_at.slice(0, 7) === currentMonth)
      .reduce((sum, i) => sum + Number(i.amount), 0);

    const mrr = pro * 149;

    const days: { label: string; value: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        label: d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" }),
        value: rows.filter((r) => r.created_at.slice(0, 10) === key).length,
      });
    }
    return { total, pro, free: total - pro, newToday, monthlyRevenue, mrr, days };
  }, [rows, invoices]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-display text-xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time overview of CVMéxico.
          </p>
        </div>
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          Last 14 days
        </span>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={Users} label="Total users" value={stats?.total} loading={!stats} live />
        <Kpi icon={UserPlus} label="New today" value={stats?.newToday} loading={!stats} live />
        <Kpi icon={Crown} label="Pro users" value={stats?.pro} loading={!stats} live />
        <Kpi icon={Gift} label="Free users" value={stats?.free} loading={!stats} live />
        <Kpi icon={DollarSign} label="Monthly revenue" value={stats?.monthlyRevenue} prefix="$" suffix=" MXN" loading={!stats} />
        <Kpi icon={TrendingUp} label="MRR" value={stats?.mrr} prefix="$" suffix=" MXN" loading={!stats} />
        <Kpi icon={FileText} label="Resumes created" value={resumesCount} loading={!stats} />
        <Kpi icon={Sparkles} label="AI credits used" value={aiUsageCount} loading={!stats} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Daily signups" className="lg:col-span-2">
          {stats ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats.days} margin={{ left: 0, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#g)"
                  name="Signups"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-[220px] w-full" />
          )}
        </Panel>

        <Panel title="Plan distribution">
          {stats ? (
            stats.total === 0 ? (
              <EmptyMini />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Free", value: stats.free },
                      { name: "Pro", value: stats.pro },
                    ]}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    <Cell fill="var(--chart-2)" />
                    <Cell fill="var(--chart-1)" />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "var(--popover-foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )
          ) : (
            <Skeleton className="h-[220px] w-full" />
          )}
        </Panel>

        <Panel title="Signups trend (bars)" className="lg:col-span-3">
          {stats ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.days} margin={{ left: 0, right: 8, top: 8 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Signups" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-[200px] w-full" />
          )}
        </Panel>
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  loading,
  live,
  prefix = "",
  suffix = "",
}: {
  icon: LucideIcon;
  label: string;
  value?: number;
  loading?: boolean;
  live?: boolean;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {live && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
          </span>
        )}
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-7 w-16" />
      ) : (
        <p className="mt-3 font-display text-2xl font-bold tabular-nums">
          {prefix}
          {(value ?? 0).toLocaleString("es-MX")}
          {suffix}
        </p>
      )}
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 ${className}`}>
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function EmptyMini() {
  return (
    <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
      Not enough data yet.
    </div>
  );
}