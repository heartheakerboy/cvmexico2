import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutTemplate, Plus, Trash2, Loader2, Copy, Star, Crown, Gauge, Shapes,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TEMPLATES } from "@/lib/resume/registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin/plantillas")({
  component: TemplatesAdmin,
});

type Template = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  thumbnail_url: string | null;
  ats_score: number;
  premium: boolean;
  featured: boolean;
  active: boolean;
  sort_order: number;
};

const emptyForm = { name: "", category: "general", description: "", thumbnail_url: "", ats_score: 90, premium: false };

function atsColor(n: number) {
  if (n >= 90) return "text-emerald-600 bg-emerald-500/10";
  if (n >= 75) return "text-amber-600 bg-amber-500/10";
  return "text-rose-600 bg-rose-500/10";
}

function Kpi({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}

let activeSyncPromise: Promise<any> | null = null;

function TemplatesAdmin() {
  const [items, setItems] = useState<Template[] | null>(null);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (activeSyncPromise) {
      await activeSyncPromise;
      const { data: dbData } = await supabase.from("templates").select("*").order("sort_order");
      setItems((dbData ?? []) as Template[]);
      return;
    }

    let resolveSync: (value?: any) => void = () => {};
    activeSyncPromise = new Promise((resolve) => {
      resolveSync = resolve;
    });

    try {
      const { data: dbData } = await supabase.from("templates").select("*").order("sort_order");
      const dbTemplates = dbData ?? [];

      const missing = TEMPLATES.filter(
        (t) => !dbTemplates.some((db) => db.name.toLowerCase() === t.name.toLowerCase())
      );

      if (missing.length > 0) {
        const inserts = missing.map((t, idx) => ({
          name: t.name,
          category: t.category.toLowerCase(),
          description: t.description,
          ats_score: t.ats ? 95 : 85,
          premium: t.premium,
          active: true,
          sort_order: dbTemplates.length + idx,
        }));

        const { error } = await supabase.from("templates").insert(inserts);
        if (!error) {
          const { data: reloadedData } = await supabase.from("templates").select("*").order("sort_order");
          setItems((reloadedData ?? []) as Template[]);
          return;
        }
      }

      setItems(dbTemplates as Template[]);
    } finally {
      activeSyncPromise = null;
      resolveSync();
    }
  }
  useEffect(() => { load(); }, []);

  const categories = useMemo(
    () => Array.from(new Set((items ?? []).map((t) => t.category))).sort(),
    [items],
  );

  async function createTemplate() {
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);
    const { error } = await supabase.from("templates").insert({
      name: form.name.trim(),
      category: form.category.trim() || "general",
      description: form.description.trim() || null,
      thumbnail_url: form.thumbnail_url.trim() || null,
      ats_score: Math.max(0, Math.min(100, form.ats_score)),
      premium: form.premium,
      sort_order: items?.length ?? 0,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    setForm(emptyForm);
    setDialog(false);
    toast.success("Template created");
    load();
  }

  async function duplicate(t: Template) {
    const { error } = await supabase.from("templates").insert({
      name: `${t.name} (copy)`,
      category: t.category,
      description: t.description,
      thumbnail_url: t.thumbnail_url,
      ats_score: t.ats_score,
      premium: t.premium,
      featured: false,
      active: t.active,
      sort_order: items?.length ?? 0,
    });
    if (error) return toast.error(error.message);
    toast.success("Template duplicated");
    load();
  }

  async function patch(id: string, values: Partial<Template>) {
    const { error } = await supabase.from("templates").update(values).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("templates").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Template deleted");
    load();
  }

  const loading = items === null;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LayoutTemplate className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">Resume Templates</h1>
          <p className="text-sm text-muted-foreground">Manage templates, categories, and featured designs.</p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={LayoutTemplate} label="Templates" value={String(items!.length)} />
            <Kpi icon={Shapes} label="Categories" value={String(categories.length)} />
            <Kpi icon={Star} label="Featured" value={String(items!.filter((t) => t.featured).length)} />
            <Kpi icon={Crown} label="Premium" value={String(items!.filter((t) => t.premium).length)} />
          </div>

          <div className="flex justify-end">
            <Dialog open={dialog} onOpenChange={setDialog}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Create template</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New Template</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Name</Label>
                      <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Modern" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Category</Label>
                      <Input value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} placeholder="modern" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Description</Label>
                    <Textarea rows={2} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} placeholder="Clean layout, fully ATS compliant" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Thumbnail URL</Label>
                    <Input value={form.thumbnail_url} onChange={(e) => setForm((s) => ({ ...s, thumbnail_url: e.target.value }))} placeholder="https://..." />
                  </div>
                  <div className="grid grid-cols-2 items-end gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">ATS Score (0-100)</Label>
                      <Input type="number" min={0} max={100} value={form.ats_score} onChange={(e) => setForm((s) => ({ ...s, ats_score: Number(e.target.value) }))} />
                    </div>
                    <div className="flex items-center gap-2 pb-2">
                      <Switch checked={form.premium} onCheckedChange={(v) => setForm((s) => ({ ...s, premium: v }))} />
                      <Label className="text-xs">Premium</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createTemplate} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items!.length === 0 && (
              <p className="text-sm text-muted-foreground">No templates yet. Create the first one.</p>
            )}
            {items!.map((t) => (
              <div key={t.id} className={`rounded-2xl border p-5 ${t.active ? "border-border bg-card" : "border-dashed border-border bg-card/50 opacity-70"}`}>
                <div className="mb-3 flex aspect-[3/4] max-h-48 items-center justify-center overflow-hidden rounded-xl bg-muted">
                  {t.thumbnail_url ? (
                    <img src={t.thumbnail_url} alt={t.name} className="h-full w-full object-cover" />
                  ) : (
                    <LayoutTemplate className="h-10 w-10 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{t.name}</h3>
                    <p className="text-xs text-muted-foreground">{t.category}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${atsColor(t.ats_score)}`}>
                    <Gauge className="h-3 w-3" />ATS {t.ats_score}
                  </span>
                </div>
                {t.description && <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>}

                <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground"><Crown className="h-3.5 w-3.5" />Premium</span>
                    <Switch checked={t.premium} onCheckedChange={(v) => patch(t.id, { premium: v })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground"><Star className="h-3.5 w-3.5" />Featured</span>
                    <Switch checked={t.featured} onCheckedChange={(v) => patch(t.id, { featured: v })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground"><LayoutTemplate className="h-3.5 w-3.5" />Active</span>
                    <Switch checked={t.active} onCheckedChange={(v) => patch(t.id, { active: v })} />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => duplicate(t)}>
                    <Copy className="mr-2 h-4 w-4" />Duplicate
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(t.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
