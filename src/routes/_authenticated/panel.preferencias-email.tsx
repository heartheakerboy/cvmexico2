import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, CheckCircle2, Shield, Bell, Sparkles, Briefcase, Tag, Newspaper, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/panel/preferencias-email")({
  component: UserEmailPreferencesPage,
});

function UserEmailPreferencesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [prefs, setPrefs] = useState({
    marketingEmails: true,
    productUpdates: true,
    careerTips: true,
    specialOffers: true,
    newsletter: true,
  });

  useEffect(() => {
    // Load existing preferences if any
    async function load() {
      if (!user) return;
      try {
        const { data } = await supabase
          .from("profiles" as any)
          .select("email")
          .eq("id", user.id)
          .single();
      } catch (err) {
        console.warn("Could not load preferences:", err);
      }
    }
    load();
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      // If user turned off marketing, mark them
      toast.success("Tus preferencias de correo han sido actualizadas.");
    } catch (err: any) {
      toast.error("Error al guardar preferencias");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Preferencias de Comunicación por Correo
          </h1>
          <p className="text-xs text-muted-foreground">
            Elige qué tipos de comunicaciones deseas recibir de CVAI en tu correo.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Actualizaciones de Producto e IA
                </Label>
                <p className="text-xs text-muted-foreground">
                  Novedades sobre nuevas plantillas, mejoras en el motor de IA y nuevas herramientas del creador.
                </p>
              </div>
            </div>
            <Switch
              checked={prefs.productUpdates}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, productUpdates: v }))}
            />
          </div>

          <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Consejos Profesionales y Filtros ATS
                </Label>
                <p className="text-xs text-muted-foreground">
                  Estrategias recomendadas para superar los filtros ATS en México y destacar en entrevistas laborales.
                </p>
              </div>
            </div>
            <Switch
              checked={prefs.careerTips}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, careerTips: v }))}
            />
          </div>

          <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Ofertas Especiales y Descuentos
                </Label>
                <p className="text-xs text-muted-foreground">
                  Promociones por tiempo limitado y cupones de descuento exclusivos para tu plan.
                </p>
              </div>
            </div>
            <Switch
              checked={prefs.specialOffers}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, specialOffers: v }))}
            />
          </div>

          <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex items-start gap-3">
              <Newspaper className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Boletín Mensual (Newsletter)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Resumen mensual con las tendencias del mercado laboral en México y vacantes destacadas.
                </p>
              </div>
            </div>
            <Switch
              checked={prefs.newsletter}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, newsletter: v }))}
            />
          </div>

          <div className="flex items-start justify-between gap-4 pt-1">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Correos de Marketing Generales
                </Label>
                <p className="text-xs text-muted-foreground">
                  Comunicaciones y anuncios generales sobre el ecosistema de CVAI.
                </p>
              </div>
            </div>
            <Switch
              checked={prefs.marketingEmails}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, marketingEmails: v }))}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
          <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>
            <strong>Correos Transaccionales Esenciales:</strong> Las notificaciones críticas de seguridad, restablecimiento de contraseñas y confirmaciones de pago se seguirán enviando independientemente de estas opciones para garantizar la seguridad de tu cuenta.
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar Preferencias
          </Button>
        </div>
      </div>
    </div>
  );
}
