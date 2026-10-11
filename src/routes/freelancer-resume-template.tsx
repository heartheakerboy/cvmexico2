import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { freelancerSample } from "@/lib/resume/stage-samples";

export const Route = createFileRoute("/freelancer-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla CV Freelancers y Remotos | CVAI" },
      {
        name: "description",
        content: "Crea tu currículum de freelancer o contratista. Diseño creativo enfocado en portafolio de clientes, testimonios y servicios ofrecidos. Empieza gratis.",
      },
      { property: "og:title", content: "Plantilla CV Freelancers y Remotos | CVAI" },
      { property: "og:url", content: "/freelancer-resume-template" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/freelancer-resume-template" }],
  }),
  component: FreelancerLandingPage,
});

const faqs = [
  {
    q: "¿Cómo demuestro mi experiencia si trabajo de forma independiente?",
    a: "Estructura tu experiencia por proyectos relevantes o servicios de consultoría, mencionando los hitos y resultados numéricos obtenidos para tus clientes (e.g. 'aumento del 30% en ventas')."
  },
  {
    q: "¿Debo incluir testimonios de clientes?",
    a: "Sí. Para contratistas independientes, la validación de terceros (reseñas o recomendaciones) genera confianza inmediata en las áreas comerciales que contratan servicios externos."
  },
  {
    q: "¿Es valioso colocar un enlace a mi sitio web personal?",
    a: "Es indispensable. Sirve como prueba física de tu nivel técnico, estilo de trabajo y portafolio de proyectos lanzados con éxito."
  }
];

const crossLinks = [
  { label: "Diseñador Gráfico", to: "/graphic-designer-resume-template" },
  { label: "Ing. de Software", to: "/software-engineer-resume-template" },
  { label: "Arquitecto", to: "/architect-resume-template" },
  { label: "Profesional Junior", to: "/entry-level-resume-template" },
  { label: "Especialista Mid-Level", to: "/mid-level-resume-template" }
];

function FreelancerLandingPage() {
  return (
    <TemplateLandingPage
      templateId="stage-freelancer"
      title="Plantilla de Currículum para Freelancer Creativo"
      description="Tu portafolio de servicios y validaciones comerciales en una sola hoja. Diseñada con acentos rosa creativos,handles web activos y estructuración adaptada para proyectos independientes y testimoniales de clientes."
      profession="Freelancer"
      category="Creativo"
      schemaDescription="Plantilla de currículum creativa para profesionales independientes, consultores y trabajadores remotos en México."
      faqs={faqs}
      sampleDoc={freelancerSample}
      crossLinks={crossLinks}
    />
  );
}
