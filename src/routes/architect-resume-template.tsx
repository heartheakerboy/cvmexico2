import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { architectSample } from "@/lib/resume/industry-samples";

export const Route = createFileRoute("/architect-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla CV Arquitectos y BIM Leads | CVAI" },
      {
        name: "description",
        content: "Crea tu currículum de arquitecto con un diseño estructural moderno. Ideal para portafolios, modelado 3D Revit, AutoCAD y supervisión de obra.",
      },
      { property: "og:title", content: "Plantilla CV Arquitectos y BIM Leads | CVAI" },
      { property: "og:url", content: "/architect-resume-template" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/architect-resume-template" }],
  }),
  component: ArchitectLandingPage,
});

const faqs = [
  {
    q: "¿Qué programas de diseño arquitectónico debo destacar?",
    a: "Indica tu dominio de modelado BIM (Revit es el más cotizado hoy en México), AutoCAD para planos ejecutivos, renders (Lumion, V-Ray) y programas de presupuestación como Opus."
  },
  {
    q: "¿Es necesario enlazar mi portafolio digital?",
    a: "Es indispensable. En el sector de la construcción y diseño, los renders y fotos de obra terminada hablan por ti. Añade tu enlace a Behance o box digital en la barra lateral."
  },
  {
    q: "¿Cómo describo la supervisión de obra?",
    a: "Indica el tamaño del proyecto (metros cuadrados construidos, número de niveles), el presupuesto gestionado en pesos mexicanos y el tipo de obra (habitacional, comercial, industrial)."
  }
];

const crossLinks = [
  { label: "Diseñador Gráfico", to: "/graphic-designer-resume-template" },
  { label: "Ing. de Software", to: "/software-engineer-resume-template" },
  { label: "Gerente de Proyectos", to: "/project-manager-resume-template" },
  { label: "Docente", to: "/teacher-resume-template" },
  { label: "Abogado", to: "/lawyer-resume-template" }
];

function ArchitectLandingPage() {
  return (
    <TemplateLandingPage
      templateId="creative-architect"
      title="Plantilla de Currículum para Arquitectura Estructural"
      description="Inspirada en planos y líneas de dibujo técnico. Con una retícula geométrica limpia, foto de perfil cuadrada a tamaño completo y espacio dedicado para ligar portafolios ejecutivos de Revit y AutoCAD."
      profession="Arquitecto"
      category="Creativo"
      schemaDescription="Plantilla de currículum con retícula moderna y limpia para arquitectos y coordinadores de obra en México."
      faqs={faqs}
      sampleDoc={architectSample}
      crossLinks={crossLinks}
    />
  );
}
