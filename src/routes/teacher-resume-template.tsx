import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { teacherSample } from "@/lib/resume/industry-samples";

export const Route = createFileRoute("/teacher-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla de Currículum para Docentes y Profesores | CVMéxico" },
      {
        name: "description",
        content: "Descarga la plantilla de currículum académico para profesores y docentes en México. Destaca materias, pedagogía y talleres educativos.",
      },
      { property: "og:title", content: "Plantilla de CV para Docentes y Profesores | CVMéxico" },
      { property: "og:url", content: "/teacher-resume-template" },
    ],
    links: [{ rel: "canonical", href: "/teacher-resume-template" }],
  }),
  component: TeacherLandingPage,
});

const faqs = [
  {
    q: "¿Cómo destacar mis metodologías de enseñanza en el CV?",
    a: "Dedica un espacio en el resumen y la sección de habilidades a metodologías activas como el aprendizaje basado en proyectos (ABP), gamificación o metodologías constructivistas."
  },
  {
    q: "¿Es importante incluir certificaciones tecnológicas en educación?",
    a: "Totalmente. En México, las escuelas valoran enormemente el dominio de herramientas como Google Classroom, Microsoft Teams o certificaciones de Google for Education."
  },
  {
    q: "¿Debo listar talleres y conferencias dictados?",
    a: "Sí, demuestra tu proactividad y liderazgo en la comunidad educativa. Puedes añadirlos en la sección de certificaciones o proyectos."
  }
];

const crossLinks = [
  { label: "Ing. de Software", to: "/software-engineer-resume-template" },
  { label: "Enfermera", to: "/nurse-resume-template" },
  { label: "Contador", to: "/accountant-resume-template" },
  { label: "Gerente de RR. HH.", to: "/hr-manager-resume-template" },
  { label: "Abogado", to: "/lawyer-resume-template" }
];

function TeacherLandingPage() {
  return (
    <TemplateLandingPage
      templateId="education-teacher"
      title="Plantilla de Currículum para Docente Académico"
      description="Prestigio y sobriedad educativa. Con tipografía serif elegante que brinda formalidad institucional y apartados específicos para destacar asignaturas impartidas, cursos continuos y planeación didáctica."
      profession="Docente"
      category="Profesional"
      schemaDescription="Plantilla de currículum para docentes y profesores de nivel primaria, secundaria o universitaria en México."
      faqs={faqs}
      sampleDoc={teacherSample}
      crossLinks={crossLinks}
    />
  );
}
