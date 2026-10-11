import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { fresherSample } from "@/lib/resume/stage-samples";

export const Route = createFileRoute("/fresher-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla CV Recién Egresados | CVAI" },
      {
        name: "description",
        content: "Crea tu currículum de recién egresado o titulado. Diseño moderno de dos columnas enfocado en objetivos profesionales y habilidades técnicas.",
      },
      { property: "og:title", content: "Plantilla CV Recién Egresados | CVAI" },
      { property: "og:url", content: "/fresher-resume-template" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/fresher-resume-template" }],
  }),
  component: FresherLandingPage,
});

const faqs = [
  {
    q: "¿Qué es el Objetivo Profesional y por qué lo necesito?",
    a: "El objetivo profesional describe en 2 o 3 líneas lo que pretendes aportar a la empresa y el área en la que deseas crecer. Es de gran utilidad para candidatos sin una larga trayectoria."
  },
  {
    q: "¿Debo incluir mi servicio social y prácticas profesionales?",
    a: "Sí, trátalos como experiencia real de trabajo. Describe las tareas que realizaste, los proyectos que apoyaste y cualquier software o herramienta que hayas manejado."
  },
  {
    q: "¿Cómo destaco mis proyectos de titulación o tesis?",
    a: "Agrégalos en la sección de proyectos describiendo el problema que resolviste, la metodología y los resultados prácticos de tu investigación."
  }
];

const crossLinks = [
  { label: "Estudiante", to: "/student-resume-template" },
  { label: "Candidato a Prácticas", to: "/internship-resume-template" },
  { label: "Profesional Junior", to: "/entry-level-resume-template" },
  { label: "Freelancer Creativo", to: "/freelancer-resume-template" },
  { label: "Trabajo en Gobierno", to: "/government-resume-template" }
];

function FresherLandingPage() {
  return (
    <TemplateLandingPage
      templateId="stage-fresher"
      title="Plantilla de Currículum para Egresado Dinámico"
      description="El puente entre la universidad y tu primer empleo. Con un diseño dinámico a dos columnas que equilibra tus primeras prácticas profesionales y tus competencias técnicas para destacar ante reclutadores."
      profession="Recién Egresado"
      category="Estudiante"
      schemaDescription="Plantilla de currículum para recién egresados y profesionistas junior en México."
      faqs={faqs}
      sampleDoc={fresherSample}
      crossLinks={crossLinks}
    />
  );
}
