import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useSettings } from "@/lib/settings";
import { useCompanyLegalConfig } from "@/lib/legal-config";
import {
  FileText, Shield, Scale, HelpCircle, Mail, Printer, ChevronRight,
  Sparkles, CreditCard, Cookie, AlertCircle, CheckCircle2, Info, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type TocSection = {
  id: string;
  title: string;
};

export type LegalPageLayoutProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  lastUpdated?: string;
  sections?: TocSection[];
  children: ReactNode;
};

export function LegalPageLayout({
  title,
  subtitle,
  badge,
  lastUpdated,
  sections = [],
  children,
}: LegalPageLayoutProps) {
  const { t, lang } = useSettings();
  const legalConfig = useCompanyLegalConfig();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (!sections.length) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop - 140 <= scrollY) {
          setActiveSection(sections[i].id);
          return;
        }
      }
      if (sections[0]) setActiveSection(sections[0].id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const navLinks = [
    { to: "/sobre-nosotros", label: lang === "en" ? "About Us" : "Sobre Nosotros", icon: Info },
    { to: "/contacto", label: lang === "en" ? "Contact Us" : "Contáctanos", icon: Mail },
    { to: "/privacidad", label: lang === "en" ? "Privacy Policy" : "Aviso de Privacidad", icon: Shield },
    { to: "/terminos", label: lang === "en" ? "Terms & Conditions" : "Términos y Condiciones", icon: Scale },
    { to: "/aviso-legal", label: lang === "en" ? "Legal Disclaimer" : "Aviso Legal (Disclaimer)", icon: AlertCircle },
    { to: "/reembolso", label: lang === "en" ? "Refund Policy" : "Política de Reembolso", icon: CreditCard },
    { to: "/cookies", label: lang === "en" ? "Cookie Policy" : "Política de Cookies", icon: Cookie },
    { to: "/transparencia-ia", label: lang === "en" ? "AI Transparency" : "Transparencia de IA", icon: Sparkles },
    { to: "/facturacion-pagos", label: lang === "en" ? "Billing & Payments" : "Facturación y Pagos", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col print:bg-white print:text-black">
      <div className="print:hidden">
        <SiteHeader />
      </div>

      {/* Hero Header */}
      <section className="border-b border-border/60 bg-secondary/30 print:border-none print:bg-transparent">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 print:hidden">
            <Link to="/" className="hover:text-primary transition-colors">
              {lang === "en" ? "Home" : "Inicio"}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="hover:text-primary transition-colors">
              {lang === "en" ? "Legal & Trust" : "Legal y Confianza"}
            </span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate">{title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge variant="outline" className="px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
              {badge || (lang === "en" ? "Official Policy" : "Política Oficial")}
            </Badge>
            {lastUpdated && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span>{lang === "en" ? "Last updated:" : "Última actualización:"}</span>
                <strong className="font-medium text-foreground">{lastUpdated}</strong>
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-display text-foreground">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-3 max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Quick print and action row */}
          <div className="mt-6 flex flex-wrap items-center gap-3 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-2 text-xs border-border/80 hover:bg-secondary/60"
            >
              <Printer className="h-3.5 w-3.5" />
              {lang === "en" ? "Print / Save PDF" : "Imprimir / Guardar PDF"}
            </Button>
            <Link to="/contacto">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <Mail className="h-3.5 w-3.5" />
                {lang === "en" ? "Legal or Privacy Inquiries" : "¿Dudas legales o de privacidad?"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
          
          {/* Desktop Left Sticky Navigation */}
          <aside className="hidden lg:block space-y-6 sticky top-20 print:hidden">
            {sections.length > 0 && (
              <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-4 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
                  {lang === "en" ? "On this page" : "En esta página"}
                </h3>
                <nav className="space-y-1">
                  {sections.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className={`block text-xs py-1.5 px-2.5 rounded-lg transition-colors leading-snug ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                        }`}
                      >
                        {sec.title}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Quick links to all legal pages */}
            <div className="rounded-2xl border border-border/80 bg-card/40 p-4 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
                {lang === "en" ? "Legal & Company Navigation" : "Centro Legal y Empresa"}
              </h3>
              <nav className="space-y-1">
                {navLinks.map((item) => {
                  const isCurrent = location.pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2 text-xs py-1.5 px-2.5 rounded-lg transition-colors ${
                        isCurrent
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Support mini card */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs space-y-2">
              <p className="font-semibold text-foreground">
                {lang === "en" ? "Need official assistance?" : "¿Necesitas asistencia oficial?"}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {lang === "en"
                  ? "Our legal and support team is available to help."
                  : "Nuestro equipo legal y de atención al usuario está a tu disposición."}
              </p>
              <a
                href={`mailto:${legalConfig.supportEmail}`}
                className="inline-flex items-center gap-1 text-primary font-medium hover:underline pt-1"
              >
                <span>{legalConfig.supportEmail}</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </aside>

          {/* Main Article Content */}
          <main className="min-w-0 max-w-full">
            {/* Mobile Table of Contents Accordion */}
            {sections.length > 0 && (
              <div className="lg:hidden mb-8 rounded-xl border border-border bg-card p-4 print:hidden">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-sm text-foreground">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {lang === "en" ? "Table of Contents" : "Tabla de Contenidos"}
                    </span>
                    <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <nav className="mt-3 pt-3 border-t border-border space-y-1.5">
                    {sections.map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className="block text-xs text-muted-foreground hover:text-primary py-1"
                      >
                        {sec.title}
                      </a>
                    ))}
                  </nav>
                </details>
              </div>
            )}

            {/* Content Body */}
            <article className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-8">
              {children}
            </article>

            {/* Independent Platform Disclaimer Notice at the bottom of all legal pages */}
            <div className="mt-12 rounded-2xl border border-border/80 bg-secondary/30 p-5 text-xs text-muted-foreground space-y-2 print:border-black">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>
                  {lang === "en" ? "Notice of Independent Platform" : "Aviso de Plataforma Independiente"}
                </span>
              </div>
              <p className="leading-relaxed">
                {lang === "en"
                  ? `${legalConfig.brandName} (${legalConfig.companyName}) is an independent career technology and resume optimization platform designed for job seekers in Mexico and Latin America. Unless explicitly stated, CVAI does not claim or imply affiliation, partnership, sponsorship, or endorsement by any employer, government body, public agency, university, or external recruiting organization.`
                  : `${legalConfig.brandName} (${legalConfig.companyName}) es una plataforma tecnológica y de optimización curricular independiente diseñada para profesionistas en México y Latinoamérica. A menos que se especifique por escrito, CVAI no reclama ni sugiere afiliación, asociación, patrocinio ni respaldo de ningún empleador, secretaría de estado, institución gubernamental, universidad o bolsa de trabajo externa.`}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 text-[11px]">
                <span>{legalConfig.companyName} • {legalConfig.websiteUrl}</span>
                <span>{legalConfig.address}, {legalConfig.country}</span>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className="print:hidden">
        <SiteFooter />
      </div>
    </div>
  );
}
