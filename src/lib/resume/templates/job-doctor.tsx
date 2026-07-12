import type { TemplateProps } from "../types";
import { MedicalTimelineEngine } from "./engines/medical-timeline.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobDoctorTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-doctor"] ?? props.doc);
  return MedicalTimelineEngine({ ...props, doc }, { accent: "#0d9488", headerColor: "#f0fdfa" });
}
