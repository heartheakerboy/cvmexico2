import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { hrManagerSample } from "@/lib/resume/industry-samples";

export const Route = createFileRoute("/hr-manager-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla CV Recursos Humanos | CVAI" },
      {
        name: "description",
        content: "Crea tu currículum de recursos humanos y reclutamiento. Plantilla formal con enfoque en NOM-035, Ley Federal del Trabajo y clima laboral.",
      },
      { property: "og:title", content: "Plantilla CV Recursos Humanos | CVAI" },
      { property: "og:url", content: "/hr-manager-resume-template" },
    ],
    links: [{ rel: "canonical", href: "/hr-manager-resume-template" }],
  }),
  component: HrManagerLandingPage,
});

const faqs = [
  {
    q: "¿Qué regulaciones mexicanas son relevantes en Recursos Humanos?",
    a: "Es altamente valioso incluir el dominio e implementación de la NOM-035 (factores de riesgo psicosocial), NOM-037 (teletrabajo) y conocimientos sólidos de la Ley Federal del Trabajo (LFT)."
  },
  {
    q: "¿Qué métricas de recursos humanos interesan a la dirección?",
    a: "Destaca la tasa de reducción de rotación de personal, la optimización de los costos de reclutamiento por canal y las mejoras de satisfacción en encuestas de clima laboral."
  },
  {
    q: "¿Debo incluir mis certificaciones de reclutamiento?",
    a: "Sí. Las certificaciones en metodologías ágiles de HR, SHRM o programas avanzados de relaciones colectivas de sindicatos aportan alta credibilidad a perfiles gerenciales."
  }
];

const crossLinks = [
  { label: "Gerente de Proyectos", to: "/project-manager-resume-template" },
  { label: "Contador", to: "/accountant-resume-template" },
  { label: "Ejecutivo de Ventas", to: "/sales-executive-resume-template" },
  { label: "Abogado", to: "/lawyer-resume-template" },
  { label: "Docente", to: "/teacher-resume-template" }
];

function HrManagerLandingPage() {
  return (
    <TemplateLandingPage
      templateId="corporate-hr-manager"
      title="Plantilla de Currículum para Recursos Humanos Pro"
      description="Estructura formal para profesionales del capital humano. Diseñado con una barra lateral gris oscuro sobria, apartados para cumplimiento de auditorías de la STPS, NOM-035 e iniciativas de desarrollo organizacional."
      profession="Recursos Humanos"
      category="Profesional"
      schemaDescription="Plantilla de currículum profesional y estructurada para directores y gerentes de recursos humanos en México."
      faqs={faqs}
      sampleDoc={hrManagerSample}
      crossLinks={crossLinks}
    />
  );
}
