import type { TemplateProps } from "../types";
import { MedicalTimelineEngine } from "./engines/medical-timeline.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobPharmacistTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-pharmacist"] ?? props.doc);
  return MedicalTimelineEngine({ ...props, doc }, { accent: "#16a34a", headerColor: "#f0fdf4" });
}
