import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobDeliveryDriverTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-delivery-driver"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#f97316", headerBg: "#c2410c" });
}
