import type { TemplateProps } from "../types";
import { TechSidebarEngine } from "./engines/tech-sidebar.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobNetworkEngineerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-network-engineer"] ?? props.doc);
  return TechSidebarEngine({ ...props, doc }, { accent: "#0891b2", sidebarBg: "#0c2340" });
}
