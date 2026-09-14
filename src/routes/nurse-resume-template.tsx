import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { nurseSample } from "@/lib/resume/industry-samples";

export const Route = createFileRoute("/nurse-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla CV Enfermera Profesional | CVAI" },
      {
        name: "description",
        content: "Crea tu currículum de enfermería con una plantilla estructurada para el sector salud. Incluye licencias, soporte vital (ACLS) y habilidades clínicas.",
      },
      { property: "og:title", content: "Plantilla CV Enfermera Profesional | CVAI" },
      { property: "og:url", content: "/nurse-resume-template" },
    ],
    links: [{ rel: "canonical", href: "/nurse-resume-template" }],
  }),
  component: NurseLandingPage,
});

const faqs = [
  {
    q: "¿Qué secciones son fundamentales en un currículum de enfermería?",
    a: "Además de la experiencia laboral, debes destacar de manera clara tus Cédulas Profesionales, especialidades, y certificaciones críticas de soporte vital (como ACLS, BLS o PALS)."
  },
  {
    q: "¿Cómo organizar la experiencia clínica?",
    a: "Describe los hospitales, el nivel de atención (e.g. área de urgencias, UCI, quirófano) y el tipo de pacientes que atendías. Coloca tus mayores logros de cuidado de pacientes."
  },
  {
    q: "¿Debe incluir foto el CV de enfermería en México?",
    a: "En México es opcional, pero de colocarla, asegúrate de que sea una foto profesional con vestimenta formal o uniforme clínico limpio."
  }
];

const crossLinks = [
  { label: "Ing. de Software", to: "/software-engineer-resume-template" },
  { label: "Docente", to: "/teacher-resume-template" },
  { label: "Administrador / RRHH", to: "/hr-manager-resume-template" },
  { label: "Contador", to: "/accountant-resume-template" },
  { label: "Abogado", to: "/lawyer-resume-template" }
];

function NurseLandingPage() {
  return (
    <TemplateLandingPage
      templateId="health-nurse"
      title="Plantilla de Currículum para Enfermería Profesional"
      description="Especialmente diseñada para personal del sector salud. Estructura ordenada que pone en primer plano tus licencias, certificaciones médicas de emergencia y habilidades de cuidado clínico para hospitales en México."
      profession="Enfermera"
      category="Profesional"
      schemaDescription="Plantilla de currículum profesional para enfermeros y personal médico en México."
      faqs={faqs}
      sampleDoc={nurseSample}
      crossLinks={crossLinks}
    />
  );
}
