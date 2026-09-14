import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ShieldCheck, Loader2, CheckCircle2, AlertTriangle, Tag, Sparkles,
  ArrowRight, FileText, Check, HelpCircle, ChevronRight, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { analyzePublicAts } from "@/lib/ats.functions";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/ats-checker")({
  head: () => ({
    meta: [
      {
        title: "Verificador ATS de Currículum Gratis en México | CVAI",
      },
      {
        name: "description",
        content:
          "Escanea tu CV gratis con el verificador ATS de CVAI. Analiza compatibilidad con filtros de selección, detecta palabras clave faltantes y optimiza tu currículum para empresas en México.",
      },
      { property: "og:title", content: "Verificador ATS de Currículum Gratis | CVAI México" },
      {
        property: "og:description",
        content: "Escáner gratuito de compatibilidad con filtros ATS. Analiza tu CV en segundos sin registro.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.cvai.com.mx/ats-checker" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/ats-checker" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Verificador ATS de Currículum CVAI",
          url: "https://www.cvai.com.mx/ats-checker",
          description:
            "Herramienta gratuita para verificar si un currículum vitae es compatible con sistemas ATS en México.",
          applicationCategory: "UtilityApplication",
          operatingSystem: "All",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "MXN",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "¿Qué es un verificador ATS?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Es una herramienta que simula cómo los sistemas de seguimiento de candidatos (ATS) leen, extraen y califican el texto de tu currículum frente a una vacante.",
              },
            },
            {
              "@type": "Question",
              name: "¿Es seguro usar el verificador de CVAI?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sí. Tu texto se analiza de manera segura y no se comparte con terceros ni se utiliza con fines publicitarios.",
              },
            },
            {
              "@type": "Question",
              name: "¿Qué puntaje ATS se considera bueno para conseguir entrevista?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Un puntaje superior a 75 u 80 puntos indica que tu CV cuenta con los elementos estructurales y palabras clave suficientes para pasar a revisión del reclutador humano.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: PublicAtsCheckerPage,
});

type AtsResult = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
};

const SAMPLE_RESUME = `ROBERTO ALONSO SÁNCHEZ
Ciudad de México, CDMX | Tel: 55-4321-9876 | roberto.alonso@email.com | linkedin.com/in/roberto-alonso

RESUMEN PROFESIONAL
Coordinador de Logística con 6 años de experiencia en gestión de inventarios y distribución regional en México. Especialista en implementación de SAP ERP (Módulos MM/SD) y metodologías Lean Manufacturing. Capacidad comprobada para reducir tiempos de entrega en un 18% y negociar con transportistas nacionales.

EXPERIENCIA LABORAL
Coordinador de Almacén y Distribución | Logística Express S.A. de C.V.
Marzo 2022 – Presente | Cuautitlán Izcalli, Estado de México
- Supervisé la operación diaria de un almacén central de 4,500 m² con un equipo a cargo de 22 colaboradores operativos.
- Implementé el sistema de ruteo dinámico con software TMS, disminuyendo costos de combustible en 14% en el primer año.
- Reduje mermas en inventario del 3.2% al 0.8% mediante auditorías cíclicas con lectores de código de barras RF.

EDUCACIÓN
Licenciatura en Negocios Internacionales y Logística
Universidad Nacional Autónoma de México (UNAM) | 2016 – 2020 | Cédula Profesional: 12345678

HABILIDADES TÉCNICAS
- SAP ERP (Módulos MM / SD)
- Excel avanzado (Tablas dinámicas, XLOOKUP, Macros)
- Manejo de TMS y WMS
- Metodología 5S y Lean Manufacturing
- Inglés intermedio-avanzado (B2)`;

