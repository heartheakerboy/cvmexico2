// Resolve the DbCtx (who is asking) for server-side query execution.
// Used by the /api/db endpoint and by SSR direct execution.
// Server-only.

import type { D1Database } from "@/lib/d1.server";
import type { DbCtx } from "./spec";
import { getSessionUser, readSessionCookie } from "@/lib/auth-d1/session.server";

/** Ctx from an explicit Request (the /api/db handler has one). */
export async function ctxFromRequest(db: D1Database, request: Request): Promise<DbCtx> {
  const token = readSessionCookie(request.headers.get("cookie"));
  if (!token) return { userId: null, isAdmin: false };
  const user = await getSessionUser(db, token);
  if (!user) return { userId: null, isAdmin: false };
  return { userId: user.id, isAdmin: user.is_admin };
}

/** Ctx for SSR code paths without an explicit Request handle. */
export async function resolveServerCtx(db: D1Database): Promise<DbCtx> {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    if (req) return ctxFromRequest(db, req);
  } catch {
    /* not in a request scope */
  }
  return { userId: null, isAdmin: false };
}
