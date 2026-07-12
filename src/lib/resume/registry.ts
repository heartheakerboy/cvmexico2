import type { TemplateComponent } from "./types";
import { CorporateTemplate } from "./templates/corporate";
import { ExecutiveTemplate } from "./templates/executive";
import { ModernSidebarTemplate } from "./templates/modern-sidebar";
import { CreativeTemplate } from "./templates/creative";
import { SimpleAtsTemplate } from "./templates/simple-ats";
import { MinimalWhiteTemplate } from "./templates/minimal-white";
import { GraduateTemplate } from "./templates/graduate";
import { EngineeringTemplate } from "./templates/engineering";
import { MarketingTemplate } from "./templates/marketing";
import { HealthcareTemplate } from "./templates/healthcare";
import { ClassicSerifTemplate } from "./templates/classic-serif";
import { CompactProTemplate } from "./templates/compact-pro";
import { ProfessionalPlusTemplate } from "./templates/professional-plus";
import { CleanSlateTemplate } from "./templates/clean-slate";
import { TimelineAtsTemplate } from "./templates/timeline-ats";
import { StudentFreshTemplate } from "./templates/student-fresh";
import { StudentTimelineTemplate } from "./templates/student-timeline";
import { StudentSimpleTemplate } from "./templates/student-simple";
import { PremiumExecutiveTemplate } from "./templates/premium-executive";
import { MinimalAtsEliteTemplate } from "./templates/minimal-ats-elite";
import { CreativeModernCircularTemplate } from "./templates/creative-modern-circular";
import { CorporateBlueTimelineTemplate } from "./templates/corporate-blue-timeline";
import { HealthcareProfessionalTemplate } from "./templates/healthcare-professional";
import { EngineeringProTemplate } from "./templates/engineering-pro";
import { MarketingPortfolioTemplate } from "./templates/marketing-portfolio";
import { StudentSuccessTemplate } from "./templates/student-success";
import { LegalExecutiveTemplate } from "./templates/legal-executive";
import { CreativePremiumPlusTemplate } from "./templates/creative-premium-plus";
import { ModernWaveBlueTemplate } from "./templates/modern-wave-blue";
import { CreativeWaveEmeraldTemplate } from "./templates/creative-wave-emerald";

// Industry specific templates imports
import { TechSoftwareEngineerTemplate } from "./templates/tech-software-engineer";
import { HealthNurseTemplate } from "./templates/health-nurse";
import { EducationTeacherTemplate } from "./templates/education-teacher";
import { CorporateAccountantTemplate } from "./templates/corporate-accountant";
import { ExecutiveLawyerTemplate } from "./templates/executive-lawyer";
import { CreativeArchitectTemplate } from "./templates/creative-architect";
import { CreativeGraphicDesignerTemplate } from "./templates/creative-graphic-designer";
import { SalesExecutiveResultsTemplate } from "./templates/sales-executive-results";
import { CorporateHrManagerTemplate } from "./templates/corporate-hr-manager";
import { ExecutiveProjectManagerTemplate } from "./templates/executive-project-manager";

// Career stage templates imports
import { StageStudentTemplate } from "./templates/stage-student";
import { StageFresherTemplate } from "./templates/stage-fresher";
import { StageInternshipTemplate } from "./templates/stage-internship";
import { StageEntryLevelTemplate } from "./templates/stage-entry-level";
import { StageMidLevelTemplate } from "./templates/stage-mid-level";
import { StageSeniorTemplate } from "./templates/stage-senior";
import { StageExecutiveTemplate } from "./templates/stage-executive";
import { StageCeoTemplate } from "./templates/stage-ceo";
import { StageGovernmentTemplate } from "./templates/stage-government";
import { StageFreelancerTemplate } from "./templates/stage-freelancer";

