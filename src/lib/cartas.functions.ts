import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { getAiProvider } from "./ai-gateway.server";

const CartaInput = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  fullName: z.string().optional().default(""),
  highlights: z.string().optional().default(""),
  tone: z.string().optional().default("profesional"),
});

export const generateCoverLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => CartaInput.parse(data))
  .handler(async ({ data }) => {
    const { model } = await getAiProvider();
    const prompt = `Eres un experto en redacción de cartas de presentación para el mercado laboral mexicano. Escribe una carta de presentación persuasiva y profesional en español de México.

Empresa: ${data.company}
Puesto: ${data.role}
Nombre del candidato: ${data.fullName || "el candidato"}
Logros / puntos a destacar: ${data.highlights || "no especificados"}
Tono deseado: ${data.tone}

Requisitos:
- Extensión de 3-4 párrafos.
- Saludo profesional, cuerpo con logros relevantes y cierre con llamado a la acción.
- No inventes datos falsos específicos; usa un lenguaje natural y convincente.
- Firma con el nombre del candidato si se proporcionó.
Responde ÚNICAMENTE con el texto de la carta, sin comentarios ni encabezados adicionales.`;

    const { text } = await generateText({
      model,
      prompt,
    });

    return { content: text.trim() };
  });