import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/db/client";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Loader2, Scale } from "lucide-react";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/legal/$slug")({
  head: ({ params }) => ({
    links: [
      { rel: "canonical", href: `https://www.cvai.com.mx/legal/${params.slug}` },
    ],
  }),
  component: LegalPage,
});

type PageData = {
  title: string;
  subtitle: string | null;
  content: string;
};

function LegalPage() {
  const { slug } = Route.useParams();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useSettings();

  useEffect(() => {
    async function fetchPage() {
      try {
        const { data: page, error } = await (supabase as any)
          .from("legal_pages")
          .select("title, subtitle, content")
          .eq("slug", slug)
          .eq("published", true)
          .maybeSingle();

        if (!error && page) {
          setData(page);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Error loading legal page:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <PageShell title={t("legal.loading")} subtitle="">
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </PageShell>
    );
  }

  if (!data) {
    return (
      <PageShell title={t("legal.notFound.title")} subtitle={t("legal.notFound.desc")}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Scale className="mb-4 h-12 w-12 text-muted-foreground opacity-40" />
          <Link to="/">
            <Button variant="outline">{t("legal.notFound.btn")}</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title={data.title} subtitle={data.subtitle || ""}>
      <div className="mx-auto max-w-3xl space-y-4 text-muted-foreground whitespace-pre-wrap leading-relaxed">
        {data.content}
      </div>
    </PageShell>
  );
}
