import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";
import { TEMPLATES } from "@/lib/resume/registry";
import { ResumeThumb } from "@/components/resume/resume-thumb";
import { getTemplateUrl } from "@/lib/resume/template-routes";

export const Route = createFileRoute("/plantillas/")({
  head: () => ({
    meta: [
      { title: "Plantillas de CV ATS Gratis | CVAI" },
      {
        name: "description",
        content:
          "Plantillas de currículum profesionales y compatibles con ATS, optimizadas para el mercado laboral mexicano. Elige la tuya y empieza gratis.",
      },
      { property: "og:title", content: "Plantillas de CV ATS Gratis | CVAI" },
      { property: "og:url", content: "https://www.cvai.com.mx/plantillas" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/plantillas" }],
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
      title={t("plantillasPage.title") || "Plantillas de CV profesionales"}
      subtitle={t("plantillasPage.subtitle") || "Elige una plantilla compatible con ATS y adáptala a tu experiencia laboral."}
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              active === f
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/40"
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
          const targetUrl = getTemplateUrl(tpl.id);

          return (
            <div
              key={tpl.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg flex flex-col justify-between"
            >
              <Link to={targetUrl} className="relative aspect-[3/4] overflow-hidden bg-secondary/10 p-2 flex-1 block">
                <div className="h-full overflow-hidden rounded-lg border bg-white shadow-sm transition-transform duration-200 group-hover:scale-[1.02]">
                  <ResumeThumb templateId={tpl.id} accent={tpl.accent} />
                </div>
                {tpl.premium ? (
                  <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground">{t("plantillasPage.pro") || "Pro"}</Badge>
                ) : (
                  <Badge variant="secondary" className="absolute right-3 top-3 gap-1">
                    <Check className="h-3 w-3" /> {t("plantillasPage.free") || "Gratis"}
                  </Badge>
                )}
              </Link>
              <div className="flex items-center justify-between p-4 bg-card border-t shrink-0">
                <div className="min-w-0 flex-1 mr-2">
                  <Link to={targetUrl}>
                    <h3 className="font-semibold truncate text-sm hover:text-primary transition-colors" title={displayName}>
                      {displayName}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground">{displayCat}</p>
                </div>
                <Link to={targetUrl}>
                  <Button size="sm" variant="outline" className="gap-1 text-xs">
                    Ver plantilla <ArrowRight className="h-3 w-3" />
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
