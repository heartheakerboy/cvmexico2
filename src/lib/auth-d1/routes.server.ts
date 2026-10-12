// HTTP handlers for /api/auth/* (server-only).
// Wired in src/server.ts fetch. Parallel build: old Supabase auth untouched.

import { getDBFromEnv } from "@/lib/d1.server";
import {
  signUpWithPassword,
  signInWithPassword,
  createPasswordResetToken,
  resetPasswordWithToken,
} from "./users.server";
import {
  getSessionUser,
  revokeSession,
  readSessionCookie,
  sessionCookieHeader,
  clearSessionCookieHeader,
} from "./session.server";
import { googleAuthRedirect, googleCallback } from "./oauth.server";
import { sendTemplateEmail } from "@/lib/smtp.server";

function json(data: unknown, status = 200, setCookie?: string): Response {
  const headers = new Headers({ "content-type": "application/json" });
  if (setCookie) headers.set("Set-Cookie", setCookie);
  return new Response(JSON.stringify(data), { status, headers });
}

function clientIp(request: Request): string | undefined {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    undefined
  );
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function handleAuthRequest(request: Request, env: unknown): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  if (!path.startsWith("/api/auth/")) return null;
  let db;
  try {
    db = getDBFromEnv(env);
  } catch {
    return json({ ok: false, error: "d1_unavailable" }, 500);
  }

  const ua = request.headers.get("user-agent") ?? undefined;
  const ip = clientIp(request);

  // POST /api/auth/signup
  if (path === "/api/auth/signup" && request.method === "POST") {
    const body = await readJson(request);
    const res = await signUpWithPassword(
      db,
      String(body.email ?? ""),
      String(body.password ?? ""),
      { fullName: body.fullName ? String(body.fullName) : undefined, ip, ua }
    );
    if (!res.ok) return json({ ok: false, error: res.error }, 400);
    return json({ ok: true, userId: res.userId }, 200, sessionCookieHeader(res.sessionToken));
  }

  // POST /api/auth/login
  if (path === "/api/auth/login" && request.method === "POST") {
    const body = await readJson(request);
    const res = await signInWithPassword(db, String(body.email ?? ""), String(body.password ?? ""), { ip, ua });
    if (!res.ok) return json({ ok: false, error: res.error }, 401);
    return json({ ok: true, userId: res.userId }, 200, sessionCookieHeader(res.sessionToken));
  }

  // POST /api/auth/logout
  if (path === "/api/auth/logout" && request.method === "POST") {
    const token = readSessionCookie(request.headers.get("cookie"));
    if (token) await revokeSession(db, token).catch(() => {});
    return json({ ok: true }, 200, clearSessionCookieHeader());
  }

  // GET /api/auth/me
  if (path === "/api/auth/me" && request.method === "GET") {
    const token = readSessionCookie(request.headers.get("cookie"));
    const user = await getSessionUser(db, token);
    if (!user) return json({ ok: false, user: null }, 401);
    return json({ ok: true, user });
  }

  // GET /api/auth/google -> redirect to Google
  if (path === "/api/auth/google" && request.method === "GET") {
    try {
      return googleAuthRedirect(url.origin);
    } catch (e) {
      console.error("[auth] google redirect failed", e);
      return json({ ok: false, error: "oauth_not_configured" }, 500);
    }
  }

  // GET /api/auth/google/callback
  if (path === "/api/auth/google/callback" && request.method === "GET") {
    const { response } = await googleCallback(db, request);
    return response;
  }

  // POST /api/auth/reset-request
  if (path === "/api/auth/reset-request" && request.method === "POST") {
    const body = await readJson(request);
    const email = String(body.email ?? "").trim();
    const res = await createPasswordResetToken(db, email);
    if (res.ok && res.token) {
      const resetUrl = `${url.origin}/actualizar-password?token=${encodeURIComponent(res.token)}`;
      // Best-effort email; never leak whether the address exists.
      try {
        await sendTemplateEmail({
          to: email,
          templateSlug: "password-reset",
          variables: { reset_url: resetUrl, email },
          fallbackSubject: "Recupera tu contraseña — CVAI",
          fallbackHtml: `<p>Hola,</p><p>Recibimos una solicitud para restablecer tu contraseña en CVAI.</p><p><a href="${resetUrl}">Haz clic aquí para crear una nueva contraseña</a></p><p>Este enlace vence en 1 hora. Si no fuiste tú, ignora este mensaje.</p>`,
        });
      } catch (e) {
        console.error("[auth] reset email failed", e);
      }
    }
    return json({ ok: true });
  }

  // POST /api/auth/reset-confirm
  if (path === "/api/auth/reset-confirm" && request.method === "POST") {
    const body = await readJson(request);
    const res = await resetPasswordWithToken(db, String(body.token ?? ""), String(body.password ?? ""));
    if (!res.ok) return json({ ok: false, error: res.error }, 400);
    return json({ ok: true });
  }

  return json({ ok: false, error: "not_found" }, 404);
}
