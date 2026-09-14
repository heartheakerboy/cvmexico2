import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendEmail } from "./smtp.server";

export type AudienceFilters = {
  plan?: "all" | "free" | "pro";
  activity?: "all" | "active" | "inactive";
  createdResume?: "all" | "yes" | "no";
  downloaded?: "all" | "yes" | "no";
  usedAi?: "all" | "yes" | "no";
  language?: "all" | "es" | "en";
  registered?: "all" | "today" | "week" | "month";
  selectedUserIds?: string[];
  excludedUserIds?: string[];
};

export type CampaignData = {
  id?: string;
  name: string;
  subject: string;
  previewText?: string;
  senderName?: string;
  senderEmail?: string;
  replyTo?: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
  bannerUrl?: string;
  logoUrl?: string;
  audienceType?: string;
  filters?: AudienceFilters;
  language?: "both" | "es" | "en";
  scheduledAt?: string | null;
  status?: "draft" | "scheduled" | "sending" | "sent" | "paused" | "cancelled" | "failed";
};

// Helper to fetch current suppression list from system_settings
async function getSuppressionList(): Promise<string[]> {
  try {
    const { data } = await supabaseAdmin
      .from("system_settings" as any)
      .select("value")
      .eq("key", "email_suppressions")
      .maybeSingle();

    if (Array.isArray(data?.value)) {
      return data.value.map((e: any) =>
        typeof e === "string" ? e.toLowerCase() : e.email?.toLowerCase()
      );
    }
  } catch (err) {
    console.warn("Could not read email_suppressions:", err);
  }
  return [];
}

// 1. Get Broadcasts Overview & List
export const getBroadcastsData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { data: broadcasts, error: bErr } = await supabaseAdmin
      .from("email_broadcasts" as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (bErr) throw bErr;

    const { data: logs } = await supabaseAdmin
      .from("email_logs" as any)
      .select("template, status, created_at")
      .ilike("template", "broadcast:%");

    const broadcastList = (broadcasts || []).map((b: any) => {
      const bLogs = (logs || []).filter((l: any) => l.template === `broadcast:${b.id}`);
      const delivered = bLogs.filter(
        (l: any) =>
          l.status === "delivered" ||
          l.status === "sent" ||
          l.status === "opened" ||
          l.status === "clicked"
      ).length;
      const opened = bLogs.filter((l: any) => l.status === "opened" || l.status === "clicked").length;
      const clicked = bLogs.filter((l: any) => l.status === "clicked").length;
      const failed = bLogs.filter((l: any) => l.status === "failed").length;

      let meta: any = {};
      try {
        if (b.body && b.body.startsWith("{") && b.body.endsWith("}")) {
          meta = JSON.parse(b.body);
        }
      } catch {}

      return {
        id: b.id,
        name: meta.name || b.subject || "Campaña sin nombre",
        subject: b.subject,
        previewText: meta.previewText || "",
        status: b.status || "draft",
        scheduledAt: b.scheduled_at,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
        audience: b.audience || "all",
        recipientsCount: b.recipients_count || 0,
        sentCount: b.sent_count || delivered || 0,
        openedCount: opened,
        clickedCount: clicked,
        failedCount: failed,
        bodyHtml: meta.bodyHtml || b.body || "",
        ctaText: meta.ctaText || "",
        ctaUrl: meta.ctaUrl || "",
        bannerUrl: meta.bannerUrl || "",
        filters: meta.filters || {},
        language: meta.language || "both",
      };
    });

    const totalCampaigns = broadcastList.length;
    const totalSent = broadcastList.reduce((acc: number, c: any) => acc + (c.sentCount || 0), 0);
    const totalOpened = broadcastList.reduce((acc: number, c: any) => acc + (c.openedCount || 0), 0);
    const totalClicked = broadcastList.reduce((acc: number, c: any) => acc + (c.clickedCount || 0), 0);

    const avgOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0.0";
    const avgClickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : "0.0";

    const { count: subscriberCount } = await supabaseAdmin
      .from("profiles" as any)
      .select("id", { count: "exact", head: true });

    return {
      campaigns: broadcastList,
      stats: {
        totalCampaigns,
        totalSent,
        totalOpened,
        totalClicked,
        avgOpenRate: `${avgOpenRate}%`,
        avgClickRate: `${avgClickRate}%`,
        subscriberCount: subscriberCount || 0,
      },
    };
  });

