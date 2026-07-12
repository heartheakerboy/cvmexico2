import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobFinancialAnalystTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-financial-analyst"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#1d4ed8", headerBg: "#1e3a5f" });
}
