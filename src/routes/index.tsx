import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  FileText,
  Zap,
  Target,
  Download,
  Star,
  Check,
  X,
  ArrowRight,
  MousePointerClick,
  BadgeCheck,
  PenLine,
  Save,
  History,
  Mail,
  QrCode,
  Briefcase,
  Moon,
  Languages,
  BarChart3,
  Stethoscope,
  Wrench,
  Megaphone,
  TrendingUp,
  Landmark,
  GraduationCap,
  Code2,
  Building2,
  User,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useSettings } from "@/lib/settings";
import { Reveal, Stagger, staggerItem } from "@/components/landing/reveal";
import { LiveDemo } from "@/components/landing/live-demo";
import { ResumeThumb } from "@/components/resume/resume-thumb";
import { TEMPLATES } from "@/lib/resume/registry";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CVAI – AI Resume Builder for Mexico" },
      {
        name: "description",
        content:
          "Crea tu currículum profesional con inteligencia artificial. Plantillas premium y optimización ATS instantánea con CVAI (Curriculum Vitae AI) en México.",
      },
      { property: "og:title", content: "CVAI – AI Resume Builder for Mexico" },
      {
        property: "og:description",
        content: "Diseña un currículum ganador y compatible con filtros ATS en minutos usando la IA avanzada de CVAI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "CVAI – AI Resume Builder for Mexico" },
      { name: "twitter:description", content: "Crea tu currículum profesional con inteligencia artificial de CVAI." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "CVAI",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "MXN" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "5200" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "¿Es realmente gratis crear mi CV?", acceptedAnswer: { "@type": "Answer", text: "Sí, puedes crear, editar y descargar tu CV en PDF con el plan gratuito." } },
            { "@type": "Question", name: "¿Mis plantillas pasan los filtros ATS?", acceptedAnswer: { "@type": "Answer", text: "Todas nuestras plantillas están diseñadas para ser leídas correctamente por los sistemas ATS." } },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: MousePointerClick, titleKey: "home.steps.template.title", descKey: "home.steps.template.desc" },
  { icon: PenLine, titleKey: "home.steps.fill.title", descKey: "home.steps.fill.desc" },
  { icon: Sparkles, titleKey: "home.steps.ai.title", descKey: "home.steps.ai.desc" },
  { icon: Download, titleKey: "home.steps.download.title", descKey: "home.steps.download.desc" },
];

const features = [
  {
    icon: Sparkles,
    titleKey: "home.features.ai.title",
    descKey: "home.features.ai.desc",
  },
  {
    icon: Target,
    titleKey: "home.features.ats.title",
    descKey: "home.features.ats.desc",
  },
  {
    icon: ShieldCheck,
    titleKey: "home.features.mexico.title",
    descKey: "home.features.mexico.desc",
  },
  {
    icon: Zap,
    titleKey: "home.features.fast.title",
    descKey: "home.features.fast.desc",
  },
  {
    icon: FileText,
    titleKey: "home.features.templates.title",
    descKey: "home.features.templates.desc",
  },
  {
    icon: Download,
    titleKey: "home.features.export.title",
    descKey: "home.features.export.desc",
  },
];

const faqs = [
  {
    qKey: "home.faq.free.q",
    aKey: "home.faq.free.a",
  },
  {
    qKey: "home.faq.ats.q",
    aKey: "home.faq.ats.a",
  },
  {
    qKey: "home.faq.payment.q",
    aKey: "home.faq.payment.a",
  },
  {
    qKey: "home.faq.privacy.q",
    aKey: "home.faq.privacy.a",
  },
];

const aiActions = [
  "home.ai.a1", "home.ai.a2", "home.ai.a3", "home.ai.a4", "home.ai.a5", "home.ai.a6",
  "home.ai.a7", "home.ai.a8", "home.ai.a9", "home.ai.a10", "home.ai.a11",
];

const industries = [
  { icon: Stethoscope, key: "home.ind.health" },
  { icon: Wrench, key: "home.ind.eng" },
  { icon: Megaphone, key: "home.ind.marketing" },
  { icon: TrendingUp, key: "home.ind.sales" },
  { icon: Landmark, key: "home.ind.finance" },
  { icon: GraduationCap, key: "home.ind.teachers" },
  { icon: User, key: "home.ind.students" },
  { icon: Code2, key: "home.ind.it" },
  { icon: Building2, key: "home.ind.gov" },
  { icon: Briefcase, key: "home.ind.freelance" },
];

