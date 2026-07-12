import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { entryLevelSample } from "@/lib/resume/stage-samples";

export const Route = createFileRoute("/entry-level-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla de Currículum para Profesional Junior | CVMéxico" },
      {
        name: "description",
        content: "Crea tu currículum para puestos junior o de nivel de entrada. Estructura corporativa que destaca habilidades tempranas y experiencia inicial.",
      },
      { property: "og:title", content: "Plantilla de CV para Profesional Junior | CVMéxico" },
      { property: "og:url", content: "/entry-level-resume-template" },
    ],
    links: [{ rel: "canonical", href: "/entry-level-resume-template" }],
  }),
  component: EntryLevelLandingPage,
});

const faqs = [
  {
    q: "¿Por qué se colocan las habilidades al inicio en este nivel?",
    a: "Cuando tienes entre 1 y 3 años de experiencia, tus competencias técnicas y herramientas adquiridas respaldan fuertemente tu candidatura. Colocarlas al inicio da un gancho de valor inmediato para el reclutador."
  },
  {
    q: "¿Debo incluir voluntariados en un CV profesional junior?",
    a: "Sí. Si están alineados con tus competencias o demuestran liderazgo y trabajo en equipo, aportan un gran valor a tu perfil inicial."
  },
  {
    q: "¿Cómo redacto mis responsabilidades iniciales?",
    a: "Usa verbos de acción (como Colaboré, Redacté, Monitoreé) y asocia tus tareas diarias con el impacto directo que tuvieron en tu equipo."
  }
];

const crossLinks = [
  { label: "Candidato a Prácticas", to: "/internship-resume-template" },
  { label: "Recién Egresado", to: "/fresher-resume-template" },
  { label: "Especialista Mid-Level", to: "/mid-level-resume-template" },
  { label: "Especialista Senior", to: "/senior-professional-resume-template" },
  { label: "Freelancer Creativo", to: "/freelancer-resume-template" }
];

function EntryLevelLandingPage() {
  return (
    <TemplateLandingPage
      templateId="stage-entry-level"
      title="Plantilla de Currículum para Profesional Junior"
      description="Estructura e impacto corporativo inicial. Ideal para candidatos con 1 a 3 años de experiencia que buscan su segundo empleo. Organiza tus competencias técnicas de inmediato y destaca tus logros tempranos."
      profession="Profesional Junior"
      category="Profesional"
      schemaDescription="Plantilla de currículum profesional de nivel de entrada o junior para candidatos en México."
      faqs={faqs}
      sampleDoc={entryLevelSample}
      crossLinks={crossLinks}
    />
  );
}
