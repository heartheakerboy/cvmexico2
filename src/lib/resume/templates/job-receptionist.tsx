import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobReceptionistTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-receptionist"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#d97706", headerBg: "#92400e" });
}
