import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { seniorSample } from "@/lib/resume/stage-samples";

export const Route = createFileRoute("/senior-professional-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla de Currículum para Especialistas Senior || CVAI" },
      {
        name: "description",
        content: "Crea tu currículum de nivel senior. Diseño premium asimétrico para gerentes, directores y jefes de área de más de 7 años de experiencia.",
      },
      { property: "og:title", content: "Plantilla de CV para Especialistas Senior || CVAI" },
      { property: "og:url", content: "/senior-professional-resume-template" },
    ],
    links: [{ rel: "canonical", href: "/senior-professional-resume-template" }],
  }),
  component: SeniorProfessionalLandingPage,
});

const faqs = [
  {
    q: "¿Qué buscan los reclutadores en un CV de nivel Senior?",
    a: "Buscan comprobar liderazgo estratégico y capacidad de gestión de equipos y presupuestos. Es fundamental incluir cifras de ahorro (e.g. 'reduje Scrap en 18%') y volumen de personal coordinado."
  },
  {
    q: "¿Es importante incluir premios o reconocimientos?",
    a: "Sí, a nivel Senior los premios estatales, corporativos o de asociaciones de la industria validan tu liderazgo en el ramo frente al mercado mexicano."
  },
  {
    q: "¿Cómo redactar la sección de certificaciones?",
    a: "Coloca certificaciones robustas y de prestigio internacional (como Six Sigma Black Belt, PMP o ITIL) que respalden tu experiencia ejecutiva."
  }
];

const crossLinks = [
  { label: "Especialista Mid-Level", to: "/mid-level-resume-template" },
  { label: "Dirección Ejecutiva", to: "/executive-resume-template" },
  { label: "CEO Élite", to: "/ceo-resume-template" },
  { label: "Trabajo en Gobierno", to: "/government-resume-template" },
  { label: "Freelancer Creativo", to: "/freelancer-resume-template" }
];

function SeniorProfessionalLandingPage() {
  return (
    <TemplateLandingPage
      templateId="stage-senior"
      title="Plantilla de Currículum para Especialista Senior"
      description="Liderazgo directivo y asimetría de prestigio. Diseñada para gerentes generales, jefes de área y directores de planta en México (7+ años de experiencia). Estilo charcoal sobrio con foco en logros macro."
      profession="Profesional Senior"
      category="Ejecutivo"
      schemaDescription="Plantilla de currículum ejecutiva y asimétrica para especialistas y gerentes senior en México."
      faqs={faqs}
      sampleDoc={seniorSample}
      crossLinks={crossLinks}
    />
  );
}
