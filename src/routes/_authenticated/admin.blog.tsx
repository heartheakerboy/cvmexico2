import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Newspaper, Plus, Trash2, Loader2, Pencil, FileText, Calendar, CheckCircle2,
  Shapes, Search, User,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { submitSingleUrlToIndexNow } from "@/lib/indexnow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: BlogAdmin,
});

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  author: string | null;
  seo_title: string | null;
  seo_description: string | null;
  cover_url: string | null;
  status: string;
  published_at: string | null;
  sort_order: number;
};

const STATUS = ["borrador", "programado", "publicado"] as const;

const statusStyle: Record<string, string> = {
  publicado: "bg-emerald-500/10 text-emerald-600",
  programado: "bg-blue-500/10 text-blue-600",
  borrador: "bg-amber-500/10 text-amber-600",
};

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const emptyForm = {
  title: "", slug: "", excerpt: "", content: "", category: "general", author: "Editorial Team",
  seo_title: "", seo_description: "", cover_url: "", status: "borrador", published_at: "",
};
type Form = typeof emptyForm;

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

function BlogAdmin() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("blog_posts").select("*").order("sort_order");
    setPosts((data ?? []) as Post[]);
  }
  useEffect(() => { load(); }, []);

  const categories = useMemo(
    () => Array.from(new Set((posts ?? []).map((p) => p.category))).sort(),
    [posts],
  );

  function openNew() {
    setEditId(null);
    setForm(emptyForm);
    setSlugTouched(false);
    setDialog(true);
  }

  function openEdit(p: Post) {
    setEditId(p.id);
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt ?? "", content: p.content ?? "",
      category: p.category, author: p.author ?? "", seo_title: p.seo_title ?? "",
      seo_description: p.seo_description ?? "", cover_url: p.cover_url ?? "",
      status: p.status,
      published_at: p.published_at ? p.published_at.slice(0, 16) : "",
    });
    setSlugTouched(true);
    setDialog(true);
  }

  async function save() {
    if (!form.title.trim()) return toast.error("Please enter a title");
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: (form.slug.trim() || slugify(form.title)),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      category: form.category.trim() || "general",
      author: form.author.trim() || null,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      cover_url: form.cover_url.trim() || null,
      status: form.status,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : (form.status === "publicado" ? new Date().toISOString() : null),
    };
    const res = editId
      ? await supabase.from("blog_posts").update(payload).eq("id", editId)
      : await supabase.from("blog_posts").insert({ ...payload, sort_order: posts?.length ?? 0 });
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    setDialog(false);
    toast.success(editId ? "Article updated" : "Article created");
    load();

    if (payload.status === "publicado") {
      submitSingleUrlToIndexNow(`/blog/${payload.slug}`).then((res) => {
        if (res.success) {
          toast.success("Notificación IndexNow enviada a Bing y motores asociados");
        }
      }).catch(() => {});
    }
  }

  async function remove(id: string) {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Article deleted");
    load();
  }

  const loading = posts === null;
  const drafts = (posts ?? []).filter((p) => p.status !== "publicado");
  const published = (posts ?? []).filter((p) => p.status === "publicado");

  function renderTable(rows: Post[]) {
    return (
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No articles found</TableCell></TableRow>
            )}
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="font-medium">{p.title}</div>
                  <div className="font-mono text-xs text-muted-foreground">/{p.slug}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.category}</TableCell>
                <TableCell className="text-muted-foreground">{p.author ?? "—"}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[p.status] ?? "bg-muted text-muted-foreground"}`}>
                    {p.status === "publicado" ? "Published" : p.status === "borrador" ? "Draft" : p.status === "programado" ? "Scheduled" : p.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {p.published_at ? new Date(p.published_at).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Newspaper className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">Blog CMS</h1>
          <p className="text-sm text-muted-foreground">Articles, categories and SEO scheduling.</p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={FileText} label="Articles" value={String(posts!.length)} />
            <Kpi icon={CheckCircle2} label="Published" value={String(published.length)} />
            <Kpi icon={Pencil} label="Drafts" value={String(drafts.length)} />
            <Kpi icon={Shapes} label="Categories" value={String(categories.length)} />
          </div>

          <div className="flex justify-end">
            <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />New article</Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">{renderTable(posts!)}</TabsContent>
            <TabsContent value="published" className="mt-4">{renderTable(published)}</TabsContent>
            <TabsContent value="drafts" className="mt-4">{renderTable(drafts)}</TabsContent>
          </Tabs>
        </>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editId ? "Edit Article" : "New Article"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Title</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((s) => ({ ...s, title, slug: slugTouched ? s.slug : slugify(title) }));
                }}
                placeholder="How to write a winning resume..."
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Slug</Label>
                <Input value={form.slug} onChange={(e) => { setSlugTouched(true); setForm((s) => ({ ...s, slug: e.target.value })); }} placeholder="ats-friendly-resume" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1"><Shapes className="h-3 w-3" />Category</Label>
                <Input value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} placeholder="tips" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1"><User className="h-3 w-3" />Author</Label>
                <Input value={form.author} onChange={(e) => setForm((s) => ({ ...s, author: e.target.value }))} placeholder="Editorial Team" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Cover Image (URL)</Label>
                <Input value={form.cover_url} onChange={(e) => setForm((s) => ({ ...s, cover_url: e.target.value }))} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Excerpt</Label>
              <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm((s) => ({ ...s, excerpt: e.target.value }))} placeholder="Brief summary of the article" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Content</Label>
              <Textarea rows={6} value={form.content} onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))} placeholder="Write article content here (Markdown)" />
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Search className="h-3.5 w-3.5" />SEO</p>
              <div className="space-y-1.5">
                <Label className="text-xs">SEO Title</Label>
                <Input value={form.seo_title} onChange={(e) => setForm((s) => ({ ...s, seo_title: e.target.value }))} placeholder="Optimized title (≤60 chars)" />
                <p className="text-[11px] text-muted-foreground">{form.seo_title.length}/60</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">SEO Description</Label>
                <Textarea rows={2} value={form.seo_description} onChange={(e) => setForm((s) => ({ ...s, seo_description: e.target.value }))} placeholder="Meta description (≤160 chars)" />
                <p className="text-[11px] text-muted-foreground">{form.seo_description.length}/160</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((s) => ({ ...s, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="borrador">Draft</SelectItem>
                    <SelectItem value="programado">Scheduled</SelectItem>
                    <SelectItem value="publicado">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1"><Calendar className="h-3 w-3" />Publication Date</Label>
                <Input type="datetime-local" value={form.published_at} onChange={(e) => setForm((s) => ({ ...s, published_at: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editId ? "Save Changes" : "Create Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
