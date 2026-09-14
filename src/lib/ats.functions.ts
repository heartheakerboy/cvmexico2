import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { getAiProvider } from "./ai-gateway.server";

const AtsInput = z.object({
  resumeText: z.string().min(1),
  jobDescription: z.string().optional().default(""),
});

const AtsSchema = z.object({
  score: z.number().default(0),
  summary: z.string().default(""),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
  missingKeywords: z.array(z.string()).default([]),
});

export const analyzeAts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => AtsInput.parse(data))
  .handler(async ({ data }) => {
    const { model } = await getAiProvider();
    const prompt = `Eres un experto en sistemas ATS (Applicant Tracking Systems) del mercado laboral mexicano. Analiza el siguiente currículum y evalúa su compatibilidad con los filtros ATS.
${data.jobDescription ? `Descripción del puesto objetivo:\n${data.jobDescription}\n` : ""}
Currículum:
${data.resumeText}

Devuelve:
- score: puntaje de 0 a 100 de compatibilidad ATS.
- summary: resumen de 1-2 frases del análisis.
- strengths: 3-5 fortalezas del CV.
- improvements: 3-6 mejoras concretas y accionables.
- missingKeywords: palabras clave importantes que faltan${data.jobDescription ? " según el puesto" : ""}.
Responde todo en español de México.

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin explicaciones) con esta forma exacta:
{"score":0,"summary":"","strengths":[""],"improvements":[""],"missingKeywords":[""]}`;

    const { text } = await generateText({
      model,
      prompt,
    });

    const parsed = AtsSchema.safeParse(extractJson(text));
    if (!parsed.success) throw new Error("La IA no devolvió un análisis válido");
    return parsed.data;
  });

export const analyzePublicAts = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => AtsInput.parse(data))
  .handler(async ({ data }) => {
    try {
      const { model } = await getAiProvider();
      const prompt = `Eres un evaluador de sistemas ATS (Applicant Tracking Systems) para el mercado laboral mexicano.
Evalúa el siguiente texto de currículum vitae:
${data.jobDescription ? `Vacante objetivo:\n${data.jobDescription}\n` : ""}
Currículum:
${data.resumeText.slice(0, 4000)}

Calcula un puntaje del 0 al 100, identifica fortalezas, oportunidades de mejora y palabras clave faltantes.
Responde ÚNICAMENTE con este JSON válido:
{"score":85,"summary":"Breve resumen del diagnóstico","strengths":["Fortaleza 1","Fortaleza 2"],"improvements":["Mejora 1","Mejora 2"],"missingKeywords":["Palabra 1","Palabra 2"]}`;

      const { text } = await generateText({
        model,
        prompt,
      });

      const parsed = AtsSchema.safeParse(extractJson(text));
      if (parsed.success) return parsed.data;
    } catch {
      // Fallback heuristics if AI model fails or gateway issues
    }

    // Heuristic fallback analysis
    const text = data.resumeText.toLowerCase();
    let score = 65;
    const strengths: string[] = [];
    const improvements: string[] = [];
    const missingKeywords: string[] = [];

    if (text.includes("@") && /\d{8,12}/.test(text)) {
      score += 8;
      strengths.push("Datos de contacto claros (correo y teléfono detectados).");
    } else {
      improvements.push("Agrega tu correo profesional y número de teléfono con clave lada en el cuerpo del texto.");
    }

    if (text.includes("experiencia") || text.includes("laboral") || text.includes("puesto")) {
      score += 10;
      strengths.push("Sección de experiencia laboral claramente identificada.");
    } else {
      improvements.push("Utiliza el encabezado estándar 'Experiencia Laboral' para facilitar el análisis ATS.");
    }

    if (text.includes("educación") || text.includes("licenciatura") || text.includes("ingeniería") || text.includes("universidad")) {
      score += 8;
      strengths.push("Historial educativo y grado académico detectados.");
    } else {
      missingKeywords.push("Licenciatura / Ingeniería", "Cédula profesional");
    }

    if (/\d+%\s|\$\d+|\d+\s(años|meses|personas|colaboradores)/i.test(text)) {
      score += 9;
      strengths.push("Logros cuantitativos y métricas detectadas en la trayectoria.");
    } else {
      improvements.push("Añade métricas cuantitativas (%, ahorros en $, equipos a cargo) en tus funciones clave.");
    }

    return {
      score: Math.min(score, 94),
      summary: "Tu CV tiene una buena base estructural para sistemas ATS, con áreas clave para elevar tu puntuación.",
      strengths: strengths.length ? strengths : ["Estructura general legible en texto plano."],
      improvements: improvements.length ? improvements : ["Asegura que tus verbos de acción inicien cada viñeta."],
      missingKeywords: missingKeywords.length ? missingKeywords : ["Herramientas de software especializado", "Certificaciones oficiales"],
    };
  });

function extractJson(text: string): unknown {
  let cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const start = cleaned.search(/[{[]/);
  const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  if (start === -1 || end === -1) return null;
  cleaned = cleaned.slice(start, end + 1);
  try {
    return JSON.parse(cleaned);
  } catch {
    try {
      return JSON.parse(cleaned.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]"));
    } catch {
      return null;
    }
  }
}