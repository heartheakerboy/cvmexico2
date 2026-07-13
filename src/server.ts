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

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/sitemap.xml") {
        return await serveSitemap();
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
