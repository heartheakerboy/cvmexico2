import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Trash2, Loader2, Pencil, Mail, Send, FileText,
  Server, CheckCircle2, XCircle, Megaphone, Eye, EyeOff, Key,
  ShieldCheck, AlertCircle, RefreshCw, Check, Globe, Sparkles,
  HelpCircle, Info, ShieldAlert, Users, BarChart3, Clock,
  ArrowRight, Copy, Filter, Play, Pause, ChevronRight, Sliders,
  ExternalLink, DownloadCloud, MousePointerClick
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  getAdminSmtpConfig,
  saveAdminSmtpConfig,
  sendTestSmtpEmail,
  lookupMxRecord,
} from "@/lib/smtp.functions";
import {
  getBroadcastsData,
  saveCampaign,
  sendTestBroadcast,
  launchCampaign,
  deleteCampaign,
  getSubscribersOverview,
  toggleSuppression,
  type CampaignData,
  type AudienceFilters,
} from "@/lib/broadcast.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { EmailVisualEditor } from "@/components/admin/email-marketing/EmailVisualEditor";
import { AudienceFilterBuilder } from "@/components/admin/email-marketing/AudienceFilterBuilder";
import { CampaignSafetyModal } from "@/components/admin/email-marketing/CampaignSafetyModal";

export const Route = createFileRoute("/_authenticated/admin/emails")({
  component: EmailMarketingAdmin,
});

export interface EmailProviderDef {
  id: string;
  name: string;
  badge: string;
  category: "personal" | "transactional" | "custom";
  host: string;
  port: number;
  secure: boolean;
  userHint: string;
  passHint: string;
  tip: string;
  domains: string[];
}

export const EMAIL_PROVIDERS: EmailProviderDef[] = [
  {
    id: "sitecountry",
    name: "SiteCountry Webmail (cvai.com.mx)",
    badge: "SiteCountry",
    category: "personal",
    host: "mailadmin.sitecountry.net",
    port: 465,
    secure: true,
    userHint: "support@cvai.com.mx",
    passHint: "Contraseña de la cuenta de correo en SiteCountry",
    tip: "Servidor oficial de correo de SiteCountry para cvai.com.mx. Ingresa tu correo completo y su contraseña.",
    domains: ["sitecountry.net", "cvai.com.mx"],
  },
  {
    id: "gmail",
    name: "Google / Gmail / Workspace",
    badge: "Gmail / G-Suite",
    category: "personal",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    userHint: "tu-correo@gmail.com",
    passHint: "Contraseña de aplicación de 16 letras",
    tip: "En tu cuenta de Google activa la 'Verificación en 2 pasos' y genera una 'Contraseña de aplicación'.",
    domains: ["gmail.com", "googlemail.com"],
  },
  {
    id: "resend",
    name: "Resend",
    badge: "Resend",
    category: "transactional",
    host: "smtp.resend.com",
    port: 465,
    secure: true,
    userHint: "resend",
    passHint: "re_123456789... (API Key de Resend)",
    tip: "Usa 'resend' como usuario y tu API Key generada en resend.com como contraseña.",
    domains: ["resend.com"],
  },
  {
    id: "ses",
    name: "Amazon SES",
    badge: "AWS SES",
    category: "transactional",
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 587,
    secure: false,
    userHint: "Usuario SMTP de AWS SES (AKIA...)",
    passHint: "Contraseña SMTP de AWS SES",
    tip: "Genera credenciales SMTP dedicadas en AWS Console > SES > SMTP Settings.",
    domains: ["amazonaws.com"],
  },
  {
    id: "custom",
    name: "Servidor Personalizado / Cualquier otro SMTP",
    badge: "Personalizado",
    category: "custom",
    host: "",
    port: 465,
    secure: true,
    userHint: "usuario@servidor.com",
    passHint: "Contraseña del servidor SMTP",
    tip: "Compatible con cualquier servidor SMTP del mundo.",
    domains: [],
  },
];

interface SmtpFormState {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
  replyTo: string;
  ignoreTlsErrors: boolean;
}

const defaultSmtpForm: SmtpFormState = {
  host: "mailadmin.sitecountry.net",
  port: 465,
  secure: true,
  user: "support@cvai.com.mx",
  pass: "",
  fromEmail: "support@cvai.com.mx",
  fromName: "CVAI - Currículum Vitae AI",
  replyTo: "support@cvai.com.mx",
  ignoreTlsErrors: false,
};

