import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { salesExecutiveSample } from "@/lib/resume/industry-samples";

export const Route = createFileRoute("/sales-executive-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla CV Ejecutivos de Ventas | CVAI" },
      {
        name: "description",
        content: "Crea tu CV comercial de alto impacto. Diseñado para ejecutivos de ventas, KAMs y gerentes comerciales. Destaca metas B2B y métricas.",
      },
      { property: "og:title", content: "Plantilla CV Ejecutivos de Ventas | CVAI" },
      { property: "og:url", content: "/sales-executive-resume-template" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/sales-executive-resume-template" }],
  }),
  component: SalesExecutiveLandingPage,
});

const faqs = [
  {
    q: "¿Por qué las métricas de ingresos son indispensables en ventas?",
    a: "Un currículum de ventas sin números no vende. Es vital que muestres porcentajes de cumplimiento de cuota (e.g. '120% de cuota anual'), valor de cartera gestionada y nuevos clientes cerrados."
  },
  {
    q: "¿Cómo listar herramientas de ventas?",
    a: "Estructura tus habilidades mencionando CRMs específicos (Salesforce, HubSpot, Zoho), metodologías de prospección en frío y técnicas de cierre corporativo B2B."
  },
  {
    q: "¿Debería resaltar mis premios y reconocimientos?",
    a: "Sí. Logros como 'Vendedor del Año' o superación histórica de metas demuestran tu consistencia comercial y deben tener un lugar especial en tu CV."
  }
];

const crossLinks = [
  { label: "Gerente de Proyectos", to: "/project-manager-resume-template" },
  { label: "Gerente de RR. HH.", to: "/hr-manager-resume-template" },
  { label: "Contador", to: "/accountant-resume-template" },
  { label: "Ing. de Software", to: "/software-engineer-resume-template" },
  { label: "Abogado", to: "/lawyer-resume-template" }
];

function SalesExecutiveLandingPage() {
  return (
    <TemplateLandingPage
      templateId="sales-executive-results"
      title="Plantilla de Currículum para Ventas de Alto Impacto"
      description="Orientado al cumplimiento de cuotas y objetivos comerciales. Con acentos verde esmeralda enfocados al rendimiento financiero, espacios para métricas de retención de cuentas y listado de software CRM de ventas."
      profession="Ventas"
      category="Ejecutivo"
      schemaDescription="Plantilla de currículum comercial y enfocada en métricas B2B para ejecutivos y gerentes de ventas en México."
      faqs={faqs}
      sampleDoc={salesExecutiveSample}
      crossLinks={crossLinks}
    />
  );
}
