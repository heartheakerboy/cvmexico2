import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

export function StubPage({
  title,
  description,
  icon: Icon = Sparkles,
  features = [],
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  features?: string[];
}) {
  return (
    <div>
      <h1 className="font-display text-xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-lg font-semibold">Module in preparation</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          This section is already in the navigation. Once activated, it will include:
        </p>
        {features.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {features.map((f) => (
              <span
                key={f}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}