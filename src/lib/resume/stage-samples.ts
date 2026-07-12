import type { ResumeDoc } from "./types";

export const studentSample: ResumeDoc = {
  full_name: "Sofía Martínez Valenzuela",
  headline: "Estudiante de Lic. en Psicología",
  photo_url: "",
  email: "sofia.martinez@comunidad.unam.mx",
  phone: "+52 55 5566 7788",
  location: "Ciudad de México",
  website: "",
  summary: "Estudiante de octavo semestre de Psicología con promedio sobresaliente (9.6). Orientada al área de Psicología Clínica y Educativa. Experiencia activa en proyectos de voluntariado de salud mental comunitaria y coordinación de grupos de estudio estudiantiles. Busco iniciar mi servicio social o prácticas profesionales en instituciones orientadas al desarrollo social.",
  experience: [],
  education: [
    {
      degree: "Licenciatura en Psicología (8° Semestre)",
      school: "Universidad Nacional Autónoma de México (UNAM)",
      period: "2022 — Presente",
      location: "CDMX",
      description: "Promedio general actual: 9.6. Coordinadora de la Sociedad de Alumnos de la Facultad."
    }
  ],
  skills: ["Empatía y Escucha Activa", "Facilitación de Grupos", "Investigación Académica", "Evaluación Psicométrica Básica", "Redacción de Informes", "Trabajo en Equipo", "Gestión del Tiempo"],
  projects: [
    {
      name: "Taller 'Salud Mental en tu Escuela'",
      description: "Diseño e impartición de talleres de manejo de ansiedad para alumnos de primer ingreso en el CCH Sur.",
      link: "",
      period: "2024"
    },
    {
      name: "Investigación sobre Adicciones Tecnológicas",
      description: "Proyecto de investigación final para la materia de Metodología de la Investigación, aplicando 150 encuestas digitales.",
      link: "",
      period: "2023"
    }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Intermedio-Avanzado (B2)" }
  ],
  certifications: [
    { name: "Beca de Excelencia Académica Fundación UNAM", issuer: "Fundación UNAM", year: "2023" }
  ],
  awards: [
    { name: "Primer Lugar en el Foro de Proyectos Comunitarios", issuer: "Facultad de Psicología UNAM", year: "2024" }
  ],
  references: [],
  interests: ["Lectura Pedagógica", "Pintura al Óleo", "Voluntariado Animalista"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/sofia-martinez-psico" }
  ]
};

export const fresherSample: ResumeDoc = {
  full_name: "Ing. Diego Torres Esparza",
  headline: "Recién Graduado en Ingeniería Mecatrónica",
  photo_url: "",
  email: "diego.torres@mecatronica.mx",
  phone: "+52 33 4455 6677",
  location: "Guadalajara, Jal.",
  website: "github.com/diegotorresmec",
  summary: "Ingeniero Mecatrónico recién egresado con sólida formación teórica y práctica en automatización industrial, robótica y diseño asistido por computadora (CAD). Proactivo, con capacidad analítica y experiencia práctica adquirida en proyectos de robótica estudiantil y prácticas profesionales enfocadas en mejora de líneas de ensamblaje.",
  experience: [
    {
      role: "Practicante de Ingeniería y Automatización",
      company: "Flex México",
      period: "Ene 2024 — Jun 2024",
      location: "Guadalajara, Jal.",
      description: "Apoyo en el mantenimiento preventivo de brazos robóticos KUKA en la línea automotriz. Colaboré en el diseño de un herramental en SolidWorks que redujo el desperdicio de soldadura en un 8%."
    }
  ],
  education: [
    {
      degree: "Ingeniería en Mecatrónica",
      school: "Universidad de Guadalajara (UDG)",
      period: "2019 — 2023",
      location: "Guadalajara, Jal.",
      description: "Especialización en Automatización Industrial. Graduado en modalidad de excelencia académica."
    }
  ],
  skills: ["Programación PLC (Siemens)", "SolidWorks / CAD", "Electrónica Analógica y Digital", "Mantenimiento Industrial", "Control de Motores", "C++ / Python", "Trabajo Bajo Presión", "Resolución de Problemas"],
  projects: [
    {
      name: "Robot Clasificador con Visión Artificial",
      description: "Diseño y programación de un robot cartesiano capaz de clasificar objetos por color mediante procesamiento de imágenes con OpenCV.",
      link: "",
      period: "2023"
    }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Intermedio (B2)" }
  ],
  certifications: [
    { name: "Certificación CSWA en SolidWorks", issuer: "Dassault Systèmes", year: "2023" },
    { name: "Diplomado en PLC Avanzado", issuer: "Siemens Cooperación Académica", year: "2022" }
  ],
  awards: [],
  references: [],
  interests: ["Impresión 3D", "Robótica de Competición", "Fútbol"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/diego-torres-mec" },
    { label: "GitHub", url: "github.com/diegotorresmec" }
  ]
};

