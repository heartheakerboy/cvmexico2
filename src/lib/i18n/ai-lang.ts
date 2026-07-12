// Server-safe (no React) mapping of a locale/output preference to a natural
// language instruction for AI prompts. Used by all generation server fns so AI
// output follows the user's chosen output language.
export type AiLang = string;

const NAMES: Record<string, string> = {
  es: "español de México",
  en: "English",
  pt: "português do Brasil",
  fr: "français",
  de: "Deutsch",
  it: "italiano",
  tr: "Türkçe",
  id: "Bahasa Indonesia",
  vi: "Tiếng Việt",
  ja: "日本語",
  ko: "한국어",
  hi: "हिन्दी",
};

export function langName(code?: string): string {
  if (!code) return NAMES.es;
  if (code === "bilingual") return "español de México e inglés (bilingüe, cada sección en ambos idiomas)";
  return NAMES[code] ?? NAMES.es;
}

/** Returns an instruction like "Escribe todo en English." */
export function langInstruction(code?: string): string {
  return `Write everything strictly in ${langName(code)}.`;
}