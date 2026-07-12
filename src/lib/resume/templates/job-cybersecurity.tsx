import type { TemplateProps } from "../types";
import { TechSidebarEngine } from "./engines/tech-sidebar.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobCybersecurityTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-cybersecurity"] ?? props.doc);
  return TechSidebarEngine({ ...props, doc }, { accent: "#ef4444", sidebarBg: "#450a0a" });
}
