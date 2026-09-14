import { useState, useEffect } from "react";
import {
  Users,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Globe,
  Calendar,
  FileText,
  Download,
  Sparkles,
  UserCheck,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AudienceFilters,
  evaluateAudience,
  searchUsersForBroadcast,
} from "@/lib/broadcast.functions";
import { toast } from "sonner";

interface AudienceFilterBuilderProps {
  filters: AudienceFilters;
  onChange: (updatedFilters: AudienceFilters) => void;
}

export function AudienceFilterBuilder({
  filters,
  onChange,
}: AudienceFilterBuilderProps) {
  const [calculating, setCalculating] = useState(false);
  const [stats, setStats] = useState<{
    totalEligible: number;
    freeCount: number;
    proCount: number;
    esCount: number;
    enCount: number;
    suppressedCount: number;
    sampleRecipients: any[];
  }>({
    totalEligible: 0,
    freeCount: 0,
    proCount: 0,
    esCount: 0,
    enCount: 0,
    suppressedCount: 0,
    sampleRecipients: [],
  });

  // Manual user search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  // Re-calculate audience when filters change
  useEffect(() => {
    let active = true;
    async function calculate() {
      setCalculating(true);
      try {
        const res = await evaluateAudience({ data: filters });
        if (active) {
          setStats(res);
        }
      } catch (err: any) {
        console.error("Audience calc error:", err);
      } finally {
        if (active) setCalculating(false);
      }
    }

    const timer = setTimeout(calculate, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [filters]);

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await searchUsersForBroadcast({ data: { query: searchQuery.trim() } });
      setSearchResults(results);
    } catch (err: any) {
      toast.error(err.message || "Error searching users");
    } finally {
      setSearching(false);
    }
  }

  function addIndividualUser(u: any) {
    if (selectedUsers.some((x) => x.id === u.id)) return;
    const next = [...selectedUsers, u];
    setSelectedUsers(next);
    onChange({
      ...filters,
      selectedUserIds: next.map((x) => x.id),
    });
    toast.success(`User added: ${u.email}`);
  }

  function removeIndividualUser(id: string) {
    const next = selectedUsers.filter((x) => x.id !== id);
    setSelectedUsers(next);
    onChange({
      ...filters,
      selectedUserIds: next.length > 0 ? next.map((x) => x.id) : undefined,
    });
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col justify-between">
          <div className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center justify-between">
            <span>Eligible Audience</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {calculating ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                stats.totalEligible.toLocaleString("en-US")
              )}
            </span>
            <span className="text-xs text-muted-foreground">recipients</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Plan Breakdown
          </div>
          <div className="mt-2 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Free Users:</span>
              <span className="font-semibold text-foreground">{stats.freeCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pro Subscribers:</span>
              <span className="font-semibold text-primary">{stats.proCount}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Languages</span>
            <Globe className="h-3.5 w-3.5" />
          </div>
          <div className="mt-2 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Spanish (MX):</span>
              <span className="font-semibold text-foreground">{stats.esCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">English:</span>
              <span className="font-semibold text-foreground">{stats.enCount}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col justify-between">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider flex items-center justify-between">
            <span>Suppressed</span>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-amber-700 dark:text-amber-400">
              {stats.suppressedCount}
            </span>
            <span className="text-xs text-muted-foreground">unsubscribes / bounces</span>
          </div>
        </div>
      </div>

      {/* Targeting Filters Form */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-5">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Audience Targeting Filters</h3>
          <span className="text-xs text-muted-foreground ml-auto">
            Combine criteria to target your exact segment
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Plan filter */}
          <div className="space-y-1.5">
            <Label className="text-xs">Subscription Plan</Label>
            <Select
              value={filters.plan || "all"}
              onValueChange={(v) => onChange({ ...filters, plan: v as any })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users (Free & Pro)</SelectItem>
                <SelectItem value="free">Free Users Only</SelectItem>
                <SelectItem value="pro">Pro Subscribers (Premium)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Registration Date Filter */}
          <div className="space-y-1.5">
            <Label className="text-xs">Registration Period</Label>
            <Select
              value={filters.registered || "all"}
              onValueChange={(v) => onChange({ ...filters, registered: v as any })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time (Entire Database)</SelectItem>
                <SelectItem value="today">Registered Today</SelectItem>
                <SelectItem value="week">Registered This Week</SelectItem>
                <SelectItem value="month">Registered This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language filter */}
          <div className="space-y-1.5">
            <Label className="text-xs">Preferred Language</Label>
            <Select
              value={filters.language || "all"}
              onValueChange={(v) => onChange({ ...filters, language: v as any })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Both Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Both (Spanish & English)</SelectItem>
                <SelectItem value="es">Spanish Users Only (Mexico)</SelectItem>
                <SelectItem value="en">English Users Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resume Created filter */}
          <div className="space-y-1.5">
            <Label className="text-xs">Resume Creation Status</Label>
            <Select
              value={filters.createdResume || "all"}
              onValueChange={(v) => onChange({ ...filters, createdResume: v as any })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Status</SelectItem>
                <SelectItem value="yes">Has Created at Least 1 Resume</SelectItem>
                <SelectItem value="no">Has Never Created a Resume</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Downloaded CV filter */}
          <div className="space-y-1.5">
            <Label className="text-xs">Resume Downloads</Label>
            <Select
              value={filters.downloaded || "all"}
              onValueChange={(v) => onChange({ ...filters, downloaded: v as any })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Status</SelectItem>
                <SelectItem value="yes">Has Downloaded (PDF / DOCX)</SelectItem>
                <SelectItem value="no">Has Never Downloaded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Used AI Tools filter */}
          <div className="space-y-1.5">
            <Label className="text-xs">AI Tools Usage</Label>
            <Select
              value={filters.usedAi || "all"}
              onValueChange={(v) => onChange({ ...filters, usedAi: v as any })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Status</SelectItem>
                <SelectItem value="yes">Has Used AI Writer / ATS Scan</SelectItem>
                <SelectItem value="no">Has Never Used AI Features</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset Filters button */}
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() =>
              onChange({
                plan: "all",
                registered: "all",
                language: "all",
                createdResume: "all",
                downloaded: "all",
                usedAi: "all",
              })
            }
          >
            Reset filters to target all users
          </Button>
        </div>
      </div>

      {/* Manual Recipient Selection Section */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Target Specific Individual Users</h3>
          </div>
          {selectedUsers.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedUsers.length} selected
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          To target specific individual users (or send to a test/VIP group), search by name or email:
        </p>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 text-xs"
              placeholder="Search by name or email (e.g. user@example.com)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSearch}
            disabled={searching}
          >
            {searching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Search"}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="p-3 bg-muted/20 border border-border rounded-lg space-y-2 max-h-48 overflow-y-auto">
            <div className="text-[11px] font-semibold text-muted-foreground">Search Results:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {searchResults.map((u) => {
                const isSelected = selectedUsers.some((x) => x.id === u.id);
                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2 rounded bg-card border border-border/70 text-xs"
                  >
                    <div className="truncate pr-2">
                      <div className="font-medium text-foreground truncate">{u.full_name || "No name"}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{u.email}</div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={isSelected ? "secondary" : "outline"}
                      className="h-7 text-xs px-2 shrink-0"
                      onClick={() => (isSelected ? removeIndividualUser(u.id) : addIndividualUser(u))}
                    >
                      {isSelected ? "Remove" : "Add"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Users Chips */}
        {selectedUsers.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <div className="text-xs font-semibold text-muted-foreground">Selected Recipients:</div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-muted/10 border border-border/50 rounded-lg">
              {selectedUsers.map((u) => (
                <span
                  key={u.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                >
                  <span>{u.email}</span>
                  <button
                    type="button"
                    onClick={() => removeIndividualUser(u.id)}
                    className="hover:text-destructive focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recipient Sample Table */}
      {stats.sampleRecipients.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Sample Recipients Preview ({stats.sampleRecipients.length})</h4>
            <span className="text-xs text-muted-foreground">
              First recipients matched by the active filters
            </span>
          </div>

          <div className="overflow-x-auto max-h-56">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Plan</th>
                  <th className="py-2 px-3">Language</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {stats.sampleRecipients.map((r: any) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="py-2 px-3 font-medium text-foreground">{r.name}</td>
                    <td className="py-2 px-3 text-muted-foreground font-mono">{r.email}</td>
                    <td className="py-2 px-3">
                      <Badge variant={r.plan === "pro" ? "default" : "secondary"} className="text-[10px]">
                        {r.plan === "pro" ? "Pro" : "Free"}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground uppercase">{r.language}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
