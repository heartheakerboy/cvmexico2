import type { TemplateProps } from "../types";
import { MedicalTimelineEngine } from "./engines/medical-timeline.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobVeterinarianTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-veterinarian"] ?? props.doc);
  return MedicalTimelineEngine({ ...props, doc }, { accent: "#65a30d", headerColor: "#f7fee7" });
}
