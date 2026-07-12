import type { TemplateProps } from "../types";
import { MedicalTimelineEngine } from "./engines/medical-timeline.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobFitnessTrainerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-fitness-trainer"] ?? props.doc);
  return MedicalTimelineEngine({ ...props, doc }, { accent: "#f59e0b", headerColor: "#fffbeb" });
}
