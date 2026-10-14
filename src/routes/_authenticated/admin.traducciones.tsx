import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Languages, Search, Download, Upload, Save, Loader2, AlertTriangle,
  Layers, CheckCircle2, ShieldAlert, Activity, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import esDict from "@/lib/i18n/locales/es";
import { ENABLED_LOCALES, LOCALES, loadDict, type Dict, type LocaleCode } from "@/lib/i18n/config";
import { useServerFn } from "@tanstack/react-start";
import { getTranslationHealthReport } from "@/lib/i18n.functions";

export const Route = createFileRoute("/_authenticated/admin/traducciones")({
  head: () => ({ meta: [{ title: "Translations | Admin" }, { name: "robots", content: "noindex" }] }),
  component: TranslationsPage,
});

const BASE_KEYS = Object.keys(esDict);

function TranslationsPage() {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [staticDict, setStaticDict] = useState<Dict>({});
  const [overrides, setOverrides] = useState<Dict>({});
  const [drafts, setDrafts] = useState<Dict>({});
  const [q, setQ] = useState("");
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Health report states
  const getHealthReportFn = useServerFn(getTranslationHealthReport);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthData, setHealthData] = useState<{
    unusedKeys: string[];
    duplicateKeys: { value: string; keys: string[] }[];
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    void (async () => {
      const base = locale === "es" ? (esDict as unknown as Dict) : await loadDict(locale);
      setStaticDict(base);
      const { data } = await supabase.from("translations").select("key,value").eq("locale", locale);
      const ov: Dict = {};
      for (const r of data ?? []) ov[r.key] = r.value;
      setOverrides(ov);
      setDrafts({});
      setLoading(false);
    })();
  }, [locale]);

  // Load health report
  async function loadHealthReport() {
    setHealthLoading(true);
    try {
      const res = await getHealthReportFn();
      if (res && res.success) {
        setHealthData({
          unusedKeys: res.unusedKeys || [],
          duplicateKeys: res.duplicateKeys || [],
        });
      } else {
        toast.error("Error loading health report: " + (res?.error || "Unknown"));
      }
    } catch (err: any) {
      toast.error("Error loading health report: " + err.message);
    } finally {
      setHealthLoading(false);
    }
  }

  useEffect(() => {
    void loadHealthReport();
  }, []);

  const effective = (k: string) => drafts[k] ?? overrides[k] ?? staticDict[k] ?? "";
  const isMissing = (k: string) => !overrides[k] && !staticDict[k];
  const missingCount = BASE_KEYS.filter(isMissing).length;

  const rows = useMemo(() => {
    const ql = q.toLowerCase();
    return BASE_KEYS.filter((k) => {
      if (onlyMissing && !isMissing(k)) return false;
      if (!ql) return true;
      return k.toLowerCase().includes(ql) || (esDict as Dict)[k].toLowerCase().includes(ql);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, onlyMissing, overrides, staticDict, drafts]);

  async function saveAll() {
    const changed = Object.entries(drafts).filter(([, v]) => v.trim().length > 0);
    if (!changed.length) return toast.info("No changes to save");
    setSaving(true);
    const payload = changed.map(([key, value]) => ({ locale, key, value }));
    const { error } = await supabase.from("translations").upsert(payload, { onConflict: "locale,key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    setOverrides((o) => ({ ...o, ...Object.fromEntries(changed) }));
    setDrafts({});
    toast.success(`${changed.length} translations saved`);
  }

  function exportJson() {
    const out: Dict = {};
    for (const k of BASE_KEYS) out[k] = effective(k);
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translations.${locale}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Dict;
        const next: Dict = {};
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === "string" && BASE_KEYS.includes(k)) next[k] = v;
        }
        setDrafts((d) => ({ ...d, ...next }));
        toast.success(`${Object.keys(next).length} keys loaded. Review and save.`);
      } catch {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }

  const pct = Math.round(((BASE_KEYS.length - missingCount) / BASE_KEYS.length) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-16">
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Languages className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold">Translations</h1>
          <p className="text-sm text-muted-foreground">Manage languages, edit, import/export, and detect missing translations.</p>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Translation Keys</span>
            <Layers className="h-5 w-5 text-primary opacity-70" />
          </div>
          <p className="mt-2 text-3xl font-bold">{BASE_KEYS.length}</p>
          <p className="text-xs text-muted-foreground">Base keys in Spanish</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Progress ({locale.toUpperCase()})</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500 opacity-70" />
          </div>
          <p className="mt-2 text-3xl font-bold">{pct}%</p>
          <p className="text-xs text-muted-foreground">{missingCount} missing keys</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Unused Keys</span>
            <ShieldAlert className="h-5 w-5 text-amber-500 opacity-70" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {healthLoading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : healthData?.unusedKeys.length ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground">Not found in codebase</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Duplicate Values</span>
            <AlertTriangle className="h-5 w-5 text-rose-500 opacity-70" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {healthLoading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : healthData?.duplicateKeys.length ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground">Repeated translations in base dictionary</p>
        </div>
      </div>

      <Tabs defaultValue="editor" className="space-y-5">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="health">Health Report</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <Select value={locale} onValueChange={(v) => setLocale(v as LocaleCode)}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LOCALES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.flag} {l.label}{!l.enabled ? " (coming soon)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {pct}% complete · {missingCount} missing of {BASE_KEYS.length}
            </span>
            <div className="ml-auto flex flex-wrap gap-2">
              <Button variant={onlyMissing ? "default" : "outline"} size="sm" onClick={() => setOnlyMissing((v) => !v)}>
                <AlertTriangle className="mr-1.5 h-4 w-4" /> Missing
              </Button>
              <Button variant="outline" size="sm" onClick={exportJson}>
                <Download className="mr-1.5 h-4 w-4" /> Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-1.5 h-4 w-4" /> Import
              </Button>
              <input ref={fileRef} type="file" accept="application/json" className="hidden"
                onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
              <Button size="sm" onClick={saveAll} disabled={saving || !Object.keys(drafts).length}>
                {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
                Save
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by key or text…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {rows.map((k) => (
                <div key={k} className="grid grid-cols-1 gap-2 border-b border-border p-3 last:border-0 md:grid-cols-[1fr_1.3fr]">
                  <div className="min-w-0">
                    <code className="block truncate text-xs font-medium text-primary">{k}</code>
                    <span className="block truncate text-xs text-muted-foreground">{(esDict as Dict)[k]}</span>
                  </div>
                  <Input
                    value={effective(k)}
                    placeholder={isMissing(k) ? "— missing translation —" : ""}
                    className={isMissing(k) && !drafts[k] ? "border-destructive/50" : ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [k]: e.target.value }))}
                    disabled={locale === "es"}
                  />
                </div>
              ))}
              {!rows.length && <p className="p-8 text-center text-sm text-muted-foreground">No results found</p>}
            </div>
          )}
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Translation Health Analysis</h2>
            <Button size="sm" variant="outline" onClick={loadHealthReport} disabled={healthLoading}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${healthLoading ? "animate-spin" : ""}`} />
              Scan Codebase
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Language Coverage */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-semibold text-sm">Language Coverage</h3>
              <div className="space-y-3.5">
                {ENABLED_LOCALES.map((langItem) => {
                  const itemPct = langItem.code === "es" ? 100 : pct;
                  return (
                    <div key={langItem.code} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span>{langItem.flag} {langItem.label}</span>
                        <span>{itemPct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${itemPct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General Health Status */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <h3 className="font-semibold text-sm">Integrity Status</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Active languages: <strong>{ENABLED_LOCALES.map((l) => l.label).join(", ")}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                  <span>Pending translations in {locale.toUpperCase()}: <strong>{missingCount}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Unused keys detected: <strong>{healthData?.unusedKeys.length ?? "..."}</strong></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Details Lists */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Unused Keys List */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 flex flex-col h-[400px]">
              <h3 className="font-semibold text-sm">Unused Keys in Codebase ({healthData?.unusedKeys.length ?? 0})</h3>
              <p className="text-xs text-muted-foreground">These keys are defined in the dictionary but have no references in application source files.</p>
              
              <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                {healthLoading ? (
                  <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : healthData && healthData.unusedKeys.length > 0 ? (
                  healthData.unusedKeys.map((k) => (
                    <div key={k} className="rounded-lg border border-border p-2 bg-secondary/20">
                      <code className="block text-xs font-semibold text-primary">{k}</code>
                      <span className="block text-[11px] text-muted-foreground truncate">{(esDict as Dict)[k]}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-muted-foreground py-8">No orphaned keys detected.</p>
                )}
              </div>
            </div>

            {/* Duplicate values list */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 flex flex-col h-[400px]">
              <h3 className="font-semibold text-sm">Duplicate Base Values ({healthData?.duplicateKeys.length ?? 0})</h3>
              <p className="text-xs text-muted-foreground">These translations have identical values in Spanish and could be consolidated under a single generic key.</p>
              
              <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                {healthLoading ? (
                  <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : healthData && healthData.duplicateKeys.length > 0 ? (
                  healthData.duplicateKeys.map((item, idx) => (
                    <div key={idx} className="rounded-lg border border-border p-2 bg-secondary/20 space-y-1">
                      <span className="text-xs font-semibold text-foreground">Value: "{item.value}"</span>
                      <div className="flex flex-wrap gap-1">
                        {item.keys.map((k) => (
                          <code key={k} className="text-[10px] bg-background border px-1.5 py-0.5 rounded text-muted-foreground">{k}</code>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-muted-foreground py-8">No duplicate translations found.</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {locale === "es" && (
        <p className="text-xs text-muted-foreground">Spanish is the base language and is edited directly in the source code.</p>
      )}
      <p className="text-xs text-muted-foreground">
        Active languages: {ENABLED_LOCALES.map((l) => l.label).join(", ")}. Others will be enabled upon completing their translations.
      </p>
    </div>
  );
}