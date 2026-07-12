import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Loader2, Download, Undo2, Redo2, Check, Eye, EyeOff,
  LayoutTemplate, Palette, ListOrdered, FileText, Upload, X, GripVertical, FileDown,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getUploadUrl, confirmUpload } from "@/lib/storage.functions";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  type ResumeDoc, type Design, type Layout, type SectionKey,
  normalizeDoc, normalizeLayout, makeDefaultDesign, defaultLayout,
  SECTION_LABELS, FONT_LABELS, ALL_SECTIONS,
} from "@/lib/resume/types";
import { TEMPLATES, getTemplate } from "@/lib/resume/registry";
import { ResumePreview } from "@/components/resume/resume-preview";
import { ResumePaper } from "@/components/resume/resume-paper";
import { ResumeThumb } from "@/components/resume/resume-thumb";
import { TextField, AreaField, ArrayEditor, TagEditor } from "@/components/resume/editor-fields";
import { AiProvider, AiField, AiSuggestButton, type ResumeAiContext } from "@/components/resume/ai-field";
import { useSettings } from "@/lib/settings";
import { exportToPdf, exportToDocx } from "@/lib/cv-export";

export const Route = createFileRoute("/_authenticated/cv/$id")({
  head: () => ({ meta: [{ title: "Editar CV | CurriculumPerfecto" }, { name: "robots", content: "noindex" }] }),
  component: EditorPage,
});

type State = { title: string; template: string; doc: ResumeDoc; design: Design; layout: Layout };
type Tab = "content" | "sections" | "design" | "template";

