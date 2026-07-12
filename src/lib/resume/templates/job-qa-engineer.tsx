import type { TemplateProps } from "../types";
import { TechSidebarEngine } from "./engines/tech-sidebar.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobQaEngineerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-qa-engineer"] ?? props.doc);
  return TechSidebarEngine({ ...props, doc }, { accent: "#f59e0b", sidebarBg: "#1c0d00" });
}
