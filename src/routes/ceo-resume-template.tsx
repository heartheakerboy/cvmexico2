import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { ceoSample } from "@/lib/resume/stage-samples";

export const Route = createFileRoute("/ceo-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla CV Directores Generales y CEOs | CVAI" },
      {
        name: "description",
        content: "Crea tu currículum de Director General (CEO). Diseño premium con foco en EBITDA, transformación digital, y consejos de administración en México.",
      },
      { property: "og:title", content: "Plantilla CV Directores Generales y CEOs | CVAI" },
      { property: "og:url", content: "/ceo-resume-template" },
    ],
    links: [{ rel: "canonical", href: "/ceo-resume-template" }],
  }),
  component: CeoLandingPage,
});

const faqs = [
  {
    q: "¿Qué métricas B2C/B2B de nivel CEO deben colocarse?",
    a: "Destaca el EBITDA acumulado, el crecimiento porcentual de ingresos anuales, el número total de empleados liderados y la apertura de nuevos canales (como comercio digital u operaciones globales)."
  },
  {
    q: "¿Debería mencionar participaciones en medios o conferencias?",
    a: "Sí. Para directores generales, las menciones en prensa financiera, ponencias magistrales o liderazgo gremial (e.g. ANTAD, Coparmex) posicionan tu marca directiva de forma inigualable."
  },
  {
    q: "¿Qué buscan las headhunters internacionales en este nivel?",
    a: "Buscan evidencias tangibles de restructuración exitosa de operaciones complejas, liderazgo visionario, integridad y relaciones sólidas a nivel de inversionistas y junta directiva."
  }
];

const crossLinks = [
  { label: "Dirección Ejecutiva", to: "/executive-resume-template" },
  { label: "Especialista Senior", to: "/senior-professional-resume-template" },
  { label: "Trabajo en Gobierno", to: "/government-resume-template" },
  { label: "Abogado Corporativo", to: "/lawyer-resume-template" },
  { label: "Gerente de Proyectos", to: "/project-manager-resume-template" }
];

function CeoLandingPage() {
  return (
    <TemplateLandingPage
      templateId="stage-ceo"
      title="Plantilla de Currículum para CEO Élite"
      description="Branding de alta dirección y resultados macro. Diseñada específicamente para directores generales ejecutores (CEOs) en México, con foco en retornos financieros, liderazgo de comités y planeación de escala global."
      profession="CEO"
      category="Ejecutivo"
      schemaDescription="Plantilla de currículum de alta dirección para Directores Generales y CEOs en México."
      faqs={faqs}
      sampleDoc={ceoSample}
      crossLinks={crossLinks}
    />
  );
}