export const internshipSample: ResumeDoc = {
  full_name: "Daniela Rivas Peralta",
  headline: "Estudiante de Negocios Internacionales - Candidata a Prácticas",
  photo_url: "",
  email: "daniela.rivas@negocios.mx",
  phone: "+52 81 1122 3344",
  location: "Monterrey, N.L.",
  website: "",
  summary: "Estudiante de penúltimo semestre de Negocios Internacionales con excelente dominio del inglés. Busco integrarme en un programa de prácticas en las áreas de logística, compras o comercio exterior. Con amplios conocimientos teóricos en cadenas de suministro globales, aranceles aduaneros y regulaciones de exportación.",
  experience: [],
  education: [
    {
      degree: "Licenciatura en Negocios Internacionales (7° Semestre)",
      school: "Tecnológico de Monterrey (ITESM)",
      period: "2022 — Presente",
      location: "Monterrey, N.L.",
      description: "Beca de talento académico del 40%. Promedio actual de 9.4."
    }
  ],
  skills: ["Comercio Exterior", "Análisis de Datos (Excel)", "Logística y Cadena de Suministro", "Trámites Aduaneros Básicos", "Organización Excepcional", "Negociación Básica", "Trabajo Multidisciplinario"],
  projects: [
    {
      name: "Plan de Exportación de Aguacate a Japón",
      description: "Proyecto integrador escolar en el cual se desarrolló toda la logística, costos, aranceles e incoterms aplicables para exportar 5 toneladas de aguacate.",
      link: "",
      period: "2023"
    }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado / Fluido (C1)" }
  ],
  certifications: [
    { name: "Curso de Incoterms 2020 y Logística Marítima", issuer: "Asociación Mexicana de Logística", year: "2023" }
  ],
  awards: [],
  references: [],
  interests: ["Economía Mundial", "Aprender Francés", "Lectura de Negocios"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/daniela-rivas-negocios" }
  ]
};

