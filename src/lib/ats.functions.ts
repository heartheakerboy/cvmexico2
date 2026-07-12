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