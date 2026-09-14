import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Calendar, Clock, Share2, CheckCircle2, XCircle, Sparkles, Check,
  ChevronRight, HelpCircle, Lightbulb, Bookmark, ArrowRight, Briefcase,
  GraduationCap, Laptop, TrendingUp, Palette, Calculator, Users, Award,
  Loader2, FileCheck, CheckSquare, Layers, AlertTriangle, ShieldCheck,
  Cpu, Database, Search,
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
    const isEjemplos = params.slug === "10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos";
    const isAts = params.slug === "que-es-un-curriculum-ats-como-hacer-cv-compatible" || params.slug === "cv-filtros-ats";

    let title = "¿Cómo hacer un currículum vitae en México? Guía paso a paso (2026) | CVAI";
    let description = "Aprende cómo hacer un currículum vitae profesional en México paso a paso. Conoce qué poner, ejemplos reales antes/después, optimización para filtros ATS y formatos recomendados.";

    if (isEjemplos) {
      title = "10 ejemplos de currículum vitae para diferentes trabajos (Guía México 2026) | CVAI";
      description = "Explora 10 ejemplos de currículum vitae reales adaptados a México: estudiantes, sin experiencia, recién egresados, ingenieros, ventas, directivos y trabajo remoto.";
    } else if (isAts) {
      title = "¿Qué es un currículum ATS y cómo hacer un CV compatible? (México 2026) | CVAI";
      description = "Descubre qué es un sistema ATS en México, cómo analizan tu CV las empresas y cómo optimizar el formato, estructura y palabras clave para superar los filtros de selección.";
    }

    const canonicalUrl = `https://www.cvai.com.mx/blog/${params.slug}`;

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: isEjemplos
        ? "10 ejemplos de currículum vitae para diferentes trabajos y perfiles profesionales"
        : isAts
        ? "¿Qué es un currículum ATS y cómo hacer un CV que pase los filtros de selección?"
        : "¿Cómo hacer un currículum vitae en México? Guía paso a paso para crear un CV profesional",
      description: description,
      inLanguage: "es-MX",
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
      author: { "@type": "Organization", name: "Equipo Editorial de CVAI México", url: "https://www.cvai.com.mx" },
      publisher: { "@type": "Organization", name: "CVAI", logo: { "@type": "ImageObject", url: "https://www.cvai.com.mx/logo.png" } },
      datePublished: "2026-09-14",
      dateModified: "2026-09-14",
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: isEjemplos
        ? [
            {
              "@type": "Question",
              name: "¿Cuál de estos 10 formatos de CV es mejor si quiero cambiar de carrera?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "El formato híbrido o funcional es el más recomendado para cambios de carrera, ya que permite destacar habilidades transferibles y proyectos clave antes del historial cronológico.",
              },
            },
            {
              "@type": "Question",
              name: "¿Puedo utilizar el mismo currículum para todas mis postulaciones en México?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No es recomendable enviar el mismo CV genérico. Toma uno de estos 10 ejemplos como base y adapta las palabras clave, herramientas de software y logros a los requisitos exactos de la vacante.",
              },
            },
            {
              "@type": "Question",
              name: "¿Qué tan importante es la longitud de un CV en México?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Para más del 90% de las vacantes en México, 1 sola cuartilla es la extensión ideal. Solo perfiles directivos o especialistas con más de 10 años de trayectoria deben extenderse a 2 páginas.",
              },
            },
            {
              "@type": "Question",
              name: "¿Cómo debe ser el currículum para trabajo remoto en México o para el extranjero?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Debe indicar claramente tu zona horaria (ej. GMT-6), disponibilidad de equipo propio y herramientas de colaboración asíncrona como Slack, Notion, Jira o Zoom.",
              },
            },
          ]
        : isAts
        ? [
            {
              "@type": "Question",
              name: "¿Qué es un ATS?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Un ATS (Applicant Tracking System o Sistema de Seguimiento de Candidatos) es un software utilizado por departamentos de Recursos Humanos para centralizar, organizar y filtrar automáticamente las postulaciones a vacantes de empleo.",
              },
            },
            {
              "@type": "Question",
              name: "¿Cómo saber si mi CV es compatible con ATS?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Haz la prueba del texto: selecciona y copia todo el texto de tu PDF y pégalo en el Bloc de Notas. Si el texto aparece claro y en orden cronológico, tu CV es técnicamente legible para un ATS. También puedes evaluarlo con el verificador ATS de CVAI.",
              },
            },
            {
              "@type": "Question",
              name: "¿Qué formato es mejor para un CV ATS?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "El formato PDF con texto seleccionable es el estándar más recomendado en México porque preserva el diseño. Si la empresa solicita explícitamente archivo Word (.docx), utiliza .docx.",
              },
            },
            {
              "@type": "Question",
              name: "¿Un CV con diseño puede pasar un ATS?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sí, siempre que el diseño sea limpio y estructurado (márgenes normales, tipografía universal y sin columnas entrelazadas ni tablas complejas). Las plantillas de CVAI combinan estética profesional y legibilidad técnica ATS.",
              },
            },
            {
              "@type": "Question",
              name: "¿Qué palabras clave debo usar en mi currículum?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Debes incluir los términos técnicos exactos, herramientas de software y certificaciones que aparecen en la descripción de la vacante, combinando siglas con nombres completos (ej. CRM y Customer Relationship Management).",
              },
            },
            {
              "@type": "Question",
              name: "¿Existe alguna plantilla con 100% de garantía para pasar un ATS?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No existe ninguna garantía del 100% porque cada empresa utiliza software diferente (Workday, Taleo, Greenhouse) con filtros y criterios humanos propios. Una buena plantilla elimina barreras técnicas para que tu perfil sea leído sin fallas.",
              },
            },
          ]
        : [
            {
              "@type": "Question",
              name: "¿Es obligatorio poner foto en el currículum vitae en México?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No es obligatorio por ley y las empresas multinacionales con filtros ATS prefieren CVs sin fotografía para evitar sesgos de contratación.",
              },
            },
            {
              "@type": "Question",
              name: "¿Cuántas hojas debe tener un currículum profesional?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "La regla estándar en México es 1 sola cuartilla (página). Si cuentas con más de 8 o 10 años de experiencia relevante, puedes extenderte a 2 páginas como máximo.",
              },
            },
            {
              "@type": "Question",
              name: "¿Debo poner mi CURP, RFC o dirección completa en mi CV?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. Por tu propia seguridad en México, nunca incluyas tu CURP, RFC, estado civil ni la dirección completa con calle y número. Solo indica tu ciudad y estado.",
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
        { type: "application/ld+json", children: JSON.stringify(articleSchema) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) },
      ],
    };
  },
  component: BlogPostDetail,
});

type DbPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  author: string | null;
  published_at: string | null;
};

