import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Trash2, Pencil, Loader2, Megaphone, LayoutTemplate,
  Star, Rocket, ExternalLink, DollarSign,
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/marketing")({
  component: MarketingAdmin,
});

type Landing = {
  id: string; title: string; slug: string; headline: string;
  subheadline: string; cta_label: string; cta_url: string; published: boolean;
};
type Testimonial = {
  id: string; author_name: string; author_role: string; avatar_url: string | null;
  quote: string; rating: number; featured: boolean;
};
type Campaign = {
  id: string; name: string; channel: string; status: string; budget: number;
  starts_at: string | null; ends_at: string | null; notes: string;
};

const emptyLanding = { title: "", slug: "", headline: "", subheadline: "", cta_label: "", cta_url: "", published: false };
type LandingForm = typeof emptyLanding;
const emptyTest = { author_name: "", author_role: "", avatar_url: "", quote: "", rating: 5, featured: true };
type TestForm = typeof emptyTest;
const emptyCamp = { name: "", channel: "email", status: "draft", budget: "", starts_at: "", ends_at: "", notes: "" };
type CampForm = typeof emptyCamp;

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

function statusBadge(s: string) {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    active: "default", draft: "secondary", paused: "outline", ended: "destructive",
  };
  return <Badge variant={map[s] ?? "secondary"}>{s}</Badge>;
}

