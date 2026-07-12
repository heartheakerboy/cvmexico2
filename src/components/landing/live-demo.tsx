import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { ResumePaper } from "@/components/resume/resume-paper";
import { sampleDoc } from "@/lib/resume/sample";
import { defaultLayout, makeDefaultDesign } from "@/lib/resume/types";
import { TEMPLATES } from "@/lib/resume/registry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/settings";

const DEMO_TEMPLATES = ["corporate", "modern-sidebar", "creative", "executive"];

export function LiveDemo() {
  const { t } = useSettings();
  const [name, setName] = useState("Diego Hernández");
  const [role, setRole] = useState("Gerente de Marketing");
  const [skills, setSkills] = useState("SEO, Analítica, Growth, Branding");
  const [summary, setSummary] = useState("");
  const [tpl, setTpl] = useState("corporate");
  const [loading, setLoading] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / 794);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const runAi = () => {
    setLoading(true);
    setSummary("");
    setTimeout(() => {
      setSummary(t("home.demo.aiResult"));
      setLoading(false);
    }, 1200);
  };

  const doc = {
    ...sampleDoc,
    full_name: name || sampleDoc.full_name,
    headline: role || sampleDoc.headline,
    summary: summary || sampleDoc.summary,
    skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
  };
  const meta = TEMPLATES.find((x) => x.id === tpl)!;
  const design = makeDefaultDesign(meta.accent);

  return (
    <div className="grid gap-6 rounded-3xl border border-border bg-card p-4 shadow-xl md:grid-cols-2 md:p-6">
      {/* Editor */}
      <div className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="d-name">{t("home.demo.nameLabel")}</Label>
          <Input id="d-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="d-role">{t("home.demo.roleLabel")}</Label>
          <Input id="d-role" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="d-skills">{t("home.demo.skillsLabel")}</Label>
          <Input id="d-skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label>{t("home.demo.summaryLabel")}</Label>
            <Button size="sm" variant="secondary" className="h-7 gap-1.5" onClick={runAi} disabled={loading}>
              <Sparkles className={`h-3.5 w-3.5 ${loading ? "animate-pulse" : ""}`} />
              {loading ? t("home.demo.generating") : t("home.demo.aiBtn")}
            </Button>
          </div>
          <div className="min-h-[68px] rounded-md border border-input bg-background p-2.5 text-sm text-muted-foreground">
            {summary || <span className="opacity-50">…</span>}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>{t("home.demo.templateLabel")}</Label>
          <div className="flex flex-wrap gap-2">
            {DEMO_TEMPLATES.map((id) => {
              const m = TEMPLATES.find((x) => x.id === id)!;
              return (
                <button
                  key={id}
                  onClick={() => setTpl(id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    tpl === id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{t("home.demo.demoNote")}</p>
      </div>

      {/* Live preview */}
      <div className="relative">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-foreground/80 px-2.5 py-1 text-[11px] font-medium text-background">
          {t("home.demo.livePreview")}
        </span>
        <div ref={boxRef} className="overflow-hidden rounded-xl border border-border bg-white" style={{ height: 520 }}>
          <div style={{ width: 794, transform: `scale(${scale})`, transformOrigin: "top left", pointerEvents: "none" }}>
            <ResumePaper templateId={tpl} doc={doc} design={design} layout={defaultLayout} />
          </div>
        </div>
      </div>
    </div>
  );
}