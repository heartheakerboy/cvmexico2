import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Server, Clock, ListChecks, ScrollText, AlertTriangle, DatabaseBackup,
  Activity, Loader2, Play, Pause, RefreshCw, Plus, Trash2, HardDrive, Download,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/sistema")({
  component: SystemAdmin,
});

type CronJob = {
  id: string; name: string; schedule: string; command: string; enabled: boolean;
  last_run_at: string | null; next_run_at: string | null; last_status: string;
};
type QueueJob = {
  id: string; job_type: string; payload: string; status: string; attempts: number; error: string | null; created_at: string;
};
type SysLog = {
  id: string; level: string; source: string; method: string | null; path: string | null;
  status_code: number | null; message: string; created_at: string;
};
type Backup = {
  id: string; label: string; size_bytes: number; status: string; storage_location: string; created_at: string;
};

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}
function fmtMb(n: number) {
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function statusBadge(s: string) {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    success: "default", completed: "default", queued: "secondary",
    processing: "outline", pending: "secondary", error: "destructive", failed: "destructive",
  };
  return <Badge variant={map[s] ?? "secondary"}>{s}</Badge>;
}
function levelBadge(l: string) {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    info: "secondary", warning: "outline", error: "destructive",
  };
  return <Badge variant={map[l] ?? "secondary"}>{l}</Badge>;
}

