import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  getSmtpSettings,
  saveSmtpSettings,
  createSmtpTransporter,
  sendTemplateEmail,
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
    return { ok: true, success: true, message: "Configuración SMTP guardada exitosamente" };
  });

export const lookupMxRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { domain: string }) => data)
  .handler(async ({ data }) => {
    const cleanDomain = data.domain.replace(/^.*@/, "").trim().toLowerCase();
    try {
      const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=MX`, {
        headers: { accept: "application/dns-json" },
      });
      const json = await res.json();
      if (json.Answer && json.Answer.length > 0) {
        const sorted = json.Answer.sort((a: any, b: any) => {
          const prioA = parseInt(a.data.split(" ")[0]) || 10;
          const prioB = parseInt(b.data.split(" ")[0]) || 10;
          return prioA - prioB;
        });
        const mxHost = sorted[0].data.split(" ")[1]?.replace(/\.$/, "") || "";
        return { ok: true, host: mxHost };
      }
    } catch (err: any) {
      console.warn("MX lookup error:", err);
    }
    return { ok: false, host: null };
  });

export const sendTestSmtpEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (data: {
      recipient?: string;
      to?: string;
      customSettings?: Partial<SmtpSettings>;
    }) => data
  )
  .handler(async ({ data }) => {
    const targetRecipient = (data.recipient || data.to || "").trim();
    const customSettings = data.customSettings;

    if (!targetRecipient || !targetRecipient.includes("@")) {
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

    if (!configToTest.host) {
      throw new Error("Falta el Host del servidor SMTP para realizar la prueba.");
    }

    const { transporter } = await createSmtpTransporter(configToTest);

    // 1. Verify connection with intelligent diagnostics
    try {
      await transporter.verify();
    } catch (verifyErr: any) {
      const msg = verifyErr.message || String(verifyErr);
      if (msg.includes("ETIMEDOUT")) {
        throw new Error(
          `Tiempo de espera agotado (ETIMEDOUT): El host '${configToTest.host}' en el puerto ${configToTest.port} no respondió. Verifica que el servidor sea correcto (no una IP de parking) y que el puerto sea el adecuado (465 para SSL o 587 para STARTTLS).`
        );
      } else if (
        msg.includes("535") ||
        msg.includes("Incorrect authentication data") ||
        msg.includes("Invalid login")
      ) {
        throw new Error(
          `Autenticación fallida (Error 535): Usuario o contraseña incorrectos en '${configToTest.host}'. Verifica que el usuario sea tu correo completo y que la contraseña sea correcta (o genera una 'Contraseña de aplicación' si usas Gmail/Outlook).`
        );
      } else if (msg.includes("ECONNREFUSED")) {
        throw new Error(
          `Conexión rechazada (ECONNREFUSED): El servidor '${configToTest.host}' rechazó la conexión en el puerto ${configToTest.port}. Prueba cambiando entre puerto 465 (SSL) y 587 (TLS).`
        );
      }
      throw new Error(`Error de conexión SMTP: ${msg}`);
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
      to: targetRecipient,
      subject,
      html,
    });

    // Log to email_logs
    try {
      await supabaseAdmin.from("email_logs" as any).insert({
        recipient: targetRecipient,
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
      success: true,
      messageId: info.messageId,
      message: `Correo de prueba enviado con éxito a ${targetRecipient}`,
    };
  });

export const requestPasswordReset = createServerFn({ method: "POST" })
  .validator((data: { email: string; redirectTo?: string }) => data)
  .handler(async ({ data }) => {
    const email = data.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      throw new Error("Por favor ingresa una dirección de correo electrónico válida.");
    }

    const redirectTo =
      data.redirectTo ||
      `${process.env.VITE_SITE_URL || "https://cvai.com.mx"}/actualizar-password`;

    // 1. Generate secure recovery token with Supabase Admin SDK without sending Supabase's default email
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo,
      },
    });

    if (linkErr) {
      // If user does not exist, return generic success to protect user privacy
      if (linkErr.message?.toLowerCase().includes("not found")) {
        return {
          ok: true,
          success: true,
          message: "Si tu correo está registrado, recibirás un enlace de recuperación en breve.",
        };
      }
      throw new Error(linkErr.message || "Error al procesar la solicitud de recuperación.");
    }

    const recoveryLink = linkData?.properties?.action_link;
    if (!recoveryLink) {
      throw new Error("No se pudo generar el enlace de restablecimiento.");
    }

    // 2. Extract user's display name or email prefix
    const userName =
      linkData?.user?.user_metadata?.full_name ||
      linkData?.user?.user_metadata?.name ||
      email.split("@")[0];

    const appUrl = redirectTo ? new URL(redirectTo).origin : "https://cvai.com.mx";

    // 3. Send email using our custom SMTP and the 'password-reset' template from database
    try {
      await sendTemplateEmail({
        to: email,
        templateSlug: "password-reset",
        variables: {
          name: userName,
          link: recoveryLink,
          email: email,
          app_url: appUrl,
        },
        fallbackSubject: "Instrucciones para restablecer tu contraseña en CVAI",
        fallbackHtml: `
          <h2>Hola ${userName},</h2>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en CVAI.</p>
          <p><a href="${recoveryLink}">Restablecer mi contraseña</a></p>
          <p>Este enlace expirará en 1 hora. Si no realizaste esta solicitud, puedes ignorar este mensaje.</p>
        `,
      });
    } catch (smtpErr: any) {
      console.error("Error sending password reset via custom SMTP:", smtpErr);
      throw new Error(
        `Error al enviar el correo con tu servidor SMTP (${smtpErr.message || "revisa las credenciales SMTP en el Panel de Administración"}).`
      );
    }

    return {
      ok: true,
      success: true,
      message: "Enlace de recuperación enviado con éxito mediante la plantilla de CVAI.",
    };
  });
