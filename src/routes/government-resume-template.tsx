import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { governmentSample } from "@/lib/resume/stage-samples";

export const Route = createFileRoute("/government-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla CV Servidores Públicos | CVAI" },
      {
        name: "description",
        content: "Crea tu currículum oficial. Plantilla minimalista estructurada de una columna sin adornos para administración pública y gobierno en México.",
      },
      { property: "og:title", content: "Plantilla CV Servidores Públicos | CVAI" },
      { property: "og:url", content: "/government-resume-template" },
    ],
    links: [{ rel: "canonical", href: "/government-resume-template" }],
  }),
  component: GovernmentLandingPage,
});

const faqs = [
  {
    q: "¿Por qué los currículums gubernamentales deben ser tan austeros?",
    a: "Las dependencias públicas federales, estatales y municipales en México valoran la seriedad institucional, la claridad y la austeridad. Los adornos o colores brillantes distraen de la trayectoria regulatoria y la validez técnica."
  },
  {
    q: "¿Qué normatividad o capacitación gubernamental es valiosa?",
    a: "Destaca conocimientos y certificaciones en el PbR (Presupuesto basado en Resultados), control interno, auditorías de la ASF o transparencia del INAI."
  },
  {
    q: "¿Cómo organizar la experiencia en administración pública?",
    a: "Detalla el cargo, la secretaría o dirección, los programas sociales o técnicos operados, y el número de ciudadanos beneficiados bajo tu gestión."
  }
];

const crossLinks = [
  { label: "Dirección Ejecutiva", to: "/executive-resume-template" },
  { label: "CEO Élite", to: "/ceo-resume-template" },
  { label: "Contador Corporativo", to: "/accountant-resume-template" },
  { label: "Abogado Litigante", to: "/lawyer-resume-template" },
  { label: "Gerente de Proyectos", to: "/project-manager-resume-template" }
];

function GovernmentLandingPage() {
  return (
    <TemplateLandingPage
      templateId="stage-government"
      title="Plantilla de Currículum para Servidor Público"
      description="Institucionalidad, austeridad y cumplimiento regulatorio. Formato de una sola columna sin marcos decorativos ni imágenes, optimizado al 100% para procesos de carrera del Servicio Profesional de Carrera federal en México."
      profession="Servidor Público"
      category="ATS"
      schemaDescription="Plantilla de currículum oficial y austera de una columna para el sector público y gubernamental en México."
      faqs={faqs}
      sampleDoc={governmentSample}
      crossLinks={crossLinks}
    />
  );
}
