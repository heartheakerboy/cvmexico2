// requireAuth middleware for TanStack Start server functions (parallel build).
// Drop-in replacement for requireSupabaseAuth at cutover: reads the
// cvai_session cookie, validates against D1, injects { userId, user }.
//
// Usage (after cutover):
//   import { requireAuth } from "@/lib/auth-d1/middleware.server";
//   export const myFn = createServerFn({ method: "POST" })
//     .middleware([requireAuth])
//     .handler(async ({ context }) => {
//       const { userId } = context as { userId: string };
//       ...WHERE user_id = ? bound to userId...
//     });

import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getSessionUser, readSessionCookie, type SessionUser } from "./session.server";

export const requireAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();
    const token = readSessionCookie(request?.headers.get("cookie") ?? null);
    const user: SessionUser | null = await getSessionUser(token);
    if (!user) {
      throw new Error("Unauthorized: valid session required");
    }
    return next({
      context: {
        userId: user.id,
        user,
      },
    });
  }
);

/** Same as requireAuth but also requires the admin role. */
export const requireAdmin = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();
    const token = readSessionCookie(request?.headers.get("cookie") ?? null);
    const user: SessionUser | null = await getSessionUser(token);
    if (!user) {
      throw new Error("Unauthorized: valid session required");
    }
    if (!user.is_admin) {
      throw new Error("Forbidden: admin role required");
    }
    return next({
      context: {
        userId: user.id,
        user,
      },
    });
  }
);
