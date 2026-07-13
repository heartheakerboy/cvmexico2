import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { getAiProvider } from "./ai-gateway.server";
import { recordAiUsage } from "./ai-usage-log";

// Map inline-assistant actions to the tracked feature buckets.
function featureForAction(action: string): string {
  const map: Record<string, string> = {
    generate: "generate",
    improve: "improve",
    rewrite: "rewrite",
    continue: "continue",
    expand: "expand",
    shorten: "shorten",
    ats: "ats",
    grammar: "grammar",
    spelling: "grammar",
    action_verbs: "action_verbs",
    quantify: "quantify",
    suggest_skills: "skills_generator",
    suggest_keywords: "keyword_suggestions",
    translate_en: "translation",
    translate_es: "translation",
    summarize: "summary_generator",
    responsibilities: "experience_writer",
    achievements: "experience_writer",
    bullets: "experience_writer",
  };
  return map[action] ?? action;
}

const ContextSchema = z.object({
  templateId: z.string().optional().default(""),
  jobTitle: z.string().optional().default(""),
  headline: z.string().optional().default(""),
  industry: z.string().optional().default(""),
  targetCountry: z.string().optional().default("México"),
  city: z.string().optional().default(""),
  skills: z.array(z.string()).optional().default([]),
  experience: z
    .array(
      z.object({
        role: z.string().optional().default(""),
        company: z.string().optional().default(""),
        description: z.string().optional().default(""),
      }),
    )
    .optional()
    .default([]),
  education: z
    .array(z.object({ degree: z.string().optional().default(""), school: z.string().optional().default("") }))
    .optional()
    .default([]),
});

const AssistInput = z.object({
  action: z.string().min(1),
  text: z.string().optional().default(""),
  field: z.string().optional().default(""),
  section: z.string().optional().default(""),
  roleLevel: z.string().optional().default(""),
  lang: z.string().optional().default("es"),
  context: ContextSchema,
});

// Human instruction per action (kept language-neutral; output language is set separately).
const ACTIONS: Record<string, string> = {
  generate: "Genera contenido profesional y específico para este campo desde cero.",
  improve: "Mejora la redacción manteniendo el significado; hazla más clara e impactante.",
  rewrite: "Reescribe el texto con un enfoque fresco y profesional, conservando los hechos.",
  continue: "Continúa escribiendo de forma natural a partir del texto existente.",
  expand: "Amplía el texto con más detalle relevante y concreto.",
  shorten: "Acorta el texto conservando lo esencial y el impacto.",
  professional: "Ajusta el tono para que sea profesional y pulido.",
  executive: "Ajusta el tono a nivel ejecutivo/directivo, estratégico y seguro.",
  friendly: "Ajusta el tono para que sea cercano y humano, sin perder profesionalismo.",
  ats: "Optimiza para sistemas ATS: palabras clave del sector, verbos de acción, frases claras y escaneables.",
  grammar: "Corrige toda la gramática y la puntuación sin cambiar el estilo.",
  spelling: "Corrige toda la ortografía.",
  readability: "Mejora la legibilidad: frases más claras y directas.",
  action_verbs: "Reescribe usando verbos de acción fuertes al inicio de cada frase o viñeta.",
  quantify: "Añade resultados cuantificables plausibles (porcentajes, montos, tiempos, volúmenes).",
  bullets: "Convierte el contenido en 3-5 viñetas concisas y orientadas a logros. Devuelve una viñeta por línea, iniciando con '- '.",
  responsibilities: "Genera 4-6 responsabilidades clave del puesto en viñetas. Una por línea, iniciando con '- '.",
  achievements: "Genera 3-5 logros medibles en viñetas. Una por línea, iniciando con '- '.",
  suggest_skills: "Sugiere 8-12 habilidades relevantes para este perfil. Devuelve solo las habilidades separadas por comas, sin viñetas.",
  suggest_keywords: "Sugiere 8-12 palabras clave ATS relevantes. Devuelve solo las palabras separadas por comas.",
  translate_en: "Traduce el texto a inglés profesional.",
  translate_es: "Traduce el texto a español de México profesional.",
  summarize: "Resume el contenido en 1-2 frases potentes.",
};

const ROLE_LEVELS: Record<string, string> = {
  entry: "nivel inicial (entry level)",
  student: "estudiante",
  intern: "practicante (intern)",
  junior: "junior",
  mid: "nivel medio (mid-level)",
  senior: "senior",
  lead: "líder técnico (lead)",
  manager: "gerente (manager)",
  executive: "ejecutivo/directivo",
  ceo: "director general (CEO)",
  freelancer: "freelancer independiente",
  government: "sector gobierno/público",
};

