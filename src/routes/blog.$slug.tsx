import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar, Clock, Share2, CheckCircle2, XCircle, Sparkles, Check,
  ChevronRight, HelpCircle, Lightbulb, Bookmark, ArrowRight, Briefcase,
  GraduationCap, Laptop, TrendingUp, Palette, Calculator, Users, Award,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const isEjemplos = params.slug === "10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos";

    const title = isEjemplos
      ? "10 ejemplos de currículum vitae para diferentes trabajos (Guía México 2026) | CVAI"
      : "¿Cómo hacer un currículum vitae en México? Guía paso a paso (2026) | CVAI";

    const description = isEjemplos
      ? "Explora 10 ejemplos de currículum vitae reales adaptados a México: estudiantes, sin experiencia, recién egresados, ingenieros, ventas, directivos y trabajo remoto."
      : "Aprende cómo hacer un currículum vitae profesional en México paso a paso. Conoce qué poner, ejemplos reales antes/después, optimización para filtros ATS y formatos recomendados.";

    const canonicalUrl = `https://www.cvai.com.mx/blog/${params.slug}`;

    const articleSchema = isEjemplos
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "10 ejemplos de currículum vitae para diferentes trabajos y perfiles profesionales",
          description: description,
          inLanguage: "es-MX",
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
          author: { "@type": "Organization", name: "Equipo Editorial de CVAI México", url: "https://www.cvai.com.mx" },
          publisher: { "@type": "Organization", name: "CVAI", logo: { "@type": "ImageObject", url: "https://www.cvai.com.mx/logo.png" } },
          datePublished: "2026-09-14",
          dateModified: "2026-09-14",
        }
      : {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "¿Cómo hacer un currículum vitae en México? Guía paso a paso para crear un CV profesional",
          description: description,
          inLanguage: "es-MX",
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
          author: { "@type": "Organization", name: "Equipo Editorial de CVAI México", url: "https://www.cvai.com.mx" },
          publisher: { "@type": "Organization", name: "CVAI", logo: { "@type": "ImageObject", url: "https://www.cvai.com.mx/logo.png" } },
          datePublished: "2026-09-14",
          dateModified: "2026-09-14",
        };

    const faqSchema = isEjemplos
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "¿Cuál de estos 10 formatos de CV es mejor si quiero cambiar de carrera?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "El formato híbrido o funcional es el más recomendado para cambios de carrera, ya que permite destacar habilidades transferibles y proyectos clave antes del historial cronológico.",
              },
            },
            {
              "@type": "Question",
              name: "¿Puedo utilizar el mismo currículum para todas mis postulaciones en México?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No es recomendable enviar el mismo CV genérico. Toma uno de estos 10 ejemplos como base y adapta las palabras clave, herramientas de software y logros a los requisitos exactos de la vacante.",
              },
            },
            {
              "@type": "Question",
              name: "¿Qué tan importante es la longitud de un CV en México?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Para más del 90% de las vacantes en México, 1 sola cuartilla es la extensión ideal. Solo perfiles directivos o especialistas con más de 10 años de trayectoria deben extenderse a 2 páginas.",
              },
            },
            {
              "@type": "Question",
              name: "¿Cómo debe ser el currículum para trabajo remoto en México o para el extranjero?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Debe indicar claramente tu zona horaria (ej. GMT-6), disponibilidad de equipo propio y herramientas de colaboración asíncrona como Slack, Notion, Jira o Zoom.",
              },
            },
          ],
        }
      : {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "¿Es obligatorio poner foto en el currículum vitae en México?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No es obligatorio por ley y las empresas multinacionales con filtros ATS prefieren CVs sin fotografía para evitar sesgos de contratación.",
              },
            },
            {
              "@type": "Question",
              name: "¿Cuántas hojas debe tener un currículum profesional?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "La regla estándar en México es 1 sola cuartilla (página). Si cuentas con más de 8 o 10 años de experiencia relevante, puedes extenderte a 2 páginas como máximo.",
              },
            },
            {
              "@type": "Question",
              name: "¿Debo poner mi CURP, RFC o dirección completa en mi CV?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. Por tu propia seguridad en México, nunca incluyas tu CURP, RFC, estado civil ni la dirección completa con calle y número. Solo indica tu ciudad y estado.",
              },
            },
          ],
        };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(articleSchema) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) },
      ],
    };
  },
  component: BlogPostDetail,
});

function BlogPostDetail() {
  const { slug } = Route.useParams();
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Enlace copiado al portapapeles");
    setTimeout(() => setCopied(false), 2500);
  }

  if (slug === "10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos") {
    return <DiezEjemplosArticle copyLink={copyLink} copied={copied} />;
  }

  return <GuiaHacerCvArticle copyLink={copyLink} copied={copied} />;
}

/* =======================================================================
   ARTICLE 2: 10 EJEMPLOS DE CURRICULUM VITAE
   ======================================================================= */
