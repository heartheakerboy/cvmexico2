import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calculator, Info } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMXN, grossFromNet, netFromGross } from "@/lib/nomina";

const TITLE = "Calculadora de Sueldo Neto 2026: Bruto a Neto México | CVAI";
const DESC =
  "Calcula tu sueldo neto mensual en México: descuenta ISR (tarifa Art. 96) y cuotas IMSS de tu sueldo bruto, o calcula el bruto que necesitas para el neto que quieres ganar.";

export const Route = createFileRoute("/calculadora-sueldo-neto")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.cvai.com.mx/calculadora-sueldo-neto" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/calculadora-sueldo-neto" }],
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
  component: SueldoNetoPage,
});

const FAQS = [
  {
    q: "¿Cuál es la diferencia entre sueldo bruto y sueldo neto?",
    a: "El sueldo bruto es el monto total pactado antes de retenciones. El sueldo neto es lo que realmente recibes en tu cuenta después de descontar el ISR y las cuotas obreras del IMSS.",
  },
  {
    q: "¿Cuánto me quitan de ISR en México?",
    a: "Depende de tu ingreso: el ISR es progresivo y va de 1.92% a 35% según la tarifa mensual del Artículo 96 de la LISR. A mayor sueldo, mayor tasa marginal sobre el excedente.",
  },
  {
    q: "¿Qué es el SBC y por qué importa?",
    a: "El Salario Base de Cotización es el salario diario con el que tu patrón te registra ante el IMSS. Incluye el factor de integración: la parte proporcional de aguinaldo y prima vacacional. Con ese monto se calculan tus cuotas y tus futuras pensiones.",
  },
  {
    q: "¿Por qué al negociar un empleo debo preguntar si el sueldo es bruto o neto?",
    a: "Porque la diferencia puede superar el 20% de tu ingreso real. Una oferta de $20,000 brutos equivale aproximadamente a $16,900 netos; si el monto era neto, el bruto tendría que ser mayor.",
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

function SueldoNetoPage() {
  const [mode, setMode] = useState<"bruto" | "neto">("bruto");
  const [amount, setAmount] = useState("20000");
  const [years, setYears] = useState(1);

  const result = useMemo(() => {
    const value = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
    if (value <= 0) return null;
    return mode === "bruto" ? netFromGross(value, years) : grossFromNet(value, years);
  }, [mode, amount, years]);

  return (
    <PageShell
      title="Calculadora de sueldo neto"
      subtitle="Descubre cuánto recibirás realmente de tu sueldo en México después de ISR e IMSS, o cuánto bruto pedir para ganar el neto que quieres."
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
              variant={mode === "bruto" ? "default" : "outline"}
              onClick={() => setMode("bruto")}
              className="w-full"
            >
              Bruto → Neto
            </Button>
            <Button
              type="button"
              variant={mode === "neto" ? "default" : "outline"}
              onClick={() => setMode("neto")}
              className="w-full"
            >
              Neto → Bruto
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="monto">
                {mode === "bruto" ? "Sueldo mensual bruto ($)" : "Sueldo neto que quieres recibir ($)"}
              </Label>
              <Input
                id="monto"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="20000"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="antiguedad">Años de antigüedad</Label>
              <select
                id="antiguedad"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value, 10))}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((y) => (
                  <option key={y} value={y}>
                    {y} año{y > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                La antigüedad cambia tus días de vacaciones y con ello el factor de integración del IMSS.
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-2 rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0" />
            <p>
              Estimación con prestaciones mínimas de ley (aguinaldo de 15 días y prima vacacional
              del 25%). No incluye subsidio al empleo, créditos Infonavit ni bonos.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-3">
          <h2 className="font-semibold">Resultado mensual</h2>
          {result ? (
            <div className="mt-3">
              <Row label="Sueldo bruto mensual" value={formatMXN(result.gross)} />
              <Row label="Retención de ISR" value={`− ${formatMXN(result.isr)}`} />
              <Row label="Cuotas IMSS (obreras)" value={`− ${formatMXN(result.imss)}`} />
              <Row label="Total de deducciones" value={formatMXN(result.isr + result.imss)} />
              <Row label="Sueldo neto a recibir" value={formatMXN(result.net)} strong />
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-secondary/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Deducción efectiva</p>
                  <p className="mt-1 font-bold">{result.effectiveRate.toFixed(1)}%</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">SBC diario (IMSS)</p>
                  <p className="mt-1 font-bold">{formatMXN(result.sbcDaily)}</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Factor de integración</p>
                  <p className="mt-1 font-bold">{result.factor.toFixed(4)}</p>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
                <p className="font-medium">¿Estás negociando sueldo en una entrevista?</p>
                <p className="mt-1 text-muted-foreground">
                  Llega preparado: crea un CV optimizado para ATS y practica con el simulador de
                  entrevistas de CVAI.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to="/plantillas">
                    <Button size="sm">Crear mi CV gratis</Button>
                  </Link>
                  <Link to="/simulador-entrevista">
                    <Button size="sm" variant="outline">
                      Practicar entrevista
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Escribe un monto válido para ver el cálculo.
            </p>
          )}
        </div>
      </div>

      <section className="prose-like mt-14 max-w-3xl space-y-5 text-[15px] leading-relaxed text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">¿Cómo se calcula el sueldo neto en México?</h2>
        <p>
          Tu patrón está obligado a retener dos conceptos antes de pagarte. El primero es el{" "}
          <strong className="text-foreground">ISR</strong>, calculado con la tarifa progresiva del
          Artículo 96 de la Ley del Impuesto sobre la Renta: el impuesto se aplica por rangos, con
          tasas de 1.92% hasta 35%. El segundo son las{" "}
          <strong className="text-foreground">cuotas obreras del IMSS</strong>, que se calculan
          sobre tu Salario Base de Cotización (SBC) e incluyen enfermedades y maternidad, invalidez
          y vida, y cesantía y vejez.
        </p>
        <p>
          El SBC es tu salario diario multiplicado por el factor de integración, que suma la parte
          proporcional de tu aguinaldo (15 días) y de tu prima vacacional (25% de tus días de
          vacaciones). Por eso dos personas con el mismo sueldo bruto pero distinta antigüedad
          pueden tener deducciones ligeramente diferentes.
        </p>
        <h2 className="text-2xl font-bold text-foreground">Usa esta calculadora al cambiar de empleo</h2>
        <p>
          El momento más común para comparar sueldos es al recibir una oferta de trabajo. Pregunta
          siempre si el monto ofrecido es bruto o neto: una oferta de $20,000 brutos mensuales
          equivale, con un año de antigüedad, a unos $16,900 netos aproximados. Comparar ofertas en
          términos netos es la única forma justa de decidir.
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
