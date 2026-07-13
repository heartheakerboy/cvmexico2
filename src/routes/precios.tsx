import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, CreditCard, Store, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";
import { getMetaTranslation } from "@/lib/i18n/config";

export const Route = createFileRoute("/precios")({
  head: () => ({
    meta: [
      { title: getMetaTranslation("pricing.metaTitle") },
      {
        name: "description",
        content: getMetaTranslation("pricing.metaDesc"),
      },
      { property: "og:title", content: getMetaTranslation("pricing.metaTitle") },
      { property: "og:url", content: "/precios" },
    ],
    links: [{ rel: "canonical", href: "/precios" }],
  }),
  component: PreciosPage,
});

const freeFeaturesKeys = [
  "pricing.features.free.0",
  "pricing.features.free.1",
  "pricing.features.free.2",
  "pricing.features.free.3",
  "pricing.features.free.4",
];

const proFeaturesKeys = [
  "pricing.features.pro.0",
  "pricing.features.pro.1",
  "pricing.features.pro.2",
  "pricing.features.pro.3",
  "pricing.features.pro.4",
  "pricing.features.pro.5",
  "pricing.features.pro.6",
];

function PreciosPage() {
  const [annual, setAnnual] = useState(true);
  const { t } = useSettings();
  const [monthlyPrice, setMonthlyPrice] = useState(139);
  const [annualPrice, setAnnualPrice] = useState(99);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const { data } = await supabase
          .from("plans")
          .select("*")
          .eq("active", true);
        if (data) {
          const proMonthly = data.find(
            (p) =>
              p.name.toLowerCase() === "pro" &&
              (p.interval.toLowerCase().includes("mensual") ||
                p.interval.toLowerCase().includes("month"))
          );
          const proAnnual = data.find(
            (p) =>
              p.name.toLowerCase() === "pro" &&
              (p.interval.toLowerCase().includes("anual") ||
                p.interval.toLowerCase().includes("year"))
          );

          if (proMonthly) {
            setMonthlyPrice(proMonthly.price);
            if (proAnnual) {
              const rate = proAnnual.price > 300 ? Math.round(proAnnual.price / 12) : proAnnual.price;
              setAnnualPrice(rate);
            } else {
              setAnnualPrice(Math.round(proMonthly.price * 0.7));
            }
          } else {
            const generalPro = data.find((p) => p.name.toLowerCase() === "pro");
            if (generalPro) {
              setMonthlyPrice(generalPro.price);
              setAnnualPrice(Math.round(generalPro.price * 0.7));
            }
          }
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    }
    fetchPlans();
  }, []);

  return (
    <PageShell
      title={t("pricing.title")}
      subtitle={t("pricing.subtitle")}
    >
      <div className="mb-10 flex items-center justify-center gap-3">
        <span className={annual ? "text-muted-foreground" : "font-semibold"}>{t("pricing.billingMonthly")}</span>
        <button
          onClick={() => setAnnual((v) => !v)}
          className="relative h-7 w-12 rounded-full bg-primary transition-colors"
          aria-label="Cambiar facturación"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
              annual ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className={annual ? "font-semibold" : "text-muted-foreground"}>
          {t("pricing.billingAnnual")} <Badge variant="secondary" className="ml-1">{t("pricing.billingSave")}</Badge>
        </span>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="rounded-3xl border border-border bg-card p-8">
          <h2 className="font-display text-xl font-bold">{t("pricing.freeTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("pricing.freeDesc")}</p>
          <div className="mt-6">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-muted-foreground"> MXN</span>
          </div>
          <Link to="/auth" className="mt-6 block">
            <Button variant="outline" className="w-full">
              {t("pricing.freeCta")}
            </Button>
          </Link>
          <ul className="mt-8 space-y-3">
            {freeFeaturesKeys.map((k) => (
              <li key={k} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t(k)}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="relative rounded-3xl border-2 border-primary bg-card p-8 shadow-lg">
          <Badge className="absolute -top-3 left-8 bg-accent text-accent-foreground">
            {t("pricing.proPopular")}
          </Badge>
          <h2 className="font-display text-xl font-bold">{t("pricing.proTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("pricing.proDesc")}</p>
           <div className="mt-6">
            <span className="text-4xl font-bold">${annual ? annualPrice : monthlyPrice}</span>
            <span className="text-muted-foreground">{t("pricing.billingSuffix")}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {annual
              ? t("pricing.billingAnnualFactured").replace(/\$[\d,]+(\.\d+)?\s*(MXN)?/g, `$${annualPrice * 12} MXN`)
              : t("pricing.billingMonthlyFactured")}
          </p>
          <Link to="/auth" className="mt-6 block">
            <Button className="w-full">{t("pricing.proCta")}</Button>
          </Link>
          <ul className="mt-8 space-y-3">
            {proFeaturesKeys.map((k) => (
              <li key={k} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t(k)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-4xl">
        <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
          {t("pricing.paymentMethodsTitle")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {[
            { icon: CreditCard, label: t("pricing.paymentMethodsCard") },
            { icon: Store, label: t("pricing.paymentMethodsOxxo") },
            { icon: Landmark, label: t("pricing.paymentMethodsSpei") },
          ].map((m) => (
            <div
              key={m.label}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"
            >
              <m.icon className="h-4 w-4 text-primary" /> {m.label}
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {t("pricing.paymentMethodsNotice")}
        </p>
      </div>
    </PageShell>
  );
}