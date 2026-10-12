// D1 access for server functions on Cloudflare Workers (server-only).
// The Worker env (with the DB binding) is passed explicitly from src/server.ts
// fetch -> handleAuthRequest(request, env). No globals, no AsyncLocalStorage.

/** Minimal D1 binding surface (avoids @cloudflare/workers-types dep). */
export interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: unknown;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(column?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<{ success: boolean; meta: { changes?: number; last_row_id?: number } }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<unknown[]>;
  exec(query: string): Promise<unknown>;
}

export type CFEnv = { DB?: D1Database; [key: string]: unknown };

/** Extract the D1 binding. Nitro stashes the real Worker env on globalThis.__env__;
 *  the env param passed to custom fetch handlers may not include bindings. */
export function getDBFromEnv(env: unknown): D1Database {
  const fromParam = (env as CFEnv | undefined)?.DB;
  if (fromParam && typeof fromParam.prepare === "function") return fromParam;
  const fromGlobal = (globalThis as { __env__?: CFEnv }).__env__?.DB;
  if (fromGlobal && typeof fromGlobal.prepare === "function") return fromGlobal;
  throw new Error("D1 binding 'DB' is not available in Worker env");
}
