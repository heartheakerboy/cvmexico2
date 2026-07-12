import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettings } from "@/lib/settings";
import { ENABLED_LOCALES, getLocaleMeta } from "@/lib/i18n/config";

export function LanguageSwitcher({
  variant = "ghost",
  showLabel = false,
}: {
  variant?: "ghost" | "outline";
  showLabel?: boolean;
}) {
  const { lang, setLang, t } = useSettings();
  const current = getLocaleMeta(lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={showLabel ? "sm" : "icon"}
          className="gap-1.5"
          aria-label={t("lang.switch")}
        >
          <Globe className="h-4 w-4" />
          {showLabel ? (
            <span className="hidden sm:inline">
              {current.flag} {current.label}
            </span>
          ) : (
            <span aria-hidden>{current.flag}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("lang.choose")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ENABLED_LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className="flex items-center gap-2"
          >
            <span className="text-base" aria-hidden>
              {l.flag}
            </span>
            <span className="flex-1">{l.label}</span>
            {lang === l.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}