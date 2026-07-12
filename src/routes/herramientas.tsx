import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Target, FileText, Languages, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";
import { getMetaTranslation } from "@/lib/i18n/config";

export const Route = createFileRoute("/herramientas")({
  head: () => ({
    meta: [
      { title: getMetaTranslation("publicTools.metaTitle") },
      {
        name: "description",
        content: getMetaTranslation("publicTools.metaDesc"),
      },
      { property: "og:url", content: "/herramientas" },
    ],
    links: [{ rel: "canonical", href: "/herramientas" }],
  }),
  component: HerramientasPage,
});

const tools = [
  { icon: Target, titleKey: "publicTools.ats.title", descKey: "publicTools.ats.desc" },
  { icon: Sparkles, titleKey: "publicTools.resumen.title", descKey: "publicTools.resumen.desc" },
  { icon: FileText, titleKey: "publicTools.logros.title", descKey: "publicTools.logros.desc" },
  { icon: Languages, titleKey: "publicTools.traductor.title", descKey: "publicTools.traductor.desc" },
  { icon: Mail, titleKey: "publicTools.carta.title", descKey: "publicTools.carta.desc" },
];

function HerramientasPage() {
  const { t } = useSettings();

  return (
    <PageShell
      title={t("publicTools.title")}
      subtitle={t("publicTools.subtitle")}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tItem) => (
          <div key={tItem.titleKey} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <tItem.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{t(tItem.titleKey)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(tItem.descKey)}</p>
            <Link to="/auth" className="mt-4 inline-block">
              <Button size="sm" variant="outline">
                {t("publicTools.tryFree")}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </PageShell>
  );
}