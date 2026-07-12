import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Wrench,
  ArrowLeft,
  Wand2,
  Loader2,
  Copy,
  FileText,
  Target,
  Sparkles,
  Type,
  Mail,
  Award,
  DollarSign,
  Hash,
  FileArchive,
  ImageMinus,
  Download,
  Upload,
  Briefcase,
  CalendarClock,
  Crop,
  SpellCheck,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { generateTool } from "@/lib/herramientas.functions";
import { improveText } from "@/lib/ia.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/_authenticated/panel/herramientas")({
  component: HerramientasPage,
});

type AiTool =
  | "resumen"
  | "objetivos"
  | "habilidades"
  | "titulares"
  | "carta-renuncia"
  | "carta-recomendacion"
  | "descripcion-puesto";
type ClientTool = "salario" | "contador" | "pdf" | "fondo" | "aviso" | "recorte" | "gramatica";
type ToolId = AiTool | ClientTool;

type ToolDef = {
  id: ToolId;
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
};

const tools: ToolDef[] = [
  { id: "resumen", titleKey: "tools.item.resumen.title", descKey: "tools.item.resumen.desc", icon: FileText },
  { id: "objetivos", titleKey: "tools.item.objetivos.title", descKey: "tools.item.objetivos.desc", icon: Target },
  { id: "habilidades", titleKey: "tools.item.habilidades.title", descKey: "tools.item.habilidades.desc", icon: Sparkles },
  { id: "titulares", titleKey: "tools.item.titulares.title", descKey: "tools.item.titulares.desc", icon: Type },
  { id: "carta-renuncia", titleKey: "tools.item.carta-renuncia.title", descKey: "tools.item.carta-renuncia.desc", icon: Mail },
  { id: "carta-recomendacion", titleKey: "tools.item.carta-recomendacion.title", descKey: "tools.item.carta-recomendacion.desc", icon: Award },
  { id: "descripcion-puesto", titleKey: "tools.item.descripcion-puesto.title", descKey: "tools.item.descripcion-puesto.desc", icon: Briefcase },
  { id: "salario", titleKey: "tools.item.salario.title", descKey: "tools.item.salario.desc", icon: DollarSign },
  { id: "aviso", titleKey: "tools.item.aviso.title", descKey: "tools.item.aviso.desc", icon: CalendarClock },
  { id: "gramatica", titleKey: "tools.item.gramatica.title", descKey: "tools.item.gramatica.desc", icon: SpellCheck },
  { id: "contador", titleKey: "tools.item.contador.title", descKey: "tools.item.contador.desc", icon: Hash },
  { id: "pdf", titleKey: "tools.item.pdf.title", descKey: "tools.item.pdf.desc", icon: FileArchive },
  { id: "recorte", titleKey: "tools.item.recorte.title", descKey: "tools.item.recorte.desc", icon: Crop },
  { id: "fondo", titleKey: "tools.item.fondo.title", descKey: "tools.item.fondo.desc", icon: ImageMinus },
];

function HerramientasPage() {
  const { t } = useSettings();
  const [active, setActive] = useState<ToolDef | null>(null);

  if (active) {
    return <ToolView tool={active} onBack={() => setActive(null)} />;
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Wrench className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">{t("tools.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("tools.subtitle")}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActive(tool)}
            className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-shadow hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <tool.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold">{t(tool.titleKey)}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{t(tool.descKey)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ToolView({ tool, onBack }: { tool: ToolDef; onBack: () => void }) {
  const { t } = useSettings();
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("tools.back")}
      </button>

      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <tool.icon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">{t(tool.titleKey)}</h1>
          <p className="text-sm text-muted-foreground">{t(tool.descKey)}</p>
        </div>
      </div>

      <div className="mt-8">
        {isAiTool(tool.id) ? (
          <AiToolPanel tool={tool.id} />
        ) : tool.id === "salario" ? (
          <SalaryCalculator />
        ) : tool.id === "aviso" ? (
          <NoticePeriodCalculator />
        ) : tool.id === "gramatica" ? (
          <GrammarChecker />
        ) : tool.id === "contador" ? (
          <WordCounter />
        ) : tool.id === "pdf" ? (
          <PdfCompressor />
        ) : tool.id === "recorte" ? (
          <ImageCropper />
        ) : (
          <BackgroundRemover />
        )}
      </div>
    </div>
  );
}

