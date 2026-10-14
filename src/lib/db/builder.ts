// PostgREST-style query builder (supabase-js compatible surface) that
// produces a QuerySpec and hands it to an executor. Executors: HTTP
// (browser -> POST /api/db) or direct D1 (server-side).

import type { QueryResult, QuerySpec, Filter, FilterOp } from "./spec";

export type Executor = (spec: QuerySpec) => Promise<QueryResult>;

const EMPTY: QueryResult = { data: null, error: null };

export class QueryBuilder implements PromiseLike<QueryResult> {
  private spec: QuerySpec;
  private promise: Promise<QueryResult> | null = null;

  constructor(private executor: Executor, table: string) {
    this.spec = { table, op: "select", columns: "*", filters: [] };
  }

  select(columns = "*", opts?: { count?: "exact"; head?: boolean }): this {
    if (this.spec.op !== "select") {
      // chained after insert/update/delete/upsert => RETURNING list
      this.spec.returning = columns;
    } else {
      this.spec.columns = columns;
      if (opts?.count) this.spec.count = opts.count;
      if (opts?.head) this.spec.head = opts.head;
    }
    return this;
  }

  insert(rows: Record<string, unknown> | Record<string, unknown>[]): this {
    this.spec.op = "insert";
    this.spec.rows = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(patch: Record<string, unknown>): this {
    this.spec.op = "update";
    this.spec.patch = patch;
    return this;
  }

  delete(): this {
    this.spec.op = "delete";
    return this;
  }

  upsert(
    rows: Record<string, unknown> | Record<string, unknown>[],
    opts?: { onConflict?: string }
  ): this {
    this.spec.op = "upsert";
    this.spec.rows = Array.isArray(rows) ? rows : [rows];
    if (opts?.onConflict) this.spec.onConflict = opts.onConflict;
    return this;
  }

  private addFilter(column: string, op: FilterOp, value: unknown, negate = false): this {
    const f: Filter = { column, op, value, negate: negate || undefined };
    this.spec.filters.push(f);
    return this;
  }

  eq(column: string, value: unknown) { return this.addFilter(column, "eq", value); }
  neq(column: string, value: unknown) { return this.addFilter(column, "neq", value); }
  gt(column: string, value: unknown) { return this.addFilter(column, "gt", value); }
  gte(column: string, value: unknown) { return this.addFilter(column, "gte", value); }
  lt(column: string, value: unknown) { return this.addFilter(column, "lt", value); }
  lte(column: string, value: unknown) { return this.addFilter(column, "lte", value); }
  like(column: string, value: unknown) { return this.addFilter(column, "like", value); }
  ilike(column: string, value: unknown) { return this.addFilter(column, "ilike", value); }
  in(column: string, values: unknown[]) { return this.addFilter(column, "in", values); }
  is(column: string, value: unknown) { return this.addFilter(column, "is", value); }
  not(column: string, op: FilterOp, value: unknown) { return this.addFilter(column, op, value, true); }
  filter(column: string, op: string, value: unknown) {
    return this.addFilter(column, op.replace(".", "") as FilterOp, value);
  }
  or(raw: string) {
    (this.spec.orGroups ??= []).push(raw);
    return this;
  }
  match(query: Record<string, unknown>) {
    for (const [k, v] of Object.entries(query)) this.addFilter(k, "eq", v);
    return this;
  }

  order(column: string, opts?: { ascending?: boolean }): this {
    (this.spec.order ??= []).push({ column, ascending: opts?.ascending !== false });
    return this;
  }

  limit(n: number): this {
    this.spec.limit = n;
    return this;
  }

  range(from: number, to: number): this {
    this.spec.rangeFrom = from;
    this.spec.rangeTo = to;
    return this;
  }

  single(): this {
    this.spec.single = true;
    return this;
  }

  maybeSingle(): this {
    this.spec.maybeSingle = true;
    return this;
  }

  private execute(): Promise<QueryResult> {
    if (!this.promise) {
      this.promise = this.executor(this.spec).catch((e) => ({
        data: null,
        error: { message: e instanceof Error ? e.message : String(e) },
      }));
    }
    return this.promise;
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ): Promise<QueryResult | TResult> {
    return this.execute().catch(onrejected);
  }
}

export { EMPTY as EMPTY_RESULT };
