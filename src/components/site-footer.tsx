import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { useSettings } from "@/lib/settings";

const columns = [
  {
    titleKey: "site.footer.product",
    links: [
      { to: "/plantillas", labelKey: "site.nav.templates" },
      { to: "/ats-checker", labelKey: "site.footer.atsChecker" },
      { to: "/curriculum-vitae", labelKey: "site.footer.cvMexico" },
      { to: "/ejemplos", labelKey: "site.footer.cvExamples" },
      { to: "/precios", labelKey: "site.nav.pricing" },
      { to: "/herramientas", labelKey: "site.footer.freeTools" },
      { to: "/blog", labelKey: "site.footer.blog" },
    ],
  },
  {
    titleKey: "site.footer.trust",
    links: [
      { to: "/sobre-nosotros", labelKey: "site.footer.about" },
      { to: "/contacto", labelKey: "site.footer.contact" },
      { to: "/transparencia-ia", labelKey: "site.footer.aiTransparency" },
      { to: "/facturacion-pagos", labelKey: "site.footer.billing" },
    ],
  },
  {
    titleKey: "site.footer.legal",
    links: [
      { to: "/privacidad", labelKey: "site.footer.privacy" },
      { to: "/terminos", labelKey: "site.footer.terms" },
      { to: "/aviso-legal", labelKey: "site.footer.disclaimer" },
      { to: "/reembolso", labelKey: "site.footer.refunds" },
      { to: "/cookies", labelKey: "site.footer.cookies" },
    ],
  },
] as const;

export function SiteFooter() {
  const { t } = useSettings();

  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex flex-col gap-0.5 font-display">
            <span className="text-xl font-bold tracking-tight">
              CV<span className="text-primary">AI</span>
            </span>
            <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-semibold">
              Curriculum Vitae AI
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {t("site.footer.description")}
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.titleKey}>
            <h4 className="font-display text-sm font-semibold text-foreground">{t(col.titleKey)}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.labelKey}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground">
          {t("site.footer.copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}