// 2. Audience Evaluation & Target Filtering
export const evaluateAudience = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((filters: AudienceFilters) => filters)
  .handler(async ({ data: filters }) => {
    const suppressions = await getSuppressionList();

    let query = supabaseAdmin
      .from("profiles" as any)
      .select("id, full_name, email, plan, created_at, dashboard_lang, resume_lang");

    if (filters.plan && filters.plan !== "all") {
      query = query.eq("plan", filters.plan);
    }

    if (filters.registered && filters.registered !== "all") {
      const now = new Date();
      if (filters.registered === "today") {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        query = query.gte("created_at", startOfDay);
      } else if (filters.registered === "week") {
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte("created_at", startOfWeek);
      } else if (filters.registered === "month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        query = query.gte("created_at", startOfMonth);
      }
    }

    const { data: profiles, error: pErr } = await query;
    if (pErr) throw pErr;

    let resumeUserIds = new Set<string>();
    if (filters.createdResume && filters.createdResume !== "all") {
      const { data: resumes } = await supabaseAdmin.from("resumes" as any).select("user_id");
      resumes?.forEach((r: any) => r.user_id && resumeUserIds.add(r.user_id));
    }

    let downloadUserIds = new Set<string>();
    if (filters.downloaded && filters.downloaded !== "all") {
      const { data: downloads } = await supabaseAdmin.from("downloads" as any).select("user_id");
      downloads?.forEach((d: any) => d.user_id && downloadUserIds.add(d.user_id));
    }

    let aiUserIds = new Set<string>();
    if (filters.usedAi && filters.usedAi !== "all") {
      const { data: aiLogs } = await supabaseAdmin.from("ai_usage_logs" as any).select("user_id");
      aiLogs?.forEach((a: any) => a.user_id && aiUserIds.add(a.user_id));
    }

    const selectedSet = filters.selectedUserIds ? new Set(filters.selectedUserIds) : null;
    const excludedSet = filters.excludedUserIds ? new Set(filters.excludedUserIds) : new Set();

    let eligibleList: any[] = [];
    let suppressedCount = 0;

    for (const p of profiles || []) {
      const email = (p.email || "").toLowerCase().trim();
      if (!email || !email.includes("@")) continue;

      if (suppressions.includes(email)) {
        suppressedCount++;
        continue;
      }

      if (excludedSet.has(p.id)) continue;
      if (selectedSet && selectedSet.size > 0 && !selectedSet.has(p.id)) continue;

      if (filters.createdResume === "yes" && !resumeUserIds.has(p.id)) continue;
      if (filters.createdResume === "no" && resumeUserIds.has(p.id)) continue;

      if (filters.downloaded === "yes" && !downloadUserIds.has(p.id)) continue;
      if (filters.downloaded === "no" && downloadUserIds.has(p.id)) continue;

      if (filters.usedAi === "yes" && !aiUserIds.has(p.id)) continue;
      if (filters.usedAi === "no" && aiUserIds.has(p.id)) continue;

      const userLang = (p.dashboard_lang || p.resume_lang || "es").toLowerCase();
      if (filters.language === "es" && !userLang.startsWith("es")) continue;
      if (filters.language === "en" && !userLang.startsWith("en")) continue;

      eligibleList.push({
        id: p.id,
        email,
        name: p.full_name || email.split("@")[0],
        plan: p.plan || "free",
        language: userLang.startsWith("en") ? "en" : "es",
        createdAt: p.created_at,
      });
    }

    const freeCount = eligibleList.filter((x) => x.plan !== "pro").length;
    const proCount = eligibleList.filter((x) => x.plan === "pro").length;
    const esCount = eligibleList.filter((x) => x.language === "es").length;
    const enCount = eligibleList.filter((x) => x.language === "en").length;

    return {
      totalEligible: eligibleList.length,
      freeCount,
      proCount,
      esCount,
      enCount,
      suppressedCount,
      sampleRecipients: eligibleList.slice(0, 50),
    };
  });

