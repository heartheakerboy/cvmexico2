import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, FileText, Trash2, Loader2, Search, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/panel/curriculums")({
  component: MyResumes,
});

type Resume = { id: string; title: string; headline: string | null; updated_at: string };

function MyResumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");

  async function load() {
    const { data } = await supabase
      .from("resumes")
      .select("id, title, headline, updated_at")
      .order("updated_at", { ascending: false });
    setResumes(data ?? []);
  }

  useEffect(() => {
    load();
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("import") === "true" && localStorage.getItem("cvai_imported_resume")) {
        createResume();
      }
    }
  }, []);

  const filtered = useMemo(() => {
    if (!resumes) return [];
    const q = query.trim().toLowerCase();
    if (!q) return resumes;
    return resumes.filter((r) => r.title.toLowerCase().includes(q) || (r.headline ?? "").toLowerCase().includes(q));
  }, [resumes, query]);

  async function createResume() {
    setCreating(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return setCreating(false);
    const { data, error } = await supabase
      .from("resumes")
      .insert({ user_id: userData.user.id, title: "Mi CV" })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) return toast.error("No se pudo crear el CV");
    navigate({ to: "/cv/$id", params: { id: data.id } });
  }

  async function remove(id: string) {
    const { error } = await supabase.from("resumes").delete().eq("id", id);
    if (error) return toast.error("No se pudo eliminar");
    setResumes((r) => (r ? r.filter((x) => x.id !== id) : r));
    toast.success("CV eliminado");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Mis CV</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {resumes ? `${resumes.length} currículum${resumes.length === 1 ? "" : "s"}` : "Cargando…"}
          </p>
        </div>
        <Button className="gap-2" onClick={createResume} disabled={creating}>
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Crear nuevo CV
        </Button>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar currículum…" className="pl-9" />
      </div>

      {!resumes ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/50" />
          <h2 className="mt-4 font-display text-lg font-semibold">
            {resumes.length === 0 ? "Aún no tienes ningún CV" : "Sin resultados"}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {resumes.length === 0
              ? "Empieza creando tu primer currículum profesional optimizado para el mercado laboral mexicano."
              : "Prueba con otra búsqueda."}
          </p>
          {resumes.length === 0 && (
            <Button className="mt-6 gap-2" onClick={createResume} disabled={creating}>
              <Plus className="h-4 w-4" /> Crear mi primer CV
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {filtered.map((cv) => (
            <div key={cv.id} className="group flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <Link to="/cv/$id" params={{ id: cv.id }} className="flex flex-1 items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-medium">{cv.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {cv.headline || "Sin título profesional"} · {new Date(cv.updated_at).toLocaleDateString("es-MX")}
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-1">
                <Link to="/cv/$id" params={{ id: cv.id }}>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => remove(cv.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
