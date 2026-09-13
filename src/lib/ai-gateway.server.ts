import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export async function getAiProvider() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("Falta DEEPSEEK_API_KEY en la configuración del entorno.");
  }

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