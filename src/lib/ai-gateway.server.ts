import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function getAiProvider() {
  let activeProvider = process.env.ACTIVE_AI_PROVIDER || "gemini";

  // Gracefully fetch active provider only if service role key is configured
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_URL) {
    try {
      const { data } = await supabaseAdmin
        .from("system_settings")
        .select("value")
        .eq("key", "active_ai_provider")
        .maybeSingle();

      if (data?.value && typeof data.value === "object" && (data.value as any).provider) {
        activeProvider = (data.value as any).provider;
      }
    } catch (err) {
      console.error("Error reading active_ai_provider setting from DB:", err);
    }
  } else {
    console.warn("[AI Gateway] Missing SUPABASE_SERVICE_ROLE_KEY, falling back to process.env.ACTIVE_AI_PROVIDER: " + activeProvider);
  }

  if (activeProvider === "deepseek") {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error("Falta DEEPSEEK_API_KEY en la configuración");

    const modelId = process.env.DEEPSEEK_MODEL_ID || "deepseek-chat";
    const provider = createOpenAICompatible({
      name: "deepseek",
      baseURL: "https://api.deepseek.com/v1",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return {
      model: provider(modelId),
      name: modelId,
    };
  }

  if (activeProvider === "gemini") {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Falta GEMINI_API_KEY en la configuración");

    const modelId = process.env.GEMINI_MODEL_ID || "gemini-1.5-flash";
    const provider = createOpenAICompatible({
      name: "google-gemini",
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return {
      model: provider(modelId),
      name: modelId,
    };
  }

  throw new Error("No se ha configurado ningún proveedor de IA activo (ACTIVE_AI_PROVIDER debe ser 'gemini' o 'deepseek' en las variables de entorno).");
}