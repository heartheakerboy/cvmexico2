// Google OAuth (authorization-code flow, manual — no SDK). Server-only.
// Needs env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET.
// Redirect URI registered in Google Cloud Console:
//   https://www.cvai.com.mx/api/auth/google/callback
//   (+ https://cvai.heartheakerboy072.workers.dev/api/auth/google/callback for testing)

import type { D1Database } from "@/lib/d1.server";
import { randomToken, sha256Hex, newUserId } from "./crypto.server";
import { createSession } from "./session.server";

const OAUTH_STATE_COOKIE = "cvai_oauth_state";

function env(name: string): string {
  const v = (process.env as Record<string, string | undefined>)[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function redirectUri(origin: string): string {
  return `${origin}/api/auth/google/callback`;
}

/** Step 1: build Google authorization URL + state cookie. */
export function googleAuthRedirect(origin: string): Response {
  const state = randomToken();
  const params = new URLSearchParams({
    client_id: env("GOOGLE_CLIENT_ID"),
    redirect_uri: redirectUri(origin),
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });
  const headers = new Headers();
  headers.set(
    "Set-Cookie",
    `${OAUTH_STATE_COOKIE}=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600; Secure`
  );
  headers.set("Location", `https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  return new Response(null, { status: 302, headers });
}

type GoogleTokenResponse = {
  access_token: string;
  id_token?: string;
  expires_in: number;
  token_type: string;
};

type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
};

/** Step 2: callback — validate state, exchange code, find-or-create user, session. */
export async function googleCallback(
  db: D1Database,
  request: Request
): Promise<{ response: Response; ok: boolean; error?: string }> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = request.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)cvai_oauth_state=([^;]+)/)?.[1];

  const fail = (error: string) =>
    Response.redirect(`${url.origin}/auth?error=${error}`, 302);

  if (!code || !state || !cookieState || state !== decodeURIComponent(cookieState)) {
    return { response: fail("oauth_state"), ok: false, error: "oauth_state" };
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env("GOOGLE_CLIENT_ID"),
        client_secret: env("GOOGLE_CLIENT_SECRET"),
        redirect_uri: redirectUri(url.origin),
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) return { response: fail("oauth_exchange"), ok: false, error: "oauth_exchange" };
    const tokens = (await tokenRes.json()) as GoogleTokenResponse;

    // Get user info
    const meRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!meRes.ok) return { response: fail("oauth_userinfo"), ok: false, error: "oauth_userinfo" };
    const info = (await meRes.json()) as GoogleUserInfo;
    if (!info.email) return { response: fail("oauth_no_email"), ok: false, error: "oauth_no_email" };

    const email = info.email.toLowerCase();
    const now = new Date().toISOString();

    // Existing oauth link?
    let userId: string | null = null;
    const linked = await db
      .prepare(`SELECT user_id FROM oauth_accounts WHERE provider = 'google' AND provider_user_id = ?`)
      .bind(info.sub)
      .first<{ user_id: string }>();
    if (linked) {
      userId = linked.user_id;
    } else {
      // Match by email, else create
      const byEmail = await db
        .prepare(`SELECT id FROM users WHERE email = ?`)
        .bind(email)
        .first<{ id: string }>();
      if (byEmail) {
        userId = byEmail.id;
      } else {
        userId = newUserId();
        await db.batch([
          db.prepare(
            `INSERT INTO users (id, email, password_hash, full_name, avatar_url, email_verified, created_at, updated_at)
             VALUES (?, ?, NULL, ?, ?, 1, ?, ?)`
          ).bind(userId, email, info.name ?? null, info.picture ?? null, now, now),
          db.prepare(`INSERT INTO profiles (id, full_name, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`)
            .bind(userId, info.name ?? null, info.picture ?? null, now, now),
          db.prepare(`INSERT OR IGNORE INTO user_roles (user_id, role) VALUES (?, 'user')`).bind(userId),
        ]);
      }
      await db
        .prepare(
          `INSERT OR IGNORE INTO oauth_accounts (id, user_id, provider, provider_user_id) VALUES (?, ?, 'google', ?)`
        )
        .bind(newUserId(), userId, info.sub)
        .run();
    }

    const sessionToken = await createSession(db, userId, {
      ua: request.headers.get("user-agent") ?? undefined,
    });

    // Two separate Set-Cookie headers (cannot be comma-joined reliably)
    const maxAge = 30 * 24 * 60 * 60;
    const res = new Response(null, { status: 302 });
    res.headers.set("Location", `${url.origin}/panel`);
    res.headers.append("Set-Cookie", `cvai_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Secure`);
    res.headers.append("Set-Cookie", `${OAUTH_STATE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`);
    return { response: res, ok: true };
  } catch (e) {
    console.error("[oauth] callback failed", e);
    return { response: fail("oauth_failed"), ok: false, error: "oauth_failed" };
  }
}
