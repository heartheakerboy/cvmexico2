import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Download, Loader2, Upload, Link2, Trash2, Plus, FileText, FileType2,
  Sparkles, ExternalLink, Copy,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { getSignedDownloadUrl, deleteFile } from "@/lib/storage.functions";
import { Uploader } from "@/components/storage/uploader";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/panel/descargas")({
  component: DescargasPage,
});

type Kind = "pdf" | "docx" | "link" | "generado";
type Item = {
  id: string;
  title: string;
  kind: Kind;
  storage_path: string | null;
  url: string | null;
  source: string | null;
  size_bytes: number | null;
  created_at: string;
};

const TABS: { key: Kind | "todos"; label: string; icon: typeof FileText }[] = [
  { key: "todos", label: "Todos", icon: Download },
  { key: "pdf", label: "PDF descargados", icon: FileText },
  { key: "docx", label: "DOCX descargados", icon: FileType2 },
  { key: "link", label: "Enlaces compartidos", icon: Link2 },
  { key: "generado", label: "Archivos generados", icon: Sparkles },
];

const kindMeta: Record<Kind, { label: string; icon: typeof FileText; color: string }> = {
  pdf: { label: "PDF", icon: FileText, color: "text-red-500 bg-red-500/10" },
  docx: { label: "DOCX", icon: FileType2, color: "text-blue-500 bg-blue-500/10" },
  link: { label: "Enlace", icon: Link2, color: "text-emerald-500 bg-emerald-500/10" },
  generado: { label: "Generado", icon: Sparkles, color: "text-primary bg-primary/10" },
};

function fmtSize(n: number | null) {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function DescargasPage() {
  const getSignedDownloadUrlFn = useServerFn(getSignedDownloadUrl);
  const deleteFileFn = useServerFn(deleteFile);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Kind | "todos">("todos");
  const [uid, setUid] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  async function load() {
    const { data: userRes } = await supabase.auth.getUser();
    setUid(userRes.user?.id ?? null);
    const { data } = await supabase
      .from("downloads")
      .select("id, title, kind, storage_path, url, source, size_bytes, created_at")
      .order("created_at", { ascending: false });
    setItems((data as Item[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function open(item: Item) {
    if (item.kind === "link" && item.url) return window.open(item.url, "_blank");
    if (item.storage_path) {
      const res = await getSignedDownloadUrlFn({ data: { storagePath: item.storage_path, expiresInSeconds: 3600 } });
      if (res?.signedUrl) window.open(res.signedUrl, "_blank");
      else toast.error("No se pudo abrir el archivo");
    }
  }

  async function copyLink(item: Item) {
    if (item.kind === "link" && item.url) {
      await navigator.clipboard.writeText(item.url);
      return toast.success("Enlace copiado");
    }
    if (item.storage_path) {
      const res = await getSignedDownloadUrlFn({ data: { storagePath: item.storage_path, expiresInSeconds: 60 * 60 * 24 * 7 } });
      if (res?.signedUrl) { await navigator.clipboard.writeText(res.signedUrl); toast.success("Enlace copiado (válido 7 días)"); }
    }
  }

  async function remove(item: Item) {
    if (item.storage_path) {
      try {
        await deleteFileFn({ data: { storagePath: item.storage_path } });
      } catch (err) {
        console.error("R2 delete error:", err);
      }
    }
    const { error } = await supabase.from("downloads").delete().eq("id", item.id);
    if (error) return toast.error("No se pudo eliminar");
    setItems((l) => l.filter((x) => x.id !== item.id));
  }

  const filtered = tab === "todos" ? items : items.filter((i) => i.kind === tab);
  const count = (k: Kind) => items.filter((i) => i.kind === k).length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Download className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">Centro de descargas</h1>
            <p className="text-sm text-muted-foreground">Todos tus archivos en un solo lugar.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Upload className="h-4 w-4" /> Subir archivo</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader><DialogTitle>Subir archivos a R2 Storage</DialogTitle></DialogHeader>
              <div className="py-4">
                <Uploader
                  folder={`users/${uid || "anonymous"}`}
                  isPublic={false}
                  multiple={true}
                  maxSizeMb={10}
                  onUploadComplete={async (file) => {
                    const ext = (file.name.split(".").pop() ?? "").toLowerCase();
                    const kind: Kind = ext === "pdf" ? "pdf" : ext === "docx" || ext === "doc" ? "docx" : "generado";
                    
                    const { data, error } = await supabase.from("downloads").insert({
                      user_id: uid!,
                      title: file.name,
                      kind,
                      storage_path: file.path,
                      size_bytes: file.size,
                      source: "Subida manual",
                    }).select("id, title, kind, storage_path, url, source, size_bytes, created_at").single();
                    
                    if (!error && data) {
                      setItems((l) => [data as Item, ...l]);
                    }
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4" /> Agregar enlace</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Agregar enlace compartido</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Nombre</Label>
                  <Input value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="Ej. Mi CV en línea" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">URL</Label>
                  <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={async () => {
                  if (!uid || !linkUrl.trim()) return;
                  const { data, error } = await supabase.from("downloads").insert({
                    user_id: uid, title: linkTitle.trim() || linkUrl.trim(), kind: "link", url: linkUrl.trim(), source: "Enlace compartido",
                  }).select("id, title, kind, storage_path, url, source, size_bytes, created_at").single();
                  if (error || !data) return toast.error("No se pudo guardar el enlace");
                  setItems((l) => [data as Item, ...l]);
                  setLinkOpen(false); setLinkTitle(""); setLinkUrl("");
                  toast.success("Enlace agregado");
                }}><Link2 className="h-4 w-4" /> Guardar enlace</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(["pdf", "docx", "link", "generado"] as Kind[]).map((k) => {
          const M = kindMeta[k];
          return (
            <button key={k} onClick={() => setTab(k)}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary/40">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${M.color}`}>
                <M.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-bold">{count(k)}</p>
                <p className="text-xs text-muted-foreground">{TABS.find((t) => t.key === k)?.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
              tab === t.key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
            }`}>
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Download className="h-6 w-6" /></span>
          <h2 className="mt-4 font-display text-lg font-semibold">Sin archivos aún</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">Sube un archivo o agrega un enlace para verlo aquí.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const M = kindMeta[item.kind];
            return (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${M.color}`}>
                  <M.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {M.label}
                    {item.size_bytes ? ` · ${fmtSize(item.size_bytes)}` : ""}
                    {item.source ? ` · ${item.source}` : ""}
                    {` · ${new Date(item.created_at).toLocaleDateString("es-MX")}`}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" onClick={() => copyLink(item)} title="Copiar enlace"><Copy className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => open(item)} title="Abrir"><ExternalLink className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(item)} title="Eliminar"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