// Job-specific templates imports
import JobSoftwareEngineerTemplate from "./templates/job-software-engineer";
import JobFrontendDeveloperTemplate from "./templates/job-frontend-developer";
import JobBackendDeveloperTemplate from "./templates/job-backend-developer";
import JobFullstackDeveloperTemplate from "./templates/job-fullstack-developer";
import JobMobileDeveloperTemplate from "./templates/job-mobile-developer";
import JobDevopsEngineerTemplate from "./templates/job-devops-engineer";
import JobCloudEngineerTemplate from "./templates/job-cloud-engineer";
import JobCybersecurityTemplate from "./templates/job-cybersecurity";
import JobDataAnalystTemplate from "./templates/job-data-analyst";
import JobDataScientistTemplate from "./templates/job-data-scientist";
import JobAiEngineerTemplate from "./templates/job-ai-engineer";
import JobMlEngineerTemplate from "./templates/job-ml-engineer";
import JobQaEngineerTemplate from "./templates/job-qa-engineer";
import JobItSupportTemplate from "./templates/job-it-support";
import JobNetworkEngineerTemplate from "./templates/job-network-engineer";
import JobUiDesignerTemplate from "./templates/job-ui-designer";
import JobUxDesignerTemplate from "./templates/job-ux-designer";
import JobProductDesignerTemplate from "./templates/job-product-designer";
import JobVideoEditorTemplate from "./templates/job-video-editor";
import JobContentWriterTemplate from "./templates/job-content-writer";
import JobCopywriterTemplate from "./templates/job-copywriter";
import JobSeoSpecialistTemplate from "./templates/job-seo-specialist";
import JobDigitalMarketingTemplate from "./templates/job-digital-marketing";
import JobSocialMediaTemplate from "./templates/job-social-media";
import JobPhotographerTemplate from "./templates/job-photographer";
import JobJournalistTemplate from "./templates/job-journalist";
import JobEventManagerTemplate from "./templates/job-event-manager";
import JobFinancialAnalystTemplate from "./templates/job-financial-analyst";
import JobBankManagerTemplate from "./templates/job-bank-manager";
import JobLegalAssistantTemplate from "./templates/job-legal-assistant";
import JobHrExecutiveTemplate from "./templates/job-hr-executive";
import JobRecruiterTemplate from "./templates/job-recruiter";
import JobCustomerServiceTemplate from "./templates/job-customer-service";
import JobCallCenterTemplate from "./templates/job-call-center";
import JobReceptionistTemplate from "./templates/job-receptionist";
import JobAdminAssistantTemplate from "./templates/job-admin-assistant";
import JobOfficeManagerTemplate from "./templates/job-office-manager";
import JobVirtualAssistantTemplate from "./templates/job-virtual-assistant";
import JobSecurityGuardTemplate from "./templates/job-security-guard";
import JobFactoryWorkerTemplate from "./templates/job-factory-worker";
import JobWarehouseTemplate from "./templates/job-warehouse";
import JobDeliveryDriverTemplate from "./templates/job-delivery-driver";
import JobDoctorTemplate from "./templates/job-doctor";
import JobMedicalAssistantTemplate from "./templates/job-medical-assistant";
import JobDentistTemplate from "./templates/job-dentist";
import JobPharmacistTemplate from "./templates/job-pharmacist";
import JobPsychologistTemplate from "./templates/job-psychologist";
import JobCounselorTemplate from "./templates/job-counselor";
import JobVeterinarianTemplate from "./templates/job-veterinarian";
import JobFitnessTrainerTemplate from "./templates/job-fitness-trainer";
import JobNutritionistTemplate from "./templates/job-nutritionist";
import JobSalesManagerTemplate from "./templates/job-sales-manager";
import JobBusinessDevelopmentTemplate from "./templates/job-business-development";
import JobProfessorTemplate from "./templates/job-professor";
import JobSchoolPrincipalTemplate from "./templates/job-school-principal";
import JobCivilEngineerTemplate from "./templates/job-civil-engineer";
import JobMechanicalEngineerTemplate from "./templates/job-mechanical-engineer";
import JobElectricalEngineerTemplate from "./templates/job-electrical-engineer";
import JobConstructionManagerTemplate from "./templates/job-construction-manager";
import JobConsultantTemplate from "./templates/job-consultant";
import JobEntrepreneurTemplate from "./templates/job-entrepreneur";
import JobRealEstateTemplate from "./templates/job-real-estate";
import JobHotelManagerTemplate from "./templates/job-hotel-manager";
import JobRestaurantManagerTemplate from "./templates/job-restaurant-manager";
import JobChefTemplate from "./templates/job-chef";
import JobRetailAssociateTemplate from "./templates/job-retail-associate";
import JobStoreManagerTemplate from "./templates/job-store-manager";
import JobLogisticsTemplate from "./templates/job-logistics";
import JobElectricianTemplate from "./templates/job-electrician";
import JobPlumberTemplate from "./templates/job-plumber";
import JobWelderTemplate from "./templates/job-welder";
import JobFreelancerTemplate from "./templates/job-freelancer";
import JobWaiterTemplate from "./templates/job-waiter";
import JobBartenderTemplate from "./templates/job-bartender";
import JobFirefighterTemplate from "./templates/job-firefighter";

export type TemplateCategory =
  | "Profesional"
  | "Ejecutivo"
  | "Creativo"
  | "Estudiante"
  | "Técnico"
  | "ATS";

export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  accent: string; // default accent color (hex)
  ats: boolean;
  premium: boolean;
  component: TemplateComponent;
};

