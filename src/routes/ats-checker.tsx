import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ShieldCheck, Loader2, CheckCircle2, AlertTriangle, Tag, Sparkles,
  ArrowRight, FileText, Check, HelpCircle, ChevronRight, RefreshCw,
  UploadCloud, Printer, FileCheck, Layers, Award, Target,
  Clock, Eye, EyeOff, Trash2, Zap, TrendingUp, AlertCircle, CheckCircle,
  Mail, Send, FileType, CheckCheck, XCircle, Building2, Cpu, Users,
  CheckSquare, Ban,
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

export const ATS_FAQS = [
  {
    q: "¿Es este verificador y simulador ATS realmente gratuito y sin registro?",
    a: "Sí. En CVAI el análisis técnico y diagnóstico de compatibilidad ATS de tu currículum (ya sea subiendo tu archivo PDF o DOCX, o pegando el texto) es 100% gratuito. No requiere ingresar tarjeta de crédito ni crear una cuenta obligatoria para ver tu puntuación general, desglose de datos de contacto detectados, verbos de acción y advertencias de formato.",
  },
  {
    q: "¿Qué es exactamente un sistema ATS (Applicant Tracking System) y por qué importa?",
    a: "Un ATS es un software de reclutamiento corporativo que las empresas utilizan para filtrar, procesar, clasificar y rankear cientos de solicitudes de empleo antes de que un reclutador humano intervenga. En México y Latinoamérica, más del 75% de los currículums son descartados automáticamente en esta etapa por problemas de formato, tablas complejas o falta de palabras clave requeridas en la vacante.",
  },
  {
    q: "¿Es mejor enviar el currículum en formato PDF o en Word (.docx) para un ATS?",
    a: "Ambos formatos son aceptados por los sistemas ATS modernos en 2026. No obstante, el PDF generado con capas de texto vectorial (como los que descarga CVAI) es el estándar de oro de la industria porque mantiene intacto el diseño y la tipografía en cualquier dispositivo. La clave indispensable es que el PDF contenga texto seleccionable y no sea una imagen plana o captura escaneada.",
  },
  {
    q: "¿Por qué un currículum hecho en Canva o Photoshop suele reprobar en el ATS?",
    a: "Las herramientas de diseño gráfico general suelen exportar archivos con cajas de texto flotantes no secuenciales, capas desordenadas o texto rasterizado como imagen. Cuando el parser del ATS lee el archivo, extrae palabras inconexas, mezcla columnas de izquierda a derecha sin orden jerárquico o no encuentra ningún texto legible, provocando el rechazo automático del candidato.",
  },
  {
    q: "¿Qué sucede si mi currículum incluye dos columnas o barras de porcentaje de habilidades?",
    a: "Las barras de porcentaje y gráficos de barras (ej. 'Inglés 85%' o 'Excel 90%') son totalmente invisibles para los sistemas ATS, ya que no interpretan gráficos ni niveles numéricos subjetivos. Además, los diseños de dos columnas mal codificados provocan que el lector automático lea de corrido en línea horizontal, mezclando la información de la columna izquierda con la derecha.",
  },
  {
    q: "¿Debo adaptar mi currículum para cada oferta de empleo individual?",
    a: "Sí. Cada vacante cuenta con un conjunto específico de requisitos y palabras clave. Si una oferta busca 'Coordinador de Compras con experiencia en SAP MM y negociación con proveedores' y tu CV solo menciona 'Administración de insumos', el algoritmo asignará una coincidencia semántica muy baja. Adaptar tu resumen y habilidades a cada postulación multiplica tus posibilidades de entrevista.",
  },
  {
    q: "¿El truco de poner palabras clave en texto blanco invisible funciona hoy en día?",
    a: "No, es un error peligroso que debes evitar. Los sistemas ATS actuales extraen el texto sin formato de estilo ni colores. Si insertas palabras en color blanco para intentar burlar el algoritmo, el reclutador verá todas las palabras expuestas en su pantalla como texto plano o el software clasificará el documento como intento de manipulación (spam), descalificando tu perfil de inmediato.",
  },
  {
    q: "¿Qué tipografías y fuentes son las más recomendadas para superar los filtros ATS?",
    a: "Las fuentes estándar y sin remates (sans-serif) como Inter, Arial, Calibri, Roboto, Helvetica, Open Sans y Georgia son 100% compatibles con cualquier parser de ATS. Se recomienda evitar tipografías cursivas, decorativas, condensadas o de fantasía que dificulten la extracción de caracteres.",
  },
  {
    q: "¿Cómo sé si una empresa en México o Latinoamérica utiliza un software ATS?",
    a: "Cualquier postulación que realices a través de plataformas como OCCMundial, Computrabajo, LinkedIn, Indeed o portales corporativos de grandes empresas (como Workday, Taleo, SAP SuccessFactors, Greenhouse o Lever) pasa por un filtro ATS automatizado. Únicamente las microempresas o vacantes donde envías tu CV directamente al correo del reclutador carecen de este filtro.",
  },
  {
    q: "¿Por qué mi CV obtuvo un puntaje bajo si cuento con más de 10 años de experiencia?",
    a: "El analizador ATS evalúa la estructura técnica, la claridad semántica y la presencia de métricas cuantificables, no solo la antigüedad. Si tu experiencia laboral no incluye fechas en formato reconocible, carece de verbos de acción al inicio de cada viñeta o no presenta logros medibles (cifras monetarias, porcentajes de optimización o números de equipo), el sistema penalizará la puntuación de impacto profesional.",
  },
];