const gridFeatures = [
  { icon: Save, t: "home.grid.autosave", d: "home.grid.autosaveDesc" },
  { icon: History, t: "home.grid.versions", d: "home.grid.versionsDesc" },
  { icon: Mail, t: "home.grid.cover", d: "home.grid.coverDesc" },
  { icon: QrCode, t: "home.grid.qr", d: "home.grid.qrDesc" },
  { icon: Briefcase, t: "home.grid.jobs", d: "home.grid.jobsDesc" },
  { icon: Moon, t: "home.grid.dark", d: "home.grid.darkDesc" },
  { icon: Languages, t: "home.grid.multi", d: "home.grid.multiDesc" },
  { icon: BarChart3, t: "home.grid.analytics", d: "home.grid.analyticsDesc" },
];

const compareRows = ["home.compare.f1", "home.compare.f2", "home.compare.f3", "home.compare.f4", "home.compare.f5", "home.compare.f6"];

const testimonials = [
  { q: "home.t1.quote", n: "home.t1.name", r: "home.t1.role" },
  { q: "home.t2.quote", n: "home.t2.name", r: "home.t2.role" },
  { q: "home.t3.quote", n: "home.t3.name", r: "home.t3.role" },
];

const posts = [
  { c: "home.b1.cat", t: "home.b1.title" },
  { c: "home.b2.cat", t: "home.b2.title" },
  { c: "home.b3.cat", t: "home.b3.title" },
];