function PublicAtsCheckerPage() {
  const analyzeFn = useServerFn(analyzePublicAts);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AtsResult | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!resumeText.trim()) {
      toast.error("Pega el texto de tu currículum para analizarlo");
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeFn({
        data: {
          resumeText,
          jobDescription: jobDescription.trim() || undefined,
        },
      });
      setResult(data as AtsResult);
      toast.success("¡Análisis ATS completado!");
    } catch {
      toast.error("No se pudo completar el análisis en este momento");
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setResumeText(SAMPLE_RESUME);
    setJobDescription("Buscamos Coordinador de Logística con experiencia en SAP, inventarios y liderazgo de equipos de almacén.");
    toast.info("Ejemplo cargado. Haz clic en 'Analizar Compatibilidad ATS'.");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumbs */}
      <div className="border-b border-border/40 bg-secondary/20">
        <div className="mx-auto max-w-5xl px-4 py-3 text-xs text-muted-foreground">
          <nav className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/plantillas" className="hover:text-foreground transition-colors">Herramientas</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Verificador ATS Gratuito</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <header className="border-b border-border/50 bg-gradient-to-b from-secondary/40 to-background py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Escáner de Compatibilidad ATS Gratuito
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Verificador de Currículum ATS en México
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Pega el texto de tu currículum vitae y evalúa al instante si cumple con las reglas de extracción técnica y palabras clave utilizadas por las empresas en México.
          </p>
        </div>
      </header>

      {/* Main Interactive Scanner */}
      <main className="mx-auto max-w-5xl px-4 py-12 space-y-12">
        <form onSubmit={handleAnalyze} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Ingresa la información a evaluar
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={loadSample} className="text-xs text-primary gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Cargar ejemplo
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="resumeText" className="text-xs font-semibold flex items-center justify-between">
                <span>Texto de tu currículum vitae *</span>
                <span className="text-[11px] text-muted-foreground">Copia y pega desde tu PDF o Word</span>
              </Label>
              <Textarea
                id="resumeText"
                rows={11}
                placeholder="Pega aquí el contenido de tu CV (Datos de contacto, perfil, experiencia laboral, educación, habilidades)..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="text-xs font-mono leading-relaxed"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription" className="text-xs font-semibold flex items-center justify-between">
                <span>Descripción de la vacante (Opcional)</span>
                <span className="text-[11px] text-muted-foreground">Para medir afinidad de keywords</span>
              </Label>
              <Textarea
                id="jobDescription"
                rows={11}
                placeholder="Pega la oferta de empleo a la que te postulas (requisitos, responsabilidades, herramientas requeridas)..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="text-xs leading-relaxed"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              🔒 Análisis privado y seguro. No guardamos tu texto en servidores públicos.
            </p>
            <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analizando compatibilidad...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Analizar Compatibilidad ATS
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Results Panel */}
        {result && (
          <section className="rounded-3xl border border-primary/30 bg-card p-6 sm:p-8 shadow-md space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-border pb-6">
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
                  Diagnóstico de Compatibilidad
                </Badge>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  Resultados del Escaneo ATS
                </h3>
                <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                  {result.summary}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border shrink-0">
                <div className="text-right">
                  <p className="text-[11px] uppercase font-bold text-muted-foreground">Puntaje ATS</p>
                  <p className={`text-4xl font-extrabold ${result.score >= 80 ? "text-emerald-600 dark:text-emerald-400" : result.score >= 60 ? "text-amber-500" : "text-destructive"}`}>
                    {result.score}<span className="text-base text-muted-foreground font-normal">/100</span>
                  </p>
                </div>
                <div className="h-10 w-[1px] bg-border" />
                <Badge className={result.score >= 80 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : result.score >= 60 ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
                  {result.score >= 80 ? "Excelente" : result.score >= 60 ? "Aceptable" : "Requiere mejoras"}
                </Badge>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3 text-xs">
              {/* Strengths */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
                <h4 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="h-4 w-4" /> Puntos Fuertes ({result.strengths.length})
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
                <h4 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 text-sm">
                  <AlertTriangle className="h-4 w-4" /> Oportunidades de Mejora ({result.improvements.length})
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  {result.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keywords */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                <h4 className="font-bold text-primary flex items-center gap-1.5 text-sm">
                  <Tag className="h-4 w-4" /> Palabras Clave Recomendadas
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((kw, i) => (
                    <span key={i} className="rounded-md border border-primary/20 bg-background px-2 py-1 text-[11px] text-foreground">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground">
                <strong className="text-foreground">¿Quieres un currículum con puntaje superior a 90?</strong> Usa nuestras plantillas probadas para pasar los filtros de selección.
              </div>
              <div className="flex gap-2">
                <Link to="/plantillas">
                  <Button size="sm" className="gap-1 text-xs">
                    Ver plantillas ATS <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
                <Link to="/curriculum-vitae">
                  <Button variant="outline" size="sm" className="text-xs">
                    Crear CV nuevo
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Educational Content Section */}
        <section className="space-y-6 pt-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              ¿Cómo evalúan los sistemas ATS los currículums en México?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Los sistemas como Workday, Taleo, SuccessFactors, LinkedIn Recruiter y OCCMundial procesan miles de solicitudes al día. No leen imágenes ni gráficos complejos: extraen texto plano para indexarlo en campos de datos clave.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <h3 className="font-bold text-foreground text-sm">1. Extracción Limpia (Parsing)</h3>
              <p className="text-muted-foreground leading-relaxed">
                El analizador convierte tu archivo en texto. Si colocas información vital en tablas con bordes invisibles o encabezados de Word, el sistema la ignorará.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <h3 className="font-bold text-foreground text-sm">2. Puntuación de Afinidad</h3>
              <p className="text-muted-foreground leading-relaxed">
                El software compara las palabras clave del puesto con tu experiencia, asignando una calificación para que el reclutador decida a quién llamar primero.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <h3 className="font-bold text-foreground text-sm">3. Revisión Humana Final</h3>
              <p className="text-muted-foreground leading-relaxed">
                Superar el filtro ATS es el primer paso. Tu CV debe estar redactado con métricas y logros convincentes para cautivar a quien te entrevistará.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-6 border-t border-border pt-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" /> Preguntas frecuentes sobre el verificador ATS
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿Qué es un verificador ATS y para qué sirve?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Es un escáner inteligente que analiza tu CV de la misma forma que lo hacen los sistemas de reclutamiento corporativos. Te indica si tu texto es legible, qué palabras clave te hacen falta y qué errores de formato debes corregir antes de postularte.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿El uso de este verificador es 100% gratuito?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Sí, en CVAI puedes evaluar tu texto tantas veces como lo requieras sin necesidad de ingresar tarjeta bancaria ni crear una cuenta obligatoria.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿Por qué un CV con formato visual en Canva puede fallar en un ATS?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Muchas plantillas gráficas exportan el texto en capas desordenadas, usan tablas anidadas o guardan el archivo como mapa de bits. Esto provoca que el ATS no pueda leer las palabras o mezcle columnas, resultando en un descarte técnico involuntario.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center space-y-4">
          <h3 className="font-display text-2xl font-bold text-foreground">
            Asegura tu compatibilidad ATS con las plantillas de CVAI
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Todas nuestras plantillas están construidas con código limpio y probado para garantizar lectura perfecta en cualquier sistema ATS.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/plantillas">
              <Button size="lg" className="gap-2">
                Ver plantillas compatibles con ATS <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/blog/que-es-un-curriculum-ats-como-hacer-cv-compatible">
              <Button variant="outline" size="lg">
                Leer guía completa de ATS
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
