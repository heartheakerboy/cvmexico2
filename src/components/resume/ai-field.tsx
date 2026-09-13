import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles, Wand2, Loader2, Check, Copy, CornerDownLeft, Plus,
  Undo2, Redo2, RefreshCw, X, ChevronRight, Gauge,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { assistWrite } from "@/lib/resume-ai.functions";

export type ResumeAiContext = {
  jobTitle: string;
  headline: string;
  industry: string;
  targetCountry: string;
  city?: string;
  skills: string[];
  experience: { role: string; company: string; description: string }[];
  education: { degree: string; school: string }[];
};

type AiPrefs = {
  lang: string;
  roleLevel: string;
  setRoleLevel: (v: string) => void;
  getContext: () => ResumeAiContext;
};

const AiPrefsCtx = createContext<AiPrefs | null>(null);

export function AiProvider({
  lang, getContext, children,
}: { lang: string; getContext: () => ResumeAiContext; children: React.ReactNode }) {
  const [roleLevel, setRoleLevel] = useState("");
  const value = useMemo(
    () => ({ lang, roleLevel, setRoleLevel, getContext }),
    [lang, roleLevel, getContext],
  );
  return <AiPrefsCtx.Provider value={value}>{children}</AiPrefsCtx.Provider>;
}

function useAiPrefs() {
  const ctx = useContext(AiPrefsCtx);
  if (!ctx) throw new Error("useAiPrefs must be used within AiProvider");
  return ctx;
}

type ActionDef = { id: string; label: string };
type Group = { label: string; items: ActionDef[] };

const GROUPS: Group[] = [
  {
    label: "Generar",
    items: [
      { id: "generate", label: "Generar contenido" },
      { id: "continue", label: "Continuar escribiendo" },
      { id: "bullets", label: "Generar viñetas" },
      { id: "responsibilities", label: "Responsabilidades del puesto" },
      { id: "achievements", label: "Generar logros" },
    ],
  },
  {
    label: "Mejorar",
    items: [
      { id: "improve", label: "Mejorar redacción" },
      { id: "rewrite", label: "Reescribir" },
      { id: "expand", label: "Expandir" },
      { id: "shorten", label: "Acortar" },
      { id: "readability", label: "Mejorar legibilidad" },
      { id: "action_verbs", label: "Añadir verbos de acción" },
      { id: "quantify", label: "Añadir resultados medibles" },
      { id: "summarize", label: "Resumir" },
    ],
  },
  {
    label: "Tono",
    items: [
      { id: "professional", label: "Hacer profesional" },
      { id: "executive", label: "Hacer ejecutivo" },
      { id: "friendly", label: "Hacer cercano" },
    ],
  },
  {
    label: "Corregir",
    items: [
      { id: "grammar", label: "Corregir gramática" },
      { id: "spelling", label: "Corregir ortografía" },
    ],
  },
  {
    label: "Traducir",
    items: [
      { id: "translate_en", label: "Traducir a inglés" },
      { id: "translate_es", label: "Traducir a español" },
    ],
  },
];

const ROLE_OPTIONS: ActionDef[] = [
  { id: "", label: "Automático" },
  { id: "student", label: "Estudiante" },
  { id: "intern", label: "Practicante" },
  { id: "entry", label: "Nivel inicial" },
  { id: "junior", label: "Junior" },
  { id: "mid", label: "Nivel medio" },
  { id: "senior", label: "Senior" },
  { id: "lead", label: "Lead" },
  { id: "manager", label: "Manager" },
  { id: "executive", label: "Ejecutivo" },
  { id: "freelancer", label: "Freelancer" },
  { id: "government", label: "Gobierno" },
];

const LOADER_MESSAGES = [
  "Analizando el contexto de tu CV…",
  "Identificando palabras clave del sector…",
  "Redactando con enfoque en logros…",
  "Optimizando para ATS…",
  "Puliendo el tono profesional…",
];