function BlogPostDetail() {
  const { slug } = Route.useParams();
  const [copied, setCopied] = useState(false);
  const [dbPost, setDbPost] = useState<DbPost | null | undefined>(undefined);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Enlace copiado al portapapeles");
    setTimeout(() => setCopied(false), 2500);
  }

  useEffect(() => {
    if (
      slug === "10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos" ||
      slug === "como-hacer-un-curriculum-vitae-mexico" ||
      slug === "que-es-un-curriculum-ats-como-hacer-cv-compatible" ||
      slug === "cv-filtros-ats"
    ) {
      return;
    }

    let isMounted = true;
    supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, category, author, published_at")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error || !data) {
          setDbPost(null);
        } else {
          setDbPost(data as DbPost);
        }
      })
      .catch(() => {
        if (isMounted) setDbPost(null);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (slug === "10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos") {
    return <DiezEjemplosArticle copyLink={copyLink} copied={copied} />;
  }

  if (slug === "que-es-un-curriculum-ats-como-hacer-cv-compatible" || slug === "cv-filtros-ats") {
    return <CurriculumAtsArticle copyLink={copyLink} copied={copied} />;
  }

  if (slug === "como-hacer-un-curriculum-vitae-mexico") {
    return <GuiaHacerCvArticle copyLink={copyLink} copied={copied} />;
  }

  if (dbPost === undefined) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Cargando artículo...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (dbPost === null) {
    return <NotFoundArticleView />;
  }

  return <DynamicArticleView post={dbPost} copyLink={copyLink} copied={copied} />;
}

function NotFoundArticleView() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Bookmark className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-bold">Artículo no encontrado</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          El artículo o guía que buscas no está disponible o ha cambiado de dirección. Te invitamos a consultar nuestras guías destacadas.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/blog">
            <Button variant="default" className="gap-2">
              Volver al blog <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/blog/$slug" params={{ slug: "10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos" }}>
            <Button variant="outline">Ver 10 ejemplos de CV</Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function DynamicArticleView({
  post,
  copyLink,
  copied,
}: {
  post: DbPost;
  copyLink: () => void;
  copied: boolean;
}) {
  const paragraphs = (post.content ?? "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="border-b border-border/40 bg-secondary/20">
        <div className="mx-auto max-w-4xl px-4 py-3 text-xs text-muted-foreground">
          <nav className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-xs sm:max-w-md">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      <header className="border-b border-border/50 bg-gradient-to-b from-secondary/40 to-background py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="default" className="rounded-full px-3 py-0.5 text-xs font-semibold">
              {post.category || "Artículo"}
            </Badge>
            {post.published_at && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.published_at).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                CV
              </div>
              <div>
                <p className="text-sm font-semibold">{post.author || "Equipo Editorial CVAI"}</p>
                <p className="text-xs text-muted-foreground">Especialistas en Empleabilidad México</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5 text-xs">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? "Enlace copiado" : "Compartir"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <article className="lg:col-span-8 space-y-6 text-foreground/90 leading-relaxed text-sm sm:text-base">
            {paragraphs.map((p, idx) => {
              if (p.startsWith("# ")) {
                return (
                  <h2 key={idx} className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-8 mb-4">
                    {p.replace(/^#\s+/, "")}
                  </h2>
                );
              }
              if (p.startsWith("## ")) {
                return (
                  <h3 key={idx} className="font-display text-xl sm:text-2xl font-bold text-foreground mt-6 mb-3">
                    {p.replace(/^##\s+/, "")}
                  </h3>
                );
              }
              if (p.startsWith("### ")) {
                return (
                  <h4 key={idx} className="font-display text-lg font-semibold text-foreground mt-4 mb-2">
                    {p.replace(/^###\s+/, "")}
                  </h4>
                );
              }
              if (p.startsWith("- ") || p.startsWith("* ")) {
                const items = p.split("\n").filter((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "));
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                    {items.map((it, i) => (
                      <li key={i}>{it.replace(/^[-*]\s+/, "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-muted-foreground leading-relaxed">
                  {p}
                </p>
              );
            })}

            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8 space-y-4 text-center mt-12">
              <h3 className="font-display text-xl font-bold text-foreground">
                Optimiza tu Currículum con CVAI
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                Crea un CV en minutos con formato probado para reclutadores en México y optimizado para pasar filtros ATS.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link to="/plantillas">
                  <Button variant="outline" size="sm">Ver plantillas</Button>
                </Link>
                <Link to="/curriculum-vitae">
                  <Button size="sm" className="gap-1.5">
                    Crear mi CV <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </article>

          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-primary" /> Recursos recomendados
              </h3>
              <div className="space-y-2.5 text-xs">
                <Link
                  to="/blog/$slug"
                  params={{ slug: "10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos" }}
                  className="block font-medium text-foreground hover:text-primary transition-colors"
                >
                  → 10 Ejemplos de CV profesionales
                </Link>
                <Link
                  to="/blog/$slug"
                  params={{ slug: "como-hacer-un-curriculum-vitae-mexico" }}
                  className="block font-medium text-foreground hover:text-primary transition-colors"
                >
                  → Guía paso a paso para hacer un CV
                </Link>
                <Link to="/ats-checker" className="block text-muted-foreground hover:text-primary transition-colors">
                  → Verificador ATS Gratuito
                </Link>
                <Link to="/plantillas" className="block text-muted-foreground hover:text-primary transition-colors">
                  → Plantillas de CV México
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/* =======================================================================
   ARTICLE 3: GUÍA ATS - QUÉ ES Y CÓMO HACER UN CV COMPATIBLE
   ======================================================================= */
function CurriculumAtsArticle({ copyLink, copied }: { copyLink: () => void; copied: boolean }) {
  const [activeTab, setActiveTab] = useState<"mal" | "optimizado">("optimizado");
  const [checkedList, setCheckedList] = useState<Record<number, boolean>>({});

  const checklistItems = [
    "¿El texto de tu currículum se puede seleccionar y copiar en el Bloc de Notas sin errores?",
    "¿Tus datos de contacto principales están dentro del cuerpo principal del documento (nunca en header/footer)?",
    "¿Tus encabezados de sección son estándar (Experiencia laboral, Educación, Habilidades, Certificaciones)?",
    "¿Cada empleo especifica: Cargo exacto, Empresa, Ciudad/Estado y Fechas en formato 'Mes Año – Mes Año'?",
    "¿Incluiste las herramientas de software y requisitos clave mencionados en la vacante?",
    "¿Evitaste gráficos de barras de porcentaje, tablas anidadas y cuadros de texto flotantes?",
    "¿El documento tiene una extensión de 1 página (máximo 2 para más de 8-10 años de experiencia)?",
    "¿El archivo tiene un nombre profesional claro (ej. CV_Nombre_Apellido_Cargo.pdf)?",
  ];

  function toggleCheck(index: number) {
    setCheckedList((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  const completedCount = Object.values(checkedList).filter(Boolean).length;

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
              ¿Qué es un currículum ATS?
            </span>
          </nav>
        </div>
      </div>

      {/* Article Header Hero */}
      <header className="border-b border-border/50 bg-gradient-to-b from-secondary/40 to-background py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="default" className="rounded-full px-3 py-0.5 text-xs font-semibold">
              ATS y Empleabilidad
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 11 min de lectura
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Actualizado para 2026
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-tight">
            ¿Qué es un currículum ATS y cómo hacer un CV que pase los filtros de selección?
          </h1>

          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Desmitificamos el software de selección utilizado por empresas en México: descubre cómo extrae tu información, qué detalles confunden al algoritmo y cómo optimizar tu CV para que sea valorado tanto por el sistema como por el reclutador humano.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                CV
              </div>
              <div>
                <p className="text-sm font-semibold">Equipo Editorial de CVAI México</p>
                <p className="text-xs text-muted-foreground">Especialistas en Sistemas ATS y Reclutamiento</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5 text-xs">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? "Enlace copiado" : "Compartir guía"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Quick Jump Bar */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-10 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Bookmark className="h-3.5 w-3.5 text-primary" /> En esta guía aprenderás:
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <a href="#que-es-ats" className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground hover:border-primary hover:text-foreground">
              1. ¿Qué significa ATS?
            </a>
            <a href="#como-funciona" className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground hover:border-primary hover:text-foreground">
              2. Cómo funciona el análisis
            </a>
            <a href="#formato-estructura" className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground hover:border-primary hover:text-foreground">
              3. Formato y estructura
            </a>
            <a href="#palabras-clave" className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground hover:border-primary hover:text-foreground">
              4. Palabras clave
            </a>
            <a href="#tablas-y-graficos" className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground hover:border-primary hover:text-foreground">
              5. Tablas y gráficos
            </a>
            <a href="#comparativa-visual" className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground hover:border-primary hover:text-foreground">
              6. Ejemplo Antes / Después
            </a>
            <a href="#checklist-ats" className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground hover:border-primary hover:text-foreground">
              7. Checklist interactivo
            </a>
            <a href="#preguntas-frecuentes" className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground hover:border-primary hover:text-foreground">
              8. Preguntas frecuentes
            </a>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Article Core Body */}
          <article className="lg:col-span-8 space-y-12 text-foreground/90 leading-relaxed text-sm sm:text-base">
            {/* Section 1: Introduction */}
            <section className="space-y-4">
              <p className="text-lg font-medium text-foreground leading-relaxed">
                Si te has postulado recientemente a vacantes en empresas medianas, corporativos o firmas multinacionales en México a través de LinkedIn, Computrabajo, OCCMundial o Indeed, tu currículum probablemente ha sido procesado por un <strong>sistema ATS</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Alrededor de este término abunda la desinformación: se afirma con frecuencia que los ATS son "robots crueles programados para descartar automáticamente al 75% de los candidatos por el menor detalle". La realidad es mucho más transparente: un ATS es simplemente un software de base de datos y organización que ayuda a los reclutadores a gestionar cientos de postulaciones de forma ordenada.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Comprender cómo opera este software te da una ventaja decisiva: te permite redactar un CV técnicamente impecable para el sistema extractor sin perder el toque humano que convence al seleccionador en la entrevista.
              </p>
            </section>

            {/* Section 2: ¿Qué significa ATS? */}
            <section id="que-es-ats" className="scroll-mt-24 space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Cpu className="h-6 w-6 text-primary" /> ¿Qué significa ATS?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Las siglas <strong>ATS</strong> provienen del inglés <strong>Applicant Tracking System</strong>, traducido al español como <strong>Sistema de Seguimiento de Candidatos</strong>. Es una herramienta tecnológica que permite recopilar, organizar, clasificar, evaluar y dar seguimiento al historial de postulaciones de los candidatos en un solo lugar.
              </p>
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Plataformas ATS más comunes en empresas de México:
                </p>
                <div className="grid gap-2 sm:grid-cols-2 text-xs">
                  <div className="p-2.5 rounded-xl border border-border/70 bg-background/50">
                    <strong className="text-foreground">Workday:</strong> Muy usado por corporativos globales en CDMX, Monterrey y Guadalajara.
                  </div>
                  <div className="p-2.5 rounded-xl border border-border/70 bg-background/50">
                    <strong className="text-foreground">Taleo (Oracle):</strong> Frecuente en logística, finanzas y retail masivo.
                  </div>
                  <div className="p-2.5 rounded-xl border border-border/70 bg-background/50">
                    <strong className="text-foreground">SAP SuccessFactors:</strong> Estándar en manufactura, química y automotriz.
                  </div>
                  <div className="p-2.5 rounded-xl border border-border/70 bg-background/50">
                    <strong className="text-foreground">Greenhouse & Lever:</strong> Populares en startups tecnológicas y fintechs.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: How ATS works */}
            <section id="como-funciona" className="scroll-mt-24 space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Layers className="h-6 w-6 text-primary" /> ¿Cómo funciona un sistema ATS?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                El sistema no toma decisiones discrecionales ni "juzga" a la persona: sigue un algoritmo sistemático de extracción de datos dividido en cuatro etapas:
              </p>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-display font-bold text-foreground">Extracción de texto (Parsing)</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    El software descompone el archivo PDF o Word, descarta elementos visuales complejos y extrae el texto puro para procesarlo línea por línea.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-display font-bold text-foreground">Clasificación en campos</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Identifica bloques temáticos: nombres, teléfono, correo, escolaridad, empresas, cargos ocupados, fechas y habilidades técnicas.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    3
                  </div>
                  <h3 className="font-display font-bold text-foreground">Indexación en base de datos</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Tu información se almacena en la base interna de la empresa, permitiendo búsquedas booleanas exactas realizadas por el equipo de RH.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    4
                  </div>
                  <h3 className="font-display font-bold text-foreground">Puntuación y filtrado humano</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Calcula la afinidad de palabras clave con la vacante para ordenar los perfiles y presentárselos al reclutador para su evaluación final.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Format and Structure */}
            <section id="formato-estructura" className="scroll-mt-24 space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <FileCheck className="h-6 w-6 text-primary" /> Formato y Estructura Recomendada
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Para que la extracción de texto sea fluida, respeta estas tres reglas técnicas fundamentales:
              </p>

              <div className="space-y-4">
                <div className="rounded-2xl border border-border p-4 bg-muted/20 space-y-2">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 1. Formato de archivo (.pdf vs .docx)
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Usa <strong>PDF nativo con texto seleccionable</strong> como primera opción. Asegúrate de que puedas arrastrar el ratón sobre el texto y copiarlo. Si un archivo fue escaneado como imagen o guardado como JPG enmascarado en PDF, el ATS no leerá ninguna palabra. Si la vacante pide explícitamente formato .docx, envíalo en Word.
                  </p>
                </div>

                <div className="rounded-2xl border border-border p-4 bg-muted/20 space-y-2">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 2. Estructura Cronológica Inversa
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Es el diseño más confiable para cualquier analizador. Comienza con tus datos de contacto en el cuerpo superior, seguido de tu perfil profesional, tu historial laboral (del trabajo más reciente hacia atrás), educación, habilidades y certificaciones.
                  </p>
                </div>

                <div className="rounded-2xl border border-border p-4 bg-muted/20 space-y-2">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 3. Tipografías Universales
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Elige fuentes preinstaladas en todos los sistemas operativos: <strong>Arial, Calibri, Helvetica, Roboto, Inter, Georgia o Verdana</strong>. Evita tipografías de diseño exóticas o caligráficas que puedan corromper caracteres al ser procesadas.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Keywords Strategy */}
            <section id="palabras-clave" className="scroll-mt-24 space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Search className="h-6 w-6 text-primary" /> Uso Correcto de Palabras Clave
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Las palabras clave no son "trucos secretos"; son los términos profesionales específicos que el reclutador utiliza para buscar candidatos que cumplan con la vacante:
              </p>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="space-y-1 p-3 rounded-xl bg-muted/40">
                    <p className="font-bold text-foreground">❌ Palabras vagas o genéricas:</p>
                    <p className="text-muted-foreground">"Manejo de computadoras y paquetería de oficina."</p>
                    <p className="text-muted-foreground">"Experiencia en trato con personas."</p>
                  </div>
                  <div className="space-y-1 p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="font-bold text-primary">✅ Palabras clave precisas para ATS:</p>
                    <p className="text-foreground">"Microsoft Excel (Tablas dinámicas, BuscarV, Macros)."</p>
                    <p className="text-foreground">"Atención a clientes B2B y manejo de CRM Salesforce."</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-2 border-t border-border pt-3">
                  <p>
                    <strong className="text-foreground">Consejo de oro:</strong> Combina siglas con nombres completos (ej. <em>"Project Management Professional (PMP)"</em> o <em>"Customer Relationship Management (CRM)"</em>). Así garantizas que el sistema te localice sin importar cuál variante utilice el reclutador.
                  </p>
                  <p className="text-destructive font-medium">
                    ⚠️ Nunca hagas "keyword stuffing" (repetir palabras forzadas o poner texto blanco invisible). Los sistemas ATS modernos detectan estas manipulaciones y descartan la postulación automáticamente.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Tablas y Gráficos */}
            <section id="tablas-y-graficos" className="scroll-mt-24 space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-500" /> ¿Se deben usar tablas, columnas o gráficos?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Muchas plantillas descargadas de herramientas de diseño visual descuidan la lectura algorítmica. Toma en cuenta estos factores:
              </p>

              <div className="grid gap-4 sm:grid-cols-3 text-xs">
                <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
                  <h4 className="font-bold text-foreground">Columnas complejas</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Muchos motores leen horizontalmente de izquierda a derecha. Tres columnas estrechas pueden entrelazar frases de diferentes secciones. Un diseño de 1 sola columna o 2 columnas limpias es mucho más seguro.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
                  <h4 className="font-bold text-foreground">Barras de nivel (80%)</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Los gráficos de bolitas o barras de porcentaje son invisibles para los ATS y no aportan datos objetivos al reclutador. Sustitúyelos por certificaciones o niveles reales (ej. Inglés B2/C1).
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
                  <h4 className="font-bold text-foreground">Encabezados (Headers)</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Nunca coloques tu teléfono o correo dentro del área de encabezado/pie de página de Word, ya que muchos parsers ignoran estas zonas y registrarán tu perfil sin contacto.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Comparativa Antes y Después */}
            <section id="comparativa-visual" className="scroll-mt-24 space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" /> Ejemplo Comparativo: Antes vs. Después
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Examina la diferencia entre una postulación con alto riesgo de falla técnica y una optimizada para lectura automática y humana:
              </p>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-border pb-2">
                <button
                  onClick={() => setActiveTab("optimizado")}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                    activeTab === "optimizado"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ✅ Estructura Optimizada para ATS
                </button>
                <button
                  onClick={() => setActiveTab("mal")}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                    activeTab === "mal"
                      ? "bg-destructive/10 text-destructive border border-destructive/30"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ❌ Errores Comunes de Formato
                </button>
              </div>

              {activeTab === "optimizado" ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4 text-xs font-mono">
                  <div className="border-b border-emerald-500/20 pb-3">
                    <p className="font-bold text-sm text-foreground">ROBERTO ALONSO SÁNCHEZ</p>
                    <p className="text-muted-foreground">Ciudad de México, CDMX | Tel: 55-4321-9876 | roberto.alonso@email.com | linkedin.com/in/roberto-alonso</p>
                  </div>
                  <div>
                    <p className="font-bold text-foreground uppercase tracking-wider text-[11px]">RESUMEN PROFESIONAL</p>
                    <p className="text-muted-foreground mt-1">Coordinador de Logística con 6 años de experiencia en gestión de inventarios y distribución regional en México. Especialista en implementación de SAP ERP (Módulos MM/SD) y metodologías Lean Manufacturing. Capacidad comprobada para reducir tiempos de entrega en un 18% y negociar con transportistas nacionales.</p>
                  </div>
                  <div>
                    <p className="font-bold text-foreground uppercase tracking-wider text-[11px]">EXPERIENCIA LABORAL</p>
                    <p className="font-semibold text-foreground mt-2">Coordinador de Almacén y Distribución | Logística Express S.A. de C.V.</p>
                    <p className="text-muted-foreground">Marzo 2022 – Presente | Cuautitlán Izcalli, Estado de México</p>
                    <ul className="list-disc pl-4 mt-1 space-y-1 text-muted-foreground">
                      <li>Supervisé la operación diaria de un almacén central de 4,500 m² con un equipo a cargo de 22 colaboradores operativos.</li>
                      <li>Implementé el sistema de ruteo dinámico con software TMS, disminuyendo costos de combustible en 14% en el primer año.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-4 text-xs">
                  <div className="border-b border-destructive/20 pb-3 space-y-1 text-destructive">
                    <p className="font-bold">⚠️ Datos de contacto en el Footer de Word:</p>
                    <p className="text-muted-foreground">(El ATS no extrajo el teléfono ni el correo porque estaban fuera del cuerpo principal)</p>
                  </div>
                  <div className="space-y-1 text-destructive">
                    <p className="font-bold">⚠️ Título creativo no indexable:</p>
                    <p className="text-muted-foreground">"Mi viaje y pasión por las operaciones logísticas"</p>
                  </div>
                  <div className="space-y-1 text-destructive">
                    <p className="font-bold">⚠️ Habilidades en gráfico de bolitas:</p>
                    <p className="text-muted-foreground">SAP: ●●●●○ | Excel: ●●●○○ (El sistema registró 0 habilidades técnicas)</p>
                  </div>
                  <div className="space-y-1 text-destructive">
                    <p className="font-bold">⚠️ Fechas vagas sin meses:</p>
                    <p className="text-muted-foreground">"2022 - 2024 en empresa de paquetería" (Imposible calcular meses exactos de experiencia)</p>
                  </div>
                </div>
              )}
            </section>

            {/* Section 8: Checklist Interactivo */}
            <section id="checklist-ats" className="scroll-mt-24 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <CheckSquare className="h-6 w-6 text-primary" /> Checklist de Verificación ATS
                </h2>
                <Badge variant="outline" className="text-xs font-semibold">
                  {completedCount} de {checklistItems.length} completados
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Haz clic en cada casilla para verificar si tu currículum cumple con los estándares antes de enviarlo:
              </p>

              <div className="rounded-2xl border border-border bg-card divide-y divide-border">
                {checklistItems.map((item, idx) => {
                  const isChecked = !!checkedList[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className={`flex items-start gap-3 p-3.5 sm:p-4 cursor-pointer transition-colors ${
                        isChecked ? "bg-primary/5 text-foreground" : "hover:bg-muted/30 text-muted-foreground"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        isChecked ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"
                      }`}>
                        {isChecked && <Check className="h-3 w-3" />}
                      </div>
                      <span className={`text-xs sm:text-sm select-none ${isChecked ? "font-medium text-foreground line-through opacity-80" : ""}`}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 9: How to test your CV */}
            <section className="space-y-4">
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Cómo revisar tu currículum antes de postularte
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
                  <h4 className="font-bold text-foreground">1. La prueba del Bloc de Notas</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Abre tu archivo PDF en la computadora, presiona <code className="px-1 py-0.5 bg-muted rounded">Ctrl + A</code> para seleccionar todo, copia con <code className="px-1 py-0.5 bg-muted rounded">Ctrl + C</code> y pégalo en el Bloc de Notas de Windows. Si el texto se lee ordenado, limpio y sin caracteres rotos, tu CV pasará la prueba técnica de extracción.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 space-y-2">
                  <h4 className="font-bold text-primary">2. Escaneo con el Verificador ATS de CVAI</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Sube tu archivo a nuestro <Link to="/ats-checker" className="text-primary underline font-medium">Verificador ATS Gratuito</Link> para recibir un análisis instantáneo de legibilidad tipográfica, balance de palabras clave y recomendaciones de ajuste para vacantes en México.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10: FAQ Section */}
            <section id="preguntas-frecuentes" className="scroll-mt-24 space-y-6 border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" /> Preguntas Frecuentes sobre Currículum ATS
              </h2>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger className="text-left text-sm font-semibold">
                    ¿Qué es exactamente un sistema ATS?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Un ATS (Applicant Tracking System o Sistema de Seguimiento de Candidatos) es un software informático utilizado por departamentos de Recursos Humanos y agencias de selección para recopilar, organizar, indexar y gestionar todas las solicitudes de empleo recibidas para sus vacantes activas.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2">
                  <AccordionTrigger className="text-left text-sm font-semibold">
                    ¿Cómo saber si mi CV es compatible con ATS?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    La forma más rápida es la prueba de texto: abre tu PDF, selecciona todo el contenido, cópialo y pégalo en un editor de texto plano (como el Bloc de Notas). Si el texto mantiene su orden lógico y no se mezclan columnas ni desaparecen fechas, tu CV es técnicamente amigable con ATS. También puedes analizarlo con el verificador de CVAI.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3">
                  <AccordionTrigger className="text-left text-sm font-semibold">
                    ¿Qué formato de archivo es mejor para un CV ATS?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    El formato PDF con texto seleccionable es la mejor alternativa para el 90% de las vacantes en México, ya que asegura que el reclutador humano vea el documento exactamente con la tipografía y orden deseados. Si la postulación pide explícitamente archivo Word (.docx), respeta esa solicitud.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4">
                  <AccordionTrigger className="text-left text-sm font-semibold">
                    ¿Un CV con buen diseño visual puede pasar un ATS?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Totalmente sí. Ser compatible con ATS no significa tener un archivo plano o aburrido. Significa tener una jerarquía tipográfica limpia, márgenes equilibrados y evitar elementos que confunden al algoritmo, como cuadros de texto flotantes, gráficos de barras de habilidad o tablas anidadas. Las plantillas de CVAI combinan diseño moderno con compatibilidad ATS.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-5">
                  <AccordionTrigger className="text-left text-sm font-semibold">
                    ¿Qué palabras clave debo incluir en mi currículum?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Debes incluir los términos técnicos específicos, nombres de programas de software (como SAP, Excel, Python o CONTPAQi), metodologías de trabajo (Scrum, Lean, ISO) y certificaciones que aparezcan repetidamente en la oferta de trabajo a la que aspiras, siempre respaldados por tu experiencia verídica.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-6">
                  <AccordionTrigger className="text-left text-sm font-semibold">
                    ¿Existe alguna garantía del 100% para superar un ATS?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Ninguna plataforma o plantilla puede prometer una garantía absoluta del 100%, ya que cada empresa configura su ATS (Workday, Taleo, Greenhouse) con filtros, ponderaciones y preguntas eliminatorias distintas, y la decisión final siempre corresponde al reclutador humano. Lo que hace una buena optimización es eliminar cualquier barrera técnica que impida que tu perfil sea evaluado con justicia.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Bottom CTA Card */}
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-6 sm:p-8 space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                Evalúa tu Currículum con el Verificador ATS de CVAI
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Detecta de inmediato si tu documento tiene problemas de legibilidad, tipografía o palabras clave antes de enviarlo a las empresas en México.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link to="/ats-checker">
                  <Button className="gap-2 shadow-sm">
                    Escanear mi CV gratis <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/curriculum-vitae">
                  <Button variant="outline">
                    Crear CV optimizado
                  </Button>
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-primary" /> Recursos para tu búsqueda
              </h3>
              <div className="space-y-3 text-xs">
                <Link to="/ats-checker" className="block font-medium text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted/40">
                  ⚡ Verificador ATS Gratuito
                </Link>
                <Link to="/curriculum-vitae" className="block font-medium text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted/40">
                  ✨ Creador de Currículum con IA
                </Link>
                <Link to="/plantillas" className="block text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted/40">
                  📄 Plantillas de CV para México
                </Link>
                <Link to="/blog/$slug" params={{ slug: "10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos" }} className="block text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted/40">
                  🎯 10 Ejemplos de CV por Industria
                </Link>
                <Link to="/blog/$slug" params={{ slug: "como-hacer-un-curriculum-vitae-mexico" }} className="block text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted/40">
                  📘 Guía paso a paso para hacer un CV
                </Link>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Plantillas por profesión:
                </p>
                <div className="space-y-1.5 text-xs">
                  <Link to="/software-engineer-resume-template" className="block text-muted-foreground hover:text-primary">
                    → Ingeniero de Software
                  </Link>
                  <Link to="/accountant-resume-template" className="block text-muted-foreground hover:text-primary">
                    → Contador Público
                  </Link>
                  <Link to="/sales-executive-resume-template" className="block text-muted-foreground hover:text-primary">
                    → Ejecutivo de Ventas
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

/* =======================================================================
   ARTICLE 2: 10 EJEMPLOS DE CURRICULUM VITAE
   ======================================================================= */
function DiezEjemplosArticle({ copyLink, copied }: { copyLink: () => void; copied: boolean }) {
  const ejemplos = [
    {
      id: "estudiante",
      num: "1",
      title: "Currículum para estudiante",
      target: "Estudiantes de preparatoria técnica o universidad que buscan prácticas, becas o empleos de medio tiempo compatibles con su horario escolar.",
      structure: "Disponibilidad de turno > Objetivo académico > Educación > Proyectos escolares > Habilidades > Idiomas.",
      summary: "Estudiante de 6° semestre de la Licenciatura en Contaduría Pública en la UNAM, con disponibilidad para turno matutino (medio tiempo). Interés en incorporarse al área de tesorería y cuentas por pagar. Cuento con dominio intermedio de Excel (tablas dinámicas, funciones condicionales) y nociones de CONTPAQi Contabilidad. Comprometido con el aprendizaje continuo y la precisión numérica.",
      experienceTitle: "Proyectos académicos y voluntariado:",
      experience: [
        "Coordinador del Proyecto Integrador de Costos — Facultad de Contaduría (UNAM): Diseñé el modelo de costeo estándar para una microempresa familiar de calzado, identificando un potencial de ahorro del 14% en costos de empaque y distribución.",
        "Miembro del Comité de Registro — Simposio Financiero Universitario: Coordiné el registro y entrega de acreditaciones para más de 350 asistentes mediante formulario digital en Google Forms y validación en Excel.",
      ],
      skills: ["Excel intermedio (Tablas dinámicas, XLOOKUP)", "Google Sheets", "Facturación básica", "Organización del tiempo", "Puntualidad rigurosa"],
      achievements: "Promedio acumulado de 9.3 durante los primeros 5 semestres; 2° lugar en Hackathon de Emprendimiento Universitario 2024.",
      mistakes: "No especificar el semestre en curso ni el turno libre; poner materias irrelevantes de secundaria.",
      tips: "Revisa los horarios de la vacante y escribe explícitamente en el encabezado: 'Disponibilidad matutina de 8:00 a 14:00 hrs'.",
      templateLink: "/student-resume-template",
      templateName: "Plantilla para Estudiantes",
    },
    {
      id: "sin-experiencia",
      num: "2",
      title: "Currículum para persona sin experiencia",
      target: "Personas que buscan su primer empleo formal en México y no cuentan con historial laboral previo registrado en el IMSS.",
      structure: "Datos claros > Perfil enfocado en actitud y aptitudes > Servicio social / Voluntariado > Educación > Habilidades transferibles.",
      summary: "Joven entusiasta, puntual y con facilidad de palabra, en búsqueda de una oportunidad laboral en atención a clientes o soporte operativo. Con bachillerato técnico concluido y experiencia práctica de 480 horas de servicio social en institución pública atendiendo ciudadanos y digitalizando expedientes. Con alta capacidad de escucha activa y manejo ágil de computadora (60 PPM).",
      experienceTitle: "Servicio social y experiencia comunitaria:",
      experience: [
        "Prestador de Servicio Social — DIF Municipal (Toluca, Edo. Méx.): Atendí de manera presencial a un promedio de 35 a 45 ciudadanos al día para la entrega de apoyos comunitarios, resolviendo dudas con trato amable y cero quejas registradas.",
        "Digitalización y Archivo Institucional: Digitalicé y clasifiqué más de 1,400 expedientes físicos en el sistema interno de archivo, concluyendo la meta 3 semanas antes del plazo límite.",
      ],
      skills: ["Mecanografía ágil (65 PPM)", "Office básico", "Atención telefónica", "Resolución de quejas", "Trato cortés y empático"],
      achievements: "Reconocimiento institucional por cumplimiento del 100% de expedientes digitalizados en tiempo récord.",
      mistakes: "Dejar la sección de experiencia en blanco; inventar empleos informales con empresas que no existen.",
      tips: "Cualquier voluntariado, apoyo en el negocio familiar o servicio social cuenta como experiencia real si describes responsabilidades y disciplina.",
      templateLink: "/entry-level-resume-template",
      templateName: "Plantilla Sin Experiencia (Entry-Level)",
    },
    {
      id: "recien-egresado",
      num: "3",
      title: "Currículum para recién egresado",
      target: "Graduados universitarios con menos de 12 meses de haber finalizado sus estudios o en proceso de titulación.",
      structure: "Estatus académico ('Titulado' / 'Pasante') > Perfil con especialidad > Prácticas profesionales > Educación > Software técnico > Idiomas.",
      summary: "Ingeniero Industrial titulado por el Instituto Tecnológico de Monterrey con mención honorífica. Especializado en optimización de procesos de manufactura mediante metodologías Lean y Six Sigma. Experiencia de 12 meses como practicante de ingeniería en planta automotriz, colaborando en la reducción del 18% en tiempos de ciclo en líneas de ensamble. Nivel de inglés avanzado (TOEFL ITP 610 pts).",
      experienceTitle: "Prácticas profesionales e internados:",
      experience: [
        "Practicante de Mejora Continua — Componentes Automotrices de México (Silao, Gto.): Realicé estudios de tiempos y movimientos con metodología Kaizen en 3 líneas de producción, identificando cuellos de botella y estandarizando hojas de operación (SOP).",
        "Implementación 5S en Almacén: Apoyé en la implementación de las 5S en el almacén de herramentales, reduciendo el tiempo de búsqueda de piezas de 15 a 4 minutos por turno.",
      ],
      skills: ["Lean Manufacturing", "Minitab", "AutoCAD", "Excel avanzado", "Mapeo VSM", "Inglés técnico avanzado"],
      achievements: "Tesis de titulación con mención honorífica; promedio general de 9.4; certificación Lean Six Sigma Yellow Belt.",
      mistakes: "Omitir si ya cuentas con cédula o el estatus de la tesis; listar materias en vez de logros de las prácticas.",
      tips: "Si tu promedio fue sobresaliente (arriba de 9.0), colócalo en negritas. Las empresas con programas de 'Trainees' filtran fuertemente por este dato.",
      templateLink: "/fresher-resume-template",
      templateName: "Plantilla para Recién Egresados",
    },
    {
      id: "con-experiencia",
      num: "4",
      title: "Currículum para profesional con experiencia (Mid-Senior)",
      target: "Especialistas con 3 a 8 años de trayectoria continua en un área funcional que aspiran a una jefatura o coordinación.",
      structure: "Titular sénior > Perfil ejecutivo con KPIs > Experiencia cronológica inversa con viñetas numéricas > Educación > Certificaciones.",
      summary: "Especialista en Recursos Humanos y Relaciones Laborales con 7 años de trayectoria en plantas de manufactura en la región Bajío. Experto en administración de clima laboral, gestión de convenios sindicales y cumplimiento de la NOM-035-STPS. Lideré la recertificación de Great Place to Work alcanzando un 88% de satisfacción general y una reducción de rotación voluntaria de 4.5% a 1.8% mensual. Bilingüe (Español/Inglés C1).",
      experienceTitle: "Experiencia laboral comprobada:",
      experience: [
        "Coordinador de Relaciones Laborales — Grupo Manufacturero del Centro (Querétaro, Qro.): Gestioné la relación contractual y negociaciones salariales con la representación sindical para más de 750 trabajadores de planta con cero emplazamientos a huelga en 3 años.",
        "Digitalización de Inducción: Digitalicé el proceso de bienvenida mediante LMS, reduciendo la deserción en los primeros 30 días del 24% al 9%.",
        "Implementación NOM-035: Implementé la NOM-035 en 3 centros de trabajo evitando sanciones de la STPS y mejorando el bienestar laboral.",
      ],
      skills: ["Ley Federal del Trabajo (LFT)", "Negociación sindical", "NOM-035 / NOM-030", "Workday / HRIS", "Retención de talento"],
      achievements: "Reducción del 30% en costos de reclutamiento externo; 0 emplazamientos a huelga en 5 años de gestión.",
      mistakes: "Describir rutinas cotidianas en vez de ahorros económicos o porcentajes de mejora; incluir puestos de hace 15 años.",
      tips: "Revisa las metas del departamento al que aplicas (ej. reducción de costos, automatización) y dale el primer lugar a tus logros relacionados.",
      templateLink: "/senior-professional-resume-template",
      templateName: "Plantilla Profesional Sénior",
    },
    {
      id: "ejecutivo",
      num: "5",
      title: "Currículum para ejecutivo o directivo (C-Level)",
      target: "Directores de área, vicepresidentes, gerentes generales y perfiles directivos con más de 10-15 años de liderazgo.",
      structure: "Resumen con P&L y EBITDA > Gobernanza y estrategia > Logros corporativos por hito > Consejos / Comités > Educación ejecutiva (MBA).",
      summary: "Director de Operaciones (COO) con 15 años de experiencia liderando la expansión y optimización de cadenas de suministro en el sector retail y consumo masivo en México y Latinoamérica. Con responsabilidad comprobada sobre presupuestos operativos de más de $220 MDP y equipos de más de 600 colaboradores. Historial probado de incremento del 5.2% en margen EBITDA mediante automatización de CEDIS y renegociación estratégica de proveedores clave.",
      experienceTitle: "Liderazgo y gestión de negocio:",
      experience: [
        "Director Nacional de Cadena de Suministro — Retail de Alimentos MX: Diseñé y ejecuté el plan estratégico de expansión logística nacional, aperturando 4 centros de distribución regionales y aumentando la cobertura de entrega al 95% del territorio nacional en 24 meses.",
        "Transformación Tecnológica: Lideré la migración del ERP a SAP S/4HANA en tiempo y con un ahorro de $4.8 MDP respecto al presupuesto original aprobado por el Consejo de Administración.",
      ],
      skills: ["Gestión integral de P&L", "Planeación estratégica", "Fusiones y adquisiciones (M&A)", "Gobernanza corporativa", "Liderazgo transformacional"],
      achievements: "Expansión a 4 nuevos estados; ahorro operativo acumulado superior a $32 MDP; incremento de 5.2 puntos en EBITDA.",
      mistakes: "Extender el documento a 4 o 5 hojas; describir tareas de supervisión básica en lugar de impacto en el balance corporativo.",
      tips: "Tu CV debe reflejar cómo hiciste ganar o ahorrar dinero a las empresas a nivel directivo y estratégico.",
      templateLink: "/executive-resume-template",
      templateName: "Plantilla Ejecutiva / CEO",
    },
    {
      id: "ingeniero",
      num: "6",
      title: "Currículum para ingeniero / desarrollo de software",
      target: "Desarrolladores backend, frontend, full-stack, DevOps, ingenieros de datos y arquitectos de software.",
      structure: "Enlaces a GitHub / Portafolio > Stack tecnológico > Competencias por área (Lenguajes, Cloud, BD) > Experiencia con métricas > Educación.",
      summary: "Senior Full Stack Software Engineer con más de 6 años de experiencia diseñando y desplegando aplicaciones web de alta concurrencia en la industria fintech en México. Especialista en TypeScript, React, Node.js y microservicios sobre AWS. Apasionado por la arquitectura limpia, pruebas automatizadas (TDD) y la reducción de latencia en transacciones financieras. Bilingüe (Español / Inglés C1).",
      experienceTitle: "Experiencia técnica y desarrollo:",
      experience: [
        "Senior Backend Developer — Plataforma Fintech MX: Diseñé y desacoplé el módulo de liquidación SPEI a una arquitectura basada en eventos con Node.js, Kafka y Docker, procesando más de 95,000 transacciones diarias con una latencia inferior a 600 ms.",
        "Optimización de Bases de Datos: Optimicé consultas complejas en PostgreSQL e implementé almacenamiento en caché con Redis, reduciendo los tiempos de respuesta de la API en un 68%.",
        "CI/CD y Automatización: Implementé pipelines de CI/CD en GitHub Actions reduciendo el tiempo de despliegue a producción de 45 a 8 minutos con pruebas automatizadas integradas.",
      ],
      skills: ["TypeScript", "React / Next.js", "Node.js / Express", "PostgreSQL / Redis", "Docker / AWS (ECS, Lambda)", "Git / CI-CD"],
      achievements: "Autor de librería interna de componentes de UI; reducción del 30% en costos de infraestructura cloud mediante auto-scaling.",
      mistakes: "No colocar enlaces a repositorios verificables en GitHub; listar 40 tecnologías sin orden de dominio real.",
      tips: "Escribe los términos exactos de las tecnologías que solicita la vacante (ej. 'Docker', 'GraphQL') para que el ATS los lea al 100%.",
      templateLink: "/software-engineer-resume-template",
      templateName: "Plantilla para Ingenieros de Software",
    },
    {
      id: "disenador",
      num: "7",
      title: "Currículum para diseñador gráfico / creativo",
      target: "Diseñadores gráficos, directores de arte, diseñadores UI/UX, ilustradores y profesionales creativos en México.",
      structure: "Enlace prioritario a Portafolio (Behance/Dribbble) > Perfil creativo enfocado en negocio > Software > Campañas con resultados > Educación.",
      summary: "Diseñadora Gráfica y de Comunicación Visual con más de 5 años de experiencia liderando proyectos de branding corporativo, diseño editorial y dirección de arte digital para marcas de consumo en México. Dominio avanzado de Adobe Creative Cloud (Illustrator, Photoshop, InDesign) y diseño de prototipos en Figma. Enfocada en crear sistemas visuales coherentes que fortalecen la identidad de marca y aumentan el engagement comercial.",
      experienceTitle: "Campañas y proyectos destacados:",
      experience: [
        "Diseñadora Gráfica Senior — Agencia de Publicidad Digital (CDMX): Lideré el rediseño integral de empaque (packaging) e identidad visual para 8 marcas del sector alimentos, logrando un aumento promedio del 25% en rotación de producto en anaqueles de retail.",
        "Assets Digitales y Conversión: Diseñé más de 300 piezas gráficas para campañas de Meta Ads y Google Display, optimizando la tasa de clics (CTR) en un 18% respecto al promedio histórico de la agencia.",
      ],
      skills: ["Adobe Illustrator", "Photoshop", "InDesign", "Figma (UI/UX)", "Branding corporativo", "Tipografía y Preprensa", "After Effects básico"],
      achievements: "Campaña de relanzamiento de producto finalista en Premios Effie México; diseño de empaque ganador en certamen nacional.",
      mistakes: "Olvidar el enlace al portafolio o poner un link roto; guardar el CV como imagen plana que el ATS no puede leer.",
      tips: "El CV debe ser sobrio y limpio para que los ATS lo lean sin problemas; deja que la creatividad visual hable en tu enlace de portafolio.",
      templateLink: "/graphic-designer-resume-template",
      templateName: "Plantilla para Diseñador Gráfico",
    },
    {
      id: "administrativo",
      num: "8",
      title: "Currículum para administrativo / contable",
      target: "Contadores públicos, auxiliares contables, administradores de empresas y coordinadores de oficina en México.",
      structure: "Cédula profesional > Perfil orientado a control fiscal y SAT > Experiencia con ERPs > Habilidades fiscales mexicanas > Educación.",
      summary: "Contadora Pública titulada con cédula profesional y más de 6 años de experiencia en contabilidad general, cálculo de impuestos federales y estatales, y emisión de facturación electrónica CFDI 4.0 para personas morales en México. Con dominio comprobado en los sistemas CONTPAQi, portal del SAT y plataformas del IMSS (SUA/IDSE). Enfocada en la disciplina financiera, cumplimiento tributario oportuno y reducción de riesgos en auditorías.",
      experienceTitle: "Contabilidad y gestión fiscal:",
      experience: [
        "Contadora Encargada — Corporativo Comercial de Puebla: Coordiné la contabilidad general de 3 razones sociales, asegurando la presentación puntual de pagos provisionales y declaraciones anuales con 0 requerimientos o multas fiscales ante el SAT.",
        "Nóminas y Seguridad Social: Gestioné la nómina quincenal para más de 90 trabajadores, realizando los cálculos de retenciones de ISR, cuotas IMSS en SUA y dispersión bancaria sin incidencias.",
        "Conciliaciones Bancarias: Realicé conciliaciones bancarias mensuales sobre 12 cuentas empresariales, reduciendo partidas pendientes a menos del 1% mensual.",
      ],
      skills: ["Portal del SAT", "CONTPAQi (Contabilidad/Nóminas)", "SUA / IDSE", "CFDI 4.0", "Excel avanzado (Macros)", "Auditoría interna"],
      achievements: "Recuperación de saldos a favor de IVA por más de $850,000 MXN en un ejercicio fiscal mediante auditoría interna exhaustiva.",
      mistakes: "No mencionar el dominio de las plataformas oficiales mexicanas (SAT, SUA, IDSE); omitir el número de razones sociales administradas.",
      tips: "Especifica si cuentas con cédula profesional expedida por la SEP, ya que es un requisito de filtro para muchos puestos contables.",
      templateLink: "/accountant-resume-template",
      templateName: "Plantilla para Contador y Finanzas",
    },
    {
      id: "ventas",
      num: "9",
      title: "Currículum para ventas y comercial",
      target: "Ejecutivos de cuenta, representantes comerciales B2B y B2C, gerentes de ventas y asesores de crédito o seguros.",
      structure: "Datos claros > Perfil comercial con cumplimiento de cuotas > Experiencia por facturación y cierre > Manejo de CRM > Habilidades comerciales.",
      summary: "Ejecutivo de Ventas B2B con más de 6 años de experiencia en prospección en frío, negociación corporativa y cierre de contratos de alto valor en el sector industrial en México. Historial comprobado de cumplimiento de cuotas anuales por encima del 118%. Dominio avanzado de técnicas de venta consultiva y administración de embudo comercial en Salesforce y HubSpot. Bilingüe (Español/Inglés C1).",
      experienceTitle: "Cierre de negocios y cartera de clientes:",
      experience: [
        "Ejecutivo Comercial Senior — Maquinaria y Suministros Industriales (Monterrey, N.L.): Desarrollé una cartera de más de 45 cuentas corporativas clave en Nuevo León y Coahuila, generando $7.2 MDP en ventas de maquinaria pesada durante 2024 (124% de la meta anual asignada).",
        "Optimización del Ciclo Comercial: Reduje el ciclo promedio de prospección y cierre de 75 a 48 días implementando seguimiento automatizado a través de Salesforce.",
        "Renovación de Contratos: Negocié contratos de mantenimiento plurianuales con un índice de renovación del 92%.",
      ],
      skills: ["Venta consultiva B2B", "Prospección en frío", "Salesforce / HubSpot", "Negociación de contratos", "LinkedIn Sales Navigator"],
      achievements: "Reconocimiento como Vendedor del Año 2023 y 2024; incremento del 35% en recompra de cuentas clave (Key Accounts).",
      mistakes: "No incluir cifras de dinero facturado o porcentajes de cuota; hablar de tareas de oficina en vez de cierres comerciales.",
      tips: "El currículum de ventas se mide por números: cuota asignada vs. cuota lograda, ticket promedio y porcentaje de crecimiento.",
      templateLink: "/sales-executive-resume-template",
      templateName: "Plantilla Ejecutivo de Ventas",
    },
    {
      id: "remoto",
      num: "10",
      title: "Currículum para trabajo remoto / freelancer",
      target: "Profesionistas que postulan a vacantes 100% home office para empresas en México, EE. UU. o Latinoamérica.",
      structure: "Zona horaria (ej. GMT-6) y disponibilidad remota > Perfil enfocado en autogestión > Entregables y herramientas colaborativas > Idiomas.",
      summary: "Especialista en Marketing de Contenidos y Redacción SEO con 5 años de trayectoria trabajando de manera 100% remota para agencias y startups de tecnología en México y Estados Unidos. Capacidad demostrada para autogestionar calendarios editoriales, liderar equipos en distintas zonas horarias y entregar proyectos con un 98% de puntualidad en fechas de entrega. Bilingüe (Español nativo / Inglés C1 con comunicación asíncrona fluida).",
      experienceTitle: "Entregables y trabajo distribuido:",
      experience: [
        "Content Strategist Remoto — Agencia Global de Crecimiento Digital: Diseñé y ejecuté la estrategia de contenidos de blog para 6 clientes internacionales en el sector SaaS, logrando un incremento del 75% en tráfico orgánico calificado en 18 meses.",
        "Gestión Asíncrona Internacional: Coordiné entregables diarios con redactores y diseñadores ubicados en 4 países mediante Notion, Slack y Asana, manteniendo una calificación de satisfacción de clientes del 9.6/10.",
        "Páginas de Conversión: Redacté guiones para webinars y páginas de aterrizaje que incrementaron la tasa de conversión de leads en un 22%.",
      ],
      skills: ["Comunicación asíncrona", "Autogestión del tiempo", "Notion / Slack / Jira", "Redacción SEO", "Google Analytics 4", "Inglés de negocios C1"],
      achievements: "Gestión simultánea de 5 cuentas de clientes internacionales sin retrasos en entregables durante 3 años; generación de 40,000 visitas orgánicas mensuales.",
      mistakes: "No aclarar que cuentas con espacio de trabajo adecuado y equipo propio; olvidar indicar tu zona horaria.",
      tips: "Enfatiza tu habilidad para trabajar de forma autónoma sin necesidad de supervisión constante y menciona las herramientas colaborativas que dominas.",
      templateLink: "/freelancer-resume-template",
      templateName: "Plantilla Freelancer / Remoto",
    },
  ];

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
              10 ejemplos de currículum vitae para diferentes trabajos
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-gradient-to-b from-secondary/40 to-background py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="default" className="rounded-full px-3 py-0.5 text-xs font-semibold">
              Guía de Ejemplos
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 14 min de lectura
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Actualizado para 2026
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-tight">
            10 ejemplos de currículum vitae para diferentes trabajos y perfiles profesionales
          </h1>

          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Descubre cómo estructurar un currículum vitae exitoso en México según tu profesión y nivel de experiencia. Incluye extractos profesionales, viñetas de logros con métricas, errores a evitar y enlaces a plantillas recomendadas.
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
              {copied ? "Enlace copiado" : "Compartir artículo"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Navigation jump pills */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-10 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Bookmark className="h-3.5 w-3.5 text-primary" /> Saltar directamente a un ejemplo:
          </p>
          <div className="flex flex-wrap gap-2">
            {ejemplos.map((e) => (
              <a
                key={e.id}
                href={`#ejemplo-${e.id}`}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground hover:bg-muted/30 transition-all"
              >
                {e.num}. {e.title.replace("Currículum para ", "")}
              </a>
            ))}
          </div>
        </div>

        {/* Introduction */}
        <div className="space-y-4 mb-12 text-foreground/90 leading-relaxed">
          <p className="text-lg font-medium text-foreground">
            No existe un currículum vitae único que funcione para todas las vacantes. El currículum de un estudiante universitario debe enfatizar proyectos y disponibilidad, mientras que el de un contador público debe demostrar cédula y conocimiento de las leyes fiscales mexicanas.
          </p>
          <p>
            A continuación, analizamos **10 ejemplos de currículum vitae** completamente distintos, basados en perfiles reales del mercado mexicano. Puedes tomar cualquiera de estos modelos como punto de partida para armar tu postulación.
          </p>
        </div>

        {/* 10 Detailed Examples */}
        <div className="space-y-16">
          {ejemplos.map((e) => (
            <section
              key={e.id}
              id={`ejemplo-${e.id}`}
              className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm"
            >
              {/* Card Header */}
              <div className="border-b border-border pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs font-bold text-primary border-primary/40">
                    Ejemplo #{e.num}
                  </Badge>
                  <Link to={e.templateLink} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                    Ver plantilla recomendada <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  {e.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong className="text-foreground">A quién va dirigido:</strong> {e.target}
                </p>
              </div>

              {/* Recommended Structure */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs">
                <span className="font-semibold text-foreground">📐 Estructura recomendada: </span>
                <span className="text-muted-foreground">{e.structure}</span>
              </div>

              {/* Professional Summary */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-primary" /> Ejemplo de Perfil Profesional:
                </h3>
                <div className="rounded-xl border-l-4 border-primary bg-primary/5 p-4 text-sm italic text-foreground/90 leading-relaxed">
                  "{e.summary}"
                </div>
              </div>

              {/* Experience Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-primary" /> {e.experienceTitle}
                </h3>
                <div className="rounded-xl border border-border bg-background p-4 space-y-2.5 text-xs leading-relaxed text-muted-foreground">
                  {e.experience.map((exp, idx) => (
                    <p key={idx} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{exp}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Skills & Achievements Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Habilidades Clave:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {e.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="rounded-md border border-border bg-background px-2 py-1 text-[11px] text-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-primary" /> Logros destacados:
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {e.achievements}
                  </p>
                </div>
              </div>

              {/* Mistakes & Adaptation Advice */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2 text-xs">
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 space-y-1">
                  <div className="font-bold text-destructive flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" /> Errores comunes a evitar:
                  </div>
                  <p className="text-muted-foreground">{e.mistakes}</p>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-1">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Cómo adaptarlo a una vacante real:
                  </div>
                  <p className="text-muted-foreground">{e.tips}</p>
                </div>
              </div>

              {/* Action Link to Template */}
              <div className="pt-2 flex justify-end">
                <Link to={e.templateLink}>
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    Usar {e.templateName} <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="mt-16 space-y-6 border-t border-border pt-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" /> Preguntas Frecuentes sobre Ejemplos de CV
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿Cuál de estos 10 formatos es el mejor si quiero cambiar de carrera o industria?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                El formato híbrido o funcional (similar al ejemplo de trabajo remoto o diseñador gráfico) es el más adecuado para transiciones de carrera. Te permite colocar en primer plano tus habilidades transferibles (como liderazgo, negociación, gestión de proyectos o dominio de software) antes de tu historial laboral cronológico.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿Puedo utilizar el mismo currículum para todas las vacantes a las que me postulo?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                No se recomienda. Toma uno de estos 10 ejemplos como base sólida, pero asegúrate de ajustar las palabras clave, los títulos de las habilidades y los logros destacados para que coincidan con la descripción exacta del puesto al que aspiras.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿Qué tan importante es la longitud de un CV en México?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Para el 90% de las vacantes en México, 1 sola cuartilla (página) es el estándar de oro. Solo perfiles ejecutivos con más de 10 años de trayectoria continua o profesionistas con múltiples certificaciones y publicaciones técnicas deben extenderse a 2 páginas. Nunca superes dos hojas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿Cómo debe ser el currículum si postulo a un puesto remoto para una empresa extranjera?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Debes indicar claramente tu zona horaria (ej. 'GMT-6 / Ciudad de México'), tu nivel de inglés de negocios (B2 o C1) y tu experiencia utilizando herramientas de trabajo colaborativo como Slack, Notion, Jira o Google Workspace.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA Banner */}
        <section className="mt-16 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-8 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">
            Crea tu currículum profesional a partir de estos ejemplos
          </h3>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground">
            En <strong>CVAI</strong> contamos con plantillas prediseñadas para cada uno de estos 10 perfiles y un asistente con inteligencia artificial que redacta tus logros con métricas de impacto.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/plantillas">
              <Button variant="outline">Explorar todas las plantillas</Button>
            </Link>
            <Link to="/curriculum-vitae">
              <Button className="gap-2">
                Crear mi CV con IA ahora <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* =======================================================================
   ARTICLE 1: GUÍA PASO A PASO PARA HACER UN CV EN MÉXICO
   ======================================================================= */
function GuiaHacerCvArticle({ copyLink, copied }: { copyLink: () => void; copied: boolean }) {
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
            </section>

            {/* Datos de Contacto */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                1. Datos de contacto: Claridad y privacidad
              </h2>
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
                  </ul>
                </div>
              </div>
            </section>

            {/* Perfil profesional */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                2. Perfil profesional con fórmula de impacto
              </h2>
              <div className="space-y-3">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-xs">
                  <span className="font-bold text-destructive uppercase tracking-wide">❌ Ejemplo Débil:</span>
                  <p className="mt-1 text-muted-foreground italic">
                    "Soy una persona proactiva, honesta y trabajadora, con disposición de aprender y adaptarme a cualquier ambiente de trabajo en una empresa que me permita crecer."
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">✅ Ejemplo Profesional:</span>
                  <p className="mt-1 text-foreground font-medium">
                    "Licenciado en Administración y Finanzas con más de 6 años de experiencia en gestión de tesorería y cuentas por cobrar en el sector logístico mexicano. Implementé la conciliación bancaria automatizada reduciendo los cierres contables de 7 a 2 días hábiles. Bilingüe (Español/Inglés C1) y con dominio avanzado de SAP y Excel."
                  </p>
                </div>
              </div>
            </section>

            {/* Optimización ATS */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                3. Optimización para filtros ATS
              </h2>
              <p>
                Usa encabezados universales, exporta siempre en PDF estándar con texto seleccionable y evita elementos gráficos complejos como barras de porcentaje.
              </p>
              <p className="text-sm">
                Comprueba la compatibilidad de tu archivo con nuestro <Link to="/ats-checker" className="text-primary underline font-medium">verificador ATS gratuito</Link>.
              </p>
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
                <Link to="/plantillas">
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

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-primary" /> Recursos destacados
              </h3>
              <div className="space-y-2 text-xs">
                <Link to="/blog/$slug" params={{ slug: "10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos" }} className="block font-medium text-foreground hover:text-primary">
                  → 10 Ejemplos de CV para diferentes trabajos
                </Link>
                <Link to="/ats-checker" className="block text-muted-foreground hover:text-primary">
                  → Verificador ATS Gratuito
                </Link>
                <Link to="/plantillas" className="block text-muted-foreground hover:text-primary">
                  → Plantillas de CV para México
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
