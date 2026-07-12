import type { TemplateProps } from "../types";
import { CreativeSplitEngine } from "./engines/creative-split.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobCopywriterTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-copywriter"] ?? props.doc);
  return CreativeSplitEngine({ ...props, doc }, { accent: "#f43f5e", panelBg: "#9f1239" });
}
