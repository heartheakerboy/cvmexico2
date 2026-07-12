import type { LucideIcon } from "lucide-react";

export function PanelStub({
  title,
  description,
  icon: Icon,
  features = [],
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {features.length > 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f}
              className="rounded-xl border border-border bg-card p-4 text-sm font-medium text-foreground/80"
            >
              {f}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-lg font-semibold">Muy pronto</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Esta sección estará disponible en breve. Estamos afinando cada detalle
          para ofrecerte la mejor experiencia.
        </p>
      </div>
    </div>
  );
}
