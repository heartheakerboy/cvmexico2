// Direct D1 executor for SSR code paths (no request handle available).
// Session cookies are not readable here, so SSR runs with an anonymous
// context: public tables work; owner/admin data loads client-side via
// /api/db after hydration. Server-only.

import { getDBFromEnv } from "@/lib/d1.server";
import { executeQuery } from "./engine.server";
import type { QueryResult, QuerySpec } from "./spec";

export async function directExecutor(spec: QuerySpec): Promise<QueryResult> {
  const db = getDBFromEnv((globalThis as { __env__?: unknown }).__env__);
  return executeQuery(db, spec, { userId: null, isAdmin: false });
}
