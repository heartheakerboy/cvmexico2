import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";
import { getMetaTranslation } from "@/lib/i18n/config";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: getMetaTranslation("blog.metaTitle") },
      {
        name: "description",
        content: getMetaTranslation("blog.metaDesc"),
      },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { t } = useSettings();

  return (
    <PageShell title={t("blog.title")} subtitle={t("blog.subtitle")}>
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
        {t("blog.empty")}
        <a href="/guias/como-hacer-un-cv" className="text-primary hover:underline">
          {t("blog.guidesLink")}
        </a>
        .
      </div>
    </PageShell>
  );
}