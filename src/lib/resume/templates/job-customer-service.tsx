import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobCustomerServiceTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-customer-service"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#0d9488", headerBg: "#134e4a" });
}
