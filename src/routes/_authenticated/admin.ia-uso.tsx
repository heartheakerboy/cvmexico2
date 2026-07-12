import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Activity, Coins, Cpu, Users, Crown, UserPlus, Gauge, DollarSign, Sparkles,
  Search, Download, Loader2, AlertTriangle, TrendingUp, Zap, Ban, Infinity as InfinityIcon,
  RotateCcw, Plus, Minus, Settings2, History, ShieldAlert, CheckCircle2, XCircle,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  getAiUsageOverview, getAiUserUsage, getAiRequestHistory, manageAiCredit,
  getUserCreditHistory, type AiUserRow,
} from "@/lib/ai-usage.functions";

export const Route = createFileRoute("/_authenticated/admin/ia-uso")({
  component: AiUsagePage,
});

const FEATURE_LABELS: Record<string, string> = {
  resume_generator: "Generador de CV",
  summary_generator: "Resumen profesional",
  experience_writer: "Redactor de experiencia",
  skills_generator: "Generador de habilidades",
  objective_generator: "Objetivo profesional",
  cover_letter: "Carta de presentación",
  ats: "Optimización ATS",
  resume_review: "Revisión de CV",
  grammar: "Corrector gramatical",
  translation: "Traducción",
  rewrite: "Reescribir",
  expand: "Expandir",
  shorten: "Acortar",
  action_verbs: "Verbos de acción",
  keyword_suggestions: "Palabras clave",
  improve: "Mejorar",
  generate: "Generar",
  continue: "Continuar",
  quantify: "Cuantificar",
};
const featLabel = (f: string) => FEATURE_LABELS[f] ?? f;

type CreditVars = {
  userId: string;
  action:
    | "add_credits" | "remove_credits" | "reset_usage" | "set_limits"
    | "enable_unlimited" | "disable_unlimited" | "disable_access" | "enable_access"
    | "bonus_credits" | "send_warning";
  amount?: number;
  dailyLimit?: number | null;
  monthlyLimit?: number | null;
  lifetimeLimit?: number | null;
  note?: string;
};
const money = (n: number) => `$${n.toFixed(4)}`;
const money2 = (n: number) => `$${n.toFixed(2)}`;
const num = (n: number) => n.toLocaleString("es-MX");
const dt = (s: string | null) =>
  s ? new Date(s).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }) : "—";

