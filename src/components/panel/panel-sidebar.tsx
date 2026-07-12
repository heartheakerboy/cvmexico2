import { Link, useRouterState } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { userNav } from "@/lib/user-nav";
import { useSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

export function PanelSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useSettings();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <Link
        to="/"
        className="flex h-16 items-center gap-1.5 border-b border-sidebar-border px-5 font-display text-xl font-bold tracking-tight"
      >
        CV<span className="text-sidebar-primary">AI</span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {userNav.map((group) => (
          <div key={group.labelKey} className="mb-5">
            <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              {t(group.labelKey)}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.to === "/panel"
                    ? pathname === "/panel"
                    : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
