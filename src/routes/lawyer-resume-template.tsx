import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { lawyerSample } from "@/lib/resume/industry-samples";

export const Route = createFileRoute("/lawyer-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla CV Abogados y Litigantes | CVAI" },
      {
        name: "description",
        content: "Crea tu currículum legal premium. Formato serif elegante para abogados corporativos, civilistas y penalistas en México. Pruébala gratis.",
      },
      { property: "og:title", content: "Plantilla CV Abogados y Litigantes | CVAI" },
      { property: "og:url", content: "/lawyer-resume-template" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/lawyer-resume-template" }],
  }),
  component: LawyerLandingPage,
});

const faqs = [
  {
    q: "¿Qué datos de cédula debo incluir en mi CV de abogado?",
    a: "Es fundamental incluir tu número de Cédula Profesional Federal de la SEP para que el reclutador valide tu registro para ejercer el litigio de inmediato en México."
  },
  {
    q: "¿Cómo organizar casos y proyectos importantes?",
    a: "Agrégalos bajo secciones con descripciones breves cuidando la confidencialidad de tus clientes (e.g. 'Defensa de multinacional en litigio mercantil de $5M USD')."
  },
  {
    q: "¿Debería listar asociaciones civiles u colegiaciones?",
    a: "Sí. En México, estar colegiado en la Barra Mexicana de Abogados (BMA) o en la ANADE aporta un nivel de seriedad y reputación muy valorado en el ámbito jurídico."
  }
];

const crossLinks = [
  { label: "Contador", to: "/accountant-resume-template" },
  { label: "Gerente de Proyectos", to: "/project-manager-resume-template" },
  { label: "Docente", to: "/teacher-resume-template" },
  { label: "Ing. de Software", to: "/software-engineer-resume-template" },
  { label: "Gerente de RR. HH.", to: "/hr-manager-resume-template" }
];

function LawyerLandingPage() {
  return (
    <TemplateLandingPage
      templateId="executive-lawyer"
      title="Plantilla de Currículum para Ejecutivo Legal Pro"
      description="Tradición de prestigio en blanco y negro. Diseñado con tipografía serif sobria, separaciones de línea clásicas y cuadrantes específicos para juicios emblemáticos, cédula profesional y asesoramiento regulatorio corporativo."
      profession="Abogado"
      category="Ejecutivo"
      schemaDescription="Plantilla de currículum elegante y de prestigio para abogados, consultores legales y asociados de firmas en México."
      faqs={faqs}
      sampleDoc={lawyerSample}
      crossLinks={crossLinks}
    />
  );
}