export const entryLevelSample: ResumeDoc = {
  full_name: "Lic. Carlos Guzmán Montes",
  headline: "Asistente de Marketing Digital Junior",
  photo_url: "",
  email: "carlos.guzman@mktjunior.mx",
  phone: "+52 55 9988 7766",
  location: "Ciudad de México",
  website: "",
  summary: "Licenciado en Mercadotecnia con 2 años de experiencia profesional enfocado en la gestión de redes sociales, creación de campañas de email marketing y monitoreo de métricas de tráfico web. Proactivo y creativo, con dominio de herramientas publicitarias de Meta y Google Ads.",
  experience: [
    {
      role: "Asistente de Marketing y Redes Sociales",
      company: "Agencia Creativa DigitalMX",
      period: "2022 — Actual",
      location: "CDMX",
      description: "Responsable de la redacción de copys y diseño básico de contenidos para 5 cuentas comerciales. Aumenté el engagement general de las cuentas en un 20% promedio en 12 meses. Soporte en la ejecución de campañas pagadas."
    },
    {
      role: "Becario de Mercadotecnia",
      company: "Distribuidora de Alimentos Alfa",
      period: "2021 — 2022",
      location: "CDMX",
      description: "Apoyo en el análisis de mercado de la competencia y en la actualización semanal de las bases de datos de clientes potenciales para envíos de newsletter masivo."
    }
  ],
  education: [
    {
      degree: "Licenciatura en Mercadotecnia",
      school: "Universidad Autónoma Metropolitana (UAM)",
      period: "2017 — 2021",
      location: "CDMX",
      description: "Orientación en Marketing Digital y Analítica Web."
    }
  ],
  skills: ["Gestión de Redes Sociales", "Meta Ads / Google Ads (Básico)", "Copywriting & Redacción", "Diseño Básico (Canva / Photoshop)", "Email Marketing (Mailchimp)", "Monitoreo de Métricas (GA4)", "Pensamiento Creativo", "Atención al Detalle"],
  projects: [],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Intermedio (B2)" }
  ],
  certifications: [
    { name: "Certificación de Meta Certified Digital Marketing Associate", issuer: "Meta Blueprint", year: "2023" },
    { name: "Google Analytics 4 Individual Qualification", issuer: "Google Skillshop", year: "2022" }
  ],
  awards: [],
  references: [],
  interests: ["Tendencias Tecnológicas", "Podcasts de Emprendimiento", "Fotografía Urbana"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/carlos-guzman-mkt" }
  ]
};

export const midLevelSample: ResumeDoc = {
  full_name: "Lic. Mariana Ortega Solís",
  headline: "Analista de Inteligencia de Negocios y Base de Datos",
  photo_url: "",
  email: "mariana.ortega@bi-analyst.mx",
  phone: "+52 55 1234 8765",
  location: "Ciudad de México",
  website: "",
  summary: "Profesional de Análisis de Datos con 5 años de trayectoria transformando bases de datos complejas en tableros de control interactivos y reportes estratégicos accionables. Experta en SQL, Power BI, Python y modelado de datos corporativo. Enfocada en la optimización de procesos y toma de decisiones basadas en datos.",
  experience: [
    {
      role: "Analista de Inteligencia de Negocios Senior",
      company: "Grupo Bimbo",
      period: "2021 — Actual",
      location: "CDMX",
      description: "Diseño e implementación de 8 tableros globales en Power BI para el monitoreo de ventas regionales en tiempo real, logrando reducir el tiempo de generación de reportes en un 60%. Optimización de consultas SQL complejas en bases corporativas."
    },
    {
      role: "Analista de Datos Junior",
      company: "Servicios Financieros Alfa",
      period: "2019 — 2021",
      location: "CDMX",
      description: "Desarrollo de análisis predictivos de pérdida de clientes utilizando Python. Limpieza, transformación y carga de datos (procesos ETL)."
    }
  ],
  education: [
    {
      degree: "Licenciatura en Actuaría",
      school: "Universidad Nacional Autónoma de México (UNAM)",
      period: "2014 — 2018",
      location: "CDMX",
      description: "Especialización en Estadística y Modelación Matemática."
    }
  ],
  skills: ["Análisis de Datos SQL (Oracle / SQL Server)", "Visualización en Power BI & Tableau", "Programación en Python (Pandas / NumPy)", "Procesos ETL / Integración de Datos", "Modelado de Bases de Datos", "Análisis Financiero", "Liderazgo de Proyectos BI", "Comunicación Asertiva"],
  projects: [
    {
      name: "Automatización de Reportes de Logística",
      description: "Migración de reportes en hojas de cálculo manuales a un flujo automático automatizado con Python y bases de datos centralizadas.",
      link: "",
      period: "2022"
    }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado (B2)" }
  ],
  certifications: [
    { name: "Microsoft Certified: Power BI Data Analyst Associate", issuer: "Microsoft", year: "2023" },
    { name: "Professional Data Engineer", issuer: "Google Cloud", year: "2022" }
  ],
  awards: [],
  references: [],
  interests: ["Inteligencia Artificial", "Ciclismo Urbano", "Ajedrez"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/mariana-ortega-bi" }
  ]
};

