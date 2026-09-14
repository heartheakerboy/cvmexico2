import { createFileRoute, redirect } from "@tanstack/react-router";

const GUIDE_REDIRECT_TARGETS: Record<string, string> = {
  "como-hacer-un-cv": "/blog/como-hacer-un-curriculum-vitae-mexico",
  "cv-sin-experiencia": "/blog/10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos",
  "cv-ats": "/blog/que-es-un-curriculum-ats-como-hacer-cv-compatible",
};

export const Route = createFileRoute("/guias/$slug")({
  beforeLoad: ({ params }) => {
    const destination = GUIDE_REDIRECT_TARGETS[params.slug] || "/blog";
    throw redirect({
      href: destination,
      statusCode: 301,
    });
  },
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: () => null,
});