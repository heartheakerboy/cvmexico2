export interface City {
  slug: string;
  name: string;
  stateCode: string;
  phoneAreaCode: string;
  isActive: boolean;
  heroImage?: string;
  salaryInfo: Record<string, { min: number; max: number; currency: string }>;
  industries: string[];
  hiringSectors: string[];
  companies: string[];
  universities: string[];
  resumeTips: string[];
  coverLetterTips: string[];
  interviewTips: string[];
  faqs: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
}

// Default salaries as fallback in MXN
const defaultSalaries: Record<string, { min: number; max: number; currency: string }> = {
  "Ingeniero de Software": { min: 25000, max: 75000, currency: "MXN" },
  "Gerente de Proyectos": { min: 22000, max: 55000, currency: "MXN" },
  "Contador": { min: 14000, max: 35000, currency: "MXN" },
  "Enfermera": { min: 12000, max: 28000, currency: "MXN" },
  "Abogado": { min: 15000, max: 45000, currency: "MXN" },
  "Arquitecto": { min: 16000, max: 42000, currency: "MXN" },
};

const defaultFaqs = (cityName: string) => [
  {
    q: `¿Cómo debe ser el formato de un currículum para ${cityName}?`,
    a: "Se recomienda un currículum de una página (dos si tienes más de 10 años de experiencia) con una estructura limpia y compatible con sistemas ATS. Prioriza tu información de contacto, resumen profesional, experiencia laboral con logros cuantificados, educación y habilidades técnicas relevantes."
  },
  {
    q: `¿Qué palabras clave ATS debo incluir para postularme en ${cityName}?`,
    a: "Depende de tu sector. Si estás en tecnología o manufactura, incluye lenguajes de programación, certificaciones industriales (como Lean Six Sigma) o herramientas de gestión. Utiliza términos que aparezcan directamente en la oferta de empleo."
  },
  {
    q: `¿Es común incluir fotografía en el CV en ${cityName}?`,
    a: "En México sigue siendo una práctica común, aunque para empresas internacionales y de tecnología se prefiere omitirla para evitar sesgos en el reclutamiento. Las plantillas de CVAI te permiten activarla o desactivarla con un solo clic."
  }
];

const defaultResumeTips = (cityName: string) => [
  "Usa una estructura clara con encabezados estándar para que los filtros ATS de las empresas en " + cityName + " puedan leer tu información sin problemas.",
  "Describe tu experiencia laboral utilizando verbos de acción fuertes e incluye resultados medibles (por ejemplo, 'Aumenté la eficiencia en un 15%').",
  "Adapta tu CV para cada postulación, destacando las habilidades y palabras clave mencionadas en la oferta de empleo local.",
  "Mantén un diseño profesional con tipografía moderna y evita usar elementos visuales complejos como barras de nivel de habilidad que los ATS no pueden leer."
];

const defaultCoverLetterTips = (cityName: string) => [
  "Dirige la carta a la persona de reclutamiento o al jefe del área específica si logras investigar su nombre en LinkedIn.",
  "Explica brevemente por qué te interesa esa empresa en particular en " + cityName + " y cómo tus habilidades resolverán sus necesidades.",
  "Menciona un logro profesional relevante del que te sientas orgulloso y que esté directamente relacionado con el puesto.",
  "Mantén una extensión de tres a cuatro párrafos como máximo, usando un tono formal y entusiasta."
];

const defaultInterviewTips = (cityName: string) => [
  "Investiga a fondo la empresa antes de la entrevista: sus proyectos locales en " + cityName + ", su cultura organizacional y su presencia en el mercado.",
  "Prepara ejemplos concretos utilizando la metodología STAR (Situación, Tarea, Acción, Resultado) para responder a preguntas conductuales.",
  "Vístete de acuerdo con la cultura de la empresa (formal para corporativos o banca, business casual para startups o tecnología).",
  "Prepara dos o tres preguntas inteligentes para hacer al entrevistador al final de la sesión sobre el equipo y los objetivos del puesto."
];

