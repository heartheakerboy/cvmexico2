import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function TextField({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function AreaField({
  label, value, onChange, placeholder, rows = 3,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

// Generic editor for an array of objects.
export function ArrayEditor<T>({
  items, onChange, blank, render, addLabel,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  blank: T;
  addLabel: string;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border p-3">
          <div className="mb-2 flex justify-end">
            <button
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {render(item, (patch) =>
            onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it))),
          )}
        </div>
      ))}
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onChange([...items, { ...blank }])}>
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </Button>
    </div>
  );
}

export function TagEditor({
  items, onChange, placeholder,
}: { items: string[]; onChange: (next: string[]) => void; placeholder: string }) {
  return (
    <div>
      <Input
        placeholder={placeholder}
        onKeyDown={(e) => {
          const v = (e.target as HTMLInputElement).value.trim();
          if (e.key === "Enter" && v) {
            e.preventDefault();
            onChange([...items, v]);
            (e.target as HTMLInputElement).value = "";
          }
        }}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((s, i) => (
          <span key={i} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            {s}
            <button onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Trash2 className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export { GripVertical };