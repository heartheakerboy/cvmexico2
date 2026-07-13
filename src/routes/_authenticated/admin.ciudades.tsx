import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Trash2, Loader2, Pencil, MapPin, Globe, Shield,
  Building2, GraduationCap, DollarSign, HelpCircle, FileText
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { getStaticCities, type City } from "@/lib/cities-data";

export const Route = createFileRoute("/_authenticated/admin/ciudades")({
  component: CitiesAdmin,
});

type CityRow = {
  id: string;
  slug: string;
  name: string;
  state_code: string;
  phone_area_code: string;
  is_active: boolean;
  hero_image: string | null;
  salary_info: any;
  industries: string[];
  hiring_sectors: string[];
  companies: string[];
  universities: string[];
  resume_tips: string[];
  cover_letter_tips: string[];
  interview_tips: string[];
  faqs: any[];
  seo_title: string | null;
  seo_description: string | null;
};

const emptyForm = {
  name: "",
  slug: "",
  state_code: "",
  phone_area_code: "",
  is_active: true,
  hero_image: "",
  salary_info: JSON.stringify({
    "Ingeniero de Software": { "min": 25000, "max": 75000, "currency": "MXN" },
    "Gerente de Proyectos": { "min": 22000, "max": 55000, "currency": "MXN" },
    "Contador": { "min": 14000, "max": 35000, "currency": "MXN" }
  }, null, 2),
  industries: "",
  hiring_sectors: "",
  companies: "",
  universities: "",
  resume_tips: "",
  cover_letter_tips: "",
  interview_tips: "",
  faqs: JSON.stringify([
    {
      "q": "¿Cómo es el mercado laboral aquí?",
      "a": "El mercado es dinámico con oportunidades en diversas industrias locales."
    }
  ], null, 2),
  seo_title: "",
  seo_description: ""
};

