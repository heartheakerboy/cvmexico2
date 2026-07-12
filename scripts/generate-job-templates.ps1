
# Script to generate all remaining job template wrapper files with proper function names
$baseDir = "g:\CV Mexicano Pro\src\lib\resume\templates"

$templates = @(
  @("job-frontend-developer",   "JobFrontendDeveloperTemplate",   "TechSidebarEngine",    "tech-sidebar",      '#f59e0b', ', sidebarBg: "#1c1917"'),
  @("job-backend-developer",    "JobBackendDeveloperTemplate",    "TechSidebarEngine",    "tech-sidebar",      '#22c55e', ', sidebarBg: "#052e16"'),
  @("job-fullstack-developer",  "JobFullstackDeveloperTemplate",  "TechSidebarEngine",    "tech-sidebar",      '#a855f7', ', sidebarBg: "#2e1065"'),
  @("job-mobile-developer",     "JobMobileDeveloperTemplate",     "TechSidebarEngine",    "tech-sidebar",      '#06b6d4', ', sidebarBg: "#083344"'),
  @("job-devops-engineer",      "JobDevopsEngineerTemplate",      "TechSidebarEngine",    "tech-sidebar",      '#f97316', ', sidebarBg: "#431407"'),
  @("job-cloud-engineer",       "JobCloudEngineerTemplate",       "TechSidebarEngine",    "tech-sidebar",      '#38bdf8', ', sidebarBg: "#0c2340"'),
  @("job-cybersecurity",        "JobCybersecurityTemplate",       "TechSidebarEngine",    "tech-sidebar",      '#ef4444', ', sidebarBg: "#450a0a"'),
  @("job-data-analyst",         "JobDataAnalystTemplate",         "TechSidebarEngine",    "tech-sidebar",      '#3b82f6', ', sidebarBg: "#1e1b4b"'),
  @("job-data-scientist",       "JobDataScientistTemplate",       "TechSidebarEngine",    "tech-sidebar",      '#8b5cf6', ', sidebarBg: "#1e1b4b"'),
  @("job-ai-engineer",          "JobAiEngineerTemplate",          "TechSidebarEngine",    "tech-sidebar",      '#d946ef', ', sidebarBg: "#1a0025"'),
  @("job-ml-engineer",          "JobMlEngineerTemplate",          "TechSidebarEngine",    "tech-sidebar",      '#10b981', ', sidebarBg: "#022c22"'),
  @("job-qa-engineer",          "JobQaEngineerTemplate",          "TechSidebarEngine",    "tech-sidebar",      '#f59e0b', ', sidebarBg: "#1c0d00"'),
  @("job-it-support",           "JobItSupportTemplate",           "TechSidebarEngine",    "tech-sidebar",      '#64748b', ', sidebarBg: "#1e293b"'),
  @("job-network-engineer",     "JobNetworkEngineerTemplate",     "TechSidebarEngine",    "tech-sidebar",      '#0891b2', ', sidebarBg: "#0c2340"'),
  @("job-ui-designer",          "JobUiDesignerTemplate",          "CreativeSplitEngine",  "creative-split",    '#e11d48', ', panelBg: "#be123c"'),
  @("job-ux-designer",          "JobUxDesignerTemplate",          "CreativeSplitEngine",  "creative-split",    '#7c3aed', ', panelBg: "#5b21b6"'),
  @("job-product-designer",     "JobProductDesignerTemplate",     "CreativeSplitEngine",  "creative-split",    '#0ea5e9', ', panelBg: "#0369a1"'),
  @("job-video-editor",         "JobVideoEditorTemplate",         "CreativeSplitEngine",  "creative-split",    '#f97316', ', panelBg: "#c2410c"'),
  @("job-content-writer",       "JobContentWriterTemplate",       "CreativeSplitEngine",  "creative-split",    '#84cc16', ', panelBg: "#3f6212"'),
  @("job-copywriter",           "JobCopywriterTemplate",          "CreativeSplitEngine",  "creative-split",    '#f43f5e', ', panelBg: "#9f1239"'),
  @("job-seo-specialist",       "JobSeoSpecialistTemplate",       "CreativeSplitEngine",  "creative-split",    '#0f766e', ', panelBg: "#0f766e"'),
  @("job-digital-marketing",    "JobDigitalMarketingTemplate",    "CreativeSplitEngine",  "creative-split",    '#2563eb', ', panelBg: "#1d4ed8"'),
  @("job-social-media",         "JobSocialMediaTemplate",         "CreativeSplitEngine",  "creative-split",    '#e879f9', ', panelBg: "#a21caf"'),
  @("job-photographer",         "JobPhotographerTemplate",        "CreativeSplitEngine",  "creative-split",    '#64748b', ', panelBg: "#1e293b"'),
  @("job-journalist",           "JobJournalistTemplate",          "CreativeSplitEngine",  "creative-split",    '#b45309', ', panelBg: "#92400e"'),
  @("job-event-manager",        "JobEventManagerTemplate",        "CreativeSplitEngine",  "creative-split",    '#ec4899', ', panelBg: "#9d174d"'),
  @("job-financial-analyst",    "JobFinancialAnalystTemplate",    "CorporateSingleEngine","corporate-single",  '#1d4ed8', ', headerBg: "#1e3a5f"'),
  @("job-bank-manager",         "JobBankManagerTemplate",         "CorporateSingleEngine","corporate-single",  '#0f4c81', ', headerBg: "#0f4c81"'),
  @("job-legal-assistant",      "JobLegalAssistantTemplate",      "CorporateSingleEngine","corporate-single",  '#374151', ', headerBg: "#1f2937"'),
  @("job-hr-executive",         "JobHrExecutiveTemplate",         "CorporateSingleEngine","corporate-single",  '#0891b2', ', headerBg: "#164e63"'),
  @("job-recruiter",            "JobRecruiterTemplate",           "CorporateSingleEngine","corporate-single",  '#2563eb', ', headerBg: "#1e3a8a"'),
  @("job-customer-service",     "JobCustomerServiceTemplate",     "CorporateSingleEngine","corporate-single",  '#0d9488', ', headerBg: "#134e4a"'),
  @("job-call-center",          "JobCallCenterTemplate",          "CorporateSingleEngine","corporate-single",  '#7c3aed', ', headerBg: "#4c1d95"'),
  @("job-receptionist",         "JobReceptionistTemplate",        "CorporateSingleEngine","corporate-single",  '#d97706', ', headerBg: "#92400e"'),
  @("job-admin-assistant",      "JobAdminAssistantTemplate",      "CorporateSingleEngine","corporate-single",  '#1d4ed8', ', headerBg: "#1e3a5f"'),
  @("job-office-manager",       "JobOfficeManagerTemplate",       "CorporateSingleEngine","corporate-single",  '#4f46e5', ', headerBg: "#312e81"'),
  @("job-virtual-assistant",    "JobVirtualAssistantTemplate",    "CorporateSingleEngine","corporate-single",  '#059669', ', headerBg: "#064e3b"'),
  @("job-security-guard",       "JobSecurityGuardTemplate",       "CorporateSingleEngine","corporate-single",  '#374151', ', headerBg: "#1f2937"'),
  @("job-factory-worker",       "JobFactoryWorkerTemplate",       "CorporateSingleEngine","corporate-single",  '#b45309', ', headerBg: "#78350f"'),
  @("job-warehouse",            "JobWarehouseTemplate",           "CorporateSingleEngine","corporate-single",  '#0f766e', ', headerBg: "#134e4a"'),
  @("job-delivery-driver",      "JobDeliveryDriverTemplate",      "CorporateSingleEngine","corporate-single",  '#f97316', ', headerBg: "#c2410c"'),
  @("job-doctor",               "JobDoctorTemplate",              "MedicalTimelineEngine","medical-timeline",  '#0d9488', ', headerColor: "#f0fdfa"'),
  @("job-medical-assistant",    "JobMedicalAssistantTemplate",    "MedicalTimelineEngine","medical-timeline",  '#06b6d4', ', headerColor: "#ecfeff"'),
  @("job-dentist",              "JobDentistTemplate",             "MedicalTimelineEngine","medical-timeline",  '#0891b2', ', headerColor: "#e0f2fe"'),
  @("job-pharmacist",           "JobPharmacistTemplate",          "MedicalTimelineEngine","medical-timeline",  '#16a34a', ', headerColor: "#f0fdf4"'),
  @("job-psychologist",         "JobPsychologistTemplate",        "MedicalTimelineEngine","medical-timeline",  '#7c3aed', ', headerColor: "#f5f3ff"'),
  @("job-counselor",            "JobCounselorTemplate",           "MedicalTimelineEngine","medical-timeline",  '#0d9488', ', headerColor: "#f0fdfa"'),
  @("job-veterinarian",         "JobVeterinarianTemplate",        "MedicalTimelineEngine","medical-timeline",  '#65a30d', ', headerColor: "#f7fee7"'),
  @("job-fitness-trainer",      "JobFitnessTrainerTemplate",      "MedicalTimelineEngine","medical-timeline",  '#f59e0b', ', headerColor: "#fffbeb"'),
  @("job-nutritionist",         "JobNutritionistTemplate",        "MedicalTimelineEngine","medical-timeline",  '#84cc16', ', headerColor: "#f7fee7"'),
  @("job-sales-manager",        "JobSalesManagerTemplate",        "ExecutiveDualEngine",  "executive-dual",    '#dc2626', ''),
  @("job-business-development", "JobBusinessDevelopmentTemplate", "ExecutiveDualEngine",  "executive-dual",    '#0f766e', ''),
  @("job-professor",            "JobProfessorTemplate",           "ExecutiveDualEngine",  "executive-dual",    '#1d4ed8', ''),
  @("job-school-principal",     "JobSchoolPrincipalTemplate",     "ExecutiveDualEngine",  "executive-dual",    '#7c3aed', ''),
  @("job-civil-engineer",       "JobCivilEngineerTemplate",       "ExecutiveDualEngine",  "executive-dual",    '#b45309', ''),
  @("job-mechanical-engineer",  "JobMechanicalEngineerTemplate",  "ExecutiveDualEngine",  "executive-dual",    '#374151', ''),
  @("job-electrical-engineer",  "JobElectricalEngineerTemplate",  "ExecutiveDualEngine",  "executive-dual",    '#f59e0b', ''),
  @("job-construction-manager", "JobConstructionManagerTemplate", "ExecutiveDualEngine",  "executive-dual",    '#d97706', ''),
  @("job-consultant",           "JobConsultantTemplate",          "ExecutiveDualEngine",  "executive-dual",    '#0f4c81', ''),
  @("job-entrepreneur",         "JobEntrepreneurTemplate",        "ExecutiveDualEngine",  "executive-dual",    '#f97316', ''),
  @("job-real-estate",          "JobRealEstateTemplate",          "ExecutiveDualEngine",  "executive-dual",    '#16a34a', ''),
  @("job-hotel-manager",        "JobHotelManagerTemplate",        "ExecutiveDualEngine",  "executive-dual",    '#d97706', ''),
  @("job-restaurant-manager",   "JobRestaurantManagerTemplate",   "ExecutiveDualEngine",  "executive-dual",    '#b45309', ''),
  @("job-chef",                 "JobChefTemplate",                "ExecutiveDualEngine",  "executive-dual",    '#dc2626', ''),
  @("job-retail-associate",     "JobRetailAssociateTemplate",     "ExecutiveDualEngine",  "executive-dual",    '#7c3aed', ''),
  @("job-store-manager",        "JobStoreManagerTemplate",        "ExecutiveDualEngine",  "executive-dual",    '#0f4c81', ''),
  @("job-logistics",            "JobLogisticsTemplate",           "ExecutiveDualEngine",  "executive-dual",    '#0f766e', ''),
  @("job-electrician",          "JobElectricianTemplate",         "ExecutiveDualEngine",  "executive-dual",    '#f59e0b', ''),
  @("job-plumber",              "JobPlumberTemplate",             "ExecutiveDualEngine",  "executive-dual",    '#0891b2', ''),
  @("job-welder",               "JobWelderTemplate",              "ExecutiveDualEngine",  "executive-dual",    '#b45309', ''),
  @("job-freelancer",           "JobFreelancerTemplate",          "ExecutiveDualEngine",  "executive-dual",    '#8b5cf6', ''),
  @("job-waiter",               "JobWaiterTemplate",              "ExecutiveDualEngine",  "executive-dual",    '#d97706', ''),
  @("job-bartender",            "JobBartenderTemplate",           "ExecutiveDualEngine",  "executive-dual",    '#7c3aed', ''),
  @("job-firefighter",          "JobFirefighterTemplate",         "ExecutiveDualEngine",  "executive-dual",    '#dc2626', '')
)

foreach ($t in $templates) {
  $id = $t[0]
  $className = $t[1]
  $engineFunc = $t[2]
  $engineImport = $t[3]
  $accent = $t[4]
  $extra = $t[5]
  
  $content = "import type { TemplateProps } from `"../types`";`r`n"
  $content += "import { $engineFunc } from `"./engines/$engineImport.engine`";`r`n"
  $content += "import { JOB_SAMPLES } from `"../job-samples`";`r`n`r`n"
  $content += "export default function $className(props: TemplateProps) {`r`n"
  $content += "  const doc = props.doc?.full_name ? props.doc : (JOB_SAMPLES[`"$id`"] ?? props.doc);`r`n"
  $content += "  return $engineFunc({ ...props, doc }, { accent: `"$accent`"$extra });`r`n"
  $content += "}`r`n"
  
  $filePath = "$baseDir\$id.tsx"
  [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
  Write-Host "OK: $id -> $className"
}

Write-Host "ALL DONE!"
