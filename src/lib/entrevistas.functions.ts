import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { getAiProvider } from "./ai-gateway.server";

const categoryLabels: Record<string, string> = {
  rol: "preguntas específicas del rol/puesto",
  rrhh: "preguntas de recursos humanos (RR. HH.) generales",
  tecnica: "preguntas técnicas del área",
  conductual: "preguntas conductuales (método STAR)",
};

const QuestionsInput = z.object({
  role: z.string().min(1),
  category: z.enum(["rol", "rrhh", "tecnica", "conductual"]),
  seniority: z.string().optional().default(""),
  lang: z.string().optional().default("es"),
});

export const generateQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => QuestionsInput.parse(data))
  .handler(async ({ data }) => {
    const { model } = await getAiProvider();
    const isEn = data.lang === "en";
    const prompt = isEn
      ? `You are an expert recruiter for the Mexican job market. Generate 6 ${
          data.category === "rol"
            ? "role-specific questions"
            : data.category === "rrhh"
            ? "general HR questions"
            : data.category === "tecnica"
            ? "technical questions in the field"
            : "behavioral questions (STAR method)"
        } for a job interview.
Job Position: ${data.role}
Experience Level: ${data.seniority || "not specified"}

Requirements:
- Realistic and common questions in interviews in Mexico.
- In English, clear and direct.
- Return ONLY a JSON array of strings, without markdown or explanations. Example: ["Question 1","Question 2"]`
      : `Eres un reclutador experto del mercado laboral mexicano. Genera 6 ${categoryLabels[data.category]} para una entrevista de trabajo.
Puesto: ${data.role}
Nivel: ${data.seniority || "no especificado"}

Requisitos:
- Preguntas realistas y comunes en entrevistas en México.
- En español de México, claras y directas.
- Devuelve ÚNICAMENTE un arreglo JSON de strings, sin markdown ni explicaciones. Ejemplo: ["Pregunta 1","Pregunta 2"]`;

    const { text } = await generateText({
      model,
      prompt,
    });

    const parsed = z.array(z.string()).safeParse(extractJson(text));
    if (!parsed.success) throw new Error("La IA no devolvió preguntas válidas");
    return { questions: parsed.data.slice(0, 8) };
  });

const FeedbackInput = z.object({
  role: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  lang: z.string().optional().default("es"),
});

export const evaluateAnswer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => FeedbackInput.parse(data))
  .handler(async ({ data }) => {
    const { model } = await getAiProvider();
    const isEn = data.lang === "en";
    const prompt = isEn
      ? `You are an interview coach for the Mexican job market. Evaluate the candidate's answer to an interview question.
Job Position: ${data.role}
Question: ${data.question}
Candidate's Answer: ${data.answer}

Return ONLY a valid JSON object (no markdown) with this exact format:
{"score":0,"strengths":[""],"improvements":[""],"modelAnswer":""}
where score is a number from 0 to 100, strengths and improvements are arrays of 2-3 short sentences in English, and modelAnswer is an example of an ideal answer of 2-4 sentences in English.`
      : `Eres un coach de entrevistas del mercado laboral mexicano. Evalúa la respuesta del candidato a una pregunta de entrevista.
Puesto: ${data.role}
Pregunta: ${data.question}
Respuesta del candidato: ${data.answer}

Devuelve ÚNICAMENTE un objeto JSON válido (sin markdown) con esta forma exacta:
{"score":0,"strengths":[""],"improvements":[""],"modelAnswer":""}
donde score es un número del 0 al 100, strengths y improvements son arreglos de 2-3 frases breves en español de México, y modelAnswer es un ejemplo de respuesta ideal de 2-4 frases.`;

    const { text } = await generateText({
      model,
      prompt,
    });

    const FeedbackSchema = z.object({
      score: z.number().default(0),
      strengths: z.array(z.string()).default([]),
      improvements: z.array(z.string()).default([]),
      modelAnswer: z.string().default(""),
    });
    const parsed = FeedbackSchema.safeParse(extractJson(text));
    if (!parsed.success) throw new Error("La IA no devolvió retroalimentación válida");
    return parsed.data;
  });

function extractJson(text: string): unknown {
  // helper below
  return _extractJson(text);
}

const MockInput = z.object({
  role: z.string().min(1),
  seniority: z.string().optional().default(""),
  lang: z.string().optional().default("es"),
});

export const generateMockInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => MockInput.parse(data))
  .handler(async ({ data }) => {
    const { model } = await getAiProvider();
    const isEn = data.lang === "en";
    const prompt = isEn
      ? `You are an expert recruiter for the Mexican job market. Simulate a full interview by generating 8 questions mixing: opener/HR, role-specific, technical, and behavioral (STAR method) questions, in a natural interview order.
Job Position: ${data.role}
Experience Level: ${data.seniority || "not specified"}

Requirements:
- Realistic and common questions in interviews in Mexico.
- In English, clear and direct.
- Return ONLY a JSON array of strings, without markdown or explanations. Example: ["Question 1","Question 2"]`
      : `Eres un reclutador experto del mercado laboral mexicano. Simula una entrevista completa generando 8 preguntas mezclando: apertura/RR. HH., específicas del rol, técnicas y conductuales (método STAR), en un orden natural de entrevista.
Puesto: ${data.role}
Nivel: ${data.seniority || "no especificado"}

Requisitos:
- Preguntas realistas y comunes en entrevistas en México.
- En español de México, claras y directas.
- Devuelve ÚNICAMENTE un arreglo JSON de strings, sin markdown ni explicaciones. Ejemplo: ["Pregunta 1","Pregunta 2"]`;

    const { text } = await generateText({
      model,
      prompt,
    });

    const parsed = z.array(z.string()).safeParse(_extractJson(text));
    if (!parsed.success) throw new Error("La IA no devolvió preguntas válidas");
    return { questions: parsed.data.slice(0, 10) };
  });

function _extractJson(text: string): unknown {
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