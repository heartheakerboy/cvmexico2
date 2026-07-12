import type { ResumeDoc } from "./types";

export const softwareEngineerSample: ResumeDoc = {
  full_name: "Ing. Alejandro Ruiz Gómez",
  headline: "Desarrollador Full Stack Senior",
  photo_url: "",
  email: "alejandro.ruiz@devmx.io",
  phone: "+52 55 4321 0987",
  location: "Ciudad de México",
  website: "alejandroruiz.dev",
  summary: "Ingeniero de Software con más de 7 años de experiencia desarrollando aplicaciones web escalables y de alto rendimiento. Especializado en arquitectura de microservicios, React, Node.js y computación en la nube (AWS). Apasionado por las mejores prácticas de desarrollo y metodologías ágiles.",
  experience: [
    {
      role: "Desarrollador Full Stack Lead",
      company: "Softtek",
      period: "2021 — Actual",
      location: "CDMX",
      description: "Lidero un equipo de 6 ingenieros en la migración de un sistema heredado a una arquitectura de microservicios utilizando Node.js y React. Optimizamos el tiempo de carga en un 40% y mejoramos la cobertura de pruebas unitarias al 92%."
    },
    {
      role: "Desarrollador Software Senior",
      company: "InnovaTech México",
      period: "2018 — 2021",
      location: "Guadalajara, Jal.",
      description: "Diseño y desarrollo de APIs RESTful utilizando Express y PostgreSQL. Implementación de CI/CD con GitHub Actions reduciendo el tiempo de despliegue en un 25%."
    }
  ],
  education: [
    {
      degree: "Ingeniería en Sistemas Computacionales",
      school: "Instituto Politécnico Nacional (ESCOM)",
      period: "2013 — 2017",
      location: "CDMX",
      description: "Especialización en Ingeniería de Software."
    }
  ],
  skills: ["React / Next.js", "Node.js / Express", "TypeScript", "PostgreSQL / MongoDB", "Docker & Kubernetes", "AWS (S3, EC2, Lambda)", "Git / CI-CD", "Arquitectura Limpia"],
  projects: [
    {
      name: "E-Commerce Plataforma Escalar",
      description: "Plataforma de comercio electrónico con soporte para microservicios y pagos en tiempo real con Stripe.",
      link: "github.com/alexruiz/escalar-shop",
      period: "2023"
    },
    {
      name: "DevMonitor API",
      description: "Herramienta open-source de monitoreo de rendimiento para servidores Node.js.",
      link: "github.com/alexruiz/devmonitor",
      period: "2022"
    }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado (C1)" }
  ],
  certifications: [
    { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2022" },
    { name: "Scrum Developer Certified", issuer: "Scrum Alliance", year: "2020" }
  ],
  awards: [],
  references: [],
  interests: ["Contribuciones Open Source", "IoT", "Ajedrez"],
  socials: [
    { label: "GitHub", url: "github.com/alexruiz" },
    { label: "LinkedIn", url: "linkedin.com/in/alejandro-ruiz-dev" }
  ]
};

export const nurseSample: ResumeDoc = {
  full_name: "Lic. Sofía Mendoza Castro",
  headline: "Enfermera General Especialista en Cuidados Intensivos",
  photo_url: "",
  email: "sofia.mendoza@salud.org.mx",
  phone: "+52 81 9876 5432",
  location: "Monterrey, N.L.",
  website: "",
  summary: "Licenciada en Enfermería con 6 años de experiencia en áreas críticas y cuidados intensivos (UCI). Experta en el manejo de pacientes con ventilación asistida, administración de medicamentos de alto riesgo y soporte vital avanzado. Comprometida con la empatía, el trato humano y la seguridad del paciente.",
  experience: [
    {
      role: "Enfermera de Cuidados Intensivos",
      company: "Hospital Christus Muguerza",
      period: "2021 — Actual",
      location: "Monterrey, N.L.",
      description: "Responsable del cuidado directo y monitoreo de pacientes críticos en el área de UCI. Coordinación con médicos especialistas para la ejecución de planes terapéuticos complejos. Supervisión de normas de control de infecciones."
    },
    {
      role: "Enfermera General",
      company: "Hospital San José",
      period: "2019 — 2021",
      location: "Monterrey, N.L.",
      description: "Atención integral de pacientes en piso de hospitalización general, canalización de vías periféricas, curación de heridas complejas y administración de tratamientos indicados."
    }
  ],
  education: [
    {
      degree: "Licenciatura en Enfermería",
      school: "Universidad Autónoma de Nuevo León (UANL)",
      period: "2014 — 2018",
      location: "Monterrey, N.L.",
      description: "Graduada con mención honorífica por desempeño académico sobresaliente."
    }
  ],
  skills: ["Cuidados Críticos (UCI)", "Soporte Vital (ACLS / BLS)", "Ventilación Mecánica", "Triage de Urgencias", "Monitoreo Hemodinámico", "Trato Empático al Paciente", "Control de Infecciones", "Administración Farmacológica"],
  projects: [],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Intermedio-Avanzado (B2)" }
  ],
  certifications: [
    { name: "Certificación ACLS (Advanced Cardiovascular Life Support)", issuer: "American Heart Association", year: "2023" },
    { name: "Especialidad en Cuidados Críticos y Adulto Mayor", issuer: "Colegio de Enfermería N.L.", year: "2022" }
  ],
  awards: [],
  references: [
    { name: "Dr. Roberto Silva", relation: "Jefe de UCI - Christus Muguerza", contact: "roberto.silva@christus.mx" }
  ],
  interests: ["Salud Comunitaria", "Primeros Auxilios", "Yoga"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/sofia-mendoza-enfermeria" }
  ]
};

