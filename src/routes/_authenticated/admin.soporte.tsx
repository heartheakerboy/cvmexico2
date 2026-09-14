import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Trash2, Pencil, LifeBuoy, MessageSquare, MessagesSquare,
  HelpCircle, Star, Bug, Mail, Loader2, Reply, CheckCircle2, Lightbulb, Eye,
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

export const Route = createFileRoute("/_authenticated/admin/soporte")({
  component: SupportAdmin,
});

type Ticket = {
  id: string;
  subject: string;
  message: string;
  type: string;
  status: string;
  priority: string;
  requester_name: string | null;
  requester_email: string | null;
  admin_reply: string | null;
  created_at: string;
};

type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  published: boolean;
  created_at: string;
};

const TYPES = [
  { value: "ticket", label: "Tickets", icon: LifeBuoy },
  { value: "live_chat", label: "Live Chat", icon: MessagesSquare },
  { value: "feedback", label: "Feedback", icon: Star },
  { value: "bug", label: "Bugs", icon: Bug },
  { value: "contact", label: "Contact", icon: Mail },
  { value: "feature", label: "Features", icon: Lightbulb },
];

function typeLabel(t: string) {
  return TYPES.find((x) => x.value === t)?.label ?? t;
}

function statusBadge(s: string) {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    open: "secondary", pending: "outline", closed: "default",
  };
  const labelMap: Record<string, string> = {
    open: "Open", pending: "Pending", closed: "Closed",
  };
  return <Badge variant={map[s] ?? "secondary"}>{labelMap[s] ?? s}</Badge>;
}

function priorityBadge(p: string) {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    low: "secondary", medium: "outline", high: "destructive", urgent: "destructive", emergency: "destructive",
  };
  const labelMap: Record<string, string> = {
    low: "Low", medium: "Medium", high: "High", urgent: "Urgent", emergency: "Emergency",
  };
  return <Badge variant={map[p] ?? "secondary"}>{labelMap[p] ?? p}</Badge>;
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

const emptyTicket = {
  subject: "", message: "", type: "ticket", status: "open", priority: "medium",
  requester_name: "", requester_email: "", admin_reply: "",
};
type TicketForm = typeof emptyTicket;

const emptyFaq = {
  question: "", answer: "", category: "general", sort_order: 0, published: true,
};
type FaqForm = typeof emptyFaq;

