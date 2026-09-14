import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

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
    // Preserve existing password if user submitted a placeholder or empty password
    pass: settings.pass && settings.pass !== "••••••••" ? settings.pass : current.pass,
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
  const { transporter, config } = await createSmtpTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ""),
      html,
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
