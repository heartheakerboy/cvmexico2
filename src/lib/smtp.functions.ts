import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  getSmtpSettings,
  saveSmtpSettings,
  createSmtpTransporter,
  type SmtpSettings,
} from "./smtp.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getAdminSmtpConfig = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const config = await getSmtpSettings();
    return {
      ...config,
      // Mask password so it's not exposed in plaintext to frontend
      pass: config.pass ? "••••••••" : "",
      hasPassword: Boolean(config.pass),
    };
  });

export const saveAdminSmtpConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: Partial<SmtpSettings>) => data)
  .handler(async ({ data }) => {
    await saveSmtpSettings(data);
    return { ok: true };
  });

export const sendTestSmtpEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { recipient: string; customSettings?: Partial<SmtpSettings> }) => data)
  .handler(async ({ data }) => {
    const { recipient, customSettings } = data;

    if (!recipient || !recipient.includes("@")) {
      throw new Error("Por favor proporciona una dirección de correo de prueba válida.");
    }

    // Merge custom settings if tested prior to saving
    const current = await getSmtpSettings();
    const configToTest: SmtpSettings = {
      ...current,
      ...(customSettings || {}),
      pass:
        customSettings?.pass && customSettings.pass !== "••••••••"
          ? customSettings.pass
          : current.pass,
    };

    if (!configToTest.host || !configToTest.user) {
      throw new Error("Faltan datos de Host o Usuario SMTP para realizar la prueba.");
    }

    const { transporter } = await createSmtpTransporter(configToTest);

    // 1. Verify connection
    try {
      await transporter.verify();
    } catch (verifyErr: any) {
      throw new Error(`Error de conexión SMTP: ${verifyErr.message || String(verifyErr)}`);
    }

    // 2. Send formatted test email
    const subject = "Prueba de Configuración SMTP — CVAI";
    const timestamp = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 26px; font-weight: 800;">CV<span style="color: #1e293b;">AI</span></h1>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">Curriculum Vitae AI</p>
        </div>
        
        <div style="padding: 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #166534; margin: 0 0 8px 0; font-size: 18px;">✅ Conexión SMTP Exitosa</h2>
          <p style="color: #15803d; margin: 0; font-size: 14px; line-height: 1.5;">
            Este es un correo de prueba generado automáticamente desde el panel de administración de CVAI.
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 35%;">Servidor Host:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-weight: 600;">${configToTest.host}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Puerto:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-weight: 600;">${configToTest.port} (${configToTest.secure ? "SSL/TLS" : "STARTTLS"})</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Remitente:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-weight: 600;">${configToTest.fromName} &lt;${configToTest.fromEmail}&gt;</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Fecha y Hora:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${timestamp} (CDMX)</td>
          </tr>
        </table>

        <p style="color: #64748b; font-size: 12px; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 16px; margin: 0;">
          CVAI (cvai.com.mx) — Plataforma digital independiente de optimización curricular en México.
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${configToTest.fromName}" <${configToTest.fromEmail}>`,
      to: recipient,
      subject,
      html,
    });

    // Log to email_logs
    try {
      await supabaseAdmin.from("email_logs" as any).insert({
        recipient,
        template: "test-smtp",
        subject,
        status: "delivered",
        error: null,
      });
    } catch (logErr) {
      console.warn("Could not record test log:", logErr);
    }

    return {
      ok: true,
      messageId: info.messageId,
      message: `Correo de prueba enviado con éxito a ${recipient}`,
    };
  });