export const seniorSample: ResumeDoc = {
  full_name: "Ing. Patricia Delgado Luna",
  headline: "Directora de Operaciones de Manufactura Senior",
  photo_url: "",
  email: "patricia.delgado@operacionesmx.com",
  phone: "+52 81 7766 5544",
  location: "Monterrey, N.L.",
  website: "",
  summary: "Directora de Operaciones con más de 12 años de experiencia liderando plantas de manufactura automotriz y aeroespacial en México. Especialista en la implementación de metodologías Lean Manufacturing, Six Sigma, optimización de cadena de suministro y dirección de más de 200 empleados directos y jefaturas de departamento.",
  experience: [
    {
      role: "Gerente General de Planta",
      company: "Nemak México",
      period: "2018 — Actual",
      location: "Monterrey, N.L.",
      description: "Dirección de operaciones generales de manufactura automotriz con presupuesto anual de $12M USD. Reduje el desperdicio (Scrap) de la planta en un 18% e implementé un programa de seguridad industrial que acumuló 500 días sin accidentes de trabajo graves."
    },
    {
      role: "Gerente de Manufactura y Mejora Continua",
      company: "Katcon México",
      period: "2012 — 2018",
      location: "Santa Catarina, N.L.",
      description: "Liderazgo de proyectos Kaizen y Kaizen Blitz en líneas de ensamble. Reestructuración del flujo de materiales del almacén central, optimizando los costos de almacenamiento en un 12%."
    }
  ],
  education: [
    {
      degree: "Maestría en Dirección de Operaciones Industriales",
      school: "Tecnológico de Monterrey (ITESM)",
      period: "2014 — 2016",
      location: "Monterrey, N.L.",
      description: "Especialización en Automatización y Logística."
    },
    {
      degree: "Ingeniería Industrial y de Sistemas",
      school: "Universidad Autónoma de Nuevo León (UANL)",
      period: "2007 — 2011",
      location: "Monterrey, N.L.",
      description: "Graduada con Honores por desempeño sobresaliente."
    }
  ],
  skills: ["Dirección de Operaciones Industriales", "Metodología Lean Six Sigma", "Control de Presupuestos (CAPEX / OPEX)", "Administración de Cadena de Suministro", "Gestión del Clima Laboral y Sindicatos", "Normas de Calidad (IATF 16949 / ISO 9001)", "Optimización de Inventarios", "Liderazgo Estratégico"],
  projects: [],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado / Fluido Comercial (C1)" }
  ],
  certifications: [
    { name: "Certificación Six Sigma Black Belt", issuer: "ASQ (American Society for Quality)", year: "2020" },
    { name: "Certificado en Lean Manufacturing Practitioner", issuer: "SME", year: "2015" }
  ],
  awards: [
    { name: "Premio Estatal a la Productividad Nemak", issuer: "Gobierno del Estado de N.L.", year: "2022" }
  ],
  references: [],
  interests: ["Innovación Industrial", "Lectura de Negocios", "Maratones"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/patricia-delgado-ops" }
  ]
};

