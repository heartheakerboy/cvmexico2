import type { TemplateProps } from "../types";
import { CreativeSplitEngine } from "./engines/creative-split.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobSeoSpecialistTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-seo-specialist"] ?? props.doc);
  return CreativeSplitEngine({ ...props, doc }, { accent: "#0f766e", panelBg: "#0f766e" });
}