export const teacherSample: ResumeDoc = {
  full_name: "Mtra. Gabriela Fuentes Estrada",
  headline: "Docente de Educación Primaria y Especialista en Pedagogía",
  photo_url: "",
  email: "gabriela.fuentes@educacion.mx",
  phone: "+52 33 2211 4455",
  location: "Guadalajara, Jal.",
  website: "",
  summary: "Profesional de la educación con más de 8 años de experiencia frente a grupo en el nivel primario. Especializada en la aplicación de metodologías constructivistas, diseño de materiales educativos interactivos e integración de tecnología en el aula. Enfocada en crear ambientes inclusivos y propicios para el aprendizaje.",
  experience: [
    {
      role: "Docente Titular de Primaria (5º y 6º grado)",
      company: "Colegio Cervantes",
      period: "2019 — Actual",
      location: "Guadalajara, Jal.",
      description: "Planeación e impartición de materias curriculares. Implementación de proyectos de lectura que aumentaron el promedio de comprensión lectora de los alumnos en un 35%. Coordinación de talleres y reuniones de padres de familia."
    },
    {
      role: "Docente de Primaria",
      company: "Instituto Anglo Mexicano",
      period: "2016 — 2019",
      location: "Guadalajara, Jal.",
      description: "Diseño curricular y docencia personalizada para alumnos con necesidades educativas especiales. Liderazgo en el comité de Innovación Pedagógica del colegio."
    }
  ],
  education: [
    {
      degree: "Maestría en Educación y Procesos de Aprendizaje",
      school: "Universidad de Guadalajara (UDG)",
      period: "2017 — 2019",
      location: "Guadalajara, Jal.",
      description: "Tesis enfocada en el uso de gamificación en el aula de primaria."
    },
    {
      degree: "Licenciatura en Educación Primaria",
      school: "Benemérita y Centenaria Escuela Normal de Jalisco",
      period: "2011 — 2015",
      location: "Guadalajara, Jal.",
      description: "Formación integral en docencia, didáctica y desarrollo infantil."
    }
  ],
  skills: ["Metodologías Activas", "Gamificación Educativa", "Diseño de Material Curricular", "Tecnología Educativa (Google Workspace)", "Psicología Infantil", "Evaluación Formativa", "Resolución de Conflictos", "Educación Inclusiva"],
  projects: [
    {
      name: "Proyecto 'Lectores del Futuro'",
      description: "Plataforma digital interactiva y club de lectura para fomentar la lectura en el hogar durante el ciclo escolar.",
      link: "",
      period: "2022"
    }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Intermedio (B2)" }
  ],
  certifications: [
    { name: "Educador Certificado de Google Nivel 1 y 2", issuer: "Google for Education", year: "2021" },
    { name: "Diplomado en Neuroeducación Infantil", issuer: "Tecnológico de Monterrey", year: "2020" }
  ],
  awards: [],
  references: [],
  interests: ["Literatura Infantil", "Senderismo", "Fotografía Educativa"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/gabriela-fuentes-docente" }
  ]
};