export const executiveSample: ResumeDoc = {
  full_name: "Lic. Carlos Villanueva Rincón",
  headline: "Vicepresidente Ejecutivo de Finanzas y Estrategia B2B",
  photo_url: "",
  email: "c.villanueva@corporativov.com",
  phone: "+52 55 8800 7711",
  location: "Ciudad de México",
  website: "",
  summary: "Ejecutivo Financiero Senior con más de 15 años de trayectoria corporativa liderando la planeación fiscal internacional, reestructuraciones de deuda, y fusiones y adquisiciones (M&A) para consorcios multinacionales en América Latina. Consejero de administración y estratega enfocado en maximizar el valor de los accionistas.",
  experience: [
    {
      role: "Vicepresidente de Finanzas (CFO)",
      company: "Grupo Alfa Corporativo",
      period: "2019 — Actual",
      location: "CDMX",
      description: "Dirección de la estrategia financiera global de un grupo industrial con ventas superiores a $150M USD anuales. Diseñé una reestructuración de deuda bancaria por $45M USD, reduciendo el costo financiero ponderado en 120 puntos base. Lideré la adquisición de dos competidores directos en Centroamérica."
    },
    {
      role: "Director Ejecutivo de Planeación Financiera",
      company: "Cemex Corporativo",
      period: "2011 — 2019",
      location: "San Pedro Garza García, N.L.",
      description: "Supervisión de equipos de tesorería internacional, presupuestación global y evaluación de proyectos de inversión inmobiliaria de infraestructura a gran escala."
    }
  ],
  education: [
    {
      degree: "Maestría en Administración de Empresas (MBA)",
      school: "IPADE Business School",
      period: "2013 — 2015",
      location: "CDMX",
      description: "Programa de Dirección Ejecutiva."
    },
    {
      degree: "Licenciatura en Administración Financiera",
      school: "Tecnológico de Monterrey (ITESM)",
      period: "2004 — 2008",
      location: "Monterrey, N.L.",
      description: "Excelencia académica y mejor promedio de generación."
    }
  ],
  skills: ["Fusiones y Adquisiciones (M&A)", "Planeación Financiera Estratégica", "Restructuración de Deuda y Tesorería", "Gobierno Corporativo y Consejo de Admin.", "Fiscalidad Internacional", "Estrategia B2B de Gran Escala", "Liderazgo de Equipos Directivos", "Relaciones con Inversionistas"],
  projects: [],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Bilingüe (C2)" }
  ],
  certifications: [
    { name: "Consejero Profesional Independiente Certificado", issuer: "Instituto Mexicano de Mejores Prácticas", year: "2021" }
  ],
  awards: [
    { name: "Ejecutivo de Finanzas Sobresaliente IMEF", issuer: "IMEF (Instituto Mexicano de Ejecutivos de Finanzas)", year: "2023" }
  ],
  references: [],
  interests: ["Gobierno Corporativo", "Colección de Arte", "Golf"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/carlos-villanueva-cfo" }
  ]
};

export const ceoSample: ResumeDoc = {
  full_name: "Ing. Roberto Alarcón Salazar",
  headline: "Director General Ejecutor (CEO) y Consejero de Administración",
  photo_url: "",
  email: "roberto.alarcon@ceomx.com",
  phone: "+52 55 1133 5577",
  location: "Ciudad de México",
  website: "",
  summary: "Director General (CEO) de alto impacto con 18 años de experiencia liderando la transformación digital y comercial de corporativos líderes en retail y consumo masivo en México. Con un sólido historial de incremento de ingresos en doble dígito, restructuración de operaciones ineficientes, y consolidación de cultura organizacional de alto rendimiento.",
  experience: [
    {
      role: "Director General (CEO)",
      company: "Grupo Retail México",
      period: "2017 — Actual",
      location: "CDMX",
      description: "Dirección integral de una empresa minorista con 150 sucursales y más de 3,000 empleados. Logré incrementar el EBITDA corporativo en un 28% y expandir los canales de e-commerce de $2M USD a $35M USD en 5 años. Lideré el consejo de administración durante 3 rondas de capital institucional."
    },
    {
      role: "Director de Operaciones Generales (COO)",
      company: "Walmart de México",
      period: "2010 — 2017",
      location: "CDMX",
      description: "Responsable de la red logística nacional de distribución de alimentos frescos, mejorando la cadena de suministro B2C y reduciendo los tiempos de stock en piso en un 15%."
    }
  ],
  education: [
    {
      degree: "MBA - Global Executive",
      school: "Harvard Business School",
      period: "2014 — 2015",
      location: "Boston, MA",
      description: "Estudios avanzados de liderazgo directivo global y gobierno corporativo."
    },
    {
      degree: "Ingeniería Industrial y de Sistemas",
      school: "Tecnológico de Monterrey (ITESM)",
      period: "1999 — 2003",
      location: "Monterrey, N.L.",
      description: "Graduado con la máxima distinción académica (Summa Cum Laude)."
    }
  ],
  skills: ["Liderazgo Corporativo Global (CEO)", "Expansión Comercial & Escalamiento", "Gestión de EBITDA & Estados de Resultados", "Transformación Digital y E-Commerce", "Gobierno Corporativo y Fusiones", "Cultura Organizacional de Alto Rendimiento", "Relación con Consejos y Medios", "Planificación de Negocios Globales"],
  projects: [],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Bilingüe (C2)" }
  ],
  certifications: [
    { name: "Miembro Activo de la Red de CEOs de América Latina", issuer: "YPO (Young Presidents' Organization)", year: "2018" }
  ],
  awards: [
    { name: "Líder Empresarial Destacado de Retail", issuer: "Asociación Nacional de Tiendas de Autoservicio (ANTAD)", year: "2022" }
  ],
  references: [],
  interests: ["Filantropía Educativa", "Aprender Chino Mandarín", "Yates y Vela"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/roberto-alarcon-ceo" }
  ]
};

