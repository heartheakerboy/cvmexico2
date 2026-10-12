// Auth crypto helpers (server-only). bcryptjs is pure JS -> Workers-safe.
// Supabase stored bcrypt hashes ($2a$), so existing password hashes verify as-is.

import bcrypt from "bcryptjs";

const BCRYPT_COST = 10;

/** Hash a new password. */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

/** Verify against a bcrypt hash (works for Supabase-migrated hashes too). */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!hash) return false;
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

/** Opaque random token (hex, 256-bit). */
export function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** SHA-256 hex digest (for storing token hashes in DB). */
export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input)
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** New user id. */
export function newUserId(): string {
  return crypto.randomUUID();
}
