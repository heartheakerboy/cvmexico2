// Server-side D1 clients + auth middleware for TanStack server functions.
// Drop-in replacements:
//   requireSupabaseAuth  -> requireD1Auth   (context.supabase, context.userId)
//   supabaseAdmin        -> getServiceDb()  (service context, no row scoping)
// Server-only.

import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getDBFromEnv, type D1Database } from "@/lib/d1.server";
import { QueryBuilder } from "./builder";
import { executeQuery, hasRole } from "./engine.server";
import type { DbCtx, QueryResult, QuerySpec } from "./spec";
import { getSessionUser, readSessionCookie } from "@/lib/auth-d1/session.server";

export function workerDb(): D1Database {
  return getDBFromEnv((globalThis as { __env__?: unknown }).__env__);
}

/** A supabase-shaped client bound to a fixed DbCtx, executing on D1 directly. */
export function createDbClient(ctx: DbCtx, db?: D1Database) {
  // Resolve the binding lazily per query: globalThis.__env__ only exists
  // while a request is being handled, not at module load.
  const executor = (spec: QuerySpec): Promise<QueryResult> =>
    executeQuery(db ?? workerDb(), spec, ctx);
  return {
    from(table: string) {
      return new QueryBuilder(executor, table);
    },
    async rpc(fn: string, args: Record<string, unknown>): Promise<QueryResult> {
      if (fn === "has_role") {
        const data = await hasRole(db ?? workerDb(), String(args._user_id ?? ""), String(args._role ?? ""));
        return { data, error: null };
      }
      return { data: null, error: { message: `unknown rpc: ${fn}` } };
    },
  };
}

export type DbClient = ReturnType<typeof createDbClient>;

/** Service-role equivalent: trusted server code, bypasses row scoping. */
export function getServiceDb(): DbClient {
  return createDbClient({ userId: null, isAdmin: true, service: true });
}

/** User-scoped client for an explicit session user. */
export function getUserDb(userId: string, isAdmin: boolean): DbClient {
  return createDbClient({ userId, isAdmin });
}

async function sessionCtx(): Promise<{ ctx: DbCtx; userId: string } | null> {
  const request = getRequest();
  const token = readSessionCookie(request?.headers.get("cookie") ?? null);
  if (!token) return null;
  const db = workerDb();
  const user = await getSessionUser(db, token);
  if (!user) return null;
  return { ctx: { userId: user.id, isAdmin: user.is_admin }, userId: user.id };
}

/** Replacement for requireSupabaseAuth: validates the D1 session cookie. */
export const requireD1Auth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await sessionCtx();
    if (!session) throw new Error("Unauthorized: valid session required");
    return next({
      context: {
        supabase: createDbClient(session.ctx),
        userId: session.userId,
      },
    });
  }
);

/** requireD1Auth + admin role. */
export const requireD1Admin = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await sessionCtx();
    if (!session) throw new Error("Unauthorized: valid session required");
    if (!session.ctx.isAdmin) throw new Error("Forbidden: admin role required");
    return next({
      context: {
        supabase: createDbClient(session.ctx),
        userId: session.userId,
      },
    });
  }
);
