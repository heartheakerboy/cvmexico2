import type { TemplateProps } from "../types";
import { MedicalTimelineEngine } from "./engines/medical-timeline.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobMedicalAssistantTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-medical-assistant"] ?? props.doc);
  return MedicalTimelineEngine({ ...props, doc }, { accent: "#06b6d4", headerColor: "#ecfeff" });
}
