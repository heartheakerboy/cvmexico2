import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Trash2, ShieldCheck, ScrollText, KeyRound, Users, Fingerprint,
  MonitorSmartphone, Loader2, Copy, Ban, CheckCircle2, Shield, Lock,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/seguridad")({
  component: SecurityAdmin,
});

type RoleRow = { id: string; user_id: string; role: string; created_at: string };
type AuditLog = {
  id: string; action: string; actor_name: string | null; actor_email: string | null;
  entity: string | null; ip_address: string | null; severity: string; details: string | null;
  created_at: string;
};
type ApiKey = {
  id: string; name: string; key_prefix: string; scopes: string;
  last_used_at: string | null; active: boolean; expires_at: string | null; created_at: string;
};

const ROLES = ["admin", "user"] as const;

const PERMISSIONS: { role: string; caps: string[] }[] = [
  { role: "admin", caps: ["Manage users", "Billing", "Settings", "Content", "Security"] },
  { role: "user", caps: ["Create resume", "Download", "Edit profile"] },
];

function severityBadge(s: string) {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    info: "secondary", warning: "outline", critical: "destructive",
  };
  return <Badge variant={map[s] ?? "secondary"}>{s}</Badge>;
}

function roleBadge(r: string) {
  const map: Record<string, "default" | "secondary" | "outline"> = {
    admin: "default", user: "secondary",
  };
  return <Badge variant={map[r] ?? "secondary"}>{r}</Badge>;
}

