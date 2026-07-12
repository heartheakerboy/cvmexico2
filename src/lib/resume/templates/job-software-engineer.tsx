import type { TemplateProps } from "../types";
import { TechSidebarEngine } from "./engines/tech-sidebar.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobSoftwareEngineerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-software-engineer"] ?? props.doc);
  return TechSidebarEngine({ ...props, doc }, { accent: "#0ea5e9", sidebarBg: "#0f172a" });
}
