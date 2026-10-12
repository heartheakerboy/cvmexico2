// requireAuth middleware factory for TanStack Start server functions (parallel build).
// Drop-in replacement for requireSupabaseAuth at cutover: reads the
// cvai_session cookie, validates against D1, injects { userId, user }.
//
// NOTE: server functions need the D1 binding. Wire the db in when creating
// the middleware (Phase 4 will settle the env-plumbing for server functions).
//
// Usage (after cutover):
//   import { makeRequireAuth } from "@/lib/auth-d1/middleware.server";
//   const requireAuth = makeRequireAuth(db); // db from Worker env
//   export const myFn = createServerFn({ method: "POST" })
//     .middleware([requireAuth])
//     .handler(async ({ context }) => {
//       const { userId } = context as { userId: string };
//       ...WHERE user_id = ? bound to userId...
//     });

import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getSessionUser, readSessionCookie, type SessionUser } from "./session.server";
import type { D1Database } from "@/lib/d1.server";

async function resolveUser(db: D1Database): Promise<SessionUser> {
  const request = getRequest();
  const token = readSessionCookie(request?.headers.get("cookie") ?? null);
  const user = await getSessionUser(db, token);
  if (!user) {
    throw new Error("Unauthorized: valid session required");
  }
  return user;
}

export function makeRequireAuth(db: D1Database) {
  return createMiddleware({ type: "function" }).server(async ({ next }) => {
    const user = await resolveUser(db);
    return next({ context: { userId: user.id, user } });
  });
}

/** Same as makeRequireAuth but also requires the admin role. */
export function makeRequireAdmin(db: D1Database) {
  return createMiddleware({ type: "function" }).server(async ({ next }) => {
    const user = await resolveUser(db);
    if (!user.is_admin) {
      throw new Error("Forbidden: admin role required");
    }
    return next({ context: { userId: user.id, user } });
  });
}
