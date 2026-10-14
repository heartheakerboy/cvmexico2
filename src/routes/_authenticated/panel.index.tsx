import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  FileText,
  Sparkles,
  ShieldCheck,
  Mail,
  LayoutTemplate,
  ArrowUpRight,
  Loader2,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/db/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/panel/")({
  component: DashboardHome,
});

type Profile = { full_name: string | null; plan: string };
type Resume = { id: string; title: string; headline: string | null; summary: string | null; updated_at: string };

function completion(r: Resume | null): number {
  if (!r) return 0;
  let score = 0;
  if (r.title) score += 20;
  if (r.headline) score += 30;
  if (r.summary) score += 50;
  return Math.min(100, score);
}

function DashboardHome() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          setLoading(false);
          return;
        }
        const [{ data }, { data: cvs }] = await Promise.all([
          supabase.from("profiles").select("full_name, plan").eq("id", userData.user.id).maybeSingle(),
          supabase.from("resumes").select("id, title, headline, summary, updated_at").order("updated_at", { ascending: false }),
        ]);
        setProfile(data ?? { full_name: userData.user.email ?? null, plan: "free" });
        setResumes(cvs ?? []);
      } catch (err: any) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const recent = resumes[0] ?? null;
  const avgCompletion = useMemo(() => {
    if (resumes.length === 0) return 0;
    return Math.round(resumes.reduce((a, r) => a + completion(r), 0) / resumes.length);
  }, [resumes]);

  async function createResume() {
    setCreating(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return setCreating(false);
    const { data, error } = await supabase
      .from("resumes")
      .insert({ user_id: userData.user.id, title: "Mi CV", full_name: profile?.full_name ?? null })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) return toast.error("No se pudo crear el CV");
    navigate({ to: "/cv/$id", params: { id: data.id } });
  }

  const firstName = profile?.full_name?.split(" ")[0];

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/5 p-6">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold">
              Hola{firstName ? `, ${firstName}` : ""} 👋
            </h1>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Lleva tu carrera al siguiente nivel. Crea, mejora y optimiza tu currículum con IA.
            </p>
          </div>
          <Button size="lg" className="gap-2" onClick={createResume} disabled={creating}>
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Crear nuevo CV
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={FileText} label="CV creados" value={String(resumes.length)} />
        <StatCard icon={TrendingUp} label="Completado promedio" value={`${avgCompletion}%`} />
        <StatCard icon={ShieldCheck} label="Puntaje ATS" value="—" hint="Próximamente" />
        <StatCard icon={Sparkles} label="Plan actual" value={profile?.plan === "pro" ? "Pro" : "Gratis"} />
      </div>

      {/* Recent + Quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Editado recientemente</h2>
            <Link to="/panel/curriculums" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Ver todos <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recent ? (
            <Link
              to="/cv/$id"
              params={{ id: recent.id }}
              className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <div className="font-semibold">{recent.title}</div>
                <div className="text-sm text-muted-foreground">
                  {recent.headline || "Sin título profesional"}
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${completion(recent)}%` }} />
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{completion(recent)}%</span>
            </Link>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-12 text-center">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">Aún no tienes ningún CV.</p>
              <Button className="mt-4 gap-2" onClick={createResume} disabled={creating}>
                <Plus className="h-4 w-4" /> Crear mi primer CV
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Acciones rápidas</h2>
          <div className="space-y-2">
            <QuickAction to="/panel/ia" icon={Sparkles} label="Generar con IA" />
            <QuickAction to="/panel/plantillas" icon={LayoutTemplate} label="Explorar plantillas" />
            <QuickAction to="/panel/cartas" icon={Mail} label="Carta de presentación" />
            <QuickAction to="/panel/ats" icon={ShieldCheck} label="Verificar ATS" />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="grid gap-4 sm:grid-cols-2">
        <TipCard title="Usa verbos de acción" text="Comienza tus logros con verbos como “lideré”, “desarrollé” o “aumenté”." />
        <TipCard title="Cuantifica resultados" text="Incluye números y porcentajes para demostrar tu impacto real." />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint }: { icon: typeof FileText; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <p className="mt-3 font-display text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint ?? label}</p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }: { to: string; icon: typeof FileText; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/40"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      {label}
      <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function TipCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-card p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
        <Lightbulb className="h-4 w-4" />
      </span>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
