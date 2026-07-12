import type { TemplateProps } from "../types";
import { TechSidebarEngine } from "./engines/tech-sidebar.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobDevopsEngineerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-devops-engineer"] ?? props.doc);
  return TechSidebarEngine({ ...props, doc }, { accent: "#f97316", sidebarBg: "#431407" });
}
