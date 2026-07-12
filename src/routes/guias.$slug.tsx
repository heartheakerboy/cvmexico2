import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";
import { getMetaTranslation } from "@/lib/i18n/config";

const guideConfigs: Record<string, { sectionsCount: number }> = {
  "como-hacer-un-cv": { sectionsCount: 5 },
  "cv-sin-experiencia": { sectionsCount: 3 },
  "cv-ats": { sectionsCount: 3 },
};

export const Route = createFileRoute("/guias/$slug")({
  loader: ({ params }) => {
    const config = guideConfigs[params.slug];
    if (!config) throw notFound();
    return { slug: params.slug, config };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: getMetaTranslation("guides.metaTitleNotFound") }, { name: "robots", content: "noindex" }] };
    const title = getMetaTranslation(`guides.${params.slug}.title`);
    const intro = getMetaTranslation(`guides.${params.slug}.intro`);
    return {
      meta: [
        { title: `${title}${getMetaTranslation("guides.suffix")}` },
        { name: "description", content: intro },
        { property: "og:title", content: title },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/guias/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/guias/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            inLanguage: "es-MX",
          }),
        },
      ],
    };
  },
  notFoundComponent: GuideNotFound,
  errorComponent: GuideNotFound,
  component: GuidePage,
});

function GuidePage() {
  const { slug, config } = Route.useLoaderData();
  const { t } = useSettings();

  const sections = Array.from({ length: config.sectionsCount }).map((_, i) => ({
    h: t(`guides.${slug}.s${i + 1}.h`),
    p: t(`guides.${slug}.s${i + 1}.p`),
  }));

  return (
    <PageShell title={t(`guides.${slug}.title`)} subtitle={t(`guides.${slug}.intro`)}>
      <article className="mx-auto max-w-3xl">
        {sections.map((s) => (
          <section key={s.h} className="mb-8">
            <h2 className="text-xl font-semibold">{s.h}</h2>
            <p className="mt-2 text-muted-foreground">{s.p}</p>
          </section>
        ))}
        <div className="mt-10 rounded-2xl bg-secondary/50 p-8 text-center">
          <h2 className="text-xl font-bold">{t("guides.articleCtaTitle")}</h2>
          <p className="mt-2 text-muted-foreground">{t("guides.articleCtaDesc")}</p>
          <Link to="/auth" className="mt-4 inline-block">
            <Button>{t("guides.articleCtaButton")}</Button>
          </Link>
        </div>
      </article>
    </PageShell>
  );
}

function GuideNotFound() {
  const { t } = useSettings();

  return (
    <PageShell title={t("guides.notFoundTitle")} subtitle={t("guides.notFoundDesc")}>
      <Link to="/blog">
        <Button variant="outline">{t("guides.notFoundBtn")}</Button>
      </Link>
    </PageShell>
  );
}