export function AiField({
  label, value: rawValue, onChange, section, field, placeholder, multiline = false, rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  section: string;
  field?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const value = rawValue ?? "";
  const { lang, roleLevel, setRoleLevel, getContext } = useAiPrefs();
  const assist = useServerFn(assistWrite);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaderIdx, setLoaderIdx] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const [, force] = useState(0);

  const hasContent = value.trim().length > 0;

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setLoaderIdx((i) => (i + 1) % LOADER_MESSAGES.length), 1400);
    return () => clearInterval(id);
  }, [loading]);

  async function run(action: string) {
    setLastAction(action);
    setResult(null);
    setLoading(true);
    setLoaderIdx(0);
    try {
      const res = await assist({
        data: {
          action,
          text: value,
          field: field ?? label,
          section,
          roleLevel,
          lang,
          context: getContext(),
        },
      });
      setResult(res.text);
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || "";
      if (msg.includes("Unauthorized") || msg.includes("No authorization") || msg.includes("token")) {
        toast.error("Sesión no válida o expirada. Por favor recarga la página o inicia sesión de nuevo.");
      } else if (msg) {
        toast.error(`No se pudo generar: ${msg}`);
      } else {
        toast.error("No se pudo generar. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  function applyValue(next: string) {
    undoStack.current.push(value);
    redoStack.current = [];
    onChange(next);
    setResult(null);
    setOpen(false);
    toast.success("Texto aplicado con IA", {
      action: { label: "Deshacer", onClick: undo },
    });
    force((n) => n + 1);
  }

  function undo() {
    const prev = undoStack.current.pop();
    if (prev === undefined) return;
    redoStack.current.push(value);
    onChange(prev);
    force((n) => n + 1);
  }
  function redo() {
    const next = redoStack.current.pop();
    if (next === undefined) return;
    undoStack.current.push(value);
    onChange(next);
    force((n) => n + 1);
  }

  return (
    <div className="group/aifield relative space-y-1.5">
      {label && <Label className="text-xs">{label}</Label>}
      <div className="relative">
        {multiline ? (
          <Textarea
            rows={rows}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <Input
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "absolute right-1.5 flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary shadow-sm backdrop-blur transition-all duration-200",
                "opacity-0 group-hover/aifield:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100",
                "hover:bg-primary hover:text-primary-foreground",
                multiline ? "top-1.5" : "top-1/2 -translate-y-1/2",
              )}
              aria-label="Escribir con IA"
            >
              <Sparkles className="h-3 w-3" />
              {hasContent ? "Mejorar con IA" : "Escribir con IA"}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
            <AiPanel
              hasContent={hasContent}
              multiline={multiline}
              loading={loading}
              loaderMsg={LOADER_MESSAGES[loaderIdx]}
              result={result}
              roleLevel={roleLevel}
              setRoleLevel={setRoleLevel}
              canUndo={undoStack.current.length > 0}
              canRedo={redoStack.current.length > 0}
              onRun={run}
              onRegenerate={() => lastAction && run(lastAction)}
              onReplace={() => result != null && applyValue(result)}
              onInsertBelow={() => result != null && applyValue(value ? `${value}\n${result}` : result)}
              onAppend={() => result != null && applyValue(value ? `${value} ${result}` : result)}
              onCopy={() => { if (result != null) { navigator.clipboard.writeText(result); toast.success("Copiado"); } }}
              onCancel={() => { setResult(null); setOpen(false); }}
              onUndo={undo}
              onRedo={redo}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function AiPanel({
  hasContent, multiline, loading, loaderMsg, result, roleLevel, setRoleLevel,
  canUndo, canRedo, onRun, onRegenerate, onReplace, onInsertBelow, onAppend,
  onCopy, onCancel, onUndo, onRedo,
}: {
  hasContent: boolean;
  multiline: boolean;
  loading: boolean;
  loaderMsg: string;
  result: string | null;
  roleLevel: string;
  setRoleLevel: (v: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onRun: (a: string) => void;
  onRegenerate: () => void;
  onReplace: () => void;
  onInsertBelow: () => void;
  onAppend: () => void;
  onCopy: () => void;
  onCancel: () => void;
  onUndo: () => void;
  onRedo: () => void;
}) {
  return (
    <div className="flex max-h-[70vh] flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
        <span className="flex items-center gap-1.5 font-display text-sm font-semibold">
          <Wand2 className="h-4 w-4 text-primary" /> Asistente IA
        </span>
        <div className="flex items-center gap-0.5">
          <button onClick={onUndo} disabled={!canUndo} className="rounded p-1 text-muted-foreground hover:bg-accent disabled:opacity-30" aria-label="Deshacer">
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={onRedo} disabled={!canRedo} className="rounded p-1 text-muted-foreground hover:bg-accent disabled:opacity-30" aria-label="Rehacer">
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            <Sparkles className="absolute inset-0 m-auto h-4 w-4 animate-pulse text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">{loaderMsg}</p>
        </div>
      ) : result != null ? (
        <div className="flex flex-col">
          <div className="border-b border-border px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Vista previa
          </div>
          <ScrollArea className="max-h-56">
            <p className="whitespace-pre-wrap px-3 py-3 text-sm leading-relaxed">{result}</p>
          </ScrollArea>
          <div className="grid grid-cols-2 gap-1.5 border-t border-border p-2.5">
            <Button size="sm" className="gap-1.5" onClick={onReplace}><Check className="h-3.5 w-3.5" /> Reemplazar</Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={onAppend}><Plus className="h-3.5 w-3.5" /> Añadir</Button>
            {multiline && (
              <Button size="sm" variant="outline" className="gap-1.5" onClick={onInsertBelow}><CornerDownLeft className="h-3.5 w-3.5" /> Insertar debajo</Button>
            )}
            <Button size="sm" variant="outline" className="gap-1.5" onClick={onCopy}><Copy className="h-3.5 w-3.5" /> Copiar</Button>
            <Button size="sm" variant="ghost" className="gap-1.5" onClick={onRegenerate}><RefreshCw className="h-3.5 w-3.5" /> Regenerar</Button>
            <Button size="sm" variant="ghost" className="gap-1.5" onClick={onCancel}><X className="h-3.5 w-3.5" /> Cancelar</Button>
          </div>
        </div>
      ) : (
        <ScrollArea className="max-h-[52vh]">
          <div className="p-2">
            <div className="px-1.5 pb-2">
              <Button className="w-full gap-1.5" size="sm" onClick={() => onRun("ats")}>
                <Gauge className="h-4 w-4" /> Optimizar para ATS
              </Button>
            </div>
            <div className="flex items-center gap-2 px-1.5 pb-2">
              <span className="text-[11px] text-muted-foreground">Nivel</span>
              <Select value={roleLevel || "auto"} onValueChange={(v) => setRoleLevel(v === "auto" ? "" : v)}>
                <SelectTrigger className="h-7 flex-1 text-xs"><SelectValue placeholder="Automático" /></SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r.id || "auto"} value={r.id || "auto"} onPointerDown={(e) => e.stopPropagation()}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {GROUPS.map((g) => (
              <div key={g.label} className="mb-1">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{g.label}</p>
                {g.items.map((a) => {
                  const disabled = !hasContent && !["generate", "bullets", "responsibilities", "achievements", "translate_en", "translate_es"].includes(a.id);
                  const primary = !hasContent && a.id === "generate";
                  return (
                    <button
                      key={a.id}
                      onClick={() => onRun(a.id)}
                      disabled={disabled}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                        "hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40",
                        primary && "font-medium text-primary",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className={cn("h-3.5 w-3.5", primary ? "text-primary" : "text-muted-foreground")} />
                        {a.label}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

// Standalone button (e.g. for tag lists like Skills) that suggests items and appends them.
export function AiSuggestButton({
  section, field, current, onAdd, action = "suggest_skills", label = "Sugerir con IA",
}: {
  section: string;
  field?: string;
  current: string[];
  onAdd: (items: string[]) => void;
  action?: "suggest_skills" | "suggest_keywords";
  label?: string;
}) {
  const { lang, roleLevel, getContext } = useAiPrefs();
  const assist = useServerFn(assistWrite);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await assist({
        data: {
          action,
          text: current.join(", "),
          field: field ?? "Habilidades",
          section,
          roleLevel,
          lang,
          context: getContext(),
        },
      });
      const items = res.text
        .split(/[,\n]/)
        .map((s) => s.replace(/^[-•\d.\s]+/, "").trim())
        .filter((s) => s && !current.some((c) => c.toLowerCase() === s.toLowerCase()));
      if (!items.length) return toast.info("Sin nuevas sugerencias");
      onAdd(items.slice(0, 12));
      toast.success(`${Math.min(items.length, 12)} sugerencias añadidas`);
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || "";
      if (msg.includes("Unauthorized") || msg.includes("No authorization") || msg.includes("token")) {
        toast.error("Sesión no válida o expirada. Por favor recarga la página o inicia sesión de nuevo.");
      } else if (msg) {
        toast.error(`No se pudo generar: ${msg}`);
      } else {
        toast.error("No se pudo generar");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" className="gap-1.5" onClick={run} disabled={loading}>
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-primary" />}
      {label}
    </Button>
  );
}