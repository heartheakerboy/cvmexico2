import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { projectManagerSample } from "@/lib/resume/industry-samples";

export const Route = createFileRoute("/project-manager-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla de Currículum para Project Managers PMP || CVAI" },
      {
        name: "description",
        content: "Crea tu currículum de gerente de proyectos. Formato de línea de tiempo royal blue ideal para certificados PMP, Scrum Master y metodologías ágiles.",
      },
      { property: "og:title", content: "Plantilla de CV para Project Managers PMP || CVAI" },
      { property: "og:url", content: "/project-manager-resume-template" },
    ],
    links: [{ rel: "canonical", href: "/project-manager-resume-template" }],
  }),
  component: ProjectManagerLandingPage,
});

const faqs = [
  {
    q: "¿Por qué es clave destacar la certificación PMP?",
    a: "En México y a nivel internacional, contar con la certificación Project Management Professional (PMP) del PMI valida formalmente tus conocimientos de presupuestación, riesgos y control del ciclo de vida del proyecto."
  },
  {
    q: "¿Cómo equilibro metodologías ágiles y tradicionales?",
    a: "Esta plantilla cuenta con una estructura que facilita destacar tus marcos ágiles (Scrum, Kanban, Agile) al lado de marcos predictivos tradicionales (Waterfall)."
  },
  {
    q: "¿Debería detallar los presupuestos administrados?",
    a: "Sí, es de alto impacto. Mencionar presupuestos (e.g. 'proyecto de $2M USD') demuestra la escala de responsabilidad que has manejado frente a patrocinadores o directores."
  }
];

const crossLinks = [
  { label: "Gerente de RR. HH.", to: "/hr-manager-resume-template" },
  { label: "Contador", to: "/accountant-resume-template" },
  { label: "Ejecutivo de Ventas", to: "/sales-executive-results-template" },
  { label: "Ing. de Software", to: "/software-engineer-resume-template" },
  { label: "Abogado", to: "/lawyer-resume-template" }
];

function ProjectManagerLandingPage() {
  return (
    <TemplateLandingPage
      templateId="executive-project-manager"
      title="Plantilla de Currículum para Gerente de Proyectos PMP"
      description="Liderazgo y control presupuestal. Diseñado con una línea de tiempo royal blue, bloques de destaque para certificaciones PMP/Scrum Master y una distribución limpia que resalta proyectos entregados a tiempo."
      profession="Project Manager"
      category="Ejecutivo"
      schemaDescription="Plantilla de currículum estructurada con línea de tiempo y certificación PMI para líderes y gerentes de proyectos en México."
      faqs={faqs}
      sampleDoc={projectManagerSample}
      crossLinks={crossLinks}
    />
  );
}
