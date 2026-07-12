import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobFactoryWorkerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-factory-worker"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#b45309", headerBg: "#78350f" });
}
