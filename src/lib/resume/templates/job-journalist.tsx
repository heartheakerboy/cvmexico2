import type { TemplateProps } from "../types";
import { CreativeSplitEngine } from "./engines/creative-split.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobJournalistTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-journalist"] ?? props.doc);
  return CreativeSplitEngine({ ...props, doc }, { accent: "#b45309", panelBg: "#92400e" });
}
