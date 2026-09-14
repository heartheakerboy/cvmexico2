import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Scale, Plus, Trash2, Loader2, Pencil, FileText, CheckCircle2,
  AlertTriangle, Search, ExternalLink, HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/paginas-legales")({
  component: LegalPagesAdmin,
});

type LegalPage = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

const emptyForm = {
  title: "",
  slug: "",
  subtitle: "",
  content: "",
  published: "true",
};
type Form = typeof emptyForm;

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function LegalPagesAdmin() {
  const [pages, setPages] = useState<LegalPage[] | null>(null);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("legal_pages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading legal pages:", error);
        toast.error("Error loading legal pages");
      } else {
        setPages(data || []);
      }
    } catch (err) {
      console.error("Failed to query legal_pages table:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleTitleChange(val: string) {
    setForm((f) => ({
      ...f,
      title: val,
      slug: slugTouched ? f.slug : slugify(val),
    }));
  }

  function openNew() {
    setEditId(null);
    setForm(emptyForm);
    setSlugTouched(false);
    setDialog(true);
  }

  function openEdit(p: LegalPage) {
    setEditId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      subtitle: p.subtitle || "",
      content: p.content,
      published: p.published ? "true" : "false",
    });
    setSlugTouched(true);
    setDialog(true);
  }

  async function save() {
    if (!form.title.trim()) return toast.error("Please enter a title.");
    if (!form.slug.trim()) return toast.error("Please enter a slug.");
    if (!form.content.trim()) return toast.error("Please enter the page content.");

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim().toLowerCase(),
      subtitle: form.subtitle.trim() || null,
      content: form.content.trim(),
      published: form.published === "true",
      updated_at: new Date().toISOString(),
    };

    try {
      let res;
      if (editId) {
        res = await (supabase as any)
          .from("legal_pages")
          .update(payload)
          .eq("id", editId);
      } else {
        res = await (supabase as any)
          .from("legal_pages")
          .insert(payload);
      }

      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success(editId ? "Legal page updated" : "Legal page created successfully");
        setDialog(false);
        load();
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving page");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string, slug: string) {
    if (slug === "terminos" || slug === "privacidad") {
      return toast.error("You cannot delete core system pages (Terms or Privacy).");
    }

    if (!confirm("Are you sure you want to delete this legal page?")) return;

    try {
      const { error } = await (supabase as any)
        .from("legal_pages")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Legal page deleted");
        load();
      }
    } catch (err: any) {
      toast.error(err.message || "Error deleting page");
    }
  }

  const isCorePage = form.slug === "terminos" || form.slug === "privacidad";

  const filteredPages = (pages || []).filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Legal Pages</h1>
          <p className="text-muted-foreground">
            Manage Terms of Service, Privacy Policy, and other legal guidelines.
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          New Page
        </Button>
      </div>

      {/* Info Warning Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-600 dark:text-blue-400">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <span className="font-semibold">System Note:</span> Pages with slugs{" "}
          <code className="rounded bg-blue-500/10 px-1.5 py-0.5 font-mono text-xs">terminos</code> and{" "}
          <code className="rounded bg-blue-500/10 px-1.5 py-0.5 font-mono text-xs">privacidad</code> are
          required by the application in the footer and signup flow. They cannot be deleted nor their slug changed, but their content is 100% editable.
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Scale className="h-4 w-4" />
            <span className="text-xs">Total Pages</span>
          </div>
          <p className="mt-1 font-display text-2xl font-semibold">{pages?.length ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs text-muted-foreground">Published Pages</span>
          </div>
          <p className="mt-1 font-display text-2xl font-semibold">
            {pages?.filter((p) => p.published).length ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-amber-500">
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs text-muted-foreground">Drafts / Hidden</span>
          </div>
          <p className="mt-1 font-display text-2xl font-semibold">
            {pages?.filter((p) => !p.published).length ?? 0}
          </p>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Loading legal pages...
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
            <Scale className="mb-2 h-8 w-8 opacity-40" />
            No legal pages found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug (Path)</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => {
                const isCore = page.slug === "terminos" || page.slug === "privacidad";
                const absoluteLink = isCore ? `/${page.slug}` : `/legal/${page.slug}`;

                return (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-semibold">{page.title}</span>
                        {isCore && (
                          <span className="text-[10px] text-blue-500 font-medium uppercase mt-0.5">
                            Core System Page
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                        {page.slug}
                      </code>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {page.subtitle || <span className="italic text-muted-foreground/50">None</span>}
                    </TableCell>
                    <TableCell>
                      {page.published ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(page.updated_at).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right space-x-1.5">
                      <a href={absoluteLink} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="icon" title="View public page">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(page)} title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isCore}
                        onClick={() => remove(page.id, page.slug)}
                        className={isCore ? "opacity-30 cursor-not-allowed" : "text-destructive hover:bg-destructive/10"}
                        title={isCore ? "Core system pages cannot be deleted" : "Delete"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Editor Dialog */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Legal Page" : "Create New Legal Page"}
            </DialogTitle>
            <DialogDescription>
              Complete the fields to configure the page. The slug will determine the public URL.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Cookie Policy"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  placeholder="e.g. cookie-policy"
                  value={form.slug}
                  disabled={isCorePage && editId !== null}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
                  }}
                />
                {isCorePage && editId !== null && (
                  <span className="text-[10px] text-amber-600 block mt-1">
                    Core system page slugs cannot be modified.
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle or Short Description</Label>
              <Input
                id="subtitle"
                placeholder="e.g. Information about how cookies are used across CVAI."
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content (Markdown / Text)</Label>
                <span className="text-xs text-muted-foreground">Supports plain Markdown</span>
              </div>
              <Textarea
                id="content"
                rows={12}
                placeholder="Write full legal page content here..."
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="font-mono text-sm leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="published">Visibility</Label>
                <Select
                  value={form.published}
                  onValueChange={(val) => setForm((f) => ({ ...f, published: val }))}
                >
                  <SelectTrigger id="published">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Published (Publicly visible)</SelectItem>
                    <SelectItem value="false">Draft (Hidden)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editId ? "Save Changes" : "Create Page"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