export const accountantSample: ResumeDoc = {
  full_name: "L.C. Ricardo Pineda Ortega",
  headline: "Contador Público y Auditor Fiscal Senior",
  photo_url: "",
  email: "ricardo.pineda@finanzas.com.mx",
  phone: "+52 55 8899 7766",
  location: "Ciudad de México",
  website: "",
  summary: "Contador Público titulado con 9 años de experiencia liderando auditorías fiscales, contabilidad general y planeación financiera para corporativos medianos y grandes. Experto en el cumplimiento fiscal ante el SAT, presentación de declaraciones anuales y mensuales, y optimización de costos operativos.",
  experience: [
    {
      role: "Contador Senior y Coordinador Fiscal",
      company: "Grupo Financiero Banorte",
      period: "2020 — Actual",
      location: "CDMX",
      description: "Coordinación y preparación de estados financieros mensuales. Supervisión del cálculo y pago de obligaciones fiscales de 4 filiales, logrando recuperar saldos a favor del IVA por más de $2.5M MXN anuales."
    },
    {
      role: "Auditor Externo",
      company: "Deloitte México",
      period: "2016 — 2020",
      location: "CDMX",
      description: "Ejecución de auditorías de estados financieros para clientes del sector retail e industrial. Revisión del control interno y propuesta de mejoras en procesos de conciliación bancaria."
    }
  ],
  education: [
    {
      degree: "Licenciatura en Contaduría Pública",
      school: "Universidad Nacional Autónoma de México (UNAM)",
      period: "2011 — 2015",
      location: "CDMX",
      description: "Mención honorífica. Miembro activo de la facultad de Contaduría y Administración."
    }
  ],
  skills: ["Normas de Información Financiera (NIF)", "Declaraciones SAT (Mensuales y Anuales)", "Contabilidad Electrónica", "Auditoría Financiera", "ERP SAP FICO / CONTPAQi", "Hojas de Cálculo Avanzadas (Excel)", "Nóminas e IMSS (SUA)", "Planeación de Impuestos"],
  projects: [],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Intermedio-Avanzado (B2)" }
  ],
  certifications: [
    { name: "Contador Público Certificado (CPC)", issuer: "Instituto Mexicano de Contadores Públicos", year: "2022" },
    { name: "Certificación en Normas Internacionales de Auditoría", issuer: "IMCP", year: "2021" }
  ],
  awards: [],
  references: [],
  interests: ["Inversiones y Bolsa", "Economía Digital", "Lectura Financiera"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/ricardo-pineda-contador" }
  ]
};