export const assistWrite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => AssistInput.parse(data))
  .handler(async ({ data, context }) => {
    const { model, name: activeModel } = await getAiProvider();

    const c = data.context;
    const instruction = ACTIONS[data.action] ?? ACTIONS.improve;
    const langLine =
      data.action === "translate_en"
        ? "Write everything strictly in English."
        : data.action === "translate_es"
          ? "Escribe todo estrictamente en español de México."
          : "IMPORTANT: Detect the language the user is writing in (from the CURRENT FIELD TEXT if present, otherwise from the resume context) and write your entire response in that exact same language. If the user writes in English, respond in English; if in Spanish, respond in Spanish; and so on. Do not translate or switch languages.";

    // Map templateId to roleLevel if set to auto/empty
    let level = data.roleLevel;
    if (!level && c.templateId) {
      if (c.templateId === "stage-student") level = "student";
      else if (c.templateId === "stage-fresher") level = "entry";
      else if (c.templateId === "stage-internship") level = "intern";
      else if (c.templateId === "stage-entry-level") level = "junior";
      else if (c.templateId === "stage-mid-level") level = "mid";
      else if (c.templateId === "stage-senior") level = "senior";
      else if (c.templateId === "stage-executive") level = "executive";
      else if (c.templateId === "stage-ceo") level = "ceo";
      else if (c.templateId === "stage-government") level = "government";
      else if (c.templateId === "stage-freelancer") level = "freelancer";
    }

    let roleLine = level && ROLE_LEVELS[level]
      ? `El perfil es de ${ROLE_LEVELS[level]}. Ajusta el nivel y vocabulario acorde.`
      : "";

    // Adapt tone depending on experience/role level
    if (level === "student" || level === "entry" || level === "intern") {
      roleLine += " El tono de escritura debe ser amigable para principiantes (beginner-friendly), proactivo, entusiasta y centrado en el potencial de aprendizaje.";
    } else if (level === "executive" || level === "ceo") {
      roleLine += " El tono de escritura debe ser sumamente ejecutivo, estratégico, corporativo y directo (executive tone), destacando decisiones financieras, EBITDA, rentabilidad y liderazgo de alto nivel.";
    } else if (level === "freelancer") {
      roleLine += " El tono de escritura debe estar orientado al portafolio de servicios independientes (portfolio focus), destacando la solución de problemas de clientes y la agilidad de entrega de consultoría.";
    } else if (level === "government") {
      roleLine += " El tono de escritura debe ser sumamente formal, institucional, técnico y sobrio, alineado con las directrices de la administración pública y el cumplimiento de leyes.";
    }

    const contextBlock = [
      c.jobTitle && `Puesto objetivo: ${c.jobTitle}`,
      c.headline && `Titular: ${c.headline}`,
      c.industry && `Industria: ${c.industry}`,
      c.targetCountry && `País objetivo: ${c.targetCountry}`,
      c.city && `Ciudad objetivo: ${c.city}`,
      c.skills.length && `Habilidades: ${c.skills.slice(0, 15).join(", ")}`,
      c.experience.length &&
        `Experiencia: ${c.experience
          .slice(0, 4)
          .map((e) => `${e.role || "?"} en ${e.company || "?"}${e.description ? ` (${e.description.slice(0, 120)})` : ""}`)
          .join("; ")}`,
      c.education.length &&
        `Educación: ${c.education.slice(0, 3).map((e) => `${e.degree || "?"} - ${e.school || "?"}`).join("; ")}`,
    ]
      .filter(Boolean)
      .join("\n");

    let cityLine = "";
    if (c.city) {
      cityLine = `El candidato busca trabajo en la ciudad de: ${c.city}, México. Si es relevante para el campo, adapta el lenguaje, los logros y las palabras clave del currículum a los sectores industriales predominantes o prácticas comerciales comunes de ${c.city}.`;
    }

    const prompt = `Eres un redactor experto de currículums para el mercado laboral (por defecto México). Trabajas dentro de un editor de CV, sobre el campo "${data.field}" de la sección "${data.section}".

CONTEXTO DEL CURRÍCULUM:
${contextBlock || "(sin contexto adicional)"}

${roleLine}
${cityLine}

TAREA: ${instruction}
El contenido debe ser específico al puesto/industria del contexto — NUNCA genérico.
${langLine}

TEXTO ACTUAL DEL CAMPO:
"""
${data.text || "(vacío)"}
"""

Responde ÚNICAMENTE con el texto final para el campo, sin comillas, sin encabezados, sin explicaciones ni markdown adicional.`;

    const started = Date.now();
    const { text, usage } = await generateText({ model, prompt });
    await recordAiUsage(context.supabase, {
      userId: context.userId,
      feature: featureForAction(data.action),
      model: activeModel,
      usage,
      responseMs: Date.now() - started,
    });
    return { text: cleanup(text) };
  });

function cleanup(text: string): string {
  let t = text.trim();
  // Strip wrapping quotes/code fences the model sometimes adds.
  t = t.replace(/^```[a-z]*\s*/i, "").replace(/```$/i, "").trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("«") && t.endsWith("»"))) {
    t = t.slice(1, -1).trim();
  }
  return t;
}