import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Trash2, Loader2, Pencil, Mail, Send, FileText,
  Server, CheckCircle2, XCircle, Megaphone, Eye, EyeOff, Key,
  ShieldCheck, AlertCircle, RefreshCw, Check, Globe, Sparkles,
  HelpCircle, Info, ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  getAdminSmtpConfig,
  saveAdminSmtpConfig,
  sendTestSmtpEmail,
  lookupMxRecord,
} from "@/lib/smtp.functions";
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
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/emails")({
  component: EmailsAdmin,
});

type Template = {
  id: string; name: string; slug: string; type: string;
  subject: string; body: string; active: boolean;
};
type Broadcast = {
  id: string; subject: string; body: string; audience: string;
  status: string; scheduled_at: string | null; recipients_count: number; sent_count: number;
};
type EmailLog = {
  id: string; recipient: string; template: string | null;
  subject: string | null; status: string; error: string | null; created_at: string;
};

const emptyTemplate = { name: "", slug: "", type: "transactional", subject: "", body: "", active: true };
type TemplateForm = typeof emptyTemplate;
const emptyBroadcast = { subject: "", body: "", audience: "all", scheduled_at: "" };
type BroadcastForm = typeof emptyBroadcast;

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
    passHint: "Contraseña creada en tu panel de SiteCountry",
    tip: "Servidor oficial de correo de SiteCountry para cvai.com.mx (mailadmin.sitecountry.net). Usa tu correo completo y la contraseña creada en tu panel DirectAdmin de SiteCountry.",
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
    tip: "En tu cuenta de Google activa la 'Verificación en 2 pasos' y luego genera una 'Contraseña de aplicación' de 16 letras (no uses tu contraseña normal).",
    domains: ["gmail.com", "googlemail.com"],
  },
  {
    id: "outlook",
    name: "Microsoft 365 / Outlook / Hotmail",
    badge: "Outlook / Hotmail",
    category: "personal",
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    userHint: "tu-correo@outlook.com o hotmail.com",
    passHint: "Contraseña de cuenta o de aplicación Microsoft",
    tip: "Compatible con @outlook.com, @hotmail.com, @live.com y Microsoft 365 empresarial. Si tienes 2FA, genera una contraseña de aplicación.",
    domains: ["outlook.com", "hotmail.com", "live.com", "msn.com", "office365.com"],
  },
  {
    id: "yahoo",
    name: "Yahoo Mail",
    badge: "Yahoo",
    category: "personal",
    host: "smtp.mail.yahoo.com",
    port: 465,
    secure: true,
    userHint: "tu-usuario@yahoo.com",
    passHint: "Contraseña de aplicación de Yahoo",
    tip: "En la configuración de seguridad de Yahoo, ve a 'Generar contraseña de aplicación' e ingrésala aquí.",
    domains: ["yahoo.com", "yahoo.com.mx", "ymail.com"],
  },
  {
    id: "zoho",
    name: "Zoho Mail",
    badge: "Zoho Mail",
    category: "personal",
    host: "smtppro.zoho.com",
    port: 465,
    secure: true,
    userHint: "tu-correo@tudominio.com",
    passHint: "Contraseña de aplicación Zoho",
    tip: "Válido para Zoho gratuito o empresarial. Genera una contraseña de aplicación desde Mi Cuenta > Seguridad de Zoho.",
    domains: ["zoho.com", "zohomail.com"],
  },
  {
    id: "icloud",
    name: "Apple iCloud Mail",
    badge: "iCloud",
    category: "personal",
    host: "smtp.mail.me.com",
    port: 587,
    secure: false,
    userHint: "tu-correo@icloud.com",
    passHint: "Contraseña específica de app de Apple",
    tip: "Inicia sesión en appleid.apple.com > Seguridad > Contraseñas específicas de la app y genera una para CVAI.",
    domains: ["icloud.com", "me.com", "mac.com"],
  },
  {
    id: "hostinger",
    name: "Hostinger Webmail",
    badge: "Hostinger",
    category: "personal",
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    userHint: "contacto@tudominio.com",
    passHint: "Contraseña de tu buzón en Hostinger",
    tip: "Usa el correo completo creado en el panel de Hostinger y la contraseña asignada a ese buzón.",
    domains: ["hostinger.com", "titan.email"],
  },
  {
    id: "cpanel",
    name: "cPanel / Webmail / Dominio Propio",
    badge: "cPanel / Webmail",
    category: "personal",
    host: "mail.tudominio.com",
    port: 465,
    secure: true,
    userHint: "tu-correo@tudominio.com",
    passHint: "Contraseña directa de tu correo en cPanel",
    tip: "El servidor suele ser mail.tudominio.com. Si el certificado SSL de tu servidor es compartido, activa la opción 'Ignorar advertencias TLS'.",
    domains: [],
  },
  {
    id: "resend",
    name: "Resend (Transaccional)",
    badge: "Resend",
    category: "transactional",
    host: "smtp.resend.com",
    port: 465,
    secure: true,
    userHint: "resend",
    passHint: "re_xxxxxxxxxxxxxxxxxxxx",
    tip: "Crea tu clave en resend.com/api-keys. El usuario siempre es la palabra 'resend'.",
    domains: ["resend.com"],
  },
  {
    id: "sendgrid",
    name: "SendGrid (Twilio)",
    badge: "SendGrid",
    category: "transactional",
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    userHint: "apikey",
    passHint: "SG.xxxxxxxxxxxxxxxxxxxx",
    tip: "El usuario siempre es 'apikey' y la contraseña es tu API Key creada en SendGrid.",
    domains: ["sendgrid.com"],
  },
  {
    id: "brevo",
    name: "Brevo (Sendinblue)",
    badge: "Brevo",
    category: "transactional",
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    userHint: "tu-login-brevo@correo.com",
    passHint: "Clave SMTP master de Brevo",
    tip: "Consulta tus credenciales en el panel de Brevo en Configuración > SMTP & API.",
    domains: ["brevo.com", "sendinblue.com"],
  },
  {
    id: "mailgun",
    name: "Mailgun",
    badge: "Mailgun",
    category: "transactional",
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    userHint: "postmaster@mg.tudominio.com",
    passHint: "Contraseña SMTP de Mailgun",
    tip: "Obtenla en Sending > Domains > Domain Settings > SMTP Credentials.",
    domains: ["mailgun.org", "mailgun.com"],
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
    id: "postmark",
    name: "Postmark",
    badge: "Postmark",
    category: "transactional",
    host: "smtp.postmarkapp.com",
    port: 587,
    secure: false,
    userHint: "Server API Token de Postmark",
    passHint: "Server API Token de Postmark",
    tip: "Tanto el usuario como la contraseña corresponden al Server API Token de tu servidor en Postmark.",
    domains: ["postmarkapp.com"],
  },
  {
    id: "custom",
    name: "Servidor Personalizado / Cualquier otro SMTP",
    badge: "Personalizado",
    category: "custom",
    host: "",
    port: 587,
    secure: false,
    userHint: "usuario@servidor.com",
    passHint: "Contraseña del servidor SMTP",
    tip: "Compatible con cualquier servidor SMTP del mundo (Postfix, Exim, VPS privado, etc.).",
    domains: [],
  },
];