export const lawyerSample: ResumeDoc = {
  full_name: "Lic. Fernando Villalobos Aguilar",
  headline: "Abogado Senior Especialista en Derecho Corporativo y Litigio Comercial",
  photo_url: "",
  email: "f.villalobos@abogadosv.mx",
  phone: "+52 55 1122 3344",
  location: "Ciudad de México",
  website: "villalobos-asociados.mx",
  summary: "Abogado litigante y consultor legal con 10 años de experiencia asesorando corporativos nacionales y extranjeros en fusiones y adquisiciones, estructuración contractual, propiedad intelectual y defensa en litigios civiles y comerciales. Comprometido con la ética, precisión técnica y la mejor representación de los intereses del cliente.",
  experience: [
    {
      role: "Socio Legal Corporativo",
      company: "Villalobos & Asociados Abogados",
      period: "2019 — Actual",
      location: "CDMX",
      description: "Asesoría legal directa a más de 30 empresas en el cumplimiento regulatorio en México. Redacción y negociación de contratos comerciales complejos (proveedores, distribución, fusiones) con un valor acumulado superior a $10M USD."
    },
    {
      role: "Abogado Asociado Senior",
      company: "Baker McKenzie México",
      period: "2015 — 2019",
      location: "CDMX",
      description: "Representación en juicios civiles y mercantiles ante tribunales locales y federales. Coordinación del área de propiedad intelectual y registro de marcas ante el IMPI."
    }
  ],
  education: [
    {
      degree: "Maestría en Derecho de la Empresa",
      school: "Universidad Panamericana",
      period: "2016 — 2018",
      location: "CDMX",
      description: "Estudios avanzados de contratos, fiscalidad internacional y arbitraje comercial."
    },
    {
      degree: "Licenciatura en Derecho",
      school: "Universidad Nacional Autónoma de México (UNAM)",
      period: "2009 — 2014",
      location: "CDMX",
      description: "Graduado con Excelencia Académica."
    }
  ],
  skills: ["Derecho Mercantil y Corporativo", "Litigio Civil y Comercial", "Redacción de Contratos Complejos", "Propiedad Intelectual (IMPI)", "Cumplimiento Regulatorio", "Arbitraje Comercial", "Negociación de Conflictos", "Fusiones y Adquisiciones (M&A)"],
  projects: [
    {
      name: "Reestructuración Corporativa Grupo Z",
      description: "Liderazgo en la auditoría legal (Due Diligence) y adquisición de una cadena minorista regional.",
      link: "",
      period: "2021"
    }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado / Bilingüe (C2)" }
  ],
  certifications: [
    { name: "Cédula Profesional Federal N° 87654321", issuer: "Secretaría de Educación Pública", year: "2014" },
    { name: "Miembro Activo de la Barra Mexicana, Colegio de Abogados", issuer: "Barra Mexicana de Abogados", year: "2017" }
  ],
  awards: [],
  references: [],
  interests: ["Derecho Constitucional", "Historia de México", "Escritura Académica"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/fernando-villalobos-abogado" }
  ]
};

export const architectSample: ResumeDoc = {
  full_name: "Arq. Carlos Eduardo Méndez Ortiz",
  headline: "Arquitecto Senior y Diseñador Urbano",
  photo_url: "",
  email: "carlos.mendez@arquitecturadiseño.mx",
  phone: "+52 33 6677 8899",
  location: "Guadalajara, Jal.",
  website: "carlosmendez.portfolio.box",
  summary: "Arquitecto creativo con más de 8 años de trayectoria diseñando y ejecutando proyectos residenciales, comerciales e infraestructura urbana sustentable. Con amplia experiencia en modelado 3D BIM, supervisión de obra en campo, trámites de permisos gubernamentales y dirección de firmas de diseño integrales.",
  experience: [
    {
      role: "Director de Diseño y Obra",
      company: "Estudio Vanguardia Arquitectura",
      period: "2020 — Actual",
      location: "Guadalajara, Jal.",
      description: "Dirección de proyectos arquitectónicos de mediana y gran escala desde la conceptualización hasta la entrega final. Supervisión directa del avance de obra física, presupuestación de materiales y gestión de un equipo de 10 arquitectos e ingenieros estructurales."
    },
    {
      role: "Líder de Proyecto BIM",
      company: "Constructora Urbania",
      period: "2017 — 2020",
      location: "Zapopan, Jal.",
      description: "Desarrollo de planos ejecutivos e ingenierías integradas en metodología BIM para desarrollos verticales residenciales en Guadalajara. Gestión de licencias y normatividad de construcción."
    }
  ],
  education: [
    {
      degree: "Licenciatura en Arquitectura",
      school: "Universidad de Guadalajara (UDG)",
      period: "2012 — 2016",
      location: "Guadalajara, Jal.",
      description: "Ganador del Premio Anual al Mejor Proyecto de Fin de Carrera (2016)."
    }
  ],
  skills: ["Modelado BIM (Revit)", "Diseño Conceptual & Planos", "AutoCAD 2D/3D & SketchUp", "Renders (V-Ray / Lumion)", "Supervisión de Construcción", "Estimación de Costos y Obra", "Normatividad Urbana y Licencias", "Arquitectura Sustentable"],
  projects: [
    {
      name: "Torre Residencial Nubes",
      description: "Diseño y modelado ejecutivo de un desarrollo de 18 niveles con ecotecnias integradas.",
      link: "carlosmendez.portfolio.box/nubes-torre",
      period: "2022"
    },
    {
      name: "Pabellón Cultural Tlaquepaque",
      description: "Espacio urbano regenerado enfocado en áreas verdes y galerías artesanales al aire libre.",
      link: "",
      period: "2020"
    }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado (B2)" }
  ],
  certifications: [
    { name: "Cédula Profesional N° 12345678", issuer: "Secretaría de Educación Pública", year: "2017" },
    { name: "Certificación Profesional Autodesk Revit Architecture", issuer: "Autodesk", year: "2019" }
  ],
  awards: [],
  references: [],
  interests: ["Diseño de Mobiliario", "Acuarela", "Viajes de Estudio Urbano"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/carlos-mendez-arquitecto" }
  ]
};

