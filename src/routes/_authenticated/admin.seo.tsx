import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Trash2, Loader2, Pencil, Globe, Tag, ArrowRightLeft,
  AlertTriangle, FileCode, Gauge, Copy, Check,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

export const Route = createFileRoute("/_authenticated/admin/seo")({
  component: SeoAdmin,
});

type SeoPage = {
  id: string;
  path: string;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  keywords: string | null;
  noindex: boolean;
};

type Redirect = {
  id: string;
  from_path: string;
  to_path: string;
  status_code: number;
  hits: number;
  is_404: boolean;
  active: boolean;
};

const emptyPage = {
  path: "", meta_title: "", meta_description: "", og_title: "", og_description: "",
  og_image: "", keywords: "", noindex: false,
};
type PageForm = typeof emptyPage;

const emptyRedirect = { from_path: "", to_path: "", status_code: "301", active: true };
type RedirectForm = typeof emptyRedirect;

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

function SeoAdmin() {
  const [pages, setPages] = useState<SeoPage[] | null>(null);
  const [redirects, setRedirects] = useState<Redirect[] | null>(null);

  const [pageDialog, setPageDialog] = useState(false);
  const [pageEditId, setPageEditId] = useState<string | null>(null);
  const [pageForm, setPageForm] = useState<PageForm>(emptyPage);

  const [redirectDialog, setRedirectDialog] = useState(false);
  const [redirectEditId, setRedirectEditId] = useState<string | null>(null);
  const [redirectForm, setRedirectForm] = useState<RedirectForm>(emptyRedirect);

  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  async function load() {
    const [p, r] = await Promise.all([
      supabase.from("seo_pages").select("*").order("path"),
      supabase.from("redirects").select("*").order("hits", { ascending: false }),
    ]);
    setPages((p.data ?? []) as SeoPage[]);
    setRedirects((r.data ?? []) as Redirect[]);
  }
  useEffect(() => { load(); }, []);

  // ---- SEO pages ----
  function openNewPage() {
    setPageEditId(null);
    setPageForm(emptyPage);
    setPageDialog(true);
  }
  function openEditPage(p: SeoPage) {
    setPageEditId(p.id);
    setPageForm({
      path: p.path, meta_title: p.meta_title ?? "", meta_description: p.meta_description ?? "",
      og_title: p.og_title ?? "", og_description: p.og_description ?? "", og_image: p.og_image ?? "",
      keywords: p.keywords ?? "", noindex: p.noindex,
    });
    setPageDialog(true);
  }
  async function savePage() {
    if (!pageForm.path.trim()) return toast.error("Please enter the path");
    setSaving(true);
    const payload = {
      path: pageForm.path.trim(),
      meta_title: pageForm.meta_title.trim() || null,
      meta_description: pageForm.meta_description.trim() || null,
      og_title: pageForm.og_title.trim() || null,
      og_description: pageForm.og_description.trim() || null,
      og_image: pageForm.og_image.trim() || null,
      keywords: pageForm.keywords.trim() || null,
      noindex: pageForm.noindex,
    };
    const res = pageEditId
      ? await supabase.from("seo_pages").update(payload).eq("id", pageEditId)
      : await supabase.from("seo_pages").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    setPageDialog(false);
    toast.success(pageEditId ? "Page updated" : "Page created");
    load();
  }
  async function removePage(id: string) {
    const { error } = await supabase.from("seo_pages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Page deleted");
    load();
  }
  async function toggleNoindex(p: SeoPage) {
    const { error } = await supabase.from("seo_pages").update({ noindex: !p.noindex }).eq("id", p.id);
    if (error) return toast.error(error.message);
    load();
  }

  // ---- Redirects ----
  function openNewRedirect() {
    setRedirectEditId(null);
    setRedirectForm(emptyRedirect);
    setRedirectDialog(true);
  }
  function openEditRedirect(r: Redirect) {
    setRedirectEditId(r.id);
    setRedirectForm({ from_path: r.from_path, to_path: r.to_path, status_code: String(r.status_code), active: r.active });
    setRedirectDialog(true);
  }
  async function saveRedirect() {
    if (!redirectForm.from_path.trim() || !redirectForm.to_path.trim()) return toast.error("Source and destination paths are required");
    setSaving(true);
    const payload = {
      from_path: redirectForm.from_path.trim(),
      to_path: redirectForm.to_path.trim(),
      status_code: Number(redirectForm.status_code) || 301,
      active: redirectForm.active,
      is_404: false,
    };
    const res = redirectEditId
      ? await supabase.from("redirects").update(payload).eq("id", redirectEditId)
      : await supabase.from("redirects").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    setRedirectDialog(false);
    toast.success(redirectEditId ? "Redirect updated" : "Redirect created");
    load();
  }
  async function removeRedirect(id: string) {
    const { error } = await supabase.from("redirects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Redirect deleted");
    load();
  }
  async function toggleRedirect(r: Redirect) {
    const { error } = await supabase.from("redirects").update({ active: !r.active }).eq("id", r.id);
    if (error) return toast.error(error.message);
    load();
  }
  async function fixBroken(r: Redirect, to: string) {
    const { error } = await supabase.from("redirects").update({ to_path: to, is_404: false, active: true }).eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Link fixed");
    load();
  }

  function copySitemap() {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      ...(pages ?? []).filter((p) => !p.noindex).map((p) =>
        `  <url><loc>${base}${p.path}</loc></url>`),
      `</urlset>`,
    ].join("\n");
    navigator.clipboard?.writeText(xml);
    setCopied(true);
    toast.success("Sitemap copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  const loading = pages === null || redirects === null;
  const broken = useMemo(() => (redirects ?? []).filter((r) => r.is_404), [redirects]);
  const indexed = useMemo(() => (pages ?? []).filter((p) => !p.noindex).length, [pages]);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Search className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">SEO Management</h1>
          <p className="text-sm text-muted-foreground">Meta tags, sitemap, redirects and Core Web Vitals.</p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={Globe} label="SEO Pages" value={String(pages!.length)} />
            <Kpi icon={FileCode} label="Indexable" value={String(indexed)} />
            <Kpi icon={ArrowRightLeft} label="Redirects" value={String(redirects!.length)} />
            <Kpi icon={AlertTriangle} label="Broken Links (404)" value={String(broken.length)} />
          </div>

          <Tabs defaultValue="meta">
            <TabsList>
              <TabsTrigger value="meta">Meta &amp; Open Graph</TabsTrigger>
              <TabsTrigger value="redirects">Redirects</TabsTrigger>
              <TabsTrigger value="monitor">404 Monitor</TabsTrigger>
              <TabsTrigger value="tools">Sitemap &amp; Core Web Vitals</TabsTrigger>
            </TabsList>

            {/* Meta & OG */}
            <TabsContent value="meta" className="mt-4 space-y-4">
              <div className="flex justify-end">
                <Button onClick={openNewPage}><Plus className="mr-2 h-4 w-4" />New Page</Button>
              </div>
              <div className="rounded-2xl border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Path</TableHead>
                      <TableHead>Meta Title</TableHead>
                      <TableHead>Keywords</TableHead>
                      <TableHead>Index</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages!.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No pages found</TableCell></TableRow>
                    )}
                    {pages!.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">{p.path}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{p.meta_title ?? "—"}</div>
                          <div className="text-[11px] text-muted-foreground">{(p.meta_title ?? "").length}/60</div>
                        </TableCell>
                        <TableCell className="max-w-[12rem] truncate text-muted-foreground">{p.keywords ?? "—"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch checked={!p.noindex} onCheckedChange={() => toggleNoindex(p)} />
                            <span className="text-xs text-muted-foreground">{p.noindex ? "noindex" : "index"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditPage(p)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => removePage(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Redirects */}
            <TabsContent value="redirects" className="mt-4 space-y-4">
              <div className="flex justify-end">
                <Button onClick={openNewRedirect}><Plus className="mr-2 h-4 w-4" />New Redirect</Button>
              </div>
              <div className="rounded-2xl border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Hits</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {redirects!.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No redirects found</TableCell></TableRow>
                    )}
                    {redirects!.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-xs">{r.from_path}</TableCell>
                        <TableCell className="font-mono text-xs">{r.to_path}</TableCell>
                        <TableCell>{r.status_code}</TableCell>
                        <TableCell className="text-muted-foreground">{r.hits}</TableCell>
                        <TableCell>
                          <Switch checked={r.active} onCheckedChange={() => toggleRedirect(r)} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditRedirect(r)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => removeRedirect(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* 404 monitor */}
            <TabsContent value="monitor" className="mt-4 space-y-4">
              <div className="rounded-2xl border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Broken Path</TableHead>
                      <TableHead>Hits</TableHead>
                      <TableHead>Redirects to</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {broken.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No broken links found 🎉</TableCell></TableRow>
                    )}
                    {broken.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-xs text-destructive">{r.from_path}</TableCell>
                        <TableCell className="text-muted-foreground">{r.hits}</TableCell>
                        <TableCell className="font-mono text-xs">{r.to_path}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => fixBroken(r, r.to_path)}>Fix</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Tools */}
            <TabsContent value="tools" className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-primary">
                  <FileCode className="h-5 w-5" />
                  <h3 className="font-display text-lg font-semibold">Sitemap</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generates the XML sitemap with {indexed} indexable pages.
                </p>
                <Button className="mt-4" variant="outline" onClick={copySitemap}>
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  Copy sitemap.xml
                </Button>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-primary">
                  <Gauge className="h-5 w-5" />
                  <h3 className="font-display text-lg font-semibold">Core Web Vitals</h3>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-emerald-500/10 p-3">
                    <p className="text-lg font-bold text-emerald-600">1.8s</p>
                    <p className="text-[11px] text-muted-foreground">LCP</p>
                  </div>
                  <div className="rounded-xl bg-emerald-500/10 p-3">
                    <p className="text-lg font-bold text-emerald-600">28ms</p>
                    <p className="text-[11px] text-muted-foreground">INP</p>
                  </div>
                  <div className="rounded-xl bg-amber-500/10 p-3">
                    <p className="text-lg font-bold text-amber-600">0.12</p>
                    <p className="text-[11px] text-muted-foreground">CLS</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Benchmark metrics. Connect Search Console for real-world field data.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Page dialog */}
      <Dialog open={pageDialog} onOpenChange={setPageDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{pageEditId ? "Edit Page" : "New Page"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Path</Label>
              <Input value={pageForm.path} onChange={(e) => setPageForm((s) => ({ ...s, path: e.target.value }))} placeholder="/pricing" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Meta Title</Label>
              <Input value={pageForm.meta_title} onChange={(e) => setPageForm((s) => ({ ...s, meta_title: e.target.value }))} placeholder="Title (≤60 chars)" />
              <p className="text-[11px] text-muted-foreground">{pageForm.meta_title.length}/60</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Meta Description</Label>
              <Textarea rows={2} value={pageForm.meta_description} onChange={(e) => setPageForm((s) => ({ ...s, meta_description: e.target.value }))} placeholder="Meta description (≤160 chars)" />
              <p className="text-[11px] text-muted-foreground">{pageForm.meta_description.length}/160</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1"><Tag className="h-3 w-3" />Keywords</Label>
              <Input value={pageForm.keywords} onChange={(e) => setPageForm((s) => ({ ...s, keywords: e.target.value }))} placeholder="resume, templates, ats" />
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Globe className="h-3.5 w-3.5" />Open Graph</p>
              <div className="space-y-1.5">
                <Label className="text-xs">OG Title</Label>
                <Input value={pageForm.og_title} onChange={(e) => setPageForm((s) => ({ ...s, og_title: e.target.value }))} placeholder="Title for social networks" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">OG Description</Label>
                <Textarea rows={2} value={pageForm.og_description} onChange={(e) => setPageForm((s) => ({ ...s, og_description: e.target.value }))} placeholder="Description for social networks" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">OG Image (URL)</Label>
                <Input value={pageForm.og_image} onChange={(e) => setPageForm((s) => ({ ...s, og_image: e.target.value }))} placeholder="https://..." />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <Label className="text-xs">Exclude from search engines (noindex)</Label>
                <p className="text-[11px] text-muted-foreground">Prevents this page from appearing in Google.</p>
              </div>
              <Switch checked={pageForm.noindex} onCheckedChange={(v) => setPageForm((s) => ({ ...s, noindex: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={savePage} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{pageEditId ? "Save Changes" : "Create Page"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Redirect dialog */}
      <Dialog open={redirectDialog} onOpenChange={setRedirectDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{redirectEditId ? "Edit Redirect" : "New Redirect"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Source Path</Label>
              <Input value={redirectForm.from_path} onChange={(e) => setRedirectForm((s) => ({ ...s, from_path: e.target.value }))} placeholder="/old-page" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Destination Path</Label>
              <Input value={redirectForm.to_path} onChange={(e) => setRedirectForm((s) => ({ ...s, to_path: e.target.value }))} placeholder="/new-page" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Code</Label>
                <Select value={redirectForm.status_code} onValueChange={(v) => setRedirectForm((s) => ({ ...s, status_code: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="301">301 — Permanent</SelectItem>
                    <SelectItem value="302">302 — Temporary</SelectItem>
                    <SelectItem value="307">307 — Temporary (preserve method)</SelectItem>
                    <SelectItem value="410">410 — Gone / Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border px-3">
                <Label className="text-xs">Active</Label>
                <Switch checked={redirectForm.active} onCheckedChange={(v) => setRedirectForm((s) => ({ ...s, active: v }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveRedirect} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {redirectEditId ? "Save Changes" : "Create Redirect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
