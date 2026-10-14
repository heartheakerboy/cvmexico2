// Isomorphic drop-in replacement for the Supabase browser client.
// Same surface the app already uses: supabase.from(...), supabase.rpc(...),
// supabase.auth.* — but backed by D1:
//   - browser: queries go to POST /api/db (session cookie auth)
//   - server (SSR on the Worker): queries run directly on the D1 binding
//
// Import path swap only: "@/integrations/supabase/client" -> "@/lib/db/client"

import { QueryBuilder } from "./builder";
import type { DbCtx, QueryResult, QuerySpec } from "./spec";

// ---------------------------------------------------------------------------
// Executors
// ---------------------------------------------------------------------------

async function httpExecutor(spec: QuerySpec): Promise<QueryResult> {
  const res = await fetch("/api/db", {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ spec }),
  });
  if (!res.ok) {
    return { data: null, error: { message: `db request failed (${res.status})` } };
  }
  return (await res.json()) as QueryResult;
}

async function directExecutor(spec: QuerySpec): Promise<QueryResult> {
  // Lazy import keeps D1/engine code out of the browser bundle.
  const { directExecutor: run } = await import("./direct-executor.server");
  return run(spec);
}

function pickExecutor(): (spec: QuerySpec) => Promise<QueryResult> {
  if (typeof window === "undefined") {
    const env = (globalThis as { __env__?: { DB?: unknown } }).__env__;
    if (env?.DB) return directExecutor;
  }
  return httpExecutor;
}

// ---------------------------------------------------------------------------
// Auth namespace (backed by /api/auth/*, D1 sessions in httpOnly cookie)
// ---------------------------------------------------------------------------

export type AuthUser = {
  id: string;
  email: string;
  user_metadata: { full_name?: string; avatar_url?: string; [k: string]: unknown };
  app_metadata: Record<string, unknown>;
  aud: string;
  created_at: string;
};

type MeUser = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
};

function toAuthUser(u: MeUser): AuthUser {
  return {
    id: u.id,
    email: u.email,
    user_metadata: { full_name: u.full_name ?? undefined, avatar_url: u.avatar_url ?? undefined },
    app_metadata: { is_admin: u.is_admin },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  };
}

export type Session = { user: AuthUser; access_token: string; token_type: string; expires_at: number };
type AuthCb = (event: string, session: Session | null) => void;

const subscribers = new Set<AuthCb>();
let cachedSession: Session | null | undefined; // undefined = unknown

function emit(event: string, session: Session | null) {
  cachedSession = session;
  for (const cb of subscribers) {
    try {
      cb(event, session);
    } catch {
      /* subscriber errors never break auth */
    }
  }
}

async function fetchSession(): Promise<Session | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "same-origin" });
    if (!res.ok) return null;
    const body = (await res.json()) as { ok: boolean; user: MeUser | null };
    if (!body.ok || !body.user) return null;
    return {
      user: toAuthUser(body.user),
      access_token: "cookie-session",
      token_type: "bearer",
      expires_at: Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
    };
  } catch {
    return null;
  }
}

async function currentSession(force = false): Promise<Session | null> {
  if (!force && cachedSession !== undefined) return cachedSession;
  cachedSession = await fetchSession();
  return cachedSession;
}

const auth = {
  async getSession() {
    const session = await currentSession();
    return { data: { session }, error: null };
  },
  async getUser() {
    const session = await currentSession(true);
    return { data: { user: session?.user ?? null }, error: session ? null : { message: "not signed in" } };
  },
  onAuthStateChange(cb: AuthCb) {
    subscribers.add(cb);
    // Fire the initial event asynchronously, like Supabase does.
    void currentSession().then((session) => {
      if (subscribers.has(cb)) cb(session ? "SIGNED_IN" : "INITIAL_SESSION", session);
    });
    return {
      data: {
        subscription: {
          unsubscribe() {
            subscribers.delete(cb);
          },
        },
      },
    };
  },
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.ok) {
      return { data: { user: null, session: null }, error: { message: body.error ?? "invalid_credentials" } };
    }
    const session = await currentSession(true);
    emit("SIGNED_IN", session);
    return { data: { user: session?.user ?? null, session }, error: null };
  },
  async signUp({ email, password, options }: { email: string; password: string; options?: { data?: { full_name?: string } } }) {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ email, password, fullName: options?.data?.full_name }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.ok) {
      return { data: { user: null, session: null }, error: { message: body.error ?? "signup_failed" } };
    }
    const session = await currentSession(true);
    emit("SIGNED_IN", session);
    return { data: { user: session?.user ?? null, session }, error: null };
  },
  async signInWithOAuth({ provider }: { provider: string }) {
    if (provider !== "google") return { data: {}, error: { message: "unsupported provider" } };
    window.location.href = "/api/auth/google";
    return { data: {}, error: null };
  },
  async signOut() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).catch(() => {});
    emit("SIGNED_OUT", null);
    return { error: null };
  },
  async resetPasswordForEmail(email: string) {
    await fetch("/api/auth/reset-request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ email }),
    }).catch(() => {});
    return { data: {}, error: null };
  },
  async updateUser(_attrs: { password?: string }) {
    // Password changes go through the token flow (/actualizar-password page).
    return { data: { user: null }, error: { message: "use reset token flow" } };
  },
};

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

async function rpc(fn: string, args: Record<string, unknown>): Promise<QueryResult> {
  if (typeof window === "undefined") {
    const env = (globalThis as { __env__?: { DB?: unknown } }).__env__;
    if (env?.DB) {
      const [{ getDBFromEnv }, { hasRole }] = await Promise.all([
        import("@/lib/d1.server"),
        import("./engine.server"),
      ]);
      const db = getDBFromEnv(env);
      if (fn === "has_role") {
        const data = await hasRole(db, String(args._user_id ?? ""), String(args._role ?? ""));
        return { data, error: null };
      }
      return { data: null, error: { message: `unknown rpc: ${fn}` } };
    }
  }
  const res = await fetch("/api/db", {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ rpc: fn, args }),
  });
  if (!res.ok) return { data: null, error: { message: `rpc failed (${res.status})` } };
  return (await res.json()) as QueryResult;
}

export const supabase = {
  from(table: string) {
    return new QueryBuilder(pickExecutor(), table);
  },
  rpc,
  auth,
};

export type { QueryResult };
