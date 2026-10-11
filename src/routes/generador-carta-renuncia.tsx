import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Copy, Mail, Printer } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const TITLE = "Generador de Carta de Renuncia Gratis con Ejemplos | CVAI";
const DESC =
  "Crea tu carta de renuncia laboral en minutos: formulario simple, ejemplos profesionales para México, listo para copiar, imprimir o enviar. Sin registro.";

export const Route = createFileRoute("/generador-carta-renuncia")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.cvai.com.mx/generador-carta-renuncia" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/generador-carta-renuncia" }],
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
  component: CartaRenunciaPage,
});

const FAQS = [
  {
    q: "¿Con cuánta anticipación debo presentar mi renuncia en México?",
    a: "La Ley Federal del Trabajo no exige un plazo mínimo para renunciar. Por cortesía profesional y para no afectar tu finiquito ni tus referencias, lo habitual es avisar con 15 días de anticipación.",
  },
  {
    q: "¿Qué debe incluir una carta de renuncia?",
    a: "Ciudad y fecha, destinatario, tu nombre y puesto, el aviso claro de renuncia con tu último día laboral, un agradecimiento breve y tu firma. Nada más: debe ser corta, formal y sin quejas.",
  },
  {
    q: "¿Debo explicar el motivo de mi renuncia?",
    a: "No es obligatorio. Si quieres mencionarlo, hazlo en términos positivos (una nueva oportunidad, estudios, motivos personales). Nunca incluyas reclamos o conflictos: la carta queda en tu expediente.",
  },
  {
    q: "¿La carta de renuncia afecta mi finiquito?",
    a: "No. Renuncies con o sin carta, te corresponde finiquito: salarios pendientes, aguinaldo y vacaciones proporcionales y prima vacacional. Solo pierdes la indemnización por despido, porque la salida es voluntaria.",
  },
];

const MOTIVOS: Record<string, string> = {
  ninguno: "",
  oportunidad:
    "Esta decisión obedece a una nueva oportunidad profesional que me permitirá seguir creciendo en mi área.",
  crecimiento:
    "Esta decisión responde a mi búsqueda de nuevos retos y crecimiento profesional en otra etapa de mi carrera.",
  estudios:
    "Esta decisión se debe a que continuaré con mis estudios, lo que requiere de mi tiempo completo.",
  personales:
    "Esta decisión obedece a motivos personales que requieren mi atención en este momento.",
  mudanza:
    "Esta decisión se debe a un cambio de residencia que me impedirá continuar desempeñando mis funciones.",
};

function formatFecha(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5"
      />
    </div>
  );
}

