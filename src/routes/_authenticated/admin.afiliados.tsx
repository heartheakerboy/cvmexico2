import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Trash2, Pencil, Loader2, Users, DollarSign,
  MousePointerClick, Wallet, Trophy, Check,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export const Route = createFileRoute("/_authenticated/admin/afiliados")({
  component: AffiliatesAdmin,
});

type Affiliate = {
  id: string; name: string; email: string; code: string; status: string;
  commission_rate: number; clicks: number; signups: number; total_earned: number; notes: string;
};
type Referral = {
  id: string; affiliate_id: string; referred_email: string; converted: boolean; order_amount: number;
};
type Commission = {
  id: string; affiliate_id: string; amount: number; status: string; source: string;
};
type Payout = {
  id: string; affiliate_id: string; amount: number; method: string; status: string; reference: string;
};

const emptyAff = { name: "", email: "", code: "", status: "pending", commission_rate: "20", notes: "" };
type AffForm = typeof emptyAff;
const emptyPayout = { affiliate_id: "", amount: "", method: "paypal", status: "requested", reference: "" };
type PayoutForm = typeof emptyPayout;

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
    active: "default", paid: "default", approved: "default",
    pending: "secondary", requested: "secondary", processing: "outline",
    suspended: "destructive", rejected: "destructive", failed: "destructive",
  };
  return <Badge variant={map[s] ?? "secondary"}>{s}</Badge>;
}

