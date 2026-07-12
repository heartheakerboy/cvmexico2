import type { TemplateProps } from "../types";
import { CreativeSplitEngine } from "./engines/creative-split.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobPhotographerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-photographer"] ?? props.doc);
  return CreativeSplitEngine({ ...props, doc }, { accent: "#64748b", panelBg: "#1e293b" });
}
