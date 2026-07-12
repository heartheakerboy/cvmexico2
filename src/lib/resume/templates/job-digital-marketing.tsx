import type { TemplateProps } from "../types";
import { CreativeSplitEngine } from "./engines/creative-split.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobDigitalMarketingTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-digital-marketing"] ?? props.doc);
  return CreativeSplitEngine({ ...props, doc }, { accent: "#2563eb", panelBg: "#1d4ed8" });
}