export const governmentSample: ResumeDoc = {
  full_name: "Lic. Francisco Javier Soto Ramos",
  headline: "Director General de Programas Sociales y Políticas Públicas",
  photo_url: "",
  email: "francisco.soto@bienestar.gob.mx",
  phone: "+52 55 5544 6677",
  location: "Ciudad de México",
  website: "",
  summary: "Servidor público de carrera con 11 años de trayectoria dirigiendo programas sociales federales y estatales de combate a la pobreza en México. Amplio dominio de la Ley de Presupuesto y Responsabilidad Hacendaria, auditorías de la ASF, transparencia y rendición de cuentas. Orientado a la optimización de recursos y bienestar social.",
  experience: [
    {
      role: "Director General de Operaciones de Programas Sociales",
      company: "Secretaría de Bienestar Federal",
      period: "2019 — Actual",
      location: "CDMX",
      description: "Coordinación y dispersión del presupuesto anual de apoyo a comunidades de alta vulnerabilidad. Supervisé auditorías de la Auditoría Superior de la Federación (ASF) logrando un 100% de solventación de observaciones y entrega de recursos con total transparencia a 1.2 millones de beneficiarios."
    },
    {
      role: "Subdirector de Políticas Públicas de Desarrollo Social",
      company: "Gobierno del Estado de México (SEDESEM)",
      period: "2014 — 2019",
      location: "Toluca, Edo. Méx.",
      description: "Diseño y evaluación del impacto de programas alimentarios estatales en zonas rurales. Coordinador del área de planeación presupuestal estatal."
    }
  ],
  education: [
    {
      degree: "Maestría en Políticas Públicas",
      school: "El Colegio de México (COLMEX)",
      period: "2012 — 2014",
      location: "CDMX",
      description: "Tesis sobre optimización del gasto público social en municipios marginados."
    },
    {
      degree: "Licenciatura en Administración Pública",
      school: "Universidad Nacional Autónoma de México (UNAM)",
      period: "2007 — 2011",
      location: "CDMX",
      description: "Graduado con Mención Honorífica."
    }
  ],
  skills: ["Administración Pública y Políticas Sociales", "Ley de Presupuesto y Gasto Hacendario", "Transparencia, Rendición de Cuentas & ASF", "Evaluación de Impacto Social (CONEVAL)", "Coordinación de Equipos Gubernamentales", "Gestión de Recursos Federales y Estatales", "Normatividad Administrativa Gubernamental", "Relaciones Interinstitucionales"],
  projects: [],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Intermedio-Avanzado (B2)" }
  ],
  certifications: [
    { name: "Certificación en Evaluación de Políticas Públicas", issuer: "CONEVAL / Banco Mundial", year: "2018" },
    { name: "Diplomado en Presupuesto basado en Resultados (PbR)", issuer: "Secretaría de Hacienda y Crédito Público (SHCP)", year: "2016" }
  ],
  awards: [],
  references: [],
  interests: ["Derechos Humanos", "Lectura Histórica", "Ajedrez"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/francisco-soto-pbr" }
  ]
};