function AffiliatesAdmin() {
  const [affs, setAffs] = useState<Affiliate[] | null>(null);
  const [refs, setRefs] = useState<Referral[] | null>(null);
  const [comms, setComms] = useState<Commission[] | null>(null);
  const [payouts, setPayouts] = useState<Payout[] | null>(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const [aDialog, setADialog] = useState(false);
  const [aEditId, setAEditId] = useState<string | null>(null);
  const [aForm, setAForm] = useState<AffForm>(emptyAff);

  const [pDialog, setPDialog] = useState(false);
  const [pForm, setPForm] = useState<PayoutForm>(emptyPayout);

  async function load() {
    const [a, r, c, p] = await Promise.all([
      supabase.from("affiliates").select("*").order("created_at", { ascending: false }),
      supabase.from("affiliate_referrals").select("*").order("created_at", { ascending: false }),
      supabase.from("affiliate_commissions").select("*").order("created_at", { ascending: false }),
      supabase.from("affiliate_payouts").select("*").order("created_at", { ascending: false }),
    ]);
    if (a.error) toast.error(a.error.message); else setAffs(a.data as Affiliate[]);
    if (r.error) toast.error(r.error.message); else setRefs(r.data as Referral[]);
    if (c.error) toast.error(c.error.message); else setComms(c.data as Commission[]);
    if (p.error) toast.error(p.error.message); else setPayouts(p.data as Payout[]);
  }
  useEffect(() => { load(); }, []);

  const affName = (id: string) => (affs ?? []).find((a) => a.id === id)?.name ?? "—";

  const activeAffs = useMemo(() => (affs ?? []).filter((a) => a.status === "active").length, [affs]);
  const totalClicks = useMemo(() => (affs ?? []).reduce((s, a) => s + a.clicks, 0), [affs]);
  const pendingComm = useMemo(
    () => (comms ?? []).filter((c) => c.status === "pending" || c.status === "approved").reduce((s, c) => s + Number(c.amount), 0),
    [comms],
  );
  const paidOut = useMemo(
    () => (payouts ?? []).filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0),
    [payouts],
  );
  const leaderboard = useMemo(
    () => [...(affs ?? [])].sort((a, b) => b.total_earned - a.total_earned).slice(0, 10),
    [affs],
  );

  // Affiliate CRUD
  function openNewA() { setAEditId(null); setAForm(emptyAff); setADialog(true); }
  function openEditA(a: Affiliate) {
    setAEditId(a.id);
    setAForm({ name: a.name, email: a.email, code: a.code, status: a.status, commission_rate: String(a.commission_rate), notes: a.notes });
    setADialog(true);
  }
  async function saveA() {
    if (!aForm.name.trim() || !aForm.code.trim()) { toast.error("Nombre y código son obligatorios"); return; }
    setSaving(true);
    const payload = {
      name: aForm.name.trim(), email: aForm.email.trim(), code: aForm.code.trim().toUpperCase(),
      status: aForm.status, commission_rate: aForm.commission_rate ? Number(aForm.commission_rate) : 0, notes: aForm.notes,
    };
    const res = aEditId
      ? await supabase.from("affiliates").update(payload).eq("id", aEditId)
      : await supabase.from("affiliates").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(aEditId ? "Afiliado actualizado" : "Afiliado creado");
    setADialog(false); load();
  }
  async function removeA(id: string) {
    if (!confirm("¿Eliminar este afiliado y sus registros?")) return;
    const { error } = await supabase.from("affiliates").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    load();
  }

  // Commission actions
  async function setCommStatus(c: Commission, status: string) {
    const { error } = await supabase.from("affiliate_commissions").update({ status }).eq("id", c.id);
    if (error) { toast.error(error.message); return; }
    setComms((r) => (r ?? []).map((x) => x.id === c.id ? { ...x, status } : x));
  }

  // Payout CRUD
  function openNewP() { setPForm({ ...emptyPayout, affiliate_id: (affs ?? [])[0]?.id ?? "" }); setPDialog(true); }
  async function saveP() {
    if (!pForm.affiliate_id) { toast.error("Selecciona un afiliado"); return; }
    setSaving(true);
    const payload = {
      affiliate_id: pForm.affiliate_id, amount: pForm.amount ? Number(pForm.amount) : 0,
      method: pForm.method, status: pForm.status, reference: pForm.reference.trim(),
    };
    const { error } = await supabase.from("affiliate_payouts").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Pago registrado");
    setPDialog(false); load();
  }
  async function setPayoutStatus(p: Payout, status: string) {
    const { error } = await supabase.from("affiliate_payouts").update({ status }).eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    setPayouts((r) => (r ?? []).map((x) => x.id === p.id ? { ...x, status } : x));
  }
  async function removeP(id: string) {
    if (!confirm("¿Eliminar este pago?")) return;
    const { error } = await supabase.from("affiliate_payouts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setPayouts((r) => (r ?? []).filter((x) => x.id !== id));
  }

  const q = query.trim().toLowerCase();
  const fAffs = (affs ?? []).filter((a) => !q || a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q) || a.email.toLowerCase().includes(q));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Sistema de afiliados</h1>
        <p className="text-sm text-muted-foreground">Comisiones, referidos y pagos.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={Users} label="Afiliados activos" value={activeAffs.toString()} />
        <Kpi icon={MousePointerClick} label="Clics totales" value={totalClicks.toLocaleString()} />
        <Kpi icon={DollarSign} label="Comisión pendiente" value={`$${pendingComm.toLocaleString()}`} />
        <Kpi icon={Wallet} label="Pagado" value={`$${paidOut.toLocaleString()}`} />
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="affiliates">Afiliados</TabsTrigger>
          <TabsTrigger value="commissions">Comisiones</TabsTrigger>
          <TabsTrigger value="payouts">Pagos</TabsTrigger>
          <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3 text-sm font-medium">Referidos recientes</div>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Afiliado</TableHead><TableHead>Email referido</TableHead>
                <TableHead>Convertido</TableHead><TableHead>Importe</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {refs === null ? (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : refs.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">Sin referidos</TableCell></TableRow>
                ) : refs.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{affName(r.affiliate_id)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.referred_email}</TableCell>
                    <TableCell>{r.converted ? <Badge>Sí</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                    <TableCell className="text-sm">${Number(r.order_amount).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Affiliates */}
        <TabsContent value="affiliates" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Button onClick={openNewA}><Plus className="mr-1 h-4 w-4" /> Nuevo afiliado</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Afiliado</TableHead><TableHead>Código</TableHead><TableHead>Comisión</TableHead>
                <TableHead>Clics/Registros</TableHead><TableHead>Ganado</TableHead>
                <TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {affs === null ? (
                  <TableRow><TableCell colSpan={7} className="py-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : fAffs.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Sin afiliados</TableCell></TableRow>
                ) : fAffs.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.email}</div>
                    </TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.code}</code></TableCell>
                    <TableCell className="text-sm">{a.commission_rate}%</TableCell>
                    <TableCell className="text-sm">{a.clicks} / {a.signups}</TableCell>
                    <TableCell className="text-sm">${Number(a.total_earned).toLocaleString()}</TableCell>
                    <TableCell>{statusBadge(a.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditA(a)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeA(a.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Commissions */}
        <TabsContent value="commissions" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Afiliado</TableHead><TableHead>Fuente</TableHead>
                <TableHead>Importe</TableHead><TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {comms === null ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : comms.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Sin comisiones</TableCell></TableRow>
                ) : comms.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{affName(c.affiliate_id)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.source || "—"}</TableCell>
                    <TableCell className="text-sm">${Number(c.amount).toLocaleString()}</TableCell>
                    <TableCell>{statusBadge(c.status)}</TableCell>
                    <TableCell className="text-right">
                      {c.status !== "approved" && c.status !== "paid" && (
                        <Button variant="ghost" size="sm" onClick={() => setCommStatus(c, "approved")}>Aprobar</Button>
                      )}
                      {c.status === "approved" && (
                        <Button variant="ghost" size="sm" onClick={() => setCommStatus(c, "paid")}><Check className="mr-1 h-4 w-4" />Pagar</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Payouts */}
        <TabsContent value="payouts" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openNewP}><Plus className="mr-1 h-4 w-4" /> Registrar pago</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Afiliado</TableHead><TableHead>Método</TableHead>
                <TableHead>Importe</TableHead><TableHead>Referencia</TableHead>
                <TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {payouts === null ? (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : payouts.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Sin pagos</TableCell></TableRow>
                ) : payouts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{affName(p.affiliate_id)}</TableCell>
                    <TableCell className="text-sm capitalize">{p.method}</TableCell>
                    <TableCell className="text-sm">${Number(p.amount).toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.reference || "—"}</TableCell>
                    <TableCell>{statusBadge(p.status)}</TableCell>
                    <TableCell className="text-right">
                      {p.status !== "paid" && (
                        <Button variant="ghost" size="sm" onClick={() => setPayoutStatus(p, "paid")}><Check className="mr-1 h-4 w-4" />Marcar pagado</Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => removeP(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="w-12">#</TableHead><TableHead>Afiliado</TableHead>
                <TableHead>Registros</TableHead><TableHead>Ganado</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {affs === null ? (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : leaderboard.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">Sin datos</TableCell></TableRow>
                ) : leaderboard.map((a, i) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      {i < 3 ? <Trophy className={`h-4 w-4 ${i === 0 ? "text-yellow-500" : i === 1 ? "text-zinc-400" : "text-amber-700"}`} /> : <span className="text-sm text-muted-foreground">{i + 1}</span>}
                    </TableCell>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell className="text-sm">{a.signups}</TableCell>
                    <TableCell className="text-sm">${Number(a.total_earned).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Affiliate dialog */}
      <Dialog open={aDialog} onOpenChange={setADialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{aEditId ? "Editar afiliado" : "Nuevo afiliado"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Nombre</Label>
                <Input value={aForm.name} onChange={(e) => setAForm({ ...aForm, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label>
                <Input value={aForm.email} onChange={(e) => setAForm({ ...aForm, email: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Código</Label>
                <Input value={aForm.code} onChange={(e) => setAForm({ ...aForm, code: e.target.value })} /></div>
              <div className="space-y-2"><Label>Comisión (%)</Label>
                <Input type="number" value={aForm.commission_rate} onChange={(e) => setAForm({ ...aForm, commission_rate: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Estado</Label>
              <Select value={aForm.status} onValueChange={(v) => setAForm({ ...aForm, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="suspended">Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Notas</Label>
              <Textarea rows={2} value={aForm.notes} onChange={(e) => setAForm({ ...aForm, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setADialog(false)}>Cancelar</Button>
            <Button onClick={saveA} disabled={saving}>{saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payout dialog */}
      <Dialog open={pDialog} onOpenChange={setPDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Registrar pago</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Afiliado</Label>
              <Select value={pForm.affiliate_id} onValueChange={(v) => setPForm({ ...pForm, affiliate_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecciona…" /></SelectTrigger>
                <SelectContent>
                  {(affs ?? []).map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Importe</Label>
                <Input type="number" value={pForm.amount} onChange={(e) => setPForm({ ...pForm, amount: e.target.value })} /></div>
              <div className="space-y-2"><Label>Método</Label>
                <Select value={pForm.method} onValueChange={(v) => setPForm({ ...pForm, method: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="transfer">Transferencia</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Estado</Label>
                <Select value={pForm.status} onValueChange={(v) => setPForm({ ...pForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requested">Solicitado</SelectItem>
                    <SelectItem value="processing">Procesando</SelectItem>
                    <SelectItem value="paid">Pagado</SelectItem>
                    <SelectItem value="failed">Fallido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Referencia</Label>
                <Input value={pForm.reference} onChange={(e) => setPForm({ ...pForm, reference: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPDialog(false)}>Cancelar</Button>
            <Button onClick={saveP} disabled={saving}>{saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
