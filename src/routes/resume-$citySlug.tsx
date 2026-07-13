import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ArrowRight,
  Sparkles,
  MapPin,
  Building2,
  GraduationCap,
  DollarSign,
  HelpCircle,
  FileText,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { ResumePaper } from "@/components/resume/resume-paper";
import { makeDefaultDesign, defaultLayout } from "@/lib/resume/types";
import { getStaticCityBySlug, getStaticCities, type City } from "@/lib/cities-data";
import { localizeResumeDoc } from "@/lib/cities-helper";
import { softwareEngineerSample } from "@/lib/resume/industry-samples";

export const Route = createFileRoute("/resume-$citySlug")({
  head: ({ params }) => {
    const city = getStaticCityBySlug(params.citySlug);
    const title = city ? city.seoTitle : "Plantillas de Currículum por Ciudad | CVAI";
    const desc = city ? city.seoDescription : "Diseña tu currículum optimizado para las principales ciudades de México. Plantillas ATS-friendly con sugerencias de IA locales.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `https://www.cvai.com.mx/resume-${params.citySlug}` },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc }
      ],
      links: [{ rel: "canonical", href: `https://www.cvai.com.mx/resume-${params.citySlug}` }]
    };
  },
  component: CityLandingPage,
});

function CityLandingPage() {
  const { citySlug } = Route.useParams();
  const navigate = useNavigate();
  const [dbCity, setDbCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from Supabase, fallback to static
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("cities")
          .select("*")
          .eq("slug", citySlug)
          .maybeSingle();

        if (data && !error) {
          setDbCity(data as unknown as City);
        } else {
          setDbCity(null);
        }
      } catch (err) {
        console.error("Error loading city from Supabase:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [citySlug]);

  const staticCity = getStaticCityBySlug(citySlug);
  const city = dbCity || staticCity;

  // Render a nice 404/redirect if the city does not exist
  useEffect(() => {
    if (!loading && !city) {
      toast.error("Ciudad no encontrada");
      navigate({ to: "/plantillas" });
    }
  }, [city, loading, navigate]);

  const activeCities = getStaticCities().filter((c) => c.slug !== citySlug);

  const design = makeDefaultDesign("#2563eb");

  const localizedSample = useMemo(() => {
    if (!city) return softwareEngineerSample;
    return localizeResumeDoc(softwareEngineerSample, city);
  }, [city]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!city) return null;

  // JSON-LD Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `Plantilla de Currículum para ${city.name}`,
    "description": `Diseña un CV optimizado y pre-localizado para ${city.name}, México. Formato ATS-friendly con ejemplos de empresas locales.`,
    "image": "https://www.cvai.com.mx/og-image.png",
    "brand": {
      "@type": "Brand",
      "name": "CVAI"
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "MXN",
      "availability": "https://schema.org/InStock"
    }
  };

  // JSON-LD FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": city.faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SiteHeader />

      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-6xl px-4 pt-6 text-xs text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-foreground">Inicio</Link>
        <span>/</span>
        <Link to="/plantillas" className="hover:text-foreground">Plantillas</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Currículum en {city.name}</span>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-16 grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <MapPin className="h-3 w-3" />
            Mercado Laboral de {city.name}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-foreground">
            Plantillas de Currículum para <span className="text-primary">{city.name}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Diseña un currículum moderno y compatible con ATS adaptado específicamente para {city.name}. Nuestra IA localiza automáticamente tus datos de universidades, empresas importantes de la región y formatos locales para impresionar a los reclutadores.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/auth" search={{ city: city.slug }}>
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-none">
                Crear CV en {city.name} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#templates-section">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explorar Plantillas
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Ejemplos locales en {city.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Optimización ATS instantánea</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>100% Personalizable con IA</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Exportar a PDF y Word</span>
            </div>
          </div>
        </div>

        {/* Localized Resume Preview */}
        <div className="flex justify-center md:justify-end">
          <div className="relative group w-[340px] md:w-[400px] aspect-[1/1.414] rounded-2xl border bg-card p-2 shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center bg-gradient-to-t from-background/90 via-background/60 to-transparent p-6 pt-20">
              <div className="rounded-xl border bg-card/90 px-4 py-2 text-xs font-semibold shadow-md flex items-center gap-1.5 backdrop-blur-sm text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                Ejemplo adaptado a {city.name}
              </div>
            </div>
            {/* Scaled resume */}
            <div className="w-[794px] h-[1123px] transform scale-[0.41] md:scale-[0.48] origin-top-left pointer-events-none rounded bg-white">
              <ResumePaper templateId="minimal-ats-elite" doc={localizedSample} design={design} layout={defaultLayout} />
            </div>
          </div>
        </div>
      </section>

      {/* Salary & Job Market Stats */}
      <section className="bg-secondary/20 border-y py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-[1fr_1.1fr] gap-12">
          {/* Market Insights */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Mercado Laboral en {city.name}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {city.name} cuenta con un ecosistema laboral único. Destacar frente a las empresas locales requiere adaptar tu enfoque a las industrias y prácticas de reclutamiento más valoradas en la región.
            </p>

            <div className="space-y-4">
              <div className="bg-card border p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  Industrias más populares
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {city.industries.map((ind, i) => (
                    <span key={i} className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-medium text-muted-foreground border">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-card border p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Sectores de alta contratación
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {city.hiringSectors.map((sector, i) => (
                    <span key={i} className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-medium text-muted-foreground border">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Average Salary Information */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-bold text-lg text-foreground">Sueldos promedio en {city.name}</h3>
                <p className="text-xs text-muted-foreground">Datos estimados para negociación salarial en la región</p>
              </div>
              <DollarSign className="h-5 w-5 text-primary" />
            </div>

            <div className="divide-y text-sm">
              {Object.entries(city.salaryInfo).map(([profession, sal], i) => (
                <div key={i} className="flex justify-between py-3">
                  <span className="font-medium text-muted-foreground">{profession}</span>
                  <span className="font-semibold text-foreground">
                    ${(sal.min / 1000).toFixed(0)}k – ${(sal.max / 1000).toFixed(0)}k {sal.currency}/mes
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-primary/5 border border-primary/10 p-3.5 text-xs text-muted-foreground flex gap-2">
              <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                Tip: Al negociar tu sueldo en {city.name}, investiga las prestaciones superiores a la ley locales. Las empresas grandes suelen ofrecer vales de despensa, fondo de ahorro y seguro de gastos médicos mayores.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Local Universities & Companies */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20 grid sm:grid-cols-2 gap-8">
        <div className="bg-card border p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </span>
            <h3 className="font-bold text-lg text-foreground">Principales Empleadores en {city.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Incluimos estas empresas en los currículums de ejemplo de {city.name} para reflejar la realidad del ecosistema local:
          </p>
          <ul className="grid grid-cols-2 gap-2 text-xs font-semibold text-muted-foreground pt-2">
            {city.companies.map((c, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </span>
            <h3 className="font-bold text-lg text-foreground">Universidades Destacadas</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Reclutadores locales valoran egresados de estas y otras instituciones con las que adaptamos las secciones educativas:
          </p>
          <ul className="space-y-2 text-xs font-semibold text-muted-foreground pt-2">
            {city.universities.map((u, i) => (
              <li key={i} className="flex items-center gap-1.5 leading-snug">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                {u}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Dynamic Advice & Tips Section */}
      <section className="bg-secondary/10 border-t py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Guías de Empleo en {city.name}
            </h2>
            <p className="text-muted-foreground">
              Prepara tu currículum, redacta tu carta de presentación e impulsa tu desempeño en entrevistas locales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {/* CV Tips */}
            <div className="bg-card border p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5 pb-2 border-b">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">El Currículum en {city.name}</h3>
              </div>
              <ul className="space-y-3 text-xs text-muted-foreground">
                {city.resumeTips.map((tip, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="font-bold text-primary shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cover Letter Tips */}
            <div className="bg-card border p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5 pb-2 border-b">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">Carta de Presentación</h3>
              </div>
              <ul className="space-y-3 text-xs text-muted-foreground">
                {city.coverLetterTips.map((tip, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="font-bold text-primary shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interview Tips */}
            <div className="bg-card border p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5 pb-2 border-b">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">La Entrevista Laboral</h3>
              </div>
              <ul className="space-y-3 text-xs text-muted-foreground">
                {city.interviewTips.map((tip, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="font-bold text-primary shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates-section" className="mx-auto max-w-6xl px-4 py-16 md:py-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Elige tu plantilla favorita para {city.name}
          </h2>
          <p className="text-muted-foreground">
            Todos estos diseños han sido probados y validados con los softwares ATS de las principales empresas en México.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { id: "minimal-ats-elite", name: "ATS Élite Mínimo", desc: "100% optimizado para grandes corporativos." },
            { id: "tech-software-engineer", name: "Ingeniero de Software", desc: "Sidebar técnico especializado en desarrollo." },
            { id: "executive-project-manager", name: "Gerente de Proyectos", desc: "Esquema timeline para coordinadores y PMP." },
            { id: "creative-wave-emerald", name: "Onda Esmeralda", desc: "Toque moderno y asimétrico para perfiles creativos." }
          ].map((tpl) => (
            <div key={tpl.id} className="bg-card border rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="aspect-[1/1.414] rounded-lg border bg-secondary/20 flex items-center justify-center p-2 text-muted-foreground relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <FileText className="h-10 w-10 text-muted-foreground/45" />
                </div>
                <h4 className="font-bold text-sm text-foreground">{tpl.name}</h4>
                <p className="text-xs text-muted-foreground leading-snug">{tpl.desc}</p>
              </div>
              <Link to="/auth" search={{ template: tpl.id, city: city.slug }} className="mt-4">
                <Button size="sm" className="w-full text-xs gap-1">
                  Usar en {city.name} <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Articles */}
      <section className="bg-secondary/20 border-t py-14">
        <div className="mx-auto max-w-6xl px-4 space-y-8">
          <h3 className="text-lg font-bold text-foreground">
            Artículos recomendados para tu carrera:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: `Cómo conseguir trabajo en ${city.name} en 2026`, link: "/blog" },
              { title: `El formato de currículum ideal para empresas en ${city.name}`, link: "/blog" },
              { title: `Sueldos promedio y negociación salarial en ${city.name}`, link: "/blog" },
              { title: "Habilidades más demandadas en el mercado mexicano", link: "/blog" }
            ].map((art, i) => (
              <Link
                key={i}
                to={art.link}
                className="bg-card border hover:border-primary/40 p-4 rounded-xl flex items-center justify-between group transition-colors shadow-sm"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Blog de Carreras</span>
                  <h4 className="font-semibold text-xs leading-snug text-foreground group-hover:text-primary transition-colors">
                    {art.title}
                  </h4>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors ml-2" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Switch Cities (Internal Linking Grid) */}
      <section className="border-t py-14">
        <div className="mx-auto max-w-6xl px-4 space-y-6">
          <h3 className="text-lg font-bold text-foreground">
            Ver plantillas en otras ciudades de México:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {activeCities.map((c) => (
              <Link
                key={c.slug}
                to={`/resume-${c.slug}`}
                className="bg-card hover:bg-primary/5 hover:border-primary/40 border text-center p-3 rounded-lg text-[11px] font-semibold text-muted-foreground hover:text-primary transition-all truncate"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
