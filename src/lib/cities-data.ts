export interface City {
  slug: string;
  name: string;
  stateCode: string;
  phoneAreaCode: string;
  isActive: boolean;
  heroImage?: string;
  localEmploymentFocus: string;
  salaryInfo: Record<string, { min: number; max: number; currency: string }>;
  industries: string[];
  hiringSectors: string[];
  companies: string[];
  universities: string[];
  localSkills: string[];
  resumeTips: string[];
  coverLetterTips: string[];
  interviewTips: string[];
  localJobSearchTips: string[];
  faqs: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
}

export const STATIC_CITIES: Record<string, City> = {
  "ciudad-de-mexico": {
    "slug": "ciudad-de-mexico",
    "name": "Ciudad de México",
    "stateCode": "CDMX",
    "phoneAreaCode": "55",
    "isActive": true,
    "localEmploymentFocus": "Centro neurálgico corporativo, financiero, legal, tecnológico y de consultoría en México. Con sede en corredores como Reforma, Polanco, Santa Fe e Insurgentes, el mercado capitalino es altamente competitivo y exige currículums con métricas de impacto comercial y optimización estricta para software ATS de grandes firmas multinacionales.",
    "industries": [
      "Servicios Financieros",
      "Tecnología de la Información",
      "Corporativos",
      "Comercio y Retail",
      "Servicios de Salud"
    ],
    "hiringSectors": [
      "Banca y Finanzas",
      "Desarrollo de Software",
      "Consultoría Empresarial",
      "Marketing Digital",
      "E-commerce"
    ],
    "companies": [
      "Grupo Bimbo",
      "América Móvil",
      "Grupo Carso",
      "Citibanamex",
      "Femsa CDMX",
      "Kavak México"
    ],
    "universities": [
      "Universidad Nacional Autónoma de México (UNAM)",
      "Instituto Politécnico Nacional (IPN)",
      "Tec de Monterrey (Campus Santa Fe / CCM)",
      "ITAM",
      "Universidad Autónoma Metropolitana (UAM)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 30000,
        "max": 90000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 25000,
        "max": 65000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 16000,
        "max": 40000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 14000,
        "max": 32000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 18000,
        "max": 55000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 18000,
        "max": 48000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Finanzas corporativas y modelado financiero",
      "Consultoría de negocio y planeación estratégica",
      "Análisis de datos (SQL, Power BI, Python)",
      "Gestión de stakeholders y comités directivos",
      "Metodologías ágiles (Scrum, Kanban)",
      "Inglés de negocios avanzado (C1/C2)",
      "Cumplimiento normativo y gobernanza corporativa"
    ],
    "resumeTips": [
      "Cuantifica tus logros con indicadores financieros o comerciales: en corporativos de CDMX, cifras como 'Incrementé el EBITDA en 8%' o 'Gestioné un portafolio de $45M MXN' tienen mayor tracción que listas de tareas.",
      "Adapta tu vocabulario a filtros ATS de nivel empresarial (Workday, Taleo, Greenhouse), utilizando términos exactos de la vacante para certificar coincidencia técnica.",
      "Sintetiza tu experiencia en 1 o 2 páginas como máximo: los reclutadores corporativos en la capital revisan cientos de postulaciones por vacante y priorizan brevedad ejecutiva.",
      "Destaca liderazgo en proyectos transversales y coordinación de equipos multidisciplinarios o remotos en Latinoamérica."
    ],
    "coverLetterTips": [
      "Investiga el nombre del Hiring Manager o Director de Área en LinkedIn para personalizar el saludo y evitar el genérico 'A quien corresponda'.",
      "Conecta directamente un hito relevante de tu carrera con un reto u objetivo reciente que la compañía esté enfrentando en el mercado mexicano.",
      "Mantén un tono formal pero dinámico en tres párrafos concisos, demostrando visión estratégica y capacidad de ejecución rápida.",
      "Menciona tu disposición para esquemas híbridos en los principales distritos financieros de la metrópoli."
    ],
    "interviewTips": [
      "Prepárate para paneles de entrevistas múltiples con Recursos Humanos, líderes de área y comités directivos bajo metodología STAR.",
      "Prepara respuestas orientadas al impacto en rentabilidad, gestión del cambio y resolución de contingencias en entornos de alta presión.",
      "Llega con preguntas estratégicas preparadas sobre las metas de la división a mediano plazo y la cultura organizacional del corporativo.",
      "Cuida tu lenguaje corporal y presentación ejecutiva, tanto en sesiones presenciales en corporativo como en videollamadas."
    ],
    "localJobSearchTips": [
      "Optimiza tu perfil de LinkedIn configurando alertas en los corredores de Polanco, Santa Fe, Insurgentes y Reforma, donde se concentra la mayor oferta ejecutiva.",
      "Aprovecha bolsas de trabajo de asociaciones profesionales (como IMEF para finanzas o AMITI para tecnología) y eventos de networking del sector.",
      "Considera el tiempo de traslado metropolitano al evaluar ofertas presenciales o negocia esquemas de trabajo híbrido con días de oficina fijos."
    ],
    "faqs": [
      {
        "q": "¿Cómo adaptar mi currículum para grandes corporativos en Santa Fe o Polanco?",
        "a": "Estructura tu CV con un formato cronológico inverso limpio, encabezados estándar (Experiencia, Educación, Habilidades) y viñetas orientadas a resultados cuantificables. Los corporativos multinacionales utilizan sistemas ATS exigentes que rechazan gráficos y tablas complejas."
      },
      {
        "q": "¿Es indispensable el inglés avanzado en los currículums para CDMX?",
        "a": "Para puestos corporativos, financieros, consultoría y tecnología en la Ciudad de México, el inglés de negocios (B2 o C1) es un filtro prácticamente obligatorio, ya que los reportes y juntas regionales suelen realizarse en inglés."
      },
      {
        "q": "¿Qué extensión de CV prefieren los headhunters en la Ciudad de México?",
        "a": "Una cuartilla es ideal para perfiles junior o con menos de 8 años de experiencia. Para directores o gerentes sénior con trayectoria extensa, dos cuartillas son aceptables siempre que cada línea aporte valor medible."
      },
      {
        "q": "¿Cómo destacar experiencia en empresas multinacionales frente a talento local?",
        "a": "Subraya tu manejo de presupuestos regionales, coordinación con equipos en EE.UU. o Latinoamérica y apego a estándares de gobernanza corporativa internacional."
      },
      {
        "q": "¿Debo incluir mi dirección física en CDMX en el currículum?",
        "a": "Por seguridad y privacidad en México, solo incluye tu alcaldía o zona general (ej. 'Benito Juárez, CDMX' o 'Miguel Hidalgo, CDMX') junto con tu teléfono y correo profesional. Nunca agregues calle ni número exterior."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Ciudad de México | CVAI",
    "seoDescription": "Crea tu currículum optimizado para el competitivo mercado de la CDMX. Plantillas profesionales ATS-friendly, ejemplos de redacción y sugerencias con IA locales."
  },
  "guadalajara": {
    "slug": "guadalajara",
    "name": "Guadalajara",
    "stateCode": "Jal.",
    "phoneAreaCode": "33",
    "isActive": true,
    "localEmploymentFocus": "Reconocida como el Silicon Valley mexicano, la zona metropolitana de Guadalajara (Zapopan, Guadalajara, El Salto) es el clúster líder en desarrollo de software, semiconductores, electrónica automotriz, startups y centros globales de servicios. La demanda privilegia perfiles técnicos con inglés fluido y portafolios verificables.",
    "industries": [
      "Tecnología y Electrónica",
      "Manufactura de Alta Tecnología",
      "Industria Alimentaria",
      "Comercio",
      "Logística"
    ],
    "hiringSectors": [
      "Desarrollo de Software",
      "Diseño de Hardware",
      "Manufactura Electrónica",
      "Logística y Distribución",
      "Agroindustria"
    ],
    "companies": [
      "Oracle México",
      "Intel Guadalajara",
      "Tata Consultancy Services (TCS)",
      "HP Inc",
      "Jabil México",
      "Sanmina"
    ],
    "universities": [
      "Universidad de Guadalajara (UdeG)",
      "ITESO - Universidad Jesuita de Guadalajara",
      "Tec de Monterrey (Campus Guadalajara)",
      "Universidad Autónoma de Guadalajara (UAG)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 28000,
        "max": 80000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 24000,
        "max": 60000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 15000,
        "max": 38000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 13000,
        "max": 29000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 16000,
        "max": 42000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 17000,
        "max": 45000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Desarrollo de software (Java, Python, TypeScript, React)",
      "Arquitectura Cloud (AWS, Azure, GCP)",
      "DevOps e Integración Continua (Docker, Kubernetes, CI/CD)",
      "Diseño y verificación de hardware / VHDL",
      "Metodologías ágiles (Scrum, SAFe)",
      "Inglés conversacional técnico fluido (C1)",
      "Testing automatizado y calidad de código"
    ],
    "resumeTips": [
      "Especifica tu stack tecnológico detallado (lenguajes, frameworks, bases de datos y herramientas en la nube), indicando los años de experiencia o versión dominada.",
      "Incluye enlaces directos y funcionales a tu perfil de GitHub, LinkedIn técnico o portafolio en vivo donde los reclutadores puedan evaluar proyectos reales.",
      "Para centros tecnológicos internacionales en Zapopan, redacta tu currículum en inglés, ya que los hiring managers en EE.UU. o India participan en el proceso de selección.",
      "Enfoca tus descripciones en el impacto del código o arquitectura: por ejemplo, 'Reduje la latencia de la API en 35%' o 'Automaticé el pipeline de despliegue ahorrando 6 horas semanales'."
    ],
    "coverLetterTips": [
      "Menciona tu pasión por la innovación tecnológica y cómo te mantienes actualizado con nuevas librerías, certificaciones o proyectos personales.",
      "Explica cómo has colaborado exitosamente en equipos multiculturales distribuidos geográficamente en esquemas ágiles y remotos.",
      "Resalta tu capacidad para traducir requerimientos de negocio complejos en soluciones técnicas escalables y robustas.",
      "Demuestra conocimiento de los productos o servicios específicos desarrollados por la división de la empresa en Jalisco."
    ],
    "interviewTips": [
      "Prepárate a fondo para pruebas técnicas en vivo (live coding, algoritmos y estructuras de datos en plataformas como HackerRank o LeetCode).",
      "Practica la explicación de arquitectura de sistemas (System Design), justificando decisiones técnicas de base de datos, escalabilidad y seguridad.",
      "Gran parte de la entrevista técnica se llevará a cabo en inglés: practica describir tu código, metodologías y resolución de bugs en este idioma.",
      "Demuestra humildad técnica y curiosidad: si no conoces una herramienta específica, explica tu metodología para aprenderla rápidamente."
    ],
    "localJobSearchTips": [
      "Involúcrate activamente en comunidades de desarrollo locales (GDG Guadalajara, meetups de JavaScript, Python o DevOps en la ciudad).",
      "Explora convocatorias del clúster de tecnologías IJALTI y parques tecnológicos como Ciudad Creativa Digital.",
      "Monitorea ofertas de centros de ingeniería en Zapopan Norte y el corredor periférico tecnológico."
    ],
    "faqs": [
      {
        "q": "¿Cómo estructurar un currículum técnico para empresas de software en Guadalajara?",
        "a": "Coloca tu resumen profesional con tu rol principal (ej. 'Senior Backend Engineer') y stack dominante al inicio, seguido de una sección clara de habilidades técnicas dividida por categorías (Lenguajes, Frameworks, Cloud, Herramientas). Luego detalla tu experiencia laboral con proyectos concretos y métricas de rendimiento."
      },
      {
        "q": "¿Qué nivel de inglés solicitan las empresas de tecnología en Zapopan?",
        "a": "Más del 75% de las vacantes en tecnología en Guadalajara solicitan un nivel intermedio avanzado a fluido (B2 o C1), ya que la mayoría de los clientes, especificaciones y juntas de equipo se gestionan con oficinas en Norteamérica o Europa."
      },
      {
        "q": "¿Conviene incluir enlaces a repositorios de código en el CV?",
        "a": "Sí, es altamente recomendado. Un enlace limpio a tu perfil de GitHub o portafolio personal permite a los evaluadores técnicos comprobar la calidad de tu código y tus contribuciones antes de la primera entrevista."
      },
      {
        "q": "¿Cómo destacar experiencia en metodologías ágiles para startups tapatías?",
        "a": "Menciona tu participación en ceremonias ágiles (sprint planning, dailies, retrospectivas) y resalta certificaciones como Scrum Master (PSM/CSM) o Product Owner si cuentas con ellas."
      },
      {
        "q": "¿Qué certificaciones técnicas tienen mayor peso en Guadalajara?",
        "a": "Las certificaciones en servicios en la nube (AWS Certified Solutions Architect, Azure Fundamentals), Kubernetes (CKA) y certificaciones oficiales en Java o Python son altamente cotizadas en los centros de desarrollo locales."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Guadalajara | CVAI",
    "seoDescription": "Destaca en el Silicon Valley mexicano. Crea tu currículum optimizado para empresas de tecnología y manufactura en Guadalajara. Plantillas ATS gratis."
  },
  "monterrey": {
    "slug": "monterrey",
    "name": "Monterrey",
    "stateCode": "N.L.",
    "phoneAreaCode": "81",
    "isActive": true,
    "localEmploymentFocus": "Capital industrial y de negocios del norte de México, epicentro del fenómeno nearshoring, manufactura avanzada, siderurgia, automotriz y grandes corporativos multinacionales (San Pedro Garza García, Apodaca, Santa Catarina, Pesquería). El mercado laboral valora la eficiencia operativa, el liderazgo firme y la rentabilidad medible.",
    "industries": [
      "Manufactura Avanzada",
      "Siderurgia y Metalurgia",
      "Servicios Corporativos",
      "Logística y Transporte",
      "Comercio"
    ],
    "hiringSectors": [
      "Ingeniería Industrial",
      "Gerencia de Planta",
      "Finanzas y Contabilidad",
      "Cadena de Suministro",
      "Desarrollo de Software"
    ],
    "companies": [
      "Cemex",
      "Femsa",
      "Alfa",
      "Ternium México",
      "Grupo Bimbo Monterrey",
      "Heineken México"
    ],
    "universities": [
      "Universidad Autónoma de Nuevo León (UANL)",
      "Tec de Monterrey (Campus Monterrey)",
      "Universidad de Monterrey (UDEM)",
      "Universidad Regiomontana (U-ERRE)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 28000,
        "max": 80000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 25000,
        "max": 62000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 16000,
        "max": 38000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 14000,
        "max": 30000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 17000,
        "max": 48000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 18000,
        "max": 46000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Manufactura esbelta (Lean Manufacturing / Kaizen)",
      "Metodología Six Sigma (Green Belt / Black Belt)",
      "Gestión de cadena de suministro (Supply Chain & Logistics)",
      "Sistemas ERP (SAP S/4HANA, Oracle Cloud)",
      "Gestión de operaciones de planta y OEE",
      "Negociación comercial de alto impacto",
      "Inglés de negocios bilingüe"
    ],
    "resumeTips": [
      "Fundamenta tus logros con indicadores industriales duros: porcentaje de incremento en OEE, reducción de scrap, ahorros en compras o reducción de tiempos de ciclo de producción.",
      "Destaca tus certificaciones operativas reconocidas internacionalmente (Six Sigma Green/Black Belt, Lean Manufacturing, APICS, PMP o IATF).",
      "Para puestos directivos y corporativos en San Pedro o Monterrey Centro, resalta el manejo de presupuestos anuales (CapEx/OpEx) y gestión de personal sindicalizado o de confianza.",
      "Menciona experiencia en proyectos de relocalización de líneas de producción (nearshoring) o transferencias tecnológicas desde EE.UU. o Asia."
    ],
    "coverLetterTips": [
      "Muestra una mentalidad enfocada en resultados comerciales, disciplina de trabajo y optimización permanente de recursos.",
      "Destaca tu capacidad para trabajar en ambientes industriales dinámicos donde la puntualidad en entregas y la seguridad de planta son primordiales.",
      "Menciona cómo tu experiencia puede integrarse de inmediato a las metas de expansión o modernización de la planta o corporativo regio.",
      "Demuestra conocimiento de los principales mercados de exportación que abastece la empresa desde Nuevo León."
    ],
    "interviewTips": [
      "Prepárate para preguntas profundas sobre manejo de KPIs de planta, seguridad industrial (cero accidentes), control de calidad y resolución de contingencias operativas.",
      "Si la entrevista es en corporativo, proyecta visión de negocio, habilidad para liderar juntas ejecutivas y alineación con objetivos estratégicos de la empresa.",
      "Ten listas cifras exactas sobre ahorros que generaste en empleos anteriores, número de personas a tu cargo y metas de productividad superadas.",
      "Valora y consulta sobre los esquemas de compensación integral (bonos de productividad, fondo de ahorro, seguro de gastos médicos mayores)."
    ],
    "localJobSearchTips": [
      "Consulta bolsas de trabajo vinculadas a CAINTRA Nuevo León y asociaciones de clústeres (automotriz, electrodomésticos, aeroespacial).",
      "Explora los parques industriales en los corredores de Apodaca, Ciénega de Flores, Escobedo, Santa Catarina y Pesquería.",
      "Utiliza redes de egresados de instituciones clave como UANL (FIME/FACPYA) y Tec de Monterrey para conectar con directivos de la industria."
    ],
    "faqs": [
      {
        "q": "¿Qué datos y métricas valoran más las empresas industriales en Monterrey?",
        "a": "Las empresas regias valoran cifras tangibles de eficiencia: porcentaje de reducción de merma/scrap, incremento del Overall Equipment Effectiveness (OEE), ahorros económicos en compras de suministros y cumplimiento del plan de producción sin incidentes de seguridad."
      },
      {
        "q": "¿Es obligatorio incluir certificaciones Six Sigma o Lean en el CV para puestos de manufactura?",
        "a": "No es estrictamente obligatorio para todos los puestos, pero para coordinaciones, ingenierías de proceso y gerencias de planta en Nuevo León, contar con una certificación Green Belt o Black Belt te otorga una ventaja competitiva determinante."
      },
      {
        "q": "¿Cómo presentar experiencia corporativa en San Pedro Garza García?",
        "a": "Enfócate en la toma de decisiones estratégicas, gestión de portafolios de inversión o comerciales, liderazgo de equipos y manejo de ERPs corporativos como SAP, manteniendo un diseño ejecutivo y sobrio."
      },
      {
        "q": "¿Qué formato de currículum funciona mejor con los filtros ATS de maquiladoras en N.L.?",
        "a": "Un formato de una sola columna sin gráficos complejos ni cajas de texto. Usa fuentes estándar (Arial, Calibri) y exporta en PDF con texto seleccionable para que los filtros de recursos humanos lean tu información sin errores."
      },
      {
        "q": "¿Cómo negociar prestaciones superiores a la ley comunes en Monterrey?",
        "a": "Las empresas sólidas en Monterrey suelen ofrecer paquetes con 30 días de aguinaldo, 13% de fondo de ahorro, vales de despensa y SGMM. Al negociar tu sueldo, analiza el paquete integral anual y no solo el salario mensual bruto."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Monterrey | CVAI",
    "seoDescription": "Diseña tu currículum para el competitivo sector industrial y corporativo de Monterrey. Formatos compatibles con ATS, ejemplos de métricas y sugerencias con IA."
  },
  "puebla": {
    "slug": "puebla",
    "name": "Puebla",
    "stateCode": "Pue.",
    "phoneAreaCode": "222",
    "isActive": true,
    "localEmploymentFocus": "Polo automotriz histórico de México (plantas Volkswagen y Audi), rodeado de una vasta cadena de proveedores Tier 1 y Tier 2, industrias metalmecánica, química, textil y un vibrante sector universitario y de servicios. La precisión técnica, el apego normativo internacional y la calidad son ejes centrales de contratación.",
    "industries": [
      "Automotriz y Autopartes",
      "Metalmecánica",
      "Educación Superior",
      "Textil y Confección",
      "Servicios de Salud"
    ],
    "hiringSectors": [
      "Ingeniería Automotriz",
      "Control de Calidad (IATF)",
      "Mantenimiento Industrial",
      "Docencia e Investigación",
      "Logística de Ensamble"
    ],
    "companies": [
      "Volkswagen de México",
      "Audi México (San José Chiapa)",
      "Faurecia México",
      "Benteler de México",
      "Ternium Puebla",
      "Schaeffler"
    ],
    "universities": [
      "Benemérita Universidad Autónoma de Puebla (BUAP)",
      "Universidad de las Américas Puebla (UDLAP)",
      "Tec de Monterrey (Campus Puebla)",
      "Universidad Popular Autónoma del Estado de Puebla (UPAEP)",
      "Instituto Tecnológico de Puebla (ITP)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 22000,
        "max": 65000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 20000,
        "max": 50000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 13000,
        "max": 32000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 11000,
        "max": 26000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 14000,
        "max": 38000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 15000,
        "max": 38000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Normativa de calidad automotriz (IATF 16949 / VDA 6.3)",
      "Core Tools automotrices (APQP, PPAP, FMEA, SPC, MSA)",
      "Metrología dimensional y control de tolerancias",
      "Mantenimiento preventivo total (TPM) y PLC",
      "Resolución estructurada de problemas (8Ds, Ishikawa)",
      "Inglés técnico automotriz / Alemán conversacional",
      "Logística Just-in-Time / Just-in-Sequence (JIT/JIS)"
    ],
    "resumeTips": [
      "Detalla tus conocimientos en normas del sector automotriz europeo (IATF 16949, VDA 6.3 o VDA 6.5) y herramientas Core Tools si buscas incorporarte a la red automotriz poblana.",
      "Para recién egresados de ingeniería de universidades locales (BUAP, UDLAP, UPAEP, ITP), destaca residencias profesionales, servicio social técnico y proyectos finales de titulación.",
      "Cuantifica mejoras en líneas de producción: 'Disminuí el tiempo de cambio de herramentales (SMED) en 20%' o 'Atendí auditorías de cliente sin no conformidades críticas'.",
      "Si tienes conocimientos de alemán básico o intermedio, resáltalo en la sección de idiomas junto con tu nivel de inglés técnico."
    ],
    "coverLetterTips": [
      "Demuestra tu alineación con la rigurosidad, disciplina y estándares de calidad cero defectos propios de la cultura automotriz europea.",
      "Menciona tu conocimiento de las plantas de Cuautlancingo o San José Chiapa y tu disponibilidad para esquemas de turnos rotativos en planta.",
      "Explica cómo tu formación técnica se traduce en estabilidad operativa y prevención de paros de línea para el empleador.",
      "Expresa tu motivación por desarrollarte a largo plazo dentro de la sólida comunidad de manufactura poblana."
    ],
    "interviewTips": [
      "Prepárate para preguntas técnicas sobre metodología 8D para la solución de quejas de cliente y análisis de causa raíz.",
      "Espera evaluaciones prácticas sobre lectura de planos de ingeniería, simbología GD&T o interpretación de diagramas eléctricos/neumáticos.",
      "Practica presentarte en inglés y demostrar soltura técnica con términos de ingeniería automotriz internacional.",
      "Muestra actitud colaborativa para trabajar en células de producción y coordinarte eficazmente con técnicos y operadores."
    ],
    "localJobSearchTips": [
      "Revisa convocatorias en bolsas de trabajo de la Cámara de la Industria Automotriz y parques como Finsa Cuautlancingo y Parque Industrial Puebla 2000.",
      "Aprovecha ferias de empleo universitario en BUAP, UDLAP y Tec de Monterrey, donde reclutan activamente proveedores Tier 1.",
      "Monitorea oportunidades en San José Chiapa y la zona metropolitana de Cholula/Puebla."
    ],
    "faqs": [
      {
        "q": "¿Cómo adaptar mi CV para plantas automotrices como Volkswagen o Audi en Puebla?",
        "a": "Resalta tu formación en ingeniería o manufactura, especificando el dominio de Core Tools automotrices (PPAP, APQP, FMEA) y el conocimiento de la norma IATF 16949. Incluye proyectos donde hayas resuelto problemas de calidad o reducido tiempos de ensamble."
      },
      {
        "q": "¿Qué peso tienen las Core Tools automotrices en el currículum?",
        "a": "En Puebla son un requisito excluyente para la mayoría de los puestos de calidad, procesos y manufactura. Menciónalas de forma explícita en tu sección de habilidades técnicas y detalla cómo las aplicaste en puestos anteriores."
      },
      {
        "q": "¿Cómo redactar el CV si soy recién egresado universitario en Puebla?",
        "a": "Ubica tu formación académica y proyectos destacados al inicio. Detalla tus prácticas profesionales en planta, el software que dominas (SolidWorks, AutoCAD, Catia) y proyectos estudiantiles vinculados a la industria regional."
      },
      {
        "q": "¿Conviene incluir conocimientos de alemán además de inglés para puestos en Puebla?",
        "a": "Sí. Debido a la fuerte presencia alemana en el clúster automotriz poblano, contar con nociones de alemán (incluso nivel A2 o B1) es un diferenciador muy positivo frente a otros candidatos con perfil similar."
      },
      {
        "q": "¿Qué habilidades blandas buscan los reclutadores del sector manufacturero poblano?",
        "a": "Destacan la resiliencia bajo presión de entrega, capacidad de negociación interdepartamental, apego a protocolos de seguridad industrial y habilidad para liderar células de trabajo operativas."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Puebla | CVAI",
    "seoDescription": "Diseña tu currículum para la industria automotriz y manufactura de Puebla. Plantillas profesionales optimizadas para filtros ATS y empleadores locales."
  },
  "tijuana": {
    "slug": "tijuana",
    "name": "Tijuana",
    "stateCode": "B.C.",
    "phoneAreaCode": "664",
    "isActive": true,
    "localEmploymentFocus": "Capital de la industria de dispositivos médicos en Norteamérica, referente en manufactura aeroespacial, ensamble electrónico, logística transfronteriza y operaciones de maquila de exportación (Otay, El Florido, El Águila). El mercado demanda perfiles con estricto apego regulatorio (FDA/ISO), inglés fluido y experiencia binacional.",
    "industries": [
      "Dispositivos Médicos",
      "Aeroespacial",
      "Electrónica y Semiconductores",
      "Logística Transfronteriza",
      "Manufactura de Exportación"
    ],
    "hiringSectors": [
      "Ingeniería Biomédica",
      "Control de Calidad (FDA/ISO 13485)",
      "Supervisión de Ensamble",
      "Comercio Exterior y Aduanas",
      "Mantenimiento Electrónico"
    ],
    "companies": [
      "Medtronic México",
      "Becton Dickinson",
      "Safran Cabin Tijuana",
      "Foxconn Baja California",
      "Greatbatch Medical",
      "Poly (Plantronics)"
    ],
    "universities": [
      "Universidad Autónoma de Baja California (UABC)",
      "Instituto Tecnológico de Tijuana (ITT)",
      "CETYS Universidad (Campus Tijuana)",
      "Universidad Iberoamericana Tijuana"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 27000,
        "max": 75000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 23000,
        "max": 60000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 15000,
        "max": 36000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 13000,
        "max": 28000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 16000,
        "max": 42000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 16000,
        "max": 42000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Normativa médica ISO 13485 y regulaciones FDA (CFR 21)",
      "Operación en cuartos limpios (Cleanrooms clase 10,000 / 100,000)",
      "Validación de procesos (IQ, OQ, PQ)",
      "Comercio exterior y logística binacional (Anexo 24/31)",
      "Sistemas de calidad ISO 9001 / AS9100",
      "Inglés conversacional y técnico bilingüe (B2/C1)",
      "Lean Manufacturing y control estadístico de procesos"
    ],
    "resumeTips": [
      "Si postulas al sector de dispositivos médicos, indica expresamente tu experiencia en validaciones de procesos (IQ, OQ, PQ) y manejo de auditorías de la FDA o ISO 13485.",
      "Redacta versiones de tu currículum en inglés y español: la gran mayoría de las maquilas en Otay y El Florido tienen directivos estadounidenses que evalúan directamente el CV en inglés.",
      "Cuantifica la mejora de rendimiento en líneas de ensamble de precisión o reducción de defectos en partes por millón (PPM).",
      "En perfiles de logística y aduanas, subraya experiencia en cruces fronterizos, pedimentos aduanales, C-TPAT y cumplimiento fiscal de maquiladoras."
    ],
    "coverLetterTips": [
      "Destaca tu capacidad para comunicarte fluidamente en inglés con equipos de diseño o directivos ubicados en San Diego o el resto de EE.UU.",
      "Resalta tu compromiso con la trazabilidad absoluta, higiene de cuartos limpios y cumplimiento de estándares que salvan vidas en el sector médico.",
      "Menciona tu familiaridad con el ritmo acelerado de las operaciones de maquila fronteriza y tu adaptabilidad al cambio de requerimientos.",
      "Indica tu disposición para viajar a plantas hermanas o cruces por trabajo si cuentas con documentación binacional vigente."
    ],
    "interviewTips": [
      "Prepárate para que la entrevista inicie en español y cambie inmediatamente al inglés técnico para verificar tu fluidez real de conversación.",
      "Demuestra conocimiento de los protocolos de buenas prácticas de documentación (GDP) y acciones correctivas y preventivas (CAPA).",
      "Responde a preguntas de comportamiento demostrando liderazgo con empatía hacia el personal operativo de líneas de ensamble.",
      "Prepara ejemplos de auditorías en las que hayas participado y cómo resolviste hallazgos de forma estructurada."
    ],
    "localJobSearchTips": [
      "Monitorea de forma constante la bolsa de trabajo oficial de INDEX Tijuana (Asociación de Maquiladoras) y portales de empleo de Baja California.",
      "Asiste a eventos industriales organizados por el Clúster de Productos Médicos y el Clúster Aeroespacial de Baja California.",
      "Mantén tu red de contactos en LinkedIn activa con reclutadores corporativos de la zona industrial de Otay y El Florido."
    ],
    "faqs": [
      {
        "q": "¿Debo presentar mi CV en inglés o en español para empresas maquiladoras en Tijuana?",
        "a": "Se recomienda tener ambas versiones preparadas. Para puestos de ingeniería, supervisión, calidad, compras y gerencia en Tijuana, el currículum en inglés es el preferido por los gerentes de planta y directores corporativos en California."
      },
      {
        "q": "¿Cómo destacar experiencia en dispositivos médicos bajo normativa FDA o ISO 13485?",
        "a": "Dedica un apartado en tu experiencia a las validaciones de proceso realizadas (IQ, OQ, PQ), diseño de protocolos, manejo de cuartos limpios y participación en auditorías regulatorias, usando la terminología médica estándar internacional."
      },
      {
        "q": "¿Qué buscan los reclutadores en perfiles de logística transfronteriza en Otay?",
        "a": "Buscan conocimiento sólido en despacho aduanal mexicano y estadounidense, certificaciones de seguridad en cadena de suministro (C-TPAT, OEA), manejo de Anexo 24/31 y coordinación con agentes aduanales y transportistas binacionales."
      },
      {
        "q": "¿Es necesario tener visa estadounidense para puestos en la industria de Tijuana?",
        "a": "No es obligatorio para todos los roles, pero para posiciones de gerencia, compras, ingeniería de enlace o calidad, contar con visa B1/B2 vigente es un plus altamente cotizado para asistir a juntas o capacitaciones en EE.UU."
      },
      {
        "q": "¿Cómo estructurar un currículum para puestos de supervisor de producción en maquila?",
        "a": "Prioriza tus métricas de productividad: número de operadores a cargo, porcentaje de eficiencia de línea, reducción de rotación de personal, aplicación de 5S y cumplimiento de metas diarias sin accidentes."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Tijuana | CVAI",
    "seoDescription": "Crea tu currículum para la industria maquiladora, médica y aeroespacial en Tijuana. Plantillas compatibles con ATS y adaptadas al entorno transfronterizo."
  },
  "leon": {
    "slug": "leon",
    "name": "León",
    "stateCode": "Gto.",
    "phoneAreaCode": "477",
    "isActive": true,
    "localEmploymentFocus": "Capital nacional del calzado, la curtiduría y la marroquinería, en sólida diversificación hacia la manufactura automotriz (corredor León-Silao), plástico industrial, comercio mayorista y turismo de negocios (Poliforum León). El mercado premia la optimización de procesos de manufactura, compras estratégicas y expansión comercial B2B.",
    "industries": [
      "Calzado y Marroquinería",
      "Curtiduría y Proveeduría",
      "Automotriz y Autopartes",
      "Comercio y Retail",
      "Servicios de Salud"
    ],
    "hiringSectors": [
      "Control de Calidad en Cuero y Calzado",
      "Supervisión de Líneas de Confección",
      "Ventas B2B y E-commerce",
      "Ingeniería de Manufactura",
      "Compras y Suministro"
    ],
    "companies": [
      "Flexi (Grupo Flexi)",
      "Pirelli México (Silao/León)",
      "Curtidos Treviño",
      "Grupo Cuadra",
      "Bader de México",
      "Guanajuato Puerto Interior"
    ],
    "universities": [
      "Universidad de Guanajuato (Campus León)",
      "Universidad Iberoamericana León",
      "Instituto Tecnológico de León (ITL)",
      "Universidad De La Salle Bajío"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 20000,
        "max": 60000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 19000,
        "max": 48000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 12000,
        "max": 30000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 11000,
        "max": 24000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 13000,
        "max": 35000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 14000,
        "max": 36000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Control de calidad en cuero, piel y calzado",
      "Manufactura esbelta aplicada a líneas de confección",
      "E-commerce de moda y calzado (Shopify, Mercado Libre)",
      "Gestión de compras de insumos y curtiduría",
      "Normativa automotriz para interiores en piel (IATF)",
      "Negociación comercial con cadenas de retail",
      "Supervisión de talleres y maquiladores externos"
    ],
    "resumeTips": [
      "Si tu trayectoria es en calzado o marroquinería, resalta el control de mermas de piel, estandarización de hormas o desarrollo de nuevos modelos de temporada.",
      "Para quienes buscan ingresar al sector automotriz en Silao o León (proveedores de vestiduras o neumáticos), enfatiza certificaciones en normas IATF 16949 y herramientas de calidad.",
      "Muestra logros en ventas comerciales: volumen de pares colocados en cadenas departamentales, apertura de distribuidores foráneos o crecimiento de ventas digitales.",
      "Detalla tu experiencia coordinando talleres maquiladores externos, cumplimiento de fechas de entrega y control de costos unitarios."
    ],
    "coverLetterTips": [
      "Expresa tu conocimiento del dinamismo comercial de León y tu visión para modernizar procesos tradicionales mediante tecnología y diseño.",
      "Demuestra capacidad para negociar con proveedores de curtidos o materias primas y coordinar personal operativo con liderazgo cercano.",
      "Menciona tu familiaridad con temporadas comerciales clave (regreso a clases, SAPICA, temporadas de moda) y tu planeación de inventarios.",
      "Alinea tu propuesta de valor con las metas de expansión nacional o de exportación de la marca leonesa."
    ],
    "interviewTips": [
      "Lleva ejemplos claros de cómo has solucionado problemas de calidad en acabados de producto o retrasos en suministros de materia prima.",
      "Prepárate para explicar tus criterios para la inspección y aprobación de pieles, textiles sintéticos o componentes de inyección de plástico.",
      "En puestos comerciales, muestra tu entendimiento del margen bruto, condiciones de crédito para mayoristas y rotación de producto en punto de venta.",
      "Transmite compromiso con la calidad artesanal e industrial que caracteriza a las marcas consolidadas de Guanajuato."
    ],
    "localJobSearchTips": [
      "Acude o vincula tu postulación con ferias industriales como SAPICA (calzado) y ANPIC (proveeduría de cuero y maquinaria).",
      "Consulta bolsas de empleo de la CICEG (Cámara del Calzado) y CICUR (Cámara de la Curtiduría).",
      "Explora vacantes en los parques industriales Las Colinas, Stiva León y Guanajuato Puerto Interior (Silao)."
    ],
    "faqs": [
      {
        "q": "¿Cómo elaborar un CV para la industria del calzado y manufactura en León?",
        "a": "Enfócate en la experiencia de producto: tipos de calzado dominados (casual, bota vaquera, deportivo, seguridad), manejo de software de patronaje (como Crispin o Romans CAD), control de mermas de corte y supervisión de líneas de pespunte y montado."
      },
      {
        "q": "¿Cómo hacer la transición de la industria tradicional del cuero al sector automotriz de Silao?",
        "a": "Resalta tus competencias transferibles: inspección visual de pieles para vestiduras automotrices, apego a fichas técnicas internacionales, auditorías de calidad y manejo de metodologías 5S y Lean Manufacturing."
      },
      {
        "q": "¿Qué habilidades comerciales son más valoradas en empresas leonesas?",
        "a": "La prospección de clientes B2B (distribuidores mayoristas, zapaterías y cadenas departamentales), negociación de pedidos por volumen, administración de inventarios en consignación y gestión de canales e-commerce."
      },
      {
        "q": "¿Conviene incluir cursos de software CAD/CAM en el CV para calzado o manufactura?",
        "a": "Sí, el dominio de herramientas de patronaje digital y corte automatizado (Lectra, Gerber) es sumamente valorado por fabricantes que buscan optimizar el aprovechamiento de la piel y agilizar el modelado."
      },
      {
        "q": "¿Cómo estructurar un currículum para mandos medios en plantas de producción en Guanajuato?",
        "a": "Destaca la cantidad de operadores supervisados, el cumplimiento del programa semanal de producción, índices de ausentismo reducidos y la implementación de mejoras de seguridad e higiene."
      }
    ],
    "seoTitle": "Plantillas de Currículum en León | CVAI",
    "seoDescription": "Diseña tu currículum para la industria del calzado, marroquinería y manufactura automotriz en León, Guanajuato. Plantillas ATS profesionales."
  },
  "merida": {
    "slug": "merida",
    "name": "Mérida",
    "stateCode": "Yuc.",
    "phoneAreaCode": "999",
    "isActive": true,
    "localEmploymentFocus": "Polo económico, médico, educativo y tecnológico del sureste mexicano. Con gran auge en servicios corporativos, desarrollo de software, turismo cultural/gastronómico, sector inmobiliario y logística portuaria conectada a Puerto Progreso. El mercado valora la calidez en atención al cliente, competencias bilingües y profesionalismo corporativo.",
    "industries": [
      "Servicios y Comercio",
      "Tecnologías de la Información",
      "Turismo y Hospitalidad",
      "Sector Inmobiliario y Construcción",
      "Servicios de Salud"
    ],
    "hiringSectors": [
      "Desarrollo de Software Remoto/Híbrido",
      "Atención a Clientes Bilingüe",
      "Ventas Inmobiliarias",
      "Administración Hospitalaria",
      "Logística Portuaria (Progreso)"
    ],
    "companies": [
      "Bepensa",
      "Grupo Crío",
      "Kekén (Grupo Porcícola Mexicano)",
      "Grupo Nicxa",
      "Woodgenix Mérida",
      "Uman Industrial Logistics"
    ],
    "universities": [
      "Universidad Autónoma de Yucatán (UADY)",
      "Universidad Marista de Mérida",
      "Universidad Anáhuac Mayab",
      "Instituto Tecnológico de Mérida (ITM)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 20000,
        "max": 62000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 18000,
        "max": 48000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 12000,
        "max": 28000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 10000,
        "max": 23000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 13000,
        "max": 36000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 14000,
        "max": 38000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Atención y servicio a clientes multiculturales",
      "Ventas consultivas de bienes raíces y terrenos de inversión",
      "Desarrollo web y móvil en esquemas remotos",
      "Administración y contabilidad empresarial",
      "Marketing digital y captación de leads",
      "Inglés conversacional y de negocios (B2/C1)",
      "Logística de distribución y comercio costero"
    ],
    "resumeTips": [
      "Si buscas vacantes de trabajo remoto o híbrido en tecnología desde Mérida, resalta tu autogestión, metodologías ágiles y conectividad estable.",
      "Para el pujante sector inmobiliario y de desarrollo urbano, incluye métricas de ventas concretas: volumen de ventas en desarrollos residenciales, cierre de escrituras o porcentaje de conversión de prospectos foráneos.",
      "En el rubro de servicios y hotelería boutique, destaca tu dominio del inglés conversacional para atención a turistas y residentes extranjeros en la península.",
      "Subraya certificaciones profesionales (como AMPI para inmobiliarios o certificaciones cloud para programadores) para sobresalir en un mercado que atrae talento de todo el país."
    ],
    "coverLetterTips": [
      "Transmite una comunicación respetuosa, profesional y empática, alineada con la cultura de confianza y servicio que valoran las empresas yucatecas.",
      "Explica tu conocimiento de la dinámica socioeconómica de Mérida y tu visión a largo plazo para crecer con la empresa en la región.",
      "Si te mudaste recientemente a Mérida, menciona tu arraigo y compromiso de residencia permanente para brindar certidumbre al empleador.",
      "Muestra entusiasmo por proyectos que fortalezcan el desarrollo sustentable y económico del estado."
    ],
    "interviewTips": [
      "Sé puntual, cordial y demuestra una actitud colaborativa; las referencias laborales y la reputación profesional son muy cuidadas en Mérida.",
      "Prepárate para preguntas sobre cómo gestionas relaciones con clientes exigentes o inversionistas de diferentes partes de México y Norteamérica.",
      "En empresas de tecnología o centros de servicios compartidos, prepárate para responder preguntas conductuales y técnicas en inglés.",
      "Pregunta de forma constructiva sobre los planes de crecimiento de la empresa en el sureste y su cultura interna."
    ],
    "localJobSearchTips": [
      "Explora convocatorias del Parque Científico Tecnológico de Yucatán (PCTY) y bolsas de empleo del clúster tecnológico Yucatán i6.",
      "Utiliza LinkedIn para conectar con directores de agencias inmobiliarias consolidadas y corporativos del corredor Mérida-Progreso.",
      "Consulta bolsas de egresados de la UADY, Universidad Marista y Anáhuac Mayab."
    ],
    "faqs": [
      {
        "q": "¿Qué perfil de CV es más demandado en el sector inmobiliario y comercial de Mérida?",
        "a": "Perfiles que combinen habilidades comerciales, prospección digital, conocimiento legal de contratos de compraventa y experiencia en asesoramiento a compradores nacionales y extranjeros, con énfasis en metas alcanzadas en millones de pesos."
      },
      {
        "q": "¿Cómo estructurar un currículum para puestos de trabajo remoto desde Mérida?",
        "a": "Indica tu rol con claridad (ej. 'Senior React Developer - Remote'), especifica tus herramientas de colaboración asíncrona (Slack, Jira, Git, Notion) y resalta tu historial de cumplimiento de sprints sin supervisión presencial."
      },
      {
        "q": "¿Qué nivel de inglés se requiere para servicios corporativos y hotelería en Yucatán?",
        "a": "Para hotelería boutique y agencias turísticas se solicita un nivel B2 (intermedio alto conversacional). En empresas de tecnología y consultoría internacional se requiere C1 para comunicarse con clientes en EE.UU. o Canadá."
      },
      {
        "q": "¿Cómo destacar experiencia en atención a clientes en un CV para Mérida?",
        "a": "Incluye indicadores de satisfacción (CSAT o NPS), volumen de cuentas gestionadas, retención de clientes y habilidades para resolver desacuerdos con empatía y rapidez."
      },
      {
        "q": "¿Qué oportunidades laborales existen en el sector tecnológico emergente en Mérida?",
        "a": "Hay creciente demanda en desarrollo web full stack, ciberseguridad, análisis de datos y soporte en la nube, tanto en empresas locales con proyección nacional como en consultorías extranjeras que operan en la ciudad."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Mérida | CVAI",
    "seoDescription": "Crea tu currículum para el dinámico sector de tecnología, inmobiliario y servicios en Mérida, Yucatán. Plantillas ATS optimizadas y consejos locales."
  },
  "queretaro": {
    "slug": "queretaro",
    "name": "Querétaro",
    "stateCode": "Qro.",
    "phoneAreaCode": "442",
    "isActive": true,
    "localEmploymentFocus": "Referente continental en manufactura aeronáutica y aeroespacial, industria automotriz avanzada, electrodomésticos, centros de datos (data centers) y logística central del Bajío. Con parques industriales como El Marqués, Parque Aeroespacial y Balvanera, las empresas exigen perfiles de alta ingeniería, cumplimiento normativo estricto y certificaciones técnicas.",
    "industries": [
      "Aeroespacial y Aeronáutica",
      "Automotriz y Autopartes",
      "Centros de Datos y TI",
      "Electrodomésticos",
      "Logística y Distribución"
    ],
    "hiringSectors": [
      "Ingeniería Aeronáutica",
      "Calidad Aeroespacial (AS9100)",
      "Mantenimiento a Centros de Datos",
      "Maquinados de Precisión CNC",
      "Ingeniería de Ensamble Automotriz"
    ],
    "companies": [
      "Bombardier México",
      "Safran Querétaro",
      "General Electric (GE IQ)",
      "Continental Querétaro",
      "Mabe",
      "Santander Operaciones México"
    ],
    "universities": [
      "Universidad Nacional Aeronáutica en Querétaro (UNAQ)",
      "Universidad Autónoma de Querétaro (UAQ)",
      "Tec de Monterrey (Campus Querétaro)",
      "Instituto Tecnológico de Querétaro (ITQ)",
      "Universidad Politécnica de Querétaro (UPQ)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 26000,
        "max": 75000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 24000,
        "max": 62000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 15000,
        "max": 36000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 12000,
        "max": 27000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 16000,
        "max": 44000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 16000,
        "max": 42000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Normativa aeroespacial AS9100 y Nadcap",
      "Normativa automotriz IATF 16949 y Core Tools",
      "Metrología dimensional y tolerancias GD&T",
      "Programación y operación de maquinaria CNC / CAD-CAM",
      "Infraestructura de Data Centers (Uptime Institute / HVAC)",
      "Inglés técnico aeroespacial avanzado (C1)",
      "Lean Six Sigma y análisis de falla (FMEA)"
    ],
    "resumeTips": [
      "Indica con exactitud las normas aeronáuticas (AS9100 Rev D, Nadcap, FAA) o automotrices que has implementado o bajo las cuales has operado en planta.",
      "Destaca tu manejo de tolerancias geométricas (GD&T), software de diseño (Catia, NX, SolidWorks) y metrología con brazos CMM o escáneres ópticos.",
      "Para infraestructura y centros de datos en El Marqués, detalla tu experiencia con plantas de emergencia, sistemas de enfriamiento crítico y certificaciones Uptime Institute.",
      "Menciona proyectos de reducción de no conformidades internas y tiempo de respuesta a auditorías de clientes aeroespaciales en Norteamérica o Europa."
    ],
    "coverLetterTips": [
      "Alinea tu mensaje con la filosofía de cero defectos y seguridad aérea: en Querétaro, la precisión de cada componente es crítica.",
      "Explica cómo tu disciplina metódica ayuda a minimizar riesgos de auditoría y acelera la homologación de nuevos números de parte.",
      "Menciona tu disposición para laborar en parques industriales clave (El Marqués, Querétaro Aeropuerto, Bernardo Quintana).",
      "Resalta tu habilidad para colaborar en equipos bilingües con sedes matrices en Francia, Canadá o Estados Unidos."
    ],
    "interviewTips": [
      "Prepárate para evaluaciones técnicas profundas sobre tolerancias geométricas, procesos especiales de tratamiento térmico o ensamble estructural.",
      "Espera preguntas sobre cómo reaccionas ante una discrepancia dimensional en una pieza crítica de turbina o chasis automotriz.",
      "Demuestra tu nivel de inglés técnico explicando un proyecto de ingeniería complejo con soltura y terminología adecuada.",
      "Muestra alta orientación al detalle y apego a manuales de procedimiento técnico sin desviaciones no autorizadas."
    ],
    "localJobSearchTips": [
      "Consulta convocatorias de empleo del Clúster Aeroespacial de Querétaro (Aeroclúster) y del Clúster Automotriz (Vórtice IT).",
      "Participa en eventos y ferias de reclutamiento de la UNAQ y de la Universidad Politécnica de Querétaro.",
      "Revisa portales de proveedores en los parques industriales de El Marqués, Colón y Santa Rosa Jáuregui."
    ],
    "faqs": [
      {
        "q": "¿Cómo enfocar un currículum para el sector aeroespacial en Querétaro?",
        "a": "Prioriza tus certificaciones de calidad (AS9100, Nadcap), tu dominio de software especializado (Catia, NX), experiencia en cuartos limpios o mecanizado de aleaciones aeronáuticas (titanio, inconel) y el apego estricto a manuales técnicos internacionales."
      },
      {
        "q": "¿Qué certificaciones son imprescindibles en las industrias de alta tecnología en Querétaro?",
        "a": "Las más solicitadas son AS9100, IATF 16949, Six Sigma (Green Belt), GD&T (ASME Y14.5) y certificaciones en infraestructura crítica de Data Centers (ATD o ATS de Uptime Institute)."
      },
      {
        "q": "¿Cómo presentar experiencia en centros de datos o infraestructura de TI en Querétaro?",
        "a": "Detalla tu experiencia con sistemas de energía ininterrumpida (UPS), generadores diésel de respaldo, monitoreo DCIM, sistemas contra incendios y protocolos de alta disponibilidad 24/7."
      },
      {
        "q": "¿Qué peso tiene el inglés técnico en las entrevistas de trabajo en El Marqués y Juriquilla?",
        "a": "Es fundamental. Casi todas las empresas aeroespaciales y centros de ingeniería de software en Querétaro realizan al menos una fase de la entrevista totalmente en inglés para verificar comunicación con corporativos."
      },
      {
        "q": "¿Cómo destacar habilidades de calidad y cero defectos en el CV?",
        "a": "Incluye datos específicos: 'Mantuvimos un indicador de 0 PPM durante 14 meses consecutivos' o 'Lideré la recertificación AS9100 sin hallazgos mayores'."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Querétaro | CVAI",
    "seoDescription": "Diseña tu currículum para la industria aeroespacial, automotriz y data centers en Querétaro. Plantillas ATS profesionales con consejos locales."
  },
  "toluca": {
    "slug": "toluca",
    "name": "Toluca",
    "stateCode": "Edo. Méx.",
    "phoneAreaCode": "722",
    "isActive": true,
    "localEmploymentFocus": "Segundo polo industrial del centro de México y corazón logístico que abastece al Valle de México. Sobresale en industria farmacéutica, manufactura automotriz (planta Stellantis y proveedores), alimentos y bebidas procesadas, química industrial y grandes centros de distribución (CEDIS en Lerma y Toluca). Se valora el apego a normativas sanitarias, seguridad industrial y eficiencia logística.",
    "industries": [
      "Farmacéutica y Salud",
      "Automotriz y Ensamble",
      "Alimentos Procesados y Bebidas",
      "Química Industrial",
      "Logística y Almacenaje (CEDIS)"
    ],
    "hiringSectors": [
      "Química Analítica y Control Microbiológico",
      "Buenas Prácticas de Manufactura (GMP)",
      "Mantenimiento Industrial",
      "Operaciones de Almacén y WMS",
      "Ingeniería de Ensamble"
    ],
    "companies": [
      "Stellantis México (Planta Toluca)",
      "Pfizer México",
      "Sanofi México",
      "Bayer de México",
      "Femsa Toluca",
      "Nestlé México (Fábrica Toluca)"
    ],
    "universities": [
      "Universidad Autónoma del Estado de México (UAEMex)",
      "Instituto Tecnológico de Toluca (ITTol)",
      "Tec de Monterrey (Campus Toluca)",
      "Universidad Politécnica del Valle de Toluca (UPVT)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 22000,
        "max": 65000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 21000,
        "max": 55000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 14000,
        "max": 34000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 12000,
        "max": 26000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 14000,
        "max": 38000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 15000,
        "max": 38000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Buenas Prácticas de Fabricación (GMP / BPF) y COFEPRIS",
      "Validación de métodos analíticos y microbiología",
      "Sistemas de gestión de almacén (WMS / SAP WM)",
      "Mantenimiento electromecánico de líneas de envasado",
      "Seguridad e Higiene Industrial (Normas STPS / OHSAS)",
      "Control de cadena de frío farmacéutica y alimentaria",
      "Logística de distribución masiva a CDMX"
    ],
    "resumeTips": [
      "Si tu área es farmacéutica o de alimentos, especifica tu dominio de la NOM-059-SSA1 (medicamentos), NOM-251-SSA1 (alimentos) y normativas de COFEPRIS o FDA.",
      "Para puestos de logística en los grandes CEDIS de Lerma y Toluca, resalta manejo de ERPs (SAP, Oracle), sistemas WMS, control de inventarios cíclicos y reducción de mermas.",
      "En el área automotriz de la planta Stellantis y autopartes, destaca experiencia en líneas de soldadura robotizada, ensamble y cumplimiento de programas diarios de producción.",
      "Cuantifica logros operativos: 'Optimicé el tiempo de despacho en CEDIS en un 18%' o 'Coordiné la validación de tres líneas de acondicionamiento primario sin desviaciones sanitarias'."
    ],
    "coverLetterTips": [
      "Demuestra tu estricto compromiso con la bioseguridad, higiene y apego a procedimientos normalizados de operación (PNO).",
      "Menciona tu disposición para turnos rolados y tu facilidad de traslado a los parques industriales Toluca 2000, Lerma o Exportec.",
      "Resalta tu habilidad para mantener la continuidad operativa en plantas que abastecen al mercado más grande del país.",
      "Explica cómo tu formación técnica contribuye a prevenir auditorías negativas o paros no programados de maquinaria."
    ],
    "interviewTips": [
      "Prepárate para preguntas sobre manejo de contingencias en líneas de producción continua o alertas sanitarias en plantas farmacéuticas.",
      "Espera evaluaciones sobre trazabilidad de lotes, investigación de desviaciones (OOS / OOT) y acciones correctivas (CAPA).",
      "Demuestra conocimiento práctico sobre normativas de seguridad laboral vigentes de la STPS para prevenir riesgos de trabajo.",
      "Proyecta responsabilidad, rigor técnico y capacidad para coordinar operadores de línea con respeto y eficiencia."
    ],
    "localJobSearchTips": [
      "Revisa bolsas de empleo de las asociaciones farmacéuticas y del clúster automotriz del Estado de México.",
      "Monitorea ofertas en los corredores industriales de Lerma, Parque Toluca 2000, Exportec y San Mateo Atenco.",
      "Aprovecha ferias de empleo universitario de la UAEMex y del Instituto Tecnológico de Toluca."
    ],
    "faqs": [
      {
        "q": "¿Cómo estructurar un CV para la industria farmacéutica en Toluca?",
        "a": "Dedica un apartado específico a tus conocimientos normativos (NOM-059, GMP, COFEPRIS), equipos de laboratorio dominados (HPLC, espectrofotometría, cámaras de estabilidad) y experiencia en validaciones de procesos y limpieza de líneas."
      },
      {
        "q": "¿Qué certificaciones sanitarias o de calidad COFEPRIS conviene listar?",
        "a": "Incluye certificaciones en Buenas Prácticas de Manufactura (GMP), Auditor Interno ISO 9001/ISO 22000, diplomados en Asuntos Regulatorios y cursos certificados en farmacovigilancia y validación de sistemas computarizados (GAMP 5)."
      },
      {
        "q": "¿Cómo redactar la experiencia laboral para puestos de logística y CEDIS en Lerma?",
        "a": "Enfócate en volumen de tarimas o pedidos procesados al día, exactitud de inventarios (IRA), porcentaje de pedidos entregados a tiempo y completos (OTIF) y dominio de software de almacenes (WMS)."
      },
      {
        "q": "¿Qué valoran las plantas automotrices y químicas de Toluca en un candidato?",
        "a": "Valorar la estabilidad laboral, el conocimiento de normas de seguridad ambiental y ocupacional, experiencia en líneas automatizadas y disposición para colaborar en equipos de mejora continua."
      },
      {
        "q": "¿Cómo destacar la disponibilidad de traslado dentro de la zona metropolitana de Toluca?",
        "a": "Menciona en tu perfil tu zona de residencia (ej. 'Toluca / Metepec') y aclara si cuentas con vehículo propio o facilidad para trasladarte a parques en Lerma, Exportec o Zinacantepec."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Toluca | CVAI",
    "seoDescription": "Crea tu currículum para la industria farmacéutica, automotriz y logística de Toluca y Lerma. Plantillas profesionales optimizadas para ATS."
  },
  "chihuahua": {
    "slug": "chihuahua",
    "name": "Chihuahua",
    "stateCode": "Chih.",
    "phoneAreaCode": "614",
    "isActive": true,
    "localEmploymentFocus": "Capital de manufactura aeroespacial avanzada, ensamble electrónico de precisión, automotriz, metalmecánica y agroindustria del norte de México (Complejo Industrial Chihuahua, Parque Las Américas). La región se distingue por su alta densidad de ingenieros certificados, apego a estándares militares/aeroespaciales (AS9100) y producción de exportación.",
    "industries": [
      "Aeroespacial",
      "Automotriz y Autopartes",
      "Electrónica y Cableado",
      "Metalmecánica",
      "Agroindustria"
    ],
    "hiringSectors": [
      "Ingeniería de Manufactura Aeroespacial",
      "Ensamble de Arneses Eléctricos",
      "Maquinado CNC de Alta Precisión",
      "Mantenimiento Industrial",
      "Calidad y Metrología"
    ],
    "companies": [
      "Safran Aerosystems Chihuahua",
      "Honeywell Aerospace",
      "Bell Flight México",
      "Jabil Circuit Chihuahua",
      "Ford Motor Company (Motores Chihuahua)",
      "Visteon"
    ],
    "universities": [
      "Universidad Autónoma de Chihuahua (UACH)",
      "Instituto Tecnológico de Chihuahua (ITCH)",
      "Universidad Politécnica de Chihuahua (UPCH)",
      "Tec de Monterrey (Campus Chihuahua)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 25000,
        "max": 72000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 22000,
        "max": 58000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 14000,
        "max": 34000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 12000,
        "max": 26000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 15000,
        "max": 40000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 15000,
        "max": 40000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Normativa aeroespacial AS9100 y Nadcap",
      "Estándares de ensamble electrónico IPC-A-610 / WHMA-A-620",
      "Maquinado CNC multi-ejes y software Mastercam",
      "Metodología de resolución de problemas 8D",
      "Control estadístico de procesos (SPC) y Minitab",
      "Inglés técnico conversacional para enlace con EE.UU.",
      "Diseño de herramentales y poka-yokes"
    ],
    "resumeTips": [
      "Enfatiza tus conocimientos en estándares de cableado y ensamble de arneses aeroespaciales (IPC/WHMA-A-620) o soldadura electrónica (IPC-J-STD-001).",
      "Menciona experiencia en auditorías de clientes de aviación civil y militar en Norteamérica, destacando el cumplimiento de especificaciones sin concesiones de calidad.",
      "Cuantifica la reducción de scrap en procesos de maquinado de precisión o ensamble de arneses complejos en plantas exportadoras.",
      "Incluye tu nivel de inglés técnico para interpretar dibujos de ingeniería, planos de ensamble y comunicar resultados con plantas en EE.UU."
    ],
    "coverLetterTips": [
      "Demuestra tu alineación con la cultura de alta precisión técnica, seguridad y mejora continua de la industria manufacturera chihuahuense.",
      "Resalta tu habilidad para coordinar células de trabajo técnico y solucionar problemas de línea con metodología analítica 8D.",
      "Menciona tu interés en contribuir a los proyectos de transferencia de tecnología y crecimiento del clúster aeroespacial local.",
      "Indica tu disponibilidad para trabajar en turnos de planta en los parques industriales de Chihuahua Capital."
    ],
    "interviewTips": [
      "Prepárate para explicar en detalle cómo has liderado o participado en la contención y análisis de causa raíz de defectos mediante diagramas de Ishikawa y 5 Porqués.",
      "Espera preguntas técnicas sobre lectura de planos con simbología GD&T y uso de instrumentos de metrología como micrómetros, comparadores ópticos o CMM.",
      "Practica responder preguntas en inglés técnico sobre procedimientos de manufactura y estándares de calidad.",
      "Muestra actitud orientada al trabajo en equipo y a la comunicación abierta con ingenieros de diseño y operadores de planta."
    ],
    "localJobSearchTips": [
      "Revisa convocatorias activas a través de INDEX Chihuahua (Asociación de Maquiladoras y Exportadoras).",
      "Consulta vacantes en el Clúster Aeroespacial de Chihuahua y en el Clúster Automotriz estatal.",
      "Aprovecha las bolsas de trabajo del Instituto Tecnológico de Chihuahua (ITCH) y de la UACH."
    ],
    "faqs": [
      {
        "q": "¿Qué información priorizar en un CV para maquiladoras aeroespaciales en Chihuahua?",
        "a": "Certificaciones bajo la norma AS9100, experiencia con arneses de aviación, maquinado CNC de precisión, conocimiento de estándares IPC y proyectos de ingeniería donde hayas reducido desperdicio o mejorado tiempos de ciclo."
      },
      {
        "q": "¿Cómo acreditar nivel de inglés técnico en el currículum?",
        "a": "Especifica tu nivel con una escala reconocida (ej. 'B2 Avanzado - Comunicación técnica fluida') y detalla en tu experiencia que coordinabas juntas de ingeniería o elaborabas reportes técnicos en inglés con clientes en el extranjero."
      },
      {
        "q": "¿Qué importancia tienen las certificaciones IPC en ensamble electrónico en Chihuahua?",
        "a": "Son altamente cotizadas. Certificaciones como IPC-A-610 (aceptabilidad de ensambles electrónicos) o IPC/WHMA-A-620 (arneses de cables) abren puertas directas a puestos de inspector de calidad y supervisor técnico."
      },
      {
        "q": "¿Cómo redactar logros en puestos de ingeniería de manufactura en plantas chihuahuenses?",
        "a": "Usa la fórmula: Verbo de acción + Métrica inicial vs final + Método utilizado. Ejemplo: 'Reduje el scrap de arneses en un 28% mediante la implementación de nuevos poka-yokes y capacitación en estación'."
      },
      {
        "q": "¿Qué formato de currículum es más compatible con los ATS de empresas exportadoras?",
        "a": "Un diseño limpio en PDF sin tablas anidadas, íconos gráficos ni barras de nivel de idioma. Asegúrate de incluir palabras clave como 'AS9100', 'Lean', 'Six Sigma' y 'GD&T' de forma textual."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Chihuahua | CVAI",
    "seoDescription": "Crea tu currículum para la industria aeroespacial, automotriz y manufacturera en Chihuahua. Plantillas profesionales compatibles con filtros ATS."
  },
  "cancun": {
    "slug": "cancun",
    "name": "Cancún",
    "stateCode": "Q. Roo",
    "phoneAreaCode": "998",
    "isActive": true,
    "localEmploymentFocus": "Principal destino turístico internacional de América Latina y motor económico de Quintana Roo. El mercado gira en torno a la hotelería de lujo (hoteles de Gran Turismo y Cinco Diamantes), resorts todo incluido, gestión de alimentos y bebidas, turismo de reuniones (MICE), aviación comercial y servicios turísticos prémium. El servicio de excelencia y los idiomas son fundamentales.",
    "industries": [
      "Hotelería y Hospitalidad",
      "Alimentos y Bebidas",
      "Turismo y Entretenimiento",
      "Transportación y Aviación",
      "Comercio Minorista de Lujo"
    ],
    "hiringSectors": [
      "Gerencia de Hotel y División Cuartos",
      "Alimentos y Bebidas (A&B)",
      "Atención al Huésped (Guest Service)",
      "Ventas y Grupos (MICE)",
      "Mantenimiento Hotelero"
    ],
    "companies": [
      "Grupo Xcaret",
      "Palace Resorts",
      "RCD Hotels (Hard Rock)",
      "Marriott International Cancún",
      "AMResorts / Hyatt Inclusive",
      "Grupo Posadas"
    ],
    "universities": [
      "Universidad La Salle Cancún",
      "Universidad del Caribe (Unicaribe)",
      "Universidad Anáhuac Cancún",
      "Instituto Tecnológico de Cancún"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 20000,
        "max": 55000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 22000,
        "max": 55000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 14000,
        "max": 32000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 11000,
        "max": 24000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 14000,
        "max": 38000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 15000,
        "max": 38000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Estándares de hospitalidad AAA / Forbes / Cinco Diamantes",
      "Inglés conversacional fluido bilingüe (C1/C2)",
      "Sistemas de gestión hotelera PMS (Opera, protel, Maestro)",
      "Manejo higiénico de alimentos (Distintivo H / Cristal)",
      "Resolución asertiva de quejas y mediación con huéspedes",
      "Ventas de banquetes, bodas y convenciones (MICE)",
      "Idiomas adicionales (francés, portugués, alemán)"
    ],
    "resumeTips": [
      "Detalla tu dominio comprobado de idiomas con porcentajes o niveles marco europeo (inglés indispensable con fluidez conversacional; segundo idioma extranjero suma gran valor).",
      "Especifica tu experiencia bajo estándares internacionales de hospitalidad (AAA Five Diamonds, Forbes Travel Guide, Leading Hotels of the World o Cristal International Standards).",
      "Menciona software hotelero dominado (Opera PMS, Micros POS, protel) y certificaciones en manejo de alimentos (Distintivo H, ServSafe).",
      "Cuantifica logros de servicio y satisfacción: 'Incrementé el puntaje NPS de división cuartos en 12 puntos' o 'Superé la meta de ventas de banquetes en $2M MXN anuales'."
    ],
    "coverLetterTips": [
      "Transmite calidez, vocación genuina de hospitalidad y orgullo por representar al turismo mexicano ante visitantes de todo el mundo.",
      "Demuestra experiencia en anticiparte a las necesidades de huéspedes de alto perfil o perfiles multiculturales exigentes.",
      "Menciona tu adaptabilidad para jornadas operativas en temporada alta y eventos especiales en hoteles de Zona Hotelera o Riviera Maya.",
      "Destaca tu habilidad para mantener la compostura, serenidad y cortesía impecable ante contingencias o situaciones de estrés."
    ],
    "interviewTips": [
      "Cuida al máximo tu imagen personal, dicción y cordialidad; la entrevista de hotelería evalúa tu presencia ejecutiva desde el primer saludo.",
      "Espera que una parte importante de la entrevista se desarrolle en inglés para evaluar tu fluidez espontánea y manejo de vocabulario hotelero.",
      "Prepara ejemplos concretos de cómo convertiste la queja de un huésped molesto en una experiencia memorable de lealtad hacia el resort.",
      "Muestra conocimientos básicos sobre sustentabilidad turística y certificaciones ambientales (EarthCheck, Bandera Azul)."
    ],
    "localJobSearchTips": [
      "Postula en portales corporativos de cadenas hoteleras con presencia en Cancún, Riviera Maya y Costa Mujeres.",
      "Consulta convocatorias de la Asociación de Hoteles de Cancún, Puerto Morelos e Isla Mujeres.",
      "Aprovecha bolsas de trabajo de la Universidad del Caribe y La Salle Cancún, especializadas en gastronomía y turismo."
    ],
    "faqs": [
      {
        "q": "¿Qué nivel de inglés es realmente necesario para trabajar en hotelería en Cancún?",
        "a": "Para puestos de contacto directo con huéspedes (recepción, concierge, meseros, relaciones públicas y gerencias), se requiere inglés fluido o bilingüe (B2 o C1). Para áreas operativas de soporte, un nivel básico o técnico puede ser suficiente según el hotel."
      },
      {
        "q": "¿Cómo plasmar certificaciones como Distintivo H o estándares Diamante en el CV?",
        "a": "Crea una sección visible de 'Certificaciones y Estándares' donde menciones Distintivo H, ServSafe, estándares AAA Diamond o auditorías Cristal, indicando el año de vigencia o participación en la recertificación del centro de consumo."
      },
      {
        "q": "¿Conviene incluir foto en el currículum para puestos de servicio al cliente en Cancún?",
        "a": "En hotelería y relaciones públicas en México aún es una práctica extendida para evaluar presentación ejecutiva, aunque no es legalmente obligatoria. Si decides incluirla, utiliza una fotografía profesional con ropa formal y fondo neutro."
      },
      {
        "q": "¿Cómo destacar experiencia en resolución de quejas y satisfacción del huésped?",
        "a": "Describe casos específicos: manejo de sobreventa, solución de peticiones especiales VIP o resolución de inconformidades, mencionando el impacto en calificaciones de plataformas como TripAdvisor o encuestas internas de satisfacción."
      },
      {
        "q": "¿Cómo adaptar el currículum para mandos medios o gerencias hoteleras en Quintana Roo?",
        "a": "Enfócate en la gestión integral: control del costo de alimentos y bebidas (Cost of Sales), porcentaje de ocupación, RevPAR, índice de rotación de colaboradores y coordinación de equipos de más de 30 personas."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Cancún | CVAI",
    "seoDescription": "Diseña tu currículum para hotelería, turismo y servicios en Cancún y Riviera Maya. Plantillas ATS profesionales con consejos locales."
  },
  "san-luis-potosi": {
    "slug": "san-luis-potosi",
    "name": "San Luis Potosí",
    "stateCode": "S.L.P.",
    "phoneAreaCode": "444",
    "isActive": true,
    "localEmploymentFocus": "Polo industrial y automotriz estratégico del centro-norte de México (plantas ensambladoras de BMW Group y General Motors), con un clúster robusto de fundición, metalmecánica, electrodomésticos, manufactura de neumáticos y logística ferroviaria (Zona Industrial de San Luis Potosí). Las empresas buscan perfiles con disciplina operativa, estándares IATF y experiencia en automatización.",
    "industries": [
      "Automotriz y Ensamble",
      "Metalmecánica y Fundición",
      "Electrodomésticos",
      "Logística Ferroviaria y Terrestre",
      "Neumáticos y Hule"
    ],
    "hiringSectors": [
      "Ingeniería Mecatrónica y Robótica",
      "Control de Calidad Automotriz (IATF)",
      "Mantenimiento Industrial",
      "Operación de Hornos y Fundición",
      "Logística y Cadena de Suministro"
    ],
    "companies": [
      "BMW Group Planta San Luis Potosí",
      "General Motors SLP",
      "Mabe Leiser",
      "Continental Tire México",
      "Valeo México",
      "Robert Bosch San Luis Potosí"
    ],
    "universities": [
      "Universidad Autónoma de San Luis Potosí (UASLP)",
      "Instituto Tecnológico de San Luis Potosí (ITSLP)",
      "Universidad Politécnica de San Luis Potosí (UPSLP)",
      "Tec de Monterrey (Campus San Luis)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 23000,
        "max": 68000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 22000,
        "max": 58000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 14000,
        "max": 34000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 12000,
        "max": 26000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 15000,
        "max": 40000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 15000,
        "max": 40000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Normativa IATF 16949 y auditorías VDA 6.3",
      "Programación de PLC y robótica industrial (KUKA, Fanuc)",
      "Mantenimiento electromecánico y neumático (TPM)",
      "Balanceo y optimización de líneas de ensamble",
      "Procesos de fundición, troquelado y soldadura",
      "Inglés técnico automotriz / Alemán básico",
      "Logística Just-in-Time (JIT) y control de kanban"
    ],
    "resumeTips": [
      "Detalla tu experiencia directa en armadoras o proveedores Tier 1, indicando las plataformas de vehículos o componentes en los que has participado.",
      "Incluye certificaciones en Core Tools (APQP, PPAP, FMEA, SPC, MSA) y tu dominio de software de diseño mecánico o simulación (SolidWorks, Catia, Siemens NX).",
      "Para puestos de mantenimiento o mecatrónica, especifica las marcas de PLC y robots industriales que sabes programar o diagnosticar.",
      "Cuantifica la reducción de paros de línea (Downtime) o el incremento de piezas producidas por hora en turnos de producción en la Zona Industrial."
    ],
    "coverLetterTips": [
      "Refleja tu comprensión de los ritmos de producción continua y tu compromiso con la política de cero paros y cero defectos.",
      "Menciona tu disposición para trabajar en parques como Villa de Reyes, Logistik o la Zona Industrial de San Luis Potosí.",
      "Resalta tu adaptabilidad para colaborar bajo estándares de ingeniería alemana o estadounidense según la armadora.",
      "Explica cómo tu perfil técnico aporta a la eficiencia energética y optimización de herramentales en planta."
    ],
    "interviewTips": [
      "Prepárate para explicar detalladamente cómo atiendes una alerta de calidad en línea y qué acciones inmediatas tomas para contener el producto sospechoso.",
      "Espera pruebas de interpretación de planos con tolerancias GD&T y preguntas sobre protocolos de seguridad en maquinaria de alta tensión o prensas.",
      "Demuestra solvencia para comunicarte en inglés técnico cuando se requiera contacto con ingenieros de planta matriz.",
      "Muestra actitud analítica, disciplina operativa y respeto por las normas de seguridad e higiene de la planta."
    ],
    "localJobSearchTips": [
      "Consulta convocatorias en bolsas de trabajo del Clúster Automotriz de San Luis Potosí (Clúster Automotriz SLP).",
      "Revisa portales de proveedores satélite en los parques industriales Logistik I y II en Villa de Reyes.",
      "Aprovecha las ferias de vinculación de la UASLP y de la Universidad Politécnica de San Luis Potosí."
    ],
    "faqs": [
      {
        "q": "¿Qué datos buscan las armadoras como BMW y GM en un currículum en San Luis Potosí?",
        "a": "Experiencia comprobable en líneas de ensamble automatizadas, dominio de la norma IATF 16949, manejo de Core Tools, inglés técnico fluido y proyectos documentados de reducción de scrap o paros de producción no programados."
      },
      {
        "q": "¿Cómo estructurar un CV de mantenimiento o mecatrónica para la Zona Industrial?",
        "a": "Agrupa tus habilidades técnicas por áreas: Automatización (PLC Siemens, Allen-Bradley), Robótica (KUKA, Fanuc), Electricidad Industrial y Mecánica. Describe en cada puesto las máquinas atendidas y las mejoras de disponibilidad implementadas."
      },
      {
        "q": "¿Qué valor tiene el idioma alemán en el mercado laboral de SLP?",
        "a": "Contar con alemán (nivel A2 o B1) es un diferenciador muy favorable para empresas alemanas como BMW, Continental o Bosch, ya que facilita la interacción con directivos expatriados y entrenamientos técnicos en Europa."
      },
      {
        "q": "¿Cómo destacar proyectos de reducción de tiempos muertos o scrap en la planta?",
        "a": "Indica el porcentaje de mejora, el ahorro estimado y la herramienta aplicada: 'Reduje el tiempo de cambio de molde de 45 a 28 minutos aplicando metodología SMED en línea de troquelado'."
      },
      {
        "q": "¿Cómo pasar los filtros de selección ATS en empresas automotrices potosinas?",
        "a": "Usa palabras clave exactas de la vacante, evita encabezados no tradicionales y asegúrate de que términos como 'IATF', 'APQP', 'PPAP' y 'TPM' aparezcan en texto claro dentro de tu documento."
      }
    ],
    "seoTitle": "Plantillas de Currículum en San Luis Potosí | CVAI",
    "seoDescription": "Crea tu currículum para la industria automotriz, metalmecánica y manufactura de San Luis Potosí. Plantillas optimizadas para filtros ATS."
  },
  "aguascalientes": {
    "slug": "aguascalientes",
    "name": "Aguascalientes",
    "stateCode": "Ags.",
    "phoneAreaCode": "449",
    "isActive": true,
    "localEmploymentFocus": "Ecosistema de manufactura automotriz consolidado a nivel global (alianza Nissan-Infiniti / Daimler COMPAS), autopartes de alta precisión, metalmecánica, manufactura electrónica y logística del centro del país. La cultura laboral local está fuertemente influenciada por la filosofía japonesa de mejora continua (Kaizen, Monozukuri, 5S) y la disciplina operativa.",
    "industries": [
      "Automotriz y Autopartes",
      "Manufactura de Precisión",
      "Metalmecánica",
      "Electrónica Industrial",
      "Logística y Almacenes"
    ],
    "hiringSectors": [
      "Ingeniería de Calidad Automotriz",
      "Ingeniería de Procesos Kaizen",
      "Mantenimiento Electromecánico",
      "Logística Justo a Tiempo",
      "Supervisión de Producción"
    ],
    "companies": [
      "Nissan Mexicana (Plantas A1 y A2)",
      "COMPAS (Cooperation Manufacturing Plant Aguascalientes)",
      "Marelli México",
      "Jatco México",
      "Sensata Technologies",
      "Yazaki Aguascalientes"
    ],
    "universities": [
      "Universidad Autónoma de Aguascalientes (UAA)",
      "Instituto Tecnológico de Aguascalientes (ITA)",
      "Universidad Politécnica de Aguascalientes (UPA)",
      "Universidad Tecnológica de Aguascalientes (UTA)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 21000,
        "max": 62000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 20000,
        "max": 54000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 13000,
        "max": 30000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 11000,
        "max": 24000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 14000,
        "max": 36000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 14000,
        "max": 36000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Filosofía Monozukuri, Kaizen y metodología 5S",
      "Calidad automotriz (APQP, PPAP, FMEA, MSA, SPC)",
      "Mantenimiento Productivo Total (TPM)",
      "Metrología y maquinado de precisión de autopartes",
      "Control y auditoría de proveedores automotrices",
      "Inglés técnico automotriz / Japonés básico",
      "Sistemas de producción sincronizada (JIT)"
    ],
    "resumeTips": [
      "Resalta tu experiencia práctica en metodologías de mejora continua japonesas (Kaizen, 5S, Poka-Yoke, Gemba Walk, Ishikawa) y círculos de calidad.",
      "Detalla tu dominio de las normas de calidad del sector automotriz (IATF 16949, VDA) y tu experiencia en auditorías de producto y proceso.",
      "Si buscas ingresar a la red de proveedores de Nissan o COMPAS, destaca proyectos de reducción de variabilidad de procesos y mejora de OEE.",
      "Cuantifica la eliminación de desperdicios (Muda) en líneas de manufactura: ahorros de material, reducción de tiempos de ensamble o ergonomía de estaciones de trabajo."
    ],
    "coverLetterTips": [
      "Refleja una actitud de disciplina, respeto por los procedimientos establecidos, lealtad y compromiso con la mejora continua constante.",
      "Menciona tu disposición para trabajar en equipo bajo el enfoque de manufactura esbelta en los parques industriales de la zona metropolitana de Aguascalientes.",
      "Demuestra conocimiento de los modelos de vehículos o componentes clave fabricados en las plantas locales.",
      "Subraya tu capacidad para mantener la estabilidad del proceso y prevenir desviaciones de calidad en línea."
    ],
    "interviewTips": [
      "Prepárate para explicar ejemplos concretos de iniciativas Kaizen que hayas propuesto y ejecutado con éxito en tus empleos anteriores.",
      "Espera preguntas sobre cómo aplicas el método 5S en tu espacio de trabajo y cómo motivas a los operadores a mantenerlo diariamente.",
      "Muestra una actitud ordenada, respetuosa y estructurada en tus respuestas, demostrando pensamiento lógico paso a paso.",
      "Pregunta sobre los programas de capacitación técnica y desarrollo humano que ofrece la empresa."
    ],
    "localJobSearchTips": [
      "Consulta vacantes en parques industriales como PIVA, San Francisco IV, Chichimeco y Parque Industrial del Valle de Aguascalientes.",
      "Revisa la bolsa de trabajo del Clúster Industrial de Aguascalientes y de la Asociación de Empresas Japonesas.",
      "Mantente en contacto con las áreas de vinculación de la UAA y de la Universidad Politécnica de Aguascalientes."
    ],
    "faqs": [
      {
        "q": "¿Cómo reflejar el dominio de metodologías como Kaizen y 5S en el CV para Aguascalientes?",
        "a": "Menciona eventos Kaizen específicos en los que participaste o lideraste, indicando el problema inicial, la contramedida aplicada y el resultado cuantitativo (ej. 'Lideré evento Kaizen reduciendo 15% el tiempo de ensamble de arnés')."
      },
      {
        "q": "¿Qué requisitos técnicos son comunes en la red de proveedores automotrices de Nissan?",
        "a": "Conocimiento sólido de la norma IATF 16949, aplicación práctica de Core Tools (PPAP, APQP, FMEA), interpretación de dibujos técnicos de ingeniería y manejo de auditorías de proceso según estándares de armadora japonesa."
      },
      {
        "q": "¿Cómo redactar la experiencia si quiero ingresar como técnico o ingeniero a COMPAS?",
        "a": "Enfócate en los estándares de calidad de gama prémium (Mercedes-Benz / Infiniti), tu experiencia con equipos de automatización y tu capacidad para mantener tolerancias milimétricas y cero defectos estéticos."
      },
      {
        "q": "¿Qué importancia tiene el inglés frente al conocimiento de normas automotrices en Ags.?",
        "a": "Ambos son complementarios. Las normas técnicas son el requisito indispensable de entrada para puestos de ingeniería, mientras que el inglés técnico define la posibilidad de ascender a coordinaciones y gerencias."
      },
      {
        "q": "¿Cómo presentar la trayectoria si eres egresado de ingeniería en Aguascalientes?",
        "a": "Destaca tus proyectos de estadía o residencias profesionales en plantas automotrices, tu promedio académico si fue sobresaliente, el software de simulación que dominas y cursos extracurriculares en Core Tools o manufactura esbelta."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Aguascalientes | CVAI",
    "seoDescription": "Diseña tu currículum para la industria automotriz y de precisión en Aguascalientes. Formato ATS optimizado con sugerencias locales."
  },
  "mexicali": {
    "slug": "mexicali",
    "name": "Mexicali",
    "stateCode": "B.C.",
    "phoneAreaCode": "686",
    "isActive": true,
    "localEmploymentFocus": "Polo fronterizo líder en manufactura aeroespacial, ensamble de dispositivos médicos, equipos de refrigeración/HVAC, semiconductores y metalmecánica avanzada (Parques Industriales Palaco, El Vigía, Cachanilla). Las maquiladoras privilegian ingenieros técnicos, especialistas en soldadura certificada, diseño eléctrico y perfiles bilingües con enfoque transfronterizo.",
    "industries": [
      "Aeroespacial",
      "Dispositivos Médicos",
      "Electrónica y Semiconductores",
      "Metalmecánica y HVAC",
      "Manufactura de Exportación"
    ],
    "hiringSectors": [
      "Ingeniería Aeroespacial",
      "Soldadura Especializada y Maquinado",
      "Supervisión de Ensamble Médico",
      "Mantenimiento a Equipos HVAC",
      "Comercio Exterior"
    ],
    "companies": [
      "Collins Aerospace Mexicali",
      "Gulfstream Aerospace",
      "Honeywell Aerospace Mexicali",
      "Intuitive Surgical",
      "Kenworth Mexicana",
      "Schneider Electric"
    ],
    "universities": [
      "Universidad Autónoma de Baja California (UABC Mexicali)",
      "CETYS Universidad (Campus Mexicali)",
      "Instituto Tecnológico de Mexicali (ITM)",
      "Universidad Politécnica de Baja California (UPBC)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 26000,
        "max": 74000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 23000,
        "max": 59000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 15000,
        "max": 35000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 13000,
        "max": 27000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 15000,
        "max": 40000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 15000,
        "max": 40000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Normativa aeroespacial AS9100 y FAA",
      "Interpretación de planos de aviación y tolerancias GD&T",
      "Soldadura certificada (TIG, MIG, aeroespacial AWS)",
      "Procesos de ensamble de dispositivos médicos (ISO 13485)",
      "Seguridad e Higiene Industrial en planta",
      "Inglés conversacional y técnico bilingüe (B2/C1)",
      "Metodologías Lean y 5S en maquila"
    ],
    "resumeTips": [
      "Destaca tu experiencia en manufactura de componentes de precisión para la industria aeroespacial o médica, señalando los estándares internacionales de certificación aplicados.",
      "Para posiciones de ensamble o mantenimiento, incluye certificaciones técnicas específicas en soldadura, control numérico computarizado (CNC) o instrumentación electrónica.",
      "Redacta tu currículum con versión en inglés: directivos de ingeniería y corporativos en EE.UU. revisan periódicamente perfiles de la planta Mexicali.",
      "Cuantifica la productividad en planta: 'Supervisé línea de 45 operadores alcanzando 99.2% de cumplimiento del plan de entrega hacia California'."
    ],
    "coverLetterTips": [
      "Demuestra resiliencia y compromiso con la estabilidad operativa de largo plazo en las maquiladoras de Mexicali.",
      "Resalta tu habilidad para colaborar en proyectos binacionales y tu facilidad para interpretar especificaciones técnicas en inglés.",
      "Menciona tu apego estricto a las normas de seguridad ocupacional y cuidado del personal en ambientes industriales de alta exigencia.",
      "Explica cómo tu experiencia técnica resuelve cuellos de botella y apoya la expansión de líneas de ensamble locales."
    ],
    "interviewTips": [
      "Espera preguntas sobre cómo manejas auditorías de calidad de la FAA, clientes de aviación civil o corporativos médicos de EE.UU.",
      "Demuestra dominio de tolerancias geométricas (GD&T) y lectura de diagramas mecánicos o eléctricos.",
      "Prepárate para sostener parte de la conversación técnica en inglés con gerentes de ingeniería.",
      "Muestra actitud orientada al liderazgo colaborativo con personal técnico y operadores de maquiladora."
    ],
    "localJobSearchTips": [
      "Consulta de forma continua las vacantes publicadas en la bolsa de trabajo de INDEX Mexicali.",
      "Revisa portales de empleo de los parques industriales Palaco, El Vigía y Maran.",
      "Acude a las ferias de vinculación de CETYS Universidad y del Instituto Tecnológico de Mexicali."
    ],
    "faqs": [
      {
        "q": "¿Cómo estructurar un currículum para la industria aeroespacial y maquiladora en Mexicali?",
        "a": "Coloca al inicio tus certificaciones técnicas (AS9100, GD&T, IPC), nivel de inglés y stack de software técnico. Luego describe tu experiencia laboral con números de parte, procesos de manufactura atendidos y logros en reducción de scrap o retrabajo."
      },
      {
        "q": "¿Qué certificaciones técnicas de manufactura son más valoradas en Mexicali?",
        "a": "Certificaciones en soldadura especializada bajo normas AWS, certificación en GD&T (ASME), Six Sigma Green Belt, certificaciones en cuartos limpios y normas de aviación civil (FAA/EASA)."
      },
      {
        "q": "¿Es obligatorio el inglés para puestos técnicos y de supervisión en Mexicali?",
        "a": "Para supervisión de producción, calidad e ingeniería es sumamente necesario (B2 conversacional), debido al intercambio diario de información con plantas matrices y proveedores en California y Arizona."
      },
      {
        "q": "¿Cómo describir la experiencia en cumplimiento de normas de calidad internacional en el CV?",
        "a": "Menciona las auditorías aprobadas: 'Partícipe activo en auditoría Nadcap de procesos especiales de tratamiento térmico, logrando certificación sin hallazgos de nivel 1'."
      },
      {
        "q": "¿Qué formato de CV prefieren los departamentos de Recursos Humanos en Mexicali?",
        "a": "Un formato sobrio, funcional y directo de una o dos páginas, optimizado para software ATS con encabezados claros y descripción puntual de funciones y resultados."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Mexicali | CVAI",
    "seoDescription": "Crea tu currículum para la industria aeroespacial, médica y maquiladora en Mexicali. Plantillas compatibles con ATS y adaptadas a la frontera."
  },
  "hermosillo": {
    "slug": "hermosillo",
    "name": "Hermosillo",
    "stateCode": "Son.",
    "phoneAreaCode": "662",
    "isActive": true,
    "localEmploymentFocus": "Centro automotriz emblemático de Sonora (Planta de Estampado y Ensamble de Ford Hermosillo), clúster minero nacional (cobre, oro, metales industriales), agroindustria tecnificada y manufactura aeroespacial en expansión. Se valora la experiencia en líneas automatizadas, seguridad minera (STPS / OSHA) y resistencia en entornos de operación pesada.",
    "industries": [
      "Automotriz y Estampado",
      "Minería y Metalurgia",
      "Agroindustria y Ganadería",
      "Manufactura Aeroespacial",
      "Energías Renovables"
    ],
    "hiringSectors": [
      "Ingeniería de Procesos Automotrices",
      "Seguridad y Medio Ambiente Minero (EHS)",
      "Mantenimiento de Maquinaria Pesada",
      "Control de Calidad de Estampado",
      "Comercio Agropecuario"
    ],
    "companies": [
      "Ford Motor Company (Planta Hermosillo)",
      "Grupo México (División Minería)",
      "Magna Estampados",
      "TE Connectivity",
      "Constellation Brands Obregón/Hermosillo",
      "Bendix México"
    ],
    "universities": [
      "Universidad de Sonora (UNISON)",
      "Instituto Tecnológico de Hermosillo (ITH)",
      "Universidad Estatal de Sonora (UES)",
      "Tec de Monterrey (Campus Sonora Norte)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 24000,
        "max": 70000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 22000,
        "max": 56000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 14000,
        "max": 33000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 12000,
        "max": 26000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 15000,
        "max": 39000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 15000,
        "max": 39000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Procesos de estampado y ensamble automotriz (Ford Q1)",
      "Seguridad, Higiene y Medio Ambiente (EHS / STPS)",
      "Mantenimiento electromecánico de equipo pesado y prensas",
      "Control de procesos mineros y metalurgia",
      "Metodologías Lean Manufacturing y resolución 8D",
      "Interpretación de planos y metrología",
      "Inglés técnico de enlace con armadoras"
    ],
    "resumeTips": [
      "Si buscas ingresar a la planta Ford o su red de proveedores satélite en Hermosillo, resalta experiencia en prensas de estampado, soldadura robotizada o ensamble final bajo normas Ford Q1.",
      "Para el sector minero, resalta certificaciones de seguridad industrial (STPS, primeros auxilios, brigadas de rescate) y experiencia en mantenimiento en mina subterránea o a cielo abierto.",
      "Cuantifica metas de productividad y seguridad: 'Gestioné turno productivo acumulando más de 500 días sin accidentes incapacitantes'.",
      "Incluye conocimientos de software de mantenimiento (SAP PM, Maximo) y manejo de equipo de medición dimensional."
    ],
    "coverLetterTips": [
      "Muestra una actitud de trabajo tenaz, compromiso con las metas de producción diaria y respeto absoluto por los protocolos de seguridad.",
      "Menciona tu disposición para rolar turnos en planta o viajar a unidades mineras según lo demande la operación.",
      "Resalta tu habilidad para adaptarte a ambientes industriales de alta exigencia física y técnica.",
      "Explica cómo tu formación en Sonora respalda tu ética de trabajo y deseo de crecimiento en la industria local."
    ],
    "interviewTips": [
      "Prepárate para responder preguntas rigurosas sobre seguridad industrial: cómo actúas ante un acto o condición insegura en el piso de producción.",
      "Espera evaluaciones sobre diagnóstico de fallas en maquinaria pesada o líneas de troquelado continuo.",
      "En entrevistas para la industria automotriz, demuestra manejo de herramientas de calidad y disposición para trabajar en equipo.",
      "Proyecta seguridad, honestidad profesional y claridad en tus explicaciones operativas."
    ],
    "localJobSearchTips": [
      "Consulta convocatorias a través del Clúster Automotriz de Sonora y del Clúster Minero de Sonora.",
      "Explora ofertas en los parques industriales de Hermosillo como Parque Industrial de Sonora y La Labor.",
      "Revisa la bolsa de trabajo de la Universidad de Sonora (UNISON) y del Instituto Tecnológico de Hermosillo (ITH)."
    ],
    "faqs": [
      {
        "q": "¿Cómo enfocar mi CV para la planta Ford Hermosillo o su cadena de proveedores?",
        "a": "Enfócate en la experiencia de líneas continuas, normas de calidad automotriz (IATF, Ford Q1), proyectos de reducción de defectos en chapa metálica o ensamble de carrocerías y habilidades en Lean Manufacturing."
      },
      {
        "q": "¿Qué requisitos de seguridad y medio ambiente debe tener un CV para el sector minero en Sonora?",
        "a": "Certificaciones vigentes en normativas de la STPS (manejo de sustancias químicas, trabajo en alturas, espacios confinados), conocimientos de legislación ambiental y experiencia en simulacros y comisiones de seguridad."
      },
      {
        "q": "¿Cómo cuantificar resultados en operaciones de manufactura pesada?",
        "a": "Usa métricas de disponibilidad de maquinaria (MTBF, MTTR), porcentaje de cumplimiento del programa de producción y reducción de tiempos de paro no planeados."
      },
      {
        "q": "¿Qué nivel de inglés se solicita en empresas exportadoras de Hermosillo?",
        "a": "Se solicita inglés intermedio a avanzado (B2) para ingenieros de enlace, compras y gerencias que interactúan con plantas en EE.UU. Para áreas operativas, el inglés técnico de lectura de manuales es suficiente."
      },
      {
        "q": "¿Cómo estructurar el CV para recién graduados de ingeniería de la UNISON o ITH?",
        "a": "Coloca proyectos de ingeniería destacados, servicio social y prácticas en empresas de estampado o minería, mencionando el software técnico que dominas (SolidWorks, AutoCAD, Arena)."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Hermosillo | CVAI",
    "seoDescription": "Diseña tu currículum para la industria automotriz, minera y manufacturera en Hermosillo, Sonora. Plantillas compatibles con ATS."
  },
  "morelia": {
    "slug": "morelia",
    "name": "Morelia",
    "stateCode": "Mich.",
    "phoneAreaCode": "443",
    "isActive": true,
    "localEmploymentFocus": "Capital administrativa y universitaria de Michoacán, polo de agroindustria de exportación (aguacate, berries, limón, empaque tecnificado), sector educativo de nivel superior, turismo cultural/patrimonial y servicios corporativos. Se valoran perfiles con visión en inocuidad alimentaria, comercio exterior, gestión administrativa y atención turística.",
    "industries": [
      "Agroindustria y Empaque",
      "Servicios Gubernamentales y Administrativos",
      "Educación Superior",
      "Turismo y Hospitalidad",
      "Comercio Regional"
    ],
    "hiringSectors": [
      "Control de Inocuidad y Calidad Agrícola",
      "Comercio Exterior y Aduanas",
      "Administración y Contabilidad",
      "Ventas Técnicas de Agronegocios",
      "Servicios de Salud"
    ],
    "companies": [
      "Grupo Ortiz",
      "Avocados From Mexico / APEAM",
      "Cinépolis (Corporativo Morelia)",
      "Fábrica de Papel San Rafael",
      "Driscoll's Michoacán",
      "Lala Morelia"
    ],
    "universities": [
      "Universidad Michoacana de San Nicolás de Hidalgo (UMSNH)",
      "Instituto Tecnológico de Morelia (ITM)",
      "Universidad Vasco de Quiroga (UVAQ)",
      "Universidad Latina de América (UNLA)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 20000,
        "max": 58000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 18000,
        "max": 48000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 12000,
        "max": 28000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 10000,
        "max": 23000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 13000,
        "max": 35000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 13000,
        "max": 35000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Inocuidad alimentaria (GlobalGAP, PrimusGFS, SENASICA)",
      "Comercio exterior y logística de perecederos",
      "Administración corporativa y nóminas",
      "Desarrollo de software y transformación digital",
      "Gestión de relaciones comerciales y ventas B2B",
      "Control de cadena de frío agroindustrial",
      "Inglés conversacional intermedio/avanzado"
    ],
    "resumeTips": [
      "Para el sector agroexportador de Michoacán, destaca certificaciones internacionales de inocuidad (GlobalGAP, PrimusGFS, USDA Organic) y trazabilidad de empaque.",
      "Si postulas al corporativo de Cinépolis u oficinas centrales en Morelia, enfócate en habilidades de planeación estratégica, gestión de proyectos y manejo de ERPs corporativos.",
      "En administración y contabilidad, resalta experiencia en nómina, cumplimiento fiscal (SAT) y presentación de estados financieros auditados.",
      "Cuantifica metas alcanzadas: 'Gestioné el despacho de 120 contenedores de exportación semanales cumpliendo normas fitosanitarias de destino'."
    ],
    "coverLetterTips": [
      "Muestra una comunicación formal, respetuosa y estructurada, adecuada para corporativos y dependencias de la capital michoacana.",
      "Destaca tu conocimiento de las fortalezas agroindustriales y comerciales del estado y tu visión para modernizar procesos.",
      "Menciona tu capacidad para liderar equipos multidisciplinarios tanto en oficinas administrativas como en plantas de empaque.",
      "Expresa tu deseo de crecimiento y estabilidad a largo plazo dentro de las organizaciones de Morelia."
    ],
    "interviewTips": [
      "Espera preguntas sobre cómo garantizas el cumplimiento normativo en auditorías de inocuidad o revisiones contables.",
      "En puestos comerciales o corporativos, muestra solvencia para presentar reportes ejecutivos y negociar con clientes de distintas regiones.",
      "Prepárate para explicar tu manejo de herramientas digitales de gestión de inventarios y logística de perecederos.",
      "Proyecta profesionalismo, ética intachable y calidez en el trato interpersonal."
    ],
    "localJobSearchTips": [
      "Revisa bolsas de trabajo de empresas agroexportadoras de la región Morelia-Uruapan y corporativos locales.",
      "Consulta convocatorias de empleo de la Universidad Michoacana (UMSNH) y del Instituto Tecnológico de Morelia.",
      "Utiliza LinkedIn para contactar a líderes de talento humano de corporativos establecidos en Morelia."
    ],
    "faqs": [
      {
        "q": "¿Cómo redactar un currículum para el sector agroindustrial y de exportación en Michoacán?",
        "a": "Detalla certificaciones de inocuidad (GlobalGAP, PrimusGFS), manejo de trazabilidad de fruta, experiencia en frío y empaque, y conocimiento de trámites fitosanitarios de exportación hacia EE.UU., Europa o Asia."
      },
      {
        "q": "¿Qué certificaciones de inocuidad alimentaria tienen mayor impacto en el CV?",
        "a": "GlobalGAP, PrimusGFS, HACCP, SQF y certificaciones emitidas por SENASICA o USDA, las cuales son indispensables para asegurar contratos de exportación agrícola."
      },
      {
        "q": "¿Cómo enfocar el CV para puestos administrativos o educativos en Morelia?",
        "a": "Resalta tu manejo de sistemas contables y ERP, administración de personal, control presupuestal y habilidades de redacción formal y cumplimiento legal."
      },
      {
        "q": "¿Qué competencias buscan las empresas comercializadoras de la región?",
        "a": "Negociación con productores y clientes mayoristas, planeación de rutas de distribución terrestre y manejo de indicadores de rotación de inventarios y cobranza."
      },
      {
        "q": "¿Cómo destacar experiencia en logística de cadena de frío y transporte?",
        "a": "Indica el tipo de unidades refrigeradas coordinadas, monitoreo de termógrafos durante el tránsito y reducción de pérdidas por merma de producto sensible."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Morelia | CVAI",
    "seoDescription": "Crea tu currículum para la agroindustria, corporativos y sector educativo en Morelia, Michoacán. Plantillas ATS profesionales y gratuitas."
  },
  "culiacan": {
    "slug": "culiacan",
    "name": "Culiacán",
    "stateCode": "Sin.",
    "phoneAreaCode": "667",
    "isActive": true,
    "localEmploymentFocus": "Capital agroalimentaria y centro de retail corporativo líder del noroeste mexicano. Destaca en horticultura tecnificada de exportación (tomate, pepino, chiles), agroquímicos, acuacultura, procesamiento de alimentos, cadenas minoristas de cobertura nacional (corporativo Grupo Coppel) y servicios financieros regionales.",
    "industries": [
      "Agroindustria y Horticultura",
      "Comercio y Retail Masivo",
      "Servicios Financieros y Banca",
      "Alimentos Procesados",
      "Distribución y Logística"
    ],
    "hiringSectors": [
      "Ventas Comerciales B2B y Retail",
      "Inocuidad Agrícola y Empaque",
      "Desarrollo de Software y E-commerce",
      "Administración y Finanzas Corporativas",
      "Logística y Cadena de Suministro"
    ],
    "companies": [
      "Grupo Coppel (Corporativo)",
      "SuKarne",
      "Productos Chata",
      "Agroindustrias del Norte",
      "Grupo Premier",
      "Casa Ley"
    ],
    "universities": [
      "Universidad Autónoma de Sinaloa (UAS)",
      "Tec de Monterrey (Campus Sinaloa)",
      "Instituto Tecnológico de Culiacán (ITC)",
      "Universidad de Occidente (UdeO)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 22000,
        "max": 68000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 21000,
        "max": 55000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 14000,
        "max": 32000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 11000,
        "max": 24000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 14000,
        "max": 38000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 14000,
        "max": 38000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Gestión de ventas y operaciones de retail a gran escala",
      "Inocuidad hortícola (SENASICA, FDA, PrimusGFS)",
      "Cadena de suministro agropecuaria y perecederos",
      "Análisis financiero y crédito al consumo",
      "Desarrollo de soluciones de e-commerce y omnicanalidad",
      "Negociación comercial con grandes compradores",
      "Logística y distribución refrigerada nacional"
    ],
    "resumeTips": [
      "Para corporativos de retail y banca en Culiacán (como Coppel), resalta el manejo de proyectos a nivel nacional, gestión de tiendas o plataformas omnicanal y análisis de datos de clientes.",
      "En el rubro hortícola y agrícola, incluye certificaciones fitosanitarias de inocuidad, manejo de invernaderos tecnificados y volumen de bultos o cajas exportadas por temporada.",
      "Cuantifica tus metas comerciales con cifras contundentes: crecimiento en ventas interanuales, colocación de créditos o reducción de cartera vencida.",
      "En puestos de logística y distribución, destaca el control de flotas de transporte terrestre, reducción de mermas y tiempos de entrega en CEDIS."
    ],
    "coverLetterTips": [
      "Proyecta una mentalidad dinámica, tenaz, orientada a metas numéricas y con pasión por el servicio comercial.",
      "Demuestra tu comprensión de los ciclos de cosecha agrícola o las temporadas altas del retail masivo en México.",
      "Menciona tu capacidad para liderar equipos operativos y comerciales con liderazgo motivador y enfocado en resultados.",
      "Alinea tu experiencia con los objetivos de expansión y modernización de los grandes corporativos sinaloenses."
    ],
    "interviewTips": [
      "Prepárate para defender tus cifras: ten presentes tus porcentajes de cumplimiento de metas, ventas totales y ahorros generados.",
      "Espera preguntas sobre cómo manejas situaciones de presión en temporadas altas o cómo resuelves contingencias de logística o crédito.",
      "Muestra seguridad, excelente expresión verbal y facilidad para entablar relaciones de confianza comercial.",
      "Pregunta sobre los retos de digitalización y crecimiento territorial que tiene la empresa en el corto y mediano plazo."
    ],
    "localJobSearchTips": [
      "Revisa convocatorias en los portales oficiales de empleo de corporativos sinaloenses líderes (Coppel, SuKarne, Chata).",
      "Consulta vacantes en la Asociación de Agricultores del Río Culiacán (AARC) y de la Asociación de Productores de Hortalizas (CIDH).",
      "Aprovecha las bolsas de egresados de la Universidad Autónoma de Sinaloa (UAS) y del Tecnológico de Culiacán."
    ],
    "faqs": [
      {
        "q": "¿Qué información priorizar en un CV para corporativos de retail o banca en Culiacán?",
        "a": "Métricas de crecimiento en ventas, experiencia en proyectos de cobertura nacional, manejo de bases de datos o sistemas de punto de venta (POS) y liderazgo de equipos comerciales multidisciplinarios."
      },
      {
        "q": "¿Cómo estructurar la experiencia en agronegocios y exportación de hortalizas?",
        "a": "Detalla los cultivos atendidos, certificaciones de inocuidad implementadas, manejo de cuadrillas de campo o empaque y porcentaje de producto calificado como exportable hacia EE.UU. y Canadá."
      },
      {
        "q": "¿Qué habilidades comerciales son indispensables en el mercado sinaloense?",
        "a": "Negociación asertiva, prospección de clientes de alto valor, seguimiento postventa, administración de cobranza y conocimiento profundo de las cadenas de valor agropecuarias y comerciales."
      },
      {
        "q": "¿Cómo cuantificar logros de ventas y distribución en el currículum?",
        "a": "Incluye comparativas claras: 'Incrementé las ventas de la zona en 24% respecto al año previo, alcanzando una facturación anual de $35M MXN'."
      },
      {
        "q": "¿Qué formato de CV es más adecuado para puestos administrativos y directivos en Sinaloa?",
        "a": "Un diseño ejecutivo, estructurado y directo en una o dos páginas, donde los logros cuantificables y las áreas de responsabilidad destaquen antes de la descripción de tareas rutinarias."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Culiacán | CVAI",
    "seoDescription": "Diseña tu currículum para el sector agroindustrial, retail y corporativo en Culiacán, Sinaloa. Plantillas compatibles con ATS."
  },
  "veracruz": {
    "slug": "veracruz",
    "name": "Veracruz",
    "stateCode": "Ver.",
    "phoneAreaCode": "229",
    "isActive": true,
    "localEmploymentFocus": "Principal puerto marítimo comercial e industrial del Golfo de México, nodo logístico multimodal, capital del comercio exterior, industria petrolera/petroquímica, agroindustria azucarera y sector turístico. Se premia el dominio del despacho aduanero, logística portuaria y de contenedores, normatividad marítima e ingeniería electromecánica industrial.",
    "industries": [
      "Logística Portuaria y Marítima",
      "Comercio Exterior y Agencias Aduanales",
      "Industria Petroquímica y Energía",
      "Metalmecánica y Tubos de Acero",
      "Turismo y Hospitalidad"
    ],
    "hiringSectors": [
      "Despacho Aduanal y Aranceles",
      "Logística Multimodal y Almacén Fiscal",
      "Mantenimiento a Equipos Portuarios e Industriales",
      "Seguridad Industrial y Ambiental (EHS)",
      "Operaciones Marítimas"
    ],
    "companies": [
      "TenarisTamsa",
      "Hutchison Ports ICAVE",
      "Grupo CICE",
      "APM Terminals Veracruz",
      "Constellation Brands Veracruz",
      "Grupo Gilbón"
    ],
    "universities": [
      "Universidad Veracruzana (UV)",
      "Instituto Tecnológico de Veracruz (ITVer)",
      "Universidad Cristóbal Colón (UCC)",
      "Universidad del Valle de México (UVM Veracruz)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 20000,
        "max": 58000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 20000,
        "max": 52000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 13000,
        "max": 30000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 11000,
        "max": 24000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 14000,
        "max": 37000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 14000,
        "max": 36000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Comercio exterior y despacho aduanal (VUCEM / SAT)",
      "Clasificación arancelaria y tratados internacionales (T-MEC)",
      "Logística portuaria y multimodal (marítimo, ferrocarril, carretero)",
      "Seguridad industrial en plataformas y puertos (Rig Pass, STPS)",
      "Operación de recintos fiscalizados estratégicos",
      "Mantenimiento electromecánico de grúas y maquinaria pesada",
      "Inglés marítimo y aduanal fluido (B2/C1)"
    ],
    "resumeTips": [
      "Para agencias aduanales y comercio exterior, especifica tu dominio de VUCEM, elaboración de pedimentos, clasificación arancelaria y cumplimiento de regulaciones arancelarias (RRNA).",
      "En terminales portuarias o empresas industriales como TenarisTamsa, resalta experiencia en mantenimiento de grúas pórtico, líneas de laminación de tubos o manejo de grúas RTG.",
      "Indica certificaciones en seguridad industrial y marítima (código PBIP, Rig Pass, normas STPS) que avalen tu preparación para trabajar en zonas restringidas.",
      "Cuantifica la agilidad logística: 'Reduje el tiempo promedio de despacho de contenedores en aduana de 72 a 36 horas sin observaciones'."
    ],
    "coverLetterTips": [
      "Demuestra tu conocimiento del dinamismo del puerto de Veracruz y el impacto de la puntualidad en la cadena de suministros nacional e internacional.",
      "Menciona tu apego riguroso al marco legal aduanero y prevención de multas o embargos precautorios (PAMA).",
      "Resalta tu habilidad para coordinar maniobras de carga y descarga con transportistas, navieras y autoridades portuarias (ASIPONA).",
      "Expresa tu motivación por integrarte a las empresas que lideran el comercio internacional del país desde el Golfo."
    ],
    "interviewTips": [
      "Prepárate para responder preguntas técnicas sobre clasificación arancelaria, cálculo de impuestos al comercio exterior y manejo de discrepancias en pedimentos.",
      "En puestos portuarios o industriales, demuestra conocimiento en protocolos de seguridad laboral y prevención de accidentes en patio.",
      "Practica presentarte en inglés aduanal/marítimo para demostrar soltura en la comunicación con navieras internacionales.",
      "Proyecta responsabilidad, templanza y capacidad para resolver imprevistos logísticos con rapidez y precisión."
    ],
    "localJobSearchTips": [
      "Consulta bolsas de empleo de la Asociación de Agentes Aduanales del Puerto de Veracruz (AAAVER).",
      "Revisa vacantes activas en terminales portuarias de San Juan de Ulúa y Bahía Sur (ICAVE, CICE, APM).",
      "Aprovecha las convocatorias de la Universidad Veracruzana (UV) y del Instituto Tecnológico de Veracruz (ITVer)."
    ],
    "faqs": [
      {
        "q": "¿Cómo estructurar un CV para agencias aduanales y comercio exterior en Veracruz?",
        "a": "Coloca al inicio tus conocimientos de legislación aduanera, manejo del sistema VUCEM, tipos de regímenes aduaneros que dominas (definitivos, temporales, recintos fiscalizados) e idiomas extranjeros, seguido de tus casos de éxito en desaduanamiento de mercancías."
      },
      {
        "q": "¿Qué certificaciones de seguridad son necesarias para trabajar en el sector portuario o industrial?",
        "a": "Son fundamentales la credencial de acceso a recintos portuarios, capacitación en código PBIP (Protección de Buques e Instalaciones Portuarias), cursos STPS (espacios confinados, trabajos en altura) y certificaciones en manejo de materiales peligrosos (Hazmat)."
      },
      {
        "q": "¿Qué nivel de inglés se requiere para operaciones de logística marítima internacional?",
        "a": "Para puestos de tráfico marítimo, servicio a navieras y comercio exterior se solicita inglés intermedio avanzado (B2), ya que la documentación de embarque (Bill of Lading, manifiestos) y la coordinación con armadores se realiza en inglés."
      },
      {
        "q": "¿Cómo destacar experiencia en despacho aduanero y trámites VUCEM en el CV?",
        "a": "Detalla el volumen de pedimentos coordinados por mes, tipos de mercancías clasificadas (química, maquinaria, perecederos) y ausencia de incidencias o multas en reconocimientos aduaneros."
      },
      {
        "q": "¿Qué buscan los reclutadores del sector de transporte y logística en Veracruz?",
        "a": "Puntualidad en la entrega, capacidad para negociar fletes y maniobras, manejo de plataformas GPS de monitoreo de flotas y conocimiento de las rutas terrestres y ferroviarias que conectan el puerto con el Valle de México y Bajío."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Veracruz | CVAI",
    "seoDescription": "Crea tu currículum para logística portuaria, comercio exterior e industria en el Puerto de Veracruz. Plantillas profesionales para filtros ATS."
  },
  "saltillo": {
    "slug": "saltillo",
    "name": "Saltillo",
    "stateCode": "Coah.",
    "phoneAreaCode": "844",
    "isActive": true,
    "localEmploymentFocus": "El eje automotriz y metalmecánico más productivo del norte de México (complejos de ensamble de Stellantis, General Motors Ramos Arizpe y Freightliner/Daimler Trucks), siderurgia pesada (Deacero) y fundición de clase mundial. El mercado demanda ingenieros de manufactura con dominio pleno de Core Tools automotrices, Six Sigma, inglés bilingüe y experiencia en ensamble de vehículos eléctricos y de combustión.",
    "industries": [
      "Automotriz y Ensamble",
      "Metalmecánica y Fundición",
      "Siderurgia Pesada",
      "Logística Industrial",
      "Construcción y Materiales"
    ],
    "hiringSectors": [
      "Ingeniería de Calidad Automotriz (Core Tools)",
      "Ingeniería de Procesos y Estampado",
      "Mantenimiento Industrial y Automatización",
      "Supervisión de Ensamble y Carrocerías",
      "Cadena de Suministro y Almacenes JIT"
    ],
    "companies": [
      "Stellantis Saltillo (Planta Motores y Camiones)",
      "General Motors Ramos Arizpe",
      "Deacero",
      "Nemak",
      "Magna International",
      "Daimler Truck Planta Saltillo"
    ],
    "universities": [
      "Universidad Autónoma de Coahuila (UAdeC)",
      "Instituto Tecnológico de Saltillo (ITS)",
      "Universidad Politécnica de Ramos Arizpe (UPRA)",
      "Tec de Monterrey (Campus Saltillo)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 24000,
        "max": 70000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 23000,
        "max": 60000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 14000,
        "max": 34000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 12000,
        "max": 26000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 15000,
        "max": 40000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 15000,
        "max": 40000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Core Tools automotrices (PPAP, APQP, FMEA, SPC, MSA)",
      "Normativa IATF 16949 y auditorías de cliente",
      "Manufactura esbelta (Lean Manufacturing / Six Sigma)",
      "Procesos de fundición de aluminio y siderurgia",
      "Mantenimiento electromecánico y robótica (KUKA, ABB)",
      "Inglés técnico automotriz avanzado (B2/C1)",
      "Sistemas de producción Just-in-Time (JIT)"
    ],
    "resumeTips": [
      "Detalla tus competencias en Core Tools automotrices (PPAP nivel 1-5, APQP de nuevos lanzamientos, FMEA de proceso) y certificaciones en IATF 16949.",
      "Para los complejos de Ramos Arizpe y Saltillo enfocados en electromovilidad, resalta experiencia en líneas de baterías eléctricas, motores o transmisiones de alta eficiencia.",
      "Cuantifica reducciones en scrap o desperdicio de fundición, incrementos en OEE y ahorros por proyectos Kaizen o Six Sigma.",
      "Especifica tu dominio de inglés conversacional para juntas de ingeniería directa con corporativos en Detroit o Alemania."
    ],
    "coverLetterTips": [
      "Demuestra tu disciplina operativa y compromiso con los estrictos estándares de entrega Just-in-Time (JIT) hacia armadoras de clase mundial.",
      "Menciona tu disposición para trabajar en los corredores industriales de Saltillo, Ramos Arizpe o Arteaga.",
      "Resalta tu habilidad para liderar células de producción garantizando cero accidentes y cero defectos.",
      "Alinea tu perfil con la reputación de excelencia laboral y orgullo industrial que distingue a la región sureste de Coahuila."
    ],
    "interviewTips": [
      "Prepárate para preguntas técnicas sobre análisis de causa raíz y metodología 8D ante fallas de proveedor en líneas de ensamble continuo.",
      "Espera evaluaciones sobre interpretación de planos con tolerancias GD&T y pruebas estadísticas de capacidad de proceso (Cp y Cpk).",
      "Demuestra soltura para interactuar en inglés técnico explicando proyectos de mejora de manufactura.",
      "Muestra actitud orientada al trabajo en equipo colaborativo y al respeto por los operadores y técnicos de planta."
    ],
    "localJobSearchTips": [
      "Revisa bolsas de empleo activas en parques como Parque Industrial Ramos Arizpe, Santa María y Derramadero.",
      "Consulta convocatorias de la Asociación de Industriales y Empresarios de Ramos Arizpe (AIERA) y Canacintra Saltillo.",
      "Aprovecha las ferias de empleo y bolsas de egresados de la UAdeC y del Instituto Tecnológico de Saltillo (ITS)."
    ],
    "faqs": [
      {
        "q": "¿Qué requisitos son indispensables en un currículum para el clúster automotriz de Saltillo y Ramos Arizpe?",
        "a": "Experiencia en manufactura seriada, dominio de Core Tools automotrices (PPAP, APQP, FMEA), conocimiento de IATF 16949, inglés conversacional y proyectos comprobables de mejora de productividad o calidad."
      },
      {
        "q": "¿Cómo presentar las certificaciones en Core Tools y Six Sigma de manera clara en el CV?",
        "a": "Dedica una sección de certificaciones donde especifiques la institución emisora y nivel obtenido (ej. 'Certificación Six Sigma Green Belt - ITESM'). En tu experiencia laboral, menciona cómo aplicaste esas herramientas en lanzamientos o resolución de problemas."
      },
      {
        "q": "¿Qué importancia tiene el dominio de inglés para ingenieros y supervisores en Saltillo?",
        "a": "Es indispensable para interactuar con directores de planta, clientes automotrices de EE.UU. e ingenieros de diseño en lanzamientos de nuevas plataformas vehiculares."
      },
      {
        "q": "¿Cómo cuantificar reducciones de scrap o mejoras de OEE en la experiencia laboral?",
        "a": "Indica el porcentaje de reducción y el impacto económico o de piezas: 'Reduje el scrap en línea de maquinado de monoblocks de 3.2% a 1.1% en 8 meses, generando un ahorro anual estimado de $120k USD'."
      },
      {
        "q": "¿Qué formato de CV prefieren los reclutadores de armadoras automotrices en Coahuila?",
        "a": "Un currículum cronológico limpio, compatible con sistemas ATS de filtrado automático, sin elementos gráficos invasivos y con términos técnicos automotrices claramente identificables."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Saltillo | CVAI",
    "seoDescription": "Diseña tu currículum para el clúster automotriz de Saltillo y Ramos Arizpe. Formato compatible con ATS para grandes maquilas."
  },
  "torreon": {
    "slug": "torreon",
    "name": "Torreón",
    "stateCode": "Coah.",
    "phoneAreaCode": "871",
    "isActive": true,
    "localEmploymentFocus": "Corazón industrial y agropecuario de la Comarca Lagunera (Coahuila y Durango). Sobresale por albergar el complejo de refinación metalúrgica de metales preciosos e industriales no ferrosos más grande de América Latina (Met-Mex Peñoles), el corporativo nacional de lácteos y alimentos Grupo Lala, manufactura textil de exportación, comercio regional y fundición.",
    "industries": [
      "Metalurgia y Minería",
      "Lácteos y Agroindustria",
      "Comercio Regional",
      "Manufactura Textil y Confección",
      "Fundición y Maquinaria"
    ],
    "hiringSectors": [
      "Ingeniería Metalúrgica y Química",
      "Control de Inocuidad Láctea y Alimentos",
      "Mantenimiento Electromecánico Pesado",
      "Ventas Industriales y Distribución",
      "Seguridad, Higiene y Medio Ambiente (EHS)"
    ],
    "companies": [
      "Peñoles (Met-Mex Peñoles)",
      "Grupo Lala (Corporativo)",
      "Pilgrim's México",
      "Soriana Torreón",
      "Lala Planta Pasteurizadora",
      "Caterpillar Torreón"
    ],
    "universities": [
      "Universidad Autónoma de Coahuila (UAdeC Unidad Torreón)",
      "Universidad Autónoma de la Laguna (UAL)",
      "Tec de Monterrey (Campus Laguna)",
      "Instituto Tecnológico de La Laguna (ITL)"
    ],
    "salaryInfo": {
      "Ingeniero de Software": {
        "min": 21000,
        "max": 62000,
        "currency": "MXN"
      },
      "Gerente de Proyectos": {
        "min": 20000,
        "max": 52000,
        "currency": "MXN"
      },
      "Contador": {
        "min": 13000,
        "max": 30000,
        "currency": "MXN"
      },
      "Enfermera": {
        "min": 11000,
        "max": 24000,
        "currency": "MXN"
      },
      "Abogado": {
        "min": 14000,
        "max": 37000,
        "currency": "MXN"
      },
      "Arquitecto": {
        "min": 14000,
        "max": 37000,
        "currency": "MXN"
      }
    },
    "localSkills": [
      "Inocuidad alimentaria (HACCP, FSSC 22000, pasteurización)",
      "Seguridad, Higiene y Medio Ambiente (EHS / STPS)",
      "Procesos pirometalúrgicos y refinación química",
      "Mantenimiento de equipo electromecánico y hornos",
      "Ventas comerciales e industriales B2B",
      "Administración y finanzas corporativas",
      "Logística de distribución refrigerada de alimentos"
    ],
    "resumeTips": [
      "Si buscas vacantes en corporativos agroalimentarios como Grupo Lala o Pilgrim's, destaca certificaciones en inocuidad alimentaria (HACCP, FSSC 22000) y control de procesos en pasteurización o envasado aséptico.",
      "Para la industria metalúrgica y minera de Peñoles, resalta conocimientos en seguridad industrial y ambiental (EHS), control de emisiones, pirometalurgia o hidrometalurgia.",
      "En perfiles corporativos y administrativos, destaca experiencia en gestión de marcas nacionales, planeación financiera y manejo de ERPs como SAP.",
      "Cuantifica resultados de ahorro energético, optimización en líneas de envasado o disminución de incidentes laborales en planta."
    ],
    "coverLetterTips": [
      "Muestra orgullo y conocimiento de la tradición de trabajo arduo y espíritu emprendedor que caracteriza a los profesionistas de La Laguna.",
      "Demuestra tu apego estricto a las normas de seguridad ocupacional, cuidado ambiental y sustentabilidad hídrica e industrial.",
      "Resalta tu habilidad para liderar equipos en plantas continuas de fundición o alimentos con liderazgo cercano y empático.",
      "Alinea tu perfil con la visión de crecimiento y competitividad de los grandes corporativos nacidos en Torreón."
    ],
    "interviewTips": [
      "Prepárate para preguntas sobre cómo garantizas la inocuidad alimentaria o cómo previenes incidentes en entornos de fundición a alta temperatura.",
      "Espera evaluaciones sobre resolución de problemas operativos bajo presión de tiempo en líneas de producción continua 24/7.",
      "Muestra solvencia para hablar con datos numéricos de eficiencia de planta, costos de mantenimiento y cumplimiento de normas ambientales.",
      "Proyecta integridad profesional, lealtad y compromiso con la estabilidad laboral en la Comarca Lagunera."
    ],
    "localJobSearchTips": [
      "Consulta bolsas de empleo corporativas de Grupo Lala y Peñoles en Torreón y Gómez Palacio.",
      "Revisa convocatorias a través de Canacintra Torreón y Canacintra Gómez Palacio.",
      "Aprovecha las ferias de empleo de la Universidad Autónoma de Coahuila y del Instituto Tecnológico de La Laguna (ITL)."
    ],
    "faqs": [
      {
        "q": "¿Cómo enfocar el CV para corporativos de alimentos como Grupo Lala en Torreón?",
        "a": "Enfócate en experiencia en inocuidad alimentaria (HACCP, FSSC 22000), optimización de líneas de envasado aséptico, gestión de cadena de frío y proyectos de mejora continua en plantas de alimentos y bebidas."
      },
      {
        "q": "¿Qué certificaciones en EHS y minería tienen mayor impacto en empresas como Peñoles?",
        "a": "Certificaciones en normativas ambientales y de seguridad de la STPS, cursos de respuesta a emergencias químicas, diplomados en sistemas de gestión ISO 14001 e ISO 45001, y manejo de residuos peligrosos."
      },
      {
        "q": "¿Cómo redactar la experiencia técnica en plantas de refinación o alimentos en La Laguna?",
        "a": "Describe las capacidades de planta operadas (toneladas de metal refinado o litros de leche procesados al día), los sistemas de control automatizado utilizados (SCADA, DCS) y los logros en reducción de mermas y paros no programados."
      },
      {
        "q": "¿Qué habilidades blandas son clave para puestos de supervisión en plantas laguneras?",
        "a": "Liderazgo firme y cercano con personal sindicalizado y operativo, comunicación asertiva en piso de planta, toma de decisiones bajo presión y enfoque riguroso en seguridad y cero accidentes."
      },
      {
        "q": "¿Cómo adaptar el currículum para egresados de ingeniería de la UAdeC o Tec de Monterrey Laguna?",
        "a": "Destaca tus residencias profesionales en plantas de Torreón o Gómez Palacio, tu promedio académico, software técnico dominado (AutoCAD, SolidWorks, Matlab) y cursos en manufactura esbelta o seguridad industrial."
      }
    ],
    "seoTitle": "Plantillas de Currículum en Torreón | CVAI",
    "seoDescription": "Crea tu currículum para el sector lácteo, agroindustrial y minero en la Comarca Lagunera desde Torreón. Descarga tu CV gratis."
  }
};

export function getStaticCities(): City[] {
  return Object.values(STATIC_CITIES);
}

export function getStaticCityBySlug(slug: string): City | undefined {
  return STATIC_CITIES[slug];
}
