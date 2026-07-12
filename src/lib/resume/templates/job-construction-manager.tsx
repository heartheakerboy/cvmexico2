import type { TemplateProps } from "../types";
import { ExecutiveDualEngine } from "./engines/executive-dual.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobConstructionManagerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-construction-manager"] ?? props.doc);
  return ExecutiveDualEngine({ ...props, doc }, { accent: "#d97706" });
}