const CHART = ["hsl(var(--primary))", "hsl(var(--muted-foreground))", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

function downloadCsv(name: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

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

function AiUsagePage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Activity className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">Uso y créditos de IA</h1>
          <p className="text-sm text-muted-foreground">
            Monitorea, controla y administra el consumo de IA de cada usuario.
          </p>
        </div>
      </header>

      <Tabs defaultValue="dashboard">
        <TabsList className="flex-wrap">
          <TabsTrigger value="dashboard">Panel</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="features">Funciones</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard"><DashboardTab /></TabsContent>
        <TabsContent value="history"><HistoryTab /></TabsContent>
        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="features"><FeaturesTab /></TabsContent>
        <TabsContent value="alerts"><AlertsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function useOverview() {
  const fn = useServerFn(getAiUsageOverview);
  return useQuery({ queryKey: ["ai-usage-overview"], queryFn: () => fn() });
}

function DashboardTab() {
  const { data, isLoading, error } = useOverview();
  if (isLoading)
    return <div className="flex justify-center py-24 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (error || !data)
    return <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">No se pudieron cargar las métricas.</div>;

  const k = data.kpis;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <Kpi icon={Zap} label="Solicitudes totales" value={num(k.totalRequests)} />
        <Kpi icon={Activity} label="Hoy" value={num(k.today)} />
        <Kpi icon={TrendingUp} label="Esta semana" value={num(k.week)} />
        <Kpi icon={TrendingUp} label="Este mes" value={num(k.month)} />
        <Kpi icon={Cpu} label="Tokens consumidos" value={num(k.totalTokens)} />
        <Kpi icon={DollarSign} label="Costo estimado" value={money2(k.totalCost)} />
        <Kpi icon={Coins} label="Costo prom. / usuario" value={money(k.avgCostPerUser)} />
        <Kpi icon={Gauge} label="Tokens prom. / solicitud" value={num(k.avgTokensPerRequest)} />
        <Kpi icon={Users} label="Usuarios activos IA" value={num(k.activeUsers)} />
        <Kpi icon={Crown} label="Usuarios premium" value={num(k.premiumUsers)} />
        <Kpi icon={UserPlus} label="Usuarios free" value={num(k.freeUsers)} />
        <Kpi icon={Sparkles} label="Función más usada" value={featLabel(k.mostUsedFeature)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold">Uso diario de IA (30 días)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.daily}>
              <defs>
                <linearGradient id="gu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} interval={4} stroke="hsl(var(--muted-foreground))" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Area type="monotone" dataKey="requests" stroke="hsl(var(--primary))" fill="url(#gu)" name="Solicitudes" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Uso por plan</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.planSplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {data.planSplit.map((_, i) => <Cell key={i} fill={CHART[i % CHART.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
            {data.planSplit.map((p, i) => (
              <span key={p.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: CHART[i % CHART.length] }} />
                {p.name}: {p.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Tendencia de costo (12 meses)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(m) => m.slice(2)} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => money2(v)} />
              <Line type="monotone" dataKey="cost" stroke="#22c55e" strokeWidth={2} dot={false} name="Costo" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Consumo de tokens (12 meses)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(m) => m.slice(2)} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="tokens" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Tokens" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Top funciones de IA</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.features.slice(0, 8).map((f) => ({ ...f, label: featLabel(f.feature) }))} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={130} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="requests" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} name="Solicitudes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Uso por país</h2>
          {data.byCountry.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">Sin datos.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.byCountry.slice(0, 8)} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="country" tick={{ fontSize: 11 }} width={110} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="requests" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Solicitudes" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return status === "success" ? (
    <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-3 w-3 text-green-500" /> Éxito</Badge>
  ) : (
    <Badge variant="secondary" className="gap-1"><XCircle className="h-3 w-3 text-destructive" /> Falló</Badge>
  );
}

function HistoryTab() {
  const fn = useServerFn(getAiRequestHistory);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [feature, setFeature] = useState("all");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const pageSize = 25;

  const params = useMemo(
    () => ({
      page, pageSize, search,
      feature: feature === "all" ? "" : feature,
      status: status === "all" ? "" : status,
      from: from ? new Date(from).toISOString() : "",
      to: to ? new Date(to + "T23:59:59").toISOString() : "",
    }),
    [page, search, feature, status, from, to],
  );

  const { data, isFetching } = useQuery({
    queryKey: ["ai-history", params],
    queryFn: () => fn({ data: params }),
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  function exportCsv() {
    downloadCsv(
      "historial-ia.csv",
      ["Fecha", "Usuario", "Email", "Función", "Modelo", "Tokens entrada", "Tokens salida", "Tokens total", "Costo", "Tiempo (ms)", "Estado"],
      rows.map((r) => [dt(r.created_at), r.name, r.email, featLabel(r.feature), r.model ?? "—", r.input_tokens, r.output_tokens, r.total_tokens, r.cost.toFixed(6), r.response_ms, r.status]),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar usuario, email o función…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <div className="w-44">
          <Select value={feature} onValueChange={(v) => { setFeature(v); setPage(0); }}>
            <SelectTrigger><SelectValue placeholder="Función" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las funciones</SelectItem>
              {Object.keys(FEATURE_LABELS).map((f) => <SelectItem key={f} value={f}>{featLabel(f)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-36">
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
            <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="success">Éxito</SelectItem>
              <SelectItem value="failed">Falló</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Desde</Label>
          <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Hasta</Label>
          <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }} />
        </div>
        <Button variant="outline" onClick={exportCsv}><Download className="mr-1 h-4 w-4" /> Exportar CSV</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha y hora</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Función</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead className="text-right">Entrada</TableHead>
              <TableHead className="text-right">Salida</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Costo</TableHead>
              <TableHead className="text-right">Tiempo</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching && rows.length === 0 ? (
              <TableRow><TableCell colSpan={10} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={10} className="py-10 text-center text-sm text-muted-foreground">Sin solicitudes.</TableCell></TableRow>
            ) : rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="whitespace-nowrap text-xs">{dt(r.created_at)}</TableCell>
                <TableCell>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </TableCell>
                <TableCell><Badge variant="outline">{featLabel(r.feature)}</Badge></TableCell>
                <TableCell className="text-xs">{r.model ?? "—"}</TableCell>
                <TableCell className="text-right tabular-nums">{num(r.input_tokens)}</TableCell>
                <TableCell className="text-right tabular-nums">{num(r.output_tokens)}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">{num(r.total_tokens)}</TableCell>
                <TableCell className="text-right tabular-nums">{money(r.cost)}</TableCell>
                <TableCell className="text-right tabular-nums">{r.response_ms} ms</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{num(total)} solicitudes</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
          <span>{page + 1} / {pages}</span>
          <Button variant="outline" size="sm" disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const fn = useServerFn(getAiUserUsage);
  const { data, isLoading } = useQuery({ queryKey: ["ai-user-usage"], queryFn: () => fn() });
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AiUserRow | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = data ?? [];
    if (!q) return list;
    return list.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
  }, [data, query]);

  function exportCsv() {
    downloadCsv(
      "uso-por-usuario.csv",
      ["Usuario", "Email", "Plan", "Registro", "Solicitudes", "Hoy", "Semana", "Mes", "Tokens entrada", "Tokens salida", "Tokens total", "Costo", "Última solicitud", "Función top", "Ilimitado", "Bloqueado"],
      rows.map((r) => [r.name, r.email, r.plan, dt(r.createdAt), r.totalRequests, r.today, r.week, r.month, r.inputTokens, r.outputTokens, r.totalTokens, r.cost.toFixed(6), dt(r.lastRequest), featLabel(r.topFeature), r.unlimited ? "Sí" : "No", r.disabled ? "Sí" : "No"]),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar usuario…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Button variant="outline" onClick={exportCsv}><Download className="mr-1 h-4 w-4" /> Exportar CSV</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Solicitudes</TableHead>
              <TableHead className="text-right">Mes</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead className="text-right">Costo</TableHead>
              <TableHead>Última</TableHead>
              <TableHead>Estado IA</TableHead>
              <TableHead className="text-right">Gestión</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={9} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">Sin usuarios.</TableCell></TableRow>
            ) : rows.map((r) => (
              <TableRow key={r.userId}>
                <TableCell>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={r.plan === "free" ? "outline" : "default"}>{r.plan}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{num(r.totalRequests)}</TableCell>
                <TableCell className="text-right tabular-nums">{num(r.month)}</TableCell>
                <TableCell className="text-right tabular-nums">{num(r.totalTokens)}</TableCell>
                <TableCell className="text-right tabular-nums">{money(r.cost)}</TableCell>
                <TableCell className="whitespace-nowrap text-xs">{dt(r.lastRequest)}</TableCell>
                <TableCell>
                  {r.disabled ? <Badge variant="destructive" className="gap-1"><Ban className="h-3 w-3" /> Bloqueado</Badge>
                    : r.unlimited ? <Badge className="gap-1"><InfinityIcon className="h-3 w-3" /> Ilimitado</Badge>
                    : <Badge variant="secondary">Activo</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setSelected(r)} title="Gestionar créditos">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selected && <CreditDialog user={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function CreditDialog({ user, onClose }: { user: AiUserRow; onClose: () => void }) {
  const qc = useQueryClient();
  const manage = useServerFn(manageAiCredit);
  const histFn = useServerFn(getUserCreditHistory);
  const [amount, setAmount] = useState("100");
  const [daily, setDaily] = useState(user.dailyLimit?.toString() ?? "");
  const [monthly, setMonthly] = useState(user.monthlyLimit?.toString() ?? "");
  const [lifetime, setLifetime] = useState(user.lifetimeLimit?.toString() ?? "");
  const [note, setNote] = useState("");

  const history = useQuery({
    queryKey: ["credit-history", user.userId],
    queryFn: () => histFn({ data: { userId: user.userId } }),
  });

  const mutation = useMutation({
    mutationFn: (vars: CreditVars) => manage({ data: vars }),
    onSuccess: () => {
      toast.success("Acción aplicada");
      qc.invalidateQueries({ queryKey: ["ai-user-usage"] });
      qc.invalidateQueries({ queryKey: ["ai-usage-overview"] });
      history.refetch();
    },
    onError: (e: any) => toast.error(e?.message ?? "Error"),
  });

  const run = (v: CreditVars) => mutation.mutate({ ...v, note });
  const amt = Number(amount) || 0;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gestión de IA — {user.name}</DialogTitle>
          <DialogDescription>{user.email} · {user.plan} · {num(user.totalRequests)} solicitudes · {money(user.cost)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-muted/30 p-3 text-center text-sm">
            <div><div className="text-xs text-muted-foreground">Créditos bonus</div><div className="font-semibold">{num(user.bonusCredits)}</div></div>
            <div><div className="text-xs text-muted-foreground">Tokens totales</div><div className="font-semibold">{num(user.totalTokens)}</div></div>
            <div><div className="text-xs text-muted-foreground">Costo</div><div className="font-semibold">{money(user.cost)}</div></div>
          </div>

          <div className="space-y-2">
            <Label>Créditos</Label>
            <div className="flex items-center gap-2">
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-32" />
              <Button size="sm" variant="outline" onClick={() => run({ userId: user.userId, action: "add_credits", amount: amt })}><Plus className="mr-1 h-4 w-4" /> Agregar</Button>
              <Button size="sm" variant="outline" onClick={() => run({ userId: user.userId, action: "remove_credits", amount: amt })}><Minus className="mr-1 h-4 w-4" /> Quitar</Button>
              <Button size="sm" variant="outline" onClick={() => run({ userId: user.userId, action: "bonus_credits", amount: amt })}><Sparkles className="mr-1 h-4 w-4" /> Bonus</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Límites de uso</Label>
            <div className="grid grid-cols-3 gap-2">
              <div><Label className="text-xs text-muted-foreground">Diario</Label><Input type="number" placeholder="∞" value={daily} onChange={(e) => setDaily(e.target.value)} /></div>
              <div><Label className="text-xs text-muted-foreground">Mensual</Label><Input type="number" placeholder="∞" value={monthly} onChange={(e) => setMonthly(e.target.value)} /></div>
              <div><Label className="text-xs text-muted-foreground">De por vida</Label><Input type="number" placeholder="∞" value={lifetime} onChange={(e) => setLifetime(e.target.value)} /></div>
            </div>
            <Button size="sm" variant="outline" onClick={() => run({
              userId: user.userId, action: "set_limits",
              dailyLimit: daily ? Number(daily) : null,
              monthlyLimit: monthly ? Number(monthly) : null,
              lifetimeLimit: lifetime ? Number(lifetime) : null,
            })}><Settings2 className="mr-1 h-4 w-4" /> Guardar límites</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {user.unlimited
              ? <Button size="sm" variant="outline" onClick={() => run({ userId: user.userId, action: "disable_unlimited" })}><InfinityIcon className="mr-1 h-4 w-4" /> Quitar ilimitado</Button>
              : <Button size="sm" variant="outline" onClick={() => run({ userId: user.userId, action: "enable_unlimited" })}><InfinityIcon className="mr-1 h-4 w-4" /> IA ilimitada</Button>}
            {user.disabled
              ? <Button size="sm" variant="outline" onClick={() => run({ userId: user.userId, action: "enable_access" })}><CheckCircle2 className="mr-1 h-4 w-4" /> Reactivar IA</Button>
              : <Button size="sm" variant="outline" onClick={() => run({ userId: user.userId, action: "disable_access" })}><Ban className="mr-1 h-4 w-4" /> Suspender IA</Button>}
            <Button size="sm" variant="outline" onClick={() => run({ userId: user.userId, action: "send_warning" })}><ShieldAlert className="mr-1 h-4 w-4" /> Enviar aviso</Button>
            <Button size="sm" variant="outline" className="text-destructive" onClick={() => { if (confirm("¿Reiniciar todo el uso de IA de este usuario?")) run({ userId: user.userId, action: "reset_usage" }); }}><RotateCcw className="mr-1 h-4 w-4" /> Reiniciar uso</Button>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Nota (opcional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Motivo de la acción…" />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium"><History className="h-4 w-4" /> Historial de créditos</div>
            <div className="max-h-40 space-y-1 overflow-auto rounded-xl border border-border p-2 text-xs">
              {history.isLoading ? <div className="py-4 text-center text-muted-foreground"><Loader2 className="mx-auto h-4 w-4 animate-spin" /></div>
                : (history.data ?? []).length === 0 ? <div className="py-4 text-center text-muted-foreground">Sin historial.</div>
                : (history.data ?? []).map((h: any) => (
                  <div key={h.id} className="flex items-center justify-between border-b border-border/50 py-1 last:border-0">
                    <span>{h.action}{h.amount != null ? ` (${h.amount})` : ""}{h.note ? ` — ${h.note}` : ""}</span>
                    <span className="text-muted-foreground">{dt(h.created_at)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FeaturesTab() {
  const { data, isLoading } = useOverview();
  if (isLoading)
    return <div className="flex justify-center py-24 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  const features = data?.features ?? [];

  function exportCsv() {
    downloadCsv(
      "uso-por-funcion.csv",
      ["Función", "Solicitudes", "Tokens", "Tokens prom.", "Costo", "Tasa de éxito", "Tiempo prom. (ms)"],
      features.map((f) => [featLabel(f.feature), f.requests, f.tokens, f.avgTokens, f.cost.toFixed(6), `${f.successRate.toFixed(1)}%`, f.avgMs]),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={exportCsv}><Download className="mr-1 h-4 w-4" /> Exportar CSV</Button>
      </div>
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Función</TableHead>
              <TableHead className="text-right">Solicitudes</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead className="text-right">Tokens prom.</TableHead>
              <TableHead className="text-right">Costo</TableHead>
              <TableHead className="text-right">Éxito</TableHead>
              <TableHead className="text-right">Tiempo prom.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">Sin datos de funciones aún.</TableCell></TableRow>
            ) : features.map((f) => (
              <TableRow key={f.feature}>
                <TableCell className="font-medium">{featLabel(f.feature)}</TableCell>
                <TableCell className="text-right tabular-nums">{num(f.requests)}</TableCell>
                <TableCell className="text-right tabular-nums">{num(f.tokens)}</TableCell>
                <TableCell className="text-right tabular-nums">{num(f.avgTokens)}</TableCell>
                <TableCell className="text-right tabular-nums">{money(f.cost)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  <Badge variant={f.successRate >= 95 ? "secondary" : "destructive"}>{f.successRate.toFixed(1)}%</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{f.avgMs} ms</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AlertsTab() {
  const { data, isLoading } = useOverview();
  if (isLoading)
    return <div className="flex justify-center py-24 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  const alerts = data?.alerts ?? [];

  if (alerts.length === 0)
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
        <p className="mt-2 text-sm text-muted-foreground">No hay alertas activas. Todo funciona con normalidad.</p>
      </div>
    );

  return (
    <div className="space-y-3">
      {alerts.map((a, i) => (
        <div key={i} className={`flex items-start gap-3 rounded-2xl border p-4 ${
          a.severity === "critical" ? "border-destructive/40 bg-destructive/5"
          : a.severity === "warning" ? "border-amber-500/40 bg-amber-500/5" : "border-border bg-card"}`}>
          <AlertTriangle className={`mt-0.5 h-5 w-5 ${a.severity === "critical" ? "text-destructive" : "text-amber-500"}`} />
          <div>
            <div className="text-sm font-medium">{a.message}</div>
            <div className="text-xs text-muted-foreground">{a.type}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
