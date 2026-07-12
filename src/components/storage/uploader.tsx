import React, { useCallback, useState, useRef } from "react";
import { Upload, X, RefreshCw, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { getUploadUrl, confirmUpload } from "@/lib/storage.functions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useServerFn } from "@tanstack/react-start";

export type UploadedFile = {
  id: string;
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
};

type UploaderProps = {
  folder: string;
  isPublic?: boolean;
  accept?: string;
  maxSizeMb?: number;
  multiple?: boolean;
  onUploadComplete?: (file: UploadedFile) => void;
  onAllCompleted?: (files: UploadedFile[]) => void;
  compressImages?: boolean;
};

type UploadTask = {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: "idle" | "uploading" | "completed" | "failed";
  error?: string;
  abortController?: AbortController;
  retryCount: number;
};

const MAX_IMAGE_DIMENSION = 1200;
const COMPRESSION_QUALITY = 0.8;

export function Uploader({
  folder,
  isPublic = false,
  accept = "*/*",
  maxSizeMb = 10,
  multiple = false,
  onUploadComplete,
  onAllCompleted,
  compressImages = true,
}: UploaderProps) {
  const getUploadUrlFn = useServerFn(getUploadUrl);
  const confirmUploadFn = useServerFn(confirmUpload);
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image helper using canvas
  const compressImage = async (file: File): Promise<Blob | File> => {
    if (!compressImages || !file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
      return file;
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
        if (scale === 1) {
          resolve(file);
          return;
        }
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve(new File([blob], file.name, { type: "image/webp" }));
            } else {
              resolve(file);
            }
          },
          "image/webp",
          COMPRESSION_QUALITY
        );
      };
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  };

  // Perform upload logic
  const performUpload = async (task: UploadTask) => {
    const abortController = new AbortController();
    
    setTasks((current) =>
      current.map((t) =>
        t.id === task.id
          ? { ...t, status: "uploading", progress: 0, abortController, error: undefined }
          : t
      )
    );

    try {
      // 1. Prepare and compress
      let uploadFile: Blob | File = task.file;
      if (task.file.type.startsWith("image/")) {
        uploadFile = await compressImage(task.file);
      }

      // 2. Request presigned URL from server
      const { uploadUrl, storagePath, fileUrl, fileId } = await getUploadUrlFn({
        data: {
          fileName: task.name,
          fileType: uploadFile.type || "application/octet-stream",
          fileSize: uploadFile.size,
          isPublic,
          folder,
        }
      });

      // 3. Upload directly to Cloudflare R2
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", uploadFile.type || "application/octet-stream");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setTasks((current) =>
            current.map((t) => (t.id === task.id ? { ...t, progress } : t))
          );
        }
      };

      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`HTTP Error ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Network upload error"));
        xhr.onabort = () => reject(new Error("Upload aborted"));
      });

      // Handle abort signal
      abortController.signal.addEventListener("abort", () => {
        xhr.abort();
      });

      xhr.send(uploadFile);
      await uploadPromise;

      // 4. Confirm completion in DB
      const { file: finalFile } = await confirmUploadFn({
        data: {
          fileId,
          fileSize: uploadFile.size,
        }
      });

      setTasks((current) =>
        current.map((t) => (t.id === task.id ? { ...t, status: "completed", progress: 100 } : t))
      );

      const uploaded: UploadedFile = {
        id: finalFile.id,
        name: finalFile.file_name,
        url: finalFile.file_url,
        path: finalFile.storage_path,
        size: Number(finalFile.file_size),
        type: finalFile.file_type,
      };

      if (onUploadComplete) {
        onUploadComplete(uploaded);
      }

      // Check if all are done
      setTasks((current) => {
        const completedTasks = current.map((t) =>
          t.id === task.id ? { ...t, status: "completed" as const } : t
        );
        const allFinished = completedTasks.every((t) => t.status === "completed");
        if (allFinished && onAllCompleted) {
          const results = completedTasks.map((t) => ({
            id: t.id, // note: in multi-upload task id might be temporary, but callbacks will receive DB values
            name: t.name,
            url: fileUrl,
            path: storagePath,
            size: uploadFile.size,
            type: uploadFile.type,
          }));
          onAllCompleted(results);
        }
        return completedTasks;
      });

      toast.success(`${task.name} subido con éxito`);
    } catch (err: any) {
      if (err.message === "Upload aborted") {
        setTasks((current) =>
          current.map((t) => (t.id === task.id ? { ...t, status: "idle", progress: 0 } : t))
        );
        return;
      }

      console.error(err);

      // Auto Retry logic (up to 3 times)
      if (task.retryCount < 3) {
        setTasks((current) =>
          current.map((t) =>
            t.id === task.id ? { ...t, retryCount: t.retryCount + 1 } : t
          )
        );
        toast.error(`Error subiendo ${task.name}. Reintentando automáticamente (${task.retryCount + 1}/3)...`);
        performUpload({ ...task, retryCount: task.retryCount + 1 });
      } else {
        setTasks((current) =>
          current.map((t) =>
            t.id === task.id
              ? { ...t, status: "failed", error: err.message || "Failed to upload" }
              : t
          )
        );
        toast.error(`No se pudo subir ${task.name}`);
      }
    }
  };

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      const newTasks: UploadTask[] = [];
      const list = multiple ? Array.from(fileList) : [fileList[0]];

      for (const file of list) {
        // Validation: Size
        if (file.size > maxSizeMb * 1024 * 1024) {
          toast.error(`${file.name} supera el tamaño máximo de ${maxSizeMb}MB`);
          continue;
        }

        // Validation: Type Check
        if (accept !== "*/*") {
          const mimeMatches = accept.split(",").some((term) => {
            const trimmed = term.trim();
            if (trimmed.startsWith(".")) {
              return file.name.toLowerCase().endsWith(trimmed.toLowerCase());
            }
            if (trimmed.endsWith("/*")) {
              return file.type.startsWith(trimmed.replace("/*", ""));
            }
            return file.type === trimmed;
          });
          if (!mimeMatches) {
            toast.error(`${file.name} no tiene un tipo de archivo válido`);
            continue;
          }
        }

        // Duplicate check in current queue
        if (tasks.some((t) => t.name === file.name && t.size === file.size && t.status !== "failed")) {
          toast.info(`${file.name} ya está en la cola de subida`);
          continue;
        }

        const task: UploadTask = {
          id: Math.random().toString(36).substring(7),
          file,
          name: file.name,
          size: file.size,
          progress: 0,
          status: "idle",
          retryCount: 0,
        };

        newTasks.push(task);
      }

      if (newTasks.length === 0) return;

      if (multiple) {
        setTasks((current) => [...current, ...newTasks]);
        newTasks.forEach((t) => performUpload(t));
      } else {
        // Cancel any active tasks in single mode
        tasks.forEach((t) => t.abortController?.abort());
        setTasks(newTasks);
        performUpload(newTasks[0]);
      }
    },
    [tasks, multiple, accept, maxSizeMb, folder, isPublic]
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const cancelUpload = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      if (task.abortController) {
        task.abortController.abort();
      }
      setTasks((current) => current.filter((t) => t.id !== taskId));
    }
  };

  const retryUpload = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      performUpload({ ...task, retryCount: 0 });
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
          dragActive
            ? "border-primary bg-primary/5 scale-[0.99]"
            : "border-border bg-card hover:border-primary/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Upload className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-sm font-semibold">
          Arrastra tus archivos aquí o haz clic para buscar
        </h3>
        <p className="mt-2 text-xs text-muted-foreground">
          Soporta {accept === "*/*" ? "cualquier archivo" : accept} hasta {maxSizeMb}MB.
        </p>
      </div>

      {/* Task List */}
      {tasks.length > 0 && (
        <div className="space-y-2 rounded-xl border border-border bg-card p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Archivos ({tasks.length})
          </h4>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {task.file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(task.file)}
                        alt=""
                        className="h-8 w-8 rounded object-cover border border-border bg-background"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{task.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {(task.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {task.status === "completed" && (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    )}
                    {task.status === "failed" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-primary hover:text-primary/80"
                          onClick={(e) => {
                            e.stopPropagation();
                            retryUpload(task.id);
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <span title={task.error}><AlertCircle className="h-5 w-5 text-destructive" /></span>
                      </>
                    )}
                    {task.status === "uploading" && (
                      <span className="text-[10px] font-bold text-primary">{task.progress}%</span>
                    )}
                    {task.status !== "completed" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelUpload(task.id);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {task.status === "uploading" && (
                  <Progress value={task.progress} className="h-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
