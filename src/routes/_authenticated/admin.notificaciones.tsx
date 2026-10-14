import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Trash2, Pencil, Bell, Send, Megaphone, AlertTriangle,
  MonitorSmartphone, MessageSquare, Loader2, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/db/client";
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

export const Route = createFileRoute("/_authenticated/admin/notificaciones")({
  component: NotificationsAdmin,
});

type Notification = {
  id: string;
  title: string;
  body: string;
  channel: string;
  audience: string;
  variant: string;
  link_url: string | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  sent_count: number;
  created_at: string;
};

const CHANNELS = [
  { value: "push", label: "Push", icon: Bell },
  { value: "announcement", label: "Announcements", icon: Megaphone },
  { value: "banner", label: "Maintenance Banner", icon: AlertTriangle },
  { value: "popup", label: "Popups", icon: MonitorSmartphone },
  { value: "in_app", label: "In-App", icon: MessageSquare },
];

const emptyForm = {
  title: "", body: "", channel: "in_app", audience: "all",
  variant: "info", link_url: "", active: true, starts_at: "", ends_at: "",
};
type Form = typeof emptyForm;

function channelLabel(c: string) {
  return CHANNELS.find((x) => x.value === c)?.label ?? c;
}

function variantBadge(v: string) {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    info: "secondary", success: "default", warning: "outline", critical: "destructive",
  };
  const labelMap: Record<string, string> = {
    info: "Info", success: "Success", warning: "Warning", critical: "Critical",
  };
  return <Badge variant={map[v] ?? "secondary"}>{labelMap[v] ?? v}</Badge>;
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

function NotificationsAdmin() {
  const [items, setItems] = useState<Notification[] | null>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("notifications").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data as Notification[]);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items ?? []).filter((n) => {
      if (tab !== "all" && n.channel !== tab) return false;
      if (!q) return true;
      return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
    });
  }, [items, query, tab]);

  const activeCount = useMemo(() => (items ?? []).filter((n) => n.active).length, [items]);
  const sentTotal = useMemo(() => (items ?? []).reduce((a, n) => a + n.sent_count, 0), [items]);

  function openNew() { setEditId(null); setForm({ ...emptyForm, channel: tab === "all" ? "in_app" : tab }); setDialog(true); }
  function openEdit(n: Notification) {
    setEditId(n.id);
    setForm({
      title: n.title, body: n.body, channel: n.channel, audience: n.audience,
      variant: n.variant, link_url: n.link_url ?? "", active: n.active,
      starts_at: n.starts_at ? n.starts_at.slice(0, 16) : "",
      ends_at: n.ends_at ? n.ends_at.slice(0, 16) : "",
    });
    setDialog(true);
  }

  async function save() {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      body: form.body,
      channel: form.channel,
      audience: form.audience,
      variant: form.variant,
      link_url: form.link_url.trim() || null,
      active: form.active,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
    };
    const res = editId
      ? await supabase.from("notifications").update(payload).eq("id", editId)
      : await supabase.from("notifications").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(editId ? "Notification updated" : "Notification created");
    setDialog(false); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this notification?")) return;
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Notification deleted");
    setItems((r) => (r ?? []).filter((x) => x.id !== id));
  }

  async function toggle(n: Notification) {
    const { error } = await supabase.from("notifications").update({ active: !n.active }).eq("id", n.id);
    if (error) { toast.error(error.message); return; }
    setItems((r) => (r ?? []).map((x) => x.id === n.id ? { ...x, active: !x.active } : x));
  }

  async function publish(n: Notification) {
    if (!confirm("Mark as sent/published?")) return;
    const { error } = await supabase.from("notifications")
      .update({ active: true, sent_count: n.sent_count + 1 }).eq("id", n.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Notification published");
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-muted-foreground">Push, announcements, and in-app messages.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={Bell} label="Total" value={(items?.length ?? 0).toString()} />
        <Kpi icon={MessageSquare} label="Active" value={activeCount.toString()} />
        <Kpi icon={Megaphone} label="Channels" value={CHANNELS.length.toString()} />
        <Kpi icon={Send} label="Delivered" value={sentTotal.toString()} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          {CHANNELS.map((c) => (
            <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search notifications…" value={query}
                onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" /> New Notification</Button>
          </div>

          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items === null ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No notifications found</TableCell></TableRow>
                ) : filtered.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell>
                      <div className="font-medium">{n.title}</div>
                      <div className="max-w-md truncate text-xs text-muted-foreground">{n.body}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{channelLabel(n.channel)}</Badge></TableCell>
                    <TableCell className="text-sm capitalize">{n.audience}</TableCell>
                    <TableCell>{variantBadge(n.variant)}</TableCell>
                    <TableCell><Switch checked={n.active} onCheckedChange={() => toggle(n)} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => publish(n)} title="Publish / send">
                        <Send className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(n)}>
                        <Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(n.id)}>
                        <Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Notification" : "New Notification"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Channel</Label>
                <Select value={form.channel} onValueChange={(v) => setForm({ ...form, channel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={form.audience} onValueChange={(v) => setForm({ ...form, audience: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.variant} onValueChange={(v) => setForm({ ...form, variant: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Link</Label>
                <Input value={form.link_url} placeholder="https://…"
                  onChange={(e) => setForm({ ...form, link_url: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="datetime-local" value={form.starts_at}
                  onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="datetime-local" value={form.ends_at}
                  onChange={(e) => setForm({ ...form, ends_at: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label>Active</Label>
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              {editId ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
