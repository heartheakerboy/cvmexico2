import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Plus,
  LayoutGrid,
  Clock,
  Building2,
  MapPin,
  Link as LinkIcon,
  Trash2,
  Loader2,
  Pencil,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/panel/empleos")({
  component: EmpleosPage,
});

type Status = "deseos" | "aplicado" | "entrevista" | "oferta" | "rechazado";

type Job = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: Status;
  location: string | null;
  salary: string | null;
  url: string | null;
  notes: string | null;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
};

type JobEvent = {
  id: string;
  job_id: string;
  title: string;
  occurred_at: string;
  created_at: string;
};

const STATUSES: { key: Status; color: string }[] = [
  { key: "deseos", color: "bg-slate-400" },
  { key: "aplicado", color: "bg-blue-500" },
  { key: "entrevista", color: "bg-amber-500" },
  { key: "oferta", color: "bg-emerald-500" },
  { key: "rechazado", color: "bg-rose-500" },
];

type TFn = (k: string, vars?: Record<string, string | number>) => string;
const statusLabel = (t: TFn, s: Status) => t(`empleos.status.${s}`);

type View = "tablero" | "timeline" | "empresas";

function EmpleosPage() {
  const { user } = useAuth();
  const { t } = useSettings();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [events, setEvents] = useState<JobEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("tablero");
  const [editing, setEditing] = useState<Job | null>(null);
  const [creating, setCreating] = useState(false);
  const [detail, setDetail] = useState<Job | null>(null);

  async function load() {
    setLoading(true);
    const [{ data: j }, { data: e }] = await Promise.all([
      supabase.from("job_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("job_events").select("*").order("occurred_at", { ascending: false }),
    ]);
    setJobs((j as Job[]) ?? []);
    setEvents((e as JobEvent[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detailJob = detail ? jobs.find((j) => j.id === detail.id) ?? null : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Briefcase className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">{t("empleos.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("empleos.subtitle")}</p>
          </div>
        </div>
        <Button className="gap-2" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> {t("empleos.new")}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STATUSES.map((s) => (
          <div key={s.key} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
              <span className="text-xs text-muted-foreground">{statusLabel(t, s.key)}</span>
            </div>
            <p className="mt-1 font-display text-2xl font-bold">
              {jobs.filter((j) => j.status === s.key).length}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 inline-flex rounded-lg border border-border bg-muted/40 p-1">
        <ViewTab icon={LayoutGrid} label={t("empleos.view.tablero")} active={view === "tablero"} onClick={() => setView("tablero")} />
        <ViewTab icon={Clock} label={t("empleos.view.timeline")} active={view === "timeline"} onClick={() => setView("timeline")} />
        <ViewTab icon={Building2} label={t("empleos.view.empresas")} active={view === "empresas"} onClick={() => setView("empresas")} />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : view === "tablero" ? (
          <Board jobs={jobs} onOpen={setDetail} t={t} />
        ) : view === "timeline" ? (
          <Timeline jobs={jobs} events={events} t={t} />
        ) : (
          <Companies jobs={jobs} onOpen={setDetail} t={t} />
        )}
      </div>

      {(creating || editing) && (
        <JobDialog
          userId={user?.id ?? ""}
          job={editing}
          t={t}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setCreating(false);
            setEditing(null);
            load();
          }}
        />
      )}

      {detailJob && (
        <JobDetail
          job={detailJob}
          events={events.filter((e) => e.job_id === detailJob.id)}
          t={t}
          onClose={() => setDetail(null)}
          onEdit={() => {
            setEditing(detailJob);
            setDetail(null);
          }}
          onChanged={load}
        />
      )}
    </div>
  );
}

function ViewTab({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof LayoutGrid;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

function Board({ jobs, onOpen, t }: { jobs: Job[]; onOpen: (j: Job) => void; t: TFn }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {STATUSES.map((s) => {
        const list = jobs.filter((j) => j.status === s.key);
        return (
          <div key={s.key} className="rounded-2xl border border-border bg-muted/20 p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                <span className="text-sm font-semibold">{statusLabel(t, s.key)}</span>
              </div>
              <span className="text-xs text-muted-foreground">{list.length}</span>
            </div>
            <div className="space-y-2">
              {list.map((j) => (
                <button
                  key={j.id}
                  onClick={() => onOpen(j)}
                  className="w-full rounded-xl border border-border bg-card p-3 text-left transition-shadow hover:shadow-md"
                >
                  <p className="font-medium leading-tight">{j.role}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{j.company}</p>
                  {j.location && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {j.location}
                    </p>
                  )}
                </button>
              ))}
              {list.length === 0 && (
                <p className="px-1 py-4 text-center text-xs text-muted-foreground">{t("empleos.noApps")}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Timeline({ jobs, events, t }: { jobs: Job[]; events: JobEvent[]; t: TFn }) {
  const jobMap = useMemo(() => new Map(jobs.map((j) => [j.id, j])), [jobs]);
  if (events.length === 0) {
    return <EmptyState text={t("empleos.timelineEmpty")} />;
  }
  return (
    <div className="relative max-w-2xl border-l border-border pl-6">
      {events.map((e) => {
        const job = jobMap.get(e.job_id);
        return (
          <div key={e.id} className="relative pb-6">
            <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary" />
            <p className="text-xs text-muted-foreground">
              {new Date(e.occurred_at).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="mt-0.5 font-medium">{e.title}</p>
            {job && (
              <p className="text-sm text-muted-foreground">
                {job.role} · {job.company}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Companies({ jobs, onOpen, t }: { jobs: Job[]; onOpen: (j: Job) => void; t: TFn }) {
  const companies = useMemo(() => {
    const map = new Map<string, Job[]>();
    for (const j of jobs) {
      const arr = map.get(j.company) ?? [];
      arr.push(j);
      map.set(j.company, arr);
    }
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [jobs]);

  if (companies.length === 0) {
    return <EmptyState text={t("empleos.companiesEmpty")} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {companies.map(([company, list]) => (
        <div key={company} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" />
            </span>
            <div>
              <p className="font-semibold">{company}</p>
              <p className="text-xs text-muted-foreground">{list.length} {t("empleos.appsCount")}</p>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {list.map((j) => (
              <button
                key={j.id}
                onClick={() => onOpen(j)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted"
              >
                <span className="truncate">{j.role}</span>
                <span className="ml-2 shrink-0 text-xs text-muted-foreground">{statusLabel(t, j.status)}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Briefcase className="h-6 w-6" />
      </span>
      <p className="mt-4 max-w-md text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function JobDialog({
  userId,
  job,
  t,
  onClose,
  onSaved,
}: {
  userId: string;
  job: Job | null;
  t: TFn;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [company, setCompany] = useState(job?.company ?? "");
  const [role, setRole] = useState(job?.role ?? "");
  const [status, setStatus] = useState<Status>(job?.status ?? "deseos");
  const [location, setLocation] = useState(job?.location ?? "");
  const [salary, setSalary] = useState(job?.salary ?? "");
  const [url, setUrl] = useState(job?.url ?? "");
  const [notes, setNotes] = useState(job?.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!company.trim() || !role.trim()) {
      toast.error(t("empleos.required"));
      return;
    }
    setSaving(true);
    const payload = {
      company: company.trim(),
      role: role.trim(),
      status,
      location: location.trim() || null,
      salary: salary.trim() || null,
      url: url.trim() || null,
      notes: notes.trim() || null,
      applied_at: status === "aplicado" && !job?.applied_at ? new Date().toISOString().slice(0, 10) : job?.applied_at ?? null,
    };

    if (job) {
      const { error } = await supabase.from("job_applications").update(payload).eq("id", job.id);
      if (error) {
        toast.error(t("empleos.saveError"));
        setSaving(false);
        return;
      }
      if (job.status !== status) {
        await supabase.from("job_events").insert({
          job_id: job.id,
          user_id: userId,
          title: `${t("empleos.statusChanged")} "${statusLabel(t, status)}"`,
        });
      }
      toast.success(t("empleos.updated"));
    } else {
      const { data, error } = await supabase
        .from("job_applications")
        .insert({ ...payload, user_id: userId })
        .select()
        .single();
      if (error || !data) {
        toast.error(t("empleos.createError"));
        setSaving(false);
        return;
      }
      await supabase.from("job_events").insert({
        job_id: data.id,
        user_id: userId,
        title: `${t("empleos.appCreatedIn")} "${statusLabel(t, status)}"`,
      });
      toast.success(t("empleos.created"));
    }
    setSaving(false);
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{job ? t("empleos.editTitle") : t("empleos.newTitle")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{t("empleos.company")} *</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder={t("empleos.companyPh")} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("empleos.role")} *</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder={t("empleos.rolePh")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{t("empleos.statusLabel")}</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.key} value={s.key}>
                      {statusLabel(t, s.key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("empleos.location")}</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t("empleos.locationPh")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{t("empleos.salary")}</Label>
              <Input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="$25,000 MXN" />
            </div>
            <div className="space-y-1.5">
              <Label>{t("empleos.url")}</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t("empleos.notes")}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("empleos.notesPh")}
              className="min-h-[90px] resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("empleos.cancel")}
          </Button>
          <Button onClick={save} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("empleos.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function JobDetail({
  job,
  events,
  t,
  onClose,
  onEdit,
  onChanged,
}: {
  job: Job;
  events: JobEvent[];
  t: TFn;
  onClose: () => void;
  onEdit: () => void;
  onChanged: () => void;
}) {
  const [newEvent, setNewEvent] = useState("");
  const [adding, setAdding] = useState(false);

  async function addEvent() {
    if (!newEvent.trim()) return;
    setAdding(true);
    const { error } = await supabase.from("job_events").insert({
      job_id: job.id,
      user_id: job.user_id,
      title: newEvent.trim(),
    });
    setAdding(false);
    if (error) {
      toast.error(t("empleos.noteError"));
      return;
    }
    setNewEvent("");
    toast.success(t("empleos.noteAdded"));
    onChanged();
  }

  async function remove() {
    if (!confirm(t("empleos.confirmDelete"))) return;
    const { error } = await supabase.from("job_applications").delete().eq("id", job.id);
    if (error) {
      toast.error(t("empleos.deleteError"));
      return;
    }
    toast.success(t("empleos.deleted"));
    onClose();
    onChanged();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="pr-6">{job.role}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {statusLabel(t, job.status)}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" /> {job.company}
            </span>
          </div>

          <div className="grid gap-2 text-sm">
            {job.location && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {job.location}
              </p>
            )}
            {job.salary && <p className="text-muted-foreground">💰 {job.salary}</p>}
            {job.url && (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <LinkIcon className="h-4 w-4" /> {t("empleos.viewJob")} <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {job.notes && (
            <div className="rounded-xl bg-muted/40 p-3 text-sm text-foreground/80">{job.notes}</div>
          )}

          <div className="pt-2">
            <p className="mb-2 text-sm font-semibold">{t("empleos.timeline")}</p>
            <div className="flex gap-2">
              <Input
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                placeholder={t("empleos.addNote")}
                onKeyDown={(e) => e.key === "Enter" && addEvent()}
              />
              <Button onClick={addEvent} disabled={adding} size="icon" className="shrink-0">
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              {events.length === 0 && (
                <p className="text-xs text-muted-foreground">{t("empleos.noEvents")}</p>
              )}
              {events.map((e) => (
                <div key={e.id} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p>{e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.occurred_at).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button variant="ghost" className="gap-2 text-destructive hover:text-destructive" onClick={remove}>
            <Trash2 className="h-4 w-4" /> {t("empleos.delete")}
          </Button>
          <Button variant="outline" className="gap-2" onClick={onEdit}>
            <Pencil className="h-4 w-4" /> {t("empleos.edit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