// 3. Search Recipients by Name or Email
export const searchUsersForBroadcast = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { query: string }) => data)
  .handler(async ({ data }) => {
    const q = (data.query || "").trim();
    if (!q) return [];

    const { data: users, error } = await supabaseAdmin
      .from("profiles" as any)
      .select("id, full_name, email, plan, dashboard_lang, created_at")
      .or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
      .limit(25);

    if (error) throw error;
    return users || [];
  });

// 4. Save or Update Broadcast Campaign
export const saveCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: CampaignData) => data)
  .handler(async ({ data }) => {
    const payloadBody = JSON.stringify({
      name: data.name,
      previewText: data.previewText,
      senderName: data.senderName,
      senderEmail: data.senderEmail,
      replyTo: data.replyTo,
      bodyHtml: data.bodyHtml,
      ctaText: data.ctaText,
      ctaUrl: data.ctaUrl,
      bannerUrl: data.bannerUrl,
      logoUrl: data.logoUrl,
      filters: data.filters,
      language: data.language,
    });

    const record: any = {
      subject: data.subject,
      body: payloadBody,
      audience: data.audienceType || "all",
      status: data.status || "draft",
      scheduled_at: data.scheduledAt || null,
      updated_at: new Date().toISOString(),
    };

    if (data.id) {
      const { data: updated, error } = await supabaseAdmin
        .from("email_broadcasts" as any)
        .update(record)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw error;
      return { ok: true, campaign: updated };
    } else {
      record.created_at = new Date().toISOString();
      const { data: created, error } = await supabaseAdmin
        .from("email_broadcasts" as any)
        .insert(record)
        .select()
        .single();
      if (error) throw error;
      return { ok: true, campaign: created };
    }
  });

