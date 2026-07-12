import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, FileText, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useSettings } from "@/lib/settings";

const navLinks = [
  { to: "/plantillas", labelKey: "site.nav.templates" },
  { to: "/ejemplos", labelKey: "site.nav.examples" },
  { to: "/precios", labelKey: "site.nav.pricing" },
  { to: "/blog", labelKey: "site.nav.guides" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const { t } = useSettings();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-1.5 font-display text-xl font-bold tracking-tight">
          CV<span className="text-primary">AI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {t(l.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {loading ? null : isAuthenticated ? (
            <Link to="/panel">
              <Button size="sm" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                {t("site.header.dashboard")}
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  {t("site.header.signIn")}
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">{t("site.header.createFree")}</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={t("site.header.openMenu")}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <div className="pb-2">
              <LanguageSwitcher variant="outline" showLabel />
            </div>
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                {t(l.labelKey)}
              </Link>
            ))}
            <Link to={isAuthenticated ? "/panel" : "/auth"} onClick={() => setOpen(false)}>
              <Button className="mt-2 w-full">
                {isAuthenticated ? t("site.header.dashboard") : t("site.header.createFree")}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}