export const graphicDesignerSample: ResumeDoc = {
  full_name: "Lic. Andrea Salinas Prado",
  headline: "Diseñadora Gráfica Senior y Especialista en Branding",
  photo_url: "",
  email: "andrea.salinas@creativebox.mx",
  phone: "+52 55 5544 3322",
  location: "Ciudad de México",
  website: "behance.net/andreasalinas",
  summary: "Diseñadora gráfica multidisciplinaria con 7 años de experiencia ayudando a marcas emergentes y corporativos a construir identidades visuales memorables. Apasionada del branding, diseño editorial, ilustración digital y desarrollo de interfaces web (UI). Experta en traducir conceptos estratégicos en universos estéticos impactantes.",
  experience: [
    {
      role: "Directora de Arte y Marca",
      company: "Estudio Creativo Elemento",
      period: "2021 — Actual",
      location: "CDMX",
      description: "Liderazgo creativo en proyectos de rediseño de identidad corporativa y empaque para marcas líderes en consumo masivo. Supervisión de ilustradores, diseñadores junior e imprentas para el control de calidad del producto final."
    },
    {
      role: "Diseñadora Gráfica e Ilustradora",
      company: "Agencia Interactiva Pixel",
      period: "2018 — 2021",
      location: "Querétaro, Qro.",
      description: "Creación de campañas visuales digitales, diseño de sitios web adaptables e ilustración digital para campañas en redes sociales de marcas de moda y estilo de vida."
    }
  ],
  education: [
    {
      degree: "Licenciatura en Diseño y Comunicación Visual",
      school: "Universidad Nacional Autónoma de México (FAD)",
      period: "2013 — 2017",
      location: "CDMX",
      description: "Especialidad en Diseño Editorial e Ilustración."
    }
  ],
  skills: ["Identidad de Marca (Branding)", "Adobe Creative Suite (Illustrator, Photoshop, InDesign)", "Diseño de Empaque (Packaging)", "Ilustración Digital (Procreate)", "Diseño UI (Figma)", "Preprensa y Producción Gráfica", "Dirección de Arte Creativa", "Tipografía y Composición"],
  projects: [
    {
      name: "Identidad Global Café Raíces",
      description: "Branding integral, diseño de empaques biodegradables y menú editorial para una cooperativa de café orgánico.",
      link: "behance.net/andreasalinas/cafe-raices",
      period: "2023"
    },
    {
      name: "Ilustraciones Campaña Verde",
      description: "Serie de ilustraciones editoriales para la revista ambiental del Estado de México.",
      link: "behance.net/andreasalinas/campana-verde",
      period: "2022"
    }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado (B2)" }
  ],
  certifications: [
    { name: "Diplomado en Diseño Web UI/UX", issuer: "Design Academy México", year: "2020" },
    { name: "Taller Avanzado de Tipografía y Lettering", issuer: "Centro de Diseño", year: "2019" }
  ],
  awards: [],
  references: [],
  interests: ["Ilustración Tradicional", "Diseño Textil", "Colección de Revistas de Arte"],
  socials: [
    { label: "Behance", url: "behance.net/andreasalinas" },
    { label: "LinkedIn", url: "linkedin.com/in/andrea-salinas-designer" }
  ]
};

