import type { TemplateProps } from "../types";
import { ExecutiveDualEngine } from "./engines/executive-dual.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobLogisticsTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-logistics"] ?? props.doc);
  return ExecutiveDualEngine({ ...props, doc }, { accent: "#0f766e" });
}
