import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CreditCard, Crown, Users, Ticket, Receipt, Plus, Trash2, Loader2,
  DollarSign, CheckCircle2, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useServerFn } from "@tanstack/react-start";
import {
  getAdminSubscriptionData, createAdminPlan, toggleAdminPlan, removeAdminPlan,
  createAdminCoupon, toggleAdminCoupon, removeAdminCoupon
} from "@/lib/subscriptions.functions";

export const Route = createFileRoute("/_authenticated/admin/suscripciones")({
  component: SubscriptionsAdmin,
});

type Coupon = { id: string; code: string; description: string | null; percent_off: number; active: boolean; created_at: string };
type Invoice = { id: string; number: string; concept: string; amount: number; currency: string; status: string; issued_at: string };
type Plan = { id: string; name: string; price: number; interval: string; features: string[]; active: boolean; sort_order: number };

const statusStyle: Record<string, string> = {
  pagado: "bg-emerald-500/10 text-emerald-600",
  pendiente: "bg-amber-500/10 text-amber-600",
  reembolsado: "bg-blue-500/10 text-blue-600",
  cancelado: "bg-rose-500/10 text-rose-600",
};

function mxn(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n) + " MXN";
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

function SubscriptionsAdmin() {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [proCount, setProCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [form, setForm] = useState({ code: "", description: "", percent_off: 20 });
  const [saving, setSaving] = useState(false);
  const [planDialog, setPlanDialog] = useState(false);
  const [planForm, setPlanForm] = useState({ name: "", price: 0, interval: "mensual", features: "" });
  const [savingPlan, setSavingPlan] = useState(false);

  const getSubData = useServerFn(getAdminSubscriptionData);
  const createPlanFn = useServerFn(createAdminPlan);
  const togglePlanFn = useServerFn(toggleAdminPlan);
  const removePlanFn = useServerFn(removeAdminPlan);
  const createCouponFn = useServerFn(createAdminCoupon);
  const toggleCouponFn = useServerFn(toggleAdminCoupon);
  const removeCouponFn = useServerFn(removeAdminCoupon);

  async function load() {
    try {
      const data = await getSubData();
      setCoupons(data.coupons as Coupon[]);
      setInvoices(data.invoices as Invoice[]);
      setPlans((data.plans ?? []).map((p: any) => ({ ...p, features: Array.isArray(p.features) ? p.features : [] })) as Plan[]);
      setTotalUsers(data.profiles.length);
      setProCount(data.profiles.filter((p: any) => (p.plan ?? "").toLowerCase() === "pro").length);
    } catch (err: any) {
      toast.error("Error loading data: " + err.message);
    }
  }

  useEffect(() => { load(); }, []);

  const revenue = useMemo(
    () => (invoices ?? []).filter((i) => i.status === "pagado").reduce((s, i) => s + Number(i.amount), 0),
    [invoices],
  );

  async function createPlan() {
    if (!planForm.name.trim()) return toast.error("Enter a plan name");
    setSavingPlan(true);
    const features = planForm.features.split("\n").map((f) => f.trim()).filter(Boolean);
    try {
      await createPlanFn({
        data: {
          name: planForm.name.trim(),
          price: Math.max(0, planForm.price),
          interval: planForm.interval,
          features,
          sort_order: (plans?.length ?? 0),
        }
      });
      setPlanForm({ name: "", price: 0, interval: "monthly", features: "" });
      setPlanDialog(false);
      toast.success("Plan created");
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingPlan(false);
    }
  }

  async function togglePlan(p: Plan) {
    try {
      await togglePlanFn({ data: { id: p.id, active: !p.active } });
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function removePlan(id: string) {
    try {
      await removePlanFn({ data: { id } });
      toast.success("Plan deleted");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function createCoupon() {
    if (!form.code.trim()) return toast.error("Enter a coupon code");
    setSaving(true);
    try {
      await createCouponFn({
        data: {
          code: form.code.trim().toUpperCase(),
          description: form.description.trim() || null,
          percent_off: Math.max(1, Math.min(100, form.percent_off)),
        }
      });
      setForm({ code: "", description: "", percent_off: 20 });
      toast.success("Coupon created");
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleCoupon(c: Coupon) {
    try {
      await toggleCouponFn({ data: { id: c.id, active: !c.active } });
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function removeCoupon(id: string) {
    try {
      await removeCouponFn({ data: { id } });
      toast.success("Coupon deleted");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const loading = coupons === null || invoices === null || plans === null;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CreditCard className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">Subscriptions</h1>
          <p className="text-sm text-muted-foreground">Plans, pricing, coupons and billing.</p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={Users} label="Total users" value={String(totalUsers)} />
            <Kpi icon={Crown} label="Pro subscribers" value={String(proCount)} />
            <Kpi icon={DollarSign} label="Revenue collected" value={mxn(revenue)} />
            <Kpi icon={Ticket} label="Active coupons" value={String(coupons!.filter((c) => c.active).length)} />
          </div>

          <Tabs defaultValue="plans">
            <TabsList>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="coupons">Coupons</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="mt-4">
              <div className="mb-4 flex justify-end">
                <Dialog open={planDialog} onOpenChange={setPlanDialog}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" />Add plan</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>New Plan</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Name</Label>
                        <Input value={planForm.name} onChange={(e) => setPlanForm((s) => ({ ...s, name: e.target.value }))} placeholder="Business" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Price (MXN)</Label>
                          <Input type="number" min={0} value={planForm.price} onChange={(e) => setPlanForm((s) => ({ ...s, price: Number(e.target.value) }))} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Interval</Label>
                          <Input value={planForm.interval} onChange={(e) => setPlanForm((s) => ({ ...s, interval: e.target.value }))} placeholder="monthly" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Features (one per line)</Label>
                        <Textarea rows={4} value={planForm.features} onChange={(e) => setPlanForm((s) => ({ ...s, features: e.target.value }))} placeholder={"Unlimited resumes\nPriority support"} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={createPlan} disabled={savingPlan}>
                        {savingPlan && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Plan
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plans!.length === 0 && (
                  <p className="text-sm text-muted-foreground">No plans yet. Add your first plan.</p>
                )}
                {plans!.map((p) => (
                  <div key={p.id} className={`relative rounded-2xl border p-5 ${p.active ? "border-border bg-card" : "border-dashed border-border bg-card/50 opacity-70"}`}>
                    <div className="flex items-start justify-between">
                      <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                      <div className="flex items-center gap-1">
                        <Switch checked={p.active} onCheckedChange={() => togglePlan(p)} />
                        <Button variant="ghost" size="icon" onClick={() => removePlan(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-1 font-display text-3xl font-bold">
                      {mxn(Number(p.price))}<span className="text-sm font-normal text-muted-foreground">/{p.interval}</span>
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="coupons" className="mt-4 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 font-display text-base font-semibold">New Coupon</h3>
                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Code</Label>
                    <Input value={form.code} onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))} placeholder="PROMO20" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs">Description</Label>
                    <Input value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} placeholder="20% off discount" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">% Discount</Label>
                    <Input type="number" min={1} max={100} value={form.percent_off} onChange={(e) => setForm((s) => ({ ...s, percent_off: Number(e.target.value) }))} />
                  </div>
                </div>
                <Button className="mt-4" onClick={createCoupon} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Create Coupon
                </Button>
              </div>

              <div className="rounded-2xl border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons!.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No coupons yet</TableCell></TableRow>
                    )}
                    {coupons!.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono font-medium">{c.code}</TableCell>
                        <TableCell className="text-muted-foreground">{c.description ?? "—"}</TableCell>
                        <TableCell>{c.percent_off}%</TableCell>
                        <TableCell><Switch checked={c.active} onCheckedChange={() => toggleCoupon(c)} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => removeCoupon(c.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="mt-4">
              <div className="rounded-2xl border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Number</TableHead>
                      <TableHead>Concept</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices!.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No invoices yet</TableCell></TableRow>
                    )}
                    {invoices!.map((i) => (
                      <TableRow key={i.id}>
                        <TableCell className="font-mono">{i.number}</TableCell>
                        <TableCell>{i.concept}</TableCell>
                        <TableCell>{mxn(Number(i.amount))}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[i.status] ?? "bg-muted text-muted-foreground"}`}>
                            {i.status === "pagado" ? <CheckCircle2 className="h-3 w-3" /> : i.status === "cancelado" ? <XCircle className="h-3 w-3" /> : <Receipt className="h-3 w-3" />}
                            {i.status === "pagado" ? "Paid" : i.status === "pendiente" ? "Pending" : i.status === "cancelado" ? "Cancelled" : i.status === "reembolsado" ? "Refunded" : i.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{new Date(i.issued_at).toLocaleDateString("en-US")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
