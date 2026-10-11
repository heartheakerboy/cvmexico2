import { createFileRoute } from "@tanstack/react-router";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { accountantSample } from "@/lib/resume/industry-samples";

export const Route = createFileRoute("/accountant-resume-template")({
  head: () => ({
    meta: [
      { title: "Plantilla CV Contadores Públicos ATS | CVAI" },
      {
        name: "description",
        content: "Crea tu currículum de contador público optimizado para el SAT y sistemas ATS. Formato limpio de una columna para auditoría y finanzas.",
      },
      { property: "og:title", content: "Plantilla CV Contadores Públicos ATS | CVAI" },
      { property: "og:url", content: "/accountant-resume-template" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/accountant-resume-template" }],
  }),
  component: AccountantLandingPage,
});

const faqs = [
  {
    q: "¿Por qué se recomienda no incluir foto en un CV contable?",
    a: "Las firmas de auditoría internacionales (Big Four) y grandes corporativos en México recomiendan plantillas sin foto para evitar sesgos inconscientes en las primeras fases y maximizar la lectura automática del software ATS."
  },
  {
    q: "¿Qué software de contabilidad debo resaltar?",
    a: "Destaca tu dominio en ERPs globales como SAP o SQL, además de software local del mercado mexicano como CONTPAQi, COI, NOI y hojas de cálculo avanzadas (Excel)."
  },
  {
    q: "¿Cómo redactar los logros contables?",
    a: "Enfócate en montos de recuperación fiscal, reducción de tiempos de conciliación bancaria, optimizaciones fiscales dentro del marco de la ley y auditorías exitosas realizadas."
  }
];

const crossLinks = [
  { label: "Abogado", to: "/lawyer-resume-template" },
  { label: "Gerente de Proyectos", to: "/project-manager-resume-template" },
  { label: "Ejecutivo de Ventas", to: "/sales-executive-resume-template" },
  { label: "Ing. de Software", to: "/software-engineer-resume-template" },
  { label: "Gerente de RR. HH.", to: "/hr-manager-resume-template" }
];

function AccountantLandingPage() {
  return (
    <TemplateLandingPage
      templateId="corporate-accountant"
      title="Plantilla de Currículum para Contador Corporativo"
      description="Optimización al extremo y formato limpio. Una sola columna sin foto que supera el 99% de compatibilidad con filtros ATS. Ideal para despachos contables y áreas de finanzas corporativas en México."
      profession="Contador"
      category="ATS"
      schemaDescription="Plantilla de currículum limpia e higiénica para contadores públicos y auditores financieros en México."
      faqs={faqs}
      sampleDoc={accountantSample}
      crossLinks={crossLinks}
    />
  );
}
