import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Crown, Gift, ShieldCheck, MoreHorizontal, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_authenticated/admin/usuarios")({
  component: UsersPage,
});

type UserRow = {
  id: string;
  full_name: string | null;
  plan: string;
  created_at: string;
  isAdmin: boolean;
};

const PAGE_SIZE = 10;

function UsersPage() {
  const [rows, setRows] = useState<UserRow[] | null>(null);
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | "free" | "pro">("all");
  const [page, setPage] = useState(0);

  async function load() {
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, plan, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const adminIds = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));
    setRows(
      (profiles ?? []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        plan: p.plan,
        created_at: p.created_at,
        isAdmin: adminIds.has(p.id),
      })),
    );
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    return rows.filter((r) => {
      const matchesPlan = planFilter === "all" || r.plan === planFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q || (r.full_name ?? "").toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
      return matchesPlan && matchesQuery;
    });
  }, [rows, query, planFilter]);

  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  async function setPlan(id: string, plan: "free" | "pro") {
    const { error } = await supabase.from("profiles").update({ plan }).eq("id", id);
    if (error) return toast.error("Could not update plan");
    toast.success(plan === "pro" ? "Premium enabled" : "Premium removed");
    load();
  }

  async function setAdmin(id: string, makeAdmin: boolean) {
    if (makeAdmin) {
      const { error } = await supabase.from("user_roles").insert({ user_id: id, role: "admin" });
      if (error) return toast.error("Could not assign admin");
      toast.success("Admin role assigned");
    } else {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", id)
        .eq("role", "admin");
      if (error) return toast.error("Could not remove admin");
      toast.success("Admin role removed");
    }
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-display text-xl font-bold">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows ? `${rows.length} registered users` : "Loading…"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search by name or ID…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
          {(["all", "free", "pro"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setPlanFilter(f);
                setPage(0);
              }}
              className={`rounded px-3 py-1 text-xs font-medium capitalize transition-colors ${
                planFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        {!rows ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : pageRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">No users found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="font-medium">{u.full_name || "No name"}</div>
                    <div className="text-xs text-muted-foreground">{u.id.slice(0, 8)}…</div>
                  </TableCell>
                  <TableCell>
                    {u.plan === "pro" ? (
                      <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15">
                        <Crown className="h-3 w-3" /> Pro
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Gift className="h-3 w-3" /> Free
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {u.isAdmin ? (
                      <Badge className="gap-1 bg-accent/15 text-accent hover:bg-accent/15">
                        <ShieldCheck className="h-3 w-3" /> Admin
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">User</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {u.plan === "pro" ? (
                          <DropdownMenuItem onClick={() => setPlan(u.id, "free")}>
                            Remove Premium
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => setPlan(u.id, "pro")}>
                            Give Premium
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {u.isAdmin ? (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setAdmin(u.id, false)}
                          >
                            Remove admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => setAdmin(u.id, true)}>
                            Make admin
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {filtered.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}