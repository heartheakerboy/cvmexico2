import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";
import { getMetaTranslation } from "@/lib/i18n/config";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: getMetaTranslation("contact.metaTitle") },
      { name: "description", content: getMetaTranslation("contact.metaDesc") },
      { property: "og:url", content: "/contacto" },
    ],
    links: [{ rel: "canonical", href: "/contacto" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useSettings();

  return (
    <PageShell title={t("contact.title")} subtitle={t("contact.subtitle")}>
      <form
        className="mx-auto max-w-xl space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="space-y-1.5">
          <Label htmlFor="nombre">{t("contact.nameLabel")}</Label>
          <Input id="nombre" placeholder={t("contact.namePlaceholder")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="correo">{t("contact.emailLabel")}</Label>
          <Input id="correo" type="email" placeholder={t("contact.emailPlaceholder")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mensaje">{t("contact.messageLabel")}</Label>
          <Textarea id="mensaje" rows={5} placeholder={t("contact.messagePlaceholder")} />
        </div>
        <Button type="submit">{t("contact.submit")}</Button>
      </form>
    </PageShell>
  );
}