import { useState } from "react";
import {
  AlertTriangle,
  Send,
  Users,
  Calendar,
  Globe,
  Mail,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CampaignSafetyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignName: string;
  subject: string;
  recipientsCount: number;
  language: string;
  scheduledAt?: string | null;
  duplicateWarning?: string | null;
  onConfirm: () => Promise<void>;
}

export function CampaignSafetyModal({
  open,
  onOpenChange,
  campaignName,
  subject,
  recipientsCount,
  language,
  scheduledAt,
  duplicateWarning,
  onConfirm,
}: CampaignSafetyModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Send className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-lg font-bold">
            Confirmar Envío de Campaña
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground">
            Por favor revisa el resumen final antes de despachar los correos.
          </DialogDescription>
        </DialogHeader>

        {/* Duplicate Warning Alert if audience received a campaign recently */}
        {duplicateWarning && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-start gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong className="block font-semibold">Aviso de Frecuencia de Envíos:</strong>
              {duplicateWarning}
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5 text-xs">
          <div className="flex justify-between border-b border-border/60 pb-2">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Campaña:
            </span>
            <span className="font-semibold text-foreground text-right">{campaignName}</span>
          </div>

          <div className="flex justify-between border-b border-border/60 pb-2">
            <span className="text-muted-foreground">Asunto:</span>
            <span className="font-medium text-foreground text-right truncate max-w-[200px]">
              {subject}
            </span>
          </div>

          <div className="flex justify-between border-b border-border/60 pb-2">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Destinatarios:
            </span>
            <span className="font-bold text-primary">{recipientsCount.toLocaleString("es-MX")} usuarios</span>
          </div>

          <div className="flex justify-between border-b border-border/60 pb-2">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" /> Idioma:
            </span>
            <span className="font-medium text-foreground capitalize">
              {language === "both" ? "Español e Inglés" : language === "es" ? "Español (MX)" : "Inglés"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Entrega:
            </span>
            <span className="font-semibold text-foreground">
              {scheduledAt ? `Programado (${scheduledAt})` : "Inmediata (Lotes en segundo plano)"}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground bg-secondary/40 p-2.5 rounded-lg border border-border/40 flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Los usuarios en la lista de exclusión o que hayan solicitado baja voluntaria serán omitidos automáticamente.
          </span>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="gap-2 font-semibold"
            onClick={handleConfirm}
            disabled={loading || recipientsCount === 0}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Confirmar y Enviar Campaña
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