type FormState = typeof emptyForm;

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function toList(s: string) {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

function toLines(s: string) {
  return s.split("\n").map((x) => x.trim()).filter(Boolean);
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

function CitiesAdmin() {
  const [rows, setRows] = useState<CityRow[] | null>(null);
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const { data, error } = await supabase.from("cities").select("*").order("name");
      if (error) {
        // If table doesn't exist yet, we can load from static data to show in admin panel
        console.warn("Database cities query failed, falling back to static cities config: ", error.message);
        const staticList = getStaticCities().map((c, i) => ({
          id: `static-${i}`,
          slug: c.slug,
          name: c.name,
          state_code: c.stateCode,
          phone_area_code: c.phoneAreaCode,
          is_active: c.isActive,
          hero_image: c.heroImage || null,
          salary_info: c.salaryInfo,
          industries: c.industries,
          hiring_sectors: c.hiringSectors,
          companies: c.companies,
          universities: c.universities,
          resume_tips: c.resumeTips,
          cover_letter_tips: c.coverLetterTips,
          interview_tips: c.interviewTips,
          faqs: c.faqs,
          seo_title: c.seoTitle,
          seo_description: c.seoDescription
        }));
        setRows(staticList);
      } else {
        setRows(data as CityRow[]);
      }
    } catch (e) {
      toast.error("Error al conectar con la base de datos.");
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows ?? [];
    return (rows ?? []).filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.slug.toLowerCase().includes(q) ||
      r.state_code.toLowerCase().includes(q));
  }, [rows, query]);

  function openNew() { 
    setEditId(null); 
    setForm(emptyForm); 
    setDialog(true); 
  }

  function openEdit(c: CityRow) {
    setEditId(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      state_code: c.state_code,
      phone_area_code: c.phone_area_code,
      is_active: c.is_active,
      hero_image: c.hero_image ?? "",
      salary_info: JSON.stringify(c.salary_info || {}, null, 2),
      industries: (c.industries || []).join(", "),
      hiring_sectors: (c.hiring_sectors || []).join(", "),
      companies: (c.companies || []).join(", "),
      universities: (c.universities || []).join(", "),
      resume_tips: (c.resume_tips || []).join("\n"),
      cover_letter_tips: (c.cover_letter_tips || []).join("\n"),
      interview_tips: (c.interview_tips || []).join("\n"),
      faqs: JSON.stringify(c.faqs || [], null, 2),
      seo_title: c.seo_title ?? "",
      seo_description: c.seo_description ?? ""
    });
    setDialog(true);
  }

  async function save() {
    if (!form.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    
    let salaryObj = {};
    let faqArr = [];
    try {
      salaryObj = JSON.parse(form.salary_info);
    } catch {
      toast.error("El formato de Salarios (JSON) es inválido");
      return;
    }
    try {
      faqArr = JSON.parse(form.faqs);
    } catch {
      toast.error("El formato de FAQs (JSON) es inválido");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      state_code: form.state_code.trim(),
      phone_area_code: form.phone_area_code.trim(),
      is_active: form.is_active,
      hero_image: form.hero_image.trim() || null,
      salary_info: salaryObj,
      industries: toList(form.industries),
      hiring_sectors: toList(form.hiring_sectors),
      companies: toList(form.companies),
      universities: toList(form.universities),
      resume_tips: toLines(form.resume_tips),
      cover_letter_tips: toLines(form.cover_letter_tips),
      interview_tips: toLines(form.interview_tips),
      faqs: faqArr,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
    };

    // If it's a static fallback item, we insert instead of update
    const isStaticMock = editId?.startsWith("static-");
    const res = (editId && !isStaticMock)
      ? await supabase.from("cities").update(payload).eq("id", editId)
      : await supabase.from("cities").insert(payload);

    setSaving(false);
    if (res.error) { 
      toast.error("Error al guardar: " + res.error.message); 
      return; 
    }
    
    toast.success(editId && !isStaticMock ? "Ciudad actualizada en base de datos" : "Ciudad creada en base de datos");
    setDialog(false);
    load();
  }

  async function remove(id: string) {
    if (id.startsWith("static-")) {
      toast.error("No se pueden eliminar las ciudades del fallback estático. Ejecuta primero las migraciones SQL en Supabase.");
      return;
    }
    if (!confirm("¿Eliminar esta ciudad de la base de datos?")) return;
    const { error } = await supabase.from("cities").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Ciudad eliminada");
    setRows((r) => (r ?? []).filter((x) => x.id !== id));
  }

  async function toggleActive(c: CityRow) {
    if (c.id.startsWith("static-")) {
      toast.error("Crea la tabla en base de datos para habilitar/deshabilitar de forma persistente.");
      return;
    }
    const { error } = await supabase.from("cities").update({ is_active: !c.is_active }).eq("id", c.id);
    if (error) { toast.error(error.message); return; }
    setRows((r) => (r ?? []).map((x) => x.id === c.id ? { ...x, is_active: !x.is_active } : x));
    toast.success(`${c.name} ${!c.is_active ? "habilitada" : "deshabilitada"}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">City Management (SEO)</h1>
          <p className="text-sm text-muted-foreground">Administra páginas de aterrizaje locales y personalización de CVs por ciudad.</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" /> Nueva ciudad</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={MapPin} label="Ciudades registradas" value={(rows?.length ?? 0).toString()} />
        <Kpi icon={Globe} label="Ciudades activas" value={(rows ?? []).filter((r) => r.is_active).length.toString()} />
        <Kpi icon={Building2} label="Promedio empresas/ciudad" value={(rows?.length ? Math.round(rows.reduce((a, r) => a + (r.companies?.length || 0), 0) / rows.length) : 0).toString()} />
        <Kpi icon={GraduationCap} label="Promedio univs/ciudad" value={(rows?.length ? Math.round(rows.reduce((a, r) => a + (r.universities?.length || 0), 0) / rows.length) : 0).toString()} />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar ciudad por nombre o slug..."
          value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ciudad</TableHead>
              <TableHead>Slug / Estado</TableHead>
              <TableHead>Lada</TableHead>
              <TableHead>Empresas & Univs</TableHead>
              <TableHead>Activa</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows === null ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  Sin resultados.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-semibold text-foreground flex items-center gap-1.5 py-4">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    {c.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <code className="bg-secondary px-1.5 py-0.5 rounded mr-1">/{c.slug}</code>
                    <span className="font-medium">({c.state_code})</span>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-foreground">+{c.phone_area_code}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {c.companies?.length || 0} empresas / {c.universities?.length || 0} univs
                  </TableCell>
                  <TableCell>
                    <Switch checked={c.is_active} onCheckedChange={() => toggleActive(c)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => remove(c.id)} title="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Editar Ciudad" : "Nueva Ciudad"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-name">Nombre de la Ciudad</Label>
                <Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Monterrey" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-slug">Slug URL (vacío para autogenerar)</Label>
                <Input id="c-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Ej. monterrey" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-state">Abreviatura del Estado</Label>
                <Input id="c-state" value={form.state_code} onChange={(e) => setForm({ ...form, state_code: e.target.value })} placeholder="Ej. N.L." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-lada">Código de Área Telefónico (Lada)</Label>
                <Input id="c-lada" value={form.phone_area_code} onChange={(e) => setForm({ ...form, phone_area_code: e.target.value })} placeholder="Ej. 81" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c-hero">Hero Image URL</Label>
              <Input id="c-hero" value={form.hero_image} onChange={(e) => setForm({ ...form, hero_image: e.target.value })} placeholder="https://example.com/images/hero.jpg" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-companies">Empresas Locales (separadas por comas)</Label>
                <Input id="c-companies" value={form.companies} onChange={(e) => setForm({ ...form, companies: e.target.value })} placeholder="Cemex, Femsa, Ternium" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-univs">Universidades Locales (separadas por comas)</Label>
                <Input id="c-univs" value={form.universities} onChange={(e) => setForm({ ...form, universities: e.target.value })} placeholder="UANL, Tec de Monterrey" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-industries">Industrias Populares (separadas por comas)</Label>
                <Input id="c-industries" value={form.industries} onChange={(e) => setForm({ ...form, industries: e.target.value })} placeholder="Manufactura, Siderurgia, Logística" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-sectors">Sectores de Mayor Contratación (separados por comas)</Label>
                <Input id="c-sectors" value={form.hiring_sectors} onChange={(e) => setForm({ ...form, hiring_sectors: e.target.value })} placeholder="Ingeniería, Ventas, Finanzas" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c-resume-tips">Consejos para Currículum (uno por línea)</Label>
              <Textarea id="c-resume-tips" rows={3} value={form.resume_tips} onChange={(e) => setForm({ ...form, resume_tips: e.target.value })} placeholder="Describe tus logros con verbos de acción..." />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-cl-tips">Consejos Carta de Presentación (uno por línea)</Label>
                <Textarea id="c-cl-tips" rows={3} value={form.cover_letter_tips} onChange={(e) => setForm({ ...form, cover_letter_tips: e.target.value })} placeholder="Dirígete al reclutador local..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-int-tips">Consejos para Entrevistas (uno por línea)</Label>
                <Textarea id="c-int-tips" rows={3} value={form.interview_tips} onChange={(e) => setForm({ ...form, interview_tips: e.target.value })} placeholder="Investiga los proyectos locales de la empresa..." />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-salaries">Información de Salarios (JSON Map)</Label>
                <Textarea id="c-salaries" className="font-mono text-xs" rows={5} value={form.salary_info} onChange={(e) => setForm({ ...form, salary_info: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-faqs">Preguntas Frecuentes (JSON Array)</Label>
                <Textarea id="c-faqs" className="font-mono text-xs" rows={5} value={form.faqs} onChange={(e) => setForm({ ...form, faqs: e.target.value })} />
              </div>
            </div>

            <div className="border-t pt-3 mt-3 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-seo-title">SEO Title</Label>
                <Input id="c-seo-title" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} placeholder="Plantillas de Currículum en..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-seo-desc">SEO Meta Description</Label>
                <Input id="c-seo-desc" value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} placeholder="Crea tu currículum optimizado para..." />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Switch id="c-active" checked={form.is_active} onCheckedChange={(val) => setForm({ ...form, is_active: val })} />
              <Label htmlFor="c-active">Habilitar página de aterrizaje de esta ciudad</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)} disabled={saving}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Guardar Ciudad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
