import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { midLevelSample } from "@/lib/resume/stage-samples";

export const Route = createFileRoute("/mid-level-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla de Currículum para Analistas y Especialistas Mid-Level | CVMéxico" },
      {
        name: "description",
        content: "Crea tu currículum profesional de nivel medio. Diseño estructurado de dos columnas equilibrado para coordinadores y analistas de 3 a 7 años de experiencia.",
      },
      { property: "og:title", content: "Plantilla de CV para Analistas y Especialistas Mid-Level | CVMéxico" },
      { property: "og:url", content: "/mid-level-resume-template" },
    ],
    links: [{ rel: "canonical", href: "/mid-level-resume-template" }],
  }),
  component: MidLevelLandingPage,
});

const faqs = [
  {
    q: "¿Cómo equilibro la experiencia y las habilidades en este nivel?",
    a: "Esta plantilla utiliza una distribución equilibrada en dos columnas. El panel izquierdo resalta tus habilidades y certificaciones técnicas consolidadas, mientras el derecho detalla tus logros en proyectos y trayectoria laboral."
  },
  {
    q: "¿Qué tipo de logros debe incluir un perfil Mid-Level?",
    a: "Habla de optimizaciones de procesos, aumentos en métricas operativas (e.g. 'reduje reportes manuales en 60%') e implementaciones exitosas de software corporativo."
  },
  {
    q: "¿Debo incluir todos mis empleos anteriores?",
    a: "Incluye solo aquellos que sean relevantes para la vacante actual y que sumen a tu trayectoria. Los empleos temporales antiguos pueden resumirse o eliminarse."
  }
];

const crossLinks = [
  { label: "Profesional Junior", to: "/entry-level-resume-template" },
  { label: "Especialista Senior", to: "/senior-professional-resume-template" },
  { label: "Dirección Ejecutiva", to: "/executive-resume-template" },
  { label: "CEO Élite", to: "/ceo-resume-template" },
  { label: "Freelancer Creativo", to: "/freelancer-resume-template" }
];

function MidLevelLandingPage() {
  return (
    <TemplateLandingPage
      templateId="stage-mid-level"
      title="Plantilla de Currículum para Especialista Mid-Level"
      description="El equilibrio perfecto entre logros y habilidades. Diseñada para coordinadores, analistas y especialistas consolidados en México (3 a 7 años de trayectoria). Su cuadrante estructurado optimiza el espacio al máximo."
      profession="Profesional Mid-Level"
      category="Profesional"
      schemaDescription="Plantilla de currículum profesional de nivel medio para analistas y coordinadores en México."
      faqs={faqs}
      sampleDoc={midLevelSample}
      crossLinks={crossLinks}
    />
  );
}