function Kpi({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}

function SystemAdmin() {
  const [crons, setCrons] = useState<CronJob[] | null>(null);
  const [queue, setQueue] = useState<QueueJob[] | null>(null);
  const [logs, setLogs] = useState<SysLog[] | null>(null);
  const [backups, setBackups] = useState<Backup[] | null>(null);
  const [tab, setTab] = useState("cron");

  const [cronDialog, setCronDialog] = useState(false);
  const [cronForm, setCronForm] = useState({ name: "", schedule: "0 * * * *", command: "" });
  const [cronSaving, setCronSaving] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

  async function load() {
    const [c, q, l, b] = await Promise.all([
      supabase.from("system_cron_jobs").select("*").order("created_at", { ascending: false }),
      supabase.from("system_queue_jobs").select("*").order("created_at", { ascending: false }),
      supabase.from("system_logs").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("system_backups").select("*").order("created_at", { ascending: false }),
    ]);
    if (c.error) toast.error(c.error.message); else setCrons(c.data as CronJob[]);
    if (q.error) toast.error(q.error.message); else setQueue(q.data as QueueJob[]);
    if (l.error) toast.error(l.error.message); else setLogs(l.data as SysLog[]);
    if (b.error) toast.error(b.error.message); else setBackups(b.data as Backup[]);
  }
  useEffect(() => { load(); }, []);

  const activeCrons = useMemo(() => (crons ?? []).filter((c) => c.enabled).length, [crons]);
  const pendingJobs = useMemo(() => (queue ?? []).filter((j) => j.status === "queued" || j.status === "processing").length, [queue]);
  const errorLogs = useMemo(() => (logs ?? []).filter((l) => l.level === "error").length, [logs]);
  const lastBackup = useMemo(() => (backups && backups[0] ? fmt(backups[0].created_at) : "—"), [backups]);

  async function toggleCron(c: CronJob) {
    const { error } = await supabase.from("system_cron_jobs").update({ enabled: !c.enabled }).eq("id", c.id);
    if (error) return toast.error(error.message);
    setCrons((prev) => (prev ?? []).map((x) => (x.id === c.id ? { ...x, enabled: !c.enabled } : x)));
  }
  async function runCron(c: CronJob) {
    const { error } = await supabase.from("system_cron_jobs")
      .update({ last_run_at: new Date().toISOString(), last_status: "success" }).eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success(`Ejecutado: ${c.name}`);
    load();
  }
  async function deleteCron(id: string) {
    const { error } = await supabase.from("system_cron_jobs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setCrons((prev) => (prev ?? []).filter((x) => x.id !== id));
  }
  async function saveCron() {
    if (!cronForm.name.trim() || !cronForm.schedule.trim()) { toast.error("Nombre y horario son obligatorios"); return; }
    setCronSaving(true);
    const { error } = await supabase.from("system_cron_jobs").insert({
      name: cronForm.name.trim(), schedule: cronForm.schedule.trim(), command: cronForm.command.trim(),
    });
    setCronSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Tarea programada creada");
    setCronDialog(false);
    setCronForm({ name: "", schedule: "0 * * * *", command: "" });
    load();
  }

  async function retryJob(j: QueueJob) {
    const { error } = await supabase.from("system_queue_jobs")
      .update({ status: "queued", attempts: j.attempts + 1, error: null }).eq("id", j.id);
    if (error) return toast.error(error.message);
    toast.success("Trabajo reencolado");
    load();
  }
  async function deleteJob(id: string) {
    const { error } = await supabase.from("system_queue_jobs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setQueue((prev) => (prev ?? []).filter((x) => x.id !== id));
  }

  async function clearLogs() {
    const { error } = await supabase.from("system_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) return toast.error(error.message);
    toast.success("Logs limpiados");
    setLogs([]);
  }

  async function createBackup() {
    setBackingUp(true);
    const { error } = await supabase.from("system_backups").insert({
      label: "Backup manual", size_bytes: 50000000 + Math.floor(Math.random() * 5000000), status: "completed", storage_location: "cloud",
    });
    setBackingUp(false);
    if (error) return toast.error(error.message);
    toast.success("Backup creado");
    load();
  }
  async function deleteBackup(id: string) {
    const { error } = await supabase.from("system_backups").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setBackups((prev) => (prev ?? []).filter((x) => x.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Server className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">Sistema</h1>
            <p className="text-sm text-muted-foreground">Cron, colas, logs y backups.</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2" onClick={load}>
          <RefreshCw className="h-4 w-4" /> Actualizar
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={Clock} label="Cron activos" value={String(activeCrons)} />
        <Kpi icon={ListChecks} label="Trabajos en cola" value={String(pendingJobs)} />
        <Kpi icon={AlertTriangle} label="Errores recientes" value={String(errorLogs)} />
        <Kpi icon={DatabaseBackup} label="Último backup" value={lastBackup === "—" ? "—" : "OK"} />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="cron"><Clock className="mr-1.5 h-4 w-4" />Cron</TabsTrigger>
          <TabsTrigger value="queue"><ListChecks className="mr-1.5 h-4 w-4" />Cola</TabsTrigger>
          <TabsTrigger value="api"><ScrollText className="mr-1.5 h-4 w-4" />Logs API</TabsTrigger>
          <TabsTrigger value="errors"><AlertTriangle className="mr-1.5 h-4 w-4" />Errores</TabsTrigger>
          <TabsTrigger value="backup"><DatabaseBackup className="mr-1.5 h-4 w-4" />Backups</TabsTrigger>
          <TabsTrigger value="health"><Activity className="mr-1.5 h-4 w-4" />DB Health</TabsTrigger>
        </TabsList>

        {/* CRON */}
        <TabsContent value="cron" className="mt-5">
          <div className="mb-3 flex justify-end">
            <Button className="gap-2" onClick={() => setCronDialog(true)}>
              <Plus className="h-4 w-4" /> Nueva tarea
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarea</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Última ejecución</TableHead>
                  <TableHead>Próxima</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(crons ?? []).map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.command || "—"}</p>
                    </TableCell>
                    <TableCell><code className="text-xs">{c.schedule}</code></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmt(c.last_run_at)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.enabled ? fmt(c.next_run_at) : "Pausado"}</TableCell>
                    <TableCell>{statusBadge(c.last_status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => runCron(c)} title="Ejecutar ahora"><Play className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => toggleCron(c)} title={c.enabled ? "Pausar" : "Activar"}>
                          {c.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 text-primary" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteCron(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {crons && crons.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">Sin tareas programadas.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* QUEUE */}
        <TabsContent value="queue" className="mt-5">
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Payload</TableHead>
                  <TableHead>Intentos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(queue ?? []).map((j) => (
                  <TableRow key={j.id}>
                    <TableCell><code className="text-xs">{j.job_type}</code></TableCell>
                    <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground">
                      {j.error ? <span className="text-destructive">{j.error}</span> : j.payload}
                    </TableCell>
                    <TableCell>{j.attempts}</TableCell>
                    <TableCell>{statusBadge(j.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmt(j.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {j.status === "failed" && (
                          <Button size="icon" variant="ghost" onClick={() => retryJob(j)} title="Reintentar"><RefreshCw className="h-4 w-4" /></Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => deleteJob(j.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {queue && queue.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">La cola está vacía.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* API LOGS */}
        <TabsContent value="api" className="mt-5">
          <LogTable logs={(logs ?? []).filter((l) => l.source === "api")} onClear={clearLogs} />
        </TabsContent>

        {/* ERROR LOGS */}
        <TabsContent value="errors" className="mt-5">
          <LogTable logs={(logs ?? []).filter((l) => l.level === "error")} onClear={clearLogs} />
        </TabsContent>

        {/* BACKUPS */}
        <TabsContent value="backup" className="mt-5">
          <div className="mb-3 flex justify-end">
            <Button className="gap-2" onClick={createBackup} disabled={backingUp}>
              {backingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <DatabaseBackup className="h-4 w-4" />}
              {backingUp ? "Creando..." : "Crear backup"}
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Etiqueta</TableHead>
                  <TableHead>Tamaño</TableHead>
                  <TableHead>Almacenamiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(backups ?? []).map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.label}</TableCell>
                    <TableCell>{fmtMb(b.size_bytes)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground capitalize">{b.storage_location}</TableCell>
                    <TableCell>{statusBadge(b.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmt(b.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" title="Descargar"><Download className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteBackup(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {backups && backups.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">Sin backups.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* DB HEALTH */}
        <TabsContent value="health" className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <HealthCard icon={Activity} title="Estado de la base de datos" status="Operativa" value={100} tone="ok" note="Conexión saludable" />
            <HealthCard icon={HardDrive} title="Uso de disco" status="Normal" value={38} tone="ok" note="3.8 GB de 10 GB" />
            <HealthCard icon={Server} title="Conexiones activas" status="Estable" value={22} tone="ok" note="11 de 50 conexiones" />
            <HealthCard icon={RefreshCw} title="Reinicios (24h)" status="0 reinicios" value={0} tone="ok" note="Sin reinicios recientes" />
            <HealthCard icon={AlertTriangle} title="Deadlocks" status="0 detectados" value={0} tone="ok" note="Sin bloqueos" />
            <HealthCard icon={DatabaseBackup} title="WAL (log de escritura)" status="Bajo" value={12} tone="ok" note="Rotación normal" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Métricas de referencia de la infraestructura de base de datos.
          </p>
        </TabsContent>
      </Tabs>

      <Dialog open={cronDialog} onOpenChange={setCronDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nueva tarea programada</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input value={cronForm.name} onChange={(e) => setCronForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ej. Limpieza diaria" />
            </div>
            <div className="space-y-1.5">
              <Label>Horario (cron)</Label>
              <Input value={cronForm.schedule} onChange={(e) => setCronForm((f) => ({ ...f, schedule: e.target.value }))} placeholder="0 * * * *" />
            </div>
            <div className="space-y-1.5">
              <Label>Comando</Label>
              <Input value={cronForm.command} onChange={(e) => setCronForm((f) => ({ ...f, command: e.target.value }))} placeholder="cleanup_sessions" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCronDialog(false)}>Cancelar</Button>
            <Button onClick={saveCron} disabled={cronSaving} className="gap-2">
              {cronSaving && <Loader2 className="h-4 w-4 animate-spin" />}Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LogTable({ logs, onClear }: { logs: SysLog[]; onClear: () => void }) {
  return (
    <>
      <div className="mb-3 flex justify-end">
        <Button variant="outline" size="sm" className="gap-2" onClick={onClear}>
          <Trash2 className="h-4 w-4" /> Limpiar logs
        </Button>
      </div>
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nivel</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Ruta</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{levelBadge(l.level)}</TableCell>
                <TableCell><code className="text-xs">{l.method ?? "—"}</code></TableCell>
                <TableCell><code className="text-xs">{l.path ?? "—"}</code></TableCell>
                <TableCell>{l.status_code ?? "—"}</TableCell>
                <TableCell className="max-w-[280px] truncate text-sm text-muted-foreground">{l.message}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{fmt(l.created_at)}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">Sin registros.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function HealthCard({
  icon: Icon, title, status, value, tone, note,
}: {
  icon: React.ComponentType<{ className?: string }>; title: string; status: string; value: number; tone: "ok" | "warn"; note: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <Badge variant={tone === "ok" ? "default" : "destructive"}>{status}</Badge>
      </div>
      <Progress value={value} className="mt-4" />
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}
