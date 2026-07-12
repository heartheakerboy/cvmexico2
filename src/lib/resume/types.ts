import type { ReactElement } from "react";

// Normalized resume document model shared by every template.
// This is intentionally template-agnostic: templates only READ this data,
// so new templates can be added without touching the data model.

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
};

export type EducationItem = {
  degree: string;
  school: string;
  period: string;
  location: string;
  description: string;
};

export type ProjectItem = { name: string; description: string; link: string; period: string };
export type LanguageItem = { name: string; level: string };
export type CertItem = { name: string; issuer: string; year: string };
export type AwardItem = { name: string; issuer: string; year: string };
export type ReferenceItem = { name: string; relation: string; contact: string };
export type SocialItem = { label: string; url: string };

export type ResumeDoc = {
  full_name: string;
  headline: string;
  photo_url: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  languages: LanguageItem[];
  certifications: CertItem[];
  awards: AwardItem[];
  references: ReferenceItem[];
  interests: string[];
  socials: SocialItem[];
};

export type FontId = "sans" | "serif" | "grotesk" | "mono";

export type Design = {
  accent: string;
  headingFont: FontId;
  bodyFont: FontId;
  fontScale: number; // 0.9 - 1.15
  margin: number; // page padding in mm
  spacing: number; // section gap multiplier 0.8 - 1.4
  showIcons: boolean;
  paper: "a4" | "letter";
};

export type SectionKey =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "languages"
  | "certifications"
  | "awards"
  | "references"
  | "interests"
  | "socials";

export type Layout = {
  order: SectionKey[];
  hidden: SectionKey[];
};

export const ALL_SECTIONS: SectionKey[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "languages",
  "certifications",
  "awards",
  "references",
  "interests",
  "socials",
];

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Resumen profesional",
  experience: "Experiencia",
  education: "Educación",
  skills: "Habilidades",
  projects: "Proyectos",
  languages: "Idiomas",
  certifications: "Certificaciones",
  awards: "Premios",
  references: "Referencias",
  interests: "Intereses",
  socials: "Redes sociales",
};

export const FONT_STACKS: Record<FontId, string> = {
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  grotesk: "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif",
  mono: "'SFMono-Regular', 'Courier New', monospace",
};

export const FONT_LABELS: Record<FontId, string> = {
  sans: "Neutra (Sans)",
  serif: "Clásica (Serif)",
  grotesk: "Moderna (Grotesk)",
  mono: "Técnica (Mono)",
};

export const emptyDoc: ResumeDoc = {
  full_name: "",
  headline: "",
  photo_url: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
  certifications: [],
  awards: [],
  references: [],
  interests: [],
  socials: [],
};

export const defaultLayout: Layout = {
  order: [...ALL_SECTIONS],
  hidden: ["references", "interests", "awards"],
};

export function makeDefaultDesign(accent: string): Design {
  return {
    accent,
    headingFont: "sans",
    bodyFont: "sans",
    fontScale: 1,
    margin: 14,
    spacing: 1,
    showIcons: true,
    paper: "a4",
  };
}

// Merge partial persisted values with sane defaults so older resumes still work.
export function normalizeDoc(partial: Partial<ResumeDoc>): ResumeDoc {
  return { ...emptyDoc, ...partial };
}

export function normalizeLayout(partial: Partial<Layout> | null | undefined): Layout {
  const order = partial?.order?.length ? partial.order : [...ALL_SECTIONS];
  // ensure every section is present exactly once
  const seen = new Set(order);
  const full = [...order, ...ALL_SECTIONS.filter((s) => !seen.has(s))];
  return { order: full, hidden: partial?.hidden ?? [] };
}

export function sectionHasContent(doc: ResumeDoc, key: SectionKey): boolean {
  switch (key) {
    case "summary":
      return !!doc.summary.trim();
    case "experience":
      return doc.experience.length > 0;
    case "education":
      return doc.education.length > 0;
    case "skills":
      return doc.skills.length > 0;
    case "projects":
      return doc.projects.length > 0;
    case "languages":
      return doc.languages.length > 0;
    case "certifications":
      return doc.certifications.length > 0;
    case "awards":
      return doc.awards.length > 0;
    case "references":
      return doc.references.length > 0;
    case "interests":
      return doc.interests.length > 0;
    case "socials":
      return doc.socials.length > 0;
  }
}

export function visibleSections(doc: ResumeDoc, layout: Layout): SectionKey[] {
  return layout.order.filter((s) => !layout.hidden.includes(s) && sectionHasContent(doc, s));
}

export type TemplateProps = {
  doc: ResumeDoc;
  design: Design;
  layout: Layout;
};

export type TemplateComponent = (props: TemplateProps) => ReactElement;