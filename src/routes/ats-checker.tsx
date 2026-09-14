import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ShieldCheck, Loader2, CheckCircle2, AlertTriangle, Tag, Sparkles,
  ArrowRight, FileText, Check, HelpCircle, ChevronRight, RefreshCw,
  UploadCloud, Printer, FileCheck, Layers, Award, Target,
  Clock, Eye, EyeOff, Trash2, Zap, TrendingUp, AlertCircle, CheckCircle,
  Mail, Send, FileType, CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { analyzePublicAts, sendAtsReportEmail, type PublicAtsResponse } from "@/lib/ats.functions";
import { extractTextFromPdf } from "@/lib/pdf-parser";
import { extractTextFromDocx } from "@/lib/docx-parser";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/ats-checker")({
  head: () => ({
    meta: [
      {
        title: "Verificador ATS de Currículum con Subida de PDF Gratis en México | CVAI",
      },
      {
        name: "description",
        content:
          "Escanea tu CV en PDF gratis con el verificador ATS inteligente de CVAI. Sube tu PDF, evalúa compatibilidad con filtros de selección en México, detecta palabras clave faltantes y optimiza tu currículum.",
      },
      { property: "og:title", content: "Verificador ATS de Currículum en PDF Gratis | CVAI México" },
      {
        property: "og:description",
        content: "Sube tu currículum en PDF y obtén un diagnóstico ATS completo con puntaje, palabras clave y métricas de impacto en segundos.",
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
          name: "Verificador ATS de Currículum en PDF CVAI",
          url: "https://www.cvai.com.mx/ats-checker",
          description:
            "Herramienta avanzada gratuita para escanear y auditar currículums en PDF contra sistemas de seguimiento de candidatos (ATS) en el mercado laboral mexicano.",
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
              name: "¿Puedo subir directamente mi CV en PDF?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sí. Nuestro analizador procesa directamente archivos PDF en tu navegador sin almacenar tus datos privados en servidores públicos, extrayendo el texto y evaluando su compatibilidad ATS al instante.",
              },
            },
            {
              "@type": "Question",
              name: "¿Qué es un verificador ATS y cómo funciona?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Es una herramienta que simula cómo los sistemas de seguimiento de candidatos (como Workday, Taleo o LinkedIn) leen, extraen y califican el texto de tu CV frente a una vacante.",
              },
            },
            {
              "@type": "Question",
              name: "¿Qué puntaje ATS se considera bueno en México?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Un puntaje superior a 80 puntos garantiza que tu CV superará los filtros automáticos y llegará a manos del reclutador humano.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: PublicAtsCheckerPage,
});

const SAMPLE_RESUME = `ROBERTO ALONSO SÁNCHEZ
Ciudad de México, CDMX | Tel: 55-4321-9876 | roberto.alonso@email.com | linkedin.com/in/roberto-alonso

RESUMEN PROFESIONAL
Coordinador de Logística y Cadena de Suministro con más de 6 años de experiencia en gestión de inventarios, almacenes centrales y distribución regional en México. Especialista en implementación de SAP ERP (Módulos MM/SD) y metodologías Lean Manufacturing. Capacidad comprobada para reducir tiempos de entrega en un 18%, recortar costos de transporte en 14% y liderar equipos multidisciplinarios de más de 20 personas.

EXPERIENCIA LABORAL
Coordinador de Almacén y Distribución | Logística Express S.A. de C.V.
Marzo 2022 – Presente | Cuautitlán Izcalli, Estado de México
- Supervisé la operación diaria de un almacén central de 4,500 m² con un equipo a cargo de 22 colaboradores operativos.
- Implementé el sistema de ruteo dinámico con software TMS, disminuyendo costos de combustible en 14% en el primer año.
- Reduje mermas en inventario del 3.2% al 0.8% mediante auditorías cíclicas con lectores de código de barras RF.
- Negocié tarifas anuales con 8 transportistas nacionales, generando ahorros de $450,000 MXN en contratos logísticos.

Analista de Cadena de Suministro | Distribuidora Central Mexicana
Enero 2019 – Febrero 2022 | Azcapotzalco, Ciudad de México
- Coordiné la planeación de compras de insumos para 15 centros de distribución a nivel nacional.
- Diseñé tableros de control en Power BI para el monitoreo de KPIs de rotación de inventarios y niveles de servicio (OTIF).
- Automaticé reportes semanales en Excel avanzado (Macros y Power Query), ahorrando 6 horas hombre por semana.

EDUCACIÓN
Licenciatura en Negocios Internacionales y Logística
Universidad Nacional Autónoma de México (UNAM) | 2015 – 2019 | Cédula Profesional: 11223344

HABILIDADES TÉCNICAS
- SAP ERP (Módulos MM / SD)
- Software TMS y WMS
- Power BI y Excel avanzado (Tablas dinámicas, Macros, XLOOKUP)
- Metodología 5S y Lean Manufacturing
- Facturación electrónica y control aduanal
- Inglés intermedio-avanzado (B2)`;

