import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useSettings } from "@/lib/settings";
import { getMetaTranslation } from "@/lib/i18n/config";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: getMetaTranslation("legal.metaTitlePrivacy") },
      { name: "description", content: getMetaTranslation("legal.metaDescPrivacy") },
      { property: "og:url", content: "/privacidad" },
    ],
    links: [{ rel: "canonical", href: "/privacidad" }],
  }),
  component: PrivacidadComponent,
});

function PrivacidadComponent() {
  const { t } = useSettings();
  const [data, setData] = useState<{ title: string; subtitle: string | null; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback text if DB query fails or page is not seeded
  const fallback = {
    title: t("legal.privacyTitle"),
    subtitle: t("legal.privacySubtitle"),
    content: t("legal.privacyContent")
  };

  useEffect(() => {
    async function fetchPage() {
      try {
        const { data: page, error } = await (supabase as any)
          .from("legal_pages")
          .select("title, subtitle, content")
          .eq("slug", "privacidad")
          .eq("published", true)
          .maybeSingle();

        if (!error && page) {
          setData(page);
        } else {
          setData(fallback);
        }
      } catch (err) {
        console.warn("Could not load privacidad page from database, using fallback", err);
        setData(fallback);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, []);

  if (loading) {
    return (
      <PageShell title={t("legal.loading")} subtitle="">
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </PageShell>
    );
  }

  const pageData = data || fallback;

  return (
    <PageShell title={pageData.title} subtitle={pageData.subtitle || ""}>
      <div className="mx-auto max-w-3xl space-y-4 text-muted-foreground whitespace-pre-wrap leading-relaxed">
        {pageData.content}
      </div>
    </PageShell>
  );
}