import type { TemplateProps } from "../types";
import { TechSidebarEngine } from "./engines/tech-sidebar.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobItSupportTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-it-support"] ?? props.doc);
  return TechSidebarEngine({ ...props, doc }, { accent: "#64748b", sidebarBg: "#1e293b" });
}
