import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image as ImageIcon, Upload, Trash2, Loader2, FolderPlus, Folder, RefreshCw,
  HardDrive, FileImage, Layers, Check, Replace as ReplaceIcon, FileCode,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/db/client";
import { getUploadUrl, confirmUpload, deleteFile, getSignedDownloadUrl } from "@/lib/storage.functions";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaAdmin,
});

type MediaFile = {
  id: string;
  name: string;
  path: string;
  folder: string;
  mime_type: string | null;
  size: number;
  width: number | null;
  height: number | null;
  is_svg: boolean;
  created_at: string;
};

const BUCKET = "media";
const MAX_DIMENSION = 1600;
const COMPRESS_QUALITY = 0.8;

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function slug(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
}

// Compress raster images client-side via canvas. Returns original for SVG/GIF.
async function compressImage(file: File): Promise<Blob> {
  if (file.type === "image/svg+xml" || file.type === "image/gif" || !file.type.startsWith("image/")) {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    width = Math.round(width * scale);
    height = Math.round(height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob((b) => res(b), "image/webp", COMPRESS_QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;
    return blob;
  } catch {
    return file;
  }
}

async function imageDimensions(file: Blob): Promise<{ width: number | null; height: number | null }> {
  try {
    const bitmap = await createImageBitmap(file);
    return { width: bitmap.width, height: bitmap.height };
  } catch {
    return { width: null, height: null };
  }
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

function Thumb({ file, url }: { file: MediaFile; url?: string }) {
  if (file.is_svg || (file.mime_type ?? "").startsWith("image/")) {
    return url ? (
      <img src={url} alt={file.name} className="h-full w-full object-contain" loading="lazy" />
    ) : (
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    );
  }
  return <FileImage className="h-8 w-8 text-muted-foreground" />;
}

function MediaAdmin() {
  const getUploadUrlFn = useServerFn(getUploadUrl);
  const confirmUploadFn = useServerFn(confirmUpload);
  const deleteFileFn = useServerFn(deleteFile);
  const getSignedDownloadUrlFn = useServerFn(getSignedDownloadUrl);

  const [files, setFiles] = useState<MediaFile[] | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [uploadFolder, setUploadFolder] = useState<string>("general");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [compress, setCompress] = useState(true);
  const [newFolder, setNewFolder] = useState("");
  const [folderDialog, setFolderDialog] = useState(false);
  const [extraFolders, setExtraFolders] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const replaceTarget = useRef<MediaFile | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("media_files").select("*").order("created_at", { ascending: false });
    const rows = (data ?? []) as MediaFile[];
    setFiles(rows);
    // sign preview URLs for images
    const imgs = rows.filter((f) => f.is_svg || (f.mime_type ?? "").startsWith("image/"));
    if (imgs.length) {
      const map: Record<string, string> = {};
      await Promise.all(
        imgs.map(async (f) => {
          try {
            const res = await getSignedDownloadUrlFn({ data: { storagePath: f.path } });
            if (res?.signedUrl) map[f.path] = res.signedUrl;
          } catch (err) {
            console.error("Sign R2 URL error for path:", f.path, err);
          }
        })
      );
      setUrls(map);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const folders = useMemo(() => {
    const set = new Set<string>(["general", ...extraFolders]);
    (files ?? []).forEach((f) => set.add(f.folder));
    return Array.from(set).sort();
  }, [files, extraFolders]);

  const visible = useMemo(
    () => (files ?? []).filter((f) => activeFolder === "all" || f.folder === activeFolder),
    [files, activeFolder],
  );

  const totalSize = useMemo(() => (files ?? []).reduce((s, f) => s + f.size, 0), [files]);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setUploading(true);
    let ok = 0;
    for (const raw of Array.from(list)) {
      try {
        const isSvg = raw.type === "image/svg+xml" || raw.name.toLowerCase().endsWith(".svg");
        const blob = compress ? await compressImage(raw) : raw;

        // 1. Get R2 presigned upload URL
        const { uploadUrl, storagePath, fileId } = await getUploadUrlFn({
          data: {
            fileName: raw.name,
            fileType: blob.type || raw.type || "application/octet-stream",
            fileSize: blob.size,
            isPublic: true,
            folder: uploadFolder,
          }
        });

        // 2. Upload to R2 via PUT
        const response = await fetch(uploadUrl, {
          method: "PUT",
          body: blob,
          headers: {
            "Content-Type": blob.type || raw.type || "application/octet-stream",
          },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        // 3. Confirm in DB
        await confirmUploadFn({ data: { fileId, fileSize: blob.size } });

        const dims = (blob.type || raw.type).startsWith("image/") && !isSvg ? await imageDimensions(blob) : { width: null, height: null };
        const { error: dbErr } = await supabase.from("media_files").insert({
          name: raw.name,
          path: storagePath,
          folder: uploadFolder,
          mime_type: blob.type || raw.type || null,
          size: blob.size,
          width: dims.width,
          height: dims.height,
          is_svg: isSvg,
        });
        if (dbErr) { toast.error(`${raw.name}: ${dbErr.message}`); continue; }
        ok++;
      } catch (e: any) {
        toast.error(`Error uploading ${raw.name}: ${e.message}`);
      }
    }
    setUploading(false);
    if (ok) toast.success(`${ok} file(s) uploaded`);
    load();
  }

  async function doReplace(file: MediaFile, raw: File) {
    setUploading(true);
    try {
      const blob = compress ? await compressImage(raw) : raw;
      
      const { uploadUrl, storagePath: r2Path, fileId } = await getUploadUrlFn({
        data: {
          fileName: raw.name,
          fileType: blob.type || raw.type || "application/octet-stream",
          fileSize: blob.size,
          isPublic: true,
          folder: file.folder,
        }
      });

      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": blob.type || raw.type || "application/octet-stream",
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      await confirmUploadFn({ data: { fileId, fileSize: blob.size } });

      // Delete the old file
      try {
        await deleteFileFn({ data: { storagePath: file.path } });
      } catch (err) {
        console.error("Failed to delete old R2 file:", err);
      }

      const isSvg = raw.type === "image/svg+xml" || raw.name.toLowerCase().endsWith(".svg");
      const dims = (blob.type || raw.type).startsWith("image/") && !isSvg ? await imageDimensions(blob) : { width: null, height: null };
      
      await supabase.from("media_files").update({
        name: raw.name,
        path: r2Path,
        mime_type: blob.type || raw.type || null,
        size: blob.size,
        width: dims.width,
        height: dims.height,
        is_svg: isSvg,
      }).eq("id", file.id);

      toast.success("File replaced");
      load();
    } catch (e: any) {
      console.error(e);
      toast.error("Error replacing file: " + e.message);
    } finally {
      setUploading(false);
    }
  }

  async function removeFiles(ids: string[]) {
    const rows = (files ?? []).filter((f) => ids.includes(f.id));
    if (rows.length === 0) return;
    
    // Delete all from R2
    for (const r of rows) {
      try {
        await deleteFileFn({ data: { storagePath: r.path } });
      } catch (err) {
        console.error("Failed to delete R2 media file:", r.path, err);
      }
    }

    const { error } = await supabase.from("media_files").delete().in("id", ids);
    if (error) return toast.error(error.message);
    setSelected(new Set());
    toast.success(`${ids.length} file(s) deleted`);
    load();
  }

  function toggleSelect(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  const loading = files === null;
  const svgCount = (files ?? []).filter((f) => f.is_svg).length;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ImageIcon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground">Upload, organize, and compress assets.</p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={FileImage} label="Files" value={String(files!.length)} />
            <Kpi icon={Folder} label="Folders" value={String(folders.length)} />
            <Kpi icon={FileCode} label="SVG" value={String(svgCount)} />
            <Kpi icon={HardDrive} label="Storage" value={humanSize(totalSize)} />
          </div>

          {/* Upload bar */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Upload to folder</Label>
                <Select value={uploadFolder} onValueChange={setUploadFolder}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {folders.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={compress} onChange={(e) => setCompress(e.target.checked)} className="h-4 w-4 rounded border-border" />
                Compress images (WebP, max 1600px)
              </label>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={() => setFolderDialog(true)}>
                  <FolderPlus className="mr-2 h-4 w-4" />New folder
                </Button>
                <Button variant="outline" size="icon" onClick={() => load()} title="Reload">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button onClick={() => fileInput.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Upload files
                </Button>
              </div>
            </div>
            <input
              ref={fileInput}
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
            />
            <input
              ref={replaceInput}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && replaceTarget.current) doReplace(replaceTarget.current, f);
                replaceTarget.current = null;
                e.target.value = "";
              }}
            />
          </div>

          {/* Folder filter + bulk actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveFolder("all")}
              className={`rounded-full px-3 py-1 text-xs font-medium ${activeFolder === "all" ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground"}`}
            >
              All
            </button>
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFolder(f)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${activeFolder === f ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground"}`}
              >
                <Folder className="h-3 w-3" />{f}
              </button>
            ))}
            {selected.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="ml-auto"
                onClick={() => removeFiles(Array.from(selected))}
              >
                <Trash2 className="mr-2 h-4 w-4" />Delete {selected.size}
              </Button>
            )}
          </div>

          {/* Grid */}
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              No files in this folder. Upload some to get started.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {visible.map((f) => {
                const sel = selected.has(f.id);
                return (
                  <div
                    key={f.id}
                    className={`group relative overflow-hidden rounded-2xl border bg-card transition-colors ${sel ? "border-primary ring-1 ring-primary" : "border-border"}`}
                  >
                    <button
                      onClick={() => toggleSelect(f.id)}
                      className={`absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-md border ${sel ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background/80"}`}
                      aria-label="Select"
                    >
                      {sel && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <div className="flex aspect-square items-center justify-center bg-muted/40 p-3">
                      <Thumb file={f} url={urls[f.path]} />
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-medium" title={f.name}>{f.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {humanSize(f.size)}{f.width ? ` · ${f.width}×${f.height}` : ""}{f.is_svg ? " · SVG" : ""}
                      </p>
                      <div className="mt-2 flex gap-1">
                        <Button
                          variant="outline" size="sm" className="h-7 flex-1 text-[11px]"
                          onClick={() => { replaceTarget.current = f; replaceInput.current?.click(); }}
                        >
                          <ReplaceIcon className="mr-1 h-3 w-3" />Replace
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFiles([f.id])}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* New folder dialog */}
      <Dialog open={folderDialog} onOpenChange={setFolderDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>New Folder</DialogTitle></DialogHeader>
          <div className="space-y-1.5">
            <Label className="text-xs">Name</Label>
            <Input value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder="logos" />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                const name = slug(newFolder.trim());
                if (!name) return toast.error("Please enter a name");
                setExtraFolders((s) => Array.from(new Set([...s, name])));
                setUploadFolder(name);
                setActiveFolder(name);
                setNewFolder("");
                setFolderDialog(false);
                toast.success("Folder created");
              }}
            >
              <Layers className="mr-2 h-4 w-4" />Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