function DiezEjemplosArticle({ copyLink, copied }: { copyLink: () => void; copied: boolean }) {
  const ejemplos = [
    {
      id: "estudiante",
      num: "1",
      title: "Currículum para estudiante",
      target: "Estudiantes de preparatoria técnica o universidad que buscan prácticas, becas o empleos de medio tiempo compatibles con su horario escolar.",
      structure: "Disponibilidad de turno > Objetivo académico > Educación > Proyectos escolares > Habilidades > Idiomas.",
      summary: "Estudiante de 6° semestre de la Licenciatura en Contaduría Pública en la UNAM, con disponibilidad para turno matutino (medio tiempo). Interés en incorporarse al área de tesorería y cuentas por pagar. Cuento con dominio intermedio de Excel (tablas dinámicas, funciones condicionales) y nociones de CONTPAQi Contabilidad. Comprometido con el aprendizaje continuo y la precisión numérica.",
      experienceTitle: "Proyectos académicos y voluntariado:",
      experience: [
        "Coordinador del Proyecto Integrador de Costos — Facultad de Contaduría (UNAM): Diseñé el modelo de costeo estándar para una microempresa familiar de calzado, identificando un potencial de ahorro del 14% en costos de empaque y distribución.",
        "Miembro del Comité de Registro — Simposio Financiero Universitario: Coordiné el registro y entrega de acreditaciones para más de 350 asistentes mediante formulario digital en Google Forms y validación en Excel.",
      ],
      skills: ["Excel intermedio (Tablas dinámicas, XLOOKUP)", "Google Sheets", "Facturación básica", "Organización del tiempo", "Puntualidad rigurosa"],
      achievements: "Promedio acumulado de 9.3 durante los primeros 5 semestres; 2° lugar en Hackathon de Emprendimiento Universitario 2024.",
      mistakes: "No especificar el semestre en curso ni el turno libre; poner materias irrelevantes de secundaria.",
      tips: "Revisa los horarios de la vacante y escribe explícitamente en el encabezado: 'Disponibilidad matutina de 8:00 a 14:00 hrs'.",
      templateLink: "/student-resume-template",
      templateName: "Plantilla para Estudiantes",
    },
    {
      id: "sin-experiencia",
      num: "2",
      title: "Currículum para persona sin experiencia",
      target: "Personas que buscan su primer empleo formal en México y no cuentan con historial laboral previo registrado en el IMSS.",
      structure: "Datos claros > Perfil enfocado en actitud y aptitudes > Servicio social / Voluntariado > Educación > Habilidades transferibles.",
      summary: "Joven entusiasta, puntual y con facilidad de palabra, en búsqueda de una oportunidad laboral en atención a clientes o soporte operativo. Con bachillerato técnico concluido y experiencia práctica de 480 horas de servicio social en institución pública atendiendo ciudadanos y digitalizando expedientes. Con alta capacidad de escucha activa y manejo ágil de computadora (60 PPM).",
      experienceTitle: "Servicio social y experiencia comunitaria:",
      experience: [
        "Prestador de Servicio Social — DIF Municipal (Toluca, Edo. Méx.): Atendí de manera presencial a un promedio de 35 a 45 ciudadanos al día para la entrega de apoyos comunitarios, resolviendo dudas con trato amable y cero quejas registradas.",
        "Digitalización y Archivo Institucional: Digitalicé y clasifiqué más de 1,400 expedientes físicos en el sistema interno de archivo, concluyendo la meta 3 semanas antes del plazo límite.",
      ],
      skills: ["Mecanografía ágil (65 PPM)", "Office básico", "Atención telefónica", "Resolución de quejas", "Trato cortés y empático"],
      achievements: "Reconocimiento institucional por cumplimiento del 100% de expedientes digitalizados en tiempo récord.",
      mistakes: "Dejar la sección de experiencia en blanco; inventar empleos informales con empresas que no existen.",
      tips: "Cualquier voluntariado, apoyo en el negocio familiar o servicio social cuenta como experiencia real si describes responsabilidades y disciplina.",
      templateLink: "/entry-level-resume-template",
      templateName: "Plantilla Sin Experiencia (Entry-Level)",
    },
    {
      id: "recien-egresado",
      num: "3",
      title: "Currículum para recién egresado",
      target: "Graduados universitarios con menos de 12 meses de haber finalizado sus estudios o en proceso de titulación.",
      structure: "Estatus académico ('Titulado' / 'Pasante') > Perfil con especialidad > Prácticas profesionales > Educación > Software técnico > Idiomas.",
      summary: "Ingeniero Industrial titulado por el Instituto Tecnológico de Monterrey con mención honorífica. Especializado en optimización de procesos de manufactura mediante metodologías Lean y Six Sigma. Experiencia de 12 meses como practicante de ingeniería en planta automotriz, colaborando en la reducción del 18% en tiempos de ciclo en líneas de ensamble. Nivel de inglés avanzado (TOEFL ITP 610 pts).",
      experienceTitle: "Prácticas profesionales e internados:",
      experience: [
        "Practicante de Mejora Continua — Componentes Automotrices de México (Silao, Gto.): Realicé estudios de tiempos y movimientos con metodología Kaizen en 3 líneas de producción, identificando cuellos de botella y estandarizando hojas de operación (SOP).",
        "Implementación 5S en Almacén: Apoyé en la implementación de las 5S en el almacén de herramentales, reduciendo el tiempo de búsqueda de piezas de 15 a 4 minutos por turno.",
      ],
      skills: ["Lean Manufacturing", "Minitab", "AutoCAD", "Excel avanzado", "Mapeo VSM", "Inglés técnico avanzado"],
      achievements: "Tesis de titulación con mención honorífica; promedio general de 9.4; certificación Lean Six Sigma Yellow Belt.",
      mistakes: "Omitir si ya cuentas con cédula o el estatus de la tesis; listar materias en vez de logros de las prácticas.",
      tips: "Si tu promedio fue sobresaliente (arriba de 9.0), colócalo en negritas. Las empresas con programas de 'Trainees' filtran fuertemente por este dato.",
      templateLink: "/fresher-resume-template",
      templateName: "Plantilla para Recién Egresados",
    },
    {
      id: "con-experiencia",
      num: "4",
      title: "Currículum para profesional con experiencia (Mid-Senior)",
      target: "Especialistas con 3 a 8 años de trayectoria continua en un área funcional que aspiran a una jefatura o coordinación.",
      structure: "Titular sénior > Perfil ejecutivo con KPIs > Experiencia cronológica inversa con viñetas numéricas > Educación > Certificaciones.",
      summary: "Especialista en Recursos Humanos y Relaciones Laborales con 7 años de trayectoria en plantas de manufactura en la región Bajío. Experto en administración de clima laboral, gestión de convenios sindicales y cumplimiento de la NOM-035-STPS. Lideré la recertificación de Great Place to Work alcanzando un 88% de satisfacción general y una reducción de rotación voluntaria de 4.5% a 1.8% mensual. Bilingüe (Español/Inglés C1).",
      experienceTitle: "Experiencia laboral comprobada:",
      experience: [
        "Coordinador de Relaciones Laborales — Grupo Manufacturero del Centro (Querétaro, Qro.): Gestioné la relación contractual y negociaciones salariales con la representación sindical para más de 750 trabajadores de planta con cero emplazamientos a huelga en 3 años.",
        "Digitalización de Inducción: Digitalicé el proceso de bienvenida mediante LMS, reduciendo la deserción en los primeros 30 días del 24% al 9%.",
        "Implementación NOM-035: Implementé la NOM-035 en 3 centros de trabajo evitando sanciones de la STPS y mejorando el bienestar laboral.",
      ],
      skills: ["Ley Federal del Trabajo (LFT)", "Negociación sindical", "NOM-035 / NOM-030", "Workday / HRIS", "Retención de talento"],
      achievements: "Reducción del 30% en costos de reclutamiento externo; 0 emplazamientos a huelga en 5 años de gestión.",
      mistakes: "Describir rutinas cotidianas en vez de ahorros económicos o porcentajes de mejora; incluir puestos de hace 15 años.",
      tips: "Revisa las metas del departamento al que aplicas (ej. reducción de costos, automatización) y dale el primer lugar a tus logros relacionados.",
      templateLink: "/senior-professional-resume-template",
      templateName: "Plantilla Profesional Sénior",
    },
    {
      id: "ejecutivo",
      num: "5",
      title: "Currículum para ejecutivo o directivo (C-Level)",
      target: "Directores de área, vicepresidentes, gerentes generales y perfiles directivos con más de 10-15 años de liderazgo.",
      structure: "Resumen con P&L y EBITDA > Gobernanza y estrategia > Logros corporativos por hito > Consejos / Comités > Educación ejecutiva (MBA).",
      summary: "Director de Operaciones (COO) con 15 años de experiencia liderando la expansión y optimización de cadenas de suministro en el sector retail y consumo masivo en México y Latinoamérica. Con responsabilidad comprobada sobre presupuestos operativos de más de $220 MDP y equipos de más de 600 colaboradores. Historial probado de incremento del 5.2% en margen EBITDA mediante automatización de CEDIS y renegociación estratégica de proveedores clave.",
      experienceTitle: "Liderazgo y gestión de negocio:",
      experience: [
        "Director Nacional de Cadena de Suministro — Retail de Alimentos MX: Diseñé y ejecuté el plan estratégico de expansión logística nacional, aperturando 4 centros de distribución regionales y aumentando la cobertura de entrega al 95% del territorio nacional en 24 meses.",
        "Transformación Tecnológica: Lideré la migración del ERP a SAP S/4HANA en tiempo y con un ahorro de $4.8 MDP respecto al presupuesto original aprobado por el Consejo de Administración.",
      ],
      skills: ["Gestión integral de P&L", "Planeación estratégica", "Fusiones y adquisiciones (M&A)", "Gobernanza corporativa", "Liderazgo transformacional"],
      achievements: "Expansión a 4 nuevos estados; ahorro operativo acumulado superior a $32 MDP; incremento de 5.2 puntos en EBITDA.",
      mistakes: "Extender el documento a 4 o 5 hojas; describir tareas de supervisión básica en lugar de impacto en el balance corporativo.",
      tips: "Tu CV debe reflejar cómo hiciste ganar o ahorrar dinero a las empresas a nivel directivo y estratégico.",
      templateLink: "/executive-resume-template",
      templateName: "Plantilla Ejecutiva / CEO",
    },
    {
      id: "ingeniero",
      num: "6",
      title: "Currículum para ingeniero / desarrollo de software",
      target: "Desarrolladores backend, frontend, full-stack, DevOps, ingenieros de datos y arquitectos de software.",
      structure: "Enlaces a GitHub / Portafolio > Stack tecnológico > Competencias por área (Lenguajes, Cloud, BD) > Experiencia con métricas > Educación.",
      summary: "Senior Full Stack Software Engineer con más de 6 años de experiencia diseñando y desplegando aplicaciones web de alta concurrencia en la industria fintech en México. Especialista en TypeScript, React, Node.js y microservicios sobre AWS. Apasionado por la arquitectura limpia, pruebas automatizadas (TDD) y la reducción de latencia en transacciones financieras. Bilingüe (Español / Inglés C1).",
      experienceTitle: "Experiencia técnica y desarrollo:",
      experience: [
        "Senior Backend Developer — Plataforma Fintech MX: Diseñé y desacoplé el módulo de liquidación SPEI a una arquitectura basada en eventos con Node.js, Kafka y Docker, procesando más de 95,000 transacciones diarias con una latencia inferior a 600 ms.",
        "Optimización de Bases de Datos: Optimicé consultas complejas en PostgreSQL e implementé almacenamiento en caché con Redis, reduciendo los tiempos de respuesta de la API en un 68%.",
        "CI/CD y Automatización: Implementé pipelines de CI/CD en GitHub Actions reduciendo el tiempo de despliegue a producción de 45 a 8 minutos con pruebas automatizadas integradas.",
      ],
      skills: ["TypeScript", "React / Next.js", "Node.js / Express", "PostgreSQL / Redis", "Docker / AWS (ECS, Lambda)", "Git / CI-CD"],
      achievements: "Autor de librería interna de componentes de UI; reducción del 30% en costos de infraestructura cloud mediante auto-scaling.",
      mistakes: "No colocar enlaces a repositorios verificables en GitHub; listar 40 tecnologías sin orden de dominio real.",
      tips: "Escribe los términos exactos de las tecnologías que solicita la vacante (ej. 'Docker', 'GraphQL') para que el ATS los lea al 100%.",
      templateLink: "/software-engineer-resume-template",
      templateName: "Plantilla para Ingenieros de Software",
    },
    {
      id: "disenador",
      num: "7",
      title: "Currículum para diseñador gráfico / creativo",
      target: "Diseñadores gráficos, directores de arte, diseñadores UI/UX, ilustradores y profesionales creativos en México.",
      structure: "Enlace prioritario a Portafolio (Behance/Dribbble) > Perfil creativo enfocado en negocio > Software > Campañas con resultados > Educación.",
      summary: "Diseñadora Gráfica y de Comunicación Visual con más de 5 años de experiencia liderando proyectos de branding corporativo, diseño editorial y dirección de arte digital para marcas de consumo en México. Dominio avanzado de Adobe Creative Cloud (Illustrator, Photoshop, InDesign) y diseño de prototipos en Figma. Enfocada en crear sistemas visuales coherentes que fortalecen la identidad de marca y aumentan el engagement comercial.",
      experienceTitle: "Campañas y proyectos destacados:",
      experience: [
        "Diseñadora Gráfica Senior — Agencia de Publicidad Digital (CDMX): Lideré el rediseño integral de empaque (packaging) e identidad visual para 8 marcas del sector alimentos, logrando un aumento promedio del 25% en rotación de producto en anaqueles de retail.",
        "Assets Digitales y Conversión: Diseñé más de 300 piezas gráficas para campañas de Meta Ads y Google Display, optimizando la tasa de clics (CTR) en un 18% respecto al promedio histórico de la agencia.",
      ],
      skills: ["Adobe Illustrator", "Photoshop", "InDesign", "Figma (UI/UX)", "Branding corporativo", "Tipografía y Preprensa", "After Effects básico"],
      achievements: "Campaña de relanzamiento de producto finalista en Premios Effie México; diseño de empaque ganador en certamen nacional.",
      mistakes: "Olvidar el enlace al portafolio o poner un link roto; guardar el CV como imagen plana que el ATS no puede leer.",
      tips: "El CV debe ser sobrio y limpio para que los ATS lo lean sin problemas; deja que la creatividad visual hable en tu enlace de portafolio.",
      templateLink: "/graphic-designer-resume-template",
      templateName: "Plantilla para Diseñador Gráfico",
    },
    {
      id: "administrativo",
      num: "8",
      title: "Currículum para administrativo / contable",
      target: "Contadores públicos, auxiliares contables, administradores de empresas y coordinadores de oficina en México.",
      structure: "Cédula profesional > Perfil orientado a control fiscal y SAT > Experiencia con ERPs > Habilidades fiscales mexicanas > Educación.",
      summary: "Contadora Pública titulada con cédula profesional y más de 6 años de experiencia en contabilidad general, cálculo de impuestos federales y estatales, y emisión de facturación electrónica CFDI 4.0 para personas morales en México. Con dominio comprobado en los sistemas CONTPAQi, portal del SAT y plataformas del IMSS (SUA/IDSE). Enfocada en la disciplina financiera, cumplimiento tributario oportuno y reducción de riesgos en auditorías.",
      experienceTitle: "Contabilidad y gestión fiscal:",
      experience: [
        "Contadora Encargada — Corporativo Comercial de Puebla: Coordiné la contabilidad general de 3 razones sociales, asegurando la presentación puntual de pagos provisionales y declaraciones anuales con 0 requerimientos o multas fiscales ante el SAT.",
        "Nóminas y Seguridad Social: Gestioné la nómina quincenal para más de 90 trabajadores, realizando los cálculos de retenciones de ISR, cuotas IMSS en SUA y dispersión bancaria sin incidencias.",
        "Conciliaciones Bancarias: Realicé conciliaciones bancarias mensuales sobre 12 cuentas empresariales, reduciendo partidas pendientes a menos del 1% mensual.",
      ],
      skills: ["Portal del SAT", "CONTPAQi (Contabilidad/Nóminas)", "SUA / IDSE", "CFDI 4.0", "Excel avanzado (Macros)", "Auditoría interna"],
      achievements: "Recuperación de saldos a favor de IVA por más de $850,000 MXN en un ejercicio fiscal mediante auditoría interna exhaustiva.",
      mistakes: "No mencionar el dominio de las plataformas oficiales mexicanas (SAT, SUA, IDSE); omitir el número de razones sociales administradas.",
      tips: "Especifica si cuentas con cédula profesional expedida por la SEP, ya que es un requisito de filtro para muchos puestos contables.",
      templateLink: "/accountant-resume-template",
      templateName: "Plantilla para Contador y Finanzas",
    },
    {
      id: "ventas",
      num: "9",
      title: "Currículum para ventas y comercial",
      target: "Ejecutivos de cuenta, representantes comerciales B2B y B2C, gerentes de ventas y asesores de crédito o seguros.",
      structure: "Datos claros > Perfil comercial con cumplimiento de cuotas > Experiencia por facturación y cierre > Manejo de CRM > Habilidades comerciales.",
      summary: "Ejecutivo de Ventas B2B con más de 6 años de experiencia en prospección en frío, negociación corporativa y cierre de contratos de alto valor en el sector industrial en México. Historial comprobado de cumplimiento de cuotas anuales por encima del 118%. Dominio avanzado de técnicas de venta consultiva y administración de embudo comercial en Salesforce y HubSpot. Bilingüe (Español/Inglés C1).",
      experienceTitle: "Cierre de negocios y cartera de clientes:",
      experience: [
        "Ejecutivo Comercial Senior — Maquinaria y Suministros Industriales (Monterrey, N.L.): Desarrollé una cartera de más de 45 cuentas corporativas clave en Nuevo León y Coahuila, generando $7.2 MDP en ventas de maquinaria pesada durante 2024 (124% de la meta anual asignada).",
        "Optimización del Ciclo Comercial: Reduje el ciclo promedio de prospección y cierre de 75 a 48 días implementando seguimiento automatizado a través de Salesforce.",
        "Renovación de Contratos: Negocié contratos de mantenimiento plurianuales con un índice de renovación del 92%.",
      ],
      skills: ["Venta consultiva B2B", "Prospección en frío", "Salesforce / HubSpot", "Negociación de contratos", "LinkedIn Sales Navigator"],
      achievements: "Reconocimiento como Vendedor del Año 2023 y 2024; incremento del 35% en recompra de cuentas clave (Key Accounts).",
      mistakes: "No incluir cifras de dinero facturado o porcentajes de cuota; hablar de tareas de oficina en vez de cierres comerciales.",
      tips: "El currículum de ventas se mide por números: cuota asignada vs. cuota lograda, ticket promedio y porcentaje de crecimiento.",
      templateLink: "/sales-executive-resume-template",
      templateName: "Plantilla Ejecutivo de Ventas",
    },
    {
      id: "remoto",
      num: "10",
      title: "Currículum para trabajo remoto / freelancer",
      target: "Profesionistas que postulan a vacantes 100% home office para empresas en México, EE. UU. o Latinoamérica.",
      structure: "Zona horaria (ej. GMT-6) y disponibilidad remota > Perfil enfocado en autogestión > Entregables y herramientas colaborativas > Idiomas.",
      summary: "Especialista en Marketing de Contenidos y Redacción SEO con 5 años de trayectoria trabajando de manera 100% remota para agencias y startups de tecnología en México y Estados Unidos. Capacidad demostrada para autogestionar calendarios editoriales, liderar equipos en distintas zonas horarias y entregar proyectos con un 98% de puntualidad en fechas de entrega. Bilingüe (Español nativo / Inglés C1 con comunicación asíncrona fluida).",
      experienceTitle: "Entregables y trabajo distribuido:",
      experience: [
        "Content Strategist Remoto — Agencia Global de Crecimiento Digital: Diseñé y ejecuté la estrategia de contenidos de blog para 6 clientes internacionales en el sector SaaS, logrando un incremento del 75% en tráfico orgánico calificado en 18 meses.",
        "Gestión Asíncrona Internacional: Coordiné entregables diarios con redactores y diseñadores ubicados en 4 países mediante Notion, Slack y Asana, manteniendo una calificación de satisfacción de clientes del 9.6/10.",
        "Páginas de Conversión: Redacté guiones para webinars y páginas de aterrizaje que incrementaron la tasa de conversión de leads en un 22%.",
      ],
      skills: ["Comunicación asíncrona", "Autogestión del tiempo", "Notion / Slack / Jira", "Redacción SEO", "Google Analytics 4", "Inglés de negocios C1"],
      achievements: "Gestión simultánea de 5 cuentas de clientes internacionales sin retrasos en entregables durante 3 años; generación de 40,000 visitas orgánicas mensuales.",
      mistakes: "No aclarar que cuentas con espacio de trabajo adecuado y equipo propio; olvidar indicar tu zona horaria.",
      tips: "Enfatiza tu habilidad para trabajar de forma autónoma sin necesidad de supervisión constante y menciona las herramientas colaborativas que dominas.",
      templateLink: "/freelancer-resume-template",
      templateName: "Plantilla Freelancer / Remoto",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumbs */}
      <div className="border-b border-border/40 bg-secondary/20">
        <div className="mx-auto max-w-4xl px-4 py-3 text-xs text-muted-foreground">
          <nav className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-xs sm:max-w-md">
              10 ejemplos de currículum vitae para diferentes trabajos
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-gradient-to-b from-secondary/40 to-background py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="default" className="rounded-full px-3 py-0.5 text-xs font-semibold">
              Guía de Ejemplos
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 14 min de lectura
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Actualizado para 2026
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-tight">
            10 ejemplos de currículum vitae para diferentes trabajos y perfiles profesionales
          </h1>

          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Descubre cómo estructurar un currículum vitae exitoso en México según tu profesión y nivel de experiencia. Incluye extractos profesionales, viñetas de logros con métricas, errores a evitar y enlaces a plantillas recomendadas.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                CV
              </div>
              <div>
                <p className="text-sm font-semibold">Equipo Editorial de CVAI</p>
                <p className="text-xs text-muted-foreground">Especialistas en Empleabilidad y ATS en México</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5 text-xs">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? "Enlace copiado" : "Compartir artículo"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Navigation jump pills */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-10 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Bookmark className="h-3.5 w-3.5 text-primary" /> Saltar directamente a un ejemplo:
          </p>
          <div className="flex flex-wrap gap-2">
            {ejemplos.map((e) => (
              <a
                key={e.id}
                href={`#ejemplo-${e.id}`}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground hover:bg-muted/30 transition-all"
              >
                {e.num}. {e.title.replace("Currículum para ", "")}
              </a>
            ))}
          </div>
        </div>

        {/* Introduction */}
        <div className="space-y-4 mb-12 text-foreground/90 leading-relaxed">
          <p className="text-lg font-medium text-foreground">
            No existe un currículum vitae único que funcione para todas las vacantes. El currículum de un estudiante universitario debe enfatizar proyectos y disponibilidad, mientras que el de un contador público debe demostrar cédula y conocimiento de las leyes fiscales mexicanas.
          </p>
          <p>
            A continuación, analizamos **10 ejemplos de currículum vitae** completamente distintos, basados en perfiles reales del mercado mexicano. Puedes tomar cualquiera de estos modelos como punto de partida para armar tu postulación.
          </p>
        </div>

        {/* 10 Detailed Examples */}
        <div className="space-y-16">
          {ejemplos.map((e) => (
            <section
              key={e.id}
              id={`ejemplo-${e.id}`}
              className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm"
            >
              {/* Card Header */}
              <div className="border-b border-border pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs font-bold text-primary border-primary/40">
                    Ejemplo #{e.num}
                  </Badge>
                  <Link to={e.templateLink} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                    Ver plantilla recomendada <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  {e.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong className="text-foreground">A quién va dirigido:</strong> {e.target}
                </p>
              </div>

              {/* Recommended Structure */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs">
                <span className="font-semibold text-foreground">📐 Estructura recomendada: </span>
                <span className="text-muted-foreground">{e.structure}</span>
              </div>

              {/* Professional Summary */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-primary" /> Ejemplo de Perfil Profesional:
                </h3>
                <div className="rounded-xl border-l-4 border-primary bg-primary/5 p-4 text-sm italic text-foreground/90 leading-relaxed">
                  "{e.summary}"
                </div>
              </div>

              {/* Experience Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-primary" /> {e.experienceTitle}
                </h3>
                <div className="rounded-xl border border-border bg-background p-4 space-y-2.5 text-xs leading-relaxed text-muted-foreground">
                  {e.experience.map((exp, idx) => (
                    <p key={idx} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{exp}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Skills & Achievements Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Habilidades Clave:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {e.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="rounded-md border border-border bg-background px-2 py-1 text-[11px] text-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-primary" /> Logros destacados:
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {e.achievements}
                  </p>
                </div>
              </div>

              {/* Mistakes & Adaptation Advice */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2 text-xs">
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 space-y-1">
                  <div className="font-bold text-destructive flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" /> Errores comunes a evitar:
                  </div>
                  <p className="text-muted-foreground">{e.mistakes}</p>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-1">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Cómo adaptarlo a una vacante real:
                  </div>
                  <p className="text-muted-foreground">{e.tips}</p>
                </div>
              </div>

              {/* Action Link to Template */}
              <div className="pt-2 flex justify-end">
                <Link to={e.templateLink}>
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    Usar {e.templateName} <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="mt-16 space-y-6 border-t border-border pt-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" /> Preguntas Frecuentes sobre Ejemplos de CV
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿Cuál de estos 10 formatos es el mejor si quiero cambiar de carrera o industria?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                El formato híbrido o funcional (similar al ejemplo de trabajo remoto o diseñador gráfico) es el más adecuado para transiciones de carrera. Te permite colocar en primer plano tus habilidades transferibles (como liderazgo, negociación, gestión de proyectos o dominio de software) antes de tu historial laboral cronológico.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿Puedo utilizar el mismo currículum para todas las vacantes a las que me postulo?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                No se recomienda. Toma uno de estos 10 ejemplos como base sólida, pero asegúrate de ajustar las palabras clave, los títulos de las habilidades y los logros destacados para que coincidan con la descripción exacta del puesto al que aspiras.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿Qué tan importante es la longitud de un CV en México?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Para el 90% de las vacantes en México, 1 sola cuartilla (página) es el estándar de oro. Solo perfiles ejecutivos con más de 10 años de trayectoria continua o profesionistas con múltiples certificaciones y publicaciones técnicas deben extenderse a 2 páginas. Nunca superes dos hojas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-left text-sm font-semibold">
                ¿Cómo debe ser el currículum si postulo a un puesto remoto para una empresa extranjera?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Debes indicar claramente tu zona horaria (ej. 'GMT-6 / Ciudad de México'), tu nivel de inglés de negocios (B2 o C1) y tu experiencia utilizando herramientas de trabajo colaborativo como Slack, Notion, Jira o Google Workspace.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA Banner */}
        <section className="mt-16 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-8 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">
            Crea tu currículum profesional a partir de estos ejemplos
          </h3>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground">
            En <strong>CVAI</strong> contamos con plantillas prediseñadas para cada uno de estos 10 perfiles y un asistente con inteligencia artificial que redacta tus logros con métricas de impacto.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/plantillas">
              <Button variant="outline">Explorar todas las plantillas</Button>
            </Link>
            <Link to="/curriculum-vitae">
              <Button className="gap-2">
                Crear mi CV con IA ahora <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* =======================================================================
   ARTICLE 1: GUÍA PASO A PASO PARA HACER UN CV EN MÉXICO
   ======================================================================= */
function GuiaHacerCvArticle({ copyLink, copied }: { copyLink: () => void; copied: boolean }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumbs */}
      <div className="border-b border-border/40 bg-secondary/20">
        <div className="mx-auto max-w-4xl px-4 py-3 text-xs text-muted-foreground">
          <nav className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-xs sm:max-w-md">
              ¿Cómo hacer un currículum vitae en México?
            </span>
          </nav>
        </div>
      </div>

      {/* Article Header Hero */}
      <header className="border-b border-border/50 bg-gradient-to-b from-secondary/40 to-background py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="default" className="rounded-full px-3 py-0.5 text-xs font-semibold">
              Guía Completa
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 12 min de lectura
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Actualizado para 2026
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-tight">
            ¿Cómo hacer un currículum vitae en México? Guía paso a paso para crear un CV profesional
          </h1>

          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Aprende a redactar un currículum que supere los filtros automáticos ATS y convenza a los reclutadores en México. Incluye estructura recomendada, ejemplos reales antes/después y consejos prácticos.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                CV
              </div>
              <div>
                <p className="text-sm font-semibold">Equipo Editorial de CVAI</p>
                <p className="text-xs text-muted-foreground">Especialistas en Empleabilidad y ATS en México</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5 text-xs">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? "Enlace copiado" : "Compartir guía"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Article Text (8 cols) */}
          <article className="lg:col-span-8 space-y-8 text-foreground/90 leading-relaxed text-[16px]">
            {/* Introducción */}
            <section className="space-y-4">
              <p className="text-lg leading-relaxed text-foreground font-medium">
                El mercado laboral en México ha cambiado drásticamente. Hoy en día, una vacante publicada en portales como LinkedIn, OCCMundial o Computrabajo puede recibir más de 200 postulaciones en sus primeras 24 horas.
              </p>
              <p>
                Frente a este volumen, los reclutadores dedican en promedio <strong>entre 6 y 8 segundos</strong> a escanear un documento antes de descartarlo o colocarlo en la lista de preseleccionados. Además, cada vez más empresas medianas y grandes en el país filtran los archivos a través de sistemas de seguimiento de candidatos (<strong>ATS</strong>) antes de que un ojo humano los lea.
              </p>
              <p>
                Si buscas aprender <strong>cómo hacer un currículum vitae</strong> competitivo que consiga entrevistas, esta guía te muestra exactamente qué poner, qué evitar, cómo redactar logros con impacto y cómo estructurar un <Link to="/curriculum-vitae" className="font-medium text-primary underline underline-offset-2 hover:opacity-80">currículum vitae profesional</Link> para México.
              </p>
            </section>

            {/* Qué es un CV */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                ¿Qué es un currículum vitae y cuál es su objetivo real?
              </h2>
              <p>
                Un currículum vitae (CV) no es tu autobiografía laboral ni un trámite burocrático. Es, en esencia, un <strong>documento de marketing personal</strong>.
              </p>
              <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-4 text-sm text-foreground/90">
                <p className="font-medium">
                  <strong>Regla de oro:</strong> El objetivo de un currículum no es conseguirte el empleo de forma inmediata, sino <strong>conseguirte la llamada para la primera entrevista</strong>.
                </p>
              </div>
            </section>

            {/* Datos de Contacto */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                1. Datos de contacto: Claridad y privacidad
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                    <CheckCircle2 className="h-4 w-4" /> Lo que SÍ debes poner:
                  </div>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• Nombre completo y apellido(s) legible</li>
                    <li>• Titular profesional (ej. <em>Desarrollador Web Full Stack</em>)</li>
                    <li>• Ciudad y Estado (ej. <em>Querétaro, Qro.</em>)</li>
                    <li>• Celular con clave lada mexicana (+52)</li>
                    <li>• Correo electrónico serio (ej. <code>nombre.apellido@email.com</code>)</li>
                    <li>• Enlace directo a tu perfil de LinkedIn</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-destructive mb-2">
                    <XCircle className="h-4 w-4" /> Lo que NUNCA debes poner:
                  </div>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• Calle, número exterior, interior ni colonia (por seguridad)</li>
                    <li>• Clave CURP ni RFC (solo se piden al firmar contrato)</li>
                    <li>• Estado civil, religión ni afiliación política</li>
                    <li>• Número de Seguridad Social (NSS)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Perfil profesional */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                2. Perfil profesional con fórmula de impacto
              </h2>
              <div className="space-y-3">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-xs">
                  <span className="font-bold text-destructive uppercase tracking-wide">❌ Ejemplo Débil:</span>
                  <p className="mt-1 text-muted-foreground italic">
                    "Soy una persona proactiva, honesta y trabajadora, con disposición de aprender y adaptarme a cualquier ambiente de trabajo en una empresa que me permita crecer."
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">✅ Ejemplo Profesional:</span>
                  <p className="mt-1 text-foreground font-medium">
                    "Licenciado en Administración y Finanzas con más de 6 años de experiencia en gestión de tesorería y cuentas por cobrar en el sector logístico mexicano. Implementé la conciliación bancaria automatizada reduciendo los cierres contables de 7 a 2 días hábiles. Bilingüe (Español/Inglés C1) y con dominio avanzado de SAP y Excel."
                  </p>
                </div>
              </div>
            </section>

            {/* Optimización ATS */}
            <section className="space-y-4 border-t border-border/50 pt-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                3. Optimización para filtros ATS
              </h2>
              <p>
                Usa encabezados universales, exporta siempre en PDF estándar con texto seleccionable y evita elementos gráficos complejos como barras de porcentaje.
              </p>
              <p className="text-sm">
                Comprueba la compatibilidad de tu archivo con nuestro <Link to="/ats-checker" className="text-primary underline font-medium">verificador ATS gratuito</Link>.
              </p>
            </section>

            {/* Bottom CTA Card */}
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-8 text-center space-y-4 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Crea tu currículum profesional con Inteligencia Artificial
              </h3>
              <p className="mx-auto max-w-lg text-sm text-muted-foreground">
                En <strong>CVAI</strong> te ayudamos a redactar viñetas de logros con métricas, elegir plantillas optimizadas para filtros ATS y descargar tu CV en minutos.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link to="/plantillas">
                  <Button variant="outline">Ver plantillas de CV</Button>
                </Link>
                <Link to="/curriculum-vitae">
                  <Button className="gap-2">
                    Crear mi currículum ahora <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-primary" /> Recursos destacados
              </h3>
              <div className="space-y-2 text-xs">
                <Link to="/blog/$slug" params={{ slug: "10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos" }} className="block font-medium text-foreground hover:text-primary">
                  → 10 Ejemplos de CV para diferentes trabajos
                </Link>
                <Link to="/ats-checker" className="block text-muted-foreground hover:text-primary">
                  → Verificador ATS Gratuito
                </Link>
                <Link to="/plantillas" className="block text-muted-foreground hover:text-primary">
                  → Plantillas de CV para México
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
