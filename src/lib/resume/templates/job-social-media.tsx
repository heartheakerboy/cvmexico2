import type { TemplateProps } from "../types";
import { CreativeSplitEngine } from "./engines/creative-split.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobSocialMediaTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-social-media"] ?? props.doc);
  return CreativeSplitEngine({ ...props, doc }, { accent: "#e879f9", panelBg: "#a21caf" });
}