// 5. Send Test Broadcast Email
export const sendTestBroadcast = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { campaign: CampaignData; testEmail: string }) => data)
  .handler(async ({ data }) => {
    const { campaign, testEmail } = data;
    if (!testEmail || !testEmail.includes("@")) {
      throw new Error("Ingresa un correo de prueba válido.");
    }

    let renderedHtml = campaign.bodyHtml || "<p>Prueba de campaña</p>";
    renderedHtml = renderedHtml
      .replace(/{{first_name}}/g, "Firoz")
      .replace(/{{last_name}}/g, "Pérez")
      .replace(/{{email}}/g, testEmail)
      .replace(/{{plan_name}}/g, "Pro")
      .replace(/{{registration_date}}/g, new Date().toLocaleDateString("es-MX"))
      .replace(/{{resume_count}}/g, "3")
      .replace(/{{ai_usage}}/g, "12 consultas")
      .replace(/{{website_name}}/g, "CVAI")
      .replace(/{{website_url}}/g, "https://cvai.com.mx");

    let headerBlock = "";
    if (campaign.bannerUrl) {
      headerBlock = `<div style="text-align: center; margin-bottom: 20px;"><img src="${campaign.bannerUrl}" alt="Banner" style="max-width: 100%; border-radius: 8px; max-height: 240px; object-fit: cover;" /></div>`;
    }

    let ctaBlock = "";
    if (campaign.ctaText && campaign.ctaUrl) {
      ctaBlock = `
        <div style="text-align: center; margin: 28px 0;">
          <a href="${campaign.ctaUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 15px;">
            ${campaign.ctaText}
          </a>
        </div>
      `;
    }

    const previewBlock = campaign.previewText
      ? `<div style="display:none;font-size:1px;color:#fff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${campaign.previewText}</div>`
      : "";

    const fullHtml = `
      ${previewBlock}
      <div style="background-color: #f8fafc; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          ${headerBlock}
          <div style="font-size: 15px; line-height: 1.6; color: #334155;">
            ${renderedHtml}
          </div>
          ${ctaBlock}
          <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6;">
            <p style="margin: 0 0 4px 0;">Este es un correo de prueba de <strong>${campaign.name}</strong>.</p>
            <p style="margin: 0;">CVAI (cvai.com.mx) — Av. Insurgentes Sur, CDMX, México.</p>
            <p style="margin: 6px 0 0 0;"><a href="https://cvai.com.mx/unsubscribe" style="color: #64748b; text-decoration: underline;">Darme de baja de estos correos</a></p>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: testEmail,
      subject: `[PRUEBA] ${campaign.subject}`,
      html: fullHtml,
      templateSlug: "test-broadcast",
    });

    return { ok: true, message: `Correo de prueba enviado a ${testEmail}` };
  });

// 6. Launch / Dispatch Campaign
export const launchCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { campaignId: string; confirmDuplicate?: boolean }) => data)
  .handler(async ({ data }) => {
    const { campaignId, confirmDuplicate } = data;

    const { data: b, error } = await supabaseAdmin
      .from("email_broadcasts" as any)
      .select("*")
      .eq("id", campaignId)
      .single();

    if (error || !b) throw new Error("Campaña no encontrada.");

    let meta: any = {};
    try {
      if (b.body && b.body.startsWith("{")) meta = JSON.parse(b.body);
    } catch {}

    if (!confirmDuplicate) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: recent } = await supabaseAdmin
        .from("email_broadcasts" as any)
        .select("id, subject, created_at")
        .eq("status", "sent")
        .gte("created_at", sevenDaysAgo)
        .neq("id", campaignId)
        .limit(1);

      if (recent && recent.length > 0) {
        return {
          warning: true,
          recentCampaignSubject: recent[0].subject,
          message: `Se envió una campaña recientemente ('${recent[0].subject}'). Por favor confirma si deseas continuar.`,
        };
      }
    }

    await supabaseAdmin
      .from("email_broadcasts" as any)
      .update({ status: "sending", updated_at: new Date().toISOString() })
      .eq("id", campaignId);

    const filters: AudienceFilters = meta.filters || {};
    const audienceRes = await evaluateAudience({ data: filters });
    const recipients = audienceRes.sampleRecipients;

    await supabaseAdmin
      .from("email_broadcasts" as any)
      .update({ recipients_count: audienceRes.totalEligible })
      .eq("id", campaignId);

    let sentCount = 0;
    let failedCount = 0;
    const batchSize = 15;
    const delayMs = 300;

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (r: any) => {
          try {
            let renderedHtml = meta.bodyHtml || b.body || "";
            renderedHtml = renderedHtml
              .replace(/{{first_name}}/g, r.name.split(" ")[0])
              .replace(/{{last_name}}/g, r.name.split(" ").slice(1).join(" ") || "")
              .replace(/{{email}}/g, r.email)
              .replace(/{{plan_name}}/g, r.plan === "pro" ? "Pro" : "Gratuito")
              .replace(/{{registration_date}}/g, new Date(r.createdAt).toLocaleDateString("es-MX"))
              .replace(/{{website_name}}/g, "CVAI")
              .replace(/{{website_url}}/g, "https://cvai.com.mx");

            let headerBlock = "";
            if (meta.bannerUrl) {
              headerBlock = `<div style="text-align: center; margin-bottom: 20px;"><img src="${meta.bannerUrl}" alt="Banner" style="max-width: 100%; border-radius: 8px;" /></div>`;
            }

            let ctaBlock = "";
            if (meta.ctaText && meta.ctaUrl) {
              ctaBlock = `
                <div style="text-align: center; margin: 28px 0;">
                  <a href="${meta.ctaUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block;">
                    ${meta.ctaText}
                  </a>
                </div>
              `;
            }

            const unsubUrl = `https://cvai.com.mx/unsubscribe?email=${encodeURIComponent(r.email)}&c=${campaignId}`;

            const fullHtml = `
              <div style="background-color: #f8fafc; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                  ${headerBlock}
                  <div style="font-size: 15px; line-height: 1.6; color: #334155;">
                    ${renderedHtml}
                  </div>
                  ${ctaBlock}
                  <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6;">
                    <p style="margin: 0;">CVAI (cvai.com.mx) — Av. Insurgentes Sur, CDMX, México.</p>
                    <p style="margin: 6px 0 0 0;"><a href="${unsubUrl}" style="color: #64748b; text-decoration: underline;">Darme de baja de estos correos</a></p>
                  </div>
                </div>
              </div>
            `;

            await sendEmail({
              to: r.email,
              subject: b.subject,
              html: fullHtml,
              templateSlug: `broadcast:${campaignId}`,
            });

            sentCount++;
          } catch (err: any) {
            console.error(`Error sending broadcast to ${r.email}:`, err);
            failedCount++;
          }
        })
      );

      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    await supabaseAdmin
      .from("email_broadcasts" as any)
      .update({
        status: "sent",
        sent_count: sentCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    return {
      ok: true,
      sentCount,
      failedCount,
      message: `Campaña enviada con éxito a ${sentCount} destinatarios (${failedCount} fallos).`,
    };
  });

