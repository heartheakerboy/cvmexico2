import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobCallCenterTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-call-center"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#7c3aed", headerBg: "#4c1d95" });
}