function CartaRenunciaPage() {
  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [fechaCarta, setFechaCarta] = useState(() => new Date().toISOString().slice(0, 10));
  const [ultimoDia, setUltimoDia] = useState("");
  const [motivo, setMotivo] = useState("ninguno");
  const [copied, setCopied] = useState(false);

  const carta = useMemo(() => {
    const lines: string[] = [];
    lines.push(`${ciudad || "[Ciudad]"}, a ${formatFecha(fechaCarta) || "[fecha]"}.`);
    lines.push("");
    if (destinatario) lines.push(destinatario);
    if (empresa) lines.push(empresa);
    lines.push("Presente.");
    lines.push("");
    lines.push(
      `Por medio de la presente, yo, ${nombre || "[tu nombre]"}, quien me desempeño como ${
        puesto || "[tu puesto]"
      }${empresa ? ` en ${empresa}` : ""}, presento mi renuncia voluntaria e irrevocable al puesto que ocupo${
        ultimoDia ? `, siendo mi último día laboral el ${formatFecha(ultimoDia)}` : ""
      }.`
    );
    if (MOTIVOS[motivo]) {
      lines.push("");
      lines.push(MOTIVOS[motivo]);
    }
    lines.push("");
    lines.push(
      "Agradezco sinceramente las oportunidades de aprendizaje y desarrollo profesional que me brindaron durante mi estancia en la empresa, así como la confianza depositada en mi trabajo. Durante el periodo de transición, me comprometo a entregar ordenadamente mis actividades y a capacitar a la persona que designen para cubrir mis funciones."
    );
    lines.push("");
    lines.push(
      "Quedo atento(a) para formalizar la entrega y la firma de mi finiquito conforme a la ley. Les deseo el mayor de los éxitos."
    );
    lines.push("");
    lines.push("Atentamente,");
    lines.push("");
    lines.push("");
    lines.push(nombre || "[Tu nombre]");
    if (puesto) lines.push(puesto);
    return lines.join("\n");
  }, [nombre, puesto, empresa, ciudad, destinatario, fechaCarta, ultimoDia, motivo]);

  async function copyCarta() {
    try {
      await navigator.clipboard.writeText(carta);
      setCopied(true);
      toast.success("Carta copiada al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar. Selecciona el texto manualmente.");
    }
  }

  return (
    <PageShell
      title="Generador de carta de renuncia"
      subtitle="Completa tus datos y obtén una carta de renuncia profesional, lista para firmar y entregar. Gratis y sin registro."
    >
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Tus datos</h2>
          </div>
          <div className="space-y-4">
            <Field id="nombre" label="Tu nombre completo" value={nombre} onChange={setNombre} placeholder="María Fernanda López García" />
            <Field id="puesto" label="Tu puesto actual" value={puesto} onChange={setPuesto} placeholder="Analista de Recursos Humanos" />
            <Field id="empresa" label="Empresa" value={empresa} onChange={setEmpresa} placeholder="Comercializadora del Bajío, S.A. de C.V." />
            <Field id="ciudad" label="Ciudad" value={ciudad} onChange={setCiudad} placeholder="Guadalajara, Jalisco" />
            <Field id="destinatario" label="Destinatario (opcional)" value={destinatario} onChange={setDestinatario} placeholder="Lic. Jorge Ramírez — Gerente de Recursos Humanos" />
            <Field id="fechacarta" label="Fecha de la carta" value={fechaCarta} onChange={setFechaCarta} type="date" />
            <Field id="ultimodia" label="Tu último día laboral" value={ultimoDia} onChange={setUltimoDia} type="date" />
            <div>
              <Label htmlFor="motivo">Motivo (opcional)</Label>
              <select
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="ninguno">Sin mencionar motivo</option>
                <option value="oportunidad">Nueva oportunidad laboral</option>
                <option value="crecimiento">Crecimiento profesional</option>
                <option value="estudios">Continuar estudios</option>
                <option value="personales">Motivos personales</option>
                <option value="mudanza">Cambio de residencia</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-semibold">Vista previa de tu carta</h2>
            <pre className="mt-4 whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-foreground/90">
              {carta}
            </pre>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={copyCarta} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copiada" : "Copiar carta"}
            </Button>
            <Button variant="outline" onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir / Guardar PDF
            </Button>
          </div>
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
            <p className="font-medium">Antes de entregar tu renuncia, ten listo tu siguiente paso</p>
            <p className="mt-1 text-muted-foreground">
              Calcula cuánto finiquito te corresponde y actualiza tu CV con tus logros en este
              empleo.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to="/calculadora-finiquito">
                <Button size="sm">Calcular mi finiquito</Button>
              </Link>
              <Link to="/plantillas">
                <Button size="sm" variant="outline">
                  Actualizar mi CV
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-14 max-w-3xl space-y-5 text-[15px] leading-relaxed text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">Cómo renunciar sin cerrar puertas</h2>
        <p>
          Renunciar bien es una inversión: el mercado laboral mexicano es más pequeño de lo que
          parece y tus referencias futuras se construyen hoy. Entrega tu carta primero a tu jefe
          directo (no a Recursos Humanos ni a tus compañeros), hazlo en persona o en una breve
          reunión, y evita negociar bajo emociones si ya tienes una contraoferta emocional sobre la
          mesa.
        </p>
        <p>
          Durante tu periodo de transición, documenta tus procesos, entrega pendientes por escrito
          y despídete agradeciendo. Y nunca firmes documentos en blanco ni aceptes que tu finiquito
          sea menor al proporcional que marca la ley: si algo no cuadra, pide el cálculo por escrito
          y compáralo con nuestra calculadora de finiquito.
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
