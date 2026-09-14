import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Download,
  FileText, Briefcase, Award, Zap, HelpCircle, Star, Users,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/curriculum-vitae")({
  head: () => ({
    meta: [
      {
        title: "Crear Currículum Vitae con Inteligencia Artificial Gratis | CVAI México",
      },
      {
        name: "description",
        content:
          "Crea tu currículum profesional en minutos con inteligencia artificial optimizado para ATS en México. Elige entre plantillas modernas, redacta con IA y descarga en PDF.",
      },
      { property: "og:title", content: "Crear Currículum Vitae con IA Gratis | CVAI México" },
      {
        property: "og:description",
        content: "Constructor de CV con IA para el mercado mexicano. Plantillas ATS, redacción automática y exportación en PDF.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.cvai.com.mx/curriculum-vitae" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/curriculum-vitae" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "CVAI - Creador de Currículum Vitae con IA",
          url: "https://www.cvai.com.mx/curriculum-vitae",
          description:
            "Herramienta en línea para crear currículums profesionales optimizados para sistemas ATS en el mercado laboral mexicano.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "All",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "MXN",
          },
        }),
      },
    ],
  }),
  component: CurriculumVitaeLanding,
});

const POPULAR_TEMPLATES = [
  {
    title: "Ingeniero de Software",
    desc: "Barra lateral técnica optimizada para lenguajes, frameworks y proyectos GitHub.",
    link: "/software-engineer-resume-template",
    tag: "Técnico / ATS",
  },
  {
    title: "Contador Corporativo",
    desc: "Estructura limpia de una columna con enfoque en SAT, finanzas y auditoría.",
    link: "/accountant-resume-template",
    tag: "Finanzas / SAT",
  },
  {
    title: "Ventas de Alto Impacto",
    desc: "Diseño comercial con insignias de metas alcanzadas y revenue anual.",
    link: "/sales-executive-resume-template",
    tag: "Comercial / B2B",
  },
  {
    title: "Estudiante Académico",
    desc: "Diseñado para resaltar servicio social, becas y proyectos escolares sin experiencia.",
    link: "/student-resume-template",
    tag: "Estudiantes",
  },
  {
    title: "Dirección Ejecutiva",
    desc: "Formato elegante para directores, VPs y gerentes de alto nivel en México.",
    link: "/executive-resume-template",
    tag: "Ejecutivo",
  },
  {
    title: "Diseñador Gráfico",
    desc: "Estilo moderno y visual con enlaces directos a Behance, Dribbble y portafolio.",
    link: "/graphic-designer-resume-template",
    tag: "Creativo",
  },
];

function CurriculumVitaeLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-secondary/40 via-background to-background py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Constructor de CV con Inteligencia Artificial para México
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground leading-tight">
            Crea tu Currículum Vitae Profesional en Minutos
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Diseñado para superar los filtros ATS y destacar ante reclutadores de las principales empresas en México. Redacta logros con IA, elige plantillas profesionales y descarga tu CV gratis.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/plantillas">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                Elegir plantilla gratis <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/ats-checker">
              <Button size="lg" variant="outline" className="gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Evaluar mi CV actual
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 100% Compatible con ATS
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Exportación PDF instantánea
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Adaptado al mercado laboral mexicano
            </span>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="mx-auto max-w-5xl px-4 py-16 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Cómo crear tu CV en 3 sencillos pasos
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Sin complicaciones de diseño ni formatos rotos. Enfócate en tu talento.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 relative shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base">
              1
            </div>
            <h3 className="font-display font-bold text-foreground text-lg">Elige una plantilla probada</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Selecciona un diseño optimizado para tu industria: ingenierías, finanzas, ventas, directivos o recién egresados sin experiencia.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 relative shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base">
              2
            </div>
            <h3 className="font-display font-bold text-foreground text-lg">Personaliza con apoyo de IA</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Genera resúmenes profesionales y redacta tus logros con verbos de acción y métricas cuantificables en español mexicano.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 relative shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base">
              3
            </div>
            <h3 className="font-display font-bold text-foreground text-lg">Descarga y postúlate</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Exporta tu archivo en PDF de alta fidelidad listo para adjuntar en OCCMundial, LinkedIn, Computrabajo o portales corporativos.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Templates Showcase */}
      <section className="bg-secondary/20 border-y border-border py-16">
        <div className="mx-auto max-w-5xl px-4 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs font-semibold">
                Modelos destacados
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
                Plantillas de CV más utilizadas en México
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Consulta los diseños con mayor índice de contacto en entrevistas:
              </p>
            </div>
            <Link to="/plantillas">
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                Ver todas las plantillas <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_TEMPLATES.map((t, idx) => (
              <div
                key={idx}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {t.tag}
                  </Badge>
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-border/60">
                  <Link to={t.link}>
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                      Ver plantilla gratis <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Preguntas frecuentes sobre el creador de CV
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Todo lo que necesitas saber para armar tu currículum profesional.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="faq-1">
            <AccordionTrigger className="text-left text-sm font-semibold">
              ¿Es gratis crear y descargar mi currículum en CVAI?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              Sí, puedes elegir plantillas gratuitas, completar tu información y descargar tu currículum en PDF sin costo. También contamos con funciones avanzadas Pro para usuarios que desean sugerencias de IA ilimitadas y plantillas ejecutivas exclusivas.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2">
            <AccordionTrigger className="text-left text-sm font-semibold">
              ¿Las plantillas de CVAI superan los filtros de selección ATS?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              Sí. Todas nuestras plantillas han sido estructuradas siguiendo los estándares de extracción técnica de los sistemas ATS utilizados en México (Workday, Taleo, SuccessFactors, LinkedIn y OCCMundial), asegurando que el texto se procese sin errores de lectura.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3">
            <AccordionTrigger className="text-left text-sm font-semibold">
              ¿Cómo me ayuda la Inteligencia Artificial a redactar mi CV?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              La IA de CVAI analiza tu profesión y sugiere resúmenes ejecutivos impactantes, listas de responsabilidades clave y redacción de logros cuantificados adaptados a la cultura laboral y términos comunes en México.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA Bottom Banner */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-secondary/30 p-8 sm:p-12 text-center space-y-5 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            ¿Listo para conseguir tu próximo trabajo?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Comienza hoy mismo tu currículum profesional y acelera tus oportunidades laborales en México.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/plantillas">
              <Button size="lg" className="gap-2">
                Explorar plantillas de CV <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline" size="lg">
                Leer guías de empleo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
