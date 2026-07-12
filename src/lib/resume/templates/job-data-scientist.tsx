import type { TemplateProps } from "../types";
import { TechSidebarEngine } from "./engines/tech-sidebar.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobDataScientistTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-data-scientist"] ?? props.doc);
  return TechSidebarEngine({ ...props, doc }, { accent: "#8b5cf6", sidebarBg: "#1e1b4b" });
}
