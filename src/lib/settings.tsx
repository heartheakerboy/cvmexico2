import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/db/client";
import { toast } from "sonner";
import esDict from "@/lib/i18n/locales/es";
import {
  DEFAULT_LOCALE,
  detectBrowserLocale,
  getLocaleMeta,
  isLocaleCode,
  loadDict,
  type Dict,
  type LocaleCode,
} from "@/lib/i18n/config";

export type Lang = LocaleCode;
export type Theme = "light" | "dark";

export type LocalePrefs = {
  dashboardLang: LocaleCode;
  resumeLang: LocaleCode | "bilingual";
  aiOutputLang: LocaleCode;
  dateFormat: string;
  numberFormat: string;
  timezone: string;
  currency: string;
};

const DEFAULT_PREFS: LocalePrefs = {
  dashboardLang: "es",
  resumeLang: "es",
  aiOutputLang: "es",
  dateFormat: "dd/MM/yyyy",
  numberFormat: "es-MX",
  timezone: "America/Mexico_City",
  currency: "MXN",
};

type SettingsCtx = {
  lang: Lang;
  theme: Theme;
  prefs: LocalePrefs;
  ready: boolean;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  setPref: <K extends keyof LocalePrefs>(key: K, value: LocalePrefs[K]) => void;
  t: (k: string, vars?: Record<string, string | number>) => string;
  formatDate: (d: Date | string | number) => string;
  formatNumber: (n: number) => string;
  formatCurrency: (n: number) => string;
};