export const salesExecutiveSample: ResumeDoc = {
  full_name: "Lic. Manuel Ortiz Herrera",
  headline: "Ejecutivo de Ventas Regional y Key Account Manager",
  photo_url: "",
  email: "manuel.ortiz@ventasmx.com",
  phone: "+52 55 9900 8811",
  location: "Ciudad de México",
  website: "",
  summary: "Profesional de ventas enfocado en resultados comerciales y desarrollo de nuevos negocios con 8 años de trayectoria en el sector B2B y tecnología. Especializado en prospección de cuentas corporativas clave, negociación estratégica, retención de clientes y análisis de mercado para cumplir y superar metas anuales de facturación.",
  experience: [
    {
      role: "Key Account Manager Senior B2B",
      company: "Salesforce México",
      period: "2021 — Actual",
      location: "CDMX",
      description: "Gestión de una cartera de 45 cuentas corporativas medianas y grandes. Logré incrementar la retención de clientes en un 15% y superé las metas de ventas en un 120% acumulado en los últimos 2 años, generando facturación de $1.2M USD."
    },
    {
      role: "Ejecutivo de Ventas B2B",
      company: "TechDistribuidores S.A.",
      period: "2018 — 2021",
      location: "Guadalajara, Jal.",
      description: "Prospección en frío y cierre de contratos de licencias de software corporativo. Desarrollo de demostraciones de producto y propuestas comerciales."
    }
  ],
  education: [
    {
      degree: "Licenciatura en Mercadotecnia",
      school: "Universidad Tecnológica de México (UNITEC)",
      period: "2013 — 2017",
      location: "CDMX",
      description: "Enfoque en Ventas Consultivas y Estrategias Comerciales."
    }
  ],
  skills: ["Ventas Consultivas B2B", "Cierre de Negociaciones Complejas", "Manejo de CRM (Salesforce / HubSpot)", "Desarrollo de Cartera de Clientes", "Negociación Estratégica", "KPIs de Ventas y Pronósticos", "Servicio y Retención de Clientes", "Análisis de Mercado Corporativo"],
  projects: [],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado (B2)" }
  ],
  certifications: [
    { name: "Certificación en Ventas Consultivas", issuer: "KAM Institute", year: "2020" },
    { name: "HubSpot Sales Software Certified", issuer: "HubSpot Academy", year: "2019" }
  ],
  awards: [
    { name: "Vendedor del Año 2022", issuer: "Salesforce México", year: "2022" }
  ],
  references: [],
  interests: ["Tecnología Comercial", "Golf", "Neuromarketing"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/manuel-ortiz-sales" }
  ]
};

export const hrManagerSample: ResumeDoc = {
  full_name: "Mtra. Patricia Delgado Ruiz",
  headline: "Gerente de Recursos Humanos y Atracción de Talento",
  photo_url: "",
  email: "patricia.delgado@talento.com.mx",
  phone: "+52 55 7788 6655",
  location: "Ciudad de México",
  website: "",
  summary: "Gerente de Recursos Humanos con 9 años de experiencia liderando departamentos de talento en empresas de rápido crecimiento. Especialista en adquisición de talento estratégico, relaciones laborales colectivas e individuales, diseño de planes de capacitación, clima organizacional y cumplimiento legal de la Ley Federal del Trabajo.",
  experience: [
    {
      role: "Gerente de Recursos Humanos",
      company: "Kavak México",
      period: "2020 — Actual",
      location: "CDMX",
      description: "Dirección del equipo de reclutamiento y operaciones de talento para un corporativo de más de 300 empleados. Implementé un plan de evaluación de desempeño que redujo la rotación de personal clave en un 20% en el primer año."
    },
    {
      role: "Coordinadora de Desarrollo Organizacional",
      company: "Grupo Femsa",
      period: "2016 — 2020",
      location: "Monterrey, N.L.",
      description: "Diseño y ejecución de programas de capacitación a nivel regional. Auditorías internas de clima laboral y gestión de contratos colectivos de trabajo."
    }
  ],
  education: [
    {
      degree: "Maestría en Dirección Estratégica de Capital Humano",
      school: "Universidad Anáhuac",
      period: "2017 — 2019",
      location: "CDMX",
      description: "Estudios avanzados sobre derecho laboral, planes de incentivos y cultura corporativa."
    },
    {
      degree: "Licenciatura en Psicología Organizacional",
      school: "Universidad Autónoma Metropolitana (UAM)",
      period: "2011 — 2015",
      location: "CDMX",
      description: "Egresada con promedio sobresaliente."
    }
  ],
  skills: ["Atracción de Talento (Reclutamiento B2B/Tech)", "Relaciones Laborales (LFT)", "Evaluación del Clima Laboral", "Diseño de Planes de Capacitación", "Administración de Compensaciones", "Planes de Desarrollo de Carrera", "Metodologías de Cultura Laboral", "Manejo de Conflictos Internos"],
  projects: [],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado (B2)" }
  ],
  certifications: [
    { name: "Certificación en Normas Mexicanas del Trabajo (NOM-035)", issuer: "STPS", year: "2021" },
    { name: "HR Professional Certified", issuer: "SHRM", year: "2020" }
  ],
  awards: [],
  references: [],
  interests: ["Desarrollo Profesional", "Psicología Positiva", "Cine Debate"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/patricia-delgado-hr" }
  ]
};

