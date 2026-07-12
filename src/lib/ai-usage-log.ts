// Shared AI usage logging helper. Called inside server-function handlers with
// the request-scoped (RLS) Supabase client so rows are inserted as the user.
// Gemini Flash reference pricing (USD): $0.075 / 1M input, $0.30 / 1M output.
const COST_INPUT_PER_TOKEN = 0.075 / 1_000_000;
const COST_OUTPUT_PER_TOKEN = 0.3 / 1_000_000;

export function estimateCost(inputTokens: number, outputTokens: number): number {
  return inputTokens * COST_INPUT_PER_TOKEN + outputTokens * COST_OUTPUT_PER_TOKEN;
}

type UsageLike = { inputTokens?: number; outputTokens?: number; totalTokens?: number } | undefined;

type RecordArgs = {
  userId: string;
  feature: string;
  model: string;
  usage: UsageLike;
  responseMs: number;
  status?: "success" | "failed";
  error?: string | null;
};

// `supabase` is the request-scoped client from `requireSupabaseAuth` context.
export async function recordAiUsage(
  supabase: { from: (t: string) => any },
  args: RecordArgs,
): Promise<void> {
  try {
    const input = Math.max(0, Math.round(args.usage?.inputTokens ?? 0));
    const output = Math.max(0, Math.round(args.usage?.outputTokens ?? 0));
    const total = Math.max(0, Math.round(args.usage?.totalTokens ?? input + output));
    let plan: string | null = null;
    const { data: prof } = await supabase.from("profiles").select("plan").eq("id", args.userId).maybeSingle();
    plan = prof?.plan ?? null;
    await supabase.from("ai_usage_logs").insert({
      user_id: args.userId,
      feature: args.feature,
      model: args.model,
      input_tokens: input,
      output_tokens: output,
      total_tokens: total,
      cost: estimateCost(input, output),
      response_ms: Math.max(0, Math.round(args.responseMs)),
      status: args.status ?? "success",
      error: args.error ?? null,
      country: "México",
      plan,
    });
  } catch {
    // Never let logging break the AI response.
  }
}