function EditorPage() {
  const getUploadUrlFn = useServerFn(getUploadUrl);
  const confirmUploadFn = useServerFn(confirmUpload);

  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<State | null>(null);
  const [tab, setTab] = useState<Tab>("content");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [exporting, setExporting] = useState(false);
  const [exportingDocx, setExportingDocx] = useState(false);

  const stateRef = useRef<State | null>(null);
  const history = useRef<{ stack: State[]; index: number }>({ stack: [], index: -1 });
  const histTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [, force] = useState(0);

  // Load
  useEffect(() => {
    (async () => {
      const { data: cv, error } = await supabase.from("resumes").select("*").eq("id", id).maybeSingle();
      if (error || !cv) {
        toast.error("CV no encontrado");
        navigate({ to: "/panel/curriculums" });
        return;
      }
      const doc = normalizeDoc({
        full_name: cv.full_name ?? "",
        headline: cv.headline ?? "",
        photo_url: cv.photo_url ?? "",
        email: cv.email ?? "",
        phone: cv.phone ?? "",
        location: cv.location ?? "",
        website: cv.website ?? "",
        summary: cv.summary ?? "",
        experience: (cv.experience as ResumeDoc["experience"]) ?? [],
        education: (cv.education as ResumeDoc["education"]) ?? [],
        skills: (cv.skills as string[]) ?? [],
        ...((cv.extras as Partial<ResumeDoc>) ?? {}),
      });
      const tpl = getTemplate(cv.template);
      const savedDesign = cv.design as Partial<Design>;
      const design: Design = { ...makeDefaultDesign(tpl.accent), ...savedDesign };
      const layout = normalizeLayout(cv.layout as Partial<Layout>);
      const init: State = { title: cv.title ?? "Mi CV", template: tpl.id, doc, design, layout };
      stateRef.current = init;
      history.current = { stack: [init], index: 0 };
      setState(init);
    })();
  }, [id, navigate]);

  const persist = useCallback(async (s: State) => {
    setStatus("saving");
    const { doc } = s;
    const extras = {
      projects: doc.projects, languages: doc.languages, certifications: doc.certifications,
      awards: doc.awards, references: doc.references, interests: doc.interests, socials: doc.socials,
    };
    const { error } = await supabase.from("resumes").update({
      title: s.title, template: s.template,
      full_name: doc.full_name, headline: doc.headline, photo_url: doc.photo_url,
      email: doc.email, phone: doc.phone, location: doc.location, website: doc.website,
      summary: doc.summary, experience: doc.experience, education: doc.education, skills: doc.skills,
      extras: extras as never, design: s.design as never, layout: s.layout as never,
    }).eq("id", id);
    setStatus(error ? "idle" : "saved");
    if (error) toast.error("No se pudo guardar");
  }, [id]);

  // Apply an update: live state + debounced history checkpoint + debounced autosave
  const apply = useCallback((next: State) => {
    stateRef.current = next;
    setState(next);
    clearTimeout(histTimer.current);
    histTimer.current = setTimeout(() => {
      const h = history.current;
      h.stack = h.stack.slice(0, h.index + 1);
      h.stack.push(stateRef.current!);
      h.index = h.stack.length - 1;
      force((n) => n + 1);
    }, 600);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(stateRef.current!), 1000);
  }, [persist]);

  const undo = useCallback(() => {
    clearTimeout(histTimer.current);
    const h = history.current;
    if (h.index <= 0) return;
    h.index -= 1;
    const s = h.stack[h.index];
    stateRef.current = s;
    setState(s);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(s), 800);
    force((n) => n + 1);
  }, [persist]);

  const redo = useCallback(() => {
    const h = history.current;
    if (h.index >= h.stack.length - 1) return;
    h.index += 1;
    const s = h.stack[h.index];
    stateRef.current = s;
    setState(s);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(s), 800);
    force((n) => n + 1);
  }, [persist]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { doc, design, layout, template } = state;
  const setDoc = (patch: Partial<ResumeDoc>) => apply({ ...state, doc: { ...doc, ...patch } });
  const setDesign = (patch: Partial<Design>) => apply({ ...state, design: { ...design, ...patch } });
  const setLayout = (l: Layout) => apply({ ...state, layout: l });
  const canUndo = history.current.index > 0;
  const canRedo = history.current.index < history.current.stack.length - 1;

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
          <Link to="/panel/curriculums" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Volver</span>
          </Link>
          <Input
            value={state.title}
            onChange={(e) => apply({ ...state, title: e.target.value })}
            className="max-w-[220px] border-transparent bg-transparent font-medium focus-visible:border-input"
          />
          <div className="flex items-center gap-1.5">
            <span className="mr-1 hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
              {status === "saving" ? <><Loader2 className="h-3 w-3 animate-spin" /> Guardando…</> : status === "saved" ? <><Check className="h-3 w-3" /> Guardado</> : null}
            </span>
            <Button variant="ghost" size="icon" disabled={!canUndo} onClick={undo} title="Deshacer"><Undo2 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" disabled={!canRedo} onClick={redo} title="Rehacer"><Redo2 className="h-4 w-4" /></Button>
            <Button className="gap-2" onClick={async () => {
              setExporting(true);
              const toastId = toast.loading("Generando PDF…");
              try {
                const pdfBlob = await exportToPdf("resume-print-area", state.title);

                const { data: userData } = await supabase.auth.getUser();
                const userId = userData.user?.id || "anonymous";
                const fileName = `${state.title.replace(/[^a-zA-Z0-9.-]/g, "_")}.pdf`;

                try {
                  const { uploadUrl, storagePath, fileId } = await getUploadUrlFn({
                    data: {
                      fileName,
                      fileType: "application/pdf",
                      fileSize: pdfBlob.size,
                      isPublic: false,
                      folder: `users/${userId}/pdf`,
                    }
                  });
                  const r = await fetch(uploadUrl, { method: "PUT", body: pdfBlob, headers: { "Content-Type": "application/pdf" } });
                  if (r.ok) {
                    await confirmUploadFn({ data: { fileId, fileSize: pdfBlob.size } });
                    await supabase.from("downloads").insert({
                      user_id: userId, title: fileName, kind: "pdf",
                      storage_path: storagePath, size_bytes: pdfBlob.size, source: "CV Generado",
                    });
                  }
                } catch { /* Storage optional — still download */ }

                const link = document.createElement("a");
                link.href = URL.createObjectURL(pdfBlob);
                link.download = fileName;
                link.click();

                toast.success("¡PDF descargado!", { id: toastId });
              } catch (err: any) {
                console.error("Export error:", err);
                toast.error("Error al exportar PDF: " + err.message, { id: toastId });
              } finally {
                setExporting(false);
              }
            }} disabled={exporting || exportingDocx}>
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden sm:inline">Descargar PDF</span>
            </Button>

            <Button variant="outline" className="gap-2" onClick={async () => {
              setExportingDocx(true);
              const toastId = toast.loading("Generando DOCX…");
              try {
                await exportToDocx(doc, design, state.title);
                toast.success("¡DOCX descargado!", { id: toastId });
              } catch (err: any) {
                console.error("DOCX error:", err);
                toast.error("Error al exportar DOCX: " + err.message, { id: toastId });
              } finally {
                setExportingDocx(false);
              }
            }} disabled={exporting || exportingDocx}>
              {exportingDocx ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              <span className="hidden sm:inline">Descargar DOCX</span>
            </Button>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 px-4">
          {([["content", "Contenido", FileText], ["sections", "Secciones", ListOrdered], ["design", "Diseño", Palette], ["template", "Plantilla", LayoutTemplate]] as const).map(([t, lbl, Icon]) => (
            <button key={t} onClick={() => setTab(t)} className={cn("flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors", tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
              <Icon className="h-4 w-4" /> {lbl}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-5 print:hidden">
          {tab === "content" && <ContentTab doc={doc} setDoc={setDoc} templateId={template} />}
          {tab === "sections" && <SectionsTab layout={layout} setLayout={setLayout} />}
          {tab === "design" && <DesignTab design={design} setDesign={setDesign} />}
          {tab === "template" && <TemplateTab current={template} onPick={(tid) => apply({ ...state, template: tid })} />}
        </div>
        <div className="lg:sticky lg:top-32 lg:self-start">
          <ResumePreview templateId={template} doc={doc} design={design} layout={layout} />
        </div>
      </main>

      {/* Print-only, full-scale render */}
      <div id="resume-print-area">
        <ResumePaper templateId={template} doc={doc} design={design} layout={layout} />
      </div>
    </div>
  );
}

/* ---------- Content tab ---------- */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 font-display text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function ContentTab({ doc, setDoc, templateId }: { doc: ResumeDoc; setDoc: (p: Partial<ResumeDoc>) => void; templateId: string }) {
  const { prefs } = useSettings();
  const lang = prefs.resumeLang === "bilingual" ? "bilingual" : prefs.resumeLang;
  const docRef = useRef(doc);
  docRef.current = doc;
  const getContext = useCallback((): ResumeAiContext => {
    const d = docRef.current;
    return {
      templateId,
      jobTitle: d.headline || d.experience[0]?.role || "",
      headline: d.headline,
      industry: "",
      targetCountry: "México",
      skills: d.skills,
      experience: d.experience.map((e) => ({ role: e.role, company: e.company, description: e.description })),
      education: d.education.map((e) => ({ degree: e.degree, school: e.school })),
    };
  }, [templateId]);
  return (
    <AiProvider lang={lang} getContext={getContext}>
      <Card title="Datos personales">
        <div className="space-y-3">
          <PhotoField value={doc.photo_url} onChange={(v) => setDoc({ photo_url: v })} />
          <TextField label="Nombre completo" value={doc.full_name} onChange={(v) => setDoc({ full_name: v })} />
          <AiField label="Título profesional" section="Título profesional" field="Título / headline" value={doc.headline} onChange={(v) => setDoc({ headline: v })} placeholder="Ej. Ingeniero de Software" />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Correo" value={doc.email} onChange={(v) => setDoc({ email: v })} />
            <TextField label="Teléfono" value={doc.phone} onChange={(v) => setDoc({ phone: v })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Ubicación" value={doc.location} onChange={(v) => setDoc({ location: v })} placeholder="CDMX, MX" />
            <TextField label="Sitio / Portafolio" value={doc.website} onChange={(v) => setDoc({ website: v })} />
          </div>
        </div>
      </Card>
      <Card title={SECTION_LABELS.summary}>
        <AiField label="" section="Resumen profesional" field="Resumen profesional" multiline rows={4} value={doc.summary} onChange={(v) => setDoc({ summary: v })} placeholder="Breve descripción de tu perfil profesional…" />
      </Card>
      <Card title={SECTION_LABELS.experience}>
        <ArrayEditor
          items={doc.experience}
          onChange={(v) => setDoc({ experience: v })}
          blank={{ role: "", company: "", period: "", location: "", description: "" }}
          addLabel="Añadir experiencia"
          render={(e, up) => (
            <div className="space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Puesto" value={e.role} onChange={(ev) => up({ role: ev.target.value })} />
                <Input placeholder="Empresa" value={e.company} onChange={(ev) => up({ company: ev.target.value })} />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Periodo" value={e.period} onChange={(ev) => up({ period: ev.target.value })} />
                <Input placeholder="Ubicación" value={e.location} onChange={(ev) => up({ location: ev.target.value })} />
              </div>
              <AiField label="" section="Experiencia laboral" field="Logros y responsabilidades" multiline rows={3} value={e.description} onChange={(v) => up({ description: v })} placeholder="Logros y responsabilidades" />
            </div>
          )}
        />
      </Card>
      <Card title={SECTION_LABELS.education}>
        <ArrayEditor
          items={doc.education}
          onChange={(v) => setDoc({ education: v })}
          blank={{ degree: "", school: "", period: "", location: "", description: "" }}
          addLabel="Añadir educación"
          render={(e, up) => (
            <div className="space-y-2">
              <Input placeholder="Título / Carrera" value={e.degree} onChange={(ev) => up({ degree: ev.target.value })} />
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Institución" value={e.school} onChange={(ev) => up({ school: ev.target.value })} />
                <Input placeholder="Periodo" value={e.period} onChange={(ev) => up({ period: ev.target.value })} />
              </div>
              <AiField label="" section="Educación" field="Descripción" multiline rows={2} value={e.description} onChange={(v) => up({ description: v })} placeholder="Descripción (opcional)" />
            </div>
          )}
        />
      </Card>
      <Card title={SECTION_LABELS.skills}>
        <TagEditor items={doc.skills} onChange={(v) => setDoc({ skills: v })} placeholder="Añadir habilidad y Enter" />
        <div className="mt-3 flex gap-2">
          <AiSuggestButton section="Habilidades" current={doc.skills} onAdd={(items) => setDoc({ skills: [...doc.skills, ...items] })} action="suggest_skills" label="Sugerir habilidades" />
          <AiSuggestButton section="Habilidades" current={doc.skills} onAdd={(items) => setDoc({ skills: [...doc.skills, ...items] })} action="suggest_keywords" label="Palabras clave ATS" />
        </div>
      </Card>
      <Card title={SECTION_LABELS.projects}>
        <ArrayEditor
          items={doc.projects}
          onChange={(v) => setDoc({ projects: v })}
          blank={{ name: "", description: "", link: "", period: "" }}
          addLabel="Añadir proyecto"
          render={(p, up) => (
            <div className="space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Nombre" value={p.name} onChange={(ev) => up({ name: ev.target.value })} />
                <Input placeholder="Periodo" value={p.period} onChange={(ev) => up({ period: ev.target.value })} />
              </div>
              <AiField label="" section="Proyectos" field="Descripción del proyecto" multiline rows={2} value={p.description} onChange={(v) => up({ description: v })} placeholder="Descripción" />
              <Input placeholder="Enlace" value={p.link} onChange={(ev) => up({ link: ev.target.value })} />
            </div>
          )}
        />
      </Card>
      <Card title={SECTION_LABELS.languages}>
        <ArrayEditor
          items={doc.languages}
          onChange={(v) => setDoc({ languages: v })}
          blank={{ name: "", level: "" }}
          addLabel="Añadir idioma"
          render={(l, up) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <Input placeholder="Idioma" value={l.name} onChange={(ev) => up({ name: ev.target.value })} />
              <Input placeholder="Nivel" value={l.level} onChange={(ev) => up({ level: ev.target.value })} />
            </div>
          )}
        />
      </Card>
      <Card title={SECTION_LABELS.certifications}>
        <ArrayEditor
          items={doc.certifications}
          onChange={(v) => setDoc({ certifications: v })}
          blank={{ name: "", issuer: "", year: "" }}
          addLabel="Añadir certificación"
          render={(c, up) => (
            <div className="space-y-2">
              <Input placeholder="Nombre" value={c.name} onChange={(ev) => up({ name: ev.target.value })} />
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Emisor" value={c.issuer} onChange={(ev) => up({ issuer: ev.target.value })} />
                <Input placeholder="Año" value={c.year} onChange={(ev) => up({ year: ev.target.value })} />
              </div>
            </div>
          )}
        />
      </Card>
      <Card title={SECTION_LABELS.awards}>
        <ArrayEditor
          items={doc.awards}
          onChange={(v) => setDoc({ awards: v })}
          blank={{ name: "", issuer: "", year: "" }}
          addLabel="Añadir premio"
          render={(a, up) => (
            <div className="space-y-2">
              <Input placeholder="Nombre" value={a.name} onChange={(ev) => up({ name: ev.target.value })} />
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Otorgado por" value={a.issuer} onChange={(ev) => up({ issuer: ev.target.value })} />
                <Input placeholder="Año" value={a.year} onChange={(ev) => up({ year: ev.target.value })} />
              </div>
            </div>
          )}
        />
      </Card>
      <Card title={SECTION_LABELS.references}>
        <ArrayEditor
          items={doc.references}
          onChange={(v) => setDoc({ references: v })}
          blank={{ name: "", relation: "", contact: "" }}
          addLabel="Añadir referencia"
          render={(r, up) => (
            <div className="space-y-2">
              <Input placeholder="Nombre" value={r.name} onChange={(ev) => up({ name: ev.target.value })} />
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Relación" value={r.relation} onChange={(ev) => up({ relation: ev.target.value })} />
                <Input placeholder="Contacto" value={r.contact} onChange={(ev) => up({ contact: ev.target.value })} />
              </div>
            </div>
          )}
        />
      </Card>
      <Card title={SECTION_LABELS.interests}>
        <TagEditor items={doc.interests} onChange={(v) => setDoc({ interests: v })} placeholder="Añadir interés y Enter" />
      </Card>
      <Card title={SECTION_LABELS.socials}>
        <ArrayEditor
          items={doc.socials}
          onChange={(v) => setDoc({ socials: v })}
          blank={{ label: "", url: "" }}
          addLabel="Añadir red social"
          render={(s, up) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <Input placeholder="Red (LinkedIn)" value={s.label} onChange={(ev) => up({ label: ev.target.value })} />
              <Input placeholder="URL" value={s.url} onChange={(ev) => up({ url: ev.target.value })} />
            </div>
          )}
        />
      </Card>
    </AiProvider>
  );
}

function PhotoField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  async function onFile(file: File) {
    const dataUrl = await resizeImage(file, 400);
    onChange(dataUrl);
  }
  return (
    <div className="flex items-center gap-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-secondary">
        {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-muted-foreground"><Upload className="h-5 w-5" /></div>}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>Subir foto</Button>
        {value && <Button variant="ghost" size="sm" onClick={() => onChange("")}><X className="h-4 w-4" /></Button>}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </div>
    </div>
  );
}

function resizeImage(file: File, max: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------- Sections tab (show/hide + drag reorder) ---------- */
function SectionsTab({ layout, setLayout }: { layout: Layout; setLayout: (l: Layout) => void }) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const order = layout.order.length ? layout.order : ALL_SECTIONS;

  function toggle(key: SectionKey) {
    const hidden = layout.hidden.includes(key) ? layout.hidden.filter((k) => k !== key) : [...layout.hidden, key];
    setLayout({ ...layout, hidden });
  }
  function move(from: number, to: number) {
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setLayout({ ...layout, order: next });
  }

  return (
    <Card title="Orden y visibilidad de secciones">
      <p className="mb-3 text-xs text-muted-foreground">Arrastra para reordenar. Usa el ojo para mostrar u ocultar.</p>
      <div className="space-y-2">
        {order.map((key, i) => {
          const hidden = layout.hidden.includes(key);
          return (
            <div
              key={key}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragIndex !== null && dragIndex !== i) move(dragIndex, i); setDragIndex(null); }}
              className={cn("flex items-center gap-2 rounded-lg border border-border bg-card p-2.5", dragIndex === i && "opacity-50")}
            >
              <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
              <span className={cn("flex-1 text-sm", hidden && "text-muted-foreground line-through")}>{SECTION_LABELS[key]}</span>
              <button onClick={() => toggle(key)} className="text-muted-foreground hover:text-foreground">
                {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ---------- Design tab ---------- */
function DesignTab({ design, setDesign }: { design: Design; setDesign: (p: Partial<Design>) => void }) {
  const swatches = ["#2563eb", "#0ea5e9", "#0d9488", "#16a34a", "#7c3aed", "#e11d48", "#ea580c", "#c8a44d", "#111827"];
  return (
    <>
      <Card title="Color de acento">
        <div className="flex flex-wrap items-center gap-2">
          {swatches.map((c) => (
            <button key={c} onClick={() => setDesign({ accent: c })} className={cn("h-8 w-8 rounded-full border-2", design.accent.toLowerCase() === c ? "border-foreground" : "border-transparent")} style={{ background: c }} />
          ))}
          <input type="color" value={design.accent} onChange={(e) => setDesign({ accent: e.target.value })} className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent" />
        </div>
      </Card>
      <Card title="Tipografía">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Títulos</Label>
            <select value={design.headingFont} onChange={(e) => setDesign({ headingFont: e.target.value as Design["headingFont"] })} className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm">
              {Object.entries(FONT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Cuerpo</Label>
            <select value={design.bodyFont} onChange={(e) => setDesign({ bodyFont: e.target.value as Design["bodyFont"] })} className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm">
              {Object.entries(FONT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
        <Slider label={`Tamaño de fuente (${Math.round(design.fontScale * 100)}%)`} min={0.85} max={1.2} step={0.05} value={design.fontScale} onChange={(v) => setDesign({ fontScale: v })} />
      </Card>
      <Card title="Espaciado y márgenes">
        <Slider label={`Márgenes (${design.margin} mm)`} min={8} max={22} step={1} value={design.margin} onChange={(v) => setDesign({ margin: v })} />
        <Slider label={`Espacio entre secciones (${Math.round(design.spacing * 100)}%)`} min={0.7} max={1.5} step={0.1} value={design.spacing} onChange={(v) => setDesign({ spacing: v })} />
      </Card>
      <Card title="Formato de página">
        <div className="flex gap-2">
          {(["a4", "letter"] as const).map((p) => (
            <Button key={p} variant={design.paper === p ? "default" : "outline"} size="sm" onClick={() => setDesign({ paper: p })}>
              {p === "a4" ? "A4" : "Carta (Letter)"}
            </Button>
          ))}
        </div>
      </Card>
    </>
  );
}

function Slider({ label, value, onChange, min, max, step }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  return (
    <div className="mt-3 space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-primary" />
    </div>
  );
}

/* ---------- Template tab ---------- */
function TemplateTab({ current, onPick }: { current: string; onPick: (id: string) => void }) {
  return (
    <Card title="Cambiar plantilla">
      <p className="mb-4 text-xs text-muted-foreground">Tus datos se conservan al cambiar de plantilla. Solo cambia el diseño.</p>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((t) => (
          <button key={t.id} onClick={() => onPick(t.id)} className={cn("group overflow-hidden rounded-xl border-2 text-left transition-colors", current === t.id ? "border-primary" : "border-border hover:border-primary/40")}>
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
              <ResumeThumb templateId={t.id} accent={t.accent} />
              {current === t.id && <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" /></span>}
            </div>
            <div className="p-2">
              <div className="flex items-center gap-1 text-xs font-semibold">{t.name}</div>
              <div className="mt-0.5 flex flex-wrap gap-1">
                {t.ats && <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">ATS</span>}
                {t.premium && <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">Premium</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}