import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FileText, Loader2, ArrowLeft, CheckCircle2, Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSettings } from "@/lib/settings";
import { getMetaTranslation } from "@/lib/i18n/config";
import { useAuth } from "@/hooks/use-auth";
import { requestPasswordReset } from "@/lib/smtp.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: getMetaTranslation("auth.title") },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [tab, setTab] = useState<"registro" | "login" | "recuperar">("registro");
  const { t } = useSettings();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate({ to: "/panel" });
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4 py-12">
      <Link to="/" className="mb-8 flex items-center gap-2 font-display text-xl font-bold">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FileText className="h-5 w-5" />
        </span>
        CV<span className="text-primary">AI</span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        {tab === "recuperar" ? (
          <ForgotPasswordForm onBack={() => setTab("login")} />
        ) : (
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="registro">{t("auth.registerTab")}</TabsTrigger>
              <TabsTrigger value="login">{t("auth.loginTab")}</TabsTrigger>
            </TabsList>

            <TabsContent value="registro" className="mt-6">
              <AuthForm cta={t("auth.registerCta")} showName />
            </TabsContent>
            <TabsContent value="login" className="mt-6">
              <AuthForm
                cta={t("auth.loginCta")}
                onForgotPassword={() => setTab("recuperar")}
              />
            </TabsContent>
          </Tabs>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t("auth.termsAccept")}
          <Link to="/terminos" className="text-primary hover:underline">
            {t("auth.termsLink")}
          </Link>
          {t("auth.termsAnd")}
          <Link to="/privacidad" className="text-primary hover:underline">
            {t("auth.privacyLink")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function AuthForm({
  cta,
  showName,
  onForgotPassword,
}: {
  cta: string;
  showName?: boolean;
  onForgotPassword?: () => void;
}) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { t } = useSettings();

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/panel`,
        },
      });
      if (error) throw error;
    } catch {
      toast.error(t("auth.googleError"));
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (showName) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success(t("auth.registerSuccess"));
        navigate({ to: "/panel" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/panel" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("auth.authError");
      toast.error(
        msg.includes("Invalid login")
          ? t("auth.loginError")
          : msg.includes("already registered")
            ? t("auth.alreadyRegisteredError")
            : msg,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={handleGoogle}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35 11.1H12v3.2h5.35c-.25 1.4-1.6 4.1-5.35 4.1-3.2 0-5.8-2.65-5.8-5.9s2.6-5.9 5.8-5.9c1.8 0 3 .77 3.7 1.43l2.5-2.4C16.9 3.9 14.7 3 12 3 6.9 3 2.8 7.1 2.8 12.2S6.9 21.4 12 21.4c6.9 0 8.6-6 8-9.3z"
            />
          </svg>
        )}
        {t("auth.googleCta")}
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> {t("auth.orEmail")}{" "}
        <span className="h-px flex-1 bg-border" />
      </div>

      {showName && (
        <div className="space-y-1.5">
          <Label htmlFor="name">{t("auth.fullNameLabel")}</Label>
          <Input
            id="name"
            placeholder={t("auth.fullNamePlaceholder")}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="email">{t("auth.emailLabel")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("auth.emailPlaceholder")}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
          {!showName && onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-primary hover:underline focus:outline-none"
            >
              {t("auth.forgotPassword")}
            </button>
          )}
        </div>
        <Input
          id="password"
          type="password"
          placeholder={t("auth.passwordPlaceholder")}
          autoComplete={showName ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
      </div>
      <Button type="submit" className="w-full gap-2" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {cta}
      </Button>
    </form>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useSettings();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/actualizar-password`;
      const res = await requestPasswordReset({
        data: {
          email: email.trim(),
          redirectTo: redirectUrl,
        },
      });

      if (res?.success || res?.ok) {
        setSent(true);
      } else {
        toast.error((res as any)?.message || t("auth.authError"));
      }
    } catch (err: any) {
      toast.error(err?.message || t("auth.authError"));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-2 space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {t("auth.forgotSuccessTitle")}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("auth.forgotSuccessDesc")}{" "}
            <span className="font-semibold text-foreground">{email}</span>.
          </p>
          <p className="text-xs text-muted-foreground/80 bg-secondary/50 p-3 rounded-lg border border-border/50">
            {t("auth.forgotSuccessNotice")}
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <Button variant="default" className="w-full" onClick={onBack}>
            {t("auth.backToLogin")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => setSent(false)}
          >
            ¿Intentar con otro correo?
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("auth.backToLogin")}
        </button>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {t("auth.forgotTitle")}
        </h2>
        <p className="text-xs text-muted-foreground">
          {t("auth.forgotSubtitle")}
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="reset-email">{t("auth.emailLabel")}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="reset-email"
              type="email"
              className="pl-9"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>

        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("auth.forgotCta")}
        </Button>
      </form>
    </div>
  );
}