export const DEDICATED_TEMPLATE_ROUTES: Record<string, string> = {
  "tech-software-engineer": "/software-engineer-resume-template",
  "corporate-accountant": "/accountant-resume-template",
  "sales-executive-results": "/sales-executive-resume-template",
  "stage-student": "/student-resume-template",
  "stage-fresher": "/fresher-resume-template",
  "stage-internship": "/internship-resume-template",
  "stage-entry-level": "/entry-level-resume-template",
  "stage-mid-level": "/mid-level-resume-template",
  "stage-senior": "/senior-professional-resume-template",
  "stage-executive": "/executive-resume-template",
  "stage-ceo": "/ceo-resume-template",
  "stage-freelancer": "/freelancer-resume-template",
  "stage-government": "/government-resume-template",
  "health-nurse": "/nurse-resume-template",
  "creative-architect": "/architect-resume-template",
  "creative-graphic-designer": "/graphic-designer-resume-template",
  "executive-project-manager": "/project-manager-resume-template",
  "executive-lawyer": "/lawyer-resume-template",
  "corporate-hr-manager": "/hr-manager-resume-template",
  "education-teacher": "/teacher-resume-template",
};

export function getTemplateUrl(templateId: string): string {
  if (DEDICATED_TEMPLATE_ROUTES[templateId]) {
    return DEDICATED_TEMPLATE_ROUTES[templateId];
  }
  return `/plantillas/${templateId}`;
}
