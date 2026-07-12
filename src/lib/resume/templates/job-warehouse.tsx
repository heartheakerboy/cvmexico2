import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobWarehouseTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-warehouse"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#0f766e", headerBg: "#134e4a" });
}