export const Route = createFileRoute("/ats-checker")({
  head: () => ({
    meta: [
      {
        title: "Verificador y Simulador ATS de Currículum en México (Gratis y con Subida de PDF) | CVAI",
      },
      {
        name: "description",
        content:
          "Escanea tu CV en PDF gratis con el simulador ATS inteligente de CVAI. Evalúa compatibilidad con filtros de selección en México (Workday, Taleo, SAP, OCC), detecta palabras clave faltantes y optimiza tu currículum sin registro.",
      },
      { property: "og:title", content: "Verificador y Simulador ATS de Currículum en México | CVAI" },
      {
        property: "og:description",
        content: "Sube tu currículum en PDF y simula cómo lo evalúan los filtros ATS de las empresas en México. Puntaje, palabras clave y métricas en segundos.",
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
          name: "Simulador y Verificador ATS de Currículum CVAI",
          url: "https://www.cvai.com.mx/ats-checker",
          description:
            "Simulador profesional gratuito de sistemas de seguimiento de candidatos (ATS) para auditar currículums en PDF frente a vacantes en el mercado laboral mexicano.",
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
          mainEntity: ATS_FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
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
        {/* ATS Impact Statistics Grid */}
        <section className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-xs transition-colors hover:border-primary/40">
            <p className="font-display text-2xl sm:text-3xl font-black text-primary">97%</p>
            <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground font-medium">de empresas Fortune 500 y líderes en México usan ATS</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-xs transition-colors hover:border-destructive/40">
            <p className="font-display text-2xl sm:text-3xl font-black text-destructive">75%</p>
            <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground font-medium">de los currículums son rechazados antes de ver a un humano</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-xs transition-colors hover:border-amber-500/40">
            <p className="font-display text-2xl sm:text-3xl font-black text-amber-500">250+</p>
            <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground font-medium">solicitudes compiten en promedio por cada puesto publicado</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-xs transition-colors hover:border-emerald-500/40">
            <p className="font-display text-2xl sm:text-3xl font-black text-emerald-500">6 seg</p>
            <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground font-medium">tiempo promedio que dedica el reclutador a los CVs aprobados</p>
          </div>
        </section>

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

        {/* How ATS Actually Works: The 5 Steps */}
        <section className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-2 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              <Cpu className="h-3.5 w-3.5" /> Detrás del Filtro
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              ¿Cómo funciona realmente un ATS? (Los 5 pasos críticos)
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              El 75% de los currículums son eliminados por un algoritmo antes de que cualquier reclutador los abra. Así es exactamente como el software procesa tu archivo en segundos:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-5 text-xs">
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2 relative">
              <div className="text-2xl font-black text-primary/40 font-mono">01</div>
              <h3 className="font-bold text-foreground text-sm">Subes tu CV</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tu archivo ingresa a la base de datos de la empresa convocante. En este instante tu diseño visual aún existe intacto.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2 relative">
              <div className="text-2xl font-black text-primary/40 font-mono">02</div>
              <h3 className="font-bold text-foreground text-sm">El ATS despoja el diseño</h3>
              <p className="text-muted-foreground leading-relaxed">
                El software elimina colores, iconos, tablas, cuadros flotantes y columnas. Si tus datos de contacto estaban en un encabezado, el robot los ignora.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2 relative">
              <div className="text-2xl font-black text-primary/40 font-mono">03</div>
              <h3 className="font-bold text-foreground text-sm">Mapeo de secciones</h3>
              <p className="text-muted-foreground leading-relaxed">
                El parser busca encabezados estándar: Experiencia, Educación, Habilidades. Encabezados creativos como "Mi trayecto" provocan error.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2 relative">
              <div className="text-2xl font-black text-primary/40 font-mono">04</div>
              <h3 className="font-bold text-foreground text-sm">Cruce de keywords</h3>
              <p className="text-muted-foreground leading-relaxed">
                El sistema compara tus palabras clave contra la descripción del empleo. Los mejores ATS en 2026 emplean concordancia semántica profunda.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2 relative">
              <div className="text-2xl font-black text-primary/40 font-mono">05</div>
              <h3 className="font-bold text-foreground text-sm">Ranking del reclutador</h3>
              <p className="text-muted-foreground leading-relaxed">
                El reclutador no lee cientos de CVs; abre una lista clasificada por puntuación. Solo los perfiles de 80 a 95+ puntos obtienen entrevista.
              </p>
            </div>
          </div>
        </section>

        {/* What Gets Your CV Killed: Visual Comparison Table */}
        <section className="space-y-6 border-t border-border pt-10">
          <div className="space-y-2 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 text-destructive px-3 py-1 text-xs font-semibold">
              <AlertTriangle className="h-3.5 w-3.5" /> Errores Fatales de Formato
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Lo que arruina tu currículum frente al robot
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Muchos candidatos pasan horas perfeccionando un diseño que el software destruye en microsegundos. Compara lo que diseñaste con lo que el ATS realmente extrae:
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50 font-semibold text-foreground">
                  <th className="p-3.5 sm:p-4">Lo que hiciste en tu diseño</th>
                  <th className="p-3.5 sm:p-4">Lo que el parser ATS realmente ve</th>
                  <th className="p-3.5 sm:p-4 text-center">Veredicto ATS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-destructive/5">
                  <td className="p-3.5 sm:p-4 font-medium text-foreground">Diseño de 2 o 3 columnas (estilo Canva)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">Texto desordenado horizontalmente; mezcla puestos con habilidades de la barra lateral</td>
                  <td className="p-3.5 sm:p-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-destructive/15 px-2.5 py-1 text-[11px] font-bold text-destructive">
                      <XCircle className="h-3.5 w-3.5" /> RECHAZADO
                    </span>
                  </td>
                </tr>
                <tr className="bg-destructive/5">
                  <td className="p-3.5 sm:p-4 font-medium text-foreground">Barras o gráficos de porcentaje de habilidades ("Excel 90%")</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">Elemento gráfico invisible; el ATS registra 0 habilidades técnicas</td>
                  <td className="p-3.5 sm:p-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-destructive/15 px-2.5 py-1 text-[11px] font-bold text-destructive">
                      <XCircle className="h-3.5 w-3.5" /> RECHAZADO
                    </span>
                  </td>
                </tr>
                <tr className="bg-destructive/5">
                  <td className="p-3.5 sm:p-4 font-medium text-foreground">Iconos decorativos para teléfono, correo y ubicación</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">Símbolos corruptos, espacios vacíos o texto de contacto no identificado</td>
                  <td className="p-3.5 sm:p-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-destructive/15 px-2.5 py-1 text-[11px] font-bold text-destructive">
                      <XCircle className="h-3.5 w-3.5" /> RECHAZADO
                    </span>
                  </td>
                </tr>
                <tr className="bg-destructive/5">
                  <td className="p-3.5 sm:p-4 font-medium text-foreground">Tablas invisibles para alinear fechas y empresas</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">Líneas de texto fragmentadas fuera de secuencia cronológica</td>
                  <td className="p-3.5 sm:p-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-destructive/15 px-2.5 py-1 text-[11px] font-bold text-destructive">
                      <XCircle className="h-3.5 w-3.5" /> RECHAZADO
                    </span>
                  </td>
                </tr>
                <tr className="bg-destructive/5">
                  <td className="p-3.5 sm:p-4 font-medium text-foreground">Datos de contacto puestos en el encabezado o pie de Word</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">Completamente ignorados por la mayoría de motores ATS</td>
                  <td className="p-3.5 sm:p-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-destructive/15 px-2.5 py-1 text-[11px] font-bold text-destructive">
                      <XCircle className="h-3.5 w-3.5" /> RECHAZADO
                    </span>
                  </td>
                </tr>
                <tr className="bg-emerald-500/5">
                  <td className="p-3.5 sm:p-4 font-medium text-foreground">Estructura limpia de 1 sola columna secuencial</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">Flujo de lectura perfecto de principio a fin sin saltos erróneos</td>
                  <td className="p-3.5 sm:p-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> APROBADO
                    </span>
                  </td>
                </tr>
                <tr className="bg-emerald-500/5">
                  <td className="p-3.5 sm:p-4 font-medium text-foreground">Encabezados canónicos ("Experiencia Laboral", "Educación", "Habilidades")</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">Secciones reconocidas, indexadas y asignadas a los campos del perfil al 100%</td>
                  <td className="p-3.5 sm:p-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> APROBADO
                    </span>
                  </td>
                </tr>
                <tr className="bg-emerald-500/5">
                  <td className="p-3.5 sm:p-4 font-medium text-foreground">PDF con capa de texto seleccionable nativa</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">Extracción inmediata de caracteres con codificación UTF-8 intacta</td>
                  <td className="p-3.5 sm:p-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> APROBADO
                    </span>
                  </td>
                </tr>
                <tr className="bg-emerald-500/5">
                  <td className="p-3.5 sm:p-4 font-medium text-foreground">Teléfono a 10 dígitos y correo electrónico en el cuerpo principal</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">Datos del candidato capturados de inmediato para contacto telefónico o email</td>
                  <td className="p-3.5 sm:p-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> APROBADO
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ATS Myths vs Facts 2026 */}
        <section className="space-y-6 border-t border-border pt-10">
          <div className="space-y-2 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Mitos y Realidades 2026
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Mitos del ATS que debes olvidar hoy mismo
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Circula mucha desinformación sobre cómo burlar los filtros de selección. Esto es lo que la tecnología actual realmente hace:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="rounded-2xl border border-destructive/20 bg-card p-5 space-y-2">
              <span className="inline-flex rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-bold text-destructive">
                Mito Popular
              </span>
              <h3 className="text-sm font-bold text-foreground">"Los archivos en PDF siempre fallan en los filtros ATS"</h3>
              <p className="text-muted-foreground leading-relaxed">
                Falso. Los sistemas ATS modernos en 2026 leen PDFs vectoriales perfectamente. El problema no es la extensión .pdf, sino subir una imagen escaneada o un archivo exportado de Photoshop que no posee capa de texto seleccionable.
              </p>
            </div>

            <div className="rounded-2xl border border-destructive/20 bg-card p-5 space-y-2">
              <span className="inline-flex rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-bold text-destructive">
                Mito Peligroso
              </span>
              <h3 className="text-sm font-bold text-foreground">"Pon palabras clave en texto blanco invisible para subir tu calificación"</h3>
              <p className="text-muted-foreground leading-relaxed">
                Peligroso error. Los sistemas ATS extraen texto puro e ignoran el color visual. El reclutador verá un bloque sospechoso de palabras amontonadas o el sistema activará una alerta de manipulación por spam, descalificándote de por vida de esa empresa.
              </p>
            </div>

            <div className="rounded-2xl border border-destructive/20 bg-card p-5 space-y-2">
              <span className="inline-flex rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-bold text-destructive">
                Mito Frecuente
              </span>
              <h3 className="text-sm font-bold text-foreground">"Un diseño visual ultra-creativo y complejo impresionará al reclutador"</h3>
              <p className="text-muted-foreground leading-relaxed">
                Solo si el reclutador llega a verlo. En empresas medianas y grandes, ningún ser humano abre tu CV si el robot no fue capaz de extraer tu información y darte al menos 80 puntos de compatibilidad inicial.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-card p-5 space-y-2">
              <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Realidad Comprobada
              </span>
              <h3 className="text-sm font-bold text-foreground">"Cada sistema ATS evalúa con algoritmos distintos pero con las mismas bases"</h3>
              <p className="text-muted-foreground leading-relaxed">
                Verdadero. Workday, Taleo, SAP, Greenhouse y OCC tienen diferentes ponderaciones, pero todos coinciden en premiar la estructura de 1 columna, fechas cronológicas claras, palabras clave de la vacante y métricas cuantificadas.
              </p>
            </div>
          </div>
        </section>

        {/* Major ATS Systems in Mexico & LatAm */}
        <section className="space-y-6 border-t border-border pt-10">
          <div className="space-y-2 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              <Building2 className="h-3.5 w-3.5" /> Ecosistema Corporativo
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Los principales sistemas ATS en México y Latinoamérica
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Dependiendo del tamaño de la empresa y su industria, tu currículum será evaluado por diferentes plataformas. Conoce sus prioridades:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-foreground">Workday</h3>
                <Badge variant="outline">Corporativos / Fortune 500</Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Utilizado en México por bancos, farmacéuticas y multinacionales (BBVA, FEMSA, Bimbo, Walmart).
              </p>
              <div className="border-t border-border/60 pt-2 text-[11px] space-y-1">
                <span className="font-semibold text-foreground">Prioridad de evaluación:</span>
                <p className="text-muted-foreground">Coincidencia semántica estricta de palabras clave, cronología inversa sin traslapes y títulos de puesto homologados.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-foreground">SAP SuccessFactors</h3>
                <Badge variant="outline">Manufactura / Automotriz</Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Predominante en clústeres industriales de Nuevo León, Bajío, Puebla y Estado de México.
              </p>
              <div className="border-t border-border/60 pt-2 text-[11px] space-y-1">
                <span className="font-semibold text-foreground">Prioridad de evaluación:</span>
                <p className="text-muted-foreground">Validación de certificaciones técnicas, grados universitarios o cédulas y habilidades duras operativas.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-foreground">Taleo (Oracle)</h3>
                <Badge variant="outline">Banca / Aseguradoras</Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                El sistema tradicional más utilizado por instituciones financieras y dependencias de gobierno.
              </p>
              <div className="border-t border-border/60 pt-2 text-[11px] space-y-1">
                <span className="font-semibold text-foreground">Prioridad de evaluación:</span>
                <p className="text-muted-foreground">Estructura canónica estricta. Es muy sensible a tablas complejas o gráficos que rompen la extracción de texto.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-foreground">Greenhouse &amp; Lever</h3>
                <Badge variant="outline">Tech / Startups / Fintech</Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Elegido por unicornios y scale-ups tecnológicas (Mercado Libre, Kavak, Nubank, Clip).
              </p>
              <div className="border-t border-border/60 pt-2 text-[11px] space-y-1">
                <span className="font-semibold text-foreground">Prioridad de evaluación:</span>
                <p className="text-muted-foreground">Stack tecnológico, herramientas ágiles, dominio de inglés (B2/C1) y logros cuantificados con porcentajes de impacto.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs sm:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-foreground">OCCMundial &amp; Computrabajo</h3>
                <Badge variant="outline">Bolsas Masivas en México</Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Los dos portales de reclutamiento más grandes del mercado laboral mexicano donde millones de candidatos postulan mensualmente.
              </p>
              <div className="border-t border-border/60 pt-2 text-[11px] space-y-1">
                <span className="font-semibold text-foreground">Prioridad de evaluación:</span>
                <p className="text-muted-foreground">Palabras clave exactas contenidas en la descripción del puesto, concordancia de salario pretendido y proximidad geográfica en México.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Actionable 12-Point Checklist */}
        <section className="space-y-6 border-t border-border pt-10">
          <div className="space-y-2 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-semibold">
              <CheckSquare className="h-3.5 w-3.5" /> Plan de Acción
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Lista de verificación técnica para superar filtros ATS (12 puntos)
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Asegúrate de marcar cada uno de estos requisitos antes de enviar tu postulación a cualquier vacante en México:
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground">Diseño de una sola columna limpia:</strong>
                <p className="text-muted-foreground mt-0.5">Evita divisiones laterales no secuenciales que desorientan al lector automático.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground">Encabezados canónicos reconocibles:</strong>
                <p className="text-muted-foreground mt-0.5">Usa títulos claros: Experiencia Laboral, Educación, Habilidades y Perfil Profesional.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground">Datos de contacto en el cuerpo del documento:</strong>
                <p className="text-muted-foreground mt-0.5">Nunca coloques teléfono o email en encabezados o pies de página de Word.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground">Palabras clave incorporadas con naturalidad:</strong>
                <p className="text-muted-foreground mt-0.5">Replica los términos técnicos de la vacante dentro de tus responsabilidades reales.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground">Formato consistente de fechas cronológicas:</strong>
                <p className="text-muted-foreground mt-0.5">Usa un estándar uniforme como "Ene 2021 – Presente" o "05/2020 – 11/2023".</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground">Cero tablas complejas o cuadros flotantes:</strong>
                <p className="text-muted-foreground mt-0.5">El texto debe fluir de corrido sin cajas que atrapen los caracteres fuera de orden.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground">Exportado en PDF o Word con texto seleccionable:</strong>
                <p className="text-muted-foreground mt-0.5">Comprueba que puedas seleccionar y copiar el texto con el cursor de tu ratón.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground">Extensión equilibrada (400 a 800 palabras):</strong>
                <p className="text-muted-foreground mt-0.5">Ni demasiado escueto ni un testamento de 5 páginas. 1 a 2 páginas es el estándar.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground">Logros cuantificados con métricas de impacto:</strong>
                <p className="text-muted-foreground mt-0.5">Agrega porcentajes, números de personas coordinadas o cifras de ahorro monetario.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground">Verbos de acción al inicio de viñetas:</strong>
                <p className="text-muted-foreground mt-0.5">Comienza con: "Implementé", "Coordiné", "Diseñé", "Optimicé" o "Supervisé".</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground">Tipografías estándar seguras:</strong>
                <p className="text-muted-foreground mt-0.5">Utiliza fuentes limpias como Inter, Arial, Calibri, Roboto, Helvetica o Georgia.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground">Validación previa con el simulador de CVAI:</strong>
                <p className="text-muted-foreground mt-0.5">Prueba tu archivo en esta herramienta para corregir detalles antes de postular.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-6 border-t border-border pt-10">
          <div className="space-y-2 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              <HelpCircle className="h-3.5 w-3.5" /> Respuestas de Expertos
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Preguntas frecuentes sobre el verificador y simulador ATS
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Resolvemos todas las dudas sobre cómo los algoritmos de reclutamiento filtran currículums en México y Latinoamérica:
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {ATS_FAQS.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-left text-sm font-semibold">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
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
