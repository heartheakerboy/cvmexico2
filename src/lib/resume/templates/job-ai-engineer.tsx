import type { TemplateProps } from "../types";
import { TechSidebarEngine } from "./engines/tech-sidebar.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobAiEngineerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-ai-engineer"] ?? props.doc);
  return TechSidebarEngine({ ...props, doc }, { accent: "#d946ef", sidebarBg: "#1a0025" });
}
