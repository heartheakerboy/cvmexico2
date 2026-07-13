import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

import { supabase } from "@/integrations/supabase/client";
import { getStaticCities } from "@/lib/cities-data";

async function serveSitemap(): Promise<Response> {
  const base = "https://www.cvai.com.mx";
  
  const staticPages = [
    "",
    "/auth",
    "/plantillas",
    "/precios",
    "/contacto",
    "/sobre-nosotros",
    "/ejemplos",
    "/herramientas",
    "/terminos",
    "/privacidad",
    "/software-engineer-resume-template",
    "/nurse-resume-template",
    "/teacher-resume-template",
    "/accountant-resume-template",
    "/lawyer-resume-template",
    "/architect-resume-template",
    "/project-manager-resume-template",
    "/hr-manager-resume-template",
    "/sales-executive-resume-template",
    "/graphic-designer-resume-template",
    "/ceo-resume-template",
    "/fresher-resume-template",
    "/internship-resume-template",
    "/entry-level-resume-template",
    "/mid-level-resume-template",
    "/senior-professional-resume-template",
    "/executive-resume-template",
    "/government-resume-template",
    "/freelancer-resume-template"
  ];

  let dbPages: string[] = [];
  try {
    const { data } = await supabase
      .from("seo_pages")
      .select("path")
      .eq("noindex", false);
    if (data) {
      dbPages = data.map((p) => p.path).filter((p) => p && p.startsWith("/"));
    }
  } catch (e) {
    console.error("Error fetching SEO pages for sitemap in server.ts:", e);
  }

  const cityPages = getStaticCities().map((c) => `/resume/${c.slug}`);

  const allPaths = Array.from(
    new Set([...staticPages, ...dbPages, ...cityPages])
  );

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...allPaths.map((path) => `  <url><loc>${base}${path}</loc></url>`),
    `</urlset>`,
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=18000",
    },
  });
}

async function verifyLemonSqueezySignature(
  secret: string,
  signature: string,
  payloadText: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const signatureBytes = new Uint8Array(
    signature.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );
  return await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    encoder.encode(payloadText)
  );
}

async function handleLemonSqueezyWebhook(request: Request): Promise<Response> {
  const signature = request.headers.get("x-signature") || request.headers.get("X-Signature") || "";
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";
  const bodyText = await request.text();

  if (secret) {
    const verified = await verifyLemonSqueezySignature(secret, signature, bodyText);
    if (!verified) {
      console.warn("[LemonSqueezy Webhook] Invalid signature");
      return new Response("Invalid signature", { status: 401 });
    }
  }

  let payload: any;
  try {
    payload = JSON.parse(bodyText);
  } catch (e) {
    return new Response("Invalid JSON payload", { status: 400 });
  }

  const eventName = payload.meta?.event_name;
  const customData = payload.meta?.custom_data || {};
  let userId = customData.user_id || customData.userId;
  
  const attr = payload.data?.attributes || {};
  const email = attr.user_email || attr.customer_email;

  console.log(`[LemonSqueezy Webhook] Event: ${eventName}, User ID: ${userId}, Email: ${email}`);

  // Resolve user if not provided in customData
  if (!userId && email) {
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (userProfile) {
      userId = userProfile.id;
    }
  }

  if (!userId) {
    console.error("[LemonSqueezy Webhook] User could not be identified");
    return new Response("User not found", { status: 400 });
  }

  // Handle subscription/order upgrades and demotions
  if (
    eventName === "subscription_created" ||
    eventName === "subscription_updated" ||
    eventName === "order_created"
  ) {
    const status = attr.status;
    const isUpgrade = !status || status === "active" || status === "on_trial";

    if (isUpgrade) {
      // 1. Update user profile to pro
      await supabase
        .from("profiles")
        .update({ plan: "pro" })
        .eq("id", userId);

      // 2. Log invoice
      const amount = typeof attr.total === "number" ? attr.total / 100 : (attr.price / 100 || 149);
      const currency = attr.currency || "MXN";
      const number = `LS-${payload.data?.id || Date.now()}`;
      
      const { data: existing } = await supabase
        .from("invoices")
        .select("id")
        .eq("number", number)
        .maybeSingle();

      if (!existing) {
        await supabase.from("invoices").insert({
          user_id: userId,
          number,
          concept: eventName.startsWith("subscription") ? "Suscripción Pro (LemonSqueezy)" : "Compra Pro (LemonSqueezy)",
          amount,
          currency,
          status: "pagado",
          method: attr.card_brand ? `Tarjeta (${attr.card_brand})` : "LemonSqueezy",
          period: eventName.startsWith("subscription") ? "Mensual" : "Pago único",
        });
      }
    } else if (status === "expired" || status === "unpaid") {
      // Demote to free if unpaid or expired
      await supabase
        .from("profiles")
        .update({ plan: "free" })
        .eq("id", userId);
    }
  } else if (eventName === "subscription_expired" || eventName === "subscription_unpaid") {
    // Demote to free
    await supabase
      .from("profiles")
      .update({ plan: "free" })
      .eq("id", userId);
  }

  return new Response("Webhook processed", { status: 200 });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/sitemap.xml") {
        return await serveSitemap();
      }

      if (url.pathname === "/api/lemonsqueezy-webhook" && request.method === "POST") {
        return await handleLemonSqueezyWebhook(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
