import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Trash2, Loader2, Pencil, Sparkles, Cpu, History,
  DollarSign, Gauge, CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/ia")({
  component: AiAdmin,
});

type Prompt = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  content: string;
  model: string | null;
  temperature: number;
  max_tokens: number | null;
  version: number;
  active: boolean;
};

type Model = {
  id: string;
  name: string;
  model_id: string;
  provider: string;
  cost_input: number;
  cost_output: number;
  monthly_credit_limit: number | null;
  enabled: boolean;
};

type Version = {
  id: string;
  prompt_id: string;
  version: number;
  content: string;
  model: string | null;
  created_at: string;
};

const emptyPrompt = {
  name: "", slug: "", category: "", content: "", model: "",
  temperature: "0.7", max_tokens: "", active: true,
};
type PromptForm = typeof emptyPrompt;

const emptyModel = {
  name: "", model_id: "", provider: "Google",
  cost_input: "0", cost_output: "0", monthly_credit_limit: "", enabled: true,
};
type ModelForm = typeof emptyModel;

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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

function AiAdmin() {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);
  const [models, setModels] = useState<Model[] | null>(null);

  const [query, setQuery] = useState("");

  const [promptDialog, setPromptDialog] = useState(false);
  const [promptEditId, setPromptEditId] = useState<string | null>(null);
  const [promptForm, setPromptForm] = useState<PromptForm>(emptyPrompt);

  const [modelDialog, setModelDialog] = useState(false);
  const [modelEditId, setModelEditId] = useState<string | null>(null);
  const [modelForm, setModelForm] = useState<ModelForm>(emptyModel);

  const [versionsFor, setVersionsFor] = useState<Prompt | null>(null);
  const [versions, setVersions] = useState<Version[] | null>(null);

  const [saving, setSaving] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string>("deepseek");
  const [updatingProvider, setUpdatingProvider] = useState(false);

  async function load() {
    const [p, m, s] = await Promise.all([
      supabase.from("ai_prompts").select("*").order("name"),
      supabase.from("ai_models").select("*").order("name"),
      supabase.from("system_settings").select("value").eq("key", "active_ai_provider").maybeSingle(),
    ]);
    if (p.error) toast.error(p.error.message); else setPrompts(p.data as Prompt[]);
    if (m.error) toast.error(m.error.message); else setModels(m.data as Model[]);
    if (s.data?.value && typeof s.data.value === "object") {
      setActiveProvider((s.data.value as any).provider || "deepseek");
    }
  }

  async function updateActiveProvider(val: string) {
    setUpdatingProvider(true);
    const { error } = await supabase
      .from("system_settings")
      .upsert({ key: "active_ai_provider", value: { provider: val } }, { onConflict: "key" });
    setUpdatingProvider(false);
    if (error) {
      toast.error(error.message);
    } else {
      setActiveProvider(val);
      toast.success("Proveedor DeepSeek activo configurado");
    }
  }

  useEffect(() => { load(); }, []);

  const filteredPrompts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return prompts ?? [];
    return (prompts ?? []).filter((p) =>
      p.name.toLowerCase().includes(q) || (p.category ?? "").toLowerCase().includes(q));
  }, [prompts, query]);

  const monthlyCredits = useMemo(
    () => (models ?? []).reduce((a, m) => a + (m.monthly_credit_limit ?? 0), 0), [models]);
  const avgCost = useMemo(() => {
    const en = (models ?? []).filter((m) => m.enabled);
    if (!en.length) return 0;
    return en.reduce((a, m) => a + m.cost_input + m.cost_output, 0) / en.length;
  }, [models]);

  // Prompt CRUD
  function openNewPrompt() { setPromptEditId(null); setPromptForm(emptyPrompt); setPromptDialog(true); }
  function openEditPrompt(p: Prompt) {
    setPromptEditId(p.id);
    setPromptForm({
      name: p.name, slug: p.slug, category: p.category ?? "", content: p.content,
      model: p.model ?? "", temperature: p.temperature.toString(),
      max_tokens: p.max_tokens?.toString() ?? "", active: p.active,
    });
    setPromptDialog(true);
  }

  async function savePrompt() {
    if (!promptForm.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    setSaving(true);
    const base = {
      name: promptForm.name.trim(),
      slug: promptForm.slug.trim() || slugify(promptForm.name),
      category: promptForm.category.trim() || null,
      content: promptForm.content,
      model: promptForm.model.trim() || null,
      temperature: Number(promptForm.temperature) || 0.7,
      max_tokens: promptForm.max_tokens ? Number(promptForm.max_tokens) : null,
      active: promptForm.active,
    };
    if (promptEditId) {
      const prev = (prompts ?? []).find((p) => p.id === promptEditId)!;
      const contentChanged = prev.content !== base.content || prev.model !== base.model;
      const nextVersion = contentChanged ? prev.version + 1 : prev.version;
      const { error } = await supabase.from("ai_prompts")
        .update({ ...base, version: nextVersion }).eq("id", promptEditId);
      if (!error && contentChanged) {
        await supabase.from("ai_prompt_versions").insert({
          prompt_id: promptEditId, version: nextVersion, content: base.content,
          model: base.model, temperature: base.temperature, max_tokens: base.max_tokens,
        });
      }
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      toast.success(contentChanged ? `Guardado como v${nextVersion}` : "Prompt actualizado");
    } else {
      const { data, error } = await supabase.from("ai_prompts").insert({ ...base, version: 1 }).select().single();
      if (!error && data) {
        await supabase.from("ai_prompt_versions").insert({
          prompt_id: data.id, version: 1, content: base.content,
          model: base.model, temperature: base.temperature, max_tokens: base.max_tokens,
        });
      }
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Prompt creado");
    }
    setPromptDialog(false);
    load();
  }

  async function removePrompt(id: string) {
    if (!confirm("¿Eliminar este prompt y su historial?")) return;
    const { error } = await supabase.from("ai_prompts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Prompt eliminado");
    setPrompts((r) => (r ?? []).filter((x) => x.id !== id));
  }

  async function togglePrompt(p: Prompt) {
    const { error } = await supabase.from("ai_prompts").update({ active: !p.active }).eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    setPrompts((r) => (r ?? []).map((x) => x.id === p.id ? { ...x, active: !x.active } : x));
  }

  async function openVersions(p: Prompt) {
    setVersionsFor(p); setVersions(null);
    const { data, error } = await supabase.from("ai_prompt_versions")
      .select("*").eq("prompt_id", p.id).order("version", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setVersions(data as Version[]);
  }

  // Model CRUD
  function openNewModel() { setModelEditId(null); setModelForm(emptyModel); setModelDialog(true); }
  function openEditModel(m: Model) {
    setModelEditId(m.id);
    setModelForm({
      name: m.name, model_id: m.model_id, provider: m.provider,
      cost_input: m.cost_input.toString(), cost_output: m.cost_output.toString(),
      monthly_credit_limit: m.monthly_credit_limit?.toString() ?? "", enabled: m.enabled,
    });
    setModelDialog(true);
  }

  async function saveModel() {
    if (!modelForm.name.trim() || !modelForm.model_id.trim()) { toast.error("Nombre y ID del modelo son obligatorios"); return; }
    setSaving(true);
    const payload = {
      name: modelForm.name.trim(),
      model_id: modelForm.model_id.trim(),
      provider: modelForm.provider.trim() || "Google",
      cost_input: Number(modelForm.cost_input) || 0,
      cost_output: Number(modelForm.cost_output) || 0,
      monthly_credit_limit: modelForm.monthly_credit_limit ? Number(modelForm.monthly_credit_limit) : null,
      enabled: modelForm.enabled,
    };
    const res = modelEditId
      ? await supabase.from("ai_models").update(payload).eq("id", modelEditId)
      : await supabase.from("ai_models").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(modelEditId ? "Modelo actualizado" : "Modelo creado");
    setModelDialog(false);
    load();
  }

  async function removeModel(id: string) {
    if (!confirm("¿Eliminar este modelo?")) return;
    const { error } = await supabase.from("ai_models").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Modelo eliminado");
    setModels((r) => (r ?? []).filter((x) => x.id !== id));
  }

  async function toggleModel(m: Model) {
    const { error } = await supabase.from("ai_models").update({ enabled: !m.enabled }).eq("id", m.id);
    if (error) { toast.error(error.message); return; }
    setModels((r) => (r ?? []).map((x) => x.id === m.id ? { ...x, enabled: !x.enabled } : x));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">AI management</h1>
        <p className="text-sm text-muted-foreground">Prompts, modelos, créditos y costos.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={Sparkles} label="Prompts activos" value={(prompts ?? []).filter((p) => p.active).length.toString()} />
        <Kpi icon={Cpu} label="Modelos activos" value={(models ?? []).filter((m) => m.enabled).length.toString()} />
        <Kpi icon={CreditCard} label="Límite crédito/mes" value={monthlyCredits.toLocaleString()} />
        <Kpi icon={DollarSign} label="Costo prom. /1k tok" value={`$${avgCost.toFixed(2)}`} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-medium text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            Proveedor de IA Principal Activo
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selecciona qué motor de inteligencia artificial responderá a las peticiones del editor y simulador.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={activeProvider} onValueChange={updateActiveProvider} disabled={updatingProvider}>
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deepseek">DeepSeek AI (Chat)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="prompts">
        <TabsList>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="models">Modelos</TabsTrigger>
          <TabsTrigger value="costs">Costos y límites</TabsTrigger>
        </TabsList>

        {/* Prompts */}
        <TabsContent value="prompts" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar prompt…" value={query}
                onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Button onClick={openNewPrompt}><Plus className="mr-1 h-4 w-4" /> Nuevo prompt</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Versión</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prompts === null ? (
                  <TableRow><TableCell colSpan={6} className="py-10 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                  </TableCell></TableRow>
                ) : filteredPrompts.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    Sin prompts.
                  </TableCell></TableRow>
                ) : filteredPrompts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.slug}</div>
                    </TableCell>
                    <TableCell>{p.category ?? "—"}</TableCell>
                    <TableCell className="text-xs">{p.model ?? "—"}</TableCell>
                    <TableCell><Badge variant="secondary">v{p.version}</Badge></TableCell>
                    <TableCell><Switch checked={p.active} onCheckedChange={() => togglePrompt(p)} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openVersions(p)} title="Historial">
                        <History className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditPrompt(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removePrompt(p.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Models */}
        <TabsContent value="models" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openNewModel}><Plus className="mr-1 h-4 w-4" /> Nuevo modelo</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Costo in / out (1k)</TableHead>
                  <TableHead>Límite/mes</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models === null ? (
                  <TableRow><TableCell colSpan={6} className="py-10 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                  </TableCell></TableRow>
                ) : models.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    Sin modelos.
                  </TableCell></TableRow>
                ) : models.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.model_id}</div>
                    </TableCell>
                    <TableCell>{m.provider}</TableCell>
                    <TableCell className="whitespace-nowrap">${m.cost_input} / ${m.cost_output}</TableCell>
                    <TableCell>{m.monthly_credit_limit?.toLocaleString() ?? "—"}</TableCell>
                    <TableCell><Switch checked={m.enabled} onCheckedChange={() => toggleModel(m)} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditModel(m)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeModel(m.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Costs & limits */}
        <TabsContent value="costs" className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {(models ?? []).map((m) => {
              const total = m.cost_input + m.cost_output;
              const limit = m.monthly_credit_limit ?? 0;
              return (
                <div key={m.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{m.name}</div>
                    <Badge variant={m.enabled ? "default" : "outline"}>{m.enabled ? "Activo" : "Inactivo"}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" /> Entrada</div>
                      <div className="font-semibold">${m.cost_input}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" /> Salida</div>
                      <div className="font-semibold">${m.cost_output}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1"><Gauge className="h-3 w-3" /> Total/1k</div>
                      <div className="font-semibold">${total.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-3 w-3" /> Límite mensual: {limit ? limit.toLocaleString() + " créditos" : "sin límite"}
                  </div>
                </div>
              );
            })}
            {(models ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">Añade modelos para ver costos y límites.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Prompt dialog */}
      <Dialog open={promptDialog} onOpenChange={setPromptDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{promptEditId ? "Editar prompt" : "Nuevo prompt"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input value={promptForm.name}
                onChange={(e) => setPromptForm((f) => ({ ...f, name: e.target.value, slug: promptEditId ? f.slug : slugify(e.target.value) }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input value={promptForm.slug} onChange={(e) => setPromptForm((f) => ({ ...f, slug: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Categoría</Label>
                <Input value={promptForm.category} onChange={(e) => setPromptForm((f) => ({ ...f, category: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Contenido del prompt</Label>
              <Textarea rows={5} value={promptForm.content}
                onChange={(e) => setPromptForm((f) => ({ ...f, content: e.target.value }))} />
              <p className="text-xs text-muted-foreground">Usa {"{{variables}}"} para valores dinámicos. Al cambiar el contenido se crea una nueva versión.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Modelo</Label>
                <Input value={promptForm.model} onChange={(e) => setPromptForm((f) => ({ ...f, model: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Temperatura</Label>
                <Input type="number" step="0.1" value={promptForm.temperature}
                  onChange={(e) => setPromptForm((f) => ({ ...f, temperature: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Max tokens</Label>
                <Input type="number" value={promptForm.max_tokens}
                  onChange={(e) => setPromptForm((f) => ({ ...f, max_tokens: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label>Activo</Label>
              <Switch checked={promptForm.active} onCheckedChange={(v) => setPromptForm((f) => ({ ...f, active: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromptDialog(false)}>Cancelar</Button>
            <Button onClick={savePrompt} disabled={saving}>
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Model dialog */}
      <Dialog open={modelDialog} onOpenChange={setModelDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{modelEditId ? "Editar modelo" : "Nuevo modelo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input value={modelForm.name} onChange={(e) => setModelForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>ID del modelo</Label>
                <Input value={modelForm.model_id} placeholder="deepseek-chat"
                  onChange={(e) => setModelForm((f) => ({ ...f, model_id: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Proveedor</Label>
                <Input value={modelForm.provider} onChange={(e) => setModelForm((f) => ({ ...f, provider: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Costo entrada /1k</Label>
                <Input type="number" step="0.01" value={modelForm.cost_input}
                  onChange={(e) => setModelForm((f) => ({ ...f, cost_input: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Costo salida /1k</Label>
                <Input type="number" step="0.01" value={modelForm.cost_output}
                  onChange={(e) => setModelForm((f) => ({ ...f, cost_output: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Límite/mes</Label>
                <Input type="number" value={modelForm.monthly_credit_limit}
                  onChange={(e) => setModelForm((f) => ({ ...f, monthly_credit_limit: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label>Activo</Label>
              <Switch checked={modelForm.enabled} onCheckedChange={(v) => setModelForm((f) => ({ ...f, enabled: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModelDialog(false)}>Cancelar</Button>
            <Button onClick={saveModel} disabled={saving}>
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Versions dialog */}
      <Dialog open={!!versionsFor} onOpenChange={(o) => !o && setVersionsFor(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Historial de versiones — {versionsFor?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {versions === null ? (
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
            ) : versions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin versiones registradas.</p>
            ) : versions.map((v) => (
              <div key={v.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">v{v.version}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">{v.content}</p>
                {v.model && <p className="mt-1 text-xs text-muted-foreground">Modelo: {v.model}</p>}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
