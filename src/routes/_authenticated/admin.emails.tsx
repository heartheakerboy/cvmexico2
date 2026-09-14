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
    passHint: "Password for the SiteCountry email account",
    tip: "Official email server for cvai.com.mx on SiteCountry. Enter your full email address and account password.",
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
    userHint: "your-email@gmail.com",
    passHint: "16-character App Password",
    tip: "In your Google account, enable 2-Step Verification and generate an App Password.",
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
    passHint: "re_123456789... (Resend API Key)",
    tip: "Use 'resend' as username and your API Key generated on resend.com as password.",
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
    userHint: "AWS SES SMTP Username (AKIA...)",
    passHint: "AWS SES SMTP Password",
    tip: "Generate dedicated SMTP credentials in AWS Console > SES > SMTP Settings.",
    domains: ["amazonaws.com"],
  },
  {
    id: "custom",
    name: "Custom SMTP Server / Any other SMTP",
    badge: "Custom",
    category: "custom",
    host: "",
    port: 465,
    secure: true,
    userHint: "user@server.com",
    passHint: "SMTP server password",
    tip: "Compatible with any SMTP server worldwide.",
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
    bodyHtml: "<p>Hello {{first_name}},</p><p>We have important updates to advance your professional career.</p>",
    ctaText: "Go to my dashboard →",
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
      toast.error("Please provide at least a Campaign Name and Subject.");
      return;
    }
    try {
      const res = await saveCampaign({ data: { ...campaignForm, status: "draft" } });
      if (res.ok) {
        toast.success("Campaign saved as draft");
        loadData();
        setActiveTab("history");
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving campaign");
    }
  }

  // Pre-dispatch Safety Check
  async function handleOpenSafetyModal() {
    if (!campaignForm.name.trim() || !campaignForm.subject.trim()) {
      toast.error("Please provide Campaign Name and Subject before sending.");
      return;
    }

    try {
      // Save campaign first
      const saveRes = await saveCampaign({ data: { ...campaignForm, status: "draft" } });
      const currentCampaignId = saveRes.campaign?.id;
      if (!currentCampaignId) throw new Error("Could not obtain campaign ID.");

      setCampaignForm((prev) => ({ ...prev, id: currentCampaignId }));
      setTargetRecipientsCount(stats.subscriberCount || 1);
      setSafetyOpen(true);
    } catch (err: any) {
      toast.error(err.message || "Error preparing campaign");
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
        toast.success(res.message || "Campaign dispatched successfully!");
        loadData();
        setActiveTab("history");
      }
    } catch (err: any) {
      toast.error(err.message || "Error sending campaign");
    }
  }

  // Send Test Email in Wizard
  async function handleSendWizardTest() {
    if (!wizardTestEmail.trim() || !wizardTestEmail.includes("@")) {
      toast.error("Please enter a valid email address for testing.");
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
      toast.error(err.message || "Error sending test email");
    } finally {
      setSendingWizardTest(false);
    }
  }

  // Save SMTP Settings
  async function handleSaveSmtp() {
    if (!smtpForm.host.trim()) {
      toast.error("SMTP server host is required");
      return;
    }
    setSavingSmtp(true);
    try {
      const res: any = await saveAdminSmtpConfig({ data: smtpForm });
      if (res?.success || res?.ok) {
        toast.success(res.message || "SMTP configuration saved successfully");
        loadData();
      } else {
        toast.error(res?.message || "Error saving SMTP settings");
      }
    } catch (err: any) {
      toast.error(err.message || "Error communicating with server");
    } finally {
      setSavingSmtp(false);
    }
  }

  // Test SMTP Connection
  async function handleTestSmtp() {
    if (!smtpTestEmail.trim()) {
      toast.error("Please enter a recipient email for the SMTP test");
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
        toast.success(res.message || "SMTP connection successful!");
      }
    } catch (err: any) {
      toast.error(err.message || "SMTP test failed");
    } finally {
      setSendingSmtpTest(false);
    }
  }

  // Load Template into Campaign Wizard
  function handleUseTemplate(tpl: any) {
    setCampaignForm((prev) => ({
      ...prev,
      name: `Campaign: ${tpl.name}`,
      subject: tpl.subject,
      bodyHtml: tpl.body,
      ctaText: tpl.ctaText || "Learn more →",
      ctaUrl: tpl.ctaUrl || "https://cvai.com.mx/panel",
    }));
    setActiveTab("create");
    toast.success(`Template '${tpl.name}' loaded into editor`);
  }

  // Delete Campaign
  async function handleDeleteCampaign(id: string) {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const res = await deleteCampaign({ data: { id } });
      if (res.ok) {
        toast.success("Campaign deleted");
        loadData();
      }
    } catch (err: any) {
      toast.error(err.message || "Error deleting campaign");
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
            Design, segment, and dispatch bulk email campaigns to registered CVAI users.
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
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setActiveTab("create")}
            className="gap-1.5 text-xs font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Campaign
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
            <span>Create Campaign</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs py-2 gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs py-2 gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="subscribers" className="text-xs py-2 gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>Subscribers</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs py-2 gap-1.5">
            <Sliders className="h-3.5 w-3.5" />
            <span>Email Settings</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs py-2 gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. BROADCASTS OVERVIEW TAB */}
        <TabsContent value="broadcasts" className="space-y-6 mt-0">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                <span>Campaigns Created</span>
                <Megaphone className="h-4 w-4 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalCampaigns}</div>
              <div className="text-[11px] text-muted-foreground">Total dispatches and drafts</div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                <span>Emails Delivered</span>
                <Send className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {stats.totalSent.toLocaleString("en-US")}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Dispatched successfully
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                <span>Open Rate</span>
                <Eye className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.avgOpenRate}</div>
              <div className="text-[11px] text-muted-foreground">
                {stats.totalOpened} recorded opens
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                <span>Active Subscribers</span>
                <Users className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {stats.subscriberCount.toLocaleString("en-US")}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {suppressedCount} in suppression list
              </div>
            </div>
          </div>

          {/* Quick Launch Action Banner */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Launch a targeted campaign in minutes
              </h3>
              <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                Choose between free users, Pro subscribers, resume creators, or inactive users. Dynamically personalize with tags and preview across desktop and mobile.
              </p>
            </div>
            <Button
              onClick={() => setActiveTab("create")}
              className="gap-2 shrink-0 font-semibold shadow"
            >
              Start Campaign
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Recent Campaigns Table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-sm">Recent Campaigns</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1"
                onClick={() => setActiveTab("history")}
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {campaigns.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground text-xs space-y-2">
                <Mail className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p>You haven't created any campaigns yet.</p>
                <Button size="sm" variant="outline" onClick={() => setActiveTab("create")}>
                  Create your first campaign
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/30 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3 px-4">Campaign</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Audience</th>
                      <th className="py-3 px-4">Sent</th>
                      <th className="py-3 px-4">Opens</th>
                      <th className="py-3 px-4 text-right">Actions</th>
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
                              ? "Sent"
                              : c.status === "sending"
                              ? "Sending..."
                              : c.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 capitalize text-muted-foreground">
                          {c.audience === "all" ? "All users" : c.audience}
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
                            Edit
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
                  {campaignForm.id ? "Edit Campaign" : "Create New Email Campaign"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Configure visual content, segment your audience, and test before broadcasting.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveDraft} className="text-xs">
                  Save Draft
                </Button>
                <Button
                  size="sm"
                  onClick={handleOpenSafetyModal}
                  className="gap-1.5 text-xs font-semibold bg-primary"
                >
                  <Send className="h-3.5 w-3.5" />
                  Review & Send
                </Button>
              </div>
            </div>

            {/* Campaign Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="camp-name">Campaign Name *</Label>
                <Input
                  id="camp-name"
                  placeholder="e.g. September Pro 30% Promo"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="camp-subject">Email Subject *</Label>
                <Input
                  id="camp-subject"
                  placeholder="e.g. Accelerate your career search with CVAI Pro ✨"
                  value={campaignForm.subject}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, subject: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="camp-preview">Preview Text (Preheader)</Label>
                <Input
                  id="camp-preview"
                  placeholder="Inbox snippet before opening..."
                  value={campaignForm.previewText}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, previewText: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="camp-sender-name">Sender Name</Label>
                <Input
                  id="camp-sender-name"
                  placeholder="CVAI - Currículum Vitae AI"
                  value={campaignForm.senderName}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, senderName: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="camp-sender-email">Sender Email</Label>
                <Input
                  id="camp-sender-email"
                  type="email"
                  placeholder="support@cvai.com.mx"
                  value={campaignForm.senderEmail}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, senderEmail: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="camp-reply-to">Reply-To Email</Label>
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
                      name: campaignForm.name || "Custom Template",
                      slug: `custom-${Date.now()}`,
                      subject: campaignForm.subject,
                      body: campaignForm.bodyHtml,
                      ctaText: campaignForm.ctaText,
                      ctaUrl: campaignForm.ctaUrl,
                    },
                  ]);
                  toast.success("Campaign saved to Template library");
                }}
              />
            </div>

            {/* Audience Targeting Builder Component */}
            <div className="pt-6 border-t border-border">
              <div className="mb-4">
                <h3 className="font-bold text-base text-foreground">Audience Segmentation</h3>
                <p className="text-xs text-muted-foreground">
                  Select recipient criteria and preview matching users.
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
                <span className="text-xs font-semibold">Test before broadcasting:</span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  type="email"
                  className="text-xs h-9 w-full sm:w-64"
                  placeholder="your-email@example.com"
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
                  Send Test Email
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
                <h3 className="font-bold text-base text-foreground">Complete Campaign History</h3>
                <p className="text-xs text-muted-foreground">
                  Monitor delivery progress, open rates, clicks, and dispatch statuses.
                </p>
              </div>
              <Badge variant="outline">{campaigns.length} campaigns recorded</Badge>
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs">
                No campaign history recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3 px-4">Campaign & Subject</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Target Recipients</th>
                      <th className="py-3 px-4">Delivered</th>
                      <th className="py-3 px-4">Opens</th>
                      <th className="py-3 px-4">Clicks</th>
                      <th className="py-3 px-4 text-right">Actions</th>
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
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US") : "—"}
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
                            Edit
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
                <h3 className="font-bold text-base text-foreground">Email Templates Library</h3>
                <p className="text-xs text-muted-foreground">
                  Pre-designed and custom templates ready to use in any broadcast campaign.
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
                      <Copy className="h-3 w-3" /> Use in Campaign
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
                <h3 className="font-bold text-base text-foreground">Audience & Suppression List</h3>
                <p className="text-xs text-muted-foreground">
                  Registered users and marketing consent status according to privacy guidelines.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {subscribers.length} registered users
                </Badge>
                <Badge variant="secondary" className="text-xs text-amber-600 dark:text-amber-400">
                  {suppressedCount} unsubscribed / suppressed
                </Badge>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Plan</th>
                    <th className="py-2.5 px-3">Registration Date</th>
                    <th className="py-2.5 px-3">Marketing Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {subscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/20">
                      <td className="py-2.5 px-3 font-medium text-foreground">{s.name}</td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">{s.email}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={s.plan === "pro" ? "default" : "secondary"} className="text-[10px]">
                          {s.plan === "pro" ? "Pro" : "Free"}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-US") : "—"}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={s.isSuppressed ? "destructive" : "outline"}
                          className="text-[10px]"
                        >
                          {s.isSuppressed ? "Unsubscribed / Suppressed" : "Active Subscriber"}
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
                            toast.success("Status updated");
                            loadData();
                          }}
                        >
                          {s.isSuppressed ? "Reactivate" : "Suppress"}
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
                <h3 className="font-bold text-base text-foreground">SMTP Server Configuration</h3>
                <p className="text-xs text-muted-foreground">
                  Configure the outbound email delivery provider (SiteCountry, Resend, Gmail, SES, etc.) to dispatch emails.
                </p>
              </div>

              <Button
                onClick={handleSaveSmtp}
                disabled={savingSmtp}
                className="gap-1.5 font-semibold text-xs shadow-sm"
              >
                {savingSmtp ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Save Settings
              </Button>
            </div>

            {/* Provider presets */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Select Provider Preset</Label>
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
                      toast.info(`Preset configuration for ${p.name} loaded`);
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
                <Label htmlFor="smtp-host">SMTP Host / Server *</Label>
                <Input
                  id="smtp-host"
                  placeholder="mailadmin.sitecountry.net"
                  value={smtpForm.host}
                  onChange={(e) => setSmtpForm((p) => ({ ...p, host: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="smtp-port">Port</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  placeholder="465 or 587"
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
                <Label htmlFor="smtp-user">Username / Full Email *</Label>
                <Input
                  id="smtp-user"
                  placeholder="support@cvai.com.mx"
                  value={smtpForm.user}
                  onChange={(e) => setSmtpForm((p) => ({ ...p, user: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="smtp-pass">SMTP Password</Label>
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
                <Label htmlFor="smtp-from-email">Sender Email (From)</Label>
                <Input
                  id="smtp-from-email"
                  type="email"
                  placeholder="support@cvai.com.mx"
                  value={smtpForm.fromEmail}
                  onChange={(e) => setSmtpForm((p) => ({ ...p, fromEmail: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="smtp-from-name">Sender Name</Label>
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
                <div className="font-semibold text-foreground">Test SMTP Connection in Real-Time</div>
                <div className="text-muted-foreground">
                  Send a test email to verify that your SMTP credentials and server respond successfully.
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  type="email"
                  className="text-xs h-9 w-full sm:w-64"
                  placeholder="your-email@example.com"
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
                  Test Connection
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
                Total Sent
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalSent}</div>
              <div className="text-[11px] text-muted-foreground">Cumulative emails sent</div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Registered Opens
              </div>
              <div className="text-3xl font-bold text-emerald-600">{stats.totalOpened}</div>
              <div className="text-[11px] text-muted-foreground">Average rate: {stats.avgOpenRate}</div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Link Clicks
              </div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalClicked}</div>
              <div className="text-[11px] text-muted-foreground">Average rate: {stats.avgClickRate}</div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Unsubscribe Rate
              </div>
              <div className="text-3xl font-bold text-amber-600">
                {stats.totalSent > 0
                  ? ((suppressedCount / stats.totalSent) * 100).toFixed(1) + "%"
                  : "0.0%"}
              </div>
              <div className="text-[11px] text-muted-foreground">Within healthy threshold (&lt; 2%)</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <h3 className="font-bold text-base text-foreground">Campaign Performance Funnel</h3>
            <p className="text-xs text-muted-foreground">
              Visual breakdown of delivery flow and recipient engagement across all campaigns.
            </p>

            <div className="space-y-4 pt-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Successfully Delivered (100%)</span>
                  <span>{stats.totalSent} emails</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Estimated Opens ({stats.avgOpenRate})</span>
                  <span>{stats.totalOpened} opened</span>
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
                  <span>Clicks on CTA Button ({stats.avgClickRate})</span>
                  <span>{stats.totalClicked} clicks</span>
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