const PREBUILT_TEMPLATES = [
  {
    id: "tpl-welcome",
    name: "Bienvenida a CVAI",
    slug: "welcome-email",
    subject: "¡Bienvenido a CVAI! Comienza a crear tu currículum ganador 🚀",
    body: `Hola {{first_name}},<br/><br/>¡Bienvenido a la plataforma más moderna de optimización curricular en México!<br/><br/>Con CVAI podrás crear currículums adaptados a los estándares ATS de las mejores empresas en México en cuestión de minutos.<br/><br/>Empieza seleccionando una plantilla profesional y deja que nuestra Inteligencia Artificial optimice tu experiencia.`,
    ctaText: "Crear mi primer CV →",
    ctaUrl: "https://cvai.com.mx/panel",
  },
  {
    id: "tpl-offer",
    name: "Oferta Especial / Descuento Pro",
    slug: "special-offer",
    subject: "Descuento Especial del 30% en tu suscripción CVAI Pro ✨",
    body: `Hola {{first_name}},<br/><br/>Queremos ayudarte a acelerar tu próxima contratación. Por tiempo limitado, obtén un <strong>30% de descuento</strong> en el plan CVAI Pro.<br/><br/>• Descargas ilimitadas en PDF y DOCX sin marca de agua<br/>• Optimizador de palabras clave ATS<br/>• Creación de cartas de presentación y simulación de entrevistas con IA`,
    ctaText: "Aprovechar Descuento Pro →",
    ctaUrl: "https://cvai.com.mx/precios",
  },
  {
    id: "tpl-ats-tips",
    name: "Consejos ATS y Currículum",
    slug: "resume-tips",
    subject: "5 errores en tu CV que los reclutadores en México descartan de inmediato 📋",
    body: `Hola {{first_name}},<br/><br/>¿Sabías que el 75% de los currículums nunca son leídos por una persona porque son filtrados previamente por un sistema ATS?<br/><br/>Para evitar ser descartado:<br/>1. Usa encabezados estándar como 'Experiencia Laboral' y 'Educación'.<br/>2. Añade métricas cuantificables a tus logros.<br/>3. Exporta siempre en formato PDF con texto seleccionable.<br/><br/>Pasa tu currículum por nuestro analizador ATS gratuito ahora.`,
    ctaText: "Escanear mi CV ahora →",
    ctaUrl: "https://cvai.com.mx/panel/ats",
  },
  {
    id: "tpl-upgrade",
    name: "Actualización a Plan Pro",
    slug: "premium-upgrade",
    subject: "Desbloquea todo el potencial de tu carrera con CVAI Pro 💼",
    body: `Hola {{first_name}},<br/><br/>Tu cuenta actual cuenta con el plan Gratuito. Da el salto hacia vacantes de mayor nivel desbloqueando plantillas ejecutivas, exportación en Word editable y generación ilimitada con Inteligencia Artificial DeepSeek.`,
    ctaText: "Ver Beneficios Pro →",
    ctaUrl: "https://cvai.com.mx/precios",
  },
  {
    id: "tpl-reengagement",
    name: "Re-engagement (Te extrañamos)",
    slug: "reengagement",
    subject: "¿Sigues buscando empleo? Nuevas oportunidades te esperan en México 🎯",
    body: `Hola {{first_name}},<br/><br/>Notamos que hace algún tiempo no actualizas tu currículum en CVAI.<br/><br/>El mercado laboral se mueve rápido y las empresas están buscando activamente talento como el tuyo. Hemos agregado nuevas plantillas modernas para ayudarte a destacar.`,
    ctaText: "Actualizar mi CV →",
    ctaUrl: "https://cvai.com.mx/panel",
  },
  {
    id: "tpl-newsletter",
    name: "Boletín Mensual (Newsletter)",
    slug: "monthly-newsletter",
    subject: "Tendencias de Empleo y Salarios en México — Boletín CVAI 📊",
    body: `Hola {{first_name}},<br/><br/>Te compartimos nuestro resumen mensual de tendencias laborales en México:<br/><br/>• Las habilidades digitales más demandadas este trimestre.<br/>• Rangos salariales actualizados en tecnología, ventas y administración.<br/>• Guía paso a paso para negociar una mejor oferta económica.`,
    ctaText: "Leer el Informe Completo →",
    ctaUrl: "https://cvai.com.mx/blog",
  },
];