const defaultSmtpForm: SmtpFormState = {
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  user: "resend",
  pass: "",
  fromEmail: "contacto@cvai.com.mx",
  fromName: "CVAI - Currículum Vitae AI",
  replyTo: "soporte@cvai.com.mx",
  ignoreTlsErrors: false,
};

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function Kpi({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}

function statusBadge(s: string) {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    sent: "default", delivered: "default", draft: "secondary",
    scheduled: "outline", bounced: "destructive", failed: "destructive",
  };
  return <Badge variant={map[s] ?? "secondary"}>{s}</Badge>;
}

function EmailsAdmin() {
  const [templates, setTemplates] = useState<Template[] | null>(null);
  const [broadcasts, setBroadcasts] = useState<Broadcast[] | null>(null);
  const [logs, setLogs] = useState<EmailLog[] | null>(null);
  const [query, setQuery] = useState("");

  const [tplDialog, setTplDialog] = useState(false);
  const [tplEditId, setTplEditId] = useState<string | null>(null);
  const [tplForm, setTplForm] = useState<TemplateForm>(emptyTemplate);

  const [bcDialog, setBcDialog] = useState(false);
  const [bcEditId, setBcEditId] = useState<string | null>(null);
  const [bcForm, setBcForm] = useState<BroadcastForm>(emptyBroadcast);

  const [saving, setSaving] = useState(false);

  // SMTP state
  const [smtpForm, setSmtpForm] = useState<SmtpFormState>(defaultSmtpForm);
  const [loadingSmtp, setLoadingSmtp] = useState(false);
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testRecipient, setTestRecipient] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string>("custom");

  // Template preview state
  const [previewTpl, setPreviewTpl] = useState<Template | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);

  async function load() {
    const [t, b, l] = await Promise.all([
      supabase.from("email_templates").select("*").order("name"),
      supabase.from("email_broadcasts").select("*").order("created_at", { ascending: false }),
      supabase.from("email_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    if (t.error) toast.error(t.error.message); else setTemplates(t.data as Template[]);
    if (b.error) toast.error(b.error.message); else setBroadcasts(b.data as Broadcast[]);
    if (l.error) toast.error(l.error.message); else setLogs(l.data as EmailLog[]);
  }

  async function loadSmtp() {
    setLoadingSmtp(true);
    try {
      const res = await getAdminSmtpConfig();
      if (res.data) {
        const loaded: SmtpFormState = {
          host: res.data.host || "",
          port: Number(res.data.port) || 465,
          secure: Boolean(res.data.secure),
          user: res.data.user || "",
          pass: res.data.pass || "",
          fromEmail: res.data.fromEmail || "contacto@cvai.com.mx",
          fromName: res.data.fromName || "CVAI - Currículum Vitae AI",
          replyTo: res.data.replyTo || "soporte@cvai.com.mx",
          ignoreTlsErrors: Boolean((res.data as any).ignoreTlsErrors),
        };
        setSmtpForm(loaded);

        // Detect provider
        const matched = EMAIL_PROVIDERS.find(
          (p) => p.host && p.host.toLowerCase() === loaded.host.toLowerCase()
        );
        if (matched) {
          setSelectedProviderId(matched.id);
        } else if (loaded.host.startsWith("mail.")) {
          setSelectedProviderId("cpanel");
        } else {
          setSelectedProviderId("custom");
        }
      }
    } catch (err: any) {
      console.error("Error loading SMTP config:", err);
    } finally {
      setLoadingSmtp(false);
    }
  }

  useEffect(() => {
    load();
    loadSmtp();
  }, []);

  async function handleSaveSmtp() {
    if (!smtpForm.host.trim()) {
      toast.error("El servidor SMTP (Host) es obligatorio");
      return;
    }
    setSavingSmtp(true);
    try {
      const res = await saveAdminSmtpConfig({ data: smtpForm });
      if (res.success || res.ok) {
        toast.success(res.message || "Configuración SMTP guardada");
      } else {
        toast.error(res.message || "Error al guardar SMTP");
      }
    } catch (err: any) {
      toast.error(err.message || "Error al comunicarse con el servidor");
    } finally {
      setSavingSmtp(false);
    }
  }

  async function handleSendTest() {
    if (!testRecipient.trim()) {
      toast.error("Ingresa un correo destinatario para la prueba");
      return;
    }
    setSendingTest(true);
    try {
      const res = await sendTestSmtpEmail({
        data: {
          to: testRecipient.trim(),
          recipient: testRecipient.trim(),
          customSettings: smtpForm,
        },
      });
      if (res.success || res.ok) {
        toast.success(res.message || "¡Correo de prueba enviado con éxito!");
        load();
      } else {
        toast.error((res as any).message || "Error al enviar correo de prueba");
        load();
      }
    } catch (err: any) {
      toast.error(err.message || "Fallo en la prueba SMTP");
      load();
    } finally {
      setSendingTest(false);
    }
  }

  function applyProvider(providerId: string, customDomainHost?: string) {
    setSelectedProviderId(providerId);
    const p = EMAIL_PROVIDERS.find((x) => x.id === providerId);
    if (!p) return;

    setSmtpForm((prev) => {
      let nextHost = customDomainHost || p.host;
      if (providerId === "cpanel" && !customDomainHost) {
        const rawEmail = prev.fromEmail || prev.user || "";
        const domain = rawEmail.includes("@") ? rawEmail.split("@")[1].toLowerCase().trim() : "";
        if (domain) nextHost = `mail.${domain}`;
      }
      return {
        ...prev,
        host: nextHost || prev.host,
        port: p.port,
        secure: p.secure,
        user: p.id === "resend" ? "resend" : p.id === "sendgrid" ? "apikey" : prev.user,
        ignoreTlsErrors: providerId === "sitecountry" || providerId === "cpanel" ? true : prev.ignoreTlsErrors,
      };
    });
    toast.info(`Configuración para ${p.name} aplicada`);
  }

  async function autoDetectFromEmail(emailInput?: string) {
    const raw = (emailInput || smtpForm.user || smtpForm.fromEmail || "").trim();
    if (!raw.includes("@")) {
      toast.error("Ingresa primero un correo con '@' para auto-detectar");
      return;
    }
    const domain = raw.split("@")[1].toLowerCase().trim();
    const matched = EMAIL_PROVIDERS.find((p) =>
      p.domains.some((d) => domain === d || domain.endsWith("." + d))
    );

    if (matched) {
      applyProvider(matched.id);
      toast.success(`Proveedor detectado: ${matched.name}`);
    } else {
      // Query real DNS MX record for this domain
      try {
        const mxRes = await lookupMxRecord({ data: { domain } });
        if (mxRes.ok && mxRes.host) {
          applyProvider("cpanel", mxRes.host);
          setSmtpForm((prev) => ({
            ...prev,
            host: mxRes.host,
            port: 465,
            secure: true,
            ignoreTlsErrors: true,
          }));
          toast.success(`Servidor MX real detectado en DNS: ${mxRes.host}`);
          return;
        }
      } catch (err) {
        console.warn("Could not lookup MX via DoH:", err);
      }

      applyProvider("cpanel", `mail.${domain}`);
      toast.success(`Dominio @${domain} detectado. Host sugerido: mail.${domain}`);
    }
  }

  const selectedProvider = useMemo(() => {
    return EMAIL_PROVIDERS.find((p) => p.id === selectedProviderId) || EMAIL_PROVIDERS[EMAIL_PROVIDERS.length - 1];
  }, [selectedProviderId]);

  function openPreview(t: Template) {
    setPreviewTpl(t);
    setPreviewDialog(true);
  }

  const previewRendered = useMemo(() => {
    if (!previewTpl) return { subject: "", body: "" };
    let sub = previewTpl.subject
      .replace(/{{name}}/g, "Carlos Mendoza")
      .replace(/{{ticketId}}/g, "TK-9821");
    let body = previewTpl.body
      .replace(/{{name}}/g, "Carlos Mendoza")
      .replace(/{{email}}/g, "carlos.mendoza@ejemplo.com")
      .replace(/{{link}}/g, "https://cvai.com.mx/login")
      .replace(/{{ticketId}}/g, "TK-9821")
      .replace(/{{ticketSubject}}/g, "Optimización de currículum para ATS de retail")
      .replace(/{{replyMessage}}/g, "Hola Carlos, revisamos tu plantilla y optimizamos las etiquetas para los ATS más usados en México.")
      .replace(/{{planName}}/g, "CVAI Pro Mensual")
      .replace(/{{amount}}/g, "$99 MXN")
      .replace(/{{nextBillingDate}}/g, "15 de Octubre, 2026")
      .replace(/{{year}}/g, "2026");
    return { subject: sub, body };
  }, [previewTpl]);

  const filteredTpl = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates ?? [];
    return (templates ?? []).filter((t) => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
  }, [templates, query]);

  const deliverability = useMemo(() => {
    const l = logs ?? [];
    if (!l.length) return 100;
    const ok = l.filter((x) => x.status === "sent" || x.status === "delivered").length;
    return Math.round((ok / l.length) * 100);
  }, [logs]);

  // Template CRUD
  function openNewTpl() { setTplEditId(null); setTplForm(emptyTemplate); setTplDialog(true); }
  function openEditTpl(t: Template) {
    setTplEditId(t.id);
    setTplForm({ name: t.name, slug: t.slug, type: t.type, subject: t.subject, body: t.body, active: t.active });
    setTplDialog(true);
  }
  async function saveTpl() {
    if (!tplForm.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    setSaving(true);
    const payload = {
      name: tplForm.name.trim(), slug: tplForm.slug.trim() || slugify(tplForm.name),
      type: tplForm.type, subject: tplForm.subject, body: tplForm.body, active: tplForm.active,
    };
    const res = tplEditId
      ? await supabase.from("email_templates").update(payload).eq("id", tplEditId)
      : await supabase.from("email_templates").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(tplEditId ? "Plantilla actualizada" : "Plantilla creada");
    setTplDialog(false); load();
  }
  async function removeTpl(id: string) {
    if (!confirm("¿Eliminar esta plantilla?")) return;
    const { error } = await supabase.from("email_templates").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Plantilla eliminada");
    setTemplates((r) => (r ?? []).filter((x) => x.id !== id));
  }
  async function toggleTpl(t: Template) {
    const { error } = await supabase.from("email_templates").update({ active: !t.active }).eq("id", t.id);
    if (error) { toast.error(error.message); return; }
    setTemplates((r) => (r ?? []).map((x) => x.id === t.id ? { ...x, active: !x.active } : x));
  }

  // Broadcast CRUD
  function openNewBc() { setBcEditId(null); setBcForm(emptyBroadcast); setBcDialog(true); }
  function openEditBc(b: Broadcast) {
    setBcEditId(b.id);
    setBcForm({
      subject: b.subject, body: b.body, audience: b.audience,
      scheduled_at: b.scheduled_at ? b.scheduled_at.slice(0, 16) : "",
    });
    setBcDialog(true);
  }
  async function saveBc() {
    if (!bcForm.subject.trim()) { toast.error("El asunto es obligatorio"); return; }
    setSaving(true);
    const payload = {
      subject: bcForm.subject.trim(), body: bcForm.body, audience: bcForm.audience,
      scheduled_at: bcForm.scheduled_at ? new Date(bcForm.scheduled_at).toISOString() : null,
      status: bcForm.scheduled_at ? "scheduled" : "draft",
    };
    const res = bcEditId
      ? await supabase.from("email_broadcasts").update(payload).eq("id", bcEditId)
      : await supabase.from("email_broadcasts").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(bcEditId ? "Campaña actualizada" : "Campaña creada");
    setBcDialog(false); load();
  }
  async function removeBc(id: string) {
    if (!confirm("¿Eliminar esta campaña?")) return;
    const { error } = await supabase.from("email_broadcasts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Campaña eliminada");
    setBroadcasts((r) => (r ?? []).filter((x) => x.id !== id));
  }
  async function markSent(b: Broadcast) {
    if (!confirm("¿Marcar esta campaña como enviada?")) return;
    const { error } = await supabase.from("email_broadcasts")
      .update({ status: "sent", sent_count: b.recipients_count }).eq("id", b.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Campaña enviada");
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Email management</h1>
        <p className="text-sm text-muted-foreground">SMTP, plantillas y campañas.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={FileText} label="Plantillas" value={(templates?.length ?? 0).toString()} />
        <Kpi icon={Megaphone} label="Campañas" value={(broadcasts?.length ?? 0).toString()} />
        <Kpi icon={Send} label="Emails enviados" value={(logs ?? []).filter((l) => l.status === "sent" || l.status === "delivered").length.toString()} />
        <Kpi icon={CheckCircle2} label="Entregabilidad" value={`${deliverability}%`} />
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="broadcasts">Campañas</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="smtp">SMTP</TabsTrigger>
        </TabsList>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar plantilla…" value={query}
                onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Button onClick={openNewTpl}><Plus className="mr-1 h-4 w-4" /> Nueva plantilla</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plantilla</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Activa</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates === null ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
                ) : filteredTpl.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">Sin plantillas.</TableCell></TableRow>
                ) : filteredTpl.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.slug}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{t.type}</Badge></TableCell>
                    <TableCell className="max-w-[240px] truncate">{t.subject}</TableCell>
                    <TableCell><Switch checked={t.active} onCheckedChange={() => toggleTpl(t)} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openPreview(t)} title="Previsualizar"><Eye className="h-4 w-4 text-primary" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditTpl(t)} title="Editar"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeTpl(t.id)} title="Eliminar"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Broadcasts */}
        <TabsContent value="broadcasts" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openNewBc}><Plus className="mr-1 h-4 w-4" /> Nueva campaña</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Audiencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Enviados</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {broadcasts === null ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
                ) : broadcasts.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">Sin campañas.</TableCell></TableRow>
                ) : broadcasts.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="max-w-[240px] truncate font-medium">{b.subject}</TableCell>
                    <TableCell><Badge variant="secondary">{b.audience}</Badge></TableCell>
                    <TableCell>{statusBadge(b.status)}</TableCell>
                    <TableCell>{b.sent_count.toLocaleString()}{b.recipients_count ? ` / ${b.recipients_count.toLocaleString()}` : ""}</TableCell>
                    <TableCell className="text-right">
                      {b.status !== "sent" && (
                        <Button variant="ghost" size="icon" onClick={() => markSent(b)} title="Enviar"><Send className="h-4 w-4" /></Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => openEditBc(b)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeBc(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Logs */}
        <TabsContent value="logs" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destinatario</TableHead>
                  <TableHead>Plantilla</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs === null ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
                ) : logs.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">Sin registros.</TableCell></TableRow>
                ) : logs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.recipient}</TableCell>
                    <TableCell>{l.template ?? "—"}</TableCell>
                    <TableCell className="max-w-[220px] truncate">{l.subject ?? "—"}</TableCell>
                    <TableCell>
                      {l.status === "bounced" || l.status === "failed"
                        ? <span className="flex items-center gap-1 text-destructive text-sm"><XCircle className="h-4 w-4" /> {l.status}</span>
                        : statusBadge(l.status)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{new Date(l.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* SMTP */}
        <TabsContent value="smtp" className="space-y-6">
          {/* Status & Universal Provider Header */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-base">Servidor de Correo Saliente (SMTP Universal)</h3>
                  <Badge variant={smtpForm.host ? "default" : "secondary"}>
                    {smtpForm.host ? "Configurado" : "Pendiente"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {selectedProvider.name}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Puedes utilizar <strong>cualquier proveedor de correo del mundo</strong>: Gmail, Microsoft Outlook, Yahoo, Zoho, iCloud, Hostinger, cPanel / Webmail o servicios transaccionales.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => loadSmtp()} disabled={loadingSmtp}>
                  <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loadingSmtp ? "animate-spin" : ""}`} />
                  Recargar
                </Button>
                <Button size="sm" onClick={handleSaveSmtp} disabled={savingSmtp}>
                  {savingSmtp ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Check className="mr-1.5 h-3.5 w-3.5" />}
                  Guardar Cambios
                </Button>
              </div>
            </div>

            {/* Provider selector & auto-detect bar */}
            <div className="pt-3 border-t border-border/60 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1 space-y-1">
                <Label htmlFor="provider-selector" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Elige tu Proveedor de Correo:
                </Label>
                <Select value={selectedProviderId} onValueChange={(val) => applyProvider(val)}>
                  <SelectTrigger id="provider-selector" className="h-9">
                    <SelectValue placeholder="Selecciona un proveedor..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Correos Personales y Profesionales
                    </div>
                    {EMAIL_PROVIDERS.filter((p) => p.category === "personal").map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}

                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2 border-t border-border/40 pt-2">
                      Servicios Transaccionales & Cloud
                    </div>
                    {EMAIL_PROVIDERS.filter((p) => p.category === "transactional").map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}

                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2 border-t border-border/40 pt-2">
                      Personalizado
                    </div>
                    {EMAIL_PROVIDERS.filter((p) => p.category === "custom").map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-9 gap-1.5"
                  onClick={() => autoDetectFromEmail()}
                  title="Detecta automáticamente el servidor analizando tu dirección de correo"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Auto-detectar desde mi correo
                </Button>
              </div>
            </div>

            {/* Dynamic Provider Tip Box */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-3.5 flex items-start gap-3">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-semibold text-blue-900 dark:text-blue-200">
                  Instrucciones para {selectedProvider.name}:
                </div>
                <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
                  {selectedProvider.tip}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-blue-700/80 dark:text-blue-400/80 pt-1 text-[11px]">
                  <span><strong>Formato de usuario:</strong> {selectedProvider.userHint}</span>
                  <span><strong>Contraseña esperada:</strong> {selectedProvider.passHint}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Configuration Form (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center gap-2 font-medium text-sm">
                <Key className="h-4 w-4 text-primary" />
                Parámetros de Conexión SMTP
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="smtp-host">Host / Servidor SMTP</Label>
                  <Input
                    id="smtp-host"
                    placeholder="smtp.gmail.com o mail.tudominio.com"
                    value={smtpForm.host}
                    onChange={(e) => setSmtpForm((f) => ({ ...f, host: e.target.value }))}
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
                      const p = Number(e.target.value) || 465;
                      setSmtpForm((f) => ({
                        ...f,
                        port: p,
                        secure: p === 465 ? true : p === 587 ? false : f.secure,
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/30 p-3">
                  <div className="space-y-0.5 pr-2">
                    <div className="text-sm font-medium">SSL / TLS directo</div>
                    <div className="text-xs text-muted-foreground">
                      Puerto 465 (SSL activo) / Puerto 587 (STARTTLS inactivo).
                    </div>
                  </div>
                  <Switch
                    checked={smtpForm.secure}
                    onCheckedChange={(v) =>
                      setSmtpForm((f) => ({
                        ...f,
                        secure: v,
                        port: v ? (f.port === 587 ? 465 : f.port) : (f.port === 465 ? 587 : f.port),
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/30 p-3">
                  <div className="space-y-0.5 pr-2">
                    <div className="text-sm font-medium">Ignorar errores TLS</div>
                    <div className="text-xs text-muted-foreground">
                      Para cPanel, certificados compartidos o autofirmados.
                    </div>
                  </div>
                  <Switch
                    checked={smtpForm.ignoreTlsErrors}
                    onCheckedChange={(v) => setSmtpForm((f) => ({ ...f, ignoreTlsErrors: v }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smtp-user">Usuario / Correo / API Key</Label>
                    <button
                      type="button"
                      onClick={() => autoDetectFromEmail(smtpForm.user)}
                      className="text-[11px] text-primary hover:underline flex items-center gap-0.5"
                      title="Detectar servidor según este correo"
                    >
                      <Sparkles className="h-3 w-3" /> Auto-detectar
                    </button>
                  </div>
                  <Input
                    id="smtp-user"
                    placeholder={selectedProvider.userHint || "tu-correo@ejemplo.com"}
                    value={smtpForm.user}
                    onChange={(e) => setSmtpForm((f) => ({ ...f, user: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="smtp-pass">Contraseña / Token / App Password</Label>
                  <div className="relative">
                    <Input
                      id="smtp-pass"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••••••"
                      value={smtpForm.pass}
                      onChange={(e) => setSmtpForm((f) => ({ ...f, pass: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 space-y-3">
                <div className="text-sm font-medium">Identidad de Remitente (CVAI México)</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="smtp-from-name">Nombre que Verán los Usuarios</Label>
                    <Input
                      id="smtp-from-name"
                      placeholder="CVAI - Currículum Vitae AI"
                      value={smtpForm.fromName}
                      onChange={(e) => setSmtpForm((f) => ({ ...f, fromName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="smtp-from-email">Correo Remitente (From)</Label>
                    <Input
                      id="smtp-from-email"
                      type="email"
                      placeholder="contacto@cvai.com.mx"
                      value={smtpForm.fromEmail}
                      onChange={(e) => setSmtpForm((f) => ({ ...f, fromEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="smtp-reply-to">Correo de Respuesta (Reply-To)</Label>
                  <Input
                    id="smtp-reply-to"
                    type="email"
                    placeholder="soporte@cvai.com.mx"
                    value={smtpForm.replyTo}
                    onChange={(e) => setSmtpForm((f) => ({ ...f, replyTo: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    A este buzón llegarán las respuestas que los usuarios escriban a los correos del sistema.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button onClick={handleSaveSmtp} disabled={savingSmtp} className="w-full sm:w-auto">
                  {savingSmtp ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Check className="mr-1.5 h-4 w-4" />}
                  Guardar Configuración SMTP
                </Button>
              </div>
            </div>

            {/* Right: Test Email & App Password Guides (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Test email card */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Send className="h-4 w-4 text-primary" />
                  Prueba de Envío en Vivo
                </div>
                <p className="text-xs text-muted-foreground">
                  Envía un correo de verificación en tiempo real usando los parámetros actuales del formulario para validar la conexión y autenticación antes de guardar.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="test-email">Destinatario de Prueba</Label>
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="tu-correo@ejemplo.com"
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleSendTest}
                  disabled={sendingTest || !testRecipient.trim()}
                  className="w-full"
                  variant="outline"
                >
                  {sendingTest ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      Conectando y enviando prueba…
                    </>
                  ) : (
                    <>
                      <Mail className="mr-1.5 h-4 w-4" />
                      Enviar Correo de Prueba
                    </>
                  )}
                </Button>
              </div>

              {/* Universal Provider Guide */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <HelpCircle className="h-4 w-4 text-amber-500" />
                  Guía Rápida para cualquier Proveedor
                </div>
                <div className="text-xs space-y-2.5 text-muted-foreground">
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                    <strong className="text-foreground block mb-0.5">Gmail / Google:</strong>
                    Activa la <em>Verificación en 2 pasos</em> en myaccount.google.com y genera una <em>Contraseña de aplicación</em> de 16 caracteres.
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                    <strong className="text-foreground block mb-0.5">Outlook / Hotmail / Office 365:</strong>
                    Puerto 587 con STARTTLS. Si tienes autenticación en 2 pasos, crea una contraseña de aplicación en account.microsoft.com.
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                    <strong className="text-foreground block mb-0.5">cPanel / Webmail / Hosting:</strong>
                    Host: <code>mail.tudominio.com</code>. Usa el correo completo como usuario y activa <em>"Ignorar errores TLS"</em> si tu hosting usa SSL compartido.
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                    <strong className="text-foreground block mb-0.5">Yahoo / Zoho / Apple iCloud:</strong>
                    Todos estos proveedores requieren que generes una <em>Contraseña de aplicación</em> desde la sección de seguridad de tu cuenta.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Template dialog */}
      <Dialog open={tplDialog} onOpenChange={setTplDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{tplEditId ? "Editar plantilla" : "Nueva plantilla"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input value={tplForm.name}
                onChange={(e) => setTplForm((f) => ({ ...f, name: e.target.value, slug: tplEditId ? f.slug : slugify(e.target.value) }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input value={tplForm.slug} onChange={(e) => setTplForm((f) => ({ ...f, slug: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select value={tplForm.type} onValueChange={(v) => setTplForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transactional">Transaccional</SelectItem>
                    <SelectItem value="welcome">Bienvenida</SelectItem>
                    <SelectItem value="verification">Verificación</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Asunto</Label>
              <Input value={tplForm.subject} onChange={(e) => setTplForm((f) => ({ ...f, subject: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Cuerpo</Label>
              <Textarea rows={6} value={tplForm.body} onChange={(e) => setTplForm((f) => ({ ...f, body: e.target.value }))} />
              <p className="text-xs text-muted-foreground">Usa {"{{variables}}"} como {"{{name}}"} o {"{{link}}"}.</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label>Activa</Label>
              <Switch checked={tplForm.active} onCheckedChange={(v) => setTplForm((f) => ({ ...f, active: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTplDialog(false)}>Cancelar</Button>
            <Button onClick={saveTpl} disabled={saving}>{saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Broadcast dialog */}
      <Dialog open={bcDialog} onOpenChange={setBcDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{bcEditId ? "Editar campaña" : "Nueva campaña"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Asunto</Label>
              <Input value={bcForm.subject} onChange={(e) => setBcForm((f) => ({ ...f, subject: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Cuerpo</Label>
              <Textarea rows={6} value={bcForm.body} onChange={(e) => setBcForm((f) => ({ ...f, body: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Audiencia</Label>
                <Select value={bcForm.audience} onValueChange={(v) => setBcForm((f) => ({ ...f, audience: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="free">Gratuitos</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Programar (opcional)</Label>
                <Input type="datetime-local" value={bcForm.scheduled_at}
                  onChange={(e) => setBcForm((f) => ({ ...f, scheduled_at: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBcDialog(false)}>Cancelar</Button>
            <Button onClick={saveBc} disabled={saving}>{saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-h-[90vh] sm:max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Previsualización: {previewTpl?.name}
            </DialogTitle>
          </DialogHeader>
          {previewTpl && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm space-y-1">
                <div><span className="font-semibold text-foreground">Asunto:</span> {previewRendered.subject}</div>
                <div><span className="font-semibold text-foreground">Slug:</span> <code className="text-xs bg-muted px-1 py-0.5 rounded">{previewTpl.slug}</code></div>
                <div><span className="font-semibold text-foreground">Tipo:</span> <Badge variant="outline" className="ml-1">{previewTpl.type}</Badge></div>
              </div>

              <div className="rounded-xl border border-border p-4 bg-white text-black min-h-[250px] shadow-sm overflow-x-auto">
                <div dangerouslySetInnerHTML={{ __html: previewRendered.body }} />
              </div>

              <p className="text-xs text-muted-foreground">
                * Las variables dinámicas como {"{{name}}"}, {"{{link}}"}, etc., se han sustituido con datos de muestra para visualizar el diseño final.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialog(false)}>Cerrar</Button>
            {previewTpl && (
              <Button onClick={() => { setPreviewDialog(false); openEditTpl(previewTpl); }}>
                <Pencil className="mr-1 h-4 w-4" /> Editar plantilla
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
