import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CreditCard, Loader2, Check, Save, Crown, ArrowUpRight, XCircle,
  Receipt, Ticket, FileText, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/panel/cuenta")({
  component: CuentaPage,
});

type Plan = "free" | "pro";
type DbPlan = { id: string; name: string; price: number; interval: string; features: string[]; active: boolean; sort_order: number };
type Invoice = {
  id: string; number: string; concept: string; amount: number; currency: string;
  status: "pagado" | "pendiente" | "fallido" | "reembolsado"; method: string | null;
  period: string | null; issued_at: string;
};
type Billing = {
  legal_name: string; tax_id: string; company: string; email: string;
  address: string; city: string; country: string;
};

const emptyBilling: Billing = {
  legal_name: "", tax_id: "", company: "", email: "", address: "", city: "", country: "México",
};

function mxnPrice(price: number, interval: string) {
  return `$${price.toLocaleString("es-MX")} MXN / ${interval}`;
}

const statusStyle: Record<Invoice["status"], string> = {
  pagado: "text-emerald-600 bg-emerald-500/10",
  pendiente: "text-amber-600 bg-amber-500/10",
  fallido: "text-red-600 bg-red-500/10",
  reembolsado: "text-muted-foreground bg-muted",
};

function CuentaPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plan>("free");
  const [dbPlans, setDbPlans] = useState<DbPlan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billing, setBilling] = useState<Billing>(emptyBilling);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [applying, setApplying] = useState(false);
  const [discount, setDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  async function load() {
    const { data: userRes } = await supabase.auth.getUser();
    const id = userRes.user?.id ?? null;
    setUid(id);
    if (!id) return setLoading(false);
    const [{ data: prof }, { data: inv }, { data: bill }, { data: redeem }, { data: plans }] = await Promise.all([
      supabase.from("profiles").select("plan").eq("id", id).maybeSingle(),
      supabase.from("invoices").select("*").order("issued_at", { ascending: false }),
      supabase.from("billing_details").select("*").eq("user_id", id).maybeSingle(),
      supabase.from("coupon_redemptions").select("coupons(code, percent_off)").order("created_at", { ascending: false }).limit(1),
      supabase.from("plans").select("*").eq("active", true).order("sort_order"),
    ]);
    if (prof) setPlan((prof.plan as Plan) ?? "free");
    setInvoices((inv as Invoice[]) ?? []);
    if (plans) setDbPlans(plans.map((p: any) => ({ ...p, features: Array.isArray(p.features) ? p.features : [] })) as DbPlan[]);
    if (bill) setBilling({
      legal_name: bill.legal_name ?? "", tax_id: bill.tax_id ?? "", company: bill.company ?? "",
      email: bill.email ?? userRes.user?.email ?? "", address: bill.address ?? "",
      city: bill.city ?? "", country: bill.country ?? "México",
    });
    else setBilling((b) => ({ ...b, email: userRes.user?.email ?? "" }));
    const r = (redeem as { coupons: { code: string; percent_off: number } | null }[] | null)?.[0]?.coupons;
    if (r) setDiscount({ code: r.code, percent: r.percent_off });
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function changePlan(next: Plan) {
    if (!uid) return;
    if (next === "pro") {
      const baseCheckoutUrl = import.meta.env.VITE_LEMONSQUEEZY_CHECKOUT_URL || "https://curriculum-vitae-ai.lemonsqueezy.com/checkout/buy/1902372";
      const emailParam = billing.email ? `&checkout[email]=${encodeURIComponent(billing.email)}` : "";
      const checkoutUrl = `${baseCheckoutUrl}?checkout[custom][user_id]=${uid}${emailParam}`;
      
      toast.loading("Redirigiendo al pago seguro...");
      window.location.href = checkoutUrl;
      return;
    }

    const { error } = await supabase.from("profiles").update({ plan: next }).eq("id", uid);
    if (error) return toast.error("No se pudo actualizar el plan");
    setPlan(next);
    setUpgradeOpen(false); setCancelOpen(false);
    toast.success("Plan cancelado. Ahora estás en Free.");
  }

  async function saveBilling() {
    if (!uid) return;
    setSaving(true);
    const { error } = await supabase.from("billing_details").upsert({
      user_id: uid, ...billing,
    }, { onConflict: "user_id" });
    setSaving(false);
    if (error) return toast.error("No se pudieron guardar los datos");
    toast.success("Datos de facturación guardados");
  }

  async function applyCoupon() {
    if (!uid || !coupon.trim()) return;
    setApplying(true);
    const { data: c } = await supabase.from("coupons").select("id, code, percent_off")
      .eq("code", coupon.trim().toUpperCase()).eq("active", true).maybeSingle();
    if (!c) { setApplying(false); return toast.error("Cupón inválido o expirado"); }
    const { error } = await supabase.from("coupon_redemptions").insert({ user_id: uid, coupon_id: c.id });
    setApplying(false);
    if (error && !error.message.includes("duplicate")) return toast.error("No se pudo aplicar el cupón");
    setDiscount({ code: c.code, percent: c.percent_off });
    setCoupon("");
    toast.success(`Cupón ${c.code} aplicado: ${c.percent_off}% de descuento`);
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const bf = (k: keyof Billing, label: string) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input value={billing[k]} onChange={(e) => setBilling((b) => ({ ...b, [k]: e.target.value }))} />
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CreditCard className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">Suscripción y facturación</h1>
          <p className="text-sm text-muted-foreground">Gestiona tu plan y tus pagos.</p>
        </div>
      </div>

      {/* Suscripción actual */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${plan === "pro" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {plan === "pro" ? <Crown className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Plan actual</p>
              <p className="font-display text-xl font-bold">{plan === "pro" ? "Pro" : "Free"}</p>
              {discount && <p className="text-xs text-emerald-600">Cupón {discount.code} · {discount.percent}% de descuento</p>}
            </div>
          </div>
          <div className="flex gap-2">
            {plan === "free" ? (
              <Button onClick={() => setUpgradeOpen(true)}><ArrowUpRight className="h-4 w-4" /> Mejorar plan</Button>
            ) : (
              <Button variant="outline" onClick={() => setCancelOpen(true)}><XCircle className="h-4 w-4" /> Cancelar plan</Button>
            )}
          </div>
        </div>
      </div>

      {/* Planes */}
      <div className="grid gap-4 md:grid-cols-2">
        {dbPlans.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-2">Cargando planes...</p>
        )}
        {dbPlans.map((p) => {
          const planKey = p.name.toLowerCase() as Plan;
          const active = planKey === plan;
          return (
            <div key={p.id} className={`rounded-2xl border p-5 ${active ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">{p.name}</h3>
                {active && <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Activo</span>}
              </div>
              <p className="mt-1 text-2xl font-bold">{mxnPrice(p.price, p.interval)}</p>
              <ul className="mt-4 space-y-2">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="h-4 w-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              {!active && planKey === "pro" && (
                <Button className="mt-5 w-full" onClick={() => setUpgradeOpen(true)}>Mejorar a Pro</Button>
              )}
              {!active && planKey === "free" && (
                <Button variant="outline" className="mt-5 w-full" onClick={() => setCancelOpen(true)}>Cambiar a Free</Button>
              )}
            </div>
          );
        })}
      </div>


      {/* Cupones */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold"><Ticket className="h-4 w-4" /> Cupones</h2>
        <div className="mt-4 flex gap-2">
          <Input value={coupon} placeholder="Ingresa tu código (ej. PRO50)" onChange={(e) => setCoupon(e.target.value)} />
          <Button variant="outline" onClick={applyCoupon} disabled={applying}>
            {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aplicar"}
          </Button>
        </div>
        {discount && <p className="mt-2 text-sm text-emerald-600">Cupón activo: {discount.code} ({discount.percent}% off)</p>}
      </div>

      {/* Facturación */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold"><FileText className="h-4 w-4" /> Datos de facturación</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {bf("legal_name", "Nombre / Razón social")}
          {bf("tax_id", "RFC")}
          {bf("company", "Empresa")}
          {bf("email", "Correo de facturación")}
          {bf("address", "Dirección")}
          {bf("city", "Ciudad")}
          {bf("country", "País")}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={saveBilling} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar
          </Button>
        </div>
      </div>

      {/* Facturas / Historial de pagos */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold"><Receipt className="h-4 w-4" /> Facturas e historial de pagos</h2>
        {invoices.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Aún no tienes facturas ni pagos registrados.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{inv.concept} · {inv.number}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(inv.issued_at).toLocaleDateString("es-MX")}
                    {inv.method ? ` · ${inv.method}` : ""}{inv.period ? ` · ${inv.period}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">${inv.amount.toFixed(2)} {inv.currency}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyle[inv.status]}`}>{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade dialog */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mejorar a Pro</DialogTitle>
            <DialogDescription>
              Desbloquea CV ilimitados con IA, simulador de entrevistas y todas las herramientas.
              {discount ? ` Se aplicará tu cupón ${discount.code} (${discount.percent}% off).` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeOpen(false)}>Cancelar</Button>
            <Button onClick={() => changePlan("pro")}><Crown className="h-4 w-4" /> Confirmar Pro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar plan Pro</DialogTitle>
            <DialogDescription>Volverás al plan Free y perderás las funciones premium. ¿Deseas continuar?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Conservar Pro</Button>
            <Button variant="destructive" onClick={() => changePlan("free")}>Sí, cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
