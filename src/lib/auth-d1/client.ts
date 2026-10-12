// Client-side helpers for the D1 auth system (parallel build).
// Not wired into the UI yet — the app still uses Supabase auth until cutover.

export type D1User = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
};

async function post(path: string, body: unknown) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    credentials: "same-origin",
  });
  return res.json();
}

export function d1SignUp(email: string, password: string, fullName?: string) {
  return post("/api/auth/signup", { email, password, fullName });
}

export function d1Login(email: string, password: string) {
  return post("/api/auth/login", { email, password });
}

export function d1Logout() {
  return post("/api/auth/logout", {});
}

export async function d1Me(): Promise<{ ok: boolean; user: D1User | null }> {
  const res = await fetch("/api/auth/me", { credentials: "same-origin" });
  return res.json();
}

/** Redirects the browser to Google OAuth. */
export function d1GoogleLogin() {
  window.location.href = "/api/auth/google";
}

export function d1RequestPasswordReset(email: string) {
  return post("/api/auth/reset-request", { email });
}

export function d1ResetPassword(token: string, password: string) {
  return post("/api/auth/reset-confirm", { token, password });
}
