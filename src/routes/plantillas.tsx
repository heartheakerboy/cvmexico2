import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";
import { TEMPLATES } from "@/lib/resume/registry";
import { ResumeThumb } from "@/components/resume/resume-thumb";

export const Route = createFileRoute("/plantillas")({
  head: () => ({
    meta: [
      { title: "Plantillas de CV ATS Gratis | CVMéxico" },
      {
        name: "description",
        content:
          "Plantillas de currículum profesionales y compatibles con ATS, optimizadas para el mercado laboral mexicano. Elige la tuya y empieza gratis.",
      },
      { property: "og:title", content: "Plantillas de CV ATS Gratis | CVMéxico" },
      { property: "og:url", content: "/plantillas" },
    ],
    links: [{ rel: "canonical", href: "/plantillas" }],
  }),
  component: PlantillasPage,
});

const filters = ["Todas", "Estudiante", "Profesional", "Ejecutivo", "Creativo", "Técnico", "ATS"] as const;

function PlantillasPage() {
  const { t } = useSettings();
  const [active, setActive] = useState<(typeof filters)[number]>("Todas");
  
  const visible = TEMPLATES.filter((tpl) => {
    if (active === "Todas") return true;
    return tpl.category === active;
  });

  return (
    <PageShell
      title={t("plantillasPage.title")}
      subtitle={t("plantillasPage.subtitle")}
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              active === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {t(`plantillasPage.filter.${f}`) || f}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((tpl) => {
          const displayName = t(`plantillasPage.tpl.${tpl.id}`) || tpl.name;
          const displayCat = t(`plantillasPage.filter.${tpl.category}`) || tpl.category;

          return (
            <div
              key={tpl.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary/10 p-2 flex-1">
                <div className="h-full overflow-hidden rounded-lg border bg-white shadow-sm">
                  <ResumeThumb templateId={tpl.id} accent={tpl.accent} />
                </div>
                {tpl.premium ? (
                  <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground">{t("plantillasPage.pro")}</Badge>
                ) : (
                  <Badge variant="secondary" className="absolute right-3 top-3 gap-1">
                    <Check className="h-3 w-3" /> {t("plantillasPage.free")}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between p-4 bg-card border-t shrink-0">
                <div className="min-w-0 flex-1 mr-2">
                  <h3 className="font-semibold truncate text-sm" title={displayName}>{displayName}</h3>
                  <p className="text-xs text-muted-foreground">{displayCat}</p>
                </div>
                <Link to="/auth" search={{ template: tpl.id }}>
                  <Button size="sm" variant="outline">
                    {t("plantillasPage.use")}
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}