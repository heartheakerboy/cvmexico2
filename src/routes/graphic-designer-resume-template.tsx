import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { graphicDesignerSample } from "@/lib/resume/industry-samples";

export const Route = createFileRoute("/graphic-designer-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla de Currículum para Diseñadores Gráficos || CVAI" },
      {
        name: "description",
        content: "Crea un currículum creativo e impactante. Con fucsia premium y enlaces a Behance/Dribbble. Ideal para branding y dirección de arte.",
      },
      { property: "og:title", content: "Plantilla de CV para Diseñadores Gráficos || CVAI" },
      { property: "og:url", content: "/graphic-designer-resume-template" },
    ],
    links: [{ rel: "canonical", href: "/graphic-designer-resume-template" }],
  }),
  component: GraphicDesignerLandingPage,
});

const faqs = [
  {
    q: "¿Cómo demuestro mis competencias en herramientas creativas?",
    a: "Divide tus conocimientos en herramientas de diseño digital (Figma, Illustrator, Photoshop), diseño de movimiento (After Effects) y metodologías UX/UI para facilitar la lectura del reclutador."
  },
  {
    q: "¿Qué tan colorido debe ser mi currículum de diseñador?",
    a: "Debe reflejar tu identidad visual sin saturar el fondo. Esta plantilla utiliza acentos de fucsia vibrante combinados con amplios espacios blancos para equilibrar la estética y la legibilidad."
  },
  {
    q: "¿Es importante incluir enlaces de Behance?",
    a: "Es indispensable. Los reclutadores creativos evalúan tu estilo y portafolio real de proyectos de marca antes de agendar entrevistas corporativas."
  }
];

const crossLinks = [
  { label: "Arquitecto", to: "/architect-resume-template" },
  { label: "Ing. de Software", to: "/software-engineer-resume-template" },
  { label: "Ejecutivo de Ventas", to: "/sales-executive-results-template" },
  { label: "Docente", to: "/teacher-resume-template" },
  { label: "Gerente de RR. HH.", to: "/hr-manager-resume-template" }
];

function GraphicDesignerLandingPage() {
  return (
    <TemplateLandingPage
      templateId="creative-graphic-designer"
      title="Plantilla de Currículum para Diseñador Gráfico Premium"
      description="Impacto estético y diseño de autor. Utiliza un fondo de panel suavizado en tonos lavanda, handles destacados de Behance/Dribbble y un encuadre dinámico de foto de retrato para perfiles de diseño y marketing en México."
      profession="Diseñador Gráfico"
      category="Creativo"
      schemaDescription="Plantilla de currículum de diseño gráfico altamente visual y con acentos fucsia creativos para el mercado de México."
      faqs={faqs}
      sampleDoc={graphicDesignerSample}
      crossLinks={crossLinks}
    />
  );
}
