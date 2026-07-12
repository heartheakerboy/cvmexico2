import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobSecurityGuardTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-security-guard"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#374151", headerBg: "#1f2937" });
}
