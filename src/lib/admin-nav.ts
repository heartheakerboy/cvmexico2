import {
  LayoutDashboard,
  Users,
  CreditCard,
  LayoutTemplate,
  Sparkles,
  Newspaper,
  Search,
  Image,
  Mail,
  Bell,
  LifeBuoy,
  BarChart3,
  ShieldCheck,
  Handshake,
  Megaphone,
  Briefcase,
  Download,
  Server,
  Settings,
  Languages,
  Activity,
  Scale,
  HardDrive,
  MapPin,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  keywords?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const adminNav: NavGroup[] = [
  {
    label: "General",
    items: [
      { label: "Dashboard", to: "/admin", icon: LayoutDashboard, keywords: "inicio kpi metricas" },
      { label: "Users", to: "/admin/usuarios", icon: Users, keywords: "users clientes cuentas" },
      { label: "Subscriptions", to: "/admin/suscripciones", icon: CreditCard, keywords: "planes pagos revenue billing" },
      { label: "Analytics", to: "/admin/analitica", icon: BarChart3, keywords: "analytics funnels retencion" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Templates", to: "/admin/plantillas", icon: LayoutTemplate, keywords: "templates cv plantillas" },
      { label: "Blog", to: "/admin/blog", icon: Newspaper, keywords: "articulos cms posts" },
      { label: "Legal Pages", to: "/admin/paginas-legales", icon: Scale, keywords: "terminos privacidad legal cookies" },
      { label: "SEO", to: "/admin/seo", icon: Search, keywords: "meta sitemap redirects" },
      { label: "Media", to: "/admin/media", icon: Image, keywords: "imagenes archivos biblioteca" },
      { label: "Jobs", to: "/admin/empleos", icon: Briefcase, keywords: "ocupaciones skills salarios empleos" },
      { label: "Cities", to: "/admin/ciudades", icon: MapPin, keywords: "cities ciudades localizacion mexico seo" },
    ],
  },
  {
    label: "Growth",
    items: [
      { label: "AI", to: "/admin/ia", icon: Sparkles, keywords: "prompts modelos creditos openai ia" },
      { label: "AI Usage", to: "/admin/ia-uso", icon: Activity, keywords: "consumo tokens creditos costo uso ia usuarios historial" },
      { label: "Email Marketing", to: "/admin/emails", icon: Mail, keywords: "smtp plantillas broadcast campanas newsletter marketing suscriptores" },
      { label: "Notifications", to: "/admin/notificaciones", icon: Bell, keywords: "push announcements notificaciones" },
      { label: "Marketing", to: "/admin/marketing", icon: Megaphone, keywords: "landing testimonios campanas" },
      { label: "Affiliates", to: "/admin/afiliados", icon: Handshake, keywords: "comisiones referidos payouts afiliados" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Support", to: "/admin/soporte", icon: LifeBuoy, keywords: "tickets chat feedback soporte" },
      { label: "Security", to: "/admin/seguridad", icon: ShieldCheck, keywords: "roles permisos auditoria 2fa seguridad" },
      { label: "Exports", to: "/admin/exportaciones", icon: Download, keywords: "export csv datos exportaciones" },
      { label: "Storage", to: "/admin/almacenamiento", icon: HardDrive, keywords: "storage r2 archivos cache" },
      { label: "System", to: "/admin/sistema", icon: Server, keywords: "cron logs backup salud sistema" },
      { label: "Settings", to: "/admin/configuracion", icon: Settings, keywords: "general branding flags configuracion" },
      { label: "Translations", to: "/admin/traducciones", icon: Languages, keywords: "idiomas i18n traducciones idioma multilingue" },
    ],
  },
];

export const allNavItems: NavItem[] = adminNav.flatMap((g) => g.items);