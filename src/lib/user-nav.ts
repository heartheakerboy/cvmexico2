import {
  LayoutDashboard,
  FileText,
  Sparkles,
  LayoutTemplate,
  Mail,
  ShieldCheck,
  MessagesSquare,
  Wrench,
  Briefcase,
  User,
  Download,
  CreditCard,
  Settings,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export type UserNavItem = {
  label: string;
  labelKey: string;
  to: string;
  icon: LucideIcon;
  keywords?: string;
};

export type UserNavGroup = {
  label: string;
  labelKey: string;
  items: UserNavItem[];
};

export const userNav: UserNavGroup[] = [
  {
    label: "Principal",
    labelKey: "nav.group.main",
    items: [
      { label: "Inicio", labelKey: "nav.home", to: "/panel", icon: LayoutDashboard, keywords: "dashboard resumen" },
      { label: "Mis CV", labelKey: "nav.myResumes", to: "/panel/curriculums", icon: FileText, keywords: "curriculums resumes" },
      { label: "Constructor con IA", labelKey: "nav.aiBuilder", to: "/panel/ia", icon: Sparkles, keywords: "ai inteligencia artificial generar" },
      { label: "Plantillas", labelKey: "nav.templates", to: "/panel/plantillas", icon: LayoutTemplate, keywords: "templates diseños" },
    ],
  },
  {
    label: "Herramientas",
    labelKey: "nav.group.tools",
    items: [
      { label: "Cartas de presentación", labelKey: "nav.coverLetters", to: "/panel/cartas", icon: Mail, keywords: "cover letter" },
      { label: "Verificador ATS", labelKey: "nav.ats", to: "/panel/ats", icon: ShieldCheck, keywords: "score compatibilidad" },
      { label: "Preparación de entrevista", labelKey: "nav.interviewPrep", to: "/panel/entrevistas", icon: MessagesSquare, keywords: "interview mock" },
      { label: "Herramientas de carrera", labelKey: "nav.careerTools", to: "/panel/herramientas", icon: Wrench, keywords: "generadores utilidades" },
    ],
  },
  {
    label: "Carrera",
    labelKey: "nav.group.career",
    items: [
      { label: "Seguimiento de empleos", labelKey: "nav.jobTracker", to: "/panel/empleos", icon: Briefcase, keywords: "jobs postulaciones" },
      { label: "Mi perfil", labelKey: "nav.myProfile", to: "/panel/perfil", icon: User, keywords: "profile datos" },
      { label: "Centro de descargas", labelKey: "nav.downloads", to: "/panel/descargas", icon: Download, keywords: "downloads pdf docx" },
    ],
  },
  {
    label: "Cuenta",
    labelKey: "nav.group.account",
    items: [
      { label: "Suscripción", labelKey: "nav.subscription", to: "/panel/cuenta", icon: CreditCard, keywords: "billing facturas plan" },
      { label: "Ajustes", labelKey: "nav.settingsItem", to: "/panel/ajustes", icon: Settings, keywords: "settings preferencias" },
      { label: "Ayuda", labelKey: "nav.helpItem", to: "/panel/ayuda", icon: LifeBuoy, keywords: "soporte faq" },
    ],
  },
];

export const allUserNavItems: UserNavItem[] = userNav.flatMap((g) => g.items);
