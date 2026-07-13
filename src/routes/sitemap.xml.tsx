import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getStaticCities } from "@/lib/cities-data";

export const Route = createFileRoute("/sitemap/xml")({
  loader: async () => {
    const base = "https://www.cvai.com.mx";
    
    // 1. Static Pages
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
      // Professional resume template landing pages (static routes)
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

    // 2. Fetch SEO pages from Database if any exist (e.g. blog posts, custom pages)
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
      console.error("Error fetching SEO pages for sitemap:", e);
    }

    // 3. Add localized city pages
    const cityPages = getStaticCities().map((c) => `/resume/${c.slug}`);

    // Combine and deduplicate all paths
    const allPaths = Array.from(
      new Set([...staticPages, ...dbPages, ...cityPages])
    );

    // Build sitemap XML content
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
  },
  component: () => null,
});
