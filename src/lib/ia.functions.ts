import { createServerFn } from "@tanstack/react-start";
import { requireD1Auth as requireSupabaseAuth } from "@/lib/db/server-db.server";
import { generateText } from "ai";
import { z } from "zod";
import { getAiProvider } from "./ai-gateway.server";
import { recordAiUsage } from "./ai-usage-log";

const GenerateInput = z.object({
  role: z.string().min(1),
  seniority: z.string().optional().default(""),
  industry: z.string().optional().default(""),
  skills: z.string().optional().default(""),
  about: z.string().optional().default(""),
  lang: z.string().optional().default("es"),
});

const ResumeSchema = z.object({
  headline: z.string().default(""),
  summary: z.string().default(""),
  skills: z.array(z.string()).default([]),
  experience: z
    .array(
      z.object({
        role: z.string().default(""),
        company: z.string().default(""),
        period: z.string().default(""),
        description: z.string().default(""),
      }),
    )
    .default([]),
  education: z
    .array(
      z.object({
        degree: z.string().default(""),
        school: z.string().default(""),
        period: z.string().default(""),
      }),
    )
    .default([]),
});

export const generateResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => GenerateInput.parse(data))
  .handler(async ({ data, context }) => {
    const { model, name: activeModel } = await getAiProvider();
    const prompt = `Eres un experto en recursos humanos del mercado laboral mexicano. Crea el contenido de un currículum profesional para el siguiente perfil.
Puesto objetivo: ${data.role}
Nivel/seniority: ${data.seniority || "no especificado"}
Industria: ${data.industry || "no especificada"}
Habilidades clave: ${data.skills || "no especificadas"}
Información adicional: ${data.about || "ninguna"}

Genera:
- Un titular profesional atractivo (headline).
- Un resumen profesional de 2-3 frases, optimizado para ATS.
- 8-10 habilidades relevantes.
- 2-3 experiencias laborales realistas con logros cuantificados (usa empresas y periodos plausibles como ejemplo).
- 1-2 registros de educación coherentes con el perfil.
IMPORTANTE: Detecta el idioma en el que el usuario escribió los datos anteriores (puesto, habilidades, información) y redacta TODO el currículum en ese mismo idioma. Si el usuario escribe en inglés, responde en inglés; si escribe en español, responde en español. Usa un tono profesional.

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin explicaciones) con esta forma exacta:
{"headline":"","summary":"","skills":[""],"experience":[{"role":"","company":"","period":"","description":""}],"education":[{"degree":"","school":"","period":""}]}`;

    const started = Date.now();
    const { text, usage } = await generateText({ model, prompt });

    const parsed = ResumeSchema.safeParse(extractJson(text));
    await recordAiUsage(context.supabase, {
      userId: context.userId,
      feature: "resume_generator",
      model: activeModel,
      usage,
      responseMs: Date.now() - started,
      status: parsed.success ? "success" : "failed",
      error: parsed.success ? null : "invalid_json",
    });
    if (!parsed.success) throw new Error("La IA no devolvió un CV válido");
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

const ImproveInput = z.object({
  text: z.string().min(1),
  instruction: z.string().min(1),
  lang: z.string().optional().default("es"),
});

export const improveText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ImproveInput.parse(data))
  .handler(async ({ data, context }) => {
    const { model, name: activeModel } = await getAiProvider();
    const started = Date.now();
    const { text, usage } = await generateText({
      model,
      prompt: `${data.instruction}. IMPORTANTE: Detecta el idioma del texto de abajo y responde en ese mismo idioma (inglés si está en inglés, español si está en español, etc.), sin traducir. Responde solo con el texto mejorado, sin comillas ni explicaciones.\n\nTexto:\n${data.text}`,
    });
    await recordAiUsage(context.supabase, {
      userId: context.userId,
      feature: "improve",
      model: activeModel,
      usage,
      responseMs: Date.now() - started,
    });
    return { text: text.trim() };
  });