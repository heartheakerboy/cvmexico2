import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { studentSample } from "@/lib/resume/stage-samples";

export const Route = createFileRoute("/student-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla de Currículum para Estudiantes Gratis || CVAI" },
      {
        name: "description",
        content: "Crea tu primer currículum de estudiante. Diseñado para destacar proyectos académicos, voluntariados y becas sin experiencia previa. Empieza gratis.",
      },
      { property: "og:title", content: "Plantilla de CV para Estudiantes Gratis || CVAI" },
      { property: "og:url", content: "/student-resume-template" },
    ],
    links: [{ rel: "canonical", href: "/student-resume-template" }],
  }),
  component: StudentLandingPage,
});

const faqs = [
  {
    q: "¿Cómo hago un currículum si soy estudiante y no tengo experiencia?",
    a: "Enfócate en tu educación, promedio sobresaliente, proyectos escolares prácticos, actividades extracurriculares y voluntariados. Esta plantilla prioriza estas secciones por encima de la experiencia laboral."
  },
  {
    q: "¿Debo incluir becas o intercambios académicos?",
    a: "Sí, de forma muy destacada. En México, las becas por excelencia académica e intercambios internacionales demuestran alto compromiso y disciplina, cualidades muy buscadas por reclutadores de talento joven."
  },
  {
    q: "¿Qué tipo de habilidades debo añadir?",
    a: "Prioriza tus habilidades blandas (comunicación, proactividad, trabajo en equipo) y tus habilidades técnicas básicas (manejo de hojas de cálculo, herramientas de diseño o lenguajes aprendidos en clase)."
  }
];

const crossLinks = [
  { label: "Recién Egresado", to: "/fresher-resume-template" },
  { label: "Candidato a Prácticas", to: "/internship-resume-template" },
  { label: "Profesional Junior", to: "/entry-level-resume-template" },
  { label: "Especialista Mid-Level", to: "/mid-level-resume-template" },
  { label: "Trabajo en Gobierno", to: "/government-resume-template" }
];

function StudentLandingPage() {
  return (
    <TemplateLandingPage
      templateId="stage-student"
      title="Plantilla de Currículum para Estudiante Académico"
      description="Tu primer currículum sin experiencia previa. Esta plantilla está optimizada con un diseño educativo integral que pone tus estudios, proyectos de clase, servicio social y voluntariados al frente."
      profession="Estudiante"
      category="Estudiante"
      schemaDescription="Plantilla de currículum escolar para estudiantes universitarios y de preparatoria en México sin experiencia."
      faqs={faqs}
      sampleDoc={studentSample}
      crossLinks={crossLinks}
    />
  );
}
