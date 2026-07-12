import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Loader2, Plus, Wand2, Trash2, Save, Copy, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateCoverLetter } from "@/lib/cartas.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/panel/cartas")({
  component: CartasPage,
});

type Carta = {
  id: string;
  title: string;
  company: string | null;
  role: string | null;
  content: string;
  updated_at: string;
};

function CartasPage() {
  const [letters, setLetters] = useState<Carta[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Carta | null>(null);

  async function load() {
    const { data } = await supabase
      .from("cover_letters")
      .select("id, title, company, role, content, updated_at")
      .order("updated_at", { ascending: false });
    setLetters((data as Carta[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes.user?.id;
    if (!uid) return;
    const { data, error } = await supabase
      .from("cover_letters")
      .insert({ user_id: uid, title: "Nueva carta" })
      .select("id, title, company, role, content, updated_at")
      .single();
    if (error || !data) return toast.error("No se pudo crear la carta");
    setLetters((l) => [data as Carta, ...l]);
    setActive(data as Carta);
  }

  async function remove(id: string) {
    const { error } = await supabase.from("cover_letters").delete().eq("id", id);
    if (error) return toast.error("No se pudo eliminar");
    setLetters((l) => l.filter((x) => x.id !== id));
    if (active?.id === id) setActive(null);
    toast.success("Carta eliminada");
  }

  if (active) {
    return (
      <CartaEditor
        carta={active}
        onBack={() => setActive(null)}
        onSaved={(updated) => {
          setLetters((l) => l.map((x) => (x.id === updated.id ? updated : x)));
          setActive(updated);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">Cartas de presentación</h1>
            <p className="text-sm text-muted-foreground">
              Crea cartas persuasivas con IA en minutos.
            </p>
          </div>
        </div>
        <Button className="gap-2" onClick={create}>
          <Plus className="h-4 w-4" /> Nueva carta
        </Button>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : letters.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-display text-lg font-semibold">Aún no tienes cartas</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Crea tu primera carta de presentación y deja que la IA la redacte por ti.
          </p>
          <Button className="mt-5 gap-2" onClick={create}>
            <Plus className="h-4 w-4" /> Crear carta
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {letters.map((c) => (
            <div
              key={c.id}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <button className="flex-1 text-left" onClick={() => setActive(c)}>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {c.company || "Sin empresa"}
                  {c.role ? ` · ${c.role}` : ""}
                </p>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                  {c.content || "Carta vacía. Ábrela para redactarla."}
                </p>
              </button>
              <div className="mt-4 flex items-center justify-between">
                <Button size="sm" variant="outline" onClick={() => setActive(c)}>
                  Abrir
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => remove(c.id)}
                >
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

function CartaEditor({
  carta,
  onBack,
  onSaved,
}: {
  carta: Carta;
  onBack: () => void;
  onSaved: (c: Carta) => void;
}) {
  const generate = useServerFn(generateCoverLetter);
  const [title, setTitle] = useState(carta.title);
  const [company, setCompany] = useState(carta.company ?? "");
  const [role, setRole] = useState(carta.role ?? "");
  const [content, setContent] = useState(carta.content);
  const [highlights, setHighlights] = useState("");
  const [fullName, setFullName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleGenerate() {
    if (!company.trim() || !role.trim()) {
      toast.error("Escribe la empresa y el puesto");
      return;
    }
    setGenerating(true);
    try {
      const res = await generate({ data: { company, role, fullName, highlights } });
      setContent(res.content);
      toast.success("¡Carta generada!");
    } catch (e) {
      console.error(e);
      toast.error("No se pudo generar la carta. Inténtalo de nuevo.");
    } finally {
      setGenerating(false);
    }
  }

  async function save() {
    setSaving(true);
    const { data, error } = await supabase
      .from("cover_letters")
      .update({ title, company, role, content })
      .eq("id", carta.id)
      .select("id, title, company, role, content, updated_at")
      .single();
    setSaving(false);
    if (error || !data) return toast.error("No se pudo guardar");
    onSaved(data as Carta);
    toast.success("Carta guardada");
  }

  function copy() {
    navigator.clipboard.writeText(content);
    toast.success("Carta copiada");
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a mis cartas
      </button>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Empresa *</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Ej. Grupo Bimbo" />
            </div>
            <div className="space-y-1.5">
              <Label>Puesto *</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ej. Analista de datos" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Tu nombre</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre completo" />
          </div>
          <div className="space-y-1.5">
            <Label>Logros a destacar (opcional)</Label>
            <Textarea
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="Experiencia, resultados, habilidades clave..."
              rows={3}
            />
          </div>
          <Button className="w-full gap-2" onClick={handleGenerate} disabled={generating}>
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generando...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" /> Generar con IA
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-col rounded-2xl border border-border bg-card p-6">
          <div className="mb-3 flex items-center justify-between">
            <Label>Contenido de la carta</Label>
            <Button size="sm" variant="ghost" className="gap-1.5" onClick={copy} disabled={!content}>
              <Copy className="h-3.5 w-3.5" /> Copiar
            </Button>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Aquí aparecerá tu carta. También puedes escribirla o editarla manualmente."
            className="min-h-[360px] flex-1 resize-none"
          />
          <Button className="mt-4 gap-2" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar carta
          </Button>
        </div>
      </div>
    </div>
  );
}
