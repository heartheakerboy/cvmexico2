import type { ResumeDoc } from "./types";
import { JOB_SAMPLES } from "./job-samples";
import {
  softwareEngineerSample, nurseSample, accountantSample, lawyerSample,
  architectSample, graphicDesignerSample, salesExecutiveSample,
  projectManagerSample, hrManagerSample, teacherSample,
} from "./industry-samples";
import {
  studentSample, fresherSample, internshipSample, entryLevelSample,
  midLevelSample, seniorSample, executiveSample, ceoSample,
  freelancerSample, governmentSample,
} from "./stage-samples";

const STAGE_MAP: Record<string, ResumeDoc> = {
  "stage-student": studentSample,
  "stage-fresher": fresherSample,
  "stage-internship": internshipSample,
  "stage-entry-level": entryLevelSample,
  "stage-mid-level": midLevelSample,
  "stage-senior": seniorSample,
  "stage-executive": executiveSample,
  "stage-ceo": ceoSample,
  "stage-freelancer": freelancerSample,
  "stage-government": governmentSample,
  "student-simple": studentSample,
  "student-timeline": studentSample,
  "student-fresh": fresherSample,
  "student-success": fresherSample,
  "professional-plus": midLevelSample,
  "premium-executive": executiveSample,
  "corporate-accountant": accountantSample,
  "executive-lawyer": lawyerSample,
  "creative-architect": architectSample,
  "creative-graphic-designer": graphicDesignerSample,
  "sales-executive-results": salesExecutiveSample,
  "corporate-hr-manager": hrManagerSample,
  "tech-software-engineer": softwareEngineerSample,
  "health-nurse": nurseSample,
  "education-teacher": teacherSample,
  "executive-project-manager": projectManagerSample,
};

export function getSampleDocForTemplate(templateId: string): ResumeDoc {
  if (templateId in STAGE_MAP) {
    return STAGE_MAP[templateId];
  }
  if (templateId in JOB_SAMPLES) {
    return JOB_SAMPLES[templateId];
  }
  return softwareEngineerSample;
}