function SupportAdmin() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [faqs, setFaqs] = useState<Faq[] | null>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("ticket");

  const [tDialog, setTDialog] = useState(false);
  const [tEditId, setTEditId] = useState<string | null>(null);
  const [tForm, setTForm] = useState<TicketForm>(emptyTicket);
  const [tSaving, setTSaving] = useState(false);

  const [fDialog, setFDialog] = useState(false);
  const [fEditId, setFEditId] = useState<string | null>(null);
  const [fForm, setFForm] = useState<FaqForm>(emptyFaq);
  const [fSaving, setFSaving] = useState(false);

  async function load() {
    const [t, f] = await Promise.all([
      supabase.from("support_tickets").select("*").order("created_at", { ascending: false }),
      supabase.from("faqs").select("*").order("sort_order", { ascending: true }),
    ]);
    if (t.error) toast.error(t.error.message); else setTickets(t.data as Ticket[]);
    if (f.error) toast.error(f.error.message); else setFaqs(f.data as Faq[]);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (tickets ?? []).filter((t) => {
      if (t.type !== tab) return false;
      if (!q) return true;
      return t.subject.toLowerCase().includes(q) || (t.requester_email ?? "").toLowerCase().includes(q);
    });
  }, [tickets, query, tab]);

  const openCount = useMemo(() => (tickets ?? []).filter((t) => t.status === "open").length, [tickets]);
  const bugCount = useMemo(() => (tickets ?? []).filter((t) => t.type === "bug").length, [tickets]);

  function openNewTicket() {
    setTEditId(null);
    setTForm({ ...emptyTicket, type: tab === "faq" ? "ticket" : tab });
    setTDialog(true);
  }
  function openEditTicket(t: Ticket) {
    setTEditId(t.id);
    setTForm({
      subject: t.subject, message: t.message, type: t.type, status: t.status,
      priority: t.priority, requester_name: t.requester_name ?? "",
      requester_email: t.requester_email ?? "", admin_reply: t.admin_reply ?? "",
    });
    setTDialog(true);
  }

  async function saveTicket() {
    if (!tForm.subject.trim()) { toast.error("Subject is required"); return; }
    setTSaving(true);
    const payload = {
      subject: tForm.subject.trim(),
      message: tForm.message,
      type: tForm.type,
      status: tForm.status,
      priority: tForm.priority,
      requester_name: tForm.requester_name.trim() || null,
      requester_email: tForm.requester_email.trim() || null,
      admin_reply: tForm.admin_reply.trim() || null,
    };
    const res = tEditId
      ? await supabase.from("support_tickets").update(payload).eq("id", tEditId)
      : await supabase.from("support_tickets").insert(payload);
    setTSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(tEditId ? "Ticket updated" : "Ticket created");
    setTDialog(false); load();
  }

  async function removeTicket(id: string) {
    if (!confirm("Delete this ticket?")) return;
    const { error } = await supabase.from("support_tickets").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Ticket deleted");
    setTickets((r) => (r ?? []).filter((x) => x.id !== id));
  }

  async function setStatus(t: Ticket, status: string) {
    const { error } = await supabase.from("support_tickets").update({ status }).eq("id", t.id);
    if (error) { toast.error(error.message); return; }
    setTickets((r) => (r ?? []).map((x) => x.id === t.id ? { ...x, status } : x));
  }

  function openNewFaq() { setFEditId(null); setFForm(emptyFaq); setFDialog(true); }
  function openEditFaq(f: Faq) {
    setFEditId(f.id);
    setFForm({
      question: f.question, answer: f.answer, category: f.category,
      sort_order: f.sort_order, published: f.published,
    });
    setFDialog(true);
  }

  async function saveFaq() {
    if (!fForm.question.trim()) { toast.error("Question is required"); return; }
    setFSaving(true);
    const payload = {
      question: fForm.question.trim(),
      answer: fForm.answer,
      category: fForm.category.trim() || "general",
      sort_order: Number(fForm.sort_order) || 0,
      published: fForm.published,
    };
    const res = fEditId
      ? await supabase.from("faqs").update(payload).eq("id", fEditId)
      : await supabase.from("faqs").insert(payload);
    setFSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(fEditId ? "FAQ updated" : "FAQ created");
    setFDialog(false); load();
  }

  async function removeFaq(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("FAQ deleted");
    setFaqs((r) => (r ?? []).filter((x) => x.id !== id));
  }

  async function toggleFaq(f: Faq) {
    const { error } = await supabase.from("faqs").update({ published: !f.published }).eq("id", f.id);
    if (error) { toast.error(error.message); return; }
    setFaqs((r) => (r ?? []).map((x) => x.id === f.id ? { ...x, published: !x.published } : x));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Support Center</h1>
        <p className="text-sm text-muted-foreground">Tickets, feedback, and user requests.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={LifeBuoy} label="Tickets" value={(tickets?.length ?? 0).toString()} />
        <Kpi icon={MessageSquare} label="Open" value={openCount.toString()} />
        <Kpi icon={Bug} label="Bugs" value={bugCount.toString()} />
        <Kpi icon={HelpCircle} label="FAQs" value={(faqs?.length ?? 0).toString()} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          {TYPES.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
          ))}
          <TabsTrigger value="faq">FAQs</TabsTrigger>
        </TabsList>

        {TYPES.map((t) => (
          <TabsContent key={t.value} value={t.value} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search by subject or email…" value={query}
                  onChange={(e) => setQuery(e.target.value)} />
              </div>
              <Button onClick={openNewTicket}><Plus className="mr-1 h-4 w-4" /> New</Button>
            </div>

            <div className="rounded-2xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets === null ? (
                    <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No records found</TableCell></TableRow>
                  ) : filtered.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell>
                        <div className="font-medium">{it.subject}</div>
                        <div className="max-w-md truncate text-xs text-muted-foreground">{it.message}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{it.requester_name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{it.requester_email ?? ""}</div>
                      </TableCell>
                      <TableCell>{priorityBadge(it.priority)}</TableCell>
                      <TableCell>{statusBadge(it.status)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="icon" onClick={() => openEditTicket(it)} title="View details">
                          <Eye className="h-4 w-4" /></Button>
                        {it.status !== "closed" && (
                          <Button variant="ghost" size="icon" onClick={() => setStatus(it, "closed")} title="Close">
                            <CheckCircle2 className="h-4 w-4" /></Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => openEditTicket(it)} title="Reply">
                          <Reply className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => removeTicket(it.id)}>
                          <Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}

        <TabsContent value="faq" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Public frequently asked questions.</p>
            <Button onClick={openNewFaq}><Plus className="mr-1 h-4 w-4" /> New FAQ</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs === null ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : faqs.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No FAQs found</TableCell></TableRow>
                ) : faqs.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>
                      <div className="font-medium">{f.question}</div>
                      <div className="max-w-md truncate text-xs text-muted-foreground">{f.answer}</div>
                    </TableCell>
                    <TableCell className="text-sm capitalize">{f.category}</TableCell>
                    <TableCell className="text-sm">{f.sort_order}</TableCell>
                    <TableCell><Switch checked={f.published} onCheckedChange={() => toggleFaq(f)} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditFaq(f)}>
                        <Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeFaq(f.id)}>
                        <Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={tDialog} onOpenChange={setTDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{tEditId ? "Edit / Reply to Ticket" : "New Ticket"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={tForm.subject} onChange={(e) => setTForm({ ...tForm, subject: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              {tEditId ? (
                <div className="rounded-xl border border-border bg-secondary/30 p-3 text-sm text-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {tForm.message}
                </div>
              ) : (
                <Textarea rows={3} value={tForm.message} onChange={(e) => setTForm({ ...tForm, message: e.target.value })} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={tForm.requester_name} onChange={(e) => setTForm({ ...tForm, requester_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={tForm.requester_email} onChange={(e) => setTForm({ ...tForm, requester_email: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={tForm.type} onValueChange={(v) => setTForm({ ...tForm, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={tForm.priority} onValueChange={(v) => setTForm({ ...tForm, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={tForm.status} onValueChange={(v) => setTForm({ ...tForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Staff Reply</Label>
              <Textarea rows={3} value={tForm.admin_reply}
                onChange={(e) => setTForm({ ...tForm, admin_reply: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTDialog(false)}>Cancel</Button>
            <Button onClick={saveTicket} disabled={tSaving}>
              {tSaving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              {tEditId ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={fDialog} onOpenChange={setFDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{fEditId ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input value={fForm.question} onChange={(e) => setFForm({ ...fForm, question: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea rows={4} value={fForm.answer} onChange={(e) => setFForm({ ...fForm, answer: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={fForm.category} onChange={(e) => setFForm({ ...fForm, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" value={fForm.sort_order}
                  onChange={(e) => setFForm({ ...fForm, sort_order: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label>Published</Label>
              <Switch checked={fForm.published} onCheckedChange={(v) => setFForm({ ...fForm, published: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFDialog(false)}>Cancel</Button>
            <Button onClick={saveFaq} disabled={fSaving}>
              {fSaving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              {fEditId ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