export const STATIC_CITIES: Record<string, City> = {
  "ciudad-de-mexico": {
    slug: "ciudad-de-mexico",
    name: "Ciudad de México",
    stateCode: "CDMX",
    phoneAreaCode: "55",
    isActive: true,
    industries: ["Servicios Financieros", "Tecnología de la Información", "Corporativos", "Comercio y Retail", "Servicios de Salud"],
    hiringSectors: ["Banca y Finanzas", "Desarrollo de Software", "Consultoría Empresarial", "Marketing Digital", "E-commerce"],
    companies: ["Grupo Bimbo", "América Móvil", "Grupo Carso", "Citibanamex", "Femsa CDMX", "Kavak México"],
    universities: ["Universidad Nacional Autónoma de México (UNAM)", "Instituto Politécnico Nacional (IPN)", "Tec de Monterrey (Campus Santa Fe / CCM)", "ITAM", "Universidad Autónoma Metropolitana (UAM)"],
    salaryInfo: {
      "Ingeniero de Software": { min: 30000, max: 90000, currency: "MXN" },
      "Gerente de Proyectos": { min: 25000, max: 65000, currency: "MXN" },
      "Contador": { min: 16000, max: 40000, currency: "MXN" },
      "Enfermera": { min: 14000, max: 32000, currency: "MXN" },
      "Abogado": { min: 18000, max: 55000, currency: "MXN" },
      "Arquitecto": { min: 18000, max: 48000, currency: "MXN" }
    },
    resumeTips: defaultResumeTips("Ciudad de México"),
    coverLetterTips: defaultCoverLetterTips("Ciudad de México"),
    interviewTips: defaultInterviewTips("Ciudad de México"),
    faqs: defaultFaqs("Ciudad de México"),
    seoTitle: "Plantillas de Currículum en Ciudad de México | CVAI",
    seoDescription: "Crea tu currículum optimizado para el competitivo mercado de la CDMX. Plantillas profesionales ATS-friendly, ejemplos de redacción y sugerencias con IA locales."
  },
  "guadalajara": {
    slug: "guadalajara",
    name: "Guadalajara",
    stateCode: "Jal.",
    phoneAreaCode: "33",
    isActive: true,
    industries: ["Tecnología y Electrónica", "Manufactura de Alta Tecnología", "Industria Alimentaria", "Comercio", "Logística"],
    hiringSectors: ["Desarrollo de Software", "Diseño de Hardware", "Manufactura Electrónica", "Logística y Distribución", "Agroindustria"],
    companies: ["Oracle México", "Intel Guadalajara", "Tata Consultancy Services (TCS)", "HP Inc", "Jabil México", "Sanmina"],
    universities: ["Universidad de Guadalajara (UdeG)", "ITESO - Universidad Jesuita de Guadalajara", "Tec de Monterrey (Campus Guadalajara)", "Universidad Autónoma de Guadalajara (UAG)"],
    salaryInfo: {
      "Ingeniero de Software": { min: 28000, max: 80000, currency: "MXN" },
      "Gerente de Proyectos": { min: 24000, max: 60000, currency: "MXN" },
      "Contador": { min: 15000, max: 38000, currency: "MXN" },
      "Enfermera": { min: 13000, max: 29000, currency: "MXN" },
      "Abogado": { min: 16000, max: 42000, currency: "MXN" },
      "Arquitecto": { min: 17000, max: 45000, currency: "MXN" }
    },
    resumeTips: [
      "Si buscas trabajo en el Silicon Valley mexicano (Guadalajara), destaca tus proyectos técnicos, repositorios de GitHub y tecnologías dominadas (React, Node, Java, AWS, etc.).",
      "Adapta tu currículum al inglés. Alrededor del 70% de las vacantes tecnológicas en Guadalajara requieren un CV en inglés para interactuar con clientes internacionales.",
      "Menciona metodologías ágiles como Scrum o Kanban en tu sección de habilidades.",
      "Destaca proyectos en los que hayas trabajado en equipos multiculturales o distribuidos geográficamente."
    ],
    coverLetterTips: defaultCoverLetterTips("Guadalajara"),
    interviewTips: defaultInterviewTips("Guadalajara"),
    faqs: defaultFaqs("Guadalajara"),
    seoTitle: "Plantillas de Currículum en Guadalajara | CVAI",
    seoDescription: "Destaca en el Silicon Valley mexicano. Crea tu currículum optimizado para empresas de tecnología y manufactura en Guadalajara. Plantillas ATS gratis."
  },
  "monterrey": {
    slug: "monterrey",
    name: "Monterrey",
    stateCode: "N.L.",
    phoneAreaCode: "81",
    isActive: true,
    industries: ["Manufactura Avanzada", "Siderurgia y Metalurgia", "Servicios Corporativos", "Logística y Transporte", "Comercio"],
    hiringSectors: ["Ingeniería Industrial", "Gerencia de Planta", "Finanzas y Contabilidad", "Cadena de Suministro", "Desarrollo de Software"],
    companies: ["Cemex", "Femsa", "Alfa", "Ternium México", "Grupo Bimbo Monterrey", "Heineken México"],
    universities: ["Universidad Autónoma de Nuevo León (UANL)", "Tec de Monterrey (Campus Monterrey)", "Universidad de Monterrey (UDEM)", "Universidad Regiomontana (U-ERRE)"],
    salaryInfo: {
      "Ingeniero de Software": { min: 28000, max: 80000, currency: "MXN" },
      "Gerente de Proyectos": { min: 25000, max: 62000, currency: "MXN" },
      "Contador": { min: 16000, max: 38000, currency: "MXN" },
      "Enfermera": { min: 14000, max: 30000, currency: "MXN" },
      "Abogado": { min: 17000, max: 48000, currency: "MXN" },
      "Arquitecto": { min: 18000, max: 46000, currency: "MXN" }
    },
    resumeTips: [
      "Para el competitivo mercado industrial de Monterrey, destaca tus certificaciones industriales como Lean Manufacturing, Six Sigma o certificaciones ISO.",
      "El inglés de negocios es fundamental para los corporativos regios. Resalta tu nivel conversacional o técnico.",
      "Enfoca tu experiencia en optimización de costos, incremento de productividad y liderazgo de equipos de producción.",
      "Incluye proyectos de mejora continua en la planta o almacén utilizando métricas concretas (por ejemplo: 'Ahorro de $50k USD anuales')."
    ],
    coverLetterTips: defaultCoverLetterTips("Monterrey"),
    interviewTips: defaultInterviewTips("Monterrey"),
    faqs: defaultFaqs("Monterrey"),
    seoTitle: "Plantillas de Currículum en Monterrey | CVAI",
    seoDescription: "Formatos de CV adaptados al mercado industrial y corporativo de Monterrey. Diseños profesionales aprobados por reclutadores regios. Empieza gratis."
  },
  "puebla": {
    slug: "puebla",
    name: "Puebla",
    stateCode: "Pue.",
    phoneAreaCode: "222",
    isActive: true,
    industries: ["Automotriz", "Manufactura de Autopartes", "Educación", "Comercio", "Textil"],
    hiringSectors: ["Ingeniería Automotriz", "Control de Calidad", "Logística y Almacén", "Docencia", "Ventas Corporativas"],
    companies: ["Volkswagen de México", "Audi México", "Gestamp Puebla", "Ternium Puebla", "Benteler"],
    universities: ["Benemérita Universidad Autónoma de Puebla (BUAP)", "Universidad de las Américas Puebla (UDLAP)", "Universidad Iberoamericana Puebla", "Tec de Monterrey (Campus Puebla)"],
    salaryInfo: defaultSalaries,
    resumeTips: [
      "Si te postulas al sector automotriz en Puebla, menciona tu dominio de softwares CAD, ERPs industriales (como SAP) y metodologías de calidad (Core Tools, 5S, VDA).",
      "Las certificaciones emitidas por la industria (como VDA 6.3 o IATF 16949) deben ir en un lugar destacado en tu currículum.",
      "Menciona idiomas adicionales como el Alemán, que suma un gran valor competitivo para trabajar en plantas de origen germano como VW o Audi.",
      "Mantén tu CV limpio y estructurado en orden cronológico inverso."
    ],
    coverLetterTips: defaultCoverLetterTips("Puebla"),
    interviewTips: defaultInterviewTips("Puebla"),
    faqs: defaultFaqs("Puebla"),
    seoTitle: "Plantillas de Currículum en Puebla | CVAI",
    seoDescription: "Crea tu currículum para el mercado automotriz e industrial de Puebla. Plantillas ATS-friendly listas para descargar en PDF y usar hoy."
  },
  "tijuana": {
    slug: "tijuana",
    name: "Tijuana",
    stateCode: "B.C.",
    phoneAreaCode: "664",
    isActive: true,
    industries: ["Manufactura Médica y Electrónica", "Logística Internacional", "Turismo y Servicios", "Comercio Transfronterizo"],
    hiringSectors: ["Ingeniería de Manufactura", "Cadena de Suministro (Import/Export)", "Operaciones en Maquiladoras", "Servicio al Cliente", "Turismo"],
    companies: ["Samsung Electronics", "Medtronic Tijuana", "Foxconn México", "Plantronics (Poly)", "Gulfstream Tijuana"],
    universities: ["Universidad Autónoma de Baja California (UABC)", "CETYS Universidad (Campus Tijuana)", "Instituto Tecnológico de Tijuana (ITT)"],
    salaryInfo: {
      "Ingeniero de Software": { min: 26000, max: 75000, currency: "MXN" },
      "Gerente de Proyectos": { min: 23000, max: 58000, currency: "MXN" },
      "Contador": { min: 15000, max: 36000, currency: "MXN" },
      "Enfermera": { min: 13000, max: 28000, currency: "MXN" },
      "Abogado": { min: 16000, max: 44000, currency: "MXN" },
      "Arquitecto": { min: 17000, max: 43000, currency: "MXN" }
    },
    resumeTips: [
      "Para Tijuana, el dominio del inglés fluido y las leyes aduaneras locales (importación/exportación, IMMEX, reglas del T-MEC) son altamente cotizados.",
      "Destaca tu experiencia gestionando proyectos de manufactura o logística binacional.",
      "Incluye certificaciones de control de calidad o gestión de proyectos (PMP, Lean, APICS).",
      "Usa una plantilla moderna y asegúrate de reflejar tu experiencia laboral en maquiladoras de prestigio."
    ],
    coverLetterTips: defaultCoverLetterTips("Tijuana"),
    interviewTips: defaultInterviewTips("Tijuana"),
    faqs: defaultFaqs("Tijuana"),
    seoTitle: "Plantillas de Currículum en Tijuana | CVAI",
    seoDescription: "Currículums optimizados para el dinámico sector industrial y aduanero de Tijuana. Descarga plantillas compatibles con sistemas de reclutamiento ATS."
  },
  "leon": {
    slug: "leon",
    name: "León",
    stateCode: "Gto.",
    phoneAreaCode: "477",
    isActive: true,
    industries: ["Industria del Cuero y Calzado", "Manufactura y Autopartes", "Salud y Medicina", "Comercio", "Servicios Financieros"],
    hiringSectors: ["Diseño de Modas y Producto", "Control de Calidad en Manufactura", "Representación de Ventas", "Administración y Finanzas", "Salud"],
    companies: ["Grupo Flexi", "Calzado Andrea", "Curtidos Galindo", "Hospital Ángeles León", "Guanajuato Puerto Interior"],
    universities: ["Universidad de Guanajuato (UG)", "Universidad Iberoamericana León", "Tec de Monterrey (Campus León)"],
    salaryInfo: defaultSalaries,
    resumeTips: [
      "En León, destaca tu experiencia en gestión de inventarios, diseño de producto o mejora de procesos en líneas de ensamble.",
      "Menciona tus certificaciones en comercio exterior o logística si buscas aplicar en el corredor industrial del Bajío.",
      "Cuantifica tus logros de ventas o reducción de merma en producción."
    ],
    coverLetterTips: defaultCoverLetterTips("León"),
    interviewTips: defaultInterviewTips("León"),
    faqs: defaultFaqs("León"),
    seoTitle: "Plantillas de Currículum en León | CVAI",
    seoDescription: "Optimiza tu CV para el sector calzado, comercial y automotriz en León. Plantillas de currículum profesional recomendadas para el Bajío."
  },
  "merida": {
    slug: "merida",
    name: "Mérida",
    stateCode: "Yuc.",
    phoneAreaCode: "999",
    isActive: true,
    industries: ["Turismo y Hospitalidad", "Desarrollo Inmobiliario", "Comercio", "Tecnología y Consultoría", "Salud"],
    hiringSectors: ["Administración de Hoteles y Restaurantes", "Ventas de Bienes Raíces", "Mercadotecnia y Publicidad", "Desarrollo Web", "Medicina y Enfermería"],
    companies: ["Bepensa", "Grupo Millet", "Palace Resorts Yucatán", "Hospital El Faro Mayab", "Grupo Vivo"],
    universities: ["Universidad Autónoma de Yucatán (UADY)", "Universidad Anáhuac Mayab", "Instituto Tecnológico de Mérida (ITM)"],
    salaryInfo: {
      "Ingeniero de Software": { min: 20000, max: 55000, currency: "MXN" },
      "Gerente de Proyectos": { min: 18000, max: 42000, currency: "MXN" },
      "Contador": { min: 12000, max: 28000, currency: "MXN" },
      "Enfermera": { min: 11000, max: 24000, currency: "MXN" },
      "Abogado": { min: 13000, max: 35000, currency: "MXN" },
      "Arquitecto": { min: 14000, max: 36000, currency: "MXN" }
    },
    resumeTips: [
      "En Mérida, destaca tus habilidades lingüísticas (inglés indispensable para el turismo e inmobiliarias de lujo).",
      "Menciona tu conocimiento en herramientas CRM y técnicas de negociación para el sector inmobiliario.",
      "Para perfiles tecnológicos, destaca tu capacidad de trabajar en remoto (muy cotizado en la península)."
    ],
    coverLetterTips: defaultCoverLetterTips("Mérida"),
    interviewTips: defaultInterviewTips("Mérida"),
    faqs: defaultFaqs("Mérida"),
    seoTitle: "Plantillas de Currículum en Mérida | CVAI",
    seoDescription: "Crea tu currículum para turismo, real estate y comercio en Mérida. Diseños modernos y profesionales listos para descargar gratis."
  },
  "queretaro": {
    slug: "queretaro",
    name: "Querétaro",
    stateCode: "Qro.",
    phoneAreaCode: "442",
    isActive: true,
    industries: ["Aeronáutica e Aeroespacial", "Automotriz y Autopartes", "Tecnologías de la Información", "Logística y Almacén", "Construcción"],
    hiringSectors: ["Ingeniería de Diseño Aeronáutico", "Mantenimiento Industrial", "Logística Internacional", "Desarrollo de Software", "Control de Calidad"],
    companies: ["Bombardier México", "GE Aerospace Querétaro", "Safran Aircraft Engines", "Mabe", "Techops México", "Continental"],
    universities: ["Universidad Autónoma de Querétaro (UAQ)", "Universidad Aeronáutica en Querétaro (UNAQ)", "Tec de Monterrey (Campus Querétaro)", "Universidad Anáhuac Querétaro"],
    salaryInfo: {
      "Ingeniero de Software": { min: 26000, max: 78000, currency: "MXN" },
      "Gerente de Proyectos": { min: 23000, max: 55000, currency: "MXN" },
      "Contador": { min: 15000, max: 35000, currency: "MXN" },
      "Enfermera": { min: 13000, max: 27000, currency: "MXN" },
      "Abogado": { min: 16000, max: 45000, currency: "MXN" },
      "Arquitecto": { min: 17000, max: 44000, currency: "MXN" }
    },
    resumeTips: [
      "Si aplicas al clúster aeroespacial o automotriz en Querétaro, prioriza tus certificaciones de la industria (Lean, Six Sigma, AS9100, IATF 16949).",
      "Detaca proyectos donde hayas mejorado el rendimiento o resuelto cuellos de botella en producción.",
      "El inglés avanzado es un requisito no negociable para casi todos los puestos de ingeniería en Querétaro."
    ],
    coverLetterTips: defaultCoverLetterTips("Querétaro"),
    interviewTips: defaultInterviewTips("Querétaro"),
    faqs: defaultFaqs("Querétaro"),
    seoTitle: "Plantillas de Currículum en Querétaro | CVAI",
    seoDescription: "Crea tu currículum para el sector aeronáutico, automotriz y tecnológico de Querétaro. Plantillas profesionales aprobadas por el mercado."
  },
  "toluca": {
    slug: "toluca",
    name: "Toluca",
    stateCode: "Edomex",
    phoneAreaCode: "722",
    isActive: true,
    industries: ["Farmacéutica y Química", "Automotriz y Autopartes", "Alimentos y Bebidas", "Logística y Distribución", "Plásticos"],
    hiringSectors: ["Ingeniería Química/Farmacéutica", "Supervisión de Calidad", "Logística y Almacén", "Mantenimiento Industrial", "Finanzas"],
    companies: ["Stellantis (Chrysler)", "General Motors Toluca", "Pfizer México", "Nestlé México", "Bayer Toluca"],
    universities: ["Universidad Autónoma del Estado de México (UAEMex)", "Tec de Monterrey (Campus Toluca)"],
    salaryInfo: defaultSalaries,
    resumeTips: [
      "En el corredor industrial de Toluca, destaca tus habilidades en control de procesos químicos, normas sanitarias (COFEPRIS, GMP) o regulaciones automotrices.",
      "Detalla tus logros en optimización de cadena de suministro o reducción de costos operativos en planta.",
      "Enumera los sistemas informáticos especializados que dominas (como SAP WM/MM)."
    ],
    coverLetterTips: defaultCoverLetterTips("Toluca"),
    interviewTips: defaultInterviewTips("Toluca"),
    faqs: defaultFaqs("Toluca"),
    seoTitle: "Plantillas de Currículum en Toluca | CVAI",
    seoDescription: "Formatos de currículum optimizados para el sector farmacéutico e industrial de Toluca. Crea tu CV con plantillas ATS-friendly hoy."
  },
  "chihuahua": {
    slug: "chihuahua",
    name: "Chihuahua",
    stateCode: "Chih.",
    phoneAreaCode: "614",
    isActive: true,
    industries: ["Manufactura de Exportación", "Aeroespacial", "Ganadería y Agricultura", "Comercio", "Minería"],
    hiringSectors: ["Ingeniería Aeroespacial", "Administración de Maquiladora", "Ventas Industriales", "Logística", "Supervisión de Calidad"],
    companies: ["Honeywell Chihuahua", "Safran Cabin", "Jabil México", "Grupo Bafar", "Chihuahua Group"],
    universities: ["Universidad Autónoma de Chihuahua (UACH)", "Instituto Tecnológico de Chihuahua (ITCH)", "Tec de Monterrey (Campus Chihuahua)"],
    salaryInfo: defaultSalaries,
    resumeTips: [
      "Para la industria de exportación en Chihuahua, destaca tu bilingüismo (inglés/español) y tu conocimiento en regulaciones comerciales internacionales.",
      "Menciona certificaciones en metodologías esbeltas (Lean Manufacturing) e IATF.",
      "Destaca proyectos de reducción de desperdicio o incremento de productividad."
    ],
    coverLetterTips: defaultCoverLetterTips("Chihuahua"),
    interviewTips: defaultInterviewTips("Chihuahua"),
    faqs: defaultFaqs("Chihuahua"),
    seoTitle: "Plantillas de Currículum en Chihuahua | CVAI",
    seoDescription: "Crea tu currículum para el sector industrial, ganadero y aeroespacial de Chihuahua. Formatos probados con software ATS en México."
  },
  "cancun": {
    slug: "cancun",
    name: "Cancún",
    stateCode: "Q. Roo",
    phoneAreaCode: "998",
    isActive: true,
    industries: ["Turismo y Hotelería", "Servicios de Viaje y Recreación", "Alimentos y Bebidas", "Construcción Inmobiliaria", "Transporte"],
    hiringSectors: ["Administración Hotelera", "Servicio al Huésped (Guest Relations)", "Gastronomía y Cocina", "Ventas de Tiempos Compartidos", "Relaciones Públicas"],
    companies: ["Grupo Xcaret", "Palace Resorts", "ASUR (Aeropuertos del Sureste)", "Oasis Hotels", "Grupo Dolphin Discovery"],
    universities: ["Universidad del Caribe", "Universidad Tecnológica de Cancún (UT)", "Universidad Anáhuac Cancún"],
    salaryInfo: {
      "Ingeniero de Software": { min: 18000, max: 48000, currency: "MXN" },
      "Gerente de Proyectos": { min: 20000, max: 48000, currency: "MXN" },
      "Contador": { min: 13000, max: 30000, currency: "MXN" },
      "Enfermera": { min: 12000, max: 25000, currency: "MXN" },
      "Abogado": { min: 14000, max: 35000, currency: "MXN" },
      "Arquitecto": { min: 15000, max: 38000, currency: "MXN" }
    },
    resumeTips: [
      "El dominio absoluto de idiomas (inglés conversacional obligatorio; francés, alemán o portugués son grandes extras) debe estar resaltado al inicio de tu CV en Cancún.",
      "Destaca tu historial de satisfacción del cliente, certificaciones en servicio (como Distintivo H o Cristal) y manejo de conflictos.",
      "Enfoca tu currículum en resultados, retención de clientes y habilidades blandas (empatía, trabajo en equipo bajo presión)."
    ],
    coverLetterTips: defaultCoverLetterTips("Cancún"),
    interviewTips: defaultInterviewTips("Cancún"),
    faqs: defaultFaqs("Cancún"),
    seoTitle: "Plantillas de Currículum en Cancún | CVAI",
    seoDescription: "Crea tu currículum especializado en turismo y hotelería en Cancún. Destaca tus idiomas, certificaciones de servicio y logros profesionales."
  },
  "san-luis-potosi": {
    slug: "san-luis-potosi",
    name: "San Luis Potosí",
    stateCode: "S.L.P.",
    phoneAreaCode: "444",
    isActive: true,
    industries: ["Automotriz y Autopartes", "Metalmecánica", "Logística y Distribución", "Comercio", "Construcción"],
    hiringSectors: ["Ingeniería Mecánica y Eléctrica", "Logística de Materiales", "Control de Calidad", "Supervisión de Ensamble", "Administración"],
    companies: ["BMW Group San Luis Potosí", "General Motors SLP", "Cummins México", "Loreal México", "Ternium SLP"],
    universities: ["Universidad Autónoma de San Luis Potosí (UASLP)", "Tec de Monterrey (Campus San Luis Potosí)"],
    salaryInfo: defaultSalaries,
    resumeTips: [
      "Para el clúster industrial de SLP, incluye en tu CV palabras clave relacionadas con Core Tools, SAP, logística integrada y Six Sigma.",
      "Si eres ingeniero, resalta tu experiencia en el arranque de líneas de ensamble o transferencias de proyectos.",
      "Asegúrate de detallar tu nivel de inglés para empresas de origen multinacional (como BMW)."
    ],
    coverLetterTips: defaultCoverLetterTips("San Luis Potosí"),
    interviewTips: defaultInterviewTips("San Luis Potosí"),
    faqs: defaultFaqs("San Luis Potosí"),
    seoTitle: "Plantillas de Currículum en San Luis Potosí | CVAI",
    seoDescription: "Crea tu currículum para el pujante sector industrial y automotriz de San Luis Potosí. Formatos profesionales optimizados para ATS."
  },
  "aguascalientes": {
    slug: "aguascalientes",
    name: "Aguascalientes",
    stateCode: "Ags.",
    phoneAreaCode: "449",
    isActive: true,
    industries: ["Automotriz y Autopartes", "Servicios Financieros y Soporte", "Logística", "Comercio", "Electrónica"],
    hiringSectors: ["Ingeniería de Ensamble Automotriz", "Supervisión de Calidad", "Atención a Clientes Bilingüe", "Logística", "Mantenimiento"],
    companies: ["Nissan Mexicana (A1/A2)", "Cooper Standard", "Flex Aguascalientes", "Donaldson México", "Calsonic Kansei"],
    universities: ["Universidad Autónoma de Aguascalientes (UAA)", "Tec de Monterrey (Campus Aguascalientes)", "Universidad Panamericana Campus Bonaterra"],
    salaryInfo: defaultSalaries,
    resumeTips: [
      "Si buscas ingresar al corporativo o planta de Nissan y proveedores afines en Aguascalientes, destaca tus habilidades en Kaizen, manufactura esbelta e IATF 16949.",
      "Destaca tu experiencia gestionando proyectos de mejora continua.",
      "Agrega tus certificaciones profesionales de calidad."
    ],
    coverLetterTips: defaultCoverLetterTips("Aguascalientes"),
    interviewTips: defaultInterviewTips("Aguascalientes"),
    faqs: defaultFaqs("Aguascalientes"),
    seoTitle: "Plantillas de Currículum en Aguascalientes | CVAI",
    seoDescription: "Currículum profesional optimizado para la industria automotriz y el Bajío desde Aguascalientes. Plantillas ATS de calidad."
  },
  "mexicali": {
    slug: "mexicali",
    name: "Mexicali",
    stateCode: "B.C.",
    phoneAreaCode: "686",
    isActive: true,
    industries: ["Aeroespacial", "Manufactura Médica", "Electrónica", "Agroindustria", "Energía y Servicios"],
    hiringSectors: ["Diseño Electrónico", "Ingeniería de Calidad (FDA/ISO 13485)", "Operaciones en Maquila", "Logística Aduanera", "Mantenimiento"],
    companies: ["Skyworks Solutions", "Honeywell Mexicali", "Gulfstream Mexicali", "Intuitive Surgical", "Kenworth México"],
    universities: ["Universidad Autónoma de Baja California (UABC)", "CETYS Universidad (Campus Mexicali)"],
    salaryInfo: defaultSalaries,
    resumeTips: [
      "Para la industria médica en Mexicali, detalla tu experiencia bajo normativas de la FDA, ISO 13485 y cuartos limpios.",
      "Menciona proyectos de ahorro de costos y eficiencia en manufactura de alta tecnología.",
      "El inglés bilingüe es fundamental para trabajar con equipos globales de diseño en Mexicali."
    ],
    coverLetterTips: defaultCoverLetterTips("Mexicali"),
    interviewTips: defaultInterviewTips("Mexicali"),
    faqs: defaultFaqs("Mexicali"),
    seoTitle: "Plantillas de Currículum en Mexicali | CVAI",
    seoDescription: "Diseña tu currículum para el clúster aeroespacial y de manufactura médica de Mexicali. Plantillas probadas con filtros ATS."
  },
  "hermosillo": {
    slug: "hermosillo",
    name: "Hermosillo",
    stateCode: "Son.",
    phoneAreaCode: "662",
    isActive: true,
    industries: ["Automotriz", "Minería", "Comercio", "Agroindustria", "Servicios de Tecnología"],
    hiringSectors: ["Ingeniería de Planta Automotriz", "Operación y Seguridad Minera", "Ventas de Equipamiento", "Logística y Transporte", "Administración"],
    companies: ["Ford Motor Company Hermosillo", "TE Connectivity", "Alamos Gold", "Grupo México", "Martinrea"],
    universities: ["Universidad de Sonora (UNISON)", "Universidad Tecnológica de Hermosillo (UTH)"],
    salaryInfo: defaultSalaries,
    resumeTips: [
      "En Sonora, la industria minera y automotriz son de las que mejores salarios ofrecen. Resalta tu experiencia en seguridad ocupacional (OSHA, NOMs), optimización de recursos y SAP.",
      "Incluye certificaciones en maquinaria, calidad o seguridad minera.",
      "El dominio del inglés técnico conversacional es clave para interactuar con proveedores."
    ],
    coverLetterTips: defaultCoverLetterTips("Hermosillo"),
    interviewTips: defaultInterviewTips("Hermosillo"),
    faqs: defaultFaqs("Hermosillo"),
    seoTitle: "Plantillas de Currículum en Hermosillo | CVAI",
    seoDescription: "Crea tu currículum para la industria automotriz y minera en Hermosillo. Optimización automática para el mercado laboral de Sonora."
  },
  "morelia": {
    slug: "morelia",
    name: "Morelia",
    stateCode: "Mich.",
    phoneAreaCode: "443",
    isActive: true,
    industries: ["Servicios y Entretenimiento", "Agroindustria", "Educación", "Comercio y Retail", "Salud"],
    hiringSectors: ["Administración Corporativa", "Logística Agroindustrial (Aguacate/Berries)", "Docencia y Academia", "Ventas y Marketing", "Atención Médica"],
    companies: ["Cinépolis (Corporativo Mundial)", "Grupo Herdez", "Kimberly-Clark Morelia", "Morelia Port Authority", "Avohass"],
    universities: ["Universidad Michoacana de San Nicolás de Hidalgo (UMSNH)", "Instituto Tecnológico de Morelia (ITM)"],
    salaryInfo: {
      "Ingeniero de Software": { min: 18000, max: 45000, currency: "MXN" },
      "Gerente de Proyectos": { min: 18000, max: 40000, currency: "MXN" },
      "Contador": { min: 12000, max: 28000, currency: "MXN" },
      "Enfermera": { min: 11000, max: 24000, currency: "MXN" },
      "Abogado": { min: 12000, max: 32000, currency: "MXN" },
      "Arquitecto": { min: 13000, max: 34000, currency: "MXN" }
    },
    resumeTips: [
      "Al postularte en Morelia, destaca tu experiencia en cadenas de distribución agroindustrial o retail.",
      "Si buscas un rol en corporativos globales como Cinépolis, enfócate en habilidades analíticas, inglés de negocios e innovación de procesos.",
      "Usa plantillas elegantes de CV de una página para no abrumar al reclutador."
    ],
    coverLetterTips: defaultCoverLetterTips("Morelia"),
    interviewTips: defaultInterviewTips("Morelia"),
    faqs: defaultFaqs("Morelia"),
    seoTitle: "Plantillas de Currículum en Morelia | CVAI",
    seoDescription: "Diseña tu currículum para el corporativo de entretenimiento o el sector agroexportador de Morelia. Plantillas profesionales gratuitas."
  },
  "culiacan": {
    slug: "culiacan",
    name: "Culiacán",
    stateCode: "Sin.",
    phoneAreaCode: "667",
    isActive: true,
    industries: ["Agroindustria y Distribución", "Comercio y Retail", "Servicios Financieros", "Logística y Transporte", "Construcción"],
    hiringSectors: ["Logística y Distribución", "Gerencia de Ventas y Tienda", "Crédito y Cobranza", "Ingeniería Agrónoma", "Operaciones de Almacén"],
    companies: ["Coppel (Corporativo Nacional)", "SuKarne (Corporativo)", "Casa Ley", "Grupo Premier", "Agroindustrias del Norte"],
    universities: ["Universidad Autónoma de Sinaloa (UAS)", "Instituto Tecnológico de Culiacán (ITC)"],
    salaryInfo: defaultSalaries,
    resumeTips: [
      "Para aplicar en corporativos líderes en Culiacán (como Coppel o SuKarne), resalta tu experiencia en proyectos de gran escala, análisis de datos y optimización comercial.",
      "Destaca tu manejo de presupuestos y alcance de objetivos trimestrales.",
      "Cuantifica tus metas de ventas y porcentajes de cumplimiento."
    ],
    coverLetterTips: defaultCoverLetterTips("Culiacán"),
    interviewTips: defaultInterviewTips("Culiacán"),
    faqs: defaultFaqs("Culiacán"),
    seoTitle: "Plantillas de Currículum en Culiacán | CVAI",
    seoDescription: "Crea tu currículum para los corporativos de retail y agroindustria en Culiacán. Optimización ATS con sugerencias inteligentes de IA."
  },
  "veracruz": {
    slug: "veracruz",
    name: "Veracruz",
    stateCode: "Ver.",
    phoneAreaCode: "229",
    isActive: true,
    industries: ["Puerto y Logística Marina", "Turismo y Servicios", "Petroquímica y Energía", "Comercio Exterior", "Pesca y Agroindustria"],
    hiringSectors: ["Administración de Aduanas", "Operación Logística / Tráfico", "Ingeniería en Soldadura/Metalurgia", "Hotelería y Eventos", "Seguridad Industrial"],
    companies: ["TenarisTamsa", "ICAVE (Hutchison Ports)", "Cervecería Cuauhtémoc Moctezuma", "Grupo CICE", "APIVER"],
    universities: ["Universidad Veracruzana (UV)", "Instituto Tecnológico de Veracruz (ITVer)"],
    salaryInfo: defaultSalaries,
    resumeTips: [
      "Para Veracruz, las palabras clave relacionadas con logística aduanera, importación/exportación, control aduanal y leyes marítimas son de gran valor.",
      "Si eres ingeniero y aplicas a Tamsa, destaca tus certificaciones técnicas (AWS para soldadura, ISO 9001, etc.).",
      "Incluye los puertos internacionales con los que has coordinado embarques."
    ],
    coverLetterTips: defaultCoverLetterTips("Veracruz"),
    interviewTips: defaultInterviewTips("Veracruz"),
    faqs: defaultFaqs("Veracruz"),
    seoTitle: "Plantillas de Currículum en Veracruz | CVAI",
    seoDescription: "Formatos de currículum optimizados para logística portuaria, aduanas y metalurgia en Veracruz. Descarga tu CV en PDF listo para enviar."
  },
  "saltillo": {
    slug: "saltillo",
    name: "Saltillo",
    stateCode: "Coah.",
    phoneAreaCode: "844",
    isActive: true,
    industries: ["Automotriz", "Metalmecánica y Fundición", "Logística y Almacén", "Química", "Construcción"],
    hiringSectors: ["Ingeniería en Manufactura", "Ingeniería de Calidad (PPAP, APQP)", "Supervisión de Planta", "Mantenimiento Industrial", "Logística y Suministro"],
    companies: ["Stellantis Saltillo (Chrysler)", "General Motors Ramos Arizpe", "Deacero", "Nemak", "Magna International"],
    universities: ["Universidad Autónoma de Coahuila (UAdeC)", "Instituto Tecnológico de Saltillo (ITS)"],
    salaryInfo: defaultSalaries,
    resumeTips: [
      "Para el próspero clúster automotriz de Saltillo-Ramos Arizpe, detalla tus competencias en Core Tools (PPAP, APQP, FMEA, SPC, MSA).",
      "Menciona tu participación directa en la reducción de scrap, incrementos de OEE o proyectos de lean manufacturing.",
      "El inglés fluido es vital debido a la constante comunicación con armadoras en EE.UU."
    ],
    coverLetterTips: defaultCoverLetterTips("Saltillo"),
    interviewTips: defaultInterviewTips("Saltillo"),
    faqs: defaultFaqs("Saltillo"),
    seoTitle: "Plantillas de Currículum en Saltillo | CVAI",
    seoDescription: "Diseña tu currículum para el clúster automotriz de Saltillo y Ramos Arizpe. Formato compatible con ATS para grandes maquilas."
  },
  "torreon": {
    slug: "torreon",
    name: "Torreón",
    stateCode: "Coah.",
    phoneAreaCode: "871",
    isActive: true,
    industries: ["Metalurgia y Minería", "Lácteos y Agroindustria", "Comercio", "Manufactura Textil", "Educación"],
    hiringSectors: ["Procesos Metalúrgicos", "Ingeniería en Alimentos", "Ventas Industriales", "Logística y Almacén", "Administración"],
    companies: ["Peñoles (Met-Mex Peñoles)", "Grupo Lala (Corporativo)", "Pilgrim's México", "Soriana Torreón", "Lala Planta Pasteurizadora"],
    universities: ["Universidad Autónoma de Coahuila (UAdeC)", "Universidad Autónoma de la Laguna (UAL)", "Tec de Monterrey (Campus Laguna)"],
    salaryInfo: defaultSalaries,
    resumeTips: [
      "Si te postulas a corporativos agroalimentarios como Lala o gigantes metalúrgicos como Peñoles en Torreón, destaca tu capacidad analítica, control de calidad alimentaria o seguridad ambiental (EHS).",
      "Menciona tus certificaciones en inocuidad alimentaria (HACCP) o control ambiental.",
      "Cuantifica tus metas comerciales o de ahorros energéticos en planta."
    ],
    coverLetterTips: defaultCoverLetterTips("Torreón"),
    interviewTips: defaultInterviewTips("Torreón"),
    faqs: defaultFaqs("Torreón"),
    seoTitle: "Plantillas de Currículum en Torreón | CVAI",
    seoDescription: "Crea tu currículum para el sector lácteo, agroindustrial y minero en la Comarca Lagunera desde Torreón. Descarga tu CV gratis."
  }
};

export function getStaticCities(): City[] {
  return Object.values(STATIC_CITIES);
}

export function getStaticCityBySlug(slug: string): City | undefined {
  return STATIC_CITIES[slug];
}
