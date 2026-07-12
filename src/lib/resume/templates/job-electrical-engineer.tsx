import type { TemplateProps } from "../types";
import { ExecutiveDualEngine } from "./engines/executive-dual.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobElectricalEngineerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-electrical-engineer"] ?? props.doc);
  return ExecutiveDualEngine({ ...props, doc }, { accent: "#f59e0b" });
}
