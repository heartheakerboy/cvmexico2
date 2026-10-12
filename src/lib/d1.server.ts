// D1 access for server functions on Cloudflare Workers.
// The Worker env (with the DB binding) is stashed per-request via
// AsyncLocalStorage in src/server.ts. Server-only: never import from client code.

import { AsyncLocalStorage } from "node:async_hooks";

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

type CFEnv = { DB?: D1Database; [key: string]: unknown };

const envStorage = new AsyncLocalStorage<CFEnv>();

/** Run `fn` with the Worker env available to getDB(). Called in server.ts fetch. */
export function runWithEnv<T>(env: unknown, fn: () => T): T {
  return envStorage.run((env ?? {}) as CFEnv, fn);
}

/** Get the D1 database binding for the current request. Throws outside Workers. */
export function getDB(): D1Database {
  const db = envStorage.getStore()?.DB;
  if (!db) {
    throw new Error(
      "D1 binding 'DB' is not available. Are you running on Cloudflare Workers?"
    );
  }
  return db;
}

/** True when running inside the Cloudflare Worker (D1 bound). */
export function hasDB(): boolean {
  return !!envStorage.getStore()?.DB;
}
