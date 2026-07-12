import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobVirtualAssistantTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-virtual-assistant"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#059669", headerBg: "#064e3b" });
}