function EmailMarketingAdmin() {
  // Main Submenu Tabs
  const [activeTab, setActiveTab] = useState<
    "broadcasts" | "create" | "history" | "templates" | "subscribers" | "settings" | "analytics"
  >("broadcasts");

  // Loading States
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalSent: 0,
    totalOpened: 0,
    totalClicked: 0,
    avgOpenRate: "0.0%",
    avgClickRate: "0.0%",
    subscriberCount: 0,
  });

  // Subscribers
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [suppressedCount, setSuppressedCount] = useState(0);

  // Campaign Wizard State
  const [campaignForm, setCampaignForm] = useState<CampaignData>({
    name: "",
    subject: "",
    previewText: "",
    senderName: "CVAI - Currículum Vitae AI",
    senderEmail: "support@cvai.com.mx",
    replyTo: "support@cvai.com.mx",
    bodyHtml: "<p>Hola {{first_name}},</p><p>Tenemos noticias importantes para impulsar tu carrera profesional.</p>",
    ctaText: "Acceder a mi panel →",
    ctaUrl: "https://cvai.com.mx/panel",
    bannerUrl: "",
    audienceType: "all",
    filters: { plan: "all", language: "all", registered: "all", createdResume: "all" },
    language: "both",
  });

  // Test Email in Wizard
  const [wizardTestEmail, setWizardTestEmail] = useState("");
  const [sendingWizardTest, setSendingWizardTest] = useState(false);

  // Safety Modal State
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [targetRecipientsCount, setTargetRecipientsCount] = useState(0);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // SMTP Settings State
  const [smtpForm, setSmtpForm] = useState<SmtpFormState>(defaultSmtpForm);
  const [selectedProviderId, setSelectedProviderId] = useState("sitecountry");
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [smtpTestEmail, setSmtpTestEmail] = useState("");
  const [sendingSmtpTest, setSendingSmtpTest] = useState(false);

  // Templates Management State
  const [templates, setTemplates] = useState<any[]>(PREBUILT_TEMPLATES);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

  // Initial Load
  async function loadData() {
    setLoading(true);
    try {
      // 1. Load Broadcasts & Stats
      const res = await getBroadcastsData();
      if (res) {
        setCampaigns(res.campaigns);
        setStats(res.stats);
      }

      // 2. Load Subscribers & Suppression
      const subRes = await getSubscribersOverview();
      if (subRes) {
        setSubscribers(subRes.subscribers);
        setSuppressedCount(subRes.totalSuppressed);
      }

      // 3. Load SMTP Config
      const smtpRes: any = await getAdminSmtpConfig();
      const cfg = smtpRes?.data ?? smtpRes;
      if (cfg && typeof cfg === "object" && (cfg.host || cfg.user || cfg.fromEmail)) {
        setSmtpForm({
          host: (cfg.host || "").trim(),
          port: Number(cfg.port) || 465,
          secure: Boolean(cfg.secure),
          user: (cfg.user || "").trim(),
          pass: cfg.pass || "",
          fromEmail: (cfg.fromEmail || "support@cvai.com.mx").trim(),
          fromName: (cfg.fromName || "CVAI - Currículum Vitae AI").trim(),
          replyTo: (cfg.replyTo || "support@cvai.com.mx").trim(),
          ignoreTlsErrors: Boolean(cfg.ignoreTlsErrors),
        });
      }
    } catch (err: any) {
      console.error("Error loading email marketing data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Save or Create Campaign
  async function handleSaveDraft() {
    if (!campaignForm.name.trim() || !campaignForm.subject.trim()) {
      toast.error("Por favor ingresa al menos el Nombre y Asunto de la campaña.");
      return;
    }
    try {
      const res = await saveCampaign({ data: { ...campaignForm, status: "draft" } });
      if (res.ok) {
        toast.success("Campaña guardada como borrador");
        loadData();
        setActiveTab("history");
      }
    } catch (err: any) {
      toast.error(err.message || "Error al guardar campaña");
    }
  }

  // Pre-dispatch Safety Check
  async function handleOpenSafetyModal() {
    if (!campaignForm.name.trim() || !campaignForm.subject.trim()) {
      toast.error("Ingresa el Nombre y Asunto de la campaña antes de enviar.");
      return;
    }

    try {
      // Save campaign first
      const saveRes = await saveCampaign({ data: { ...campaignForm, status: "draft" } });
      const currentCampaignId = saveRes.campaign?.id;
      if (!currentCampaignId) throw new Error("No se pudo obtener el ID de la campaña.");

      setCampaignForm((prev) => ({ ...prev, id: currentCampaignId }));
      setTargetRecipientsCount(stats.subscriberCount || 1);
      setSafetyOpen(true);
    } catch (err: any) {
      toast.error(err.message || "Error al preparar la campaña");
    }
  }

  // Confirm and Send Campaign
  async function handleConfirmLaunch() {
    if (!campaignForm.id) return;
    try {
      const res = await launchCampaign({
        data: {
          campaignId: campaignForm.id,
          confirmDuplicate: Boolean(duplicateWarning),
        },
      });

      if (res.warning) {
        setDuplicateWarning(res.message);
        toast.warning(res.message);
        return;
      }

      if (res.ok) {
        toast.success(res.message || "¡Campaña despachada con éxito!");
        loadData();
        setActiveTab("history");
      }
    } catch (err: any) {
      toast.error(err.message || "Error al enviar la campaña");
    }
  }

  // Send Test Email in Wizard
  async function handleSendWizardTest() {
    if (!wizardTestEmail.trim() || !wizardTestEmail.includes("@")) {
      toast.error("Ingresa una dirección de correo válida para la prueba.");
      return;
    }
    setSendingWizardTest(true);
    try {
      const res = await sendTestBroadcast({
        data: {
          campaign: campaignForm,
          testEmail: wizardTestEmail.trim(),
        },
      });
      if (res.ok) toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message || "Error al enviar correo de prueba");
    } finally {
      setSendingWizardTest(false);
    }
  }

  // Save SMTP Settings
  async function handleSaveSmtp() {
    if (!smtpForm.host.trim()) {
      toast.error("El servidor SMTP (Host) es obligatorio");
      return;
    }
    setSavingSmtp(true);
    try {
      const res: any = await saveAdminSmtpConfig({ data: smtpForm });
      if (res?.success || res?.ok) {
        toast.success(res.message || "Configuración SMTP guardada exitosamente");
        loadData();
      } else {
        toast.error(res?.message || "Error al guardar SMTP");
      }
    } catch (err: any) {
      toast.error(err.message || "Error al comunicarse con el servidor");
    } finally {
      setSavingSmtp(false);
    }
  }

  // Test SMTP Connection
  async function handleTestSmtp() {
    if (!smtpTestEmail.trim()) {
      toast.error("Ingresa un correo destinatario para la prueba SMTP");
      return;
    }
    setSendingSmtpTest(true);
    try {
      const res = await sendTestSmtpEmail({
        data: {
          to: smtpTestEmail.trim(),
          recipient: smtpTestEmail.trim(),
          customSettings: smtpForm,
        },
      });
      if (res.success || res.ok) {
        toast.success(res.message || "¡Conexión SMTP exitosa!");
      }
    } catch (err: any) {
      toast.error(err.message || "Error en la prueba SMTP");
    } finally {
      setSendingSmtpTest(false);
    }
  }

  // Load Template into Campaign Wizard
  function handleUseTemplate(tpl: any) {
    setCampaignForm((prev) => ({
      ...prev,
      name: `Campaña: ${tpl.name}`,
      subject: tpl.subject,
      bodyHtml: tpl.body,
      ctaText: tpl.ctaText || "Ver más →",
      ctaUrl: tpl.ctaUrl || "https://cvai.com.mx/panel",
    }));
    setActiveTab("create");
    toast.success(`Plantilla '${tpl.name}' cargada en el editor`);
  }

  // Delete Campaign
  async function handleDeleteCampaign(id: string) {
    if (!confirm("¿Seguro que deseas eliminar esta campaña?")) return;
    try {
      const res = await deleteCampaign({ data: { id } });
      if (res.ok) {
        toast.success("Campaña eliminada");
        loadData();
      }
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Email Marketing & Broadcasts
            </h1>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              Pro Enterprise
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Diseña, segmenta y despacha campañas masivas a los usuarios registrados de CVAI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button
            size="sm"
            onClick={() => setActiveTab("create")}
            className="gap-1.5 text-xs font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nueva Campaña
          </Button>
        </div>
      </div>

      {/* Main Submenus / Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 w-full h-auto p-1 bg-muted/60 rounded-xl gap-1">
          <TabsTrigger value="broadcasts" className="text-xs py-2 gap-1.5">
            <Megaphone className="h-3.5 w-3.5" />
            <span>Broadcasts</span>
          </TabsTrigger>
          <TabsTrigger value="create" className="text-xs py-2 gap-1.5">
            <Plus className="h-3.5 w-3.5 text-primary" />
            <span>Crear Campaña</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs py-2 gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Historial</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs py-2 gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span>Plantillas</span>
          </TabsTrigger>
          <TabsTrigger value="subscribers" className="text-xs py-2 gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>Suscriptores</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs py-2 gap-1.5">
            <Sliders className="h-3.5 w-3.5" />
            <span>SMTP / Config</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs py-2 gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Analítica</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. BROADCASTS OVERVIEW TAB */}
        <TabsContent value="broadcasts" className="space-y-6 mt-0">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                <span>Campañas Creadas</span>
                <Megaphone className="h-4 w-4 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalCampaigns}</div>
              <div className="text-[11px] text-muted-foreground">Envíos totales y borradores</div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                <span>Correos Entregados</span>
                <Send className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {stats.totalSent.toLocaleString("es-MX")}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Despachados sin interrupción
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                <span>Tasa de Apertura</span>
                <Eye className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.avgOpenRate}</div>
              <div className="text-[11px] text-muted-foreground">
                {stats.totalOpened} aperturas registradas
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                <span>Suscriptores Activos</span>
                <Users className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {stats.subscriberCount.toLocaleString("es-MX")}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {suppressedCount} en lista de exclusión
              </div>
            </div>
          </div>

          {/* Quick Launch Action Banner */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Lanza una nueva campaña segmentada en minutos
              </h3>
              <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                Elige entre usuarios gratuitos, suscriptores Pro, creadores de currículum o usuarios inactivos. Personaliza dinámicamente con su nombre y previsualiza en desktop y móvil.
              </p>
            </div>
            <Button
              onClick={() => setActiveTab("create")}
              className="gap-2 shrink-0 font-semibold shadow"
            >
              Comenzar Campaña
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Recent Campaigns Table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-sm">Campañas Recientes</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1"
                onClick={() => setActiveTab("history")}
              >
                Ver todas <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {campaigns.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground text-xs space-y-2">
                <Mail className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p>No has creado ninguna campaña aún.</p>
                <Button size="sm" variant="outline" onClick={() => setActiveTab("create")}>
                  Crear mi primera campaña
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/30 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3 px-4">Campaña</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Audiencia</th>
                      <th className="py-3 px-4">Enviados</th>
                      <th className="py-3 px-4">Aperturas</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {campaigns.slice(0, 5).map((c) => (
                      <tr key={c.id} className="hover:bg-muted/20">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-foreground">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                            {c.subject}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              c.status === "sent"
                                ? "default"
                                : c.status === "sending"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-[10px] capitalize"
                          >
                            {c.status === "sent"
                              ? "Enviado"
                              : c.status === "sending"
                              ? "Enviando..."
                              : c.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 capitalize text-muted-foreground">
                          {c.audience === "all" ? "Todos los usuarios" : c.audience}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium">{c.sentCount}</td>
                        <td className="py-3 px-4 font-mono">
                          {c.openedCount} ({c.sentCount > 0 ? ((c.openedCount / c.sentCount) * 100).toFixed(0) : 0}%)
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              setCampaignForm(c);
                              setActiveTab("create");
                            }}
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 2. CREATE CAMPAIGN WIZARD TAB */}
        <TabsContent value="create" className="space-y-6 mt-0">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            {/* Wizard Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {campaignForm.id ? "Editar Campaña" : "Crear Nueva Campaña de Correo"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Configura el contenido visual, segmenta tu público y envía una prueba antes del lanzamiento.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveDraft} className="text-xs">
                  Guardar Borrador
                </Button>
                <Button
                  size="sm"
                  onClick={handleOpenSafetyModal}
                  className="gap-1.5 text-xs font-semibold bg-primary"
                >
                  <Send className="h-3.5 w-3.5" />
                  Revisar y Enviar
                </Button>
              </div>
            </div>

            {/* Campaign Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="camp-name">Nombre Interno de la Campaña *</Label>
                <Input
                  id="camp-name"
                  placeholder="Ej: Promo Septiembre Pro 30%"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="camp-subject">Asunto del Correo (Subject) *</Label>
                <Input
                  id="camp-subject"
                  placeholder="Ej: Acelera tu búsqueda de empleo con CVAI Pro ✨"
                  value={campaignForm.subject}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, subject: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="camp-preview">Texto de Previsualización (Preheader)</Label>
                <Input
                  id="camp-preview"
                  placeholder="Texto visible antes de abrir el correo..."
                  value={campaignForm.previewText}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, previewText: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="camp-sender-name">Nombre del Remitente</Label>
                <Input
                  id="camp-sender-name"
                  placeholder="CVAI - Currículum Vitae AI"
                  value={campaignForm.senderName}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, senderName: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="camp-sender-email">Correo Remitente</Label>
                <Input
                  id="camp-sender-email"
                  type="email"
                  placeholder="support@cvai.com.mx"
                  value={campaignForm.senderEmail}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, senderEmail: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="camp-reply-to">Responder a (Reply-To)</Label>
                <Input
                  id="camp-reply-to"
                  type="email"
                  placeholder="support@cvai.com.mx"
                  value={campaignForm.replyTo}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, replyTo: e.target.value }))}
                />
              </div>
            </div>

            {/* Visual Email Editor Component */}
            <div className="pt-2">
              <EmailVisualEditor
                subject={campaignForm.subject}
                previewText={campaignForm.previewText || ""}
                bodyHtml={campaignForm.bodyHtml}
                ctaText={campaignForm.ctaText || ""}
                ctaUrl={campaignForm.ctaUrl || ""}
                bannerUrl={campaignForm.bannerUrl || ""}
                onChange={(updates) => setCampaignForm((p) => ({ ...p, ...updates }))}
                onSaveAsTemplate={() => {
                  setTemplates((prev) => [
                    ...prev,
                    {
                      id: `tpl-${Date.now()}`,
                      name: campaignForm.name || "Plantilla Personalizada",
                      slug: `custom-${Date.now()}`,
                      subject: campaignForm.subject,
                      body: campaignForm.bodyHtml,
                      ctaText: campaignForm.ctaText,
                      ctaUrl: campaignForm.ctaUrl,
                    },
                  ]);
                  toast.success("Campaña guardada en la lista de Plantillas");
                }}
              />
            </div>

            {/* Audience Targeting Builder Component */}
            <div className="pt-6 border-t border-border">
              <div className="mb-4">
                <h3 className="font-bold text-base text-foreground">Segmentación de la Audiencia</h3>
                <p className="text-xs text-muted-foreground">
                  Elige a quién se entregará esta campaña y previsualiza los destinatarios reales.
                </p>
              </div>

              <AudienceFilterBuilder
                filters={campaignForm.filters || {}}
                onChange={(f) => setCampaignForm((p) => ({ ...p, filters: f }))}
              />
            </div>

            {/* Send Real Test Email Bar */}
            <div className="rounded-xl border border-border/80 bg-muted/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold">Probar antes del envío masivo:</span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  type="email"
                  className="text-xs h-9 w-full sm:w-64"
                  placeholder="tu-correo@ejemplo.com"
                  value={wizardTestEmail}
                  onChange={(e) => setWizardTestEmail(e.target.value)}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSendWizardTest}
                  disabled={sendingWizardTest}
                  className="gap-1.5 shrink-0 text-xs"
                >
                  {sendingWizardTest ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  Enviar Prueba
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 3. CAMPAIGN HISTORY TAB */}
        <TabsContent value="history" className="space-y-4 mt-0">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground">Historial Completo de Campañas</h3>
                <p className="text-xs text-muted-foreground">
                  Monitorea el progreso de entrega, aperturas, clics y estado de cada envío.
                </p>
              </div>
              <Badge variant="outline">{campaigns.length} campañas registradas</Badge>
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs">
                No hay historial de campañas registradas aún.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3 px-4">Campaña y Asunto</th>
                      <th className="py-3 px-4">Fecha</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Destinatarios</th>
                      <th className="py-3 px-4">Enviados</th>
                      <th className="py-3 px-4">Aperturas</th>
                      <th className="py-3 px-4">Clics</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {campaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-muted/20">
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-semibold text-foreground truncate">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{c.subject}</div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString("es-MX") : "—"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              c.status === "sent"
                                ? "default"
                                : c.status === "sending"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-[10px] capitalize"
                          >
                            {c.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono">{c.recipientsCount}</td>
                        <td className="py-3 px-4 font-mono text-emerald-600 font-medium">
                          {c.sentCount}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {c.openedCount} ({c.sentCount > 0 ? ((c.openedCount / c.sentCount) * 100).toFixed(0) : 0}%)
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {c.clickedCount} ({c.sentCount > 0 ? ((c.clickedCount / c.sentCount) * 100).toFixed(0) : 0}%)
                        </td>
                        <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              setCampaignForm(c);
                              setActiveTab("create");
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleDeleteCampaign(c.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 4. EMAIL TEMPLATES TAB */}
        <TabsContent value="templates" className="space-y-4 mt-0">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground">Biblioteca de Plantillas de Correo</h3>
                <p className="text-xs text-muted-foreground">
                  Plantillas pre-diseñadas y personalizadas listas para usar en cualquier campaña.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-colors p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-foreground">{tpl.name}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {tpl.slug}
                      </Badge>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground truncate">
                      {tpl.subject}
                    </p>
                    <div
                      className="text-[11px] text-muted-foreground/80 line-clamp-3 bg-card p-2.5 rounded border border-border/60"
                      dangerouslySetInnerHTML={{ __html: tpl.body }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 gap-1"
                      onClick={() => handleUseTemplate(tpl)}
                    >
                      <Copy className="h-3 w-3" /> Usar en Campaña
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 5. SUBSCRIBERS & SUPPRESSION TAB */}
        <TabsContent value="subscribers" className="space-y-4 mt-0">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground">Audiencia y Lista de Exclusión (Supresión)</h3>
                <p className="text-xs text-muted-foreground">
                  Usuarios registrados y estado de consentimiento de marketing según las normas de privacidad.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {subscribers.length} usuarios registrados
                </Badge>
                <Badge variant="secondary" className="text-xs text-amber-600 dark:text-amber-400">
                  {suppressedCount} bajas voluntarias
                </Badge>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Usuario</th>
                    <th className="py-2.5 px-3">Correo</th>
                    <th className="py-2.5 px-3">Plan</th>
                    <th className="py-2.5 px-3">Fecha Registro</th>
                    <th className="py-2.5 px-3">Estado Marketing</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {subscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/20">
                      <td className="py-2.5 px-3 font-medium text-foreground">{s.name}</td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">{s.email}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={s.plan === "pro" ? "default" : "secondary"} className="text-[10px]">
                          {s.plan === "pro" ? "Pro" : "Gratis"}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString("es-MX") : "—"}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={s.isSuppressed ? "destructive" : "outline"}
                          className="text-[10px]"
                        >
                          {s.isSuppressed ? "Baja / Excluido" : "Suscrito Activo"}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px]"
                          onClick={async () => {
                            await toggleSuppression({
                              data: { email: s.email, suppress: !s.isSuppressed },
                            });
                            toast.success("Estado actualizado");
                            loadData();
                          }}
                        >
                          {s.isSuppressed ? "Reactivar" : "Excluir"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* 6. EMAIL SETTINGS & SMTP TAB */}
        <TabsContent value="settings" className="space-y-6 mt-0">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h3 className="font-bold text-base text-foreground">Configuración del Servidor SMTP</h3>
                <p className="text-xs text-muted-foreground">
                  Configura el proveedor de entrega (SiteCountry, Resend, Gmail, SES, etc.) para despachar correos.
                </p>
              </div>

              <Button
                onClick={handleSaveSmtp}
                disabled={savingSmtp}
                className="gap-1.5 font-semibold text-xs shadow-sm"
              >
                {savingSmtp ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Guardar Configuración
              </Button>
            </div>

            {/* Provider presets */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Seleccionar Proveedor Predeterminado</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {EMAIL_PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedProviderId(p.id);
                      setSmtpForm((prev) => ({
                        ...prev,
                        host: p.host || prev.host,
                        port: p.port,
                        secure: p.secure,
                      }));
                      toast.info(`Configuración para ${p.name} cargada`);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedProviderId === p.id
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="font-semibold text-xs text-foreground">{p.badge}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{p.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* SMTP Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="smtp-host">Host / Servidor SMTP *</Label>
                <Input
                  id="smtp-host"
                  placeholder="mailadmin.sitecountry.net"
                  value={smtpForm.host}
                  onChange={(e) => setSmtpForm((p) => ({ ...p, host: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="smtp-port">Puerto</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  placeholder="465 o 587"
                  value={smtpForm.port}
                  onChange={(e) => {
                    const port = Number(e.target.value) || 465;
                    setSmtpForm((p) => ({
                      ...p,
                      port,
                      secure: port === 465,
                    }));
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="smtp-user">Usuario / Correo Completo *</Label>
                <Input
                  id="smtp-user"
                  placeholder="support@cvai.com.mx"
                  value={smtpForm.user}
                  onChange={(e) => setSmtpForm((p) => ({ ...p, user: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="smtp-pass">Contraseña SMTP</Label>
                <div className="relative">
                  <Input
                    id="smtp-pass"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={smtpForm.pass}
                    onChange={(e) => setSmtpForm((p) => ({ ...p, pass: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="smtp-from-email">Correo Remitente (From)</Label>
                <Input
                  id="smtp-from-email"
                  type="email"
                  placeholder="support@cvai.com.mx"
                  value={smtpForm.fromEmail}
                  onChange={(e) => setSmtpForm((p) => ({ ...p, fromEmail: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="smtp-from-name">Nombre Remitente</Label>
                <Input
                  id="smtp-from-name"
                  placeholder="CVAI - Currículum Vitae AI"
                  value={smtpForm.fromName}
                  onChange={(e) => setSmtpForm((p) => ({ ...p, fromName: e.target.value }))}
                />
              </div>
            </div>

            {/* Test Connection Bar */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs">
                <div className="font-semibold text-foreground">Probar Conexión SMTP en Tiempo Real</div>
                <div className="text-muted-foreground">
                  Envía un correo de prueba para verificar que el servidor responde correctamente.
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  type="email"
                  className="text-xs h-9 w-full sm:w-64"
                  placeholder="tu-correo@ejemplo.com"
                  value={smtpTestEmail}
                  onChange={(e) => setSmtpTestEmail(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestSmtp}
                  disabled={sendingSmtpTest}
                  className="gap-1.5 shrink-0 text-xs"
                >
                  {sendingSmtpTest ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  Probar Conexión
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 7. ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Envíos
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalSent}</div>
              <div className="text-[11px] text-muted-foreground">Envíos acumulados</div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Aperturas Registradas
              </div>
              <div className="text-3xl font-bold text-emerald-600">{stats.totalOpened}</div>
              <div className="text-[11px] text-muted-foreground">Tasa promedio: {stats.avgOpenRate}</div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Clics en Enlaces
              </div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalClicked}</div>
              <div className="text-[11px] text-muted-foreground">Tasa promedio: {stats.avgClickRate}</div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tasa de Bajas
              </div>
              <div className="text-3xl font-bold text-amber-600">
                {stats.totalSent > 0
                  ? ((suppressedCount / stats.totalSent) * 100).toFixed(1) + "%"
                  : "0.0%"}
              </div>
              <div className="text-[11px] text-muted-foreground">Dentro del umbral saludable (&lt; 2%)</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <h3 className="font-bold text-base text-foreground">Embudo de Desempeño de Campañas</h3>
            <p className="text-xs text-muted-foreground">
              Desglose visual del flujo de entrega y engagement de las comunicaciones enviadas.
            </p>

            <div className="space-y-4 pt-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Enviados con Éxito (100%)</span>
                  <span>{stats.totalSent} correos</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Aperturas Estimadas ({stats.avgOpenRate})</span>
                  <span>{stats.totalOpened} abiertos</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: stats.avgOpenRate }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Clics en el Botón CTA ({stats.avgClickRate})</span>
                  <span>{stats.totalClicked} clics</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: stats.avgClickRate }}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Safety Confirmation Modal */}
      <CampaignSafetyModal
        open={safetyOpen}
        onOpenChange={setSafetyOpen}
        campaignName={campaignForm.name}
        subject={campaignForm.subject}
        recipientsCount={targetRecipientsCount}
        language={campaignForm.language || "both"}
        scheduledAt={campaignForm.scheduledAt}
        duplicateWarning={duplicateWarning}
        onConfirm={handleConfirmLaunch}
      />
    </div>
  );
}
