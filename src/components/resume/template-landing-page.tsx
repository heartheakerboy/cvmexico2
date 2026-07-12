import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ArrowRight, Sparkles, Shield, RefreshCcw, Download, FileText } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { ResumePaper } from "@/components/resume/resume-paper";
import { makeDefaultDesign, defaultLayout, type ResumeDoc } from "@/lib/resume/types";
import { TEMPLATES } from "@/lib/resume/registry";

type Props = {
  templateId: string;
  title: string;
  description: string;
  profession: string;
  category: string;
  schemaDescription: string;
  faqs: { q: string; a: string }[];
  sampleDoc: ResumeDoc;
  crossLinks: { label: string; to: string }[];
};

export function TemplateLandingPage({
  templateId,
  title,
  description,
  profession,
  category,
  schemaDescription,
  faqs,
  sampleDoc,
  crossLinks,
}: Props) {
  const design = makeDefaultDesign("#2563eb"); // default preview accent
  
  // JSON-LD Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": title,
    "description": schemaDescription,
    "image": "https://curriculumvitaeai.com.mx/og-image.png",
    "brand": {
      "@type": "Brand",
      "name": "CVMéxico"
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "MXN",
      "availability": "https://schema.org/InStock"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
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
      {/* Schema Injection */}
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
        <span className="text-foreground font-medium">{profession}</span>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-16 grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div className="space-y-6">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
            Plantilla Profesional de {category}
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-foreground">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/auth" search={{ template: templateId }}>
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-none">
                Usar esta plantilla <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/plantillas">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ver otros diseños
              </Button>
            </Link>
          </div>

          {/* Micro value props */}
          <div className="grid grid-cols-2 gap-4 border-t pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>100% Compatible con ATS</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Edición en tiempo real</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Exportación PDF instantánea</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Sugerencias con IA</span>
            </div>
          </div>
        </div>

        {/* Live Scaled A4 Preview */}
        <div className="flex justify-center md:justify-end">
          <div className="relative group w-[340px] md:w-[400px] aspect-[1/1.414] rounded-2xl border bg-card p-2 shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden">
            {/* Scaled resume wrapper */}
            <div className="w-[794px] h-[1123px] transform scale-[0.41] md:scale-[0.48] origin-top-left pointer-events-none rounded bg-white">
              <ResumePaper templateId={templateId} doc={sampleDoc} design={design} layout={defaultLayout} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="bg-secondary/20 border-y py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Diseñada científicamente para el mercado laboral mexicano
            </h2>
            <p className="text-muted-foreground">
              Esta plantilla de currículum ha sido optimizada para pasar los filtros automáticos de los sistemas ATS y destacar ante reclutadores en México.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-card border p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-bold">Validador de Filtros ATS</h3>
              <p className="text-sm text-muted-foreground">
                Fuentes estándar y estructuras legibles que garantizan que el software de recursos humanos lea correctamente tu perfil.
              </p>
            </div>

            <div className="bg-card border p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-bold">Contenido Inteligente</h3>
              <p className="text-sm text-muted-foreground">
                Sugerencias automáticas adaptadas a tu carrera en México para rellenar logros y habilidades con un solo clic.
              </p>
            </div>

            <div className="bg-card border p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="font-bold">PDF Listo para Imprimir</h3>
              <p className="text-sm text-muted-foreground">
                Descarga inmediata con formato A4/Carta perfecto, listo para enviar por correo electrónico o postularte en LinkedIn.
              </p>
            </div>

            <div className="bg-card border p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-bold">Estructura Adaptable</h3>
              <p className="text-sm text-muted-foreground">
                Arrastra y suelta secciones, cambia el tamaño de la foto, colores y márgenes según tus gustos personales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Accordion */}
      <section className="mx-auto max-w-3xl px-4 py-16 md:py-24 space-y-10">
        <h2 className="text-3xl font-bold tracking-tight text-center text-foreground">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="border border-border/80 bg-card p-5 rounded-2xl">
              <h3 className="font-semibold text-foreground mb-2 flex items-center justify-between">
                <span>{f.q}</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Cross Links & Internal Linking */}
      <section className="bg-secondary/10 border-t py-14">
        <div className="mx-auto max-w-6xl px-4 space-y-8">
          <h3 className="text-lg font-bold text-foreground">
            Otras plantillas premium por profesión:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {crossLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="bg-card hover:bg-primary/5 hover:border-primary border text-center p-3.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-primary transition-all truncate"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// Small badge subcomponent
function Badge({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