function PublicAtsCheckerPage() {
  const navigate = useNavigate();
  const analyzeFn = useServerFn(analyzePublicAts);
  const sendReportFn = useServerFn(sendAtsReportEmail);

  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractingFile, setExtractingFile] = useState(false);
  const [fileMeta, setFileMeta] = useState<{
    fileName: string;
    format: "PDF" | "DOCX" | "TXT";
    fileSizeKb: number;
    numPages: number;
    wordCount: number;
  } | null>(null);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [result, setResult] = useState<PublicAtsResponse | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Email Lead Magnet
  const [leadEmail, setLeadEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function handleFileUpload(file: File) {
    if (!file) return;

    const lower = file.name.toLowerCase();
    const isPdf = lower.endsWith(".pdf") || file.type === "application/pdf";
    const isDocx = lower.endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const isTxt = lower.endsWith(".txt") || file.type === "text/plain";

    if (!isPdf && !isDocx && !isTxt) {
      toast.error("Por favor selecciona un archivo PDF (.pdf) o Word (.docx)");
      return;
    }

    setExtractingFile(true);
    try {
      if (isPdf) {
        const extracted = await extractTextFromPdf(file);
        setResumeText(extracted.text);
        setFileMeta({
          fileName: file.name,
          format: "PDF",
          fileSizeKb: Math.round(file.size / 1024),
          numPages: extracted.numPages,
          wordCount: extracted.wordCount,
        });
        toast.success(`¡PDF extraído con éxito! (${extracted.numPages} ${extracted.numPages === 1 ? "página" : "páginas"}, ${extracted.wordCount} palabras)`);
      } else if (isDocx) {
        const extracted = await extractTextFromDocx(file);
        setResumeText(extracted.text);
        setFileMeta({
          fileName: file.name,
          format: "DOCX",
          fileSizeKb: Math.round(file.size / 1024),
          numPages: Math.max(1, Math.round(extracted.wordCount / 300)),
          wordCount: extracted.wordCount,
        });
        toast.success(`¡Documento Word (.docx) extraído con éxito! (${extracted.wordCount} palabras)`);
      } else if (isTxt) {
        const text = await file.text();
        setResumeText(text);
        setFileMeta({
          fileName: file.name,
          format: "TXT",
          fileSizeKb: Math.round(file.size / 1024),
          numPages: 1,
          wordCount: text.trim().split(/\s+/).filter(Boolean).length,
        });
        toast.success("Archivo de texto cargado correctamente");
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "No se pudo leer el texto del archivo";
      toast.error(msg);
    } finally {
      setExtractingFile(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }

  function handleClearFile() {
    setResumeText("");
    setFileMeta(null);
    setShowExtractedText(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!resumeText.trim()) {
      toast.error("Sube un archivo PDF/Word o pega el texto de tu currículum para iniciar el análisis");
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeFn({
        data: {
          resumeText: resumeText.trim(),
          jobDescription: jobDescription.trim() || undefined,
        },
      });
      setResult(data as PublicAtsResponse);
      toast.success("¡Diagnóstico ATS completado!");
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err) {
      console.error(err);
      toast.error("Hubo un problema al procesar el análisis. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setActiveTab("paste");
    setResumeText(SAMPLE_RESUME);
    setFileMeta(null);
    setJobDescription("Buscamos Coordinador de Logística con experiencia comprobada en SAP ERP (MM/SD), liderazgo de almacenes y reducción de costos operativos en México.");
    toast.info("Ejemplo cargado. Haz clic en 'Analizar Compatibilidad ATS'.");
  }

  async function handleOneClickOptimize() {
    if (!resumeText.trim()) return;
    setOptimizing(true);

    try {
      const lines = resumeText.split("\n").map((l) => l.trim()).filter(Boolean);
      const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phoneMatch = resumeText.match(/(?:\+?52\s?)?(?:\(?\d{2,3}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4}/);
      const locationMatch = resumeText.match(/(?:ciudad de méxico|cdmx|estado de méxico|edomex|monterrey|guadalajara|puebla|querétaro|mérida|tijuana|león|toluca|méxico)/i);

      const firstLine = lines[0] || "Mi Nombre";
      const name = firstLine.length < 50 && !firstLine.includes("@") ? firstLine : "Candidato Profesional";

      const importedData = {
        full_name: name,
        headline: result?.targetRole || "Especialista Profesional",
        email: emailMatch ? emailMatch[0] : "",
        phone: phoneMatch ? phoneMatch[0] : "",
        location: locationMatch ? locationMatch[0] : "Ciudad de México, México",
        summary: result?.summary || (lines.slice(1, 4).join(" ") || ""),
        skills: result?.matchedKeywords && result.matchedKeywords.length > 0 ? result.matchedKeywords : ["Liderazgo", "Gestión", "Resolución de Problemas"],
        experience: [
          {
            role: "Especialista / Coordinador",
            company: "Empresa Líder",
            period: "2021 – Presente",
            description: result?.actionVerbsDetected && result.actionVerbsDetected.length > 0
              ? `${result.actionVerbsDetected[0]} proyectos logrando ${result.metricsDetected[0] || "resultados cuantificables"}.`
              : "Responsable de coordinar actividades clave y optimizar procesos organizacionales.",
          }
        ],
        education: [
          {
            degree: "Licenciatura / Grado Universitario",
            school: "Universidad en México",
            period: "2016 – 2020",
          }
        ]
      };

      localStorage.setItem("cvai_imported_resume", JSON.stringify(importedData));

      // Check if user is logged in
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: newCv, error } = await supabase
          .from("resumes")
          .insert({ user_id: userData.user.id, title: "CV Optimizado ATS", template: "stage-executive" })
          .select("id")
          .single();
        if (!error && newCv) {
          toast.success("¡Creando tu nuevo CV optimizado!");
          navigate({ to: "/cv/$id", params: { id: newCv.id } });
          return;
        }
      }

      // If not authenticated, redirect to auth
      toast.info("Inicia sesión o crea tu cuenta gratuita para abrir tu CV optimizado.");
      navigate({ to: "/auth", search: { redirect: "/panel/curriculums", import: "true" } });
    } catch (e) {
      console.error(e);
      toast.error("Hubo un detalle al preparar la importación.");
    } finally {
      setOptimizing(false);
    }
  }

  async function handleSendEmailReport(e: React.FormEvent) {
    e.preventDefault();
    if (!leadEmail.trim() || !result) return;

    setSendingEmail(true);
    try {
      await sendReportFn({
        data: {
          email: leadEmail.trim(),
          score: result.score,
          grade: result.grade,
          summary: result.summary,
          strengths: result.strengths,
          improvements: result.improvements,
          missingKeywords: result.missingKeywords,
        },
      });
      setEmailSent(true);
      toast.success("¡Diagnóstico ATS enviado con éxito a tu correo!");
    } catch {
      toast.error("No se pudo enviar el informe en este momento.");
    } finally {
      setSendingEmail(false);
    }
  }

  function handlePrintReport() {
    window.print();
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
            <span className="text-foreground font-medium">Verificador ATS en PDF</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <header className="border-b border-border/50 bg-gradient-to-b from-secondary/40 via-background to-background py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5" /> Escáner de Currículum ATS 2026
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Verificador de Currículum ATS en México
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Sube tu currículum en formato <strong className="text-foreground">PDF</strong> o pega tu texto. Nuestro algoritmo analiza la legibilidad técnica, secciones obligatorias, métricas de impacto y palabras clave frente a los filtros de selección en México.
          </p>
          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Compatible con Workday, Taleo y OCC
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Análisis 100% Gratuito y Privado
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Sin Registro Obligatorio
            </span>
          </div>
        </div>
      </header>

      {/* Main Interactive Scanner Container */}
      <main className="mx-auto max-w-5xl px-4 py-12 space-y-12">
        <form onSubmit={handleAnalyze} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" /> Ingresa tu Currículum Vitae
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Elige si prefieres subir tu archivo PDF directamente o pegar el contenido.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={loadSample} className="text-xs text-primary gap-1.5 shrink-0">
              <Sparkles className="h-3.5 w-3.5" /> Cargar CV de Ejemplo
            </Button>
          </div>

          {/* Mode Selector Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "paste")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
              <TabsTrigger value="upload" className="text-xs font-semibold gap-2">
                <UploadCloud className="h-4 w-4" /> Subir archivo (PDF o Word)
              </TabsTrigger>
              <TabsTrigger value="paste" className="text-xs font-semibold gap-2">
                <FileText className="h-4 w-4" /> Pegar texto de CV
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: FILE UPLOAD (PDF, DOCX, TXT) */}
            <TabsContent value="upload" className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              {!fileMeta && !extractingFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-primary bg-primary/10 scale-[1.01]"
                      : "border-border/80 hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Haz clic para seleccionar tu PDF o Word (.docx) o arrástralo aquí
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                    Soporta archivos <strong className="text-foreground">.PDF</strong>, <strong className="text-foreground">.DOCX</strong> y <strong className="text-foreground">.TXT</strong> (hasta 20 MB). Tu información se analiza directamente en tu navegador con total privacidad.
                  </p>
                  <div className="mt-5">
                    <Button type="button" variant="secondary" size="sm" className="pointer-events-none text-xs gap-1.5">
                      Explorar archivos en mi equipo
                    </Button>
                  </div>
                </div>
              ) : extractingFile ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/30 bg-primary/5 p-12 text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <h4 className="font-display text-sm font-bold text-foreground">
                    Extrayendo contenido de tu documento...
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Leyendo capas de texto, encabezados y coordenadas tipográficas de forma segura.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-secondary/30 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FileCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-foreground truncate max-w-xs sm:max-w-md">
                            {fileMeta?.fileName}
                          </p>
                          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                            {fileMeta?.format} Listo
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {fileMeta?.fileSizeKb} KB • {fileMeta?.numPages} {fileMeta?.numPages === 1 ? "página" : "páginas"} • {fileMeta?.wordCount} palabras detectadas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowExtractedText(!showExtractedText)}
                        className="text-xs gap-1"
                      >
                        {showExtractedText ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {showExtractedText ? "Ocultar texto" : "Ver texto extraído"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs"
                      >
                        Cambiar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFile}
                        className="text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {showExtractedText && (
                    <div className="space-y-2 pt-2 border-t border-border">
                      <Label className="text-xs font-semibold">Texto extraído para análisis ATS:</Label>
                      <Textarea
                        rows={8}
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="text-xs font-mono bg-background"
                      />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* TAB 2: MANUAL TEXT PASTE */}
            <TabsContent value="paste" className="space-y-2">
              <Label htmlFor="resumeText" className="text-xs font-semibold flex items-center justify-between">
                <span>Contenido textual de tu currículum *</span>
                <span className="text-[11px] text-muted-foreground">{resumeText.trim().split(/\s+/).filter(Boolean).length} palabras</span>
              </Label>
              <Textarea
                id="resumeText"
                rows={11}
                placeholder="Pega aquí el contenido completo de tu CV (Datos de contacto, perfil profesional, experiencia laboral, educación y habilidades)..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="text-xs font-mono leading-relaxed"
                required={activeTab === "paste"}
              />
            </TabsContent>
          </Tabs>

          {/* Optional Job Description Input for Exact Match Scoring */}
          <div className="space-y-2 pt-2 border-t border-border/70">
            <div className="flex items-center justify-between">
              <Label htmlFor="jobDescription" className="text-xs font-semibold flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-primary" />
                <span>Vacante de empleo objetivo (Opcional, pero muy recomendado)</span>
              </Label>
              <span className="text-[11px] text-muted-foreground">Para medir afinidad de palabras clave</span>
            </div>
            <Textarea
              id="jobDescription"
              rows={4}
              placeholder="Pega la oferta de empleo (requisitos, funciones, herramientas requeridas) para calcular el porcentaje de afinidad con la vacante..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="text-xs leading-relaxed"
            />
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Privacidad garantizada. No almacenamos tus datos en servidores públicos.</span>
            </p>
            <Button
              type="submit"
              size="lg"
              disabled={loading || extractingFile || !resumeText.trim()}
              className="w-full sm:w-auto gap-2 text-sm font-semibold shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Auditando con algoritmo ATS...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" /> Iniciar Escaneo y Diagnóstico ATS
                </>
              )}
            </Button>
          </div>
        </form>

        {/* RESULTS DASHBOARD */}
        {result && (
          <section ref={resultsRef} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-lg space-y-8 animate-in fade-in duration-300">
            {/* Header / Big Score Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-border pb-8">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
                    Auditoría Completada
                  </Badge>
                  <span className="text-xs text-muted-foreground">• {result.wordCount} palabras evaluadas</span>
                  <span className="text-xs text-muted-foreground">• ~{result.readingTimeMinutes} min lectura</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Diagnóstico de Compatibilidad ATS
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Main Circular/Pill Score Badge */}
              <div className="flex items-center gap-5 rounded-2xl bg-secondary/40 p-5 border border-border shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
                <div>
                  <p className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
                    Calificación ATS
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-5xl font-black ${
                        result.score >= 80
                          ? "text-emerald-500"
                          : result.score >= 65
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                    >
                      {result.score}
                    </span>
                    <span className="text-lg text-muted-foreground font-semibold">/100</span>
                  </div>
                </div>

                <div className="h-12 w-[1px] bg-border" />

                <div className="space-y-1 text-right">
                  <span className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold text-xl px-3 py-1">
                    {result.grade}
                  </span>
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    {result.verdict}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-3.5 rounded-2xl border border-border/80">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Escaneado en tiempo real con reglas de contratación en México.</span>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handlePrintReport} className="text-xs gap-1.5">
                  <Printer className="h-3.5 w-3.5" /> Imprimir / Guardar Reporte
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleClearFile();
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  className="text-xs gap-1 text-muted-foreground"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Analizar otro CV
                </Button>
              </div>
            </div>

            {/* 4 Category Sub-Scores */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Category 1: Structure */}
              <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-primary" /> Estructura y Formato
                  </span>
                  <span className="font-bold text-foreground">{result.categories.structure}/100</span>
                </div>
                <Progress value={result.categories.structure} className="h-2" />
                <p className="text-[11px] text-muted-foreground">
                  {result.categories.structure >= 80 ? "Encabezados y jerarquía óptimos." : "Faltan secciones clave estándar."}
                </p>
              </div>

              {/* Category 2: Keywords */}
              <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-primary" /> Palabras Clave
                  </span>
                  <span className="font-bold text-foreground">{result.categories.keywords}/100</span>
                </div>
                <Progress value={result.categories.keywords} className="h-2" />
                <p className="text-[11px] text-muted-foreground">
                  {result.categories.keywords >= 80 ? "Alta coincidencia de habilidades." : "Baja densidad de términos técnicos."}
                </p>
              </div>

              {/* Category 3: Impact */}
              <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-primary" /> Impacto y Métricas
                  </span>
                  <span className="font-bold text-foreground">{result.categories.impact}/100</span>
                </div>
                <Progress value={result.categories.impact} className="h-2" />
                <p className="text-[11px] text-muted-foreground">
                  {result.metricsDetected.length > 0
                    ? `${result.metricsDetected.length} métricas con números detectadas.`
                    : "Agrega porcentajes y números concretos."}
                </p>
              </div>

              {/* Category 4: Formatting */}
              <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-primary" /> Legibilidad ATS
                  </span>
                  <span className="font-bold text-foreground">{result.categories.formatting}/100</span>
                </div>
                <Progress value={result.categories.formatting} className="h-2" />
                <p className="text-[11px] text-muted-foreground">
                  {result.wordCount >= 250 && result.wordCount <= 850
                    ? "Extensión ideal (1 a 2 páginas)."
                    : "Extensión fuera de rango óptimo."}
                </p>
              </div>
            </div>

            {/* In-Depth Breakdown Tabs */}
            <Tabs defaultValue="sections" className="w-full space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="sections" className="text-xs font-semibold gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Auditoría de Secciones
                </TabsTrigger>
                <TabsTrigger value="keywords" className="text-xs font-semibold gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> Palabras Clave
                </TabsTrigger>
                <TabsTrigger value="impact" className="text-xs font-semibold gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" /> Métricas y Verbos
                </TabsTrigger>
                <TabsTrigger value="fixes" className="text-xs font-semibold gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> Plan de Acción
                </TabsTrigger>
              </TabsList>

              {/* SUB-TAB 1: Sections Audit */}
              <TabsContent value="sections" className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {result.sectionsAudit.map((sec, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl border p-4 flex items-start gap-3 transition-colors ${
                        sec.status === "pass"
                          ? "border-emerald-500/20 bg-emerald-500/5"
                          : sec.status === "warning"
                          ? "border-amber-500/20 bg-amber-500/5"
                          : "border-rose-500/20 bg-rose-500/5"
                      }`}
                    >
                      {sec.status === "pass" ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : sec.status === "warning" ? (
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-foreground">{sec.name}</h4>
                          <Badge
                            className={`text-[10px] px-1.5 py-0 h-4 ${
                              sec.status === "pass"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : sec.status === "warning"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            }`}
                          >
                            {sec.status === "pass" ? "Aprobado" : sec.status === "warning" ? "Revisar" : "Faltante"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {sec.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* SUB-TAB 2: Keywords */}
              <TabsContent value="keywords" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Matched */}
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
                    <h4 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4" /> Palabras Clave Detectadas ({result.matchedKeywords.length})
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Estos términos fueron identificados con éxito en tu currículum:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {result.matchedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-emerald-500/20 bg-background px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                        >
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
                    <h4 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4" /> Palabras Clave Sugeridas ({result.missingKeywords.length})
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Considera agregar estos términos de alta demanda en tu experiencia o habilidades:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {result.missingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-amber-500/20 bg-background px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300"
                        >
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* SUB-TAB 3: Impact & Verbs */}
              <TabsContent value="impact" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Metrics Detected */}
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                    <h4 className="font-bold text-primary flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4" /> Métricas Cuantitativas Encontradas
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Los reclutadores priorizan candidatos que demuestran logros con números (% de ahorro, personas, presupuestos):
                    </p>
                    {result.metricsDetected.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {result.metricsDetected.map((m, i) => (
                          <span
                            key={i}
                            className="rounded-lg border border-primary/30 bg-background px-2.5 py-1 text-xs font-bold text-primary"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                        No se detectaron métricas cuantitativas. Agrega cifras como "aumento del 20%" o "equipo de 10 personas" para aumentar tu puntaje.
                      </p>
                    )}
                  </div>

                  {/* Action Verbs */}
                  <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                    <h4 className="font-bold text-foreground flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-amber-500" /> Verbos de Acción Identificados
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Inicia cada viñeta con un verbo de acción para reflejar proactividad y liderazgo:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {result.actionVerbsDetected.map((v, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1 text-xs text-foreground font-medium"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Google XYZ Formula Tip Box */}
                <div className="rounded-2xl border border-border bg-secondary/30 p-5 space-y-2">
                  <h5 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    💡 Consejo Pro: Fórmula Google XYZ para viñetas de CV
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Redacta tus funciones siguiendo la regla de los gigantes tecnológicos: <strong className="text-foreground">"Logré [X] medido por [Y] haciendo [Z]"</strong>. Por ejemplo: <em>"Reduje costos de transporte en 14% mediante la implementación de software TMS de ruteo dinámico"</em>.
                  </p>
                </div>
              </TabsContent>

              {/* SUB-TAB 4: Action Plan & Fixes */}
              <TabsContent value="fixes" className="space-y-6">
                <div className="rounded-2xl border border-primary/20 bg-card p-5 space-y-4">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-primary" /> Acciones Prioritarias para Subir tu Puntaje ATS a 90+
                  </h4>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    {result.criticalFixes.map((fix, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-secondary/40 p-3 rounded-xl border border-border/60">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[11px]">
                          {idx + 1}
                        </span>
                        <span className="text-foreground leading-relaxed">{fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strengths and General Improvements Grid */}
                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                    <h5 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> Principales Fortalezas
                    </h5>
                    <ul className="space-y-1.5 text-muted-foreground">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                    <h5 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Oportunidades Clave
                    </h5>
                    <ul className="space-y-1.5 text-muted-foreground">
                      {result.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* 1-Click Optimizer Action Banner */}
            <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-primary/5 to-background p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-0.5 text-xs font-bold uppercase tracking-wider shadow-xs">
                  <Sparkles className="h-3.5 w-3.5" /> Recomendado por CVAI
                </div>
                <h4 className="font-display text-xl sm:text-2xl font-black text-foreground">
                  Reparar mi CV y Crear Versión 95+ con 1 Clic
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                  Traspasa la información de tu archivo directamente a una de nuestras plantillas profesionales optimizadas para ATS. <strong className="text-foreground">¡Sin tener que volver a escribir tus datos ni rediseñar desde cero!</strong>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                <Button
                  onClick={handleOneClickOptimize}
                  disabled={optimizing}
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-sm font-bold shadow-md bg-primary hover:bg-primary/90"
                >
                  {optimizing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Preparando tu CV...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" /> Optimizar mi CV con 1 Clic
                    </>
                  )}
                </Button>
                <Link to="/plantillas">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-xs gap-1.5">
                    Ver Plantillas <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Lead Magnet: Email Report Card */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="space-y-1">
                  <h4 className="font-display text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" /> ¿Deseas recibir este diagnóstico completo en tu correo?
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                    Te enviamos la lista detallada de palabras clave faltantes, las métricas de impacto y la guía técnica de contratación en México para que la consultes cuando quieras.
                  </p>
                </div>
              </div>

              {emailSent ? (
                <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-700 dark:text-emerald-300 text-xs">
                  <CheckCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span>
                    <strong>¡Diagnóstico enviado con éxito!</strong> Revisa tu bandeja de entrada (o carpeta de promociones/spam) para consultar tu informe ATS.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSendEmailReport} className="flex flex-col sm:flex-row gap-3 pt-1">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="Ingresa tu correo electrónico (ej. nombre@gmail.com)..."
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pl-10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <Button type="submit" disabled={sendingEmail || !leadEmail.trim()} className="gap-2 text-xs font-semibold shrink-0">
                    {sendingEmail ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" /> Enviar Informe a mi Correo
                      </>
                    )}
                  </Button>
                </form>
              )}
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
              En México, empresas medianas y grandes que reclutan a través de plataformas como OCCMundial, LinkedIn Recruiter, Workday, Taleo o SAP SuccessFactors utilizan sistemas ATS para filtrar hasta el 75% de las solicitudes antes de que un reclutador humano las lea.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-foreground text-sm">Extracción Técnica (Parsing)</h3>
              <p className="text-muted-foreground leading-relaxed">
                El sistema convierte el archivo PDF en texto plano. Si tu documento fue diseñado con tablas complejas, cuadros de texto flotantes o como imagen escaneada en Canva, el software no podrá extraer tu información.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-foreground text-sm">Afinidad de Palabras Clave</h3>
              <p className="text-muted-foreground leading-relaxed">
                El software compara las palabras clave requeridas en la vacante (software, certificaciones, herramientas) con las que aparecen en tu experiencia laboral y les asigna un porcentaje de coincidencia.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-foreground text-sm">Clasificación para el Reclutador</h3>
              <p className="text-muted-foreground leading-relaxed">
                Los candidatos que alcanzan puntuaciones por encima de 80 aparecen en los primeros lugares de la lista del reclutador para agendar la primera entrevista telefónica o por videollamada.
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
                ¿Es mejor enviar el currículum en PDF o en Word (.docx)?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                El formato PDF generado con código estructurado (como el de CVAI) es el estándar preferido hoy en día porque preserva la tipografía y el diseño en cualquier dispositivo sin desconfigurarse. Solo asegúrate de que el PDF contenga texto seleccionable y no sea una imagen plana escaneada.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿Qué pasa si mi currículum tiene dos columnas?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Muchos sistemas ATS antiguos leen los documentos de izquierda a derecha en línea horizontal. Si las dos columnas no están codificadas correctamente, el sistema puede mezclar el texto de ambas columnas, arruinando la lectura. Las plantillas de CVAI están optimizadas para que el orden de lectura sea siempre secuencial y seguro.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿Cómo adapta el verificador los criterios al mercado de México?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Considera la estructura habitual de reclutamiento en México: validación de cédula profesional o grado académico, clave lada telefónica nacional (10 dígitos), ciudades y estados del país, y el peso de certificaciones técnicas e idiomas (como el dominio de inglés B2/C1).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿El análisis de mi PDF es privado y confidencial?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Totalmente. La extracción del texto del PDF se realiza directamente en tu propio navegador web a través de bibliotecas seguras. No almacenamos tus archivos ni tus datos de contacto en servidores externos para fines comerciales.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Bottom CTA Banner */}
        <section className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center space-y-4">
          <h3 className="font-display text-2xl font-bold text-foreground">
            Crea tu currículum optimizado para ATS en minutos
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Ahorra horas de formato. Elige una de nuestras plantillas profesionales diseñadas para pasar todos los filtros en México.
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
