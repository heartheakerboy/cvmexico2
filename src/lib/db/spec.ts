// Shared query spec + access policy for the D1 data layer.
// The browser client serializes a QuerySpec to POST /api/db; the server
// engine executes it against D1 after enforcing the table policy
// (the app-level replacement for Supabase RLS — see ACCESS-MATRIX.md).

export type DbCtx = {
  userId: string | null;
  isAdmin: boolean;
  service?: boolean; // trusted server-side code (webhooks, cron, admin functions)
};

export type FilterOp =
  | "eq" | "neq" | "gt" | "gte" | "lt" | "lte"
  | "like" | "ilike" | "in" | "is";

export type Filter = {
  column: string;
  op: FilterOp;
  value: unknown;
  negate?: boolean;
};

export type QuerySpec = {
  table: string;
  op: "select" | "insert" | "update" | "delete" | "upsert";
  columns?: string; // select list, PostgREST style ("*", "id, title", "rel(a,b)")
  rows?: Record<string, unknown>[];
  patch?: Record<string, unknown>;
  filters: Filter[];
  orGroups?: string[]; // raw PostgREST or() strings, parsed server-side
  order?: { column: string; ascending: boolean }[];
  limit?: number;
  rangeFrom?: number;
  rangeTo?: number;
  count?: "exact";
  head?: boolean;
  returning?: string; // select list for mutation RETURNING
  onConflict?: string; // upsert conflict columns, comma separated
  single?: boolean;
  maybeSingle?: boolean;
};

export type QueryResult = {
  data: unknown;
  error: { message: string; code?: string } | null;
  count?: number | null;
};

// ---------------------------------------------------------------------------
// Table access policy (from ACCESS-MATRIX.md, generated from Supabase RLS).
// select: who can read, and how rows are scoped for non-admins.
//   public  -> anyone; non-admins get `publicWhere` condition (if any)
//   auth    -> any signed-in user, all rows
//   owner   -> only rows where ownerColumn = userId (admin: all)
//   admin   -> admins only
// insert/update/delete default: public+auth tables = admin; owner = owner/admin.
// ---------------------------------------------------------------------------

export type TablePolicy = {
  select: "public" | "auth" | "owner" | "admin";
  publicWhere?: string;
  ownerColumn?: string;
  insert?: "owner" | "admin" | "auth" | "ownerOrAnon";
  update?: "owner" | "admin";
  delete?: "owner" | "admin";
};

const PUB = (publicWhere?: string): TablePolicy => ({ select: "public", publicWhere });
const AUTHREAD: TablePolicy = { select: "auth", insert: "admin", update: "admin", delete: "admin" };
const OWN = (ownerColumn = "user_id", insert: "owner" | "admin" = "owner"): TablePolicy => ({
  select: "owner",
  ownerColumn,
  insert,
  update: "owner",
  delete: "owner",
});
const ADMIN: TablePolicy = { select: "admin", insert: "admin", update: "admin", delete: "admin" };

export const TABLE_POLICIES: Record<string, TablePolicy> = {
  // Public content (anon read of visible rows; admin manages)
  blog_posts: PUB("status = 'publicado'"),
  cities: PUB("is_active = 1"),
  coupons: PUB("active = 1"),
  faqs: PUB("published = 1"),
  landing_pages: PUB("published = 1"),
  legal_pages: PUB(),
  notifications: PUB("active = 1"),
  occupations: PUB(),
  plans: PUB("active = 1"),
  redirects: PUB(),
  seo_pages: PUB(),
  templates: PUB("active = 1"),
  testimonials: PUB("featured = 1"),
  translations: PUB(),

  // Signed-in users can read all rows; admins manage
  ai_models: AUTHREAD,
  ai_prompts: AUTHREAD,
  ai_prompt_versions: AUTHREAD,
  email_broadcasts: AUTHREAD,
  email_logs: { ...AUTHREAD, insert: "auth" },
  email_templates: AUTHREAD,
  media_files: AUTHREAD,

  // Owner-scoped user data
  resumes: OWN(),
  cover_letters: OWN(),
  downloads: OWN(),
  invoices: OWN(),
  billing_details: OWN(),
  coupon_redemptions: OWN(),
  job_applications: OWN(),
  job_events: OWN(),
  ai_usage_logs: OWN(),
  ai_credit_events: { ...OWN(), insert: "admin" },
  ai_user_limits: { ...OWN(), insert: "admin" },
  profiles: OWN("id"),
  storage_files: OWN("owner_id"),
  support_tickets: { ...OWN(), insert: "ownerOrAnon" }, // public contact form (user_id null) + own tickets
  email_preferences: OWN(),
  user_roles: { select: "owner", ownerColumn: "user_id", insert: "admin", update: "admin", delete: "admin" },

  // Admin only
  affiliates: ADMIN,
  affiliate_commissions: ADMIN,
  affiliate_payouts: ADMIN,
  affiliate_referrals: ADMIN,
  api_keys: ADMIN,
  audit_logs: ADMIN,
  marketing_campaigns: ADMIN,
  system_backups: ADMIN,
  system_cron_jobs: ADMIN,
  system_logs: ADMIN,
  system_queue_jobs: ADMIN,
  system_settings: ADMIN,
  email_campaigns: ADMIN,
  email_events: ADMIN,
  email_suppressions: ADMIN,
  campaign_recipients: ADMIN,
};

export function policyFor(table: string): TablePolicy {
  return TABLE_POLICIES[table] ?? ADMIN; // unknown tables: admin only (safe default)
}