// The registry IS the source of truth. Adding a template here is the only
// step needed to make it available across the app — no other logic changes.
export const TEMPLATES: TemplateMeta[] = [
  {
    id: "stage-student",
    name: "Estudiante Académico",
    description: "Enfoque educativo integral con destaque de voluntariados y becas.",
    category: "Estudiante",
    tags: ["Estudiante", "Básico", "Dos columnas", "Premium"],
    accent: "#8b5cf6",
    ats: false,
    premium: true,
    component: StageStudentTemplate,
  },
  {
    id: "stage-fresher",
    name: "Egresado Dinámico",
    description: "Estructura moderna de dos columnas con foco en competencias técnicas y objetivos.",
    category: "Estudiante",
    tags: ["Estudiante", "Graduado", "Limpio", "Premium"],
    accent: "#06b6d4",
    ats: true,
    premium: true,
    component: StageFresherTemplate,
  },
  {
    id: "stage-internship",
    name: "Candidato a Prácticas",
    description: "Limpio y minimalista con destaque de materias cursadas y proyectos estudiantiles.",
    category: "Estudiante",
    tags: ["Estudiante", "Prácticas", "Limpio", "Premium"],
    accent: "#10b981",
    ats: true,
    premium: true,
    component: StageInternshipTemplate,
  },
  {
    id: "stage-entry-level",
    name: "Profesional Junior",
    description: "Diseño corporativo con destaque inicial de habilidades técnicas y capacitaciones.",
    category: "Profesional",
    tags: ["Profesional", "Junior", "Limpio", "Premium"],
    accent: "#3b82f6",
    ats: true,
    premium: true,
    component: StageEntryLevelTemplate,
  },
  {
    id: "stage-mid-level",
    name: "Especialista Mid-Level",
    description: "Layout corporativo equilibrado para perfiles con 3-7 años de experiencia.",
    category: "Profesional",
    tags: ["Profesional", "Intermedio", "Balanceado", "Premium"],
    accent: "#4f46e5",
    ats: true,
    premium: true,
    component: StageMidLevelTemplate,
  },
  {
    id: "stage-senior",
    name: "Especialista Senior",
    description: "Asimetría ejecutiva y tipografía de prestigio para líderes y especialistas.",
    category: "Ejecutivo",
    tags: ["Ejecutivo", "Senior", "Líder", "Premium"],
    accent: "#334155",
    ats: true,
    premium: true,
    component: StageSeniorTemplate,
  },
  {
    id: "stage-executive",
    name: "Dirección Ejecutiva",
    description: "Lujo tradicional con serif de prestigio y spotlight de gobierno corporativo.",
    category: "Ejecutivo",
    tags: ["Ejecutivo", "Dirección", "Lujo", "Premium"],
    accent: "#d4af37",
    ats: false,
    premium: true,
    component: StageExecutiveTemplate,
  },
  {
    id: "stage-ceo",
    name: "CEO Élite",
    description: "Branding de alta dirección con línea de tiempo y foco en EBITDA y finanzas.",
    category: "Ejecutivo",
    tags: ["Ejecutivo", "CEO", "Resultados", "Premium"],
    accent: "#b45309",
    ats: false,
    premium: true,
    component: StageCeoTemplate,
  },
  {
    id: "stage-government",
    name: "Servidor Público",
    description: "Formato oficial estricto de una columna sin ningún adorno decorativo.",
    category: "ATS",
    tags: ["ATS", "Gobierno", "Sin foto", "Premium"],
    accent: "#000000",
    ats: true,
    premium: true,
    component: StageGovernmentTemplate,
  },
  {
    id: "stage-freelancer",
    name: "Freelancer Creativo",
    description: "Foco en portafolio de proyectos, servicios ofrecidos y links web activos.",
    category: "Creativo",
    tags: ["Freelancer", "Creativo", "Portafolio", "Premium"],
    accent: "#f43f5e",
    ats: false,
    premium: true,
    component: StageFreelancerTemplate,
  },
  {
    id: "tech-software-engineer",
    name: "Ingeniero de Software Pro",
    description: "Diseño moderno con sidebar técnica, portafolio y barra de lenguajes.",
    category: "Técnico",
    tags: ["Técnico", "Software", "Dos columnas", "Premium"],
    accent: "#0ea5e9",
    ats: true,
    premium: true,
    component: TechSoftwareEngineerTemplate,
  },
  {
    id: "health-nurse",
    name: "Enfermería Profesional",
    description: "Esquema teal limpio con barra lateral para licencias, certificaciones y cuidados.",
    category: "Profesional",
    tags: ["Salud", "Enfermería", "Limpio", "Premium"],
    accent: "#0d9488",
    ats: true,
    premium: true,
    component: HealthNurseTemplate,
  },
  {
    id: "education-teacher",
    name: "Docente Académico",
    description: "Prestigio académico con serif elegante, secciones para talleres e intereses.",
    category: "Profesional",
    tags: ["Educación", "Serif", "Académico", "Premium"],
    accent: "#ca8a04",
    ats: false,
    premium: true,
    component: EducationTeacherTemplate,
  },
  {
    id: "corporate-accountant",
    name: "Contador Corporativo",
    description: "Diseño minimalista de una columna optimizado al 100% para ATS y SAT.",
    category: "ATS",
    tags: ["ATS", "Sin foto", "Contabilidad", "Premium"],
    accent: "#1e3a8a",
    ats: true,
    premium: true,
    component: CorporateAccountantTemplate,
  },
  {
    id: "executive-lawyer",
    name: "Ejecutivo Legal Pro",
    description: "Tradición y elegancia jurídica con doble línea y serif de prestigio.",
    category: "Ejecutivo",
    tags: ["Legal", "Serif", "Ejecutivo", "Premium"],
    accent: "#0f172a",
    ats: true,
    premium: true,
    component: ExecutiveLawyerTemplate,
  },
  {
    id: "creative-architect",
    name: "Arquitectura Estructural",
    description: "Líneas de dibujo técnico, foto cuadrada y rejilla asimétrica para portafolios.",
    category: "Creativo",
    tags: ["Arquitectura", "Creativo", "Portafolio", "Premium"],
    accent: "#ea580c",
    ats: false,
    premium: true,
    component: CreativeArchitectTemplate,
  },
  {
    id: "creative-graphic-designer",
    name: "Diseñador Gráfico Premium",
    description: "Vibrante y visual, con handles de Behance/Dribbble y bloques modernos.",
    category: "Creativo",
    tags: ["Diseño", "Creativo", "Portafolio", "Premium"],
    accent: "#d946ef",
    ats: false,
    premium: true,
    component: CreativeGraphicDesignerTemplate,
  },
  {
    id: "sales-executive-results",
    name: "Ventas de Alto Impacto",
    description: "Orientado a metas con insignias comerciales y destaque de ingresos anuales.",
    category: "Ejecutivo",
    tags: ["Ventas", "Resultados", "Ejecutivo", "Premium"],
    accent: "#16a34a",
    ats: false,
    premium: true,
    component: SalesExecutiveResultsTemplate,
  },
  {
    id: "corporate-hr-manager",
    name: "Recursos Humanos Pro",
    description: "Diseño formal con panel de reclutamiento, certificaciones y NOM-035.",
    category: "Profesional",
    tags: ["Recursos Humanos", "Corporate", "Clima Laboral", "Premium"],
    accent: "#475569",
    ats: true,
    premium: true,
    component: CorporateHrManagerTemplate,
  },
  {
    id: "executive-project-manager",
    name: "Gerente de Proyectos PMP",
    description: "Layout de línea de tiempo con foco en Agile, Scrum y certificaciones PMI.",
    category: "Ejecutivo",
    tags: ["Proyectos", "PMP", "Scrum", "Premium"],
    accent: "#2563eb",
    ats: true,
    premium: true,
    component: ExecutiveProjectManagerTemplate,
  },
  {
    id: "modern-wave-blue",
    name: "Onda Azul Moderna",
    description: "Diseño moderno con curvas y ondas abstractas en azul en encabezado y pie de página.",
    category: "Creativo",
    tags: ["Creativo", "Ondas", "Azul", "Foto", "Dos columnas"],
    accent: "#1e3a8a",
    ats: false,
    premium: true,
    component: ModernWaveBlueTemplate,
  },
  {
    id: "creative-wave-emerald",
    name: "Onda Esmeralda Creativa",
    description: "Diseño fresco con curvas y ondas abstractas color verde esmeralda y menta.",
    category: "Creativo",
    tags: ["Creativo", "Ondas", "Esmeralda", "Foto", "Dos columnas"],
    accent: "#0f766e",
    ats: false,
    premium: true,
    component: CreativeWaveEmeraldTemplate,
  },
  {
    id: "premium-executive",
    name: "Ejecutivo Premium",
    description: "Diseño ejecutivo de lujo con acento dorado y barra lateral oscura.",
    category: "Ejecutivo",
    tags: ["Lujo", "Dos columnas", "Premium", "Foto"],
    accent: "#d4af37",
    ats: false,
    premium: true,
    component: PremiumExecutiveTemplate,
  },
  {
    id: "minimal-ats-elite",
    name: "ATS Élite Mínimo",
    description: "Diseño de una columna optimizado al 100% para sistemas ATS y reclutadores.",
    category: "ATS",
    tags: ["ATS", "Una columna", "Limpio", "Sin foto"],
    accent: "#1e293b",
    ats: true,
    premium: true,
    component: MinimalAtsEliteTemplate,
  },
  {
    id: "creative-modern-circular",
    name: "Moderno Creativo",
    description: "Encabezado editorial grande, foto circular y diseño asimétrico para destacar.",
    category: "Creativo",
    tags: ["Creativo", "Foto", "Moderno", "Diseño"],
    accent: "#7c3aed",
    ats: false,
    premium: true,
    component: CreativeModernCircularTemplate,
  },
  {
    id: "corporate-blue-timeline",
    name: "Azul Corporativo",
    description: "Diseño profesional con línea de tiempo y acentos azules.",
    category: "Profesional",
    tags: ["Profesional", "Azul", "Timeline", "Foto"],
    accent: "#1d4ed8",
    ats: false,
    premium: true,
    component: CorporateBlueTimelineTemplate,
  },
  {
    id: "healthcare-professional",
    name: "Profesional de la Salud",
    description: "Limpio, con temática médica en tono verde azulado y alta legibilidad.",
    category: "Profesional",
    tags: ["Médico", "Salud", "Limpio", "ATS"],
    accent: "#0d9488",
    ats: true,
    premium: true,
    component: HealthcareProfessionalTemplate,
  },
  {
    id: "engineering-pro",
    name: "Ingeniería Pro",
    description: "Diseño técnico con énfasis en proyectos, habilidades y estética mono.",
    category: "Técnico",
    tags: ["Técnico", "Proyectos", "Código", "Sin foto"],
    accent: "#0891b2",
    ats: true,
    premium: true,
    component: EngineeringProTemplate,
  },
  {
    id: "marketing-portfolio",
    name: "Portafolio de Marketing",
    description: "Asimétrico y moderno, ideal para perfiles creativos y marketing.",
    category: "Creativo",
    tags: ["Marketing", "Creativo", "Portafolio", "Foto"],
    accent: "#e11d48",
    ats: false,
    premium: true,
    component: MarketingPortfolioTemplate,
  },
  {
    id: "student-success",
    name: "Éxito Estudiantil",
    description: "Frescura académica enfocada en proyectos, educación e historial inicial.",
    category: "Estudiante",
    tags: ["Estudiante", "Foto", "Educación", "Fresco"],
    accent: "#4f46e5",
    ats: true,
    premium: true,
    component: StudentSuccessTemplate,
  },
  {
    id: "legal-executive",
    name: "Ejecutivo Legal",
    description: "Elegancia tradicional en blanco y negro, tipografía serif de prestigio.",
    category: "Ejecutivo",
    tags: ["Legal", "Elegante", "Serif", "Sin foto"],
    accent: "#0f172a",
    ats: true,
    premium: true,
    component: LegalExecutiveTemplate,
  },
  {
    id: "creative-premium-plus",
    name: "Creativo Premium Plus",
    description: "Diseño de autor a dos columnas con barra lateral de color completo y foto de retrato grande.",
    category: "Creativo",
    tags: ["Creativo", "Premium", "Dos columnas", "Foto"],
    accent: "#0ea5e9",
    ats: false,
    premium: true,
    component: CreativePremiumPlusTemplate,
  },
  {
    id: "corporate",
    name: "Corporativo Profesional",
    description: "Minimalista, una columna y 100% compatible con ATS. Acento azul.",
    category: "Profesional",
    tags: ["Minimalista", "ATS", "Azul"],
    accent: "#2563eb",
    ats: true,
    premium: false,
    component: CorporateTemplate,
  },
  {
    id: "executive",
    name: "Ejecutivo Black",
    description: "Estilo de lujo a dos columnas con barra lateral oscura.",
    category: "Ejecutivo",
    tags: ["Lujo", "Dos columnas", "Premium"],
    accent: "#c8a44d",
    ats: false,
    premium: true,
    component: ExecutiveTemplate,
  },
  {
    id: "modern-sidebar",
    name: "Barra Lateral Moderna",
    description: "Foto a la izquierda, experiencia en línea de tiempo, iconos mínimos.",
    category: "Profesional",
    tags: ["Foto", "Timeline", "Moderno"],
    accent: "#0ea5e9",
    ats: false,
    premium: true,
    component: ModernSidebarTemplate,
  },
  {
    id: "creative",
    name: "Diseñador Creativo",
    description: "Encabezado grande, tipografía elegante y diseño llamativo.",
    category: "Creativo",
    tags: ["Encabezado", "Elegante", "Serif"],
    accent: "#7c3aed",
    ats: false,
    premium: true,
    component: CreativeTemplate,
  },
  {
    id: "simple-ats",
    name: "ATS Simple",
    description: "Una columna, sin gráficos, máxima puntuación ATS.",
    category: "ATS",
    tags: ["ATS", "Sin gráficos", "Simple"],
    accent: "#111827",
    ats: true,
    premium: false,
    component: SimpleAtsTemplate,
  },
  {
    id: "minimal-white",
    name: "Blanco Minimal",
    description: "Mucho espacio en blanco y tipografía moderna y ligera.",
    category: "Profesional",
    tags: ["Espacio en blanco", "Ligero", "Moderno"],
    accent: "#0f766e",
    ats: true,
    premium: false,
    component: MinimalWhiteTemplate,
  },
  {
    id: "graduate",
    name: "Egresado",
    description: "Para estudiantes: prácticas, proyectos y enfoque en educación.",
    category: "Estudiante",
    tags: ["Estudiante", "Prácticas", "Educación"],
    accent: "#16a34a",
    ats: true,
    premium: false,
    component: GraduateTemplate,
  },
  {
    id: "engineering",
    name: "Ingeniería",
    description: "Habilidades técnicas, proyectos y certificados con diseño limpio.",
    category: "Técnico",
    tags: ["Técnico", "Proyectos", "Certificados"],
    accent: "#0891b2",
    ats: true,
    premium: false,
    component: EngineeringTemplate,
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Moderno, con acentos de color, portafolio y redes sociales.",
    category: "Creativo",
    tags: ["Moderno", "Portafolio", "Redes"],
    accent: "#e11d48",
    ats: false,
    premium: true,
    component: MarketingTemplate,
  },
  {
    id: "healthcare",
    name: "Salud",
    description: "Profesional, simple y compatible con ATS para el sector médico.",
    category: "Profesional",
    tags: ["Médico", "Simple", "ATS"],
    accent: "#0d9488",
    ats: true,
    premium: false,
    component: HealthcareTemplate,
  },
  {
    id: "classic-serif",
    name: "Clásico Serif",
    description: "Encabezado centrado con tipografía serif, ideal para ATS.",
    category: "ATS",
    tags: ["ATS", "Serif", "Clásico"],
    accent: "#1e3a8a",
    ats: true,
    premium: false,
    component: ClassicSerifTemplate,
  },
  {
    id: "compact-pro",
    name: "Compacto Pro",
    description: "Una columna densa con barra de acento, máxima compatibilidad ATS.",
    category: "ATS",
    tags: ["ATS", "Compacto", "Denso"],
    accent: "#b45309",
    ats: true,
    premium: false,
    component: CompactProTemplate,
  },
  {
    id: "professional-plus",
    name: "Profesional Plus",
    description: "Encabezados en mayúsculas con líneas sutiles, 100% ATS.",
    category: "ATS",
    tags: ["ATS", "Profesional", "Limpio"],
    accent: "#334155",
    ats: true,
    premium: false,
    component: ProfessionalPlusTemplate,
  },
  {
    id: "clean-slate",
    name: "Lienzo Limpio",
    description: "Minimalista sin líneas, mucho espacio y encabezados de acento.",
    category: "ATS",
    tags: ["ATS", "Minimalista", "Espacio"],
    accent: "#0369a1",
    ats: true,
    premium: false,
    component: CleanSlateTemplate,
  },
  {
    id: "timeline-ats",
    name: "Línea ATS",
    description: "Secciones etiquetadas a la izquierda, legible por ATS.",
    category: "ATS",
    tags: ["ATS", "Etiquetas", "Estructurado"],
    accent: "#0f766e",
    ats: true,
    premium: false,
    component: TimelineAtsTemplate,
  },
  {
    id: "student-fresh",
    name: "Estudiante Fresco",
    description: "Banda de color superior, ideal para tu primer CV.",
    category: "Estudiante",
    tags: ["Estudiante", "Moderno", "Color"],
    accent: "#7c3aed",
    ats: true,
    premium: false,
    component: StudentFreshTemplate,
  },
  {
    id: "student-timeline",
    name: "Estudiante Línea",
    description: "Secciones con línea de tiempo lateral, limpio y moderno.",
    category: "Estudiante",
    tags: ["Estudiante", "Timeline", "Limpio"],
    accent: "#0ea5e9",
    ats: true,
    premium: false,
    component: StudentTimelineTemplate,
  },
  {
    id: "student-simple",
    name: "Estudiante Simple",
    description: "Una columna sencilla y compatible con ATS para empezar.",
    category: "Estudiante",
    tags: ["Estudiante", "Simple", "ATS"],
    accent: "#16a34a",
    ats: true,
    premium: false,
    component: StudentSimpleTemplate,
  },

  // ─── Job-Specific Templates ───────────────────────────────────────────────
  // Tech / IT (15)
  { id: "job-software-engineer", name: "Ingeniero de Software", description: "Plantilla técnica con sidebar oscuro para ingenieros de software.", category: "Técnico", tags: ["Premium", "ATS", "Tech"], accent: "#0ea5e9", ats: true, premium: true, component: JobSoftwareEngineerTemplate },
  { id: "job-frontend-developer", name: "Desarrollador Frontend", description: "Sidebar ámbar para developers de interfaces y UI.", category: "Técnico", tags: ["Premium", "ATS", "Tech"], accent: "#f59e0b", ats: true, premium: true, component: JobFrontendDeveloperTemplate },
  { id: "job-backend-developer", name: "Desarrollador Backend", description: "Sidebar verde oscuro para developers de APIs y servidores.", category: "Técnico", tags: ["Premium", "ATS", "Tech"], accent: "#22c55e", ats: true, premium: true, component: JobBackendDeveloperTemplate },
  { id: "job-fullstack-developer", name: "Desarrollador Full Stack", description: "Sidebar morado para perfiles versátiles frontend+backend.", category: "Técnico", tags: ["Premium", "ATS", "Tech", "Popular"], accent: "#a855f7", ats: true, premium: true, component: JobFullstackDeveloperTemplate },
  { id: "job-mobile-developer", name: "Desarrollador Móvil", description: "Sidebar cian para developers de apps iOS y Android.", category: "Técnico", tags: ["Premium", "ATS", "Tech"], accent: "#06b6d4", ats: true, premium: true, component: JobMobileDeveloperTemplate },
  { id: "job-devops-engineer", name: "Ingeniero DevOps", description: "Sidebar naranja intenso para ingenieros DevOps y SRE.", category: "Técnico", tags: ["Premium", "ATS", "Tech"], accent: "#f97316", ats: true, premium: true, component: JobDevopsEngineerTemplate },
  { id: "job-cloud-engineer", name: "Ingeniero de Nube", description: "Sidebar azul naval para arquitectos e ingenieros cloud.", category: "Técnico", tags: ["Premium", "ATS", "Tech"], accent: "#38bdf8", ats: true, premium: true, component: JobCloudEngineerTemplate },
  { id: "job-cybersecurity", name: "Especialista en Ciberseguridad", description: "Sidebar rojo oscuro para especialistas en seguridad informática.", category: "Técnico", tags: ["Premium", "ATS", "Tech"], accent: "#ef4444", ats: true, premium: true, component: JobCybersecurityTemplate },
  { id: "job-data-analyst", name: "Analista de Datos", description: "Sidebar azul índigo para analistas de datos y BI.", category: "Técnico", tags: ["Premium", "ATS", "Tech", "Popular"], accent: "#3b82f6", ats: true, premium: true, component: JobDataAnalystTemplate },
  { id: "job-data-scientist", name: "Científico de Datos", description: "Sidebar morado profundo para data scientists y ML.", category: "Técnico", tags: ["Premium", "ATS", "Tech"], accent: "#8b5cf6", ats: true, premium: true, component: JobDataScientistTemplate },
  { id: "job-ai-engineer", name: "Ingeniero de IA", description: "Sidebar púrpura innovador para ingenieros de inteligencia artificial.", category: "Técnico", tags: ["Premium", "ATS", "Tech", "Nuevo"], accent: "#d946ef", ats: true, premium: true, component: JobAiEngineerTemplate },
  { id: "job-ml-engineer", name: "Ingeniero de ML", description: "Sidebar verde esmeralda para ingenieros de Machine Learning.", category: "Técnico", tags: ["Premium", "ATS", "Tech"], accent: "#10b981", ats: true, premium: true, component: JobMlEngineerTemplate },
  { id: "job-qa-engineer", name: "Ingeniero QA", description: "Sidebar ámbar para ingenieros de calidad y automatización.", category: "Técnico", tags: ["Premium", "ATS", "Tech"], accent: "#f59e0b", ats: true, premium: true, component: JobQaEngineerTemplate },
  { id: "job-it-support", name: "Soporte Técnico TI", description: "Sidebar gris profesional para especialistas en soporte TI.", category: "Técnico", tags: ["ATS", "Tech"], accent: "#64748b", ats: true, premium: false, component: JobItSupportTemplate },
  { id: "job-network-engineer", name: "Ingeniero de Redes", description: "Sidebar azul marino para ingenieros de redes e infraestructura.", category: "Técnico", tags: ["Premium", "ATS", "Tech"], accent: "#0891b2", ats: true, premium: true, component: JobNetworkEngineerTemplate },

  // Creativo (12)
  { id: "job-ui-designer", name: "Diseñador UI", description: "Panel rojo vibrante para diseñadores de interfaces.", category: "Creativo", tags: ["Premium", "Creativo"], accent: "#e11d48", ats: false, premium: true, component: JobUiDesignerTemplate },
  { id: "job-ux-designer", name: "Diseñador UX", description: "Panel violeta para diseñadores de experiencia de usuario.", category: "Creativo", tags: ["Premium", "Creativo"], accent: "#7c3aed", ats: false, premium: true, component: JobUxDesignerTemplate },
  { id: "job-product-designer", name: "Diseñador de Producto", description: "Panel azul para product designers end-to-end.", category: "Creativo", tags: ["Premium", "Creativo"], accent: "#0ea5e9", ats: false, premium: true, component: JobProductDesignerTemplate },
  { id: "job-video-editor", name: "Editor de Video", description: "Panel naranja para editores de video y motion designers.", category: "Creativo", tags: ["Creativo", "ATS"], accent: "#f97316", ats: true, premium: false, component: JobVideoEditorTemplate },
  { id: "job-content-writer", name: "Redactor de Contenidos", description: "Panel verde para redactores y estrategas de contenido SEO.", category: "Creativo", tags: ["ATS", "Creativo"], accent: "#84cc16", ats: true, premium: false, component: JobContentWriterTemplate },
  { id: "job-copywriter", name: "Copywriter", description: "Panel rosa intenso para copywriters de performance.", category: "Creativo", tags: ["Creativo", "ATS"], accent: "#f43f5e", ats: true, premium: false, component: JobCopywriterTemplate },
  { id: "job-seo-specialist", name: "Especialista SEO", description: "Panel verde azulado para especialistas en posicionamiento web.", category: "Creativo", tags: ["ATS", "Digital"], accent: "#0f766e", ats: true, premium: false, component: JobSeoSpecialistTemplate },
  { id: "job-digital-marketing", name: "Marketing Digital", description: "Panel azul para gerentes de marketing digital y performance.", category: "Creativo", tags: ["Premium", "ATS", "Digital"], accent: "#2563eb", ats: true, premium: true, component: JobDigitalMarketingTemplate },
  { id: "job-social-media", name: "Community Manager", description: "Panel fuchsia para community managers y social media.", category: "Creativo", tags: ["Creativo", "ATS"], accent: "#e879f9", ats: true, premium: false, component: JobSocialMediaTemplate },
  { id: "job-photographer", name: "Fotógrafo Profesional", description: "Panel oscuro elegante para fotógrafos comerciales y editoriales.", category: "Creativo", tags: ["Creativo"], accent: "#64748b", ats: false, premium: false, component: JobPhotographerTemplate },
  { id: "job-journalist", name: "Periodista", description: "Panel ámbar oscuro para periodistas de investigación y medios.", category: "Creativo", tags: ["ATS", "Creativo"], accent: "#b45309", ats: true, premium: false, component: JobJournalistTemplate },
  { id: "job-event-manager", name: "Coordinador de Eventos", description: "Panel rosa para coordinadores y gerentes de eventos.", category: "Creativo", tags: ["ATS", "Creativo"], accent: "#ec4899", ats: true, premium: false, component: JobEventManagerTemplate },

  // Corporativo (15)
  { id: "job-financial-analyst", name: "Analista Financiero", description: "Header azul marino para analistas financieros y banqueros.", category: "Profesional", tags: ["Premium", "ATS"], accent: "#1d4ed8", ats: true, premium: true, component: JobFinancialAnalystTemplate },
  { id: "job-bank-manager", name: "Gerente Bancario", description: "Header azul profundo para gerentes de sucursal bancaria.", category: "Ejecutivo", tags: ["Premium", "ATS"], accent: "#0f4c81", ats: true, premium: true, component: JobBankManagerTemplate },
  { id: "job-legal-assistant", name: "Asistente Legal", description: "Header gris oscuro para asistentes legales y paralegales.", category: "Profesional", tags: ["ATS"], accent: "#374151", ats: true, premium: false, component: JobLegalAssistantTemplate },
  { id: "job-hr-executive", name: "Ejecutivo de RRHH", description: "Header cian para ejecutivos de recursos humanos.", category: "Profesional", tags: ["ATS", "Premium"], accent: "#0891b2", ats: true, premium: true, component: JobHrExecutiveTemplate },
  { id: "job-recruiter", name: "Reclutador de Talento", description: "Header azul para reclutadores y talent hunters.", category: "Profesional", tags: ["ATS"], accent: "#2563eb", ats: true, premium: false, component: JobRecruiterTemplate },
  { id: "job-customer-service", name: "Atención al Cliente", description: "Header verde azulado para especialistas en servicio al cliente.", category: "Profesional", tags: ["ATS"], accent: "#0d9488", ats: true, premium: false, component: JobCustomerServiceTemplate },
  { id: "job-call-center", name: "Agente de Call Center", description: "Header morado para agentes de call center y ventas.", category: "Profesional", tags: ["ATS"], accent: "#7c3aed", ats: true, premium: false, component: JobCallCenterTemplate },
  { id: "job-receptionist", name: "Recepcionista", description: "Header ámbar para recepcionistas ejecutivos.", category: "Profesional", tags: ["ATS"], accent: "#d97706", ats: true, premium: false, component: JobReceptionistTemplate },
  { id: "job-admin-assistant", name: "Asistente Administrativo", description: "Header azul para asistentes administrativos y ejecutivos.", category: "Profesional", tags: ["ATS"], accent: "#1d4ed8", ats: true, premium: false, component: JobAdminAssistantTemplate },
  { id: "job-office-manager", name: "Gerente de Oficina", description: "Header índigo para gerentes de oficina y operaciones.", category: "Ejecutivo", tags: ["ATS", "Premium"], accent: "#4f46e5", ats: true, premium: true, component: JobOfficeManagerTemplate },
  { id: "job-virtual-assistant", name: "Asistente Virtual", description: "Header verde para asistentes virtuales y freelancers remotos.", category: "Profesional", tags: ["ATS", "Freelance"], accent: "#059669", ats: true, premium: false, component: JobVirtualAssistantTemplate },
  { id: "job-security-guard", name: "Guardia de Seguridad", description: "Header oscuro para guardias y personal de seguridad privada.", category: "Profesional", tags: ["ATS"], accent: "#374151", ats: true, premium: false, component: JobSecurityGuardTemplate },
  { id: "job-factory-worker", name: "Operador de Producción", description: "Header ámbar para operadores de planta y manufactura.", category: "Técnico", tags: ["ATS"], accent: "#b45309", ats: true, premium: false, component: JobFactoryWorkerTemplate },
  { id: "job-warehouse", name: "Auxiliar de Almacén", description: "Header verde para auxiliares de almacén y logística.", category: "Técnico", tags: ["ATS"], accent: "#0f766e", ats: true, premium: false, component: JobWarehouseTemplate },
  { id: "job-delivery-driver", name: "Repartidor / Chofer", description: "Header naranja para repartidores y choferes de reparto.", category: "Profesional", tags: ["ATS"], accent: "#f97316", ats: true, premium: false, component: JobDeliveryDriverTemplate },

  // Salud (9)
  { id: "job-doctor", name: "Médico General", description: "Timeline con credenciales para médicos de primer nivel.", category: "Profesional", tags: ["Premium", "ATS", "Salud"], accent: "#0d9488", ats: true, premium: true, component: JobDoctorTemplate },
  { id: "job-medical-assistant", name: "Asistente Médico", description: "Timeline clínico para asistentes médicos y enfermería.", category: "Profesional", tags: ["ATS", "Salud"], accent: "#06b6d4", ats: true, premium: false, component: JobMedicalAssistantTemplate },
  { id: "job-dentist", name: "Odontólogo", description: "Timeline azul clínico para odontólogos generales y especialistas.", category: "Profesional", tags: ["Premium", "ATS", "Salud"], accent: "#0891b2", ats: true, premium: true, component: JobDentistTemplate },
  { id: "job-pharmacist", name: "Farmacéutico", description: "Timeline verde para farmacéuticos e industria farmacéutica.", category: "Profesional", tags: ["Premium", "ATS", "Salud"], accent: "#16a34a", ats: true, premium: true, component: JobPharmacistTemplate },
  { id: "job-psychologist", name: "Psicólogo", description: "Timeline morado para psicólogos clínicos y orientadores.", category: "Profesional", tags: ["Premium", "ATS", "Salud"], accent: "#7c3aed", ats: true, premium: true, component: JobPsychologistTemplate },
  { id: "job-counselor", name: "Orientador / Consejero", description: "Timeline teal para consejeros y orientadores vocacionales.", category: "Profesional", tags: ["ATS", "Salud"], accent: "#0d9488", ats: true, premium: false, component: JobCounselorTemplate },
  { id: "job-veterinarian", name: "Médico Veterinario", description: "Timeline verde para médicos veterinarios zootecnistas.", category: "Profesional", tags: ["Premium", "ATS", "Salud"], accent: "#65a30d", ats: true, premium: true, component: JobVeterinarianTemplate },
  { id: "job-fitness-trainer", name: "Entrenador Personal", description: "Timeline ámbar para entrenadores físicos y coaches de fitness.", category: "Profesional", tags: ["ATS", "Salud"], accent: "#f59e0b", ats: true, premium: false, component: JobFitnessTrainerTemplate },
  { id: "job-nutritionist", name: "Nutriólogo", description: "Timeline verde lima para nutriólogos clínicos y deportivos.", category: "Profesional", tags: ["ATS", "Salud"], accent: "#84cc16", ats: true, premium: false, component: JobNutritionistTemplate },

  // Ejecutivo / Gerencial (24)
  { id: "job-sales-manager", name: "Gerente de Ventas", description: "Dos columnas premium para líderes comerciales y de ventas B2B.", category: "Ejecutivo", tags: ["Premium", "ATS", "Ventas"], accent: "#dc2626", ats: true, premium: true, component: JobSalesManagerTemplate },
  { id: "job-business-development", name: "Desarrollo de Negocios", description: "Dos columnas para gerentes de desarrollo de negocios y alianzas.", category: "Ejecutivo", tags: ["Premium", "ATS"], accent: "#0f766e", ats: true, premium: true, component: JobBusinessDevelopmentTemplate },
  { id: "job-professor", name: "Profesor Universitario", description: "Dos columnas académicas para profesores e investigadores SNI.", category: "Ejecutivo", tags: ["ATS", "Educación"], accent: "#1d4ed8", ats: true, premium: false, component: JobProfessorTemplate },
  { id: "job-school-principal", name: "Director Escolar", description: "Dos columnas para directores y gestores de instituciones educativas.", category: "Ejecutivo", tags: ["ATS", "Educación"], accent: "#7c3aed", ats: true, premium: false, component: JobSchoolPrincipalTemplate },
  { id: "job-civil-engineer", name: "Ingeniero Civil", description: "Dos columnas para ingenieros civiles y directores de obra.", category: "Técnico", tags: ["Premium", "ATS", "Ingeniería"], accent: "#b45309", ats: true, premium: true, component: JobCivilEngineerTemplate },
  { id: "job-mechanical-engineer", name: "Ingeniero Mecánico", description: "Dos columnas para ingenieros mecánicos y de manufactura.", category: "Técnico", tags: ["Premium", "ATS", "Ingeniería"], accent: "#374151", ats: true, premium: true, component: JobMechanicalEngineerTemplate },
  { id: "job-electrical-engineer", name: "Ingeniero Eléctrico", description: "Dos columnas para ingenieros eléctricos y de energías renovables.", category: "Técnico", tags: ["Premium", "ATS", "Ingeniería"], accent: "#f59e0b", ats: true, premium: true, component: JobElectricalEngineerTemplate },
  { id: "job-construction-manager", name: "Gerente de Construcción", description: "Dos columnas premium para gerentes de proyectos de construcción.", category: "Ejecutivo", tags: ["Premium", "ATS"], accent: "#d97706", ats: true, premium: true, component: JobConstructionManagerTemplate },
  { id: "job-consultant", name: "Consultor de Negocios", description: "Dos columnas de alto impacto para consultores estratégicos.", category: "Ejecutivo", tags: ["Premium", "ATS"], accent: "#0f4c81", ats: true, premium: true, component: JobConsultantTemplate },
  { id: "job-entrepreneur", name: "Emprendedor / Fundador", description: "Dos columnas visionarias para founders y emprendedores.", category: "Ejecutivo", tags: ["Premium", "Creativo"], accent: "#f97316", ats: false, premium: true, component: JobEntrepreneurTemplate },
  { id: "job-real-estate", name: "Asesor Inmobiliario", description: "Dos columnas para asesores inmobiliarios y agentes AMPI.", category: "Profesional", tags: ["ATS", "Ventas"], accent: "#16a34a", ats: true, premium: false, component: JobRealEstateTemplate },
  { id: "job-hotel-manager", name: "Gerente Hotelero", description: "Dos columnas premium para directores y gerentes hoteleros.", category: "Ejecutivo", tags: ["Premium", "ATS"], accent: "#d97706", ats: true, premium: true, component: JobHotelManagerTemplate },
  { id: "job-restaurant-manager", name: "Gerente de Restaurante", description: "Dos columnas para gerentes de restaurante y A&B.", category: "Ejecutivo", tags: ["ATS"], accent: "#b45309", ats: true, premium: false, component: JobRestaurantManagerTemplate },
  { id: "job-chef", name: "Chef Profesional", description: "Dos columnas creativas para chefs ejecutivos y culinarios.", category: "Creativo", tags: ["Premium", "Creativo"], accent: "#dc2626", ats: false, premium: true, component: JobChefTemplate },
  { id: "job-retail-associate", name: "Asesor de Ventas Retail", description: "Dos columnas para asesores de ventas y retail.", category: "Profesional", tags: ["ATS"], accent: "#7c3aed", ats: true, premium: false, component: JobRetailAssociateTemplate },
  { id: "job-store-manager", name: "Gerente de Tienda", description: "Dos columnas para gerentes de tienda y líderes de retail.", category: "Ejecutivo", tags: ["Premium", "ATS"], accent: "#0f4c81", ats: true, premium: true, component: JobStoreManagerTemplate },
  { id: "job-logistics", name: "Coordinador Logístico", description: "Dos columnas para coordinadores de logística y supply chain.", category: "Profesional", tags: ["Premium", "ATS"], accent: "#0f766e", ats: true, premium: true, component: JobLogisticsTemplate },
  { id: "job-electrician", name: "Electricista", description: "Dos columnas para electricistas industriales y residenciales.", category: "Técnico", tags: ["ATS", "Oficios"], accent: "#f59e0b", ats: true, premium: false, component: JobElectricianTemplate },
  { id: "job-plumber", name: "Plomero / Gasfitero", description: "Dos columnas para plomeros e instaladores hidráulicos.", category: "Técnico", tags: ["ATS", "Oficios"], accent: "#0891b2", ats: true, premium: false, component: JobPlumberTemplate },
  { id: "job-welder", name: "Soldador Industrial", description: "Dos columnas para soldadores industriales certificados AWS.", category: "Técnico", tags: ["ATS", "Oficios"], accent: "#b45309", ats: true, premium: false, component: JobWelderTemplate },
  { id: "job-freelancer", name: "Freelancer Profesional", description: "Dos columnas para freelancers y trabajadores independientes.", category: "Profesional", tags: ["ATS", "Freelance"], accent: "#8b5cf6", ats: true, premium: false, component: JobFreelancerTemplate },
  { id: "job-waiter", name: "Mesero / Garrotero", description: "Dos columnas para meseros y personal de servicio de alimentos.", category: "Profesional", tags: ["ATS"], accent: "#d97706", ats: true, premium: false, component: JobWaiterTemplate },
  { id: "job-bartender", name: "Barman / Bartender", description: "Dos columnas creativas para bartenders y mixólogos certificados.", category: "Creativo", tags: ["ATS", "Creativo"], accent: "#7c3aed", ats: true, premium: false, component: JobBartenderTemplate },
  { id: "job-firefighter", name: "Bombero", description: "Dos columnas formales para bomberos y protección civil.", category: "Profesional", tags: ["ATS"], accent: "#dc2626", ats: true, premium: false, component: JobFirefighterTemplate },
];

export const TEMPLATE_MAP: Record<string, TemplateMeta> = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, t]),
);

export function getTemplate(id: string | null | undefined): TemplateMeta {
  return (id && TEMPLATE_MAP[id]) || TEMPLATES[0];
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Profesional",
  "Ejecutivo",
  "Creativo",
  "Estudiante",
  "Técnico",
  "ATS",
];