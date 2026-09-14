import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Calendar, Clock, User, ArrowLeft, Share2, CheckCircle2, XCircle,
  Sparkles, FileText, Check, ChevronRight, HelpCircle, ShieldAlert,
  Download, Eye, Lightbulb, Bookmark, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const title = params.slug === "como-hacer-un-curriculum-vitae-mexico"
      ? "¿Cómo hacer un currículum vitae en México? Guía paso a paso (2026) | CVAI"
      : "Blog de Carrera y Empleo en México | CVAI";

    const description = params.slug === "como-hacer-un-curriculum-vitae-mexico"
      ? "Aprende cómo hacer un currículum vitae profesional en México paso a paso. Conoce qué poner, ejemplos reales antes/después, optimización para filtros ATS y formatos recomendados."
      : "Consejos prácticos, guías de empleo y redacción de CV profesional adaptados al mercado laboral de México.";

    const canonicalUrl = `https://www.cvai.com.mx/blog/${params.slug}`;

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "¿Cómo hacer un currículum vitae en México? Guía paso a paso para crear un CV profesional",
      description: description,
      inLanguage: "es-MX",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      author: {
        "@type": "Organization",
        name: "Equipo Editorial de CVAI México",
        url: "https://www.cvai.com.mx",
      },
      publisher: {
        "@type": "Organization",
        name: "CVAI",
        logo: {
          "@type": "ImageObject",
          url: "https://www.cvai.com.mx/logo.png",
        },
      },
      datePublished: "2026-09-14",
      dateModified: "2026-09-14",
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Es obligatorio poner foto en el currículum vitae en México?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No es obligatorio por ley y las empresas multinacionales con filtros ATS prefieren CVs sin fotografía para evitar sesgos de contratación. En algunas empresas tradicionales o puestos presenciales aún se acostumbra; si decides ponerla, usa ropa formal y fondo neutro.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuántas hojas debe tener un currículum profesional?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La regla estándar en México es 1 sola cuartilla (página). Si cuentas con más de 8 o 10 años de experiencia relevante con múltiples puestos de liderazgo, puedes extenderte a 2 páginas como máximo.",
          },
        },
        {
          "@type": "Question",
          name: "¿Debo poner mi CURP, RFC o dirección completa en mi CV?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Por tu propia seguridad en México, nunca incluyas tu CURP, RFC, estado civil ni la dirección completa con calle y número. Solo indica tu ciudad y estado (por ejemplo: Monterrey, Nuevo León o Ciudad de México).",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué formato es mejor para enviar el currículum: Word o PDF?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Siempre envía tu currículum en formato PDF para asegurar que el diseño no se desconfigure en diferentes computadoras y teléfonos celulares.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo justificar pausas o huecos laborales en mi CV?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sé honesto y enfócate en lo que hiciste durante ese periodo: capacitaciones, cursos, proyectos freelance o consultorías independientes.",
          },
        },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(articleSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(faqSchema),
        },
      ],
    };
  },
  component: BlogPostDetail,
});