function Index() {
  const { t } = useSettings();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--color-primary)_16%,transparent),transparent)]" />
        <motion.div
          className="pointer-events-none absolute -left-20 top-24 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -right-16 top-52 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
          animate={{ y: [0, -34, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <Badge variant="secondary" className="mb-5 gap-1.5 rounded-full px-3 py-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              {t("home.hero.badge")}
            </Badge>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              {t("home.hero.titlePrefix")} <span className="text-primary">{t("home.hero.titleHighlight")}</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              {t("home.hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  {t("home.hero.primaryCta")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/plantillas">
                <Button size="lg" variant="outline">
                  {t("home.hero.secondaryCta")}
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" /> {t("home.hero.benefitCard")}
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" /> {t("home.hero.benefitLang")}
              </span>
            </div>
            <div className="mt-8 flex gap-8">
              {[
                ["home.hero.stat1", "home.hero.stat1Label"],
                ["home.hero.stat2", "home.hero.stat2Label"],
                ["home.hero.stat3", "home.hero.stat3Label"],
              ].map(([v, l]) => (
                <div key={v}>
                  <div className="text-2xl font-bold text-foreground md:text-3xl">{t(v)}</div>
                  <div className="text-xs text-muted-foreground">{t(l)}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mock CV card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <motion.div
              className="absolute -right-4 -top-4 z-10 hidden rounded-xl border border-border bg-card p-4 shadow-lg md:block"
              animate={{ y: [0, -10, 0], rotate: [3, 5, 3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BadgeCheck className="h-5 w-5 text-primary" /> {t("home.mock.atsScore")}
              </div>
            </motion.div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <div className="h-14 w-14 rounded-full bg-primary/15" />
                <div className="flex-1">
                  <div className="h-4 w-32 rounded bg-foreground/80" />
                  <div className="mt-2 h-3 w-24 rounded bg-muted-foreground/40" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-muted-foreground/25" />
                <div className="h-3 w-11/12 rounded bg-muted-foreground/25" />
                <div className="h-3 w-9/12 rounded bg-muted-foreground/25" />
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent-foreground">
                <Sparkles className="h-4 w-4 shrink-0 text-accent" />
                <span className="text-foreground/70">{t("home.mock.aiSummary")}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3">
                  <div className="h-2.5 w-16 rounded bg-primary/50" />
                  <div className="mt-2 h-2.5 w-full rounded bg-muted-foreground/20" />
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="h-2.5 w-16 rounded bg-primary/50" />
                  <div className="mt-2 h-2.5 w-full rounded bg-muted-foreground/20" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trusted bar */}
        <div className="mx-auto max-w-6xl px-4 pb-10">
          <Reveal>
            <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("home.trusted.title")}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
              {["Bimbo", "Cemex", "BBVA", "Femsa", "Softtek", "Kavak"].map((c) => (
                <span key={c} className="font-display text-lg font-bold tracking-tight text-foreground/70">
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Live demo */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 rounded-full">{t("home.demo.tag")}</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.demo.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("home.demo.subtitle")}</p>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto mt-12 max-w-4xl">
            <LiveDemo />
          </Reveal>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <h2 className="text-center text-3xl font-bold tracking-tight">{t("home.steps.title")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
              {t("home.steps.subtitle")}
            </p>
          </Reveal>
          <Stagger className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div key={s.titleKey} variants={staggerItem} className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="absolute right-0 top-0 font-display text-4xl font-bold text-primary/10">
                  0{i + 1}
                </span>
                <h3 className="text-lg font-semibold">{t(s.titleKey)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(s.descKey)}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Templates showcase */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full">{t("home.templates.tag")}</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.templates.title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("home.templates.subtitle")}</p>
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TEMPLATES.slice(0, 10).map((tpl) => (
            <motion.div key={tpl.id} variants={staggerItem}>
              <Link
                to="/plantillas"
                className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <ResumeThumb templateId={tpl.id} accent={tpl.accent} />
                  <div className="absolute left-2 top-2 flex flex-col gap-1">
                    {tpl.ats && (
                      <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        {t("home.templates.ats")}
                      </span>
                    )}
                    {tpl.premium && (
                      <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                        {t("home.templates.premium")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-semibold">{tpl.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{tpl.category}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </Stagger>
        <Reveal className="mt-10 text-center">
          <Link to="/plantillas">
            <Button variant="outline" size="lg" className="gap-2">
              {t("home.templates.viewAll")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Reveal>
      </section>

      {/* AI everywhere */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2">
          <Reveal>
            <Badge variant="secondary" className="mb-4 rounded-full">{t("home.ai.tag")}</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.ai.title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("home.ai.subtitle")}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {aiActions.map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
                  <Sparkles className="h-3.5 w-3.5 text-accent" /> {t(a)}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t("home.demo.summaryLabel")}</span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> {t("home.demo.aiBtn")}
                </span>
              </div>
              <motion.div
                className="space-y-2"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
              >
                {[10, 11, 8].map((w, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, width: 0 }, show: { opacity: 1, width: `${w * 8}%` } }}
                    transition={{ duration: 0.6 }}
                    className="h-3 rounded bg-primary/25"
                  />
                ))}
              </motion.div>
              <div className="mt-5 rounded-lg bg-accent/10 p-3 text-sm text-foreground/70">
                {t("home.demo.aiResult")}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ATS checker */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-xl">
              <div className="flex items-center gap-6">
                <div className="relative h-28 w-28 shrink-0">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                      className="text-primary"
                      strokeDasharray={264}
                      initial={{ strokeDashoffset: 264 }}
                      whileInView={{ strokeDashoffset: 264 * (1 - 0.92) }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">92</span>
                    <span className="text-[10px] text-muted-foreground">{t("home.atsChecker.score")}</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {t("home.atsChecker.grammar")}</p>
                  <div>
                    <p className="mb-1.5 text-xs text-muted-foreground">{t("home.atsChecker.missing")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Scrum", "Power BI", "Liderazgo"].map((k) => (
                        <span key={k} className="rounded bg-destructive/10 px-2 py-0.5 text-xs text-destructive">{k}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Button className="mt-6 w-full gap-2"><Sparkles className="h-4 w-4" /> {t("home.atsChecker.optimize")}</Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Badge variant="secondary" className="mb-4 rounded-full">{t("home.atsChecker.tag")}</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.atsChecker.title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("home.atsChecker.subtitle")}</p>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("home.features.title")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t("home.features.subtitle")}
          </p>
        </Reveal>
        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <motion.div
              key={f.titleKey}
              variants={staggerItem}
              className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{t(f.titleKey)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(f.descKey)}</p>
            </motion.div>
          ))}
        </Stagger>
        </div>
      </section>

      {/* Feature grid extra */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full">{t("home.grid.tag")}</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.grid.title")}</h2>
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {gridFeatures.map((f) => (
            <motion.div key={f.t} variants={staggerItem} className="rounded-2xl border border-border bg-card p-5">
              <f.icon className="mb-3 h-6 w-6 text-primary" />
              <h3 className="text-sm font-semibold">{t(f.t)}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t(f.d)}</p>
            </motion.div>
          ))}
        </Stagger>
      </section>

      {/* Industries */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 rounded-full">{t("home.industries.tag")}</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.industries.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("home.industries.subtitle")}</p>
          </Reveal>
          <Stagger className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {industries.map((ind) => (
              <motion.div
                key={ind.key}
                variants={staggerItem}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ind.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{t(ind.key)}</span>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full">{t("home.compare.tag")}</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.compare.title")}</h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-12 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="p-4 text-left font-medium"></th>
                <th className="p-4 text-center font-bold text-primary">{t("home.compare.us")}</th>
                <th className="p-4 text-center font-medium text-muted-foreground">{t("home.compare.others")}</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((r) => (
                <tr key={r} className="border-b border-border/60 last:border-0">
                  <td className="p-4">{t(r)}</td>
                  <td className="p-4 text-center"><Check className="mx-auto h-5 w-5 text-primary" /></td>
                  <td className="p-4 text-center"><X className="mx-auto h-5 w-5 text-muted-foreground/50" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 rounded-full">{t("home.testimonials.tag")}</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.testimonials.title")}</h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((tm) => (
              <motion.div key={tm.n} variants={staggerItem} className="rounded-2xl border border-border bg-card p-6">
                <Quote className="h-6 w-6 text-primary/40" />
                <p className="mt-3 text-sm text-foreground/80">{t(tm.q)}</p>
                <div className="mt-4 flex items-center gap-1 text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent" />)}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {t(tm.n).charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t(tm.n)}</p>
                    <p className="text-xs text-muted-foreground">{t(tm.r)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full">{t("home.pricing.tag")}</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.pricing.title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("home.pricing.subtitle")}</p>
        </Reveal>
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
          <motion.div variants={staggerItem} className="flex flex-col rounded-3xl border border-border bg-card p-8">
            <h3 className="text-lg font-bold">{t("home.pricing.free")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("home.pricing.freeDesc")}</p>
            <div className="mt-5 text-4xl font-bold">$0</div>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {["home.pricing.freeF1", "home.pricing.freeF2", "home.pricing.freeF3"].map((f) => (
                <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {t(f)}</li>
              ))}
            </ul>
            <Link to="/auth" className="mt-8"><Button variant="outline" className="w-full">{t("home.pricing.ctaFree")}</Button></Link>
          </motion.div>
          <motion.div variants={staggerItem} className="relative flex flex-col rounded-3xl border-2 border-primary bg-card p-8 shadow-xl">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              {t("home.pricing.popular")}
            </span>
            <h3 className="text-lg font-bold">{t("home.pricing.pro")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("home.pricing.proDesc")}</p>
            <div className="mt-5 text-4xl font-bold">$149 <span className="text-base font-normal text-muted-foreground">{t("home.pricing.month")}</span></div>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {["home.pricing.proF1", "home.pricing.proF2", "home.pricing.proF3", "home.pricing.proF4"].map((f) => (
                <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {t(f)}</li>
              ))}
            </ul>
            <Link to="/auth" className="mt-8"><Button className="w-full">{t("home.pricing.ctaPro")}</Button></Link>
          </motion.div>
          <motion.div variants={staggerItem} className="flex flex-col rounded-3xl border border-border bg-card p-8">
            <h3 className="text-lg font-bold">{t("home.pricing.ent")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("home.pricing.entDesc")}</p>
            <div className="mt-5 text-4xl font-bold">{t("home.pricing.custom")}</div>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {["home.pricing.entF1", "home.pricing.entF2", "home.pricing.entF3"].map((f) => (
                <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {t(f)}</li>
              ))}
            </ul>
            <Link to="/precios" className="mt-8"><Button variant="outline" className="w-full">{t("home.pricing.ctaEnt")}</Button></Link>
          </motion.div>
        </Stagger>
      </section>

      {/* Blog preview */}
      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 rounded-full">{t("home.blog.tag")}</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.blog.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("home.blog.subtitle")}</p>
          </Reveal>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <motion.div key={p.t} variants={staggerItem}>
                <Link to="/blog" className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary/15 to-accent/15" />
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">{t(p.c)}</span>
                    <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary">{t(p.t)}</h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground">
                      {t("home.blog.readMore")} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="pt-20" />
        <div className="relative overflow-hidden rounded-3xl bg-sidebar px-6 py-16 text-center text-sidebar-foreground md:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,color-mix(in_oklch,var(--color-primary)_30%,transparent),transparent)]" />
          <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            {t("home.cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sidebar-foreground/70">
            {t("home.cta.subtitle")}
          </p>
          <Link to="/auth" className="mt-8 inline-block">
            <Button size="lg" className="gap-2">
              {t("home.cta.button")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-24">
        <Reveal>
          <h2 className="text-center text-3xl font-bold tracking-tight">{t("home.faq.title")}</h2>
        </Reveal>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{t(f.qKey)}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{t(f.aKey)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <SiteFooter />
    </div>
  );
}

// Rebrand trigger commit
