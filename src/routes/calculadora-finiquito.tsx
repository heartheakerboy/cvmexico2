import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calculator, Info } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateFiniquito, formatMXN } from "@/lib/nomina";

const TITLE = "Calculadora de Finiquito y Liquidación 2026 México | CVAI";
const DESC =
  "Calcula tu finiquito por renuncia voluntaria o tu liquidación por despido injustificado en México: aguinaldo proporcional, vacaciones, prima vacacional, prima de antigüedad e indemnización según la LFT.";

export const Route = createFileRoute("/calculadora-finiquito")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.cvai.com.mx/calculadora-finiquito" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/calculadora-finiquito" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FiniquitoPage,
});

const FAQS = [
  {
    q: "¿Qué diferencia hay entre finiquito y liquidación?",
    a: "El finiquito es lo que te corresponde al terminar cualquier relación laboral: salarios pendientes, aguinaldo proporcional, vacaciones no tomadas y su prima. La liquidación (indemnización) se suma solo cuando hay despido injustificado: 3 meses de salario, 20 días por año trabajado y prima de antigüedad.",
  },
  {
    q: "Si renuncio, ¿me toca prima de antigüedad?",
    a: "Solo si tienes 15 años o más de antigüedad (Artículo 162 de la LFT). En caso de despido, la prima de antigüedad se paga a cualquier antigüedad. Se calcula a 12 días por año con tope de dos salarios mínimos diarios.",
  },
  {
    q: "¿El finiquito paga impuestos?",
    a: "Sí, una parte puede estar gravada por ISR, aunque existen exenciones: por ejemplo, la prima vacacional y el aguinaldo tienen montos exentos anuales, y la indemnización por separación tiene una exención de 90 UMA por año de servicio. Esta calculadora muestra montos brutos estimados antes de ISR.",
  },
  {
    q: "¿Cuánto tiempo tiene mi patrón para pagarme el finiquito?",
    a: "La ley no fija un plazo exacto, pero debe pagarse al concluir la relación laboral. Si no te pagan o no estás de acuerdo con el cálculo, puedes acudir al Centro de Conciliación Laboral de tu estado; tienes hasta un año para reclamar.",
  },
];

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 ${
        strong ? "border-t border-border pt-4 text-base font-bold" : "border-b border-border/50 text-sm"
      }`}
    >
      <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5"
      />
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function FiniquitoPage() {
  const [salary, setSalary] = useState("18000");
  const [years, setYears] = useState("2");
  const [daysYear, setDaysYear] = useState("180");
  const [unpaid, setUnpaid] = useState("5");
  const [reason, setReason] = useState<"renuncia" | "despido">("renuncia");

  const result = useMemo(() => {
    const monthlyGross = parseFloat(salary.replace(/[^0-9.]/g, "")) || 0;
    if (monthlyGross <= 0) return null;
    return calculateFiniquito({
      monthlyGross,
      yearsWorked: parseFloat(years) || 0,
      daysCurrentYear: parseFloat(daysYear) || 0,
      unpaidDays: parseFloat(unpaid) || 0,
      reason,
    });
  }, [salary, years, daysYear, unpaid, reason]);

  return (
    <PageShell
      title="Calculadora de finiquito y liquidación"
      subtitle="Calcula lo que te corresponde al salir de un empleo en México: renuncia voluntaria (finiquito) o despido injustificado (finiquito + liquidación), según la Ley Federal del Trabajo."
    >
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Tus datos</h2>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={reason === "renuncia" ? "default" : "outline"}
              onClick={() => setReason("renuncia")}
              className="w-full"
            >
              Renuncia
            </Button>
            <Button
              type="button"
              variant={reason === "despido" ? "default" : "outline"}
              onClick={() => setReason("despido")}
              className="w-full"
            >
              Despido
            </Button>
          </div>

          <div className="space-y-4">
            <Field id="sueldo" label="Sueldo mensual bruto ($)" value={salary} onChange={setSalary} />
            <Field id="anios" label="Años completos trabajados" value={years} onChange={setYears} />
            <Field
              id="diasanio"
              label="Días transcurridos del año en curso"
              value={daysYear}
              onChange={setDaysYear}
              hint="Del 1 de enero a tu último día. Medio año ≈ 180 días."
            />
            <Field
              id="pendientes"
              label="Días trabajados pendientes de pago"
              value={unpaid}
              onChange={setUnpaid}
              hint="Días del último periodo que aún no te pagan."
            />
          </div>

          <div className="mt-6 flex gap-2 rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0" />
            <p>
              Montos brutos estimados antes de ISR, con prestaciones mínimas de ley (aguinaldo de 15
              días, prima vacacional del 25%). Tu finiquito real puede variar por prestaciones
              superiores o adeudos.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-3">
          <h2 className="font-semibold">
            {reason === "renuncia" ? "Tu finiquito estimado" : "Tu finiquito + liquidación estimada"}
          </h2>
          {result ? (
            <div className="mt-3">
              <Row label="Salarios pendientes de pago" value={formatMXN(result.salariosDevengados)} />
              <Row label="Aguinaldo proporcional" value={formatMXN(result.aguinaldoProporcional)} />
              <Row
                label={`Vacaciones proporcionales (${result.vacationDaysEntitlement} días/año)`}
                value={formatMXN(result.vacacionesProporcionales)}
              />
              <Row label="Prima vacacional (25%)" value={formatMXN(result.primaVacacional)} />
              <Row label="Subtotal finiquito" value={formatMXN(result.subtotalFiniquito)} strong />
              {reason === "despido" && (
                <>
                  <Row label="Indemnización: 3 meses de salario" value={formatMXN(result.indemnizacion3Meses)} />
                  <Row label="Indemnización: 20 días por año" value={formatMXN(result.indemnizacion20Dias)} />
                </>
              )}
              {result.primaAntiguedad > 0 && (
                <Row label="Prima de antigüedad (12 días/año)" value={formatMXN(result.primaAntiguedad)} />
              )}
              {(reason === "despido" || result.primaAntiguedad > 0) && (
                <Row label="Subtotal liquidación" value={formatMXN(result.subtotalLiquidacion)} strong />
              )}
              <div className="mt-4 rounded-xl bg-primary/10 p-4">
                <Row label="TOTAL ESTIMADO A RECIBIR" value={formatMXN(result.total)} strong />
              </div>
              <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
                <p className="font-medium">¿Siguiente paso: un nuevo empleo?</p>
                <p className="mt-1 text-muted-foreground">
                  Actualiza tu currículum con los logros de este empleo y postúlate con ventaja:
                  plantillas ATS y verificador gratuitos.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to="/plantillas">
                    <Button size="sm">Actualizar mi CV</Button>
                  </Link>
                  <Link to="/ats-checker">
                    <Button size="sm" variant="outline">
                      Verificar mi CV (ATS)
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Escribe tu sueldo para ver el cálculo.
            </p>
          )}
        </div>
      </div>

      <section className="mt-14 max-w-3xl space-y-5 text-[15px] leading-relaxed text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">¿Qué incluye un finiquito en México?</h2>
        <p>
          Al terminar una relación laboral, tu patrón debe pagarte las partes proporcionales de tus
          prestaciones: los días trabajados aún no pagados, el{" "}
          <strong className="text-foreground">aguinaldo proporcional</strong> (15 días por año), las{" "}
          <strong className="text-foreground">vacaciones no tomadas</strong> según tu antigüedad
          (desde 12 días el primer año, conforme a la reforma de Vacaciones Dignas) y la{" "}
          <strong className="text-foreground">prima vacacional</strong> del 25%.
        </p>
        <p>
          Si el despido es injustificado, se suma la indemnización constitucional:{" "}
          <strong className="text-foreground">3 meses de salario</strong> más{" "}
          <strong className="text-foreground">20 días por cada año trabajado</strong>, además de la
          prima de antigüedad. Nunca firmes tu finiquito sin revisar el cálculo: si el monto no
          coincide, puedes negarte a firmar y acudir a conciliación.
        </p>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-bold">Preguntas frecuentes</h2>
        <div className="mt-5 space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
