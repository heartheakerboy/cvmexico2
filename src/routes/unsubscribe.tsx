import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, CheckCircle2, ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { publicUnsubscribe } from "@/lib/broadcast.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/unsubscribe")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: (search.email as string) || "",
    c: (search.c as string) || "",
  }),
  component: UnsubscribePage,
});

function UnsubscribePage() {
  const search = Route.useSearch();
  const [email, setEmail] = useState(search.email || "");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleUnsubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Por favor ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await publicUnsubscribe({
        data: {
          email: email.trim(),
          reason: reason || "Baja voluntaria",
        },
      });

      if (res.ok) {
        setSuccess(true);
        toast.success("Te has dado de baja de los correos de marketing.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error al procesar tu solicitud.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4 py-12">
      <Link to="/" className="mb-8 flex items-center gap-2 font-display text-xl font-bold">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FileText className="h-5 w-5" />
        </span>
        CV<span className="text-primary">AI</span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        {success ? (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">
                ¡Baja confirmada!
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El correo <span className="font-semibold text-foreground">{email}</span> ha sido eliminado de nuestras listas de difusión y promociones.
              </p>
              <p className="text-xs text-muted-foreground/80 bg-secondary/40 p-3 rounded-lg border border-border/50 text-left">
                ℹ️ <strong>Nota:</strong> Seguirás recibiendo correos transaccionales esenciales para el funcionamiento de tu cuenta (como restablecimiento de contraseña o comprobantes de suscripción).
              </p>
            </div>
            <div className="pt-3 flex flex-col gap-2">
              <Link to="/">
                <Button variant="default" className="w-full">
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Preferencias de Correo
              </h1>
              <p className="text-xs text-muted-foreground">
                Confirma tu dirección para dejar de recibir correos comerciales y promociones de CVAI.
              </p>
            </div>

            <form onSubmit={handleUnsubscribe} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="unsub-email">Tu Correo Electrónico</Label>
                <Input
                  id="unsub-email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="unsub-reason">Motivo (opcional)</Label>
                <select
                  id="unsub-reason"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Selecciona un motivo (opcional)</option>
                  <option value="too_frequent">Recibo correos con demasiada frecuencia</option>
                  <option value="not_relevant">El contenido ya no es relevante para mí</option>
                  <option value="found_job">Ya conseguí empleo con CVAI</option>
                  <option value="never_signed">No recuerdo haberme registrado</option>
                  <option value="other">Otro motivo</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="destructive"
                className="w-full gap-2 mt-2"
                disabled={loading || !email.trim()}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirmar baja de correos
              </Button>
            </form>

            <div className="text-center pt-2">
              <Link
                to="/"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Regresar al portal principal
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
