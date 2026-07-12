import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";
import { getMetaTranslation } from "@/lib/i18n/config";

export const Route = createFileRoute("/sobre-nosotros")({
  head: () => ({
    meta: [
      { title: getMetaTranslation("about.metaTitle") },
      {
        name: "description",
        content: getMetaTranslation("about.metaDesc"),
      },
      { property: "og:url", content: "/sobre-nosotros" },
    ],
    links: [{ rel: "canonical", href: "/sobre-nosotros" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useSettings();

  return (
    <PageShell title={t("about.title")} subtitle={t("about.subtitle")}>
      <div className="mx-auto max-w-3xl space-y-6 text-muted-foreground">
        <p>{t("about.p1")}</p>
        <p>{t("about.p2")}</p>
      </div>
    </PageShell>
  );
}