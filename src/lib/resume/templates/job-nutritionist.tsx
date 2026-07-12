import type { TemplateProps } from "../types";
import { MedicalTimelineEngine } from "./engines/medical-timeline.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobNutritionistTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-nutritionist"] ?? props.doc);
  return MedicalTimelineEngine({ ...props, doc }, { accent: "#84cc16", headerColor: "#f7fee7" });
}
