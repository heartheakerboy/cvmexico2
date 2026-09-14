import { createFileRoute, Link } from "@tanstack/react-router";
import { getTemplate } from "@/lib/resume/registry";
import { TemplateLandingPage } from "@/components/resume/template-landing-page";
import { getSampleDocForTemplate } from "@/lib/resume/sample-resolver";

export const Route = createFileRoute("/plantillas/$id")({
  head: ({ params }) => {
    const tpl = getTemplate(params.id);
    const title = `Plantilla CV ${tpl.name} ATS | CVAI`;
    const description = `${tpl.description} Plantilla de CV profesional, optimizada para filtros ATS y adaptada al mercado laboral de México. Empieza gratis.`;
    const canonicalUrl = `https://www.cvai.com.mx/plantillas/${params.id}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalUrl },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  component: GenericTemplateLandingPage,
});

function GenericTemplateLandingPage() {
  const { id } = Route.useParams();
  const tpl = getTemplate(id);
  const sampleDoc = getSampleDocForTemplate(tpl.id);

  const faqs = [
    {
      q: `¿Por qué elegir la plantilla ${tpl.name} para postularme en México?`,
      a: `Esta plantilla ha sido diseñada para equilibrar legibilidad algorítmica para sistemas ATS con una estética profesional y limpia que llama la atención de reclutadores en empresas mexicanas.`,
    },
    {
      q: "¿Puedo personalizar los colores y tipografía de esta plantilla?",
      a: "Sí. Dentro del creador de CVAI puedes ajustar los colores de acento, fuentes, espaciado entre secciones y orden de bloques según tu perfil.",
    },
    {
      q: "¿Es necesario registrarme para ver y probar esta plantilla?",
      a: "No. Puedes explorar la estructura visual y verificar su compatibilidad ATS de manera completamente libre en CVAI.",
    },
  ];

  const crossLinks = [
    { label: "Ingeniero de Software", to: "/software-engineer-resume-template" },
    { label: "Contador Corporativo", to: "/accountant-resume-template" },
    { label: "Ejecutivo de Ventas", to: "/sales-executive-resume-template" },
    { label: "Estudiante Académico", to: "/student-resume-template" },
    { label: "Dirección Ejecutiva", to: "/executive-resume-template" },
  ];

  return (
    <TemplateLandingPage
      templateId={tpl.id}
      title={`Plantilla de Currículum: ${tpl.name}`}
      description={tpl.description || "Plantilla de currículum estructurada para superar los filtros de selección ATS y destacar ante reclutadores en México."}
      profession={tpl.name}
      category={tpl.category}
      schemaDescription={`Plantilla de currículum profesional ${tpl.name} compatible con ATS en México.`}
      faqs={faqs}
      sampleDoc={sampleDoc}
      crossLinks={crossLinks}
    />
  );
}
