import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";
import { getMetaTranslation } from "@/lib/i18n/config";

export const Route = createFileRoute("/ejemplos")({
  head: () => ({
    meta: [
      { title: getMetaTranslation("examples.metaTitle") },
      {
        name: "description",
        content: getMetaTranslation("examples.metaDesc"),
      },
      { property: "og:url", content: "/ejemplos" },
    ],
    links: [{ rel: "canonical", href: "/ejemplos" }],
  }),
  component: EjemplosPage,
});

const roles = [
  "Contador",
  "Desarrollador de software",
  "Ejecutivo de ventas",
  "Enfermería",
  "Ingeniero industrial",
  "Docente",
  "Recepcionista",
  "Chofer / repartidor",
  "Practicante / becario",
  "Recién egresado",
  "Asistente administrativo",
  "Diseñador gráfico",
] as const;

function EjemplosPage() {
  const { t } = useSettings();

  return (
    <PageShell
      title={t("examples.title")}
      subtitle={t("examples.subtitle")}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((r) => (
          <div
            key={r}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div>
              <h3 className="font-semibold">{t("examples.cvTitle", { role: t(`examples.role.${r}`) })}</h3>
              <p className="text-xs text-muted-foreground">{t("examples.cvDesc")}</p>
            </div>
            <Link to="/auth">
              <Button size="sm" variant="outline">
                {t("examples.use")}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </PageShell>
  );
}