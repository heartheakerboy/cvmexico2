// Session management on D1 (server-only).
// Opaque tokens: raw token goes to the cookie, SHA-256 hash is stored in DB.

import { getDB } from "@/lib/d1.server";
import { randomToken, sha256Hex, newUserId } from "./crypto.server";

export const SESSION_COOKIE = "cvai_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type SessionUser = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
};

function utcNowPlus(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}

/** Create a session row, return the raw token for the cookie. */
export async function createSession(
  userId: string,
  opts?: { ip?: string; ua?: string }
): Promise<string> {
  const db = getDB();
  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  await db
    .prepare(
      `INSERT INTO sessions (id, user_id, token_hash, expires_at, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      newUserId(),
      userId,
      tokenHash,
      utcNowPlus(SESSION_TTL_MS),
      opts?.ip ?? null,
      opts?.ua ?? null
    )
    .run();
  await db
    .prepare(`UPDATE users SET last_sign_in_at = ? WHERE id = ?`)
    .bind(new Date().toISOString(), userId)
    .run();
  return token;
}

/** Validate a raw session token -> user (with admin flag). Null if invalid/expired. */
export async function getSessionUser(rawToken: string | null | undefined): Promise<SessionUser | null> {
  if (!rawToken) return null;
  const db = getDB();
  const tokenHash = await sha256Hex(rawToken);
  const row = await db
    .prepare(
      `SELECT u.id, u.email, u.full_name, u.avatar_url, s.expires_at,
              EXISTS (SELECT 1 FROM user_roles r WHERE r.user_id = u.id AND r.role = 'admin') AS is_admin
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ?`
    )
    .bind(tokenHash)
    .first<{
      id: string;
      email: string;
      full_name: string | null;
      avatar_url: string | null;
      expires_at: string;
      is_admin: number;
    }>();
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    // lazy cleanup
    await db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).bind(tokenHash).run().catch(() => {});
    return null;
  }
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    avatar_url: row.avatar_url,
    is_admin: row.is_admin === 1,
  };
}

/** Revoke one session by raw token. */
export async function revokeSession(rawToken: string): Promise<void> {
  const db = getDB();
  const tokenHash = await sha256Hex(rawToken);
  await db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).bind(tokenHash).run();
}

/** Revoke all sessions for a user (e.g. after password change). */
export async function revokeAllSessions(userId: string): Promise<void> {
  const db = getDB();
  await db.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(userId).run();
}

/** Build a Set-Cookie header value for the session cookie. */
export function sessionCookieHeader(token: string, opts?: { maxAge?: number }): string {
  const maxAge = opts?.maxAge ?? Math.floor(SESSION_TTL_MS / 1000);
  // Secure only on https; Workers always https in prod, but keep it simple & safe:
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Secure`;
}

/** Expire the session cookie. */
export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}

/** Read the session token from a Cookie header. */
export function readSessionCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(/(?:^|;\s*)cvai_session=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
