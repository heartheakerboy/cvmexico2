import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { StubPage } from "@/components/admin/stub-page";

export const Route = createFileRoute("/_authenticated/admin/exportaciones")({
  component: () => (
    <StubPage
      title="Exports"
      description="Export platform data."
      icon={Download}
      features={["Users", "Revenue", "Analytics", "AI usage", "Resume data"]}
    />
  ),
});
