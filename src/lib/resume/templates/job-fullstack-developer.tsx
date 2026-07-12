import type { TemplateProps } from "../types";
import { TechSidebarEngine } from "./engines/tech-sidebar.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobFullstackDeveloperTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-fullstack-developer"] ?? props.doc);
  return TechSidebarEngine({ ...props, doc }, { accent: "#a855f7", sidebarBg: "#2e1065" });
}
