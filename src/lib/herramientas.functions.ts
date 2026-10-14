import { createServerFn } from "@tanstack/react-start";
import { requireD1Auth as requireSupabaseAuth } from "@/lib/db/server-db.server";
import { generateText } from "ai";
import { z } from "zod";
import { getAiProvider } from "./ai-gateway.server";

const prompts: Record<string, (i: ToolInput) => string> = {
  resumen: (i) =>
    i.lang === "en"
      ? `Write a professional CV summary in English for the position of "${i.role}". Additional context: ${i.context || "none"}. It should be 2-3 sentences, professional tone, and ATS-optimized. Respond only with the summary text.`
      : `Escribe un resumen profesional para un CV en español de México para el puesto de "${i.role}". Contexto adicional: ${i.context || "ninguno"}. Debe tener 2-3 frases, tono profesional y optimizado para ATS. Responde solo con el texto del resumen.`,
  objetivos: (i) =>
    i.lang === "en"
      ? `Write a professional CV objective in English for the position of "${i.role}". Additional context: ${i.context || "none"}. It should be 1-2 clear and motivating sentences. Respond only with the objective text.`
      : `Escribe un objetivo profesional para un CV en español de México para el puesto de "${i.role}". Contexto adicional: ${i.context || "ninguno"}. Debe tener 1-2 frases claras y motivadoras. Responde solo con el texto del objetivo.`,
  habilidades: (i) =>
    i.lang === "en"
      ? `Generate a list of 10-12 relevant skills (hard and soft) in English for the position of "${i.role}". Additional context: ${i.context || "none"}. Return ONLY a JSON array of strings, without markdown. Example: ["Skill 1","Skill 2"]`
      : `Genera una lista de 10-12 habilidades relevantes (técnicas y blandas) para el puesto de "${i.role}" en el mercado laboral mexicano. Contexto adicional: ${i.context || "ninguno"}. Devuelve ÚNICAMENTE un arreglo JSON de strings, sin markdown. Ejemplo: ["Habilidad 1","Habilidad 2"]`,
  titulares: (i) =>
    i.lang === "en"
      ? `Generate 6 brief and catchy professional headlines in English for a candidate's resume for the position of "${i.role}". Additional context: ${i.context || "none"}. Return ONLY a JSON array of strings, without markdown.`
      : `Genera 6 titulares profesionales (headlines) breves y atractivos para el CV de un candidato al puesto de "${i.role}" en México. Contexto adicional: ${i.context || "ninguno"}. Devuelve ÚNICAMENTE un arreglo JSON de strings, sin markdown.`,
  "carta-renuncia": (i) =>
    i.lang === "en"
      ? `Write a professional and polite resignation letter in English. Position: "${i.role}". Company: "${i.company || "the company"}". Name: "${i.fullName || "the employee"}". Additional context: ${i.context || "none"}. Include appreciation and a two-week notice if applicable. Respond only with the letter text.`
      : `Escribe una carta de renuncia profesional y cordial en español de México. Puesto: "${i.role}". Empresa: "${i.company || "la empresa"}". Nombre: "${i.fullName || "el colaborador"}". Contexto adicional: ${i.context || "ninguno"}. Incluye agradecimiento y aviso de dos semanas si aplica. Responde solo con el texto de la carta.`,
  "carta-recomendacion": (i) =>
    i.lang === "en"
      ? `Write a professional recommendation letter in English for someone who worked as "${i.role}" at "${i.company || "the company"}". Recommended person's name: "${i.fullName || "the candidate"}". Highlights: ${i.context || "not specified"}. Respond only with the letter text.`
      : `Escribe una carta de recomendación profesional en español de México para una persona que se desempeñó como "${i.role}" en "${i.company || "la empresa"}". Nombre del recomendado: "${i.fullName || "el candidato"}". Puntos a destacar: ${i.context || "no especificados"}. Responde solo con el texto de la carta.`,
  "descripcion-puesto": (i) =>
    i.lang === "en"
      ? `Write a professional and complete job description in English for the vacancy of "${i.role}"${i.company ? ` at "${i.company}"` : ""}. Additional context: ${i.context || "none"}. Include: a brief role summary, key responsibilities (5-7 bullet points), requirements and desired skills. Use a clear format with headings. Respond only with the description text.`
      : `Escribe una descripción de puesto (job description) profesional y completa en español de México para la vacante de "${i.role}"${i.company ? ` en "${i.company}"` : ""}. Contexto adicional: ${i.context || "ninguno"}. Incluye: un breve resumen del rol, responsabilidades clave (5-7 viñetas), requisitos y habilidades deseadas. Usa un formato claro con encabezados. Responde solo con el texto de la descripción.`,
};

const ToolInputSchema = z.object({
  tool: z.enum([
    "resumen",
    "objetivos",
    "habilidades",
    "titulares",
    "carta-renuncia",
    "carta-recomendacion",
    "descripcion-puesto",
  ]),
  role: z.string().min(1),
  company: z.string().optional().default(""),
  fullName: z.string().optional().default(""),
  context: z.string().optional().default(""),
  lang: z.string().optional().default("es"),
});

type ToolInput = z.infer<typeof ToolInputSchema>;

export const generateTool = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ToolInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { model } = await getAiProvider();
    const { text } = await generateText({
      model,
      prompt: prompts[data.tool](data),
    });

    const isList = data.tool === "habilidades" || data.tool === "titulares";
    if (isList) {
      const parsed = z.array(z.string()).safeParse(extractJson(text));
      if (parsed.success) return { type: "list" as const, items: parsed.data };
      return { type: "list" as const, items: text.split("\n").map((l) => l.replace(/^[-*\d.\s]+/, "").trim()).filter(Boolean) };
    }
    return { type: "text" as const, text: text.trim() };
  });

function extractJson(text: string): unknown {
  let cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = cleaned.search(/[[{]/);
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
