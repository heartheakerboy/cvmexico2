import type { TemplateProps } from "../types";
import { CreativeSplitEngine } from "./engines/creative-split.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobEventManagerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-event-manager"] ?? props.doc);
  return CreativeSplitEngine({ ...props, doc }, { accent: "#ec4899", panelBg: "#9d174d" });
}
