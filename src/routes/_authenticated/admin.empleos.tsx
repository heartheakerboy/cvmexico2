import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Trash2, Loader2, Pencil, Briefcase, Star, DollarSign,
  GraduationCap, Building2, FileText,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/empleos")({
  component: JobsAdmin,
});

type Occupation = {
  id: string;
  title: string;
  slug: string;
  industry: string | null;
  description: string | null;
  skills: string[];
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  universities: string[];
  resume_examples: string[];
  featured: boolean;
};

const empty = {
  title: "", slug: "", industry: "", description: "",
  skills: "", salary_min: "", salary_max: "", salary_currency: "USD",
  universities: "", resume_examples: "", featured: false,
};
type Form = typeof empty;

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function toList(s: string) {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
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

function fmtSalary(o: Occupation) {
  if (o.salary_min == null && o.salary_max == null) return "—";
  const f = (n: number) => `${(n / 1000).toFixed(0)}k`;
  const cur = o.salary_currency || "USD";
  if (o.salary_min != null && o.salary_max != null) return `${f(o.salary_min)}–${f(o.salary_max)} ${cur}`;
  return `${f((o.salary_min ?? o.salary_max)!)} ${cur}`;
}

function JobsAdmin() {
  const [rows, setRows] = useState<Occupation[] | null>(null);
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data, error } = await supabase.from("occupations").select("*").order("title");
    if (error) { toast.error(error.message); return; }
    setRows(data as Occupation[]);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows ?? [];
    return (rows ?? []).filter((r) =>
      r.title.toLowerCase().includes(q) ||
      (r.industry ?? "").toLowerCase().includes(q) ||
      r.skills.some((s) => s.toLowerCase().includes(q)));
  }, [rows, query]);

  const industries = useMemo(
    () => new Set((rows ?? []).map((r) => r.industry).filter(Boolean)).size, [rows]);

  function openNew() { setEditId(null); setForm(empty); setDialog(true); }
  function openEdit(o: Occupation) {
    setEditId(o.id);
    setForm({
      title: o.title, slug: o.slug, industry: o.industry ?? "", description: o.description ?? "",
      skills: o.skills.join(", "), salary_min: o.salary_min?.toString() ?? "",
      salary_max: o.salary_max?.toString() ?? "", salary_currency: o.salary_currency,
      universities: o.universities.join(", "), resume_examples: o.resume_examples.join(", "),
      featured: o.featured,
    });
    setDialog(true);
  }

  async function save() {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      industry: form.industry.trim() || null,
      description: form.description.trim() || null,
      skills: toList(form.skills),
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      salary_currency: form.salary_currency.trim() || "USD",
      universities: toList(form.universities),
      resume_examples: toList(form.resume_examples),
      featured: form.featured,
    };
    const res = editId
      ? await supabase.from("occupations").update(payload).eq("id", editId)
      : await supabase.from("occupations").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(editId ? "Job role updated" : "Job role created");
    setDialog(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this job role?")) return;
    const { error } = await supabase.from("occupations").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Job role deleted");
    setRows((r) => (r ?? []).filter((x) => x.id !== id));
  }

  async function toggleFeatured(o: Occupation) {
    const { error } = await supabase.from("occupations").update({ featured: !o.featured }).eq("id", o.id);
    if (error) { toast.error(error.message); return; }
    setRows((r) => (r ?? []).map((x) => x.id === o.id ? { ...x, featured: !x.featured } : x));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Jobs Database</h1>
          <p className="text-sm text-muted-foreground">Occupations, skills, salary ranges, and resume tips.</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" /> New Job Role</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={Briefcase} label="Job Roles" value={(rows?.length ?? 0).toString()} />
        <Kpi icon={Building2} label="Industries" value={industries.toString()} />
        <Kpi icon={Star} label="Featured" value={(rows ?? []).filter((r) => r.featured).length.toString()} />
        <Kpi icon={FileText} label="Resume Examples" value={(rows ?? []).reduce((a, r) => a + r.resume_examples.length, 0).toString()} />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by title, industry, or skill…"
          value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Role</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows === null ? (
              <TableRow><TableCell colSpan={6} className="py-10 text-center">
                <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
              </TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                No job roles found.
              </TableCell></TableRow>
            ) : filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <div className="font-medium">{o.title}</div>
                  <div className="text-xs text-muted-foreground">/{o.slug}</div>
                </TableCell>
                <TableCell>{o.industry ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {o.skills.slice(0, 3).map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                    {o.skills.length > 3 && <Badge variant="outline">+{o.skills.length - 3}</Badge>}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{fmtSalary(o)}</TableCell>
                <TableCell>
                  <Switch checked={o.featured} onCheckedChange={() => toggleFeatured(o)} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(o)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(o.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Job Role" : "New Job Role"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Industry</Label>
              <Input value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> Skills (comma separated)</Label>
              <Input value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> Min</Label>
                <Input type="number" value={form.salary_min}
                  onChange={(e) => setForm((f) => ({ ...f, salary_min: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Max</Label>
                <Input type="number" value={form.salary_max}
                  onChange={(e) => setForm((f) => ({ ...f, salary_max: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Input value={form.salary_currency}
                  onChange={(e) => setForm((f) => ({ ...f, salary_currency: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1"><Building2 className="h-4 w-4" /> Universities (comma separated)</Label>
              <Input value={form.universities} onChange={(e) => setForm((f) => ({ ...f, universities: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1"><FileText className="h-4 w-4" /> Resume Examples (comma separated)</Label>
              <Input value={form.resume_examples} onChange={(e) => setForm((f) => ({ ...f, resume_examples: e.target.value }))} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label>Featured</Label>
              <Switch checked={form.featured} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
