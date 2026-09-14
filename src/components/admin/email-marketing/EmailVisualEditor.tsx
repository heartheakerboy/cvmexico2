import { useState } from "react";
import {
  Smartphone,
  Monitor,
  Code,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  MousePointerClick,
  Minus,
  List,
  Heading1,
  Heading2,
  Pilcrow,
  Save,
  Eye,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface EmailVisualEditorProps {
  subject: string;
  previewText: string;
  bodyHtml: string;
  ctaText: string;
  ctaUrl: string;
  bannerUrl: string;
  onChange: (updates: {
    bodyHtml?: string;
    ctaText?: string;
    ctaUrl?: string;
    bannerUrl?: string;
    previewText?: string;
  }) => void;
  onSaveAsTemplate?: () => void;
}

const PERSONALIZATION_VARIABLES = [
  { tag: "{{first_name}}", label: "Nombre", example: "Juan" },
  { tag: "{{last_name}}", label: "Apellido", example: "Pérez" },
  { tag: "{{email}}", label: "Correo", example: "usuario@ejemplo.com" },
  { tag: "{{plan_name}}", label: "Plan", example: "Pro" },
  { tag: "{{registration_date}}", label: "Fecha Registro", example: "14/09/2026" },
  { tag: "{{resume_count}}", label: "Nº de CVs", example: "2" },
  { tag: "{{ai_usage}}", label: "Uso de IA", example: "8 consultas" },
  { tag: "{{website_name}}", label: "Nombre Sitio", example: "CVAI" },
  { tag: "{{website_url}}", label: "URL Sitio", example: "https://cvai.com.mx" },
];

export function EmailVisualEditor({
  subject,
  previewText,
  bodyHtml,
  ctaText,
  ctaUrl,
  bannerUrl,
  onChange,
  onSaveAsTemplate,
}: EmailVisualEditorProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile" | "html">("desktop");
  const [activeTab, setActiveTab] = useState<"content" | "cta" | "banner">("content");

  function insertVariable(tag: string) {
    onChange({ bodyHtml: bodyHtml + (bodyHtml.endsWith(" ") ? "" : " ") + tag + " " });
    toast.info(`Variable ${tag} agregada`);
  }

  function insertSnippet(type: string) {
    let snippet = "";
    switch (type) {
      case "h1":
        snippet = "\n\n<h1 style=\"color: #0f172a; font-size: 24px; font-weight: 800; margin: 16px 0 8px 0;\">Título Principal</h1>\n";
        break;
      case "h2":
        snippet = "\n\n<h2 style=\"color: #1e293b; font-size: 19px; font-weight: 700; margin: 16px 0 8px 0;\">Subtítulo Destacado</h2>\n";
        break;
      case "p":
        snippet = "\n<p style=\"margin: 0 0 14px 0; line-height: 1.6;\">Escribe aquí tu párrafo explicativo...</p>\n";
        break;
      case "list":
        snippet = "\n<ul style=\"margin: 12px 0; padding-left: 20px; line-height: 1.6;\">\n  <li>Punto clave 1</li>\n  <li>Punto clave 2</li>\n  <li>Punto clave 3</li>\n</ul>\n";
        break;
      case "divider":
        snippet = "\n<hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;\" />\n";
        break;
    }
    onChange({ bodyHtml: bodyHtml + snippet });
  }

  // Render finalized preview HTML
  const renderedPreview = (bodyHtml || "")
    .replace(/{{first_name}}/g, "Firoz")
    .replace(/{{last_name}}/g, "Pérez")
    .replace(/{{email}}/g, "firoz@cvai.com.mx")
    .replace(/{{plan_name}}/g, "Plan Pro")
    .replace(/{{registration_date}}/g, "14/09/2026")
    .replace(/{{resume_count}}/g, "3")
    .replace(/{{ai_usage}}/g, "15 consultas")
    .replace(/{{website_name}}/g, "CVAI")
    .replace(/{{website_url}}/g, "https://cvai.com.mx");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Visual Editor & Controls (6 cols) */}
      <div className="lg:col-span-6 space-y-4">
        {/* Editor Sub-tabs */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={activeTab === "content" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("content")}
            >
              <Pilcrow className="h-3.5 w-3.5 mr-1.5" />
              Contenido
            </Button>
            <Button
              type="button"
              variant={activeTab === "cta" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("cta")}
            >
              <MousePointerClick className="h-3.5 w-3.5 mr-1.5" />
              Botón CTA
            </Button>
            <Button
              type="button"
              variant={activeTab === "banner" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("banner")}
            >
              <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
              Banner & Media
            </Button>
          </div>

          {onSaveAsTemplate && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onSaveAsTemplate}
              className="gap-1.5 text-xs"
            >
              <Save className="h-3.5 w-3.5" />
              Guardar Plantilla
            </Button>
          )}
        </div>

        {activeTab === "content" && (
          <div className="space-y-4">
            {/* Snippet Insertion Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-muted/40 border border-border">
              <span className="text-[11px] font-semibold text-muted-foreground mr-1">Insertar:</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => insertSnippet("h1")}
                title="Título H1"
              >
                <Heading1 className="h-3.5 w-3.5 mr-1" /> H1
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => insertSnippet("h2")}
                title="Subtítulo H2"
              >
                <Heading2 className="h-3.5 w-3.5 mr-1" /> H2
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => insertSnippet("p")}
                title="Párrafo"
              >
                <Pilcrow className="h-3.5 w-3.5 mr-1" /> Párrafo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => insertSnippet("list")}
                title="Lista"
              >
                <List className="h-3.5 w-3.5 mr-1" /> Lista
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => insertSnippet("divider")}
                title="Separador"
              >
                <Minus className="h-3.5 w-3.5 mr-1" /> Separador
              </Button>
            </div>

            {/* Variable Pills */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Variables Dinámicas de Personalización (haz clic para insertar):
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-muted/20 border border-border/70 rounded-lg">
                {PERSONALIZATION_VARIABLES.map((v) => (
                  <button
                    key={v.tag}
                    type="button"
                    onClick={() => insertVariable(v.tag)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-card hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-border text-[11px] font-medium text-foreground transition-all"
                    title={`Ejemplo: ${v.example}`}
                  >
                    <span>{v.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{v.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Email Content Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-body">Cuerpo del Correo (HTML / Texto)</Label>
                <span className="text-[11px] text-muted-foreground">
                  Soporta etiquetas HTML (&lt;b&gt;, &lt;p&gt;, &lt;h2&gt;, etc.)
                </span>
              </div>
              <Textarea
                id="email-body"
                rows={12}
                className="font-mono text-xs leading-relaxed"
                placeholder="Escribe el mensaje de tu campaña aquí..."
                value={bodyHtml}
                onChange={(e) => onChange({ bodyHtml: e.target.value })}
              />
            </div>
          </div>
        )}

        {activeTab === "cta" && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">Botón de Llamado a la Acción (CTA)</h4>
              <p className="text-xs text-muted-foreground">
                Un botón principal destacado en el centro del correo para maximizar conversiones.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="cta-text">Texto del Botón</Label>
                <Input
                  id="cta-text"
                  placeholder="Ej: Crear mi CV con Descuento →"
                  value={ctaText}
                  onChange={(e) => onChange({ ctaText: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cta-url">URL de Destino</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cta-url"
                    className="pl-9"
                    placeholder="https://cvai.com.mx/panel/precios"
                    value={ctaUrl}
                    onChange={(e) => onChange({ ctaUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "banner" && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">Banner Superior / Imagen Destacada</h4>
              <p className="text-xs text-muted-foreground">
                Imagen opcional de cabecera para darle un aspecto visual moderno a tu campaña.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="banner-url">URL de la Imagen del Banner</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="banner-url"
                  className="pl-9"
                  placeholder="https://cvai.com.mx/images/promo-banner.jpg"
                  value={bannerUrl}
                  onChange={(e) => onChange({ bannerUrl: e.target.value })}
                />
              </div>
            </div>

            {bannerUrl && (
              <div className="mt-2 rounded-lg border border-border overflow-hidden max-h-40 bg-muted/20">
                <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Live Multi-Device Email Preview (6 cols) */}
      <div className="lg:col-span-6 space-y-3">
        {/* Device Mode Switcher */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Vista Previa en Tiempo Real</span>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode("desktop")}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                viewMode === "desktop"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Vista de escritorio"
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("mobile")}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                viewMode === "mobile"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Vista móvil"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Móvil</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("html")}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                viewMode === "html"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Código HTML"
            >
              <Code className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">HTML</span>
            </button>
          </div>
        </div>

        {/* Email Container Frame */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 min-h-[500px] flex items-center justify-center overflow-x-auto">
          {viewMode === "html" ? (
            <div className="w-full bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-[520px]">
              <pre>{bodyHtml || "<!-- Escribe contenido para ver el HTML resultante -->"}</pre>
            </div>
          ) : (
            <div
              className={`bg-white text-slate-800 shadow-md rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 ${
                viewMode === "mobile" ? "w-[360px]" : "w-full max-w-[560px]"
              }`}
            >
              {/* Email Client Simulated Header */}
              <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 text-xs text-slate-600 flex flex-col gap-0.5">
                <div className="truncate font-semibold text-slate-900">
                  {subject || "Asunto de la campaña..."}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  De: CVAI &lt;soporte@cvai.com.mx&gt;
                </div>
              </div>

              {/* Email Content Container */}
              <div className="p-6 space-y-4 text-sm font-sans">
                {/* Logo / Header */}
                <div className="text-center pb-2 border-b border-slate-100">
                  <span className="font-extrabold text-xl tracking-tight text-blue-600">
                    CV<span className="text-slate-900">AI</span>
                  </span>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Curriculum Vitae AI
                  </div>
                </div>

                {/* Banner */}
                {bannerUrl && (
                  <div className="rounded-lg overflow-hidden max-h-48 border border-slate-100">
                    <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Body Content */}
                <div
                  className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-[14px]"
                  dangerouslySetInnerHTML={{
                    __html:
                      renderedPreview ||
                      "<p class='text-slate-400 italic text-center py-6'>Escribe el cuerpo de tu campaña para previsualizarlo aquí...</p>",
                  }}
                />

                {/* CTA Button */}
                {ctaText && ctaUrl && (
                  <div className="text-center pt-3 pb-2">
                    <a
                      href={ctaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm shadow-sm transition-colors"
                    >
                      {ctaText}
                    </a>
                  </div>
                )}

                {/* Legal Compliance Footer with Unsubscribe Link */}
                <div className="mt-8 pt-4 border-t border-slate-200/80 text-center text-[11px] text-slate-400 leading-relaxed space-y-1">
                  <p className="margin-0">
                    CVAI (cvai.com.mx) — Plataforma inteligente de optimización laboral en México.
                  </p>
                  <p className="margin-0">
                    Ciudad de México, México. Has recibido este correo por estar registrado en CVAI.
                  </p>
                  <p className="pt-1">
                    <span className="text-slate-500 underline cursor-pointer">
                      Darme de baja de estos correos
                    </span>
                    {" • "}
                    <span className="text-slate-500 underline cursor-pointer">
                      Preferencias de Correo
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
