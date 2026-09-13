import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateResume } from "@/lib/ia.functions";
import { useSettings } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/panel/ia")({
  component: IaPage,
});

function IaPage() {
  const navigate = useNavigate();
  const generate = useServerFn(generateResume);
  const { prefs, t } = useSettings();
  const aiLang = prefs.resumeLang === "bilingual" ? "bilingual" : prefs.aiOutputLang;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role: "",
    seniority: "",
    industry: "",
    skills: "",
    about: "",
  });

  function upd(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleGenerate() {
    if (!form.role.trim()) {
      toast.error(t("panelIa.errRole"));
      return;
    }
    setLoading(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) throw new Error(t("panelIa.errSession"));

      const content = await generate({
        data: { ...form, lang: aiLang },
      });

      const { data: cv, error } = await supabase
        .from("resumes")
        .insert({
          user_id: uid,
          title: `CV - ${form.role}`,
          headline: content.headline,
          summary: content.summary,
          skills: content.skills,
          experience: content.experience,
          education: content.education,
        })
        .select("id")
        .single();

      if (error || !cv) throw error ?? new Error(t("panelIa.errCreate"));

      toast.success(t("panelIa.success"));
      navigate({ to: "/cv/$id", params: { id: cv.id } });
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || "";
      if (msg.includes("Unauthorized") || msg.includes("No authorization") || msg.includes("token")) {
        toast.error("Sesión no válida o expirada. Por favor recarga la página o inicia sesión de nuevo.");
      } else if (msg) {
        toast.error(`No se pudo generar: ${msg}`);
      } else {
        toast.error(t("panelIa.errGenerate"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">{t("panelIa.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("panelIa.subtitle")}</p>
        </div>
      </div>

      <div className="mt-8 max-w-2xl rounded-2xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t("panelIa.role")}</Label>
            <Input
              value={form.role}
              onChange={(e) => upd("role", e.target.value)}
              placeholder={t("panelIa.rolePh")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{t("panelIa.seniority")}</Label>
              <Input
                value={form.seniority}
                onChange={(e) => upd("seniority", e.target.value)}
                placeholder={t("panelIa.seniorityPh")}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("panelIa.industry")}</Label>
              <Input
                value={form.industry}
                onChange={(e) => upd("industry", e.target.value)}
                placeholder={t("panelIa.industryPh")}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t("panelIa.skills")}</Label>
            <Input
              value={form.skills}
              onChange={(e) => upd("skills", e.target.value)}
              placeholder={t("panelIa.skillsPh")}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("panelIa.about")}</Label>
            <Textarea
              value={form.about}
              onChange={(e) => upd("about", e.target.value)}
              placeholder={t("panelIa.aboutPh")}
              rows={4}
            />
          </div>
          <Button className="w-full gap-2" onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t("panelIa.generating")}
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" /> {t("panelIa.generate")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
