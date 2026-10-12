// User account operations on D1 (server-only): signup, login, password reset.
// Mirrors the old Supabase behavior: signup creates users + profiles + user_roles rows
// (replaces the handle_new_user() trigger).

import type { D1Database } from "@/lib/d1.server";
import { hashPassword, verifyPassword, randomToken, sha256Hex, newUserId } from "./crypto.server";
import { createSession } from "./session.server";

export type AuthResult =
  | { ok: true; userId: string; sessionToken: string }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function utcNow(): string {
  return new Date().toISOString();
}

/** Sign up with email+password. Creates users, profiles, user_roles rows. */
export async function signUpWithPassword(
  db: D1Database,
  email: string,
  password: string,
  opts?: { fullName?: string; ip?: string; ua?: string }
): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!EMAIL_RE.test(cleanEmail)) return { ok: false, error: "invalid_email" };
  if (password.length < 6) return { ok: false, error: "weak_password" };

  const existing = await db
    .prepare(`SELECT id FROM users WHERE email = ?`)
    .bind(cleanEmail)
    .first<{ id: string }>();
  if (existing) return { ok: false, error: "email_taken" };

  const userId = newUserId();
  const passwordHash = await hashPassword(password);
  const now = utcNow();

  const stmts = [
    db
      .prepare(
        `INSERT INTO users (id, email, password_hash, full_name, email_verified, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?)`
      )
      .bind(userId, cleanEmail, passwordHash, opts?.fullName ?? null, now, now),
    // handle_new_user() equivalent
    db
      .prepare(
        `INSERT INTO profiles (id, full_name, created_at, updated_at)
         VALUES (?, ?, ?, ?)`
      )
      .bind(userId, opts?.fullName ?? null, now, now),
    db
      .prepare(`INSERT OR IGNORE INTO user_roles (user_id, role) VALUES (?, 'user')`)
      .bind(userId),
  ];
  await db.batch(stmts);

  const sessionToken = await createSession(db, userId, { ip: opts?.ip, ua: opts?.ua });
  return { ok: true, userId, sessionToken };
}

/** Log in with email+password. */
export async function signInWithPassword(
  db: D1Database,
  email: string,
  password: string,
  opts?: { ip?: string; ua?: string }
): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  const row = await db
    .prepare(`SELECT id, password_hash FROM users WHERE email = ?`)
    .bind(cleanEmail)
    .first<{ id: string; password_hash: string | null }>();
  if (!row || !row.password_hash) return { ok: false, error: "invalid_credentials" };
  const valid = await verifyPassword(password, row.password_hash);
  if (!valid) return { ok: false, error: "invalid_credentials" };
  const sessionToken = await createSession(db, row.id, { ip: opts?.ip, ua: opts?.ua });
  return { ok: true, userId: row.id, sessionToken };
}

/** Request a password reset: creates a token row, returns the raw token (caller emails it). */
export async function createPasswordResetToken(db: D1Database, email: string): Promise<{ ok: boolean; token?: string; userId?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const row = await db
    .prepare(`SELECT id FROM users WHERE email = ?`)
    .bind(cleanEmail)
    .first<{ id: string }>();
  // Always return ok:true to avoid email enumeration; token only for real users.
  if (!row) return { ok: true };
  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1h
  await db
    .prepare(
      `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)`
    )
    .bind(newUserId(), row.id, tokenHash, expires)
    .run();
  return { ok: true, token, userId: row.id };
}

/** Consume a reset token and set a new password. Revokes all sessions. */
export async function resetPasswordWithToken(
  db: D1Database,
  rawToken: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  if (newPassword.length < 6) return { ok: false, error: "weak_password" };
  const tokenHash = await sha256Hex(rawToken);
  const row = await db
    .prepare(
      `SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token_hash = ?`
    )
    .bind(tokenHash)
    .first<{ id: string; user_id: string; expires_at: string; used: number }>();
  if (!row || row.used === 1) return { ok: false, error: "invalid_token" };
  if (new Date(row.expires_at).getTime() < Date.now()) return { ok: false, error: "expired_token" };

  const passwordHash = await hashPassword(newPassword);
  await db.batch([
    db.prepare(`UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?`)
      .bind(passwordHash, utcNow(), row.user_id),
    db.prepare(`UPDATE password_reset_tokens SET used = 1 WHERE id = ?`).bind(row.id),
    db.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(row.user_id),
  ]);
  return { ok: true };
}
