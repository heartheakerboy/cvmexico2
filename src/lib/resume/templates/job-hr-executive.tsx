import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobHrExecutiveTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-hr-executive"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#0891b2", headerBg: "#164e63" });
}
