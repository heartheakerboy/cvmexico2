import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { SettingsProvider, useSettings } from "@/lib/settings";
import { getMetaTranslation } from "@/lib/i18n/config";

function NotFoundComponent() {
  return (
    <SettingsProvider>
      <NotFoundContent />
    </SettingsProvider>
  );
}

function NotFoundContent() {
  const { t } = useSettings();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">{t("root.notFound.title")}</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("root.notFound.subtitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("root.notFound.desc")}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("root.notFound.btn")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent(props: { error: Error; reset: () => void }) {
  return (
    <SettingsProvider>
      <ErrorContent {...props} />
    </SettingsProvider>
  );
}

function ErrorContent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useSettings();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t("root.error.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("root.error.desc")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("root.error.btnTry")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("root.error.btnHome")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: getMetaTranslation("root.metaTitle") },
      {
        name: "description",
        content: getMetaTranslation("root.metaDesc"),
      },
      { name: "author", content: "CVAI" },
      { property: "og:site_name", content: "CVAI" },
      { property: "og:title", content: getMetaTranslation("root.metaTitle") },
      {
        property: "og:description",
        content: getMetaTranslation("root.metaOgDesc"),
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Space+Grotesk:wght@500;600;700&display=swap"
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Space+Grotesk:wght@500;600;700&display=swap"
          />
        </noscript>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("access_token=")) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          window.location.replace("/panel");
        }
      });
    }
  }, [router]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED")
        return;
      router.invalidate();
      if (event !== "SIGNED_OUT") {
        queryClient.invalidateQueries();
      }

      if (event === "SIGNED_IN") {
        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          const hasHashToken = window.location.hash.includes("access_token=");
          if (path === "/auth" || hasHashToken) {
            if (hasHashToken) {
              window.location.replace("/panel");
            } else {
              router.navigate({ to: "/panel" });
            }
          }
        }
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster />
      </SettingsProvider>
    </QueryClientProvider>
  );
}
