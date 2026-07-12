import type { TemplateProps } from "../types";
import { CreativeSplitEngine } from "./engines/creative-split.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobContentWriterTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-content-writer"] ?? props.doc);
  return CreativeSplitEngine({ ...props, doc }, { accent: "#84cc16", panelBg: "#3f6212" });
}
