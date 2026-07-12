import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, Loader2, CheckCircle2, AlertTriangle, Tag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { analyzeAts } from "@/lib/ats.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/panel/ats")({
  component: AtsPage,
});

type Resume = {
  id: string;
  title: string;
  full_name: string | null;
  headline: string | null;
  summary: string | null;
  skills: string[] | null;
  experience: { role?: string; company?: string; period?: string; description?: string }[] | null;
  education: { degree?: string; school?: string; period?: string }[] | null;
};

type AtsResult = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
};

function resumeToText(r: Resume) {
  const parts = [
    r.full_name,
    r.headline,
    r.summary,
    (r.skills ?? []).join(", "),
    ...(r.experience ?? []).map(
      (e) => `${e.role ?? ""} en ${e.company ?? ""} (${e.period ?? ""}): ${e.description ?? ""}`,
    ),
    ...(r.education ?? []).map((e) => `${e.degree ?? ""} - ${e.school ?? ""} (${e.period ?? ""})`),
  ];
  return parts.filter(Boolean).join("\n");
}

function AtsPage() {
  const analyze = useServerFn(analyzeAts);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AtsResult | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("resumes")
        .select("id, title, full_name, headline, summary, skills, experience, education")
        .order("updated_at", { ascending: false });
      const list = (data as Resume[]) ?? [];
      setResumes(list);
      if (list[0]) setSelected(list[0].id);
    })();
  }, []);

  async function run() {
    const resume = resumes.find((r) => r.id === selected);
    if (!resume) {
      toast.error("Selecciona un CV para analizar");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await analyze({ data: { resumeText: resumeToText(resume), jobDescription: job } });
      setResult(res);
    } catch (e) {
      console.error(e);
      toast.error("No se pudo analizar el CV. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const scoreColor = result
    ? result.score >= 75
      ? "text-emerald-500"
      : result.score >= 50
        ? "text-amber-500"
        : "text-destructive"
    : "";

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">Verificador ATS</h1>
          <p className="text-sm text-muted-foreground">
            Descubre qué tan compatible es tu CV con los filtros automáticos.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Selecciona tu CV</Label>
              {resumes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aún no tienes CVs. Crea uno primero.
                </p>
              ) : (
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Descripción del puesto (opcional)</Label>
              <Textarea
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder="Pega aquí la vacante para un análisis más preciso."
                rows={6}
              />
            </div>
            <Button className="w-full gap-2" onClick={run} disabled={loading || resumes.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analizando...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Analizar CV
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          {!result ? (
            <div className="flex h-full min-h-48 flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <ShieldCheck className="mb-3 h-10 w-10 opacity-40" />
              Tu análisis ATS aparecerá aquí.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className={`font-display text-4xl font-bold ${scoreColor}`}>{result.score}</div>
                <div className="text-sm text-muted-foreground">/ 100 compatibilidad ATS</div>
              </div>
              <p className="text-sm">{result.summary}</p>

              <Section icon={CheckCircle2} color="text-emerald-500" title="Fortalezas" items={result.strengths} />
              <Section icon={AlertTriangle} color="text-amber-500" title="Mejoras sugeridas" items={result.improvements} />
              {result.missingKeywords.length > 0 && (
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Tag className="h-4 w-4 text-primary" /> Palabras clave faltantes
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map((k) => (
                      <span key={k} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  color,
  title,
  items,
}: {
  icon: typeof CheckCircle2;
  color: string;
  title: string;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className={`mb-2 flex items-center gap-2 text-sm font-semibold`}>
        <Icon className={`h-4 w-4 ${color}`} /> {title}
      </p>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
