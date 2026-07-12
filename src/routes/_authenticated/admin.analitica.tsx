import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3, Users, Crown, FileText, Download, Loader2, TrendingUp,
  Percent, LineChart as LineIcon, ExternalLink,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";
import { getAdminAnalytics } from "@/lib/analytics.functions";

export const Route = createFileRoute("/_authenticated/admin/analitica")({
  component: AnalyticsPage,
});

const COLORS = ["hsl(var(--muted-foreground))", "hsl(var(--primary))"];

function Kpi({ icon: Icon, label, value, sub }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function AnalyticsPage() {
  const fetchAnalytics = useServerFn(getAdminAnalytics);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => fetchAnalytics(),
  });

  const conversion = data && data.totals.users > 0
    ? ((data.totals.pro / data.totals.users) * 100).toFixed(1)
    : "0";
  const retention = data && data.totals.users > 0
    ? ((data.funnel[1].value / data.totals.users) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BarChart3 className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">Funnels, conversion and retention.</p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : error || !data ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No se pudieron cargar las métricas.
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={Users} label="Usuarios" value={String(data.totals.users)} />
            <Kpi icon={Crown} label="Suscriptores Pro" value={String(data.totals.pro)} />
            <Kpi icon={Percent} label="Conversión a Pro" value={`${conversion}%`} />
            <Kpi icon={TrendingUp} label="Activación (CV creado)" value={`${retention}%`} />
            <Kpi icon={FileText} label="CV creados" value={String(data.totals.resumes)} />
            <Kpi icon={FileText} label="Cartas creadas" value={String(data.totals.coverLetters)} />
            <Kpi icon={Download} label="Descargas" value={String(data.totals.downloads)} />
            <Kpi icon={BarChart3} label="Postulaciones" value={String(data.totals.applications)} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <LineIcon className="h-4 w-4 text-primary" />
                <h2 className="font-display text-base font-semibold">Registros (últimos 30 días)</h2>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.signups}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} interval={4} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#g)" name="Registros" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-4 font-display text-base font-semibold">Distribución de planes</h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={data.planSplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {data.planSplit.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
                {data.planSplit.map((p, i) => (
                  <span key={p.name} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    {p.name}: {p.value}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 font-display text-base font-semibold">Embudo de conversión</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.funnel} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 12 }} width={90} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} name="Usuarios" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: "Google Analytics", desc: "Conecta GA4 para tráfico y comportamiento de páginas.", url: "https://analytics.google.com" },
              { name: "Search Console", desc: "Conecta Search Console para posiciones y clics de búsqueda.", url: "https://search.google.com/search-console" },
            ].map((s) => (
              <div key={s.name} className="flex items-start justify-between gap-4 rounded-2xl border border-dashed border-border bg-card/50 p-5">
                <div>
                  <h3 className="font-display text-base font-semibold">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
                <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent">
                  Abrir <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
