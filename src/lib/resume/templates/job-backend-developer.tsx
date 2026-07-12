import type { TemplateProps } from "../types";
import { TechSidebarEngine } from "./engines/tech-sidebar.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobBackendDeveloperTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-backend-developer"] ?? props.doc);
  return TechSidebarEngine({ ...props, doc }, { accent: "#22c55e", sidebarBg: "#052e16" });
}
