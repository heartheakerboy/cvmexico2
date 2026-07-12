import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  HardDrive, FileCode, Users, Trash2, RefreshCw, Loader2, Coins,
  TrendingUp, Download, Eye, ShieldAlert, Check, Search, Calendar,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";
import { getAdminStorageAnalytics, cleanupStorage, deleteFile } from "@/lib/storage.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/almacenamiento")({
  component: StorageAdminPage,
});

function humanSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

function StorageAdminPage() {
  const queryClient = useQueryClient();
  const fetchAnalytics = useServerFn(getAdminStorageAnalytics);
  const triggerCleanup = useServerFn(cleanupStorage);
  const triggerDelete = useServerFn(deleteFile);

  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-storage-analytics"],
    queryFn: () => fetchAnalytics(),
  });

  const cleanupMutation = useMutation({
    mutationFn: () => triggerCleanup(),
    onSuccess: (res) => {
      toast.success(`Limpieza completada. Se eliminaron ${res.cleanedCount} archivos temporales.`);
      queryClient.invalidateQueries({ queryKey: ["admin-storage-analytics"] });
    },
    onError: (err: any) => {
      toast.error("Error al ejecutar limpieza: " + err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (path: string) => triggerDelete({ data: { storagePath: path } }),
    onSuccess: () => {
      toast.success("Archivo eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["admin-storage-analytics"] });
    },
    onError: (err: any) => {
      toast.error("Error al eliminar archivo: " + err.message);
    },
  });

  // Filtered files logic
  const filteredUploads = data
    ? data.recentUploads.filter(
        (f) =>
          f.file_name.toLowerCase().includes(search.toLowerCase()) ||
          f.storage_path.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HardDrive className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">Storage Management</h1>
            <p className="text-sm text-muted-foreground">Monitor Cloudflare R2 usage, analytics, and costs.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => cleanupMutation.mutate()}
            disabled={cleanupMutation.isPending}
          >
            {cleanupMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Limpieza automática
          </Button>
          <Button variant="outline" size="icon" onClick={() => refetch()} title="Recargar">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : error || !data ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No se pudieron cargar las métricas de almacenamiento.
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi
              icon={HardDrive}
              label="Almacenamiento total"
              value={humanSize(data.totalBytes)}
              sub={`${data.activeFilesCount} archivos activos`}
            />
            <Kpi
              icon={Coins}
              label="Costo mensual estimado"
              value={`$${data.costEstimate.toFixed(3)} USD`}
              sub="Tarifas Cloudflare R2 ($0.015/GB)"
            />
            <Kpi
              icon={ShieldAlert}
              label="Errores de carga"
              value={String(data.failedFilesCount)}
              sub="Intentos fallidos / cancelados"
            />
            <Kpi
              icon={Users}
              label="Usuarios con almacenamiento"
              value={String(data.storagePerUser.length)}
              sub="Cuentas activas utilizando R2"
            />
          </div>

          {/* Charts Section */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Storage Growth chart */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h2 className="font-display text-base font-semibold">Crecimiento de Almacenamiento (Últimos 30 días)</h2>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data.growth}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v) => humanSize(v)}
                  />
                  <Tooltip formatter={(value: any) => [humanSize(Number(value)), "Tamaño"]} />
                  <Area type="monotone" dataKey="bytes" stroke="hsl(var(--primary))" fill="url(#growthGrad)" name="Almacenamiento" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Storage per File Type */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <FileCode className="h-4 w-4 text-primary" />
                <h2 className="font-display text-base font-semibold">Uso de Almacenamiento por Tipo de Archivo</h2>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.storagePerType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="type" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v) => humanSize(v)}
                  />
                  <Tooltip formatter={(value: any) => [humanSize(Number(value)), "Uso"]} />
                  <Bar dataKey="size" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Tamaño" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Files List & Management */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-semibold">Archivos recientes</h2>
                <p className="text-xs text-muted-foreground">Listado de las cargas realizadas a Cloudflare R2.</p>
              </div>
              <div className="relative w-full max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar archivo por nombre..."
                  className="pl-9"
                />
              </div>
            </div>

            {filteredUploads.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No se encontraron archivos cargados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-muted-foreground">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground/80">
                      <th className="py-3 px-4 font-semibold">Nombre</th>
                      <th className="py-3 px-4 font-semibold">Ruta</th>
                      <th className="py-3 px-4 font-semibold">Tipo</th>
                      <th className="py-3 px-4 font-semibold">Tamaño</th>
                      <th className="py-3 px-4 font-semibold">Fecha</th>
                      <th className="py-3 px-4 font-semibold text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUploads.map((f) => (
                      <tr key={f.id} className="border-b border-border/60 hover:bg-muted/20">
                        <td className="py-3 px-4 font-medium text-foreground truncate max-w-[200px]" title={f.file_name}>
                          {f.file_name}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono truncate max-w-[220px]" title={f.storage_path}>
                          {f.storage_path}
                        </td>
                        <td className="py-3 px-4 text-xs">{f.file_type}</td>
                        <td className="py-3 px-4 text-xs">{humanSize(f.file_size)}</td>
                        <td className="py-3 px-4 text-xs">
                          {new Date(f.created_at).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              if (confirm(`¿Estás seguro de eliminar permanentemente ${f.file_name}?`)) {
                                deleteMutation.mutate(f.storage_path);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Largest Files Panel */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-base font-semibold">Archivos de mayor tamaño</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground/80">
                    <th className="py-3 px-4 font-semibold">Nombre</th>
                    <th className="py-3 px-4 font-semibold">Usuario (Propietario)</th>
                    <th className="py-3 px-4 font-semibold">Tipo</th>
                    <th className="py-3 px-4 font-semibold">Tamaño</th>
                    <th className="py-3 px-4 font-semibold">Fecha de carga</th>
                  </tr>
                </thead>
                <tbody>
                  {data.largestFiles.map((f) => (
                    <tr key={f.id} className="border-b border-border/60 hover:bg-muted/20">
                      <td className="py-3 px-4 font-medium text-foreground truncate max-w-[200px]" title={f.file_name}>
                        {f.file_name}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono">{f.owner_id || "Sistema"}</td>
                      <td className="py-3 px-4 text-xs">{f.file_type}</td>
                      <td className="py-3 px-4 text-xs font-bold text-foreground">{humanSize(f.file_size)}</td>
                      <td className="py-3 px-4 text-xs">
                        {new Date(f.created_at).toLocaleDateString("es-MX")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
