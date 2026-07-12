import type { ResumeDoc } from "./types";

export const sampleDoc: ResumeDoc = {
  full_name: "María Fernanda López",
  headline: "Gerente de Proyectos",
  photo_url: "",
  email: "maria.lopez@correo.com",
  phone: "+52 55 1234 5678",
  location: "Ciudad de México",
  website: "mariafernanda.mx",
  summary:
    "Profesional con más de 8 años de experiencia liderando equipos multidisciplinarios y entregando proyectos de alto impacto dentro de tiempo y presupuesto.",
  experience: [
    { role: "Gerente de Proyectos", company: "Grupo Innova", period: "2020 — Actual", location: "CDMX", description: "Dirección de un portafolio de 12 proyectos, reduciendo costos en 18%." },
    { role: "Coordinadora", company: "Tech Solutions", period: "2016 — 2020", location: "Monterrey", description: "Implementación de metodologías ágiles en 5 equipos." },
  ],
  education: [
    { degree: "Lic. en Administración", school: "UNAM", period: "2011 — 2015", location: "CDMX", description: "" },
  ],
  skills: ["Liderazgo", "Scrum", "Presupuestos", "Negociación", "Power BI"],
  projects: [{ name: "Transformación digital", description: "Migración a la nube de procesos clave.", link: "", period: "2022" }],
  languages: [{ name: "Español", level: "Nativo" }, { name: "Inglés", level: "Avanzado" }],
  certifications: [{ name: "PMP", issuer: "PMI", year: "2021" }],
  awards: [],
  references: [],
  interests: ["Viajes", "Fotografía"],
  socials: [{ label: "LinkedIn", url: "linkedin.com/in/mariaflopez" }],
};