function MarketingAdmin() {
  const [landings, setLandings] = useState<Landing[] | null>(null);
  const [tests, setTests] = useState<Testimonial[] | null>(null);
  const [camps, setCamps] = useState<Campaign[] | null>(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const [lpDialog, setLpDialog] = useState(false);
  const [lpEditId, setLpEditId] = useState<string | null>(null);
  const [lpForm, setLpForm] = useState<LandingForm>(emptyLanding);

  const [tDialog, setTDialog] = useState(false);
  const [tEditId, setTEditId] = useState<string | null>(null);
  const [tForm, setTForm] = useState<TestForm>(emptyTest);

  const [cDialog, setCDialog] = useState(false);
  const [cEditId, setCEditId] = useState<string | null>(null);
  const [cForm, setCForm] = useState<CampForm>(emptyCamp);

  async function load() {
    const [l, t, c] = await Promise.all([
      supabase.from("landing_pages").select("*").order("created_at", { ascending: false }),
      supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
      supabase.from("marketing_campaigns").select("*").order("created_at", { ascending: false }),
    ]);
    if (l.error) toast.error(l.error.message); else setLandings(l.data as Landing[]);
    if (t.error) toast.error(t.error.message); else setTests(t.data as Testimonial[]);
    if (c.error) toast.error(c.error.message); else setCamps(c.data as Campaign[]);
  }
  useEffect(() => { load(); }, []);

  const activeCamps = useMemo(() => (camps ?? []).filter((c) => c.status === "active").length, [camps]);
  const totalBudget = useMemo(() => (camps ?? []).reduce((a, c) => a + Number(c.budget), 0), [camps]);

  // Landing CRUD
  function openNewLp() { setLpEditId(null); setLpForm(emptyLanding); setLpDialog(true); }
  function openEditLp(l: Landing) {
    setLpEditId(l.id);
    setLpForm({ title: l.title, slug: l.slug, headline: l.headline, subheadline: l.subheadline, cta_label: l.cta_label, cta_url: l.cta_url, published: l.published });
    setLpDialog(true);
  }
  async function saveLp() {
    if (!lpForm.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = { ...lpForm, title: lpForm.title.trim(), slug: lpForm.slug.trim() || slugify(lpForm.title) };
    const res = lpEditId
      ? await supabase.from("landing_pages").update(payload).eq("id", lpEditId)
      : await supabase.from("landing_pages").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(lpEditId ? "Landing page updated" : "Landing page created");
    setLpDialog(false); load();
  }
  async function removeLp(id: string) {
    if (!confirm("Delete this landing page?")) return;
    const { error } = await supabase.from("landing_pages").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setLandings((r) => (r ?? []).filter((x) => x.id !== id));
  }
  async function toggleLp(l: Landing) {
    const { error } = await supabase.from("landing_pages").update({ published: !l.published }).eq("id", l.id);
    if (error) { toast.error(error.message); return; }
    setLandings((r) => (r ?? []).map((x) => x.id === l.id ? { ...x, published: !x.published } : x));
  }

  // Testimonial CRUD
  function openNewT() { setTEditId(null); setTForm(emptyTest); setTDialog(true); }
  function openEditT(t: Testimonial) {
    setTEditId(t.id);
    setTForm({ author_name: t.author_name, author_role: t.author_role, avatar_url: t.avatar_url ?? "", quote: t.quote, rating: t.rating, featured: t.featured });
    setTDialog(true);
  }
  async function saveT() {
    if (!tForm.author_name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    const payload = { ...tForm, author_name: tForm.author_name.trim(), avatar_url: tForm.avatar_url.trim() || null };
    const res = tEditId
      ? await supabase.from("testimonials").update(payload).eq("id", tEditId)
      : await supabase.from("testimonials").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(tEditId ? "Testimonial updated" : "Testimonial created");
    setTDialog(false); load();
  }
  async function removeT(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setTests((r) => (r ?? []).filter((x) => x.id !== id));
  }
  async function toggleT(t: Testimonial) {
    const { error } = await supabase.from("testimonials").update({ featured: !t.featured }).eq("id", t.id);
    if (error) { toast.error(error.message); return; }
    setTests((r) => (r ?? []).map((x) => x.id === t.id ? { ...x, featured: !x.featured } : x));
  }

  // Campaign CRUD
  function openNewC() { setCEditId(null); setCForm(emptyCamp); setCDialog(true); }
  function openEditC(c: Campaign) {
    setCEditId(c.id);
    setCForm({
      name: c.name, channel: c.channel, status: c.status, budget: String(c.budget),
      starts_at: c.starts_at ? c.starts_at.slice(0, 16) : "",
      ends_at: c.ends_at ? c.ends_at.slice(0, 16) : "", notes: c.notes,
    });
    setCDialog(true);
  }
  async function saveC() {
    if (!cForm.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    const payload = {
      name: cForm.name.trim(), channel: cForm.channel, status: cForm.status,
      budget: cForm.budget ? Number(cForm.budget) : 0, notes: cForm.notes,
      starts_at: cForm.starts_at ? new Date(cForm.starts_at).toISOString() : null,
      ends_at: cForm.ends_at ? new Date(cForm.ends_at).toISOString() : null,
    };
    const res = cEditId
      ? await supabase.from("marketing_campaigns").update(payload).eq("id", cEditId)
      : await supabase.from("marketing_campaigns").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(cEditId ? "Campaign updated" : "Campaign created");
    setCDialog(false); load();
  }
  async function removeC(id: string) {
    if (!confirm("Delete this campaign?")) return;
    const { error } = await supabase.from("marketing_campaigns").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setCamps((r) => (r ?? []).filter((x) => x.id !== id));
  }

  const q = query.trim().toLowerCase();
  const fLandings = (landings ?? []).filter((l) => !q || l.title.toLowerCase().includes(q));
  const fTests = (tests ?? []).filter((t) => !q || t.author_name.toLowerCase().includes(q) || t.quote.toLowerCase().includes(q));
  const fCamps = (camps ?? []).filter((c) => !q || c.name.toLowerCase().includes(q));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Marketing</h1>
        <p className="text-sm text-muted-foreground">Landing pages, testimonials and campaigns.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={LayoutTemplate} label="Landing Pages" value={(landings?.length ?? 0).toString()} />
        <Kpi icon={Star} label="Testimonials" value={(tests?.length ?? 0).toString()} />
        <Kpi icon={Rocket} label="Active Campaigns" value={activeCamps.toString()} />
        <Kpi icon={DollarSign} label="Total Budget" value={`$${totalBudget.toLocaleString()}`} />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <Tabs defaultValue="landings">
        <TabsList>
          <TabsTrigger value="landings">Landing Pages</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        {/* Landings */}
        <TabsContent value="landings" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openNewLp}><Plus className="mr-1 h-4 w-4" /> New Landing Page</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Title</TableHead><TableHead>Slug</TableHead>
                <TableHead>CTA</TableHead><TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {landings === null ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : fLandings.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No landing pages found</TableCell></TableRow>
                ) : fLandings.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">/{l.slug}</TableCell>
                    <TableCell className="text-sm">{l.cta_label || "—"}</TableCell>
                    <TableCell><Switch checked={l.published} onCheckedChange={() => toggleLp(l)} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditLp(l)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeLp(l.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Testimonials */}
        <TabsContent value="testimonials" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openNewT}><Plus className="mr-1 h-4 w-4" /> New Testimonial</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Author</TableHead><TableHead>Quote</TableHead>
                <TableHead>Rating</TableHead><TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {tests === null ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : fTests.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No testimonials found</TableCell></TableRow>
                ) : fTests.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium">{t.author_name}</div>
                      <div className="text-xs text-muted-foreground">{t.author_role}</div>
                    </TableCell>
                    <TableCell className="max-w-md truncate text-sm text-muted-foreground">{t.quote}</TableCell>
                    <TableCell className="text-sm">{"★".repeat(t.rating)}</TableCell>
                    <TableCell><Switch checked={t.featured} onCheckedChange={() => toggleT(t)} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditT(t)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeT(t.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Campaigns */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openNewC}><Plus className="mr-1 h-4 w-4" /> New Campaign</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Name</TableHead><TableHead>Channel</TableHead>
                <TableHead>Status</TableHead><TableHead>Budget</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {camps === null ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : fCamps.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No campaigns found</TableCell></TableRow>
                ) : fCamps.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-sm capitalize">{c.channel}</TableCell>
                    <TableCell>{statusBadge(c.status)}</TableCell>
                    <TableCell className="text-sm">${Number(c.budget).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditC(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeC(c.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Landing dialog */}
      <Dialog open={lpDialog} onOpenChange={setLpDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{lpEditId ? "Edit Landing Page" : "New Landing Page"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title</Label>
              <Input value={lpForm.title} onChange={(e) => setLpForm({ ...lpForm, title: e.target.value })} /></div>
            <div className="space-y-2"><Label>Slug</Label>
              <Input value={lpForm.slug} placeholder="auto" onChange={(e) => setLpForm({ ...lpForm, slug: e.target.value })} /></div>
            <div className="space-y-2"><Label>Headline</Label>
              <Input value={lpForm.headline} onChange={(e) => setLpForm({ ...lpForm, headline: e.target.value })} /></div>
            <div className="space-y-2"><Label>Subheadline</Label>
              <Textarea rows={2} value={lpForm.subheadline} onChange={(e) => setLpForm({ ...lpForm, subheadline: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>CTA Button Text</Label>
                <Input value={lpForm.cta_label} onChange={(e) => setLpForm({ ...lpForm, cta_label: e.target.value })} /></div>
              <div className="space-y-2"><Label className="flex items-center gap-1"><ExternalLink className="h-3 w-3" /> CTA URL</Label>
                <Input value={lpForm.cta_url} onChange={(e) => setLpForm({ ...lpForm, cta_url: e.target.value })} /></div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label>Published</Label>
              <Switch checked={lpForm.published} onCheckedChange={(v) => setLpForm({ ...lpForm, published: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLpDialog(false)}>Cancel</Button>
            <Button onClick={saveLp} disabled={saving}>{saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}{lpEditId ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial dialog */}
      <Dialog open={tDialog} onOpenChange={setTDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{tEditId ? "Edit Testimonial" : "New Testimonial"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Name</Label>
                <Input value={tForm.author_name} onChange={(e) => setTForm({ ...tForm, author_name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Role</Label>
                <Input value={tForm.author_role} onChange={(e) => setTForm({ ...tForm, author_role: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Avatar URL</Label>
              <Input value={tForm.avatar_url} placeholder="https://…" onChange={(e) => setTForm({ ...tForm, avatar_url: e.target.value })} /></div>
            <div className="space-y-2"><Label>Quote</Label>
              <Textarea rows={3} value={tForm.quote} onChange={(e) => setTForm({ ...tForm, quote: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3 items-end">
              <div className="space-y-2"><Label>Rating</Label>
                <Select value={String(tForm.rating)} onValueChange={(v) => setTForm({ ...tForm, rating: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{[1, 2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)}>{n} ★</SelectItem>)}</SelectContent>
                </Select></div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label>Featured</Label>
                <Switch checked={tForm.featured} onCheckedChange={(v) => setTForm({ ...tForm, featured: v })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTDialog(false)}>Cancel</Button>
            <Button onClick={saveT} disabled={saving}>{saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}{tEditId ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign dialog */}
      <Dialog open={cDialog} onOpenChange={setCDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{cEditId ? "Edit Campaign" : "New Campaign"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label>
              <Input value={cForm.name} onChange={(e) => setCForm({ ...cForm, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Channel</Label>
                <Select value={cForm.channel} onValueChange={(v) => setCForm({ ...cForm, channel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="ads">Ads</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="seo">SEO</SelectItem>
                    <SelectItem value="referral">Referrals</SelectItem>
                  </SelectContent>
                </Select></div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={cForm.status} onValueChange={(v) => setCForm({ ...cForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select></div>
            </div>
            <div className="space-y-2"><Label>Budget</Label>
              <Input type="number" value={cForm.budget} onChange={(e) => setCForm({ ...cForm, budget: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Start Date</Label>
                <Input type="datetime-local" value={cForm.starts_at} onChange={(e) => setCForm({ ...cForm, starts_at: e.target.value })} /></div>
              <div className="space-y-2"><Label>End Date</Label>
                <Input type="datetime-local" value={cForm.ends_at} onChange={(e) => setCForm({ ...cForm, ends_at: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Notes</Label>
              <Textarea rows={2} value={cForm.notes} onChange={(e) => setCForm({ ...cForm, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCDialog(false)}>Cancel</Button>
            <Button onClick={saveC} disabled={saving}>{saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}{cEditId ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
