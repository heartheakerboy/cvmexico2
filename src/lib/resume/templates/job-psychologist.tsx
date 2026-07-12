import type { TemplateProps } from "../types";
import { MedicalTimelineEngine } from "./engines/medical-timeline.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobPsychologistTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-psychologist"] ?? props.doc);
  return MedicalTimelineEngine({ ...props, doc }, { accent: "#7c3aed", headerColor: "#f5f3ff" });
}
