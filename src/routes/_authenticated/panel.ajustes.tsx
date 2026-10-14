import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Settings, Globe, Palette, Bell, Shield, Lock, Trash2,
  Sun, Moon, Loader2, Languages,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/db/client";
import { useSettings, type Lang } from "@/lib/settings";
import { ENABLED_LOCALES } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/panel/ajustes")({
  component: AjustesPage,
});

function Card({ icon: Icon, title, desc, children }: {
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
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}

function AjustesPage() {
  const { lang, theme, prefs, setLang, setTheme, setPref, t } = useSettings();
  const navigate = useNavigate();

  const [notif, setNotif] = useState({ email: true, jobs: true, tips: false });
  const [privacy, setPrivacy] = useState({ profile: true, analytics: true });
  const [pw, setPw] = useState({ next: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function updatePassword() {
    if (pw.next.length < 6) return toast.error(t("settings.password.new") + " ≥ 6");
    if (pw.next !== pw.confirm) return toast.error(lang === "es" ? "Las contraseñas no coinciden" : "Passwords do not match");
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: pw.next });
    setSavingPw(false);
    if (error) return toast.error(error.message);
    setPw({ next: "", confirm: "" });
    toast.success(t("common.saved"));
  }

  async function deleteAccount() {
    setDeleting(true);
    try {
      const { deleteMyAccount } = await import("@/lib/account.functions");
      await deleteMyAccount();
      await supabase.auth.signOut();
      toast.success(lang === "es" ? "Cuenta eliminada" : "Account deleted");
      navigate({ to: "/" });
    } catch {
      toast.error(lang === "es" ? "No se pudo eliminar la cuenta" : "Could not delete the account");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-16">
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Settings className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold">{t("settings.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("settings.subtitle")}</p>
        </div>
      </header>

      <Card icon={Globe} title={t("settings.language")} desc={t("settings.language.desc")}>
        <Row label={t("settings.language")}>
          <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ENABLED_LOCALES.map((l) => (
                <SelectItem key={l.code} value={l.code}>{l.flag} {l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>
      </Card>

      <Card icon={Languages} title={t("prefs.title")} desc={t("prefs.desc")}>
        <Row label={t("prefs.resumeLang")}>
          <Select value={prefs.resumeLang} onValueChange={(v) => setPref("resumeLang", v as never)}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ENABLED_LOCALES.map((l) => (
                <SelectItem key={l.code} value={l.code}>{l.flag} {l.label}</SelectItem>
              ))}
              <SelectItem value="bilingual">🌐 {t("prefs.bilingual")}</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label={t("prefs.aiLang")}>
          <Select value={prefs.aiOutputLang} onValueChange={(v) => setPref("aiOutputLang", v as never)}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ENABLED_LOCALES.map((l) => (
                <SelectItem key={l.code} value={l.code}>{l.flag} {l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>
        <Row label={t("prefs.dateFormat")}>
          <Select value={prefs.dateFormat} onValueChange={(v) => setPref("dateFormat", v)}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
              <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
              <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label={t("prefs.numberFormat")}>
          <Select value={prefs.numberFormat} onValueChange={(v) => setPref("numberFormat", v)}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="es-MX">1,234.56 (es-MX)</SelectItem>
              <SelectItem value="en-US">1,234.56 (en-US)</SelectItem>
              <SelectItem value="de-DE">1.234,56 (de-DE)</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label={t("prefs.timezone")}>
          <Select value={prefs.timezone} onValueChange={(v) => setPref("timezone", v)}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
              <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
              <SelectItem value="America/Los_Angeles">Los Angeles (GMT-8)</SelectItem>
              <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label={t("prefs.currency")}>
          <Select value={prefs.currency} onValueChange={(v) => setPref("currency", v)}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MXN">MXN — Peso mexicano</SelectItem>
              <SelectItem value="USD">USD — US Dollar</SelectItem>
              <SelectItem value="EUR">EUR — Euro</SelectItem>
            </SelectContent>
          </Select>
        </Row>
      </Card>

      <Card icon={Palette} title={t("settings.theme")} desc={t("settings.theme.desc")}>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`flex items-center gap-2 rounded-xl border p-4 text-sm transition-colors ${theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"}`}
          >
            <Sun className="h-4 w-4" /> {t("settings.light")}
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-2 rounded-xl border p-4 text-sm transition-colors ${theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"}`}
          >
            <Moon className="h-4 w-4" /> {t("settings.dark")}
          </button>
        </div>
      </Card>

      <Card icon={Bell} title={t("settings.notifications")} desc={t("settings.notifications.desc")}>
        <Row label={t("settings.notif.email")}>
          <Switch checked={notif.email} onCheckedChange={(v) => setNotif((s) => ({ ...s, email: v }))} />
        </Row>
        <Row label={t("settings.notif.jobs")}>
          <Switch checked={notif.jobs} onCheckedChange={(v) => setNotif((s) => ({ ...s, jobs: v }))} />
        </Row>
        <Row label={t("settings.notif.tips")}>
          <Switch checked={notif.tips} onCheckedChange={(v) => setNotif((s) => ({ ...s, tips: v }))} />
        </Row>
      </Card>

      <Card icon={Shield} title={t("settings.privacy")} desc={t("settings.privacy.desc")}>
        <Row label={t("settings.privacy.profile")}>
          <Switch checked={privacy.profile} onCheckedChange={(v) => setPrivacy((s) => ({ ...s, profile: v }))} />
        </Row>
        <Row label={t("settings.privacy.analytics")}>
          <Switch checked={privacy.analytics} onCheckedChange={(v) => setPrivacy((s) => ({ ...s, analytics: v }))} />
        </Row>
      </Card>

      <Card icon={Lock} title={t("settings.password")} desc={t("settings.password.desc")}>
        <div className="space-y-1.5">
          <Label className="text-xs">{t("settings.password.new")}</Label>
          <Input type="password" value={pw.next} onChange={(e) => setPw((s) => ({ ...s, next: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{t("settings.password.confirm")}</Label>
          <Input type="password" value={pw.confirm} onChange={(e) => setPw((s) => ({ ...s, confirm: e.target.value }))} />
        </div>
        <Button onClick={updatePassword} disabled={savingPw}>
          {savingPw && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("settings.password.update")}
        </Button>
      </Card>

      <Card icon={Trash2} title={t("settings.delete")} desc={t("settings.delete.desc")}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("settings.delete.button")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("settings.delete.confirm.title")}</AlertDialogTitle>
              <AlertDialogDescription>{t("settings.delete.confirm.desc")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {t("common.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}
