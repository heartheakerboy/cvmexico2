import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutTemplate, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TEMPLATES, TEMPLATE_CATEGORIES, type TemplateCategory } from "@/lib/resume/registry";
import { ResumeThumb } from "@/components/resume/resume-thumb";
import { makeDefaultDesign, defaultLayout } from "@/lib/resume/types";

export const Route = createFileRoute("/_authenticated/panel/plantillas")({
  component: PlantillasPage,
});

function PlantillasPage() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState<string | null>(null);
  const [filter, setFilter] = useState<TemplateCategory | "Todas">("Todas");

  async function useTemplate(templateId: string, name: string) {
    setCreating(templateId);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) throw new Error("Sesión no válida");

      const { data: cv, error } = await supabase
        .from("resumes")
        .insert({
          user_id: uid,
          title: `CV ${name}`,
          template: templateId,
          design: makeDefaultDesign(TEMPLATES.find((t) => t.id === templateId)!.accent) as never,
          layout: defaultLayout as never,
        })
        .select("id")
        .single();

      if (error || !cv) throw error ?? new Error("No se pudo crear");

      toast.success(`Plantilla ${name} lista para editar`);
      navigate({ to: "/cv/$id", params: { id: cv.id } });
    } catch (e) {
      console.error(e);
      toast.error("No se pudo crear el CV. Inténtalo de nuevo.");
    } finally {
      setCreating(null);
    }
  }

  const visible = TEMPLATES.filter((t) => filter === "Todas" || t.category === filter || (filter === "ATS" && t.ats));

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LayoutTemplate className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">Plantillas</h1>
          <p className="text-sm text-muted-foreground">
            Elige un diseño profesional y compatible con ATS para empezar tu CV.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["Todas", ...TEMPLATE_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              filter === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((t) => (
          <div key={t.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary/50">
              <ResumeThumb templateId={t.id} accent={t.accent} />
              <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
                {t.ats && <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">ATS</span>}
                {t.premium && <span className="rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">Premium</span>}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{t.name}</h3>
                <span className="shrink-0 rounded bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">{t.category}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
              <Button
                size="sm"
                className="mt-3 w-full gap-2"
                onClick={() => useTemplate(t.id, t.name)}
                disabled={creating !== null}
              >
                {creating === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Usar plantilla
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
