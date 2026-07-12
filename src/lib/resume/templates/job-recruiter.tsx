import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobRecruiterTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-recruiter"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#2563eb", headerBg: "#1e3a8a" });
}