function BlogPostDetail() {
  const { slug } = Route.useParams();
  const [copied, setCopied] = useState(false);

  // Quick copy link functionality
  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Enlace copiado al portapapeles");
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumbs */}
      <div className="border-b border-border/40 bg-secondary/20">
        <div className="mx-auto max-w-4xl px-4 py-3 text-xs text-muted-foreground">
          <nav className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-xs sm:max-w-md">
              ¿Cómo hacer un currículum vitae en México?
            </span>
          </nav>
        </div>
      </div>

      {/* Article Header Hero */}
      <header className="border-b border-border/50 bg-gradient-to-b from-secondary/40 to-background py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="default" className="rounded-full px-3 py-0.5 text-xs font-semibold">
              Guía Completa
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 12 min de lectura
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Actualizado para 2026
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-tight">
            ¿Cómo hacer un currículum vitae en México? Guía paso a paso para crear un CV profesional
          </h1>

          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Aprende a redactar un currículum que supere los filtros automáticos ATS y convenza a los reclutadores en México. Incluye estructura recomendada, ejemplos reales antes/después y consejos prácticos.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                CV
              </div>
              <div>
                <p className="text-sm font-semibold">Equipo Editorial de CVAI</p>
                <p className="text-xs text-muted-foreground">Especialistas en Empleabilidad y ATS en México</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5 text-xs">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? "Enlace copiado" : "Compartir guía"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Article Text (8 cols) */}
          <article className="lg:col-span-8 space-y-8 text-foreground/90 leading-relaxed text-[16px]">
            
            {/* Introducción */}
            <section className="space-y-4">
              <p className="text-lg leading-relaxed text-foreground font-medium">
                El mercado laboral en México ha cambiado drásticamente. Hoy en día, una vacante publicada en portales como LinkedIn, OCCMundial o Computrabajo puede recibir más de 200 postulaciones en sus primeras 24 horas.
              </p>
              <p>
                Frente a este volumen, los reclutadores dedican en promedio <strong>entre 6 y 8 segundos</strong> a escanear un documento antes de descartarlo o colocarlo en la lista de preseleccionados. Además, cada vez más empresas medianas y grandes en el país filtran los archivos a través de sistemas de seguimiento de candidatos (<strong>ATS</strong>) antes de que un ojo humano los lea.
              </p>
              <p>
                Si buscas aprender <strong>cómo hacer un currículum vitae</strong> competitivo que consiga entrevistas, esta guía te muestra exactamente qué poner, qué evitar, cómo redactar logros con impacto y cómo estructurar un <Link to="/curriculum-vitae" className="font-medium text-primary underline underline-offset-2 hover:opacity-80">currículum vitae profesional</Link> para México.
              </p>
            </section>

            {/* Qué es un CV */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                ¿Qué es un currículum vitae y cuál es su objetivo real?
              </h2>
              <p>
                Un currículum vitae (CV) no es tu autobiografía laboral ni un trámite burocrático. Es, en esencia, un <strong>documento de marketing personal</strong>.
              </p>
              <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-4 text-sm text-foreground/90">
                <p className="font-medium">
                  <strong>Regla de oro:</strong> El objetivo de un currículum no es conseguirte el empleo de forma inmediata, sino <strong>conseguirte la llamada para la primera entrevista</strong>.
                </p>
              </div>
              <p>
                Debe responder con rapidez y claridad a la pregunta que se hace todo gerente de contratación: <em>"¿Tiene esta persona la capacidad y los resultados comprobables para resolver los retos de este puesto?"</em>.
              </p>
            </section>

            {/* Estructura general */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                ¿Qué información debe incluir un CV en México?
              </h2>
              <p>
                Para mantener el documento claro y fácil de escanear en una sola cuartilla, organiza la información en los siguientes bloques esenciales:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                <li><strong className="text-foreground">Datos de contacto:</strong> Nombre, celular con lada, correo profesional, ciudad/estado y LinkedIn.</li>
                <li><strong className="text-foreground">Perfil profesional:</strong> Resumen de 3 a 4 líneas enfocado en tu especialidad y propuesta de valor.</li>
                <li><strong className="text-foreground">Experiencia laboral:</strong> Puestos anteriores con viñetas orientadas a resultados numéricos.</li>
                <li><strong className="text-foreground">Educación:</strong> Último grado de estudios concluido o en curso.</li>
                <li><strong className="text-foreground">Habilidades:</strong> Competencias técnicas (hard skills) y humanas (soft skills).</li>
                <li><strong className="text-foreground">Idiomas y Certificaciones:</strong> Nivel de dominio real y cursos con validez oficial.</li>
              </ul>
            </section>

            {/* 1. Datos de Contacto */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                1. Datos de contacto: Claridad y privacidad
              </h2>
              <p>
                En México es fundamental proteger tus datos personales sin dificultar que el reclutador te contacte rápidamente por teléfono o WhatsApp:
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                    <CheckCircle2 className="h-4 w-4" /> Lo que SÍ debes poner:
                  </div>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• Nombre completo y apellido(s) legible</li>
                    <li>• Titular profesional (ej. <em>Desarrollador Web Full Stack</em>)</li>
                    <li>• Ciudad y Estado (ej. <em>Querétaro, Qro.</em>)</li>
                    <li>• Celular con clave lada mexicana (+52)</li>
                    <li>• Correo electrónico serio (ej. <code>nombre.apellido@email.com</code>)</li>
                    <li>• Enlace directo a tu perfil de LinkedIn</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-destructive mb-2">
                    <XCircle className="h-4 w-4" /> Lo que NUNCA debes poner:
                  </div>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• Calle, número exterior, interior ni colonia (por seguridad)</li>
                    <li>• Clave CURP ni RFC (solo se piden al firmar contrato)</li>
                    <li>• Estado civil, religión ni afiliación política</li>
                    <li>• Número de Seguridad Social (NSS)</li>
                    <li>• Correos informales de tu adolescencia</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 2. Perfil profesional */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                2. Perfil profesional: Tu argumento de venta en 4 líneas
              </h2>
              <p>
                El extracto o perfil profesional es lo primero que leerán. Debe sintetizar tu trayectoria y tu valor sin recurrir a frases trilladas como <em>"persona puntual con ganas de superarse"</em>.
              </p>

              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fórmula recomendada:</p>
                <p className="text-sm font-mono bg-muted/50 p-3 rounded-lg border border-border/60">
                  [Profesión / Rol] + [Años de experiencia o especialidad] + [Logro o impacto con métrica] + [Valor que puedes aportar a la empresa]
                </p>
              </div>

              {/* Antes y Después */}
              <div className="space-y-3">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-xs">
                  <span className="font-bold text-destructive uppercase tracking-wide">❌ Ejemplo Débil:</span>
                  <p className="mt-1 text-muted-foreground italic">
                    "Soy una persona proactiva, honesta y trabajadora, con disposición de aprender y adaptarme a cualquier ambiente de trabajo en una empresa que me permita crecer."
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">✅ Ejemplo Profesional con Impacto:</span>
                  <p className="mt-1 text-foreground font-medium">
                    "Licenciado en Administración y Finanzas con más de 6 años de experiencia en gestión de tesorería y cuentas por cobrar en el sector logístico mexicano. Implementé la conciliación bancaria automatizada reduciendo los cierres contables de 7 a 2 días hábiles. Bilingüe (Español/Inglés C1) y con dominio avanzado de SAP y Excel."
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Experiencia Laboral */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                3. Experiencia laboral: Convierte tareas en logros medibles
              </h2>
              <p>
                El mayor error en los currículums mexicanos es limitarse a copiar y pegar la lista de responsabilidades del contrato. Los seleccionadores quieren ver <strong>resultados concretos</strong>.
              </p>
              <p>
                Estructura cada puesto con:
              </p>
              <div className="rounded-xl border border-border bg-card p-4 text-xs space-y-1.5 font-mono">
                <p className="font-bold text-primary">Nombre del Puesto | Empresa — Ciudad, Estado</p>
                <p className="text-muted-foreground">Mes Año Inicio – Mes Año Fin (o "Presente")</p>
                <p className="text-muted-foreground">• Verbo de acción + Qué hiciste + Resultado o impacto (%)</p>
              </div>

              {/* Comparativa */}
              <div className="grid gap-3 pt-2">
                <div className="rounded-xl border border-border p-4 bg-muted/20">
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Ejemplo en Ventas / Comercial:</div>
                  <div className="space-y-2 text-xs">
                    <p className="text-destructive"><span className="font-bold">❌ Antes:</span> "Encargado de vender productos y atender clientes en mostrador."</p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-medium"><span className="font-bold">✅ Después:</span> "Superé la meta regional de colocación comercial en un 118% durante 4 trimestres consecutivos, generando más de $3.5 MDP en ventas de contratos anuales."</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border p-4 bg-muted/20">
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Ejemplo en Recursos Humanos:</div>
                  <div className="space-y-2 text-xs">
                    <p className="text-destructive"><span className="font-bold">❌ Antes:</span> "Publicaba vacantes y entrevistaba candidatos para la planta."</p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-medium"><span className="font-bold">✅ Después:</span> "Reduje el tiempo de cobertura de vacantes operativas de 25 a 14 días mediante la digitalización de filtros técnicos iniciales, alcanzando un 92% de retención al primer año."</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                ¿Buscas inspiración para tu profesión específica? Explora nuestros <Link to="/curriculum-vitae-ejemplos" className="text-primary underline font-medium">ejemplos de currículum vitae por puesto</Link>.
              </p>
            </section>

            {/* 4. Educación y Habilidades */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                4. Educación y Habilidades requeridas
              </h2>
              <p>
                En educación, incluye únicamente el grado más alto obtenido o en curso (Licenciatura, Ingeniería, Maestría o Carrera Técnica). No agregues preparatoria, secundaria ni primaria.
              </p>

              <h3 className="font-display text-lg font-semibold text-foreground pt-2">
                Habilidades Técnicas (Hard Skills) vs. Habilidades Humanas (Soft Skills)
              </h3>
              <p className="text-sm">
                Las empresas en México buscan una combinación equilibrada de herramientas tecnológicas y capacidad de trabajo en equipo:
              </p>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-foreground font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Habilidades Técnicas (Hard Skills)</th>
                      <th className="py-2.5 px-3">Habilidades Humanas (Soft Skills)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-muted-foreground">
                    <tr>
                      <td className="py-2 px-3">Excel avanzado (Macros, XLOOKUP, Tablas dinámicas)</td>
                      <td className="py-2 px-3">Negociación asertiva con clientes y proveedores</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Manejo de ERP (SAP, CONTPAQi, Oracle)</td>
                      <td className="py-2 px-3">Liderazgo y gestión de equipos multiculturales</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Facturación electrónica CFDI 4.0</td>
                      <td className="py-2 px-3">Resolución ágil de problemas bajo presión</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Google Analytics 4 / Power BI / SQL</td>
                      <td className="py-2 px-3">Pensamiento analítico y toma de decisiones con datos</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 5. Idiomas: Olvídate del "Inglés 80%" */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                5. Idiomas: Dile adiós al "Inglés 80%"
              </h2>
              <p>
                Poner porcentajes como <em>"Inglés 70%"</em> o <em>"Inglés 85%"</em> es uno de los hábitos más comunes en México, pero los reclutadores no pueden interpretarlo objetivamente.
              </p>
              <p>
                Utiliza términos descriptivos o la escala del Marco Común Europeo (MCER):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li><strong className="text-foreground">Español:</strong> Nativo.</li>
                <li><strong className="text-foreground">Inglés:</strong> Profesional avanzado (C1) — Negociación fluida y juntas de negocios.</li>
                <li><strong className="text-foreground">Inglés:</strong> Intermedio conversacional (B2) — Capaz de sostener llamadas y responder correos técnicos.</li>
                <li><strong className="text-foreground">Certificaciones oficiales:</strong> Menciona tu puntaje TOEFL, IELTS o Cambridge si cuentas con él.</li>
              </ul>
            </section>

            {/* 6. Optimización ATS */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                6. Cómo optimizar tu CV para filtros ATS
              </h2>
              <p>
                Los sistemas ATS (como Taleo, Workday, BambooHR o Greenhouse) son programas que escanean los currículums en busca de palabras clave antes de que una persona los revise. Si tu formato es confuso, el sistema descartará tu perfil.
              </p>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <Lightbulb className="h-4 w-4" /> Consejos para superar el filtro ATS:
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li>• <strong>Usa encabezados tradicionales:</strong> "Experiencia laboral", "Educación", "Habilidades".</li>
                  <li>• <strong>Evita barras de porcentaje o estrellitas:</strong> Un algoritmo no puede interpretar "⭐⭐⭐⭐ en Photoshop".</li>
                  <li>• <strong>Tipografía estándar:</strong> Inter, Arial, Calibri o Roboto con tamaños legibles (10 a 12 pt).</li>
                  <li>• <strong>Exporta siempre en PDF estándar:</strong> Mantén el texto como vectores seleccionables, nunca como imagen.</li>
                  <li>• <strong>Nombre del archivo:</strong> <code>CV_Nombre_Apellido_Puesto.pdf</code> en lugar de <code>CV_Final_2026.pdf</code>.</li>
                </ul>
              </div>

              <p className="text-sm">
                Puedes comprobar la legibilidad de tu archivo con nuestro <Link to="/ats-checker" className="text-primary underline font-medium">verificador ATS gratuito</Link>.
              </p>
            </section>

            {/* Checklist */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Checklist final antes de enviar tu postulación
              </h2>
              <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-2.5 text-sm">
                {[
                  "¿El documento cabe en 1 página (o máximo 2 si tienes más de 8 años de trayectoria)?",
                  "¿Tus datos de contacto están actualizados e incluyen ciudad, celular y correo serio?",
                  "¿Omitiste datos privados sensibles como CURP, RFC y dirección física exacta?",
                  "¿Tus viñetas de experiencia laboral incluyen porcentajes, números o logros cuantificables?",
                  "¿Revisaste la ortografía y la puntuación minuciosamente?",
                  "¿El archivo está guardado en formato PDF con un nombre profesional?",
                  "¿Las palabras clave de la vacante coinciden con las habilidades mencionadas en tu CV?",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Accordion */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" /> Preguntas Frecuentes
              </h2>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger className="text-left text-sm font-semibold">
                    ¿Es obligatorio poner foto en el currículum vitae en México?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    No existe ninguna ley en México que obligue a incluir fotografía en el CV. En empresas transnacionales y vacantes de tecnología se recomienda omitirla para evitar sesgos de contratación. Si postulas a una empresa tradicional mexicana o un puesto de atención a clientes donde la requieran, incluye una foto formal con vestimenta sobria y fondo neutro.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2">
                  <AccordionTrigger className="text-left text-sm font-semibold">
                    ¿Cómo hacer un currículum si no tengo experiencia laboral?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Coloca tu sección de educación en la parte superior. Detalla tu servicio social, prácticas profesionales, voluntariados, proyectos académicos sobresalientes y herramientas de software que domines. Puedes comenzar fácilmente usando nuestro creador de <Link to="/curriculum-vitae-gratis" className="text-primary underline">currículum vitae gratis</Link>.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3">
                  <AccordionTrigger className="text-left text-sm font-semibold">
                    ¿Debo incluir cartas de recomendación o referencias en el CV?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    No es necesario colocarlas en el cuerpo del currículum ni agregar la frase "Referencias a solicitud". Mantén tus cartas y teléfonos de exjefes listos en una hoja separada para entregarlos cuando la empresa te los solicite en las etapas finales.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4">
                  <AccordionTrigger className="text-left text-sm font-semibold">
                    ¿Qué formato es mejor: Word o PDF?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Siempre exporta y envía tu currículum en formato PDF. Esto garantiza que las fuentes, márgenes y alineaciones se vean idénticos en cualquier computadora o teléfono celular del reclutador.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Bottom CTA Card */}
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-8 text-center space-y-4 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Crea tu currículum profesional con Inteligencia Artificial
              </h3>
              <p className="mx-auto max-w-lg text-sm text-muted-foreground">
                En <strong>CVAI</strong> te ayudamos a redactar viñetas de logros con métricas, elegir plantillas optimizadas para filtros ATS y descargar tu CV en minutos.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link to="/plantillas-curriculum-vitae">
                  <Button variant="outline">Ver plantillas de CV</Button>
                </Link>
                <Link to="/curriculum-vitae">
                  <Button className="gap-2">
                    Crear mi currículum ahora <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

          </article>

          {/* Sidebar Navigation & Quick Links (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Table of contents card */}
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-primary" /> Índice de la guía
              </h3>
              <nav className="space-y-2 text-xs">
                {[
                  "¿Qué es un currículum vitae?",
                  "¿Qué información debe incluir?",
                  "1. Datos de contacto y privacidad",
                  "2. Perfil profesional con fórmula",
                  "3. Experiencia laboral con logros",
                  "4. Educación y habilidades clave",
                  "5. Idiomas: Escala internacional",
                  "6. Cómo superar los filtros ATS",
                  "Checklist final de postulación",
                  "Preguntas Frecuentes",
                ].map((item, i) => (
                  <div key={i} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                    <span>{item}</span>
                  </div>
                ))}
              </nav>

              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold mb-2">Herramientas gratuitas:</p>
                <div className="space-y-1.5 text-xs">
                  <Link to="/ats-checker" className="block text-primary hover:underline flex items-center justify-between">
                    <span>Verificador ATS</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <Link to="/plantillas-curriculum-vitae" className="block text-primary hover:underline flex items-center justify-between">
                    <span>Plantillas para México</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <Link to="/curriculum-vitae-ejemplos" className="block text-primary hover:underline flex items-center justify-between">
                    <span>Ejemplos por profesión</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
