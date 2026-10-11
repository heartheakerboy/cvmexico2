import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { executiveSample } from "@/lib/resume/stage-samples";

export const Route = createFileRoute("/executive-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla CV Dirección Ejecutiva y VPs | CVAI" },
      {
        name: "description",
        content: "Crea tu currículum ejecutivo de lujo. Ideal para directores financieros, operativos, VPs y consejeros de administración en México.",
      },
      { property: "og:title", content: "Plantilla CV Dirección Ejecutiva y VPs | CVAI" },
      { property: "og:url", content: "/executive-resume-template" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/executive-resume-template" }],
  }),
  component: ExecutiveLandingPage,
});

const faqs = [
  {
    q: "¿Qué secciones son exclusivas de un perfil de Dirección Ejecutiva?",
    a: "Las secciones de Gobierno Corporativo, participación en Consejos de Administración (Board Experience), fusiones y adquisiciones (M&A) e inversiones estructuradas de capital."
  },
  {
    q: "¿Por qué se utiliza una tipografía serif tradicional?",
    a: "La tipografía serif aporta seriedad, trayectoria, sobriedad y prestigio institucional. Es la preferida para perfiles de mesa directiva e inversionistas."
  },
  {
    q: "¿Debería detallar mi experiencia en fusiones y adquisiciones?",
    a: "Sí. Para cargos directivos, detallar reestructuraciones de deuda y adquisiciones exitosas de competidores demuestra alta competencia financiera y estratégica global."
  }
];

const crossLinks = [
  { label: "Especialista Senior", to: "/senior-professional-resume-template" },
  { label: "CEO Élite", to: "/ceo-resume-template" },
  { label: "Trabajo en Gobierno", to: "/government-resume-template" },
  { label: "Contador Corporativo", to: "/accountant-resume-template" },
  { label: "Abogado Ejecutivo", to: "/lawyer-resume-template" }
];

function ExecutiveLandingPage() {
  return (
    <TemplateLandingPage
      templateId="stage-executive"
      title="Plantilla de Currículum para Dirección Ejecutiva"
      description="Lujo y prestigio directivo. Diseñado con una tipografía de estilo serif tradicional, detalles de línea dorada mate y un panel lateral sobrio adaptado para consejeros y vicepresidentes en México."
      profession="Dirección Ejecutiva"
      category="Ejecutivo"
      schemaDescription="Plantilla de currículum de lujo y alto nivel corporativo para consejeros y vicepresidentes en México."
      faqs={faqs}
      sampleDoc={executiveSample}
      crossLinks={crossLinks}
    />
  );
}
