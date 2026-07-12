import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </section>
      <main className="mx-auto max-w-6xl px-4 py-14">{children}</main>
      <SiteFooter />
    </div>
  );
}