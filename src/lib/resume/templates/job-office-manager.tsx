import type { TemplateProps } from "../types";
import { CorporateSingleEngine } from "./engines/corporate-single.engine";
import { JOB_SAMPLES } from "../job-samples";

export default function JobOfficeManagerTemplate(props: TemplateProps) {
  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES["job-office-manager"] ?? props.doc);
  return CorporateSingleEngine({ ...props, doc }, { accent: "#4f46e5", headerBg: "#312e81" });
}