export const freelancerSample: ResumeDoc = {
  full_name: "Lic. Luciana Herrera Rivas",
  headline: "Diseñadora Web Freelance y Consultora de Conversión UX/UI",
  photo_url: "",
  email: "luciana@herreraproductions.io",
  phone: "+52 55 4433 2211",
  location: "Ciudad de México (Remoto)",
  website: "herreraproductions.io",
  summary: "Diseñadora web independiente con 6 años de experiencia creando sitios web de alta conversión y tiendas virtuales Shopify para más de 40 clientes en México, EE.UU. y España. Especializada en Webflow, Shopify, arquitectura de conversión y optimización de experiencia de usuario (UX). Ayudo a negocios digitales a vender más.",
  experience: [
    {
      role: "Diseñadora Web y Estratega UX Independiente",
      company: "Herrera Productions (Servicios Freelance)",
      period: "2018 — Actual",
      location: "Remoto",
      description: "Desarrollo de proyectos digitales integrales de diseño web Webflow y e-commerce Shopify. Gestiono todo el ciclo de entrega: preventa comercial, wireframes, diseño visual, desarrollo y lanzamiento. Crecimiento promedio del ticket de conversión web en clientes de un 25%."
    },
    {
      role: "Diseñadora UX/UI Web",
      company: "Agencia Interactiva Digita",
      period: "2020 — 2021",
      location: "CDMX",
      description: "Contratación por proyectos para rediseñar la experiencia de checkout móvil de una aerolínea de bajo costo en México, reduciendo la tasa de rebote en carrito de compras en un 12%."
    }
  ],
  education: [
    {
      degree: "Licenciatura en Diseño y Arte Digital",
      school: "Tecnológico de Monterrey (ITESM)",
      period: "2013 — 2017",
      location: "CDMX",
      description: "Especialidad en Experiencia de Usuario e Interacción Digital."
    }
  ],
  skills: ["Diseño Web Responsivo (Webflow / Shopify)", "Diseño de Interfaz UX/UI (Figma)", "Optimización de Tasas de Conversión (CRO)", "Arquitectura de Información Web", "Estrategia Comercial Freelance", "Gestión de Clientes e Hitos", "Maquetación de Sitios E-Commerce", "SEO Técnico On-Page"],
  projects: [
    {
      name: "Rediseño Tienda Orgánica 'Avena'",
      description: "Desarrollo de tienda en línea Shopify con un incremento neto de ventas del 30% tras el lanzamiento del nuevo UX.",
      link: "herreraproductions.io/avena-case",
      period: "2023"
    },
    {
      name: "Sitio Web Corporativo LogiCargo",
      description: "Diseño y programación en Webflow de portal corporativo de importaciones marítimas internacionales.",
      link: "herreraproductions.io/logicargo-web",
      period: "2022"
    }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado / Fluido Comercial (C1)" }
  ],
  certifications: [
    { name: "Webflow Certified Expert", issuer: "Webflow", year: "2021" },
    { name: "Shopify Partner Academy - Business Certification", issuer: "Shopify", year: "2020" }
  ],
  awards: [],
  references: [],
  interests: ["Nómada Digital", "Cafés Especiales", "Fotografía Analógica"],
  socials: [
    { label: "Sitio Web", url: "herreraproductions.io" },
    { label: "LinkedIn", url: "linkedin.com/in/luciana-herrera-ux" }
  ]
};

export const STAGE_SAMPLES: Record<string, ResumeDoc> = {
  "stage-student": studentSample,
  "stage-fresher": fresherSample,
  "stage-internship": internshipSample,
  "stage-entry-level": entryLevelSample,
  "stage-mid-level": midLevelSample,
  "stage-senior": seniorSample,
  "stage-executive": executiveSample,
  "stage-ceo": ceoSample,
  "stage-government": governmentSample,
  "stage-freelancer": freelancerSample,
};
