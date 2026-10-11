import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { internshipSample } from "@/lib/resume/stage-samples";

export const Route = createFileRoute("/internship-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla CV Prácticas Profesionales | CVAI" },
      {
        name: "description",
        content: "Crea tu currículum para postularte a programas de becarios o prácticas profesionales. Diseño limpio de una columna para estudiantes. Empieza gratis.",
      },
      { property: "og:title", content: "Plantilla CV Prácticas Profesionales | CVAI" },
      { property: "og:url", content: "/internship-resume-template" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/internship-resume-template" }],
  }),
  component: InternshipLandingPage,
});

const faqs = [
  {
    q: "¿Cómo demuestro mi potencial para unas prácticas profesionales?",
    a: "Destaca tus asignaturas escolares clave vinculadas al puesto, tu promedio sobresaliente, tu disponibilidad de horario (e.g. 'disponibilidad de medio tiempo por las mañanas') y tu deseo de aprender."
  },
  {
    q: "¿Qué tan largo debe ser el currículum de becario?",
    a: "Debe ser de una sola página. Un formato conciso y directo ayuda al reclutador a escanear tu potencial en menos de 10 segundos."
  },
  {
    q: "¿Debo colocar mis redes sociales?",
    a: "Solo coloca tu enlace a LinkedIn si lo tienes actualizado de forma profesional. Evita colocar perfiles personales de Facebook o Instagram."
  }
];

const crossLinks = [
  { label: "Estudiante", to: "/student-resume-template" },
  { label: "Recién Egresado", to: "/fresher-resume-template" },
  { label: "Profesional Junior", to: "/entry-level-resume-template" },
  { label: "Especialista Mid-Level", to: "/mid-level-resume-template" },
  { label: "Freelancer Creativo", to: "/freelancer-resume-template" }
];

function InternshipLandingPage() {
  return (
    <TemplateLandingPage
      templateId="stage-internship"
      title="Plantilla de Currículum para Candidato a Prácticas"
      description="Optimizado para programas de becarios corporativos. Una estructura minimalista y profesional de alta legibilidad que prioriza tus cursos destacados, certificaciones tempranas y proyectos de carrera."
      profession="Becario / Practicante"
      category="Estudiante"
      schemaDescription="Plantilla de currículum para estudiantes buscando programas de becarios o prácticas profesionales en México."
      faqs={faqs}
      sampleDoc={internshipSample}
      crossLinks={crossLinks}
    />
  );
}
