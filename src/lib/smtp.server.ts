import nodemailer from "nodemailer";
import { getServiceDb } from "@/lib/db/server-db.server";
const supabaseAdmin = getServiceDb();

export type SmtpSettings = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
  replyTo: string;
  ignoreTlsErrors?: boolean;
};

export const DEFAULT_SMTP_SETTINGS: SmtpSettings = {
  enabled: false,
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true" || false,
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS || "",
  fromEmail: process.env.SMTP_FROM || "soporte@cvai.com.mx",
  fromName: process.env.SMTP_FROM_NAME || "CVAI (Curriculum Vitae AI)",
  replyTo: process.env.SMTP_REPLY_TO || "soporte@cvai.com.mx",
  ignoreTlsErrors: false,
};

export async function getSmtpSettings(): Promise<SmtpSettings> {
  try {
    const { data } = await supabaseAdmin
      .from("system_settings" as any)
      .select("value")
      .eq("key", "smtp_config")
      .maybeSingle();

    if (data?.value && typeof data.value === "object") {
      return {
        ...DEFAULT_SMTP_SETTINGS,
        ...(data.value as SmtpSettings),
      };
    }
  } catch (err) {
    console.warn("Could not load smtp_config from database, using env defaults:", err);
  }

  return DEFAULT_SMTP_SETTINGS;
}

export async function saveSmtpSettings(settings: Partial<SmtpSettings>): Promise<void> {
  const current = await getSmtpSettings();
  const next: SmtpSettings = {
    ...current,
    ...settings,
    host: (settings.host !== undefined ? settings.host : current.host).trim(),
    user: (settings.user !== undefined ? settings.user : current.user).trim(),
    fromEmail: (settings.fromEmail !== undefined ? settings.fromEmail : current.fromEmail).trim(),
    replyTo: (settings.replyTo !== undefined ? settings.replyTo : current.replyTo).trim(),
    fromName: (settings.fromName !== undefined ? settings.fromName : current.fromName).trim(),
    port: Number(settings.port) || current.port || 465,
    secure: settings.secure !== undefined ? Boolean(settings.secure) : current.secure,
    enabled: true,
    // Preserve existing password if user submitted a placeholder or empty password
    pass: settings.pass && settings.pass !== "••••••••" ? settings.pass.trim() : current.pass,
  };

  const { error } = await supabaseAdmin
    .from("system_settings" as any)
    .upsert({ key: "smtp_config", value: next }, { onConflict: "key" });

  if (error) throw error;
}

export async function createSmtpTransporter(customSettings?: SmtpSettings) {
  const config = customSettings || (await getSmtpSettings());

  if (!config.host) {
    throw new Error("El host del servidor SMTP es obligatorio.");
  }

  const transportOptions: any = {
    host: config.host,
    port: Number(config.port) || 587,
    secure: Boolean(config.secure), // true for 465, false for other ports
    tls: {
      // Allow self-signed or shared certificates if ignoreTlsErrors is set
      rejectUnauthorized: !config.ignoreTlsErrors && process.env.NODE_ENV === "production",
    },
  };

  // Only attach auth if user is provided
  if (config.user) {
    transportOptions.auth = {
      user: config.user,
      pass: config.pass,
    };
  }

  const transporter = nodemailer.createTransport(transportOptions);

  return { transporter, config };
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  templateSlug,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  templateSlug?: string;
}) {
  let finalHtml = html;
  if (!html.includes("<html") && !html.includes("<div") && !html.includes("<body")) {
    const paragraphs = html
      .split(/\n\n+/)
      .map((p) => {
        // Convert URLs to clickable links if not already wrapped in <a>
        const linked = p.replace(
          /(https?:\/\/[^\s<]+)/g,
          '<a href="$1" style="color: #2563eb; font-weight: 600; text-decoration: underline; word-break: break-all;">$1</a>'
        );
        return `<p style="margin: 0 0 16px 0; line-height: 1.6; color: #334155;">${linked.replace(/\n/g, "<br/>")}</p>`;
      })
      .join("");

    finalHtml = `
      <div style="background-color: #f8fafc; padding: 36px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="background-color: #ffffff; padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9; text-align: center;">
            <h1 style="color: #2563eb; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">CV<span style="color: #0f172a;">AI</span></h1>
            <p style="color: #64748b; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Curriculum Vitae AI</p>
          </div>
          <div style="padding: 32px; font-size: 15px; color: #334155;">
            ${paragraphs}
          </div>
          <div style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
            <p style="margin: 0;">CVAI (cvai.com.mx) — Plataforma inteligente de optimización curricular en México.</p>
            <p style="margin: 4px 0 0 0;">Si no reconoces esta acción, puedes ignorar este mensaje de forma segura.</p>
          </div>
        </div>
      </div>
    `;
  }

  try {
    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ""),
      html: finalHtml,
      replyTo: config.replyTo || config.fromEmail,
    });

    // Log success
    try {
      await supabaseAdmin.from("email_logs" as any).insert({
        recipient: to,
        template: templateSlug || "custom",
        subject,
        status: "sent",
        error: null,
      });
    } catch (logErr) {
      console.warn("Could not record email log:", logErr);
    }

    return { ok: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Error sending email via SMTP:", error);

    // Log failure
    try {
      await supabaseAdmin.from("email_logs" as any).insert({
        recipient: to,
        template: templateSlug || "custom",
        subject,
        status: "failed",
        error: error.message || String(error),
      });
    } catch (logErr) {
      console.warn("Could not record failed email log:", logErr);
    }

    throw error;
  }
}

export async function sendTemplateEmail({
  to,
  templateSlug,
  variables = {},
  fallbackSubject,
  fallbackHtml,
}: {
  to: string;
  templateSlug: string;
  variables?: Record<string, string>;
  fallbackSubject?: string;
  fallbackHtml?: string;
}) {
  let subject = fallbackSubject || "Notificación de CVAI";
  let html = fallbackHtml || "<p>Hola</p>";

  try {
    const { data: tpl } = await supabaseAdmin
      .from("email_templates" as any)
      .select("*")
      .eq("slug", templateSlug)
      .eq("active", true)
      .maybeSingle();

    if (tpl) {
      subject = tpl.subject;
      html = tpl.body;

      // Replace variables like {{name}}, {{link}}, etc.
      Object.entries(variables).forEach(([key, val]) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        subject = subject.replace(regex, val);
        html = html.replace(regex, val);
      });
    }
  } catch (err) {
    console.warn(`Could not load template '${templateSlug}', using fallback:`, err);
  }

  return sendEmail({
    to,
    subject,
    html,
    templateSlug,
  });
}

