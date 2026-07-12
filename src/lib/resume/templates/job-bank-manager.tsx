import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobBankManagerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-bank-manager"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#0f4c81", headerBg: "#0f4c81" });
}
