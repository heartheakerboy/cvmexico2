import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Settings, Palette, Globe, DollarSign, Flag, Wrench, Loader2, Save, Scale,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_LEGAL_CONFIG, type CompanyLegalConfig } from "@/lib/legal-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/configuracion")({
  component: SettingsAdmin,
});

type General = { siteName: string; tagline: string; supportEmail: string; contactPhone: string };
type Branding = { primaryColor: string; logoUrl: string; faviconUrl: string; footerText: string };
type Languages = { default: string; enabled: string[] };
type Currency = { default: string; symbol: string; position: string };
type Flags = Record<string, boolean>;
type Maintenance = { enabled: boolean; message: string };

type SettingsMap = {
  general: General;
  branding: Branding;
  languages: Languages;
  currency: Currency;
  flags: Flags;
  maintenance: Maintenance;
  legal_company: CompanyLegalConfig;
};

const LANGS = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
];

const FLAG_LABELS: Record<string, string> = {
  aiTools: "AI tools",
  blog: "Blog",
  affiliates: "Affiliates",
  jobs: "Jobs board",
  interviews: "Interview prep",
  registration: "New sign-ups",
};

function SectionCard({
  icon: Icon, title, desc, children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; desc: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function SettingsAdmin() {
  const [data, setData] = useState<SettingsMap | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("system_settings")
      .select("key,value")
      .then(({ data: rows, error }) => {
        if (error) {
          toast.error(error.message);
          return;
        }
        const map = Object.fromEntries((rows ?? []).map((r) => [r.key, r.value])) as unknown as SettingsMap;
        if (!map.legal_company) {
          map.legal_company = { ...DEFAULT_LEGAL_CONFIG };
        }
        setData(map);
      });
  }, []);

  async function save<K extends keyof SettingsMap>(key: K, value: SettingsMap[K]) {
    setSaving(key);
    const { error } = await supabase
      .from("system_settings")
      .upsert({ key, value: value as never }, { onConflict: "key" });
    setSaving(null);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  }

  function patch<K extends keyof SettingsMap>(key: K, partial: Partial<SettingsMap[K]>) {
    setData((prev) => (prev ? { ...prev, [key]: { ...prev[key], ...partial } } : prev));
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const SaveBtn = ({ k, value }: { k: keyof SettingsMap; value: SettingsMap[keyof SettingsMap] }) => (
    <Button size="sm" onClick={() => save(k, value as never)} disabled={saving === k}>
      {saving === k ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      Save
    </Button>
  );

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Settings className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">General settings, branding and flags.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general"><Settings className="mr-1.5 h-3.5 w-3.5" />General</TabsTrigger>
          <TabsTrigger value="branding"><Palette className="mr-1.5 h-3.5 w-3.5" />Branding</TabsTrigger>
          <TabsTrigger value="languages"><Globe className="mr-1.5 h-3.5 w-3.5" />Languages</TabsTrigger>
          <TabsTrigger value="currency"><DollarSign className="mr-1.5 h-3.5 w-3.5" />Currency</TabsTrigger>
          <TabsTrigger value="flags"><Flag className="mr-1.5 h-3.5 w-3.5" />Feature flags</TabsTrigger>
          <TabsTrigger value="legal_company"><Scale className="mr-1.5 h-3.5 w-3.5" />Legal & Empresa</TabsTrigger>
          <TabsTrigger value="maintenance"><Wrench className="mr-1.5 h-3.5 w-3.5" />Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <SectionCard icon={Settings} title="General" desc="Basic site identity and contact info.">
            <Field label="Site name">
              <Input value={data.general.siteName} onChange={(e) => patch("general", { siteName: e.target.value })} />
            </Field>
            <Field label="Tagline">
              <Input value={data.general.tagline} onChange={(e) => patch("general", { tagline: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Support email">
                <Input type="email" value={data.general.supportEmail} onChange={(e) => patch("general", { supportEmail: e.target.value })} />
              </Field>
              <Field label="Contact phone">
                <Input value={data.general.contactPhone} onChange={(e) => patch("general", { contactPhone: e.target.value })} />
              </Field>
            </div>
            <SaveBtn k="general" value={data.general} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="branding">
          <SectionCard icon={Palette} title="Branding" desc="Colors, logo and footer.">
            <Field label="Primary color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={data.branding.primaryColor}
                  onChange={(e) => patch("branding", { primaryColor: e.target.value })}
                  className="h-9 w-14 cursor-pointer rounded-md border border-input bg-transparent"
                />
                <Input
                  value={data.branding.primaryColor}
                  onChange={(e) => patch("branding", { primaryColor: e.target.value })}
                  className="w-40"
                />
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Logo URL">
                <Input value={data.branding.logoUrl} onChange={(e) => patch("branding", { logoUrl: e.target.value })} placeholder="https://…" />
              </Field>
              <Field label="Favicon URL">
                <Input value={data.branding.faviconUrl} onChange={(e) => patch("branding", { faviconUrl: e.target.value })} placeholder="https://…" />
              </Field>
            </div>
            <Field label="Footer text">
              <Input value={data.branding.footerText} onChange={(e) => patch("branding", { footerText: e.target.value })} />
            </Field>
            <SaveBtn k="branding" value={data.branding} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="languages">
          <SectionCard icon={Globe} title="Languages" desc="Default and available languages.">
            <Field label="Default language">
              <Select value={data.languages.default} onValueChange={(v) => patch("languages", { default: v })}>
                <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANGS.map((l) => <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Enabled languages">
              <div className="flex flex-wrap gap-2">
                {LANGS.map((l) => {
                  const on = data.languages.enabled.includes(l.code);
                  return (
                    <button
                      key={l.code}
                      onClick={() =>
                        patch("languages", {
                          enabled: on
                            ? data.languages.enabled.filter((c) => c !== l.code)
                            : [...data.languages.enabled, l.code],
                        })
                      }
                    >
                      <Badge variant={on ? "default" : "outline"} className="cursor-pointer">{l.label}</Badge>
                    </button>
                  );
                })}
              </div>
            </Field>
            <SaveBtn k="languages" value={data.languages} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="currency">
          <SectionCard icon={DollarSign} title="Currency" desc="How prices are displayed.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Currency code">
                <Select value={data.currency.default} onValueChange={(v) => patch("currency", { default: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["MXN", "USD", "EUR", "GBP", "BRL", "ARS"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Symbol">
                <Input value={data.currency.symbol} onChange={(e) => patch("currency", { symbol: e.target.value })} />
              </Field>
              <Field label="Symbol position">
                <Select value={data.currency.position} onValueChange={(v) => patch("currency", { position: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">Before ($100)</SelectItem>
                    <SelectItem value="after">After (100$)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <SaveBtn k="currency" value={data.currency} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="flags">
          <SectionCard icon={Flag} title="Feature flags" desc="Enable or disable modules across the app.">
            {Object.keys(data.flags).map((f) => (
              <div key={f} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                <span className="text-sm">{FLAG_LABELS[f] ?? f}</span>
                <Switch checked={data.flags[f]} onCheckedChange={(v) => patch("flags", { [f]: v })} />
              </div>
            ))}
            <SaveBtn k="flags" value={data.flags} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="maintenance">
          <SectionCard icon={Wrench} title="Maintenance" desc="Put the public site into maintenance mode.">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Maintenance mode</p>
                <p className="text-xs text-muted-foreground">Visitors will see the maintenance message.</p>
              </div>
              <Switch checked={data.maintenance.enabled} onCheckedChange={(v) => patch("maintenance", { enabled: v })} />
            </div>
            <Field label="Message">
              <Textarea rows={3} value={data.maintenance.message} onChange={(e) => patch("maintenance", { message: e.target.value })} />
            </Field>
            <SaveBtn k="maintenance" value={data.maintenance} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="legal_company">
          <SectionCard icon={Scale} title="Legal, Empresa & Confianza" desc="Información corporativa, correos de contacto, fechas de vigencia y proveedores de infraestructura.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre Legal de la Empresa / Plataforma">
                <Input
                  value={data.legal_company?.companyName || ""}
                  onChange={(e) => patch("legal_company", { companyName: e.target.value })}
                  placeholder="Curriculum Vitae AI"
                />
              </Field>
              <Field label="Nombre Comercial / Marca">
                <Input
                  value={data.legal_company?.brandName || ""}
                  onChange={(e) => patch("legal_company", { brandName: e.target.value })}
                  placeholder="CVAI"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Correo de Soporte">
                <Input
                  type="email"
                  value={data.legal_company?.supportEmail || ""}
                  onChange={(e) => patch("legal_company", { supportEmail: e.target.value })}
                  placeholder="support@cvai.com.mx"
                />
              </Field>
              <Field label="Correo Legal / Privacidad (ARCO)">
                <Input
                  type="email"
                  value={data.legal_company?.legalEmail || ""}
                  onChange={(e) => patch("legal_company", { legalEmail: e.target.value })}
                  placeholder="legal@cvai.com.mx"
                />
              </Field>
              <Field label="Correo de Negocios / Alianzas">
                <Input
                  type="email"
                  value={data.legal_company?.businessEmail || ""}
                  onChange={(e) => patch("legal_company", { businessEmail: e.target.value })}
                  placeholder="contacto@cvai.com.mx"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Dirección / Domicilio">
                <Input
                  value={data.legal_company?.address || ""}
                  onChange={(e) => patch("legal_company", { address: e.target.value })}
                  placeholder="Ciudad de México"
                />
              </Field>
              <Field label="País">
                <Input
                  value={data.legal_company?.country || ""}
                  onChange={(e) => patch("legal_company", { country: e.target.value })}
                  placeholder="México"
                />
              </Field>
              <Field label="URL Oficial del Sitio">
                <Input
                  value={data.legal_company?.websiteUrl || ""}
                  onChange={(e) => patch("legal_company", { websiteUrl: e.target.value })}
                  placeholder="https://www.cvai.com.mx"
                />
              </Field>
            </div>

            <Field label="Descripción de Entidad Legal / Registro">
              <Textarea
                rows={2}
                value={data.legal_company?.legalEntityInfo || ""}
                onChange={(e) => patch("legal_company", { legalEntityInfo: e.target.value })}
                placeholder="Plataforma digital independiente de desarrollo tecnológico y optimización laboral en México."
              />
            </Field>

            <div className="pt-2 border-t border-border">
              <h3 className="text-sm font-semibold mb-3">Fechas de Última Actualización de Políticas</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Política de Privacidad">
                  <Input
                    value={data.legal_company?.privacyUpdated || ""}
                    onChange={(e) => patch("legal_company", { privacyUpdated: e.target.value })}
                    placeholder="14 de Septiembre de 2026"
                  />
                </Field>
                <Field label="Términos y Condiciones">
                  <Input
                    value={data.legal_company?.termsUpdated || ""}
                    onChange={(e) => patch("legal_company", { termsUpdated: e.target.value })}
                    placeholder="14 de Septiembre de 2026"
                  />
                </Field>
                <Field label="Política de Reembolsos">
                  <Input
                    value={data.legal_company?.refundUpdated || ""}
                    onChange={(e) => patch("legal_company", { refundUpdated: e.target.value })}
                    placeholder="14 de Septiembre de 2026"
                  />
                </Field>
                <Field label="Política de Cookies">
                  <Input
                    value={data.legal_company?.cookieUpdated || ""}
                    onChange={(e) => patch("legal_company", { cookieUpdated: e.target.value })}
                    placeholder="14 de Septiembre de 2026"
                  />
                </Field>
                <Field label="Aviso Legal / Disclaimer">
                  <Input
                    value={data.legal_company?.disclaimerUpdated || ""}
                    onChange={(e) => patch("legal_company", { disclaimerUpdated: e.target.value })}
                    placeholder="14 de Septiembre de 2026"
                  />
                </Field>
                <Field label="Transparencia de IA">
                  <Input
                    value={data.legal_company?.aiTransparencyUpdated || ""}
                    onChange={(e) => patch("legal_company", { aiTransparencyUpdated: e.target.value })}
                    placeholder="14 de Septiembre de 2026"
                  />
                </Field>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <h3 className="text-sm font-semibold mb-3">Proveedores de Infraestructura Actuales</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Pasarela de Pago">
                  <Input
                    value={data.legal_company?.paymentProvider || ""}
                    onChange={(e) => patch("legal_company", { paymentProvider: e.target.value })}
                    placeholder="Lemon Squeezy"
                  />
                </Field>
                <Field label="Proveedor de IA">
                  <Input
                    value={data.legal_company?.aiProvider || ""}
                    onChange={(e) => patch("legal_company", { aiProvider: e.target.value })}
                    placeholder="DeepSeek AI"
                  />
                </Field>
                <Field label="Almacenamiento en la Nube">
                  <Input
                    value={data.legal_company?.storageProvider || ""}
                    onChange={(e) => patch("legal_company", { storageProvider: e.target.value })}
                    placeholder="Cloudflare R2"
                  />
                </Field>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <h3 className="text-sm font-semibold mb-3">Redes Sociales</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="LinkedIn">
                  <Input
                    value={data.legal_company?.socialLinks?.linkedin || ""}
                    onChange={(e) => patch("legal_company", {
                      socialLinks: { ...(data.legal_company?.socialLinks || {}), linkedin: e.target.value }
                    })}
                    placeholder="https://linkedin.com/company/cvai-mexico"
                  />
                </Field>
                <Field label="Twitter / X">
                  <Input
                    value={data.legal_company?.socialLinks?.twitter || ""}
                    onChange={(e) => patch("legal_company", {
                      socialLinks: { ...(data.legal_company?.socialLinks || {}), twitter: e.target.value }
                    })}
                    placeholder="https://twitter.com/cvai_mx"
                  />
                </Field>
              </div>
            </div>

            <SaveBtn k="legal_company" value={data.legal_company} />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
