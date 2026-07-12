import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Trash2, Loader2, Pencil, Mail, Send, FileText,
  Server, CheckCircle2, XCircle, Megaphone,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/emails")({
  component: EmailsAdmin,
});

type Template = {
  id: string; name: string; slug: string; type: string;
  subject: string; body: string; active: boolean;
};
type Broadcast = {
  id: string; subject: string; body: string; audience: string;
  status: string; scheduled_at: string | null; recipients_count: number; sent_count: number;
};
type EmailLog = {
  id: string; recipient: string; template: string | null;
  subject: string | null; status: string; error: string | null; created_at: string;
};

const emptyTemplate = { name: "", slug: "", type: "transactional", subject: "", body: "", active: true };
type TemplateForm = typeof emptyTemplate;
const emptyBroadcast = { subject: "", body: "", audience: "all", scheduled_at: "" };
type BroadcastForm = typeof emptyBroadcast;

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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

function statusBadge(s: string) {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    sent: "default", delivered: "default", draft: "secondary",
    scheduled: "outline", bounced: "destructive", failed: "destructive",
  };
  return <Badge variant={map[s] ?? "secondary"}>{s}</Badge>;
}

function EmailsAdmin() {
  const [templates, setTemplates] = useState<Template[] | null>(null);
  const [broadcasts, setBroadcasts] = useState<Broadcast[] | null>(null);
  const [logs, setLogs] = useState<EmailLog[] | null>(null);
  const [query, setQuery] = useState("");

  const [tplDialog, setTplDialog] = useState(false);
  const [tplEditId, setTplEditId] = useState<string | null>(null);
  const [tplForm, setTplForm] = useState<TemplateForm>(emptyTemplate);

  const [bcDialog, setBcDialog] = useState(false);
  const [bcEditId, setBcEditId] = useState<string | null>(null);
  const [bcForm, setBcForm] = useState<BroadcastForm>(emptyBroadcast);

  const [saving, setSaving] = useState(false);

  async function load() {
    const [t, b, l] = await Promise.all([
      supabase.from("email_templates").select("*").order("name"),
      supabase.from("email_broadcasts").select("*").order("created_at", { ascending: false }),
      supabase.from("email_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    if (t.error) toast.error(t.error.message); else setTemplates(t.data as Template[]);
    if (b.error) toast.error(b.error.message); else setBroadcasts(b.data as Broadcast[]);
    if (l.error) toast.error(l.error.message); else setLogs(l.data as EmailLog[]);
  }
  useEffect(() => { load(); }, []);

  const filteredTpl = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates ?? [];
    return (templates ?? []).filter((t) => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
  }, [templates, query]);

  const deliverability = useMemo(() => {
    const l = logs ?? [];
    if (!l.length) return 100;
    const ok = l.filter((x) => x.status === "sent" || x.status === "delivered").length;
    return Math.round((ok / l.length) * 100);
  }, [logs]);

  // Template CRUD
  function openNewTpl() { setTplEditId(null); setTplForm(emptyTemplate); setTplDialog(true); }
  function openEditTpl(t: Template) {
    setTplEditId(t.id);
    setTplForm({ name: t.name, slug: t.slug, type: t.type, subject: t.subject, body: t.body, active: t.active });
    setTplDialog(true);
  }
  async function saveTpl() {
    if (!tplForm.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    setSaving(true);
    const payload = {
      name: tplForm.name.trim(), slug: tplForm.slug.trim() || slugify(tplForm.name),
      type: tplForm.type, subject: tplForm.subject, body: tplForm.body, active: tplForm.active,
    };
    const res = tplEditId
      ? await supabase.from("email_templates").update(payload).eq("id", tplEditId)
      : await supabase.from("email_templates").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(tplEditId ? "Plantilla actualizada" : "Plantilla creada");
    setTplDialog(false); load();
  }
  async function removeTpl(id: string) {
    if (!confirm("¿Eliminar esta plantilla?")) return;
    const { error } = await supabase.from("email_templates").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Plantilla eliminada");
    setTemplates((r) => (r ?? []).filter((x) => x.id !== id));
  }
  async function toggleTpl(t: Template) {
    const { error } = await supabase.from("email_templates").update({ active: !t.active }).eq("id", t.id);
    if (error) { toast.error(error.message); return; }
    setTemplates((r) => (r ?? []).map((x) => x.id === t.id ? { ...x, active: !x.active } : x));
  }

  // Broadcast CRUD
  function openNewBc() { setBcEditId(null); setBcForm(emptyBroadcast); setBcDialog(true); }
  function openEditBc(b: Broadcast) {
    setBcEditId(b.id);
    setBcForm({
      subject: b.subject, body: b.body, audience: b.audience,
      scheduled_at: b.scheduled_at ? b.scheduled_at.slice(0, 16) : "",
    });
    setBcDialog(true);
  }
  async function saveBc() {
    if (!bcForm.subject.trim()) { toast.error("El asunto es obligatorio"); return; }
    setSaving(true);
    const payload = {
      subject: bcForm.subject.trim(), body: bcForm.body, audience: bcForm.audience,
      scheduled_at: bcForm.scheduled_at ? new Date(bcForm.scheduled_at).toISOString() : null,
      status: bcForm.scheduled_at ? "scheduled" : "draft",
    };
    const res = bcEditId
      ? await supabase.from("email_broadcasts").update(payload).eq("id", bcEditId)
      : await supabase.from("email_broadcasts").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(bcEditId ? "Campaña actualizada" : "Campaña creada");
    setBcDialog(false); load();
  }
  async function removeBc(id: string) {
    if (!confirm("¿Eliminar esta campaña?")) return;
    const { error } = await supabase.from("email_broadcasts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Campaña eliminada");
    setBroadcasts((r) => (r ?? []).filter((x) => x.id !== id));
  }
  async function markSent(b: Broadcast) {
    if (!confirm("¿Marcar esta campaña como enviada?")) return;
    const { error } = await supabase.from("email_broadcasts")
      .update({ status: "sent", sent_count: b.recipients_count }).eq("id", b.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Campaña enviada");
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Email management</h1>
        <p className="text-sm text-muted-foreground">SMTP, plantillas y campañas.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={FileText} label="Plantillas" value={(templates?.length ?? 0).toString()} />
        <Kpi icon={Megaphone} label="Campañas" value={(broadcasts?.length ?? 0).toString()} />
        <Kpi icon={Send} label="Emails enviados" value={(logs ?? []).filter((l) => l.status === "sent" || l.status === "delivered").length.toString()} />
        <Kpi icon={CheckCircle2} label="Entregabilidad" value={`${deliverability}%`} />
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="broadcasts">Campañas</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="smtp">SMTP</TabsTrigger>
        </TabsList>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar plantilla…" value={query}
                onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Button onClick={openNewTpl}><Plus className="mr-1 h-4 w-4" /> Nueva plantilla</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plantilla</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Activa</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates === null ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
                ) : filteredTpl.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">Sin plantillas.</TableCell></TableRow>
                ) : filteredTpl.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.slug}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{t.type}</Badge></TableCell>
                    <TableCell className="max-w-[240px] truncate">{t.subject}</TableCell>
                    <TableCell><Switch checked={t.active} onCheckedChange={() => toggleTpl(t)} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditTpl(t)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeTpl(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Broadcasts */}
        <TabsContent value="broadcasts" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openNewBc}><Plus className="mr-1 h-4 w-4" /> Nueva campaña</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Audiencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Enviados</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {broadcasts === null ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
                ) : broadcasts.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">Sin campañas.</TableCell></TableRow>
                ) : broadcasts.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="max-w-[240px] truncate font-medium">{b.subject}</TableCell>
                    <TableCell><Badge variant="secondary">{b.audience}</Badge></TableCell>
                    <TableCell>{statusBadge(b.status)}</TableCell>
                    <TableCell>{b.sent_count.toLocaleString()}{b.recipients_count ? ` / ${b.recipients_count.toLocaleString()}` : ""}</TableCell>
                    <TableCell className="text-right">
                      {b.status !== "sent" && (
                        <Button variant="ghost" size="icon" onClick={() => markSent(b)} title="Enviar"><Send className="h-4 w-4" /></Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => openEditBc(b)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeBc(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Logs */}
        <TabsContent value="logs" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destinatario</TableHead>
                  <TableHead>Plantilla</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs === null ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
                ) : logs.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">Sin registros.</TableCell></TableRow>
                ) : logs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.recipient}</TableCell>
                    <TableCell>{l.template ?? "—"}</TableCell>
                    <TableCell className="max-w-[220px] truncate">{l.subject ?? "—"}</TableCell>
                    <TableCell>
                      {l.status === "bounced" || l.status === "failed"
                        ? <span className="flex items-center gap-1 text-destructive text-sm"><XCircle className="h-4 w-4" /> {l.status}</span>
                        : statusBadge(l.status)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{new Date(l.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* SMTP */}
        <TabsContent value="smtp" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Server className="h-4 w-4" />
              <span className="text-sm font-medium">Configuración de envío</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Los correos se envían a través de la infraestructura de correo integrada de la aplicación.
              La entregabilidad actual es del <span className="font-semibold text-foreground">{deliverability}%</span> según los últimos registros.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground">Proveedor</div>
                <div className="font-medium">Servicio Integrado</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground">Cifrado</div>
                <div className="font-medium">TLS</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground">Estado</div>
                <div className="font-medium flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-600" /> Activo</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Template dialog */}
      <Dialog open={tplDialog} onOpenChange={setTplDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{tplEditId ? "Editar plantilla" : "Nueva plantilla"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input value={tplForm.name}
                onChange={(e) => setTplForm((f) => ({ ...f, name: e.target.value, slug: tplEditId ? f.slug : slugify(e.target.value) }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input value={tplForm.slug} onChange={(e) => setTplForm((f) => ({ ...f, slug: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select value={tplForm.type} onValueChange={(v) => setTplForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transactional">Transaccional</SelectItem>
                    <SelectItem value="welcome">Bienvenida</SelectItem>
                    <SelectItem value="verification">Verificación</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Asunto</Label>
              <Input value={tplForm.subject} onChange={(e) => setTplForm((f) => ({ ...f, subject: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Cuerpo</Label>
              <Textarea rows={6} value={tplForm.body} onChange={(e) => setTplForm((f) => ({ ...f, body: e.target.value }))} />
              <p className="text-xs text-muted-foreground">Usa {"{{variables}}"} como {"{{name}}"} o {"{{link}}"}.</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label>Activa</Label>
              <Switch checked={tplForm.active} onCheckedChange={(v) => setTplForm((f) => ({ ...f, active: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTplDialog(false)}>Cancelar</Button>
            <Button onClick={saveTpl} disabled={saving}>{saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Broadcast dialog */}
      <Dialog open={bcDialog} onOpenChange={setBcDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{bcEditId ? "Editar campaña" : "Nueva campaña"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Asunto</Label>
              <Input value={bcForm.subject} onChange={(e) => setBcForm((f) => ({ ...f, subject: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Cuerpo</Label>
              <Textarea rows={6} value={bcForm.body} onChange={(e) => setBcForm((f) => ({ ...f, body: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Audiencia</Label>
                <Select value={bcForm.audience} onValueChange={(v) => setBcForm((f) => ({ ...f, audience: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="free">Gratuitos</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Programar (opcional)</Label>
                <Input type="datetime-local" value={bcForm.scheduled_at}
                  onChange={(e) => setBcForm((f) => ({ ...f, scheduled_at: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBcDialog(false)}>Cancelar</Button>
            <Button onClick={saveBc} disabled={saving}>{saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