// 7. Delete Campaign
export const deleteCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("email_broadcasts" as any)
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// 8. Subscribers & Suppression Management
export const getSubscribersOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const suppressions = await getSuppressionList();

    const { data: profiles, error } = await supabaseAdmin
      .from("profiles" as any)
      .select("id, full_name, email, plan, created_at, dashboard_lang")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    const list = (profiles || []).map((p: any) => {
      const email = (p.email || "").toLowerCase().trim();
      const isSuppressed = suppressions.includes(email);
      return {
        id: p.id,
        email,
        name: p.full_name || "Sin nombre",
        plan: p.plan || "free",
        language: p.dashboard_lang || "es",
        createdAt: p.created_at,
        isSuppressed,
        status: isSuppressed ? "unsubscribed" : "subscribed",
      };
    });

    return {
      subscribers: list,
      totalSuppressed: suppressions.length,
      suppressionEmails: suppressions,
    };
  });

// 9. Toggle Suppression Status
export const toggleSuppression = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { email: string; suppress: boolean }) => data)
  .handler(async ({ data }) => {
    const targetEmail = data.email.toLowerCase().trim();
    const current = await getSuppressionList();

    let next: string[];
    if (data.suppress) {
      next = Array.from(new Set([...current, targetEmail]));
    } else {
      next = current.filter((e) => e !== targetEmail);
    }

    const { error } = await supabaseAdmin
      .from("system_settings" as any)
      .upsert({ key: "email_suppressions", value: next }, { onConflict: "key" });

    if (error) throw error;
    return { ok: true, isSuppressed: data.suppress };
  });

// 10. Public Unsubscribe action
export const publicUnsubscribe = createServerFn({ method: "POST" })
  .validator((data: { email: string; reason?: string }) => data)
  .handler(async ({ data }) => {
    const targetEmail = data.email.toLowerCase().trim();
    if (!targetEmail || !targetEmail.includes("@")) {
      throw new Error("Correo inválido.");
    }

    const current = await getSuppressionList();
    const next = Array.from(new Set([...current, targetEmail]));

    await supabaseAdmin
      .from("system_settings" as any)
      .upsert({ key: "email_suppressions", value: next }, { onConflict: "key" });

    // Also log in email_logs
    try {
      await supabaseAdmin.from("email_logs" as any).insert({
        recipient: targetEmail,
        template: "system:unsubscribe",
        subject: "Baja voluntaria de correos de marketing",
        status: "unsubscribed",
        error: data.reason || "Usuario solicitó baja",
      });
    } catch {}

    return { ok: true, success: true };
  });
