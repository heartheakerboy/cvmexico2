import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sales-executive-results-template")({
  beforeLoad: () => {
    throw redirect({ to: "/sales-executive-resume-template" });
  },
});