export const projectManagerSample: ResumeDoc = {
  full_name: "Ing. Jorge Ramírez Castillo",
  headline: "Gerente de Proyectos Senior (PMP & Scrum Master)",
  photo_url: "",
  email: "jorge.ramirez@pmpro.mx",
  phone: "+52 55 6655 4433",
  location: "Ciudad de México",
  website: "",
  summary: "Gerente de proyectos certificado (PMP) con más de 10 años de experiencia liderando la planeación y ejecución de proyectos de infraestructura y transformación tecnológica en el sector financiero y de telecomunicaciones. Experto en control presupuestario, gestión de riesgos y dirección de equipos multidisciplinarios bajo metodologías ágiles e híbridas.",
  experience: [
    {
      role: "Gerente de Proyectos Senior",
      company: "BBVA México",
      period: "2019 — Actual",
      location: "CDMX",
      description: "Liderazgo de un portafolio de proyectos de digitalización bancaria con un presupuesto asignado de $5M USD. Cumplimiento de entregables en tiempo y costo en un 95% utilizando marcos de trabajo híbridos (Waterfall y Scrum)."
    },
    {
      role: "Project Manager TI",
      company: "Telcel / América Móvil",
      period: "2014 — 2019",
      location: "CDMX",
      description: "Coordinación y despliegue de infraestructura de red en zonas urbanas críticas. Coordinación con proveedores y autoridades para la obtención de licencias técnicas."
    }
  ],
  education: [
    {
      degree: "Ingeniería Industrial y de Sistemas",
      school: "Instituto Tecnológico y de Estudios Superiores de Monterrey (ITESM)",
      period: "2008 — 2012",
      location: "CDMX",
      description: "Graduado con Mención Honorífica por Excelencia Académica."
    }
  ],
  skills: ["Gestión de Proyectos (PMP)", "Metodología Ágil (Scrum / Kanban)", "Presupuestos y Costos (CAPEX/OPEX)", "Análisis y Mitigación de Riesgos", "Herramientas de PM (Jira, MS Project, Asana)", "Liderazgo de Equipos de Trabajo", "Gestión de Interesados (Stakeholders)", "Negociación y Contratación"],
  projects: [
    {
      name: "Migración a App BBVA Móvil",
      description: "Proyecto nacional para migrar servicios transaccionales clave del portal web a la plataforma móvil nativa.",
      link: "",
      period: "2021 — 2022"
    }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado / Bilingüe (C1)" }
  ],
  certifications: [
    { name: "Project Management Professional (PMP)", issuer: "Project Management Institute (PMI)", year: "2018" },
    { name: "Certified ScrumMaster (CSM)", issuer: "Scrum Alliance", year: "2020" }
  ],
  awards: [],
  references: [],
  interests: ["Agilismo", "Innovación Tecnológica", "Ciclismo de Ruta"],
  socials: [
    { label: "LinkedIn", url: "linkedin.com/in/jorge-ramirez-pmp" }
  ]
};

// Map of template ID to its specific sample doc
export const INDUSTRY_SAMPLES: Record<string, ResumeDoc> = {
  "tech-software-engineer": softwareEngineerSample,
  "health-nurse": nurseSample,
  "education-teacher": teacherSample,
  "corporate-accountant": accountantSample,
  "executive-lawyer": lawyerSample,
  "creative-architect": architectSample,
  "creative-graphic-designer": graphicDesignerSample,
  "sales-executive-results": salesExecutiveSample,
  "corporate-hr-manager": hrManagerSample,
  "executive-project-manager": projectManagerSample,
};