function Kpi({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function SecurityAdmin() {
  const [roles, setRoles] = useState<RoleRow[] | null>(null);
  const [logs, setLogs] = useState<AuditLog[] | null>(null);
  const [keys, setKeys] = useState<ApiKey[] | null>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("roles");

  const [roleDialog, setRoleDialog] = useState(false);
  const [roleForm, setRoleForm] = useState({ user_id: "", role: "user" });
  const [roleSaving, setRoleSaving] = useState(false);

  const [keyDialog, setKeyDialog] = useState(false);
  const [keyForm, setKeyForm] = useState({ name: "", scopes: "read", active: true });
  const [keySaving, setKeySaving] = useState(false);

  async function load() {
    const [r, l, k] = await Promise.all([
      supabase.from("user_roles").select("*").order("created_at", { ascending: false }),
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }),
      supabase.from("api_keys").select("*").order("created_at", { ascending: false }),
    ]);
    if (r.error) toast.error(r.error.message); else setRoles(r.data as RoleRow[]);
    if (l.error) toast.error(l.error.message); else setLogs(l.data as AuditLog[]);
    if (k.error) toast.error(k.error.message); else setKeys(k.data as ApiKey[]);
  }
  useEffect(() => { load(); }, []);

  const adminCount = useMemo(() => (roles ?? []).filter((r) => r.role === "admin").length, [roles]);
  const criticalCount = useMemo(() => (logs ?? []).filter((l) => l.severity === "critical").length, [logs]);
  const activeKeys = useMemo(() => (keys ?? []).filter((k) => k.active).length, [keys]);

  const filteredLogs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (logs ?? []).filter((l) => {
      if (!q) return true;
      return l.action.toLowerCase().includes(q) || (l.actor_email ?? "").toLowerCase().includes(q)
        || (l.details ?? "").toLowerCase().includes(q);
    });
  }, [logs, query]);

  async function saveRole() {
    if (!roleForm.user_id.trim()) { toast.error("User ID is required"); return; }
    setRoleSaving(true);
    const { error } = await supabase.from("user_roles")
      .insert({ user_id: roleForm.user_id.trim(), role: roleForm.role as "admin" | "user" });
    setRoleSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Role assigned");
    setRoleDialog(false); setRoleForm({ user_id: "", role: "user" }); load();
  }

  async function removeRole(id: string) {
    if (!confirm("Revoke this role?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Role revoked");
    setRoles((r) => (r ?? []).filter((x) => x.id !== id));
  }

  async function clearLog(id: string) {
    const { error } = await supabase.from("audit_logs").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setLogs((r) => (r ?? []).filter((x) => x.id !== id));
  }

  async function saveKey() {
    if (!keyForm.name.trim()) { toast.error("Name is required"); return; }
    setKeySaving(true);
    const prefix = `cvmx_live_${Math.random().toString(36).slice(2, 6)}`;
    const { error } = await supabase.from("api_keys").insert({
      name: keyForm.name.trim(), key_prefix: prefix, scopes: keyForm.scopes, active: keyForm.active,
    });
    setKeySaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Key created: ${prefix}••••`);
    setKeyDialog(false); setKeyForm({ name: "", scopes: "read", active: true }); load();
  }

  async function toggleKey(k: ApiKey) {
    const { error } = await supabase.from("api_keys").update({ active: !k.active }).eq("id", k.id);
    if (error) { toast.error(error.message); return; }
    setKeys((r) => (r ?? []).map((x) => x.id === k.id ? { ...x, active: !x.active } : x));
  }

  async function removeKey(id: string) {
    if (!confirm("Delete this API key? It will stop working immediately.")) return;
    const { error } = await supabase.from("api_keys").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Key deleted");
    setKeys((r) => (r ?? []).filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Security</h1>
        <p className="text-sm text-muted-foreground">Roles, audit logs, 2FA, and sessions.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={ShieldCheck} label="Administrators" value={adminCount.toString()} />
        <Kpi icon={ScrollText} label="Critical events" value={criticalCount.toString()} />
        <Kpi icon={KeyRound} label="Active API keys" value={activeKeys.toString()} />
        <Kpi icon={Users} label="Assigned roles" value={(roles?.length ?? 0).toString()} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="2fa">2FA</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
        </TabsList>

        {/* ROLES */}
        <TabsContent value="roles" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Roles assigned to users.</p>
            <Button onClick={() => setRoleDialog(true)}><Plus className="mr-1 h-4 w-4" /> Assign role</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User (ID)</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles === null ? (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : roles.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    No assigned roles</TableCell></TableRow>
                ) : roles.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.user_id}</TableCell>
                    <TableCell>{roleBadge(r.role)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmt(r.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeRole(r.id)} title="Revoke">
                        <Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* PERMISSIONS */}
        <TabsContent value="permissions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {PERMISSIONS.map((p) => (
              <div key={p.role} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium capitalize">{p.role}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.caps.map((c) => (
                    <span key={c} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Permissions are derived from the role using the secure function <code>has_role</code>.
          </p>
        </TabsContent>

        {/* AUDIT */}
        <TabsContent value="audit" className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search audit logs…" value={query}
              onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs === null ? (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No events</TableCell></TableRow>
                ) : filteredLogs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>
                      <div className="font-mono text-xs">{l.action}</div>
                      <div className="max-w-md truncate text-xs text-muted-foreground">{l.details}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{l.actor_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{l.actor_email ?? ""}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{l.ip_address ?? "—"}</TableCell>
                    <TableCell>{severityBadge(l.severity)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmt(l.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => clearLog(l.id)} title="Delete">
                        <Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* 2FA */}
        <TabsContent value="2fa" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Fingerprint className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h2 className="font-display text-lg font-semibold">Two-Factor Authentication</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Require a second factor for team accounts to enforce secure access.
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div className="flex items-center gap-2 text-sm"><Lock className="h-4 w-4" /> Require 2FA for administrators</div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div className="flex items-center gap-2 text-sm"><Lock className="h-4 w-4" /> Authenticator App (TOTP)</div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div className="flex items-center gap-2 text-sm"><Lock className="h-4 w-4" /> SMS verification codes</div>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* SESSIONS */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { d: "Chrome · macOS", loc: "Mexico City, MX", ip: "187.190.12.4", cur: true },
                  { d: "Safari · iPhone", loc: "Guadalajara, MX", ip: "201.145.9.88", cur: false },
                  { d: "Edge · Windows", loc: "Monterrey, MX", ip: "189.203.4.7", cur: false },
                ].map((s) => (
                  <TableRow key={s.ip}>
                    <TableCell className="flex items-center gap-2 text-sm">
                      <MonitorSmartphone className="h-4 w-4 text-muted-foreground" /> {s.d}</TableCell>
                    <TableCell className="text-sm">{s.loc}</TableCell>
                    <TableCell className="font-mono text-xs">{s.ip}</TableCell>
                    <TableCell>
                      {s.cur ? <Badge>Current</Badge> : <Badge variant="secondary">Active</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground">Reference view of active sessions.</p>
        </TabsContent>

        {/* API KEYS */}
        <TabsContent value="keys" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Keys for external integrations.</p>
            <Button onClick={() => setKeyDialog(true)}><Plus className="mr-1 h-4 w-4" /> New API key</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys === null ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                ) : keys.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No API keys</TableCell></TableRow>
                ) : keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell>
                      <button
                        className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => { navigator.clipboard.writeText(k.key_prefix); toast.success("Prefix copied"); }}
                      >
                        {k.key_prefix}•••• <Copy className="h-3 w-3" />
                      </button>
                    </TableCell>
                    <TableCell><Badge variant="outline">{k.scopes}</Badge></TableCell>
                    <TableCell><Switch checked={k.active} onCheckedChange={() => toggleKey(k)} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => toggleKey(k)} title={k.active ? "Revoke" : "Activate"}>
                        {k.active ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}</Button>
                      <Button variant="ghost" size="icon" onClick={() => removeKey(k.id)}>
                        <Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Assign role dialog */}
      <Dialog open={roleDialog} onOpenChange={setRoleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Assign Role</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input placeholder="User UUID" value={roleForm.user_id}
                onChange={(e) => setRoleForm({ ...roleForm, user_id: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={roleForm.role} onValueChange={(v) => setRoleForm({ ...roleForm, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialog(false)}>Cancel</Button>
            <Button onClick={saveRole} disabled={roleSaving}>
              {roleSaving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New API key dialog */}
      <Dialog open={keyDialog} onOpenChange={setKeyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New API Key</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={keyForm.name} onChange={(e) => setKeyForm({ ...keyForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <Select value={keyForm.scopes} onValueChange={(v) => setKeyForm({ ...keyForm, scopes: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read only</SelectItem>
                  <SelectItem value="read,write">Read and write</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label>Active</Label>
              <Switch checked={keyForm.active} onCheckedChange={(v) => setKeyForm({ ...keyForm, active: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKeyDialog(false)}>Cancel</Button>
            <Button onClick={saveKey} disabled={keySaving}>
              {keySaving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
