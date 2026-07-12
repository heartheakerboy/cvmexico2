import type { TemplateProps } from "../types";
import { TechSidebarEngine } from "./engines/tech-sidebar.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobMobileDeveloperTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-mobile-developer"] ?? props.doc);
  return TechSidebarEngine({ ...props, doc }, { accent: "#06b6d4", sidebarBg: "#083344" });
}