const Ctx = createContext<SettingsCtx | null>(null);

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function interpolate(str: string, vars?: Record<string, string | number>) {
  if (!vars) return str;
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) =>
    vars[k] != null ? String(vars[k]) : `{{${k}}}`,
  );
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LOCALE);
  const [theme, setThemeState] = useState<Theme>("light");
  const [prefs, setPrefs] = useState<LocalePrefs>(DEFAULT_PREFS);
  const [ready, setReady] = useState(false);
  // dictionaries cache per locale (static + DB overrides merged)
  const [dicts, setDicts] = useState<Record<string, Dict>>({ es: esDict });
  const overridesRef = useRef<Record<string, Dict>>({});

  // Load and cache a locale dictionary (lazy) + DB overrides.
  const ensureDict = useCallback(async (code: LocaleCode) => {
    setDicts((prev) => {
      if (prev[code]) return prev;
      return prev; // will be filled by async below
    });
    const base = code === "es" ? esDict : await loadDict(code);
    let overrides = overridesRef.current[code];
    if (!overrides) {
      overrides = {};
      try {
        const { data } = await supabase
          .from("translations")
          .select("key,value")
          .eq("locale", code);
        for (const row of data ?? []) overrides[row.key] = row.value;
      } catch {
        /* offline / unauthenticated: fall back to static dict */
      }
      overridesRef.current[code] = overrides;
    }
    setDicts((prev) => ({ ...prev, [code]: { ...base, ...overrides } }));
  }, []);

  // Initial bootstrap: theme, stored/detected language, profile prefs.
  useEffect(() => {
    const storedTheme = localStorage.getItem("app.theme") as Theme | null;
    if (storedTheme === "light" || storedTheme === "dark") {
      setThemeState(storedTheme);
      applyTheme(storedTheme);
    }

    const stored = localStorage.getItem("app.lang");
    let initial: LocaleCode = DEFAULT_LOCALE;
    let suggest: LocaleCode | null = null;
    if (isLocaleCode(stored)) {
      initial = stored;
    } else {
      // First visit: Spanish stays the default. If the browser is Spanish we
      // open in Spanish; otherwise we keep Spanish but suggest the detected
      // language (e.g. English) without forcing the switch.
      const detected = detectBrowserLocale();
      initial = DEFAULT_LOCALE;
      localStorage.setItem("app.lang", initial);
      if (detected !== DEFAULT_LOCALE) suggest = detected;
    }
    setLangState(initial);
    void ensureDict(initial).then(() => {
      setReady(true);
      if (suggest) {
        const meta = getLocaleMeta(suggest);
        toast(`${meta.flag} Continue in ${meta.englishLabel}?`, {
          duration: 8000,
          action: {
            label: meta.label,
            onClick: () => {
              setLangState(suggest!);
              localStorage.setItem("app.lang", suggest!);
              setPrefs((p) => ({ ...p, dashboardLang: suggest! }));
              void ensureDict(suggest!);
            },
          },
        });
      }
    });

    // Pull saved account preferences (cross-device persistence).
    void (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data: p } = await supabase
        .from("profiles")
        .select(
          "dashboard_lang,resume_lang,ai_output_lang,date_format,number_format,timezone,currency",
        )
        .eq("id", auth.user.id)
        .maybeSingle();
      if (!p) return;
      const next: LocalePrefs = {
        dashboardLang: (isLocaleCode(p.dashboard_lang) ? p.dashboard_lang : "es"),
        resumeLang: (p.resume_lang as LocalePrefs["resumeLang"]) ?? "es",
        aiOutputLang: (isLocaleCode(p.ai_output_lang) ? p.ai_output_lang : "es"),
        dateFormat: p.date_format ?? DEFAULT_PREFS.dateFormat,
        numberFormat: p.number_format ?? DEFAULT_PREFS.numberFormat,
        timezone: p.timezone ?? DEFAULT_PREFS.timezone,
        currency: p.currency ?? DEFAULT_PREFS.currency,
      };
      setPrefs(next);
      // Account preference wins over local storage when signed in.
      if (next.dashboardLang !== initial) {
        setLangState(next.dashboardLang);
        localStorage.setItem("app.lang", next.dashboardLang);
        void ensureDict(next.dashboardLang);
      }
    })();
  }, [ensureDict]);

  const persistPrefs = useCallback(async (patch: Partial<Record<string, string>>) => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    await supabase.from("profiles").update(patch as never).eq("id", auth.user.id);
  }, []);

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      localStorage.setItem("app.lang", l);
      setPrefs((p) => ({ ...p, dashboardLang: l }));
      void ensureDict(l);
      void persistPrefs({ dashboard_lang: l });
    },
    [ensureDict, persistPrefs],
  );

  const setTheme = useCallback((tm: Theme) => {
    setThemeState(tm);
    localStorage.setItem("app.theme", tm);
    applyTheme(tm);
  }, []);

  const setPref = useCallback(
    <K extends keyof LocalePrefs>(key: K, value: LocalePrefs[K]) => {
      setPrefs((p) => ({ ...p, [key]: value }));
      const col: Record<keyof LocalePrefs, string> = {
        dashboardLang: "dashboard_lang",
        resumeLang: "resume_lang",
        aiOutputLang: "ai_output_lang",
        dateFormat: "date_format",
        numberFormat: "number_format",
        timezone: "timezone",
        currency: "currency",
      };
      void persistPrefs({ [col[key]]: String(value) });
      if (key === "dashboardLang" && isLocaleCode(value)) setLang(value as Lang);
    },
    [persistPrefs, setLang],
  );

  const t = useCallback(
    (k: string, vars?: Record<string, string | number>) => {
      const dict = dicts[lang] ?? {};
      const raw = dict[k] ?? dicts.es[k] ?? esDict[k as keyof typeof esDict] ?? k;
      return interpolate(raw as string, vars);
    },
    [dicts, lang],
  );

  const intlTag = getLocaleMeta(lang).intl;

  const formatDate = useCallback(
    (d: Date | string | number) =>
      new Intl.DateTimeFormat(prefs.numberFormat || intlTag, {
        dateStyle: "medium",
        timeZone: prefs.timezone || undefined,
      }).format(new Date(d)),
    [prefs.numberFormat, prefs.timezone, intlTag],
  );

  const formatNumber = useCallback(
    (n: number) => new Intl.NumberFormat(prefs.numberFormat || intlTag).format(n),
    [prefs.numberFormat, intlTag],
  );

  const formatCurrency = useCallback(
    (n: number) =>
      new Intl.NumberFormat(prefs.numberFormat || intlTag, {
        style: "currency",
        currency: prefs.currency || "MXN",
      }).format(n),
    [prefs.numberFormat, prefs.currency, intlTag],
  );

  const value = useMemo<SettingsCtx>(
    () => ({
      lang,
      theme,
      prefs,
      ready,
      setLang,
      setTheme,
      setPref,
      t,
      formatDate,
      formatNumber,
      formatCurrency,
    }),
    [lang, theme, prefs, ready, setLang, setTheme, setPref, t, formatDate, formatNumber, formatCurrency],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

/** Convenience hook returning just the translate function. */
export function useT() {
  return useSettings().t;
}