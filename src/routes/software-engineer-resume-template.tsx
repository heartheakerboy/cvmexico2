import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { softwareEngineerSample } from "@/lib/resume/industry-samples";

export const Route = createFileRoute("/software-engineer-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla de Currículum para Ingeniero de Software ATS || CVAI" },
      {
        name: "description",
        content: "Descarga la plantilla de CV para Ingeniero de Software optimizada para filtros ATS. Diseñada para programadores y desarrolladores en México. Empieza gratis.",
      },
      { property: "og:title", content: "Plantilla de CV para Ingeniero de Software ATS || CVAI" },
      { property: "og:url", content: "/software-engineer-resume-template" },
    ],
    links: [{ rel: "canonical", href: "/software-engineer-resume-template" }],
  }),
  component: SoftwareEngineerLandingPage,
});

const faqs = [
  {
    q: "¿Por qué los Ingenieros de Software necesitan una plantilla ATS-friendly?",
    a: "Las empresas tecnológicas en México utilizan sistemas de seguimiento de candidatos (ATS) para escanear currículums buscando palabras clave (como React, Node, Python, AWS). Una plantilla ATS-friendly garantiza que la máquina lea tu texto perfectamente sin errores de formato."
  },
  {
    q: "¿Debería incluir enlaces a GitHub o Portafolio?",
    a: "Sí, es indispensable para los desarrolladores. Esta plantilla cuenta con secciones específicas y visuales para enlazar tu perfil de GitHub, portafolio personal y proyectos destacados."
  },
  {
    q: "¿Qué habilidades técnicas debo priorizar?",
    a: "Divide tus habilidades en lenguajes de programación, frameworks, bases de datos y herramientas de infraestructura/cloud. Colócalas de forma estructurada en la barra lateral."
  }
];

const crossLinks = [
  { label: "Enfermera", to: "/nurse-resume-template" },
  { label: "Contador", to: "/accountant-resume-template" },
  { label: "Abogado", to: "/lawyer-resume-template" },
  { label: "Arquitecto", to: "/architect-resume-template" },
  { label: "Gerente de Proyectos", to: "/project-manager-resume-template" }
];

function SoftwareEngineerLandingPage() {
  return (
    <TemplateLandingPage
      templateId="tech-software-engineer"
      title="Plantilla de Currículum para Ingeniero de Software"
      description="Diseñada específicamente para perfiles tecnológicos en México. Esta plantilla cuenta con una barra lateral optimizada para lenguajes de programación, integraciones con GitHub/Portafolio y un diseño ultra legible para los filtros ATS de reclutamiento."
      profession="Ingeniero de Software"
      category="Técnico"
      schemaDescription="Plantilla de currículum profesional y compatible con ATS para ingenieros de software y programadores en México."
      faqs={faqs}
      sampleDoc={softwareEngineerSample}
      crossLinks={crossLinks}
    />
  );
}
