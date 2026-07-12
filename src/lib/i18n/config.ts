// Central locale registry. Add a new language by adding an entry here and a
// matching lazy loader below — no application code changes required.

export type LocaleCode =
  | "es"
  | "en"
  | "pt"
  | "fr"
  | "de"
  | "it"
  | "tr"
  | "id"
  | "vi"
  | "ja"
  | "ko"
  | "hi";

export type LocaleMeta = {
  code: LocaleCode;
  /** Native display name */
  label: string;
  /** English name, used in admin tooling */
  englishLabel: string;
  flag: string;
  /** BCP-47 tag used for Intl formatting */
  intl: string;
  /** Whether the language is live for end users */
  enabled: boolean;
  rtl?: boolean;
};

export const DEFAULT_LOCALE: LocaleCode = "es";

export const LOCALES: LocaleMeta[] = [
  { code: "es", label: "Español (México)", englishLabel: "Spanish (Mexico)", flag: "🇲🇽", intl: "es-MX", enabled: true },
  { code: "en", label: "English", englishLabel: "English", flag: "🇺🇸", intl: "en-US", enabled: true },
  // Future-ready — flip `enabled` to true once the locale file is filled in.
  { code: "pt", label: "Português", englishLabel: "Portuguese", flag: "🇧🇷", intl: "pt-BR", enabled: false },
  { code: "fr", label: "Français", englishLabel: "French", flag: "🇫🇷", intl: "fr-FR", enabled: false },
  { code: "de", label: "Deutsch", englishLabel: "German", flag: "🇩🇪", intl: "de-DE", enabled: false },
  { code: "it", label: "Italiano", englishLabel: "Italian", flag: "🇮🇹", intl: "it-IT", enabled: false },
  { code: "tr", label: "Türkçe", englishLabel: "Turkish", flag: "🇹🇷", intl: "tr-TR", enabled: false },
  { code: "id", label: "Bahasa Indonesia", englishLabel: "Indonesian", flag: "🇮🇩", intl: "id-ID", enabled: false },
  { code: "vi", label: "Tiếng Việt", englishLabel: "Vietnamese", flag: "🇻🇳", intl: "vi-VN", enabled: false },
  { code: "ja", label: "日本語", englishLabel: "Japanese", flag: "🇯🇵", intl: "ja-JP", enabled: false },
  { code: "ko", label: "한국어", englishLabel: "Korean", flag: "🇰🇷", intl: "ko-KR", enabled: false },
  { code: "hi", label: "हिन्दी", englishLabel: "Hindi", flag: "🇮🇳", intl: "hi-IN", enabled: false },
];

import esDict from "./locales/es";
import enDict from "./locales/en";

export const ENABLED_LOCALES = LOCALES.filter((l) => l.enabled);

export type Dict = Record<string, string>;

// Lazy loaders — language files are code-split and fetched on demand.
const loaders: Partial<Record<LocaleCode, () => Promise<{ default: Dict }>>> = {
  es: () => import("./locales/es"),
  en: () => import("./locales/en"),
  // pt: () => import("./locales/pt"),
  // fr: () => import("./locales/fr"),
};

export function getLocaleMeta(code: string): LocaleMeta {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

export async function loadDict(code: LocaleCode): Promise<Dict> {
  const loader = loaders[code];
  if (!loader) return {};
  const mod = await loader();
  return mod.default;
}

export function isLocaleCode(v: unknown): v is LocaleCode {
  return typeof v === "string" && LOCALES.some((l) => l.code === v);
}

export function detectBrowserLocale(): LocaleCode {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const langs = navigator.languages ?? [navigator.language];
  for (const raw of langs) {
    const base = raw.toLowerCase().split("-")[0];
    const match = ENABLED_LOCALES.find((l) => l.code === base);
    if (match) return match.code;
  }
  return DEFAULT_LOCALE;
}

export function getMetaTranslation(key: string, vars?: Record<string, string | number>): string {
  const lang = typeof window !== "undefined" ? (window.localStorage.getItem("app.lang") || "es") : "es";
  const dict = lang === "en" ? enDict : esDict;
  const str = (dict as any)[key] || (esDict as any)[key] || "";
  if (!vars) return str;
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_: string, k: string) =>
    vars[k] != null ? String(vars[k]) : `{{${k}}}`
  );
}