function isAiTool(id: ToolId): id is AiTool {
  return !["salario", "contador", "pdf", "fondo", "aviso", "recorte", "gramatica"].includes(id);
}

/* ---------------- AI text tools ---------------- */

function AiToolPanel({ tool }: { tool: AiTool }) {
  const { t, lang } = useSettings();
  const run = useServerFn(generateTool);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [fullName, setFullName] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "text"; text: string } | { type: "list"; items: string[] } | null>(null);

  const needsCompany = tool === "carta-renuncia" || tool === "carta-recomendacion";
  const roleLabel = tool === "carta-recomendacion" ? t("tools.form.roleLabelPerson") : t("tools.form.roleLabelTarget");

  async function generate() {
    if (!role.trim()) {
      toast.error(t("tools.error.role"));
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { tool, role, company, fullName, context, lang } });
      setResult(res);
    } catch (e) {
      console.error(e);
      toast.error(t("tools.error.generate"));
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    const text = result?.type === "list" ? result.items.join("\n") : result?.text ?? "";
    navigator.clipboard.writeText(text);
    toast.success(t("tools.copied"));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>{roleLabel}</Label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder={t("tools.form.rolePlaceholder")} />
          </div>
          {needsCompany && (
            <>
              <div className="space-y-1.5">
                <Label>{t("tools.form.company")}</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder={t("tools.form.companyPlaceholder")} />
              </div>
              <div className="space-y-1.5">
                <Label>{tool === "carta-recomendacion" ? t("tools.form.fullNameColleague") : t("tools.form.fullNameSelf")}</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("tools.form.fullNamePlaceholder")} />
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <Label>{t("tools.form.details")}</Label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={t("tools.form.detailsPlaceholder")}
              className="min-h-[100px] resize-none"
            />
          </div>
          <Button className="w-full gap-2" onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? t("tools.generating") : t("tools.generateIa")}
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">{t("tools.result")}</h3>
          {result && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={copy}>
              <Copy className="h-3.5 w-3.5" /> {t("tools.copy")}
            </Button>
          )}
        </div>
        {!result ? (
          <p className="text-sm text-muted-foreground">
            {t("tools.placeholderResult")}
          </p>
        ) : result.type === "list" ? (
          <div className="flex flex-wrap gap-2">
            {result.items.map((it, i) => (
              <span key={i} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                {it}
              </span>
            ))}
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm text-foreground/80">{result.text}</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- Salary calculator (MX) ---------------- */

function SalaryCalculator() {
  const { t } = useSettings();
  const [gross, setGross] = useState("");
  const g = Number(gross) || 0;

  const { isr, imss, net } = useMemo(() => {
    // Estimación mensual simplificada (ISR tarifa 2024 + cuota obrera IMSS ~2.375%)
    const imss = g * 0.02375;
    const base = g;
    let isr = 0;
    const brackets = [
      [0.01, 746.04, 0, 1.92],
      [746.05, 6332.05, 14.32, 6.4],
      [6332.06, 11128.01, 371.83, 10.88],
      [11128.02, 12935.82, 893.63, 16],
      [12935.83, 15487.71, 1182.88, 17.92],
      [15487.72, 31236.49, 1640.18, 21.36],
      [31236.5, 49233.0, 5004.12, 23.52],
      [49233.01, 93993.9, 9236.89, 30],
      [93993.91, 125325.2, 22665.17, 32],
      [125325.21, 375975.61, 32691.18, 34],
      [375975.62, Infinity, 117912.32, 35],
    ] as const;
    for (const [low, high, fixed, pct] of brackets) {
      if (base >= low && base <= high) {
        isr = fixed + (base - low) * (pct / 100);
        break;
      }
    }
    const net = g - imss - isr;
    return { isr, imss, net: net > 0 ? net : 0 };
  }, [g]);

  const fmt = (n: number) =>
    n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-1.5">
          <Label>{t("tools.salary.grossLabel")}</Label>
          <Input
            type="number"
            value={gross}
            onChange={(e) => setGross(e.target.value)}
            placeholder={t("tools.salary.grossPlaceholder")}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {t("tools.salary.disclaimer")}
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-3">
          <Row label={t("tools.salary.grossRow")} value={fmt(g)} />
          <Row label={t("tools.salary.isrRow")} value={`- ${fmt(isr)}`} />
          <Row label={t("tools.salary.imssRow")} value={`- ${fmt(imss)}`} />
          <div className="border-t border-border pt-3">
            <Row label={t("tools.salary.netRow")} value={fmt(net)} strong />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={strong ? "font-semibold" : "text-sm text-muted-foreground"}>{label}</span>
      <span className={strong ? "font-display text-lg font-bold text-primary" : "text-sm font-medium"}>
        {value}
      </span>
    </div>
  );
}

/* ---------------- Word counter ---------------- */

function WordCounter() {
  const { t } = useSettings();
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.trim() ? (text.match(/[.!?]+/g)?.length || 1) : 0;
  const readMin = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("tools.words.placeholder")}
        className="min-h-[240px] resize-none rounded-2xl"
      />
      <div className="grid grid-cols-2 gap-4">
        <Stat label={t("tools.words.words")} value={words} />
        <Stat label={t("tools.words.characters")} value={chars} />
        <Stat label={t("tools.words.noSpaces")} value={charsNoSpaces} />
        <Stat label={t("tools.words.sentences")} value={sentences} />
        <Stat label={t("tools.words.readingTime")} value={readMin} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-display text-3xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/* ---------------- PDF compressor ---------------- */

function PdfCompressor() {
  const { t } = useSettings();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number; original: number } | null>(null);

  async function compress() {
    if (!file) return;
    setBusy(true);
    setResult(null);
    try {
      const pdfjs = await import("pdfjs-dist");
      const worker = await import("pdfjs-dist/build/pdf.worker.mjs?url");
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      const { jsPDF } = await import("jspdf");

      const buf = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: buf }).promise;
      let pdf: InstanceType<typeof jsPDF> | null = null;

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 1.4 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const img = canvas.toDataURL("image/jpeg", 0.6);
        const orientation = viewport.width > viewport.height ? "l" : "p";
        if (!pdf) {
          pdf = new jsPDF({ orientation, unit: "px", format: [viewport.width, viewport.height] });
        } else {
          pdf.addPage([viewport.width, viewport.height], orientation);
        }
        pdf.addImage(img, "JPEG", 0, 0, viewport.width, viewport.height);
      }

      const blob = pdf!.output("blob");
      setResult({ url: URL.createObjectURL(blob), size: blob.size, original: file.size });
      toast.success(t("tools.pdf.success"));
    } catch (e) {
      console.error(e);
      toast.error(t("tools.pdf.error"));
    } finally {
      setBusy(false);
    }
  }

  const fmtKb = (n: number) => `${(n / 1024).toFixed(0)} KB`;

  return (
    <div className="max-w-xl rounded-2xl border border-border bg-card p-6">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          setResult(null);
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/50"
      >
        <Upload className="h-6 w-6 text-primary" />
        <p className="mt-2 text-sm font-medium">{file ? file.name : t("tools.pdf.selectPdf")}</p>
        <p className="text-xs text-muted-foreground">
          {file ? fmtKb(file.size) : t("tools.pdf.maxSize")}
        </p>
      </button>

      <Button className="mt-4 w-full gap-2" onClick={compress} disabled={!file || busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileArchive className="h-4 w-4" />}
        {busy ? t("tools.pdf.compressing") : t("tools.pdf.compressBtn")}
      </Button>

      {result && (
        <div className="mt-5 rounded-xl bg-muted/40 p-4 text-sm">
          <p>
            {t("tools.pdf.original")} <strong>{fmtKb(result.original)}</strong> → {t("tools.pdf.compressed")}{" "}
            <strong className="text-primary">{fmtKb(result.size)}</strong>
          </p>
          <a href={result.url} download="comprimido.pdf">
            <Button className="mt-3 w-full gap-2" variant="outline">
              <Download className="h-4 w-4" /> {t("tools.pdf.download")}
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}

/* ---------------- Notice period calculator ---------------- */

function NoticePeriodCalculator() {
  const { t, lang } = useSettings();
  const [start, setStart] = useState("");
  const [days, setDays] = useState("14");

  const endDate = useMemo(() => {
    if (!start) return null;
    const d = new Date(start);
    if (isNaN(d.getTime())) return null;
    d.setDate(d.getDate() + (Number(days) || 0));
    return d;
  }, [start, days]);

  const fmt = (d: Date) =>
    d.toLocaleDateString(lang === "en" ? "en-US" : "es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="space-y-1.5">
          <Label>{t("tools.notice.dateLabel")}</Label>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>{t("tools.notice.daysLabel")}</Label>
          <Input type="number" value={days} onChange={(e) => setDays(e.target.value)} placeholder={t("tools.notice.daysPlaceholder")} />
        </div>
        <p className="text-xs text-muted-foreground">
          {t("tools.notice.disclaimer")}
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">{t("tools.notice.estimatedLastDay")}</p>
        <p className="mt-2 font-display text-2xl font-bold capitalize text-primary">
          {endDate ? fmt(endDate) : "—"}
        </p>
      </div>
    </div>
  );
}

/* ---------------- Grammar checker ---------------- */

function GrammarChecker() {
  const { t, lang } = useSettings();
  const run = useServerFn(improveText);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function check() {
    if (!text.trim()) {
      toast.error(t("tools.grammar.error.empty"));
      return;
    }
    setLoading(true);
    try {
      const res = await run({
        data: {
          text,
          instruction: lang === "en"
            ? "Correct the spelling, grammar, and punctuation of the following text, maintaining its meaning and tone"
            : "Corrige la ortografía, la gramática y la puntuación del siguiente texto, manteniendo su significado y tono",
          lang,
        },
      });
      setResult(res.text);
    } catch (e) {
      console.error(e);
      toast.error(t("tools.grammar.error.general"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="space-y-1.5">
          <Label>{t("tools.grammar.textLabel")}</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("tools.grammar.placeholder")}
            className="min-h-[200px] resize-none"
          />
        </div>
        <Button className="w-full gap-2" onClick={check} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SpellCheck className="h-4 w-4" />}
          {loading ? t("tools.grammar.correcting") : t("tools.grammar.correctBtn")}
        </Button>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">{t("tools.grammar.correctedTitle")}</h3>
          {result && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                navigator.clipboard.writeText(result);
                toast.success(t("tools.copied"));
              }}
            >
              <Copy className="h-3.5 w-3.5" /> {t("tools.copy")}
            </Button>
          )}
        </div>
        {result ? (
          <p className="whitespace-pre-wrap text-sm text-foreground/80">{result}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{t("tools.grammar.correctedPlaceholder")}</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- Image cropper ---------------- */

function ImageCropper() {
  const { t } = useSettings();
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [aspect, setAspect] = useState<number>(1);
  const [result, setResult] = useState<string | null>(null);

  const ratios: { label: string; value: number }[] = [
    { label: "1:1", value: 1 },
    { label: "3:4", value: 3 / 4 },
    { label: "4:3", value: 4 / 3 },
    { label: "16:9", value: 16 / 9 },
  ];

  function crop() {
    const img = imgRef.current;
    if (!img) return;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    // Center crop to the selected aspect ratio
    let cw = iw;
    let ch = iw / aspect;
    if (ch > ih) {
      ch = ih;
      cw = ih * aspect;
    }
    const sx = (iw - cw) / 2;
    const sy = (ih - ch) / 2;
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, sx, sy, cw, ch, 0, 0, cw, ch);
    setResult(canvas.toDataURL("image/png"));
    toast.success(t("tools.crop.success"));
  }

  return (
    <div className="max-w-xl rounded-2xl border border-border bg-card p-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          setSrc(f ? URL.createObjectURL(f) : null);
          setResult(null);
        }}
      />
      {!src ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/50"
        >
          <Upload className="h-6 w-6 text-primary" />
          <p className="mt-2 text-sm font-medium">{t("tools.crop.selectImage")}</p>
          <p className="text-xs text-muted-foreground">{t("tools.crop.formatHelp")}</p>
        </button>
      ) : (
        <>
          <img ref={imgRef} src={src} alt="Original" className="w-full rounded-xl border border-border" />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("tools.crop.ratio")}</span>
            {ratios.map((r) => (
              <Button
                key={r.label}
                size="sm"
                variant={aspect === r.value ? "default" : "outline"}
                onClick={() => setAspect(r.value)}
              >
                {r.label}
              </Button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="flex-1 gap-2" onClick={crop}>
              <Crop className="h-4 w-4" /> {t("tools.crop.cropBtn")}
            </Button>
            <Button variant="outline" onClick={() => inputRef.current?.click()}>
              {t("tools.crop.changeBtn")}
            </Button>
          </div>
        </>
      )}

      {result && (
        <div className="mt-5">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">{t("tools.crop.resultTitle")}</p>
          <img src={result} alt="Recortada" className="w-full rounded-xl border border-border" />
          <a href={result} download="recortada.png">
            <Button className="mt-3 w-full gap-2" variant="outline">
              <Download className="h-4 w-4" /> {t("tools.pdf.download")}
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}

/* ---------------- Background remover ---------------- */

function BackgroundRemover() {
  const { t } = useSettings();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setResult(null);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file);
      setResult(URL.createObjectURL(blob));
      toast.success(t("tools.bg.success"));
    } catch (e) {
      console.error(e);
      toast.error(t("tools.bg.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl rounded-2xl border border-border bg-card p-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          setFile(f);
          setResult(null);
          setPreview(f ? URL.createObjectURL(f) : null);
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/50"
      >
        <Upload className="h-6 w-6 text-primary" />
        <p className="mt-2 text-sm font-medium">{file ? file.name : t("tools.crop.selectImage")}</p>
        <p className="text-xs text-muted-foreground">{t("tools.crop.formatHelp")}</p>
      </button>

      <Button className="mt-4 w-full gap-2" onClick={run} disabled={!file || busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageMinus className="h-4 w-4" />}
        {busy ? t("tools.bg.processing") : t("tools.bg.removeBtn")}
      </Button>

      {(preview || result) && (
        <div className="mt-5 grid grid-cols-2 gap-4">
          {preview && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">{t("tools.bg.originalLabel")}</p>
              <img src={preview} alt="Original" className="w-full rounded-xl border border-border" />
            </div>
          )}
          {result && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">{t("tools.bg.noBgLabel")}</p>
              <img
                src={result}
                alt="Sin fondo"
                className="w-full rounded-xl border border-border [background:repeating-conic-gradient(#e5e7eb_0_25%,transparent_0_50%)_50%/16px_16px]"
              />
              <a href={result} download="sin-fondo.png">
                <Button className="mt-3 w-full gap-2" variant="outline" size="sm">
                  <Download className="h-4 w-4" /> {t("tools.pdf.download")}
                </Button>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
