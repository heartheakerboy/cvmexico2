import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  FileText,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/actualizar-password")({
  head: () => ({
    meta: [
      { title: "Restablecer contraseña | CVAI" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ActualizarPasswordPage,
});

function ActualizarPasswordPage() {
  const navigate = useNavigate();
  const { t } = useSettings();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(hash.replace(/^#/, ""));

    const error = hashParams.get("error") || urlParams.get("error");
    const errorDescription =
      hashParams.get("error_description") || urlParams.get("error_description");

    if (error) {
      setErrorMsg(
        errorDescription?.replace(/\+/g, " ") ||
          t("auth.invalidRecoveryLink") ||
          "El enlace de recuperación ha expirado o ya no es válido."
      );
      setChecking(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setChecking(false);
        setErrorMsg(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setChecking(false);
      } else {
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: retrySession } }) => {
            if (!retrySession) {
              const hasRecoveryData =
                hash.includes("access_token") ||
                hash.includes("type=recovery") ||
                urlParams.has("code");
              if (!hasRecoveryData) {
                setErrorMsg(t("auth.invalidRecoveryLink"));
              }
            }
            setChecking(false);
          });
        }, 1200);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error(t("auth.passwordMinLength"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("auth.passwordsDoNotMatch"));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setSuccess(true);
      toast.success(t("auth.resetPasswordSuccess"));

      setTimeout(() => {
        navigate({ to: "/panel" });
      }, 2500);
    } catch (err: any) {
      const msg = err?.message || "Error al actualizar la contraseña";
      toast.error(msg);
      setErrorMsg(msg);
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
        {checking ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Verificando enlace de recuperación...</p>
          </div>
        ) : success ? (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">
                ¡Contraseña actualizada!
              </h2>
              <p className="text-sm text-muted-foreground">
                Tu contraseña ha sido modificada con éxito. Ya puedes acceder a todas tus herramientas en CVAI.
              </p>
            </div>
            <div className="pt-2">
              <Button
                className="w-full gap-2"
                onClick={() => navigate({ to: "/panel" })}
              >
                Ir al Panel de control
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : errorMsg ? (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">
                Enlace no válido o expirado
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {errorMsg}
              </p>
            </div>
            <div className="pt-3 flex flex-col gap-2">
              <Button
                variant="default"
                className="w-full"
                onClick={() => navigate({ to: "/auth" })}
              >
                {t("auth.requestNewLink")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => navigate({ to: "/auth" })}
              >
                {t("auth.backToLogin")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {t("auth.resetPasswordTitle")}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t("auth.resetPasswordSubtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">{t("auth.newPasswordLabel")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-9 pr-10"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">
                  {t("auth.confirmPasswordLabel")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    className="pl-9 pr-10"
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {t("auth.passwordsDoNotMatch")}
                </p>
              )}

              <Button
                type="submit"
                className="w-full gap-2 mt-2"
                disabled={loading || (password.length > 0 && password !== confirmPassword)}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("auth.resetPasswordCta")}
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/auth"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                {t("auth.backToLogin")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
