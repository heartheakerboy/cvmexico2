// HTTP handler for POST /api/db — executes a QuerySpec (or rpc) against D1
// with the caller's session context and the table access policy enforced.
// Server-only; wired in src/server.ts.

import { getDBFromEnv } from "@/lib/d1.server";
import { executeQuery, hasRole } from "./engine.server";
import { ctxFromRequest } from "./server-ctx.server";
import type { QueryResult, QuerySpec } from "./spec";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function handleDbRequest(request: Request, env: unknown): Promise<Response> {
  let db;
  try {
    db = getDBFromEnv(env);
  } catch {
    return json({ data: null, error: { message: "d1_unavailable" } } satisfies QueryResult, 500);
  }

  let body: { spec?: QuerySpec; rpc?: string; args?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return json({ data: null, error: { message: "invalid json" } } satisfies QueryResult, 400);
  }

  const ctx = await ctxFromRequest(db, request);

  if (body.rpc) {
    if (body.rpc === "has_role") {
      const targetUser = String(body.args?._user_id ?? "");
      // Non-admins may only ask about themselves (matches old call patterns).
      if (!ctx.isAdmin && ctx.userId !== targetUser) {
        return json({ data: false, error: null } satisfies QueryResult);
      }
      const data = await hasRole(db, targetUser, String(body.args?._role ?? ""));
      return json({ data, error: null } satisfies QueryResult);
    }
    return json({ data: null, error: { message: `unknown rpc: ${body.rpc}` } } satisfies QueryResult);
  }

  if (!body.spec || typeof body.spec.table !== "string") {
    return json({ data: null, error: { message: "missing spec" } } satisfies QueryResult, 400);
  }

  const result = await executeQuery(db, body.spec, ctx);
  return json(result);
}
