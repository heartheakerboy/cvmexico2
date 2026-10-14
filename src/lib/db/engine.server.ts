// D1 query engine: compiles a QuerySpec to SQL, enforces the table
// access policy (RLS replacement), converts values between Postgres
// semantics and D1 storage (booleans 0/1, JSON as text).
// Server-only.

import type { D1Database } from "@/lib/d1.server";
import { COLUMN_KINDS } from "./schema-meta";
import { policyFor, type DbCtx, type QueryResult, type QuerySpec, type Filter } from "./spec";

const IDENT = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function ident(name: string): string {
  if (!IDENT.test(name)) throw new Error(`Invalid identifier: ${name}`);
  return `"${name}"`;
}

function kindOf(table: string, column: string): string {
  return COLUMN_KINDS[table]?.[column] ?? "string";
}

function toStored(table: string, column: string, value: unknown): unknown {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const kind = kindOf(table, column);
  if (kind === "boolean") return value ? 1 : 0;
  if (kind === "json") return typeof value === "string" ? value : JSON.stringify(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

function fromStored(table: string, column: string, value: unknown): unknown {
  if (value === null || value === undefined) return value;
  const kind = kindOf(table, column);
  if (kind === "boolean") return value === 1 || value === true;
  if (kind === "json" && typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

function convertRow(table: string, row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) out[k] = fromStored(table, k, v);
  return out;
}

const OP_SQL: Record<string, string> = {
  eq: "=", neq: "<>", gt: ">", gte: ">=", lt: "<", lte: "<=", like: "LIKE", ilike: "LIKE",
};

type WhereParts = { sql: string[]; binds: unknown[] };

function filterSql(table: string, f: Filter, parts: WhereParts, prefix = "") {
  const col = ident(f.column);
  const stored = (v: unknown) => toStored(table, f.column, v);
  if (f.op === "is") {
    if (f.value === null) parts.sql.push(`${prefix}${col} IS ${f.negate ? "NOT " : ""}NULL`);
    else if (f.value === true) parts.sql.push(`${prefix}${col} IS ${f.negate ? "NOT " : ""}TRUE`);
    else if (f.value === false) parts.sql.push(`${prefix}${col} IS ${f.negate ? "NOT " : ""}FALSE`);
    return;
  }
  if (f.op === "in") {
    const values = Array.isArray(f.value) ? f.value : [f.value];
    if (values.length === 0) {
      parts.sql.push("1 = 0");
      return;
    }
    parts.sql.push(`${prefix}${col} ${f.negate ? "NOT " : ""}IN (${values.map(() => "?").join(", ")})`);
    for (const v of values) parts.binds.push(stored(v));
    return;
  }
  const op = OP_SQL[f.op] ?? "=";
  parts.sql.push(`${prefix}${f.negate ? "NOT " : ""}(${col} ${op} ?)`);
  parts.binds.push(stored(f.value));
}

/** Parse a PostgREST or() string: "col.op.value,col2.op.value2" */
function orGroupSql(table: string, raw: string, parts: WhereParts) {
  const terms = raw.split(/,(?![^(]*\))/).map((s) => s.trim()).filter(Boolean);
  const sqls: string[] = [];
  for (const term of terms) {
    const sub: WhereParts = { sql: [], binds: [] };
    const firstDot = term.indexOf(".");
    const lastDot = term.lastIndexOf(".");
    if (firstDot < 0 || lastDot <= firstDot) continue;
    const column = term.slice(0, firstDot);
    const op = term.slice(firstDot + 1, lastDot);
    let value: unknown = term.slice(lastDot + 1);
    if (value === "null") value = null;
    filterSql(table, { column, op: op as Filter["op"], value }, sub);
    sqls.push(...sub.sql);
    parts.binds.push(...sub.binds);
  }
  if (sqls.length) parts.sql.push(`(${sqls.join(" OR ")})`);
}

function policyError(message: string): QueryResult {
  return { data: null, error: { message, code: "42501" } };
}

/** Build policy WHERE conditions for select/update/delete. Returns error or null. */
function enforceReadPolicy(
  spec: QuerySpec,
  ctx: DbCtx,
  parts: WhereParts
): QueryResult | null {
  const policy = policyFor(spec.table);
  if (ctx.service || ctx.isAdmin) return null;
  switch (policy.select) {
    case "public":
      if (policy.publicWhere) parts.sql.push(`(${policy.publicWhere})`);
      return null;
    case "auth":
      if (!ctx.userId) return policyError("authentication required");
      return null;
    case "owner": {
      if (!ctx.userId) return policyError("authentication required");
      const col = policy.ownerColumn ?? "user_id";
      parts.sql.push(`${ident(col)} = ?`);
      parts.binds.push(ctx.userId);
      return null;
    }
    case "admin":
      return policyError("admin access required");
  }
}

/** For inserts: validate + force owner column. Returns error or null. */
function enforceInsertPolicy(spec: QuerySpec, ctx: DbCtx): QueryResult | null {
  const policy = policyFor(spec.table);
  if (ctx.service || ctx.isAdmin) return null;
  const mode = policy.insert ?? (policy.select === "owner" ? "owner" : "admin");
  if (mode === "admin") return policyError("admin access required");
  if (mode === "ownerOrAnon") {
    // Signed-in: force own id. Anonymous (public contact form): force null.
    const col = policy.ownerColumn ?? "user_id";
    for (const row of spec.rows ?? []) {
      row[col] = ctx.userId ?? null;
    }
    return null;
  }
  if (!ctx.userId) return policyError("authentication required");
  if (mode === "owner") {
    const col = policy.ownerColumn ?? "user_id";
    for (const row of spec.rows ?? []) {
      if (row[col] !== undefined && row[col] !== ctx.userId) {
        return policyError("cannot write rows for another user");
      }
      row[col] = ctx.userId;
    }
  }
  return null;
}

function parseSelectList(columns: string): { plain: string[]; relations: { name: string; cols: string[] }[] } {
  const plain: string[] = [];
  const relations: { name: string; cols: string[] }[] = [];
  const items = columns.split(/,(?![^(]*\))/).map((s) => s.trim()).filter(Boolean);
  for (const item of items) {
    const m = item.match(/^(\w+)\(([^)]*)\)$/);
    if (m) relations.push({ name: m[1], cols: m[2].split(",").map((s) => s.trim()).filter(Boolean) });
    else plain.push(item);
  }
  return { plain, relations };
}

function nowIso(): string {
  return new Date().toISOString();
}

/** Fill id/created_at/updated_at defaults the way Postgres did. */
function applyInsertDefaults(table: string, row: Record<string, unknown>) {
  const kinds = COLUMN_KINDS[table] ?? {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (v !== undefined) out[k] = v;
  }
  if ("id" in kinds && (out.id === undefined || out.id === null)) out.id = crypto.randomUUID();
  if ("created_at" in kinds && out.created_at === undefined) out.created_at = nowIso();
  if ("updated_at" in kinds && out.updated_at === undefined) out.updated_at = nowIso();
  return out;
}

export async function hasRole(db: D1Database, userId: string, role: string): Promise<boolean> {
  const row = await db
    .prepare(`SELECT 1 AS ok FROM user_roles WHERE user_id = ? AND role = ? LIMIT 1`)
    .bind(userId, role)
    .first<{ ok: number }>();
  return !!row;
}

export async function executeQuery(
  db: D1Database,
  spec: QuerySpec,
  ctx: DbCtx
): Promise<QueryResult> {
  try {
    switch (spec.op) {
      case "select":
        return await runSelect(db, spec, ctx);
      case "insert":
        return await runInsert(db, spec, ctx, false);
      case "upsert":
        return await runInsert(db, spec, ctx, true);
      case "update":
        return await runUpdate(db, spec, ctx);
      case "delete":
        return await runDelete(db, spec, ctx);
    }
  } catch (e) {
    return { data: null, error: { message: e instanceof Error ? e.message : String(e) } };
  }
}

function whereFromSpec(spec: QuerySpec, ctx: DbCtx): { parts: WhereParts; error: QueryResult | null } {
  const parts: WhereParts = { sql: [], binds: [] };
  for (const f of spec.filters) filterSql(spec.table, f, parts);
  for (const raw of spec.orGroups ?? []) orGroupSql(spec.table, raw, parts);
  const error = enforceReadPolicy(spec, ctx, parts);
  return { parts, error };
}

async function runSelect(db: D1Database, spec: QuerySpec, ctx: DbCtx): Promise<QueryResult> {
  const { parts, error } = whereFromSpec(spec, ctx);
  if (error) return error;
  const where = parts.sql.length ? ` WHERE ${parts.sql.join(" AND ")}` : "";

  let count: number | null = null;
  if (spec.count === "exact" || spec.head) {
    const crow = await db
      .prepare(`SELECT COUNT(*) AS n FROM ${ident(spec.table)}${where}`)
      .bind(...parts.binds)
      .first<{ n: number }>();
    count = crow?.n ?? 0;
    if (spec.head) return { data: null, error: null, count };
  }

  const { plain, relations } = parseSelectList(spec.columns ?? "*");
  const selectCols: string[] = [];
  const tableAlias = "t";
  if (plain.includes("*")) selectCols.push(`${tableAlias}.*`);
  else for (const c of plain) selectCols.push(`${tableAlias}.${ident(c)}`);
  const joins: string[] = [];
  for (const rel of relations) {
    const fkCol = `${rel.name.replace(/s$/, "")}_id`;
    joins.push(`LEFT JOIN ${ident(rel.name)} ON ${ident(rel.name)}."id" = ${tableAlias}.${ident(fkCol)}`);
    for (const c of rel.cols) selectCols.push(`${ident(rel.name)}.${ident(c)} AS "__rel_${rel.name}_${c}"`);
  }

  let sql = `SELECT ${selectCols.join(", ")} FROM ${ident(spec.table)} ${tableAlias} ${joins.join(" ")}${where}`;
  if (spec.order?.length) {
    sql += ` ORDER BY ${spec.order.map((o) => `${tableAlias}.${ident(o.column)} ${o.ascending ? "ASC" : "DESC"}`).join(", ")}`;
  }
  const binds = [...parts.binds];
  if (spec.rangeFrom !== undefined && spec.rangeTo !== undefined) {
    sql += ` LIMIT ? OFFSET ?`;
    binds.push(spec.rangeTo - spec.rangeFrom + 1, spec.rangeFrom);
  } else if (spec.limit !== undefined) {
    sql += ` LIMIT ?`;
    binds.push(spec.limit);
  }

  const { results } = await db.prepare(sql).bind(...binds).all<Record<string, unknown>>();

  let rows = results.map((raw) => {
    const row = convertRow(spec.table, raw);
    for (const rel of relations) {
      const nested: Record<string, unknown> = {};
      let hasValue = false;
      for (const c of rel.cols) {
        const key = `__rel_${rel.name}_${c}`;
        const v = raw[key];
        if (v !== null && v !== undefined) hasValue = true;
        nested[c] = fromStored(rel.name, c, v);
        delete row[key];
      }
      row[rel.name] = hasValue ? nested : null;
    }
    return row;
  });

  if (spec.single) {
    if (rows.length !== 1) {
      return { data: null, error: { message: "JSON object requested, multiple (or no) rows returned", code: "PGRST116" }, count };
    }
    return { data: rows[0], error: null, count };
  }
  if (spec.maybeSingle) {
    if (rows.length > 1) {
      return { data: null, error: { message: "JSON object requested, multiple rows returned", code: "PGRST116" }, count };
    }
    return { data: rows[0] ?? null, error: null, count };
  }
  return { data: rows, error: null, count };
}

async function runInsert(
  db: D1Database,
  spec: QuerySpec,
  ctx: DbCtx,
  upsert: boolean
): Promise<QueryResult> {
  const policyErr = enforceInsertPolicy(spec, ctx);
  if (policyErr) return policyErr;
  const inserted: Record<string, unknown>[] = [];

  for (const rawRow of spec.rows ?? []) {
    const row = applyInsertDefaults(spec.table, { ...rawRow });
    const cols = Object.keys(row).filter((c) => row[c] !== undefined);
    const values = cols.map((c) => toStored(spec.table, c, row[c]));
    let sql = `INSERT INTO ${ident(spec.table)} (${cols.map(ident).join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`;
    if (upsert) {
      const PK_MAP: Record<string, string> = { ai_user_limits: "user_id" };
      const conflictCols = (spec.onConflict ?? PK_MAP[spec.table] ?? "id").split(",").map((s) => s.trim()).filter(Boolean);
      const updateCols = cols.filter((c) => !conflictCols.includes(c) && c !== "created_at");
      if (updateCols.length) {
        sql += ` ON CONFLICT(${conflictCols.map(ident).join(", ")}) DO UPDATE SET ${updateCols.map((c) => `${ident(c)} = excluded.${ident(c)}`).join(", ")}`;
      } else {
        sql += ` ON CONFLICT(${conflictCols.map(ident).join(", ")}) DO NOTHING`;
      }
    }
    if (spec.returning) {
      sql += ` RETURNING *`;
      const res = await db.prepare(sql).bind(...values).all<Record<string, unknown>>();
      if (res.results?.length) {
        inserted.push(...res.results.map((r) => convertRow(spec.table, r)));
      }
    } else {
      await db.prepare(sql).bind(...values).run();
    }
  }

  if (spec.returning) {
    if (spec.single) return { data: inserted[0] ?? null, error: inserted.length ? null : { message: "no rows returned", code: "PGRST116" } };
    if (spec.maybeSingle) return { data: inserted[0] ?? null, error: null };
    return { data: inserted, error: null };
  }
  return { data: null, error: null };
}

async function runUpdate(db: D1Database, spec: QuerySpec, ctx: DbCtx): Promise<QueryResult> {
  const parts: WhereParts = { sql: [], binds: [] };
  // write policy mirrors read policy scoping
  const policy = policyFor(spec.table);
  if (!ctx.service && !ctx.isAdmin) {
    const mode = policy.update ?? (policy.select === "owner" ? "owner" : "admin");
    if (mode === "admin") return policyError("admin access required");
    if (!ctx.userId) return policyError("authentication required");
    const col = policy.ownerColumn ?? "user_id";
    parts.sql.push(`${ident(col)} = ?`);
    parts.binds.push(ctx.userId);
  }
  for (const f of spec.filters) filterSql(spec.table, f, parts);

  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(spec.patch ?? {})) {
    if (v !== undefined) patch[k] = v;
  }
  const kinds = COLUMN_KINDS[spec.table] ?? {};
  if ("updated_at" in kinds && patch.updated_at === undefined) patch.updated_at = nowIso();

  const cols = Object.keys(patch);
  if (!cols.length) return { data: null, error: null };
  const setSql = cols.map((c) => `${ident(c)} = ?`).join(", ");
  const binds = [...cols.map((c) => toStored(spec.table, c, patch[c])), ...parts.binds];
  const where = parts.sql.length ? ` WHERE ${parts.sql.join(" AND ")}` : "";
  let sql = `UPDATE ${ident(spec.table)} SET ${setSql}${where}`;
  if (!spec.returning) {
    await db.prepare(sql).bind(...binds).run();
    return { data: null, error: null };
  }
  sql += ` RETURNING *`;
  const res = await db.prepare(sql).bind(...binds).all<Record<string, unknown>>();
  {
    const rows = (res.results ?? []).map((r) => convertRow(spec.table, r));
    if (spec.single) return { data: rows[0] ?? null, error: rows.length ? null : { message: "no rows returned", code: "PGRST116" } };
    if (spec.maybeSingle) return { data: rows[0] ?? null, error: null };
    return { data: rows, error: null };
  }
  return { data: null, error: null };
}

async function runDelete(db: D1Database, spec: QuerySpec, ctx: DbCtx): Promise<QueryResult> {
  const parts: WhereParts = { sql: [], binds: [] };
  const policy = policyFor(spec.table);
  if (!ctx.service && !ctx.isAdmin) {
    const mode = policy.delete ?? (policy.select === "owner" ? "owner" : "admin");
    if (mode === "admin") return policyError("admin access required");
    if (!ctx.userId) return policyError("authentication required");
    const col = policy.ownerColumn ?? "user_id";
    parts.sql.push(`${ident(col)} = ?`);
    parts.binds.push(ctx.userId);
  }
  for (const f of spec.filters) filterSql(spec.table, f, parts);
  const where = parts.sql.length ? ` WHERE ${parts.sql.join(" AND ")}` : "";
  let sql = `DELETE FROM ${ident(spec.table)}${where}`;
  if (!spec.returning) {
    await db.prepare(sql).bind(...parts.binds).run();
    return { data: null, error: null };
  }
  sql += ` RETURNING *`;
  const res = await db.prepare(sql).bind(...parts.binds).all<Record<string, unknown>>();
  {
    const rows = (res.results ?? []).map((r) => convertRow(spec.table, r));
    return { data: rows, error: null };
  }
  return { data: null, error: null };
}
