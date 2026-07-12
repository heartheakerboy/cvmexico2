import type { TemplateProps } from "../types";
import { CreativeSplitEngine } from "./engines/creative-split.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobVideoEditorTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-video-editor"] ?? props.doc);
  return CreativeSplitEngine({ ...props, doc }, { accent: "#f97316", panelBg: "#c2410c" });
}
