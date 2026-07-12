import type { TemplateProps } from "../types";
import { MedicalTimelineEngine } from "./engines/medical-timeline.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobDentistTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-dentist"] ?? props.doc);
  return MedicalTimelineEngine({ ...props, doc }, { accent: "#0891b2", headerColor: "#e0f2fe" });
}
