import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles, Target, FileText, Languages, Mail,
  Calculator, Wallet, PenLine, MessagesSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";
import { getMetaTranslation } from "@/lib/i18n/config";

export const Route = createFileRoute("/herramientas")({
  head: () => ({
    meta: [
      { title: getMetaTranslation("publicTools.metaTitle") },
      {
        name: "description",
        content: getMetaTranslation("publicTools.metaDesc"),
      },
      { property: "og:url", content: "/herramientas" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/herramientas" }],
  }),
  component: HerramientasPage,
});

const tools = [
  { icon: Target, titleKey: "publicTools.ats.title", descKey: "publicTools.ats.desc" },
  { icon: Sparkles, titleKey: "publicTools.resumen.title", descKey: "publicTools.resumen.desc" },
  { icon: FileText, titleKey: "publicTools.logros.title", descKey: "publicTools.logros.desc" },
  { icon: Languages, titleKey: "publicTools.traductor.title", descKey: "publicTools.traductor.desc" },
  { icon: Mail, titleKey: "publicTools.carta.title", descKey: "publicTools.carta.desc" },
];

const freeTools = [
  {
    icon: Calculator,
    title: "Calculadora de sueldo neto",
    desc: "Convierte tu sueldo bruto a neto con ISR e IMSS 2026, o calcula el bruto que necesitas ganar.",
    to: "/calculadora-sueldo-neto",
  },
  {
    icon: Wallet,
    title: "Calculadora de finiquito",
    desc: "Calcula tu finiquito por renuncia o tu liquidación por despido según la Ley Federal del Trabajo.",
    to: "/calculadora-finiquito",
  },
  {
    icon: PenLine,
    title: "Generador de carta de renuncia",
    desc: "Crea una carta de renuncia profesional en minutos, lista para copiar, imprimir o enviar.",
    to: "/generador-carta-renuncia",
  },
  {
    icon: MessagesSquare,
    title: "Simulador de entrevistas",
    desc: "Practica preguntas reales de entrevista con retroalimentación de IA antes del gran día.",
    to: "/simulador-entrevista",
  },
];

function HerramientasPage() {
  const { t } = useSettings();

  return (
    <PageShell
      title={t("publicTools.title")}
      subtitle={t("publicTools.subtitle")}
    >
      <h2 className="mb-5 text-xl font-bold">Herramientas gratuitas sin registro</h2>
      <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {freeTools.map((tool) => (
          <div key={tool.to} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <tool.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{tool.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{tool.desc}</p>
            <Link to={tool.to} className="mt-4 inline-block">
              <Button size="sm">Usar gratis</Button>
            </Link>
          </div>
        ))}
      </div>

      <h2 className="mb-5 text-xl font-bold">Herramientas con IA (cuenta gratuita)</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tItem) => (
          <div key={tItem.titleKey} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <tItem.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{t(tItem.titleKey)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(tItem.descKey)}</p>
            <Link to="/auth" className="mt-4 inline-block">
              <Button size="sm" variant="outline">
                {t("publicTools.tryFree")}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </PageShell>
  );
}