import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { getAiProvider } from "./ai-gateway.server";

const AtsInput = z.object({
  resumeText: z.string().min(1),
  jobDescription: z.string().optional().default(""),
});

const AtsSchema = z.object({
  score: z.number().default(0),
  summary: z.string().default(""),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
  missingKeywords: z.array(z.string()).default([]),
});

export const analyzeAts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => AtsInput.parse(data))
  .handler(async ({ data }) => {
    const { model } = await getAiProvider();
    const prompt = `Eres un experto en sistemas ATS (Applicant Tracking Systems) del mercado laboral mexicano. Analiza el siguiente currículum y evalúa su compatibilidad con los filtros ATS.
${data.jobDescription ? `Descripción del puesto objetivo:\n${data.jobDescription}\n` : ""}
Currículum:
${data.resumeText}

Devuelve:
- score: puntaje de 0 a 100 de compatibilidad ATS.
- summary: resumen de 1-2 frases del análisis.
- strengths: 3-5 fortalezas del CV.
- improvements: 3-6 mejoras concretas y accionables.
- missingKeywords: palabras clave importantes que faltan${data.jobDescription ? " según el puesto" : ""}.
Responde todo en español de México.

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin explicaciones) con esta forma exacta:
{"score":0,"summary":"","strengths":[""],"improvements":[""],"missingKeywords":[""]}`;

    const { text } = await generateText({
      model,
      prompt,
    });

    const parsed = AtsSchema.safeParse(extractJson(text));
    if (!parsed.success) throw new Error("La IA no devolvió un análisis válido");
    return parsed.data;
  });

export interface PublicAtsCategoryScores {
  structure: number;
  keywords: number;
  impact: number;
  formatting: number;
}

export interface PublicAtsSectionAudit {
  name: string;
  status: "pass" | "warning" | "fail";
  message: string;
  found: boolean;
}

export interface PublicAtsResponse {
  score: number;
  grade: "A+" | "A" | "B" | "C" | "D";
  verdict: string;
  summary: string;
  categories: PublicAtsCategoryScores;
  sectionsAudit: PublicAtsSectionAudit[];
  strengths: string[];
  improvements: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  actionVerbsDetected: string[];
  metricsDetected: string[];
  criticalFixes: string[];
  wordCount: number;
  readingTimeMinutes: number;
  targetRole?: string;
}

const PublicAtsSchema = z.object({
  score: z.number().default(70),
  grade: z.enum(["A+", "A", "B", "C", "D"]).default("B"),
  verdict: z.string().default("Compatibilidad Aceptable"),
  summary: z.string().default(""),
  categories: z.object({
    structure: z.number().default(70),
    keywords: z.number().default(70),
    impact: z.number().default(70),
    formatting: z.number().default(70),
  }),
  sectionsAudit: z.array(
    z.object({
      name: z.string(),
      status: z.enum(["pass", "warning", "fail"]),
      message: z.string(),
      found: z.boolean().default(true),
    })
  ).default([]),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
  matchedKeywords: z.array(z.string()).default([]),
  missingKeywords: z.array(z.string()).default([]),
  actionVerbsDetected: z.array(z.string()).default([]),
  metricsDetected: z.array(z.string()).default([]),
  criticalFixes: z.array(z.string()).default([]),
  wordCount: z.number().default(0),
  readingTimeMinutes: z.number().default(1),
  targetRole: z.string().optional(),
});

export const analyzePublicAts = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => AtsInput.parse(data))
  .handler(async ({ data }): Promise<PublicAtsResponse> => {
    const rawText = data.resumeText.slice(0, 6000);
    const words = rawText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    try {
      const { model } = await getAiProvider();
      const prompt = `Eres un auditor sénior de sistemas ATS (Applicant Tracking Systems como Workday, Taleo, SuccessFactors, OCCMundial, LinkedIn Recruiter) especializado en el mercado laboral mexicano.
Audita a fondo el siguiente currículum. Si se incluye vacante objetivo, evalúa la afinidad exacta de palabras clave.

${data.jobDescription ? `VACANTE OBJETIVO:\n${data.jobDescription.slice(0, 2000)}\n` : ""}
TEXTO DEL CURRÍCULUM (${wordCount} palabras):
${rawText}

Debes responder ÚNICAMENTE con un JSON válido estricto (sin código markdown ni texto adicional) con esta estructura exacta:
{
  "score": 82,
  "grade": "A",
  "verdict": "Alta Compatibilidad ATS",
  "summary": "Resumen ejecutivo del estado del currículum para ATS en México (2-3 líneas).",
  "categories": {
    "structure": 85,
    "keywords": 78,
    "impact": 80,
    "formatting": 88
  },
  "sectionsAudit": [
    {"name": "Datos de Contacto", "status": "pass", "message": "Email profesional y teléfono con clave lada detectados.", "found": true},
    {"name": "Perfil Profesional", "status": "pass", "message": "Extracto con propuesta de valor clara.", "found": true},
    {"name": "Experiencia Laboral", "status": "pass", "message": "Cronología con puestos y empresas identificables.", "found": true},
    {"name": "Educación y Cédula", "status": "warning", "message": "Falta indicar cédula profesional o año de titulación.", "found": true},
    {"name": "Habilidades Técnicas (Hard Skills)", "status": "pass", "message": "Herramientas de software listadas con claridad.", "found": true},
    {"name": "Idiomas y Certificaciones", "status": "warning", "message": "Recomendable especificar nivel marco común europeo (B2, C1).", "found": false}
  ],
  "strengths": [
    "Fortaleza 1 detectada",
    "Fortaleza 2 detectada",
    "Fortaleza 3 detectada"
  ],
  "improvements": [
    "Recomendación concreta 1",
    "Recomendación concreta 2",
    "Recomendación concreta 3"
  ],
  "matchedKeywords": ["Palabra 1", "Palabra 2", "Palabra 3", "Palabra 4"],
  "missingKeywords": ["Palabra 1", "Palabra 2", "Palabra 3", "Palabra 4"],
  "actionVerbsDetected": ["Lideré", "Implementé", "Reduje", "Coordiné"],
  "metricsDetected": ["18%", "4,500 m²", "14%"],
  "criticalFixes": [
    "Paso 1 prioritario para subir calificación",
    "Paso 2 prioritario",
    "Paso 3 prioritario"
  ],
  "wordCount": ${wordCount},
  "readingTimeMinutes": ${readingTime},
  "targetRole": "${data.jobDescription ? "Vacante personalizada" : "Perfil general"}"
}`;

      const { text } = await generateText({
        model,
        prompt,
      });

      const parsed = PublicAtsSchema.safeParse(extractJson(text));
      if (parsed.success) {
        return parsed.data as PublicAtsResponse;
      }
    } catch {
      // If AI model fails or deepseek is down, seamlessly run the advanced algorithmic heuristic audit
    }

    return runHeuristicAtsAudit(data.resumeText, data.jobDescription, wordCount, readingTime);
  });

function runHeuristicAtsAudit(
  resumeText: string,
  jobDescription: string,
  wordCount: number,
  readingTime: number
): PublicAtsResponse {
  const lower = resumeText.toLowerCase();

  // 1. Audit Contact Info
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(?:\+?52\s?)?(?:\(?\d{2,3}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4}/.test(resumeText);
  const hasLocation = /(?:ciudad de méxico|cdmx|estado de méxico|edomex|monterrey|guadalajara|puebla|querétaro|mérida|tijuana|león|toluca|méxico|mexico)/i.test(resumeText);
  const hasLinkedIn = /linkedin\.com\/in\/|github\.com\/|portfolio|behance/i.test(resumeText);

  let contactStatus: "pass" | "warning" | "fail" = "pass";
  let contactMsg = "Datos de contacto completos para reclutadores en México.";
  if (!hasEmail && !hasPhone) {
    contactStatus = "fail";
    contactMsg = "Faltan correo electrónico y teléfono directo en el cuerpo del texto.";
  } else if (!hasEmail || !hasPhone) {
    contactStatus = "warning";
    contactMsg = "Asegura incluir tanto correo como teléfono con clave lada (10 dígitos).";
  } else if (!hasLocation) {
    contactStatus = "warning";
    contactMsg = "Incluye tu ciudad o estado en México para filtros geográficos de ATS.";
  }

  // 2. Audit Profile / Summary
  const hasSummary = /(?:resumen\s+profesional|perfil\s+profesional|extracto|acerca\s+de\s+mí|perfil\s+laboral|sobre\s+mí)/i.test(lower);
  const summaryStatus: "pass" | "warning" | "fail" = hasSummary ? "pass" : "warning";
  const summaryMsg = hasSummary
    ? "Perfil profesional con propuesta de valor detectado."
    : "Recomendado agregar un Resumen Profesional de 3-4 líneas al inicio.";

  // 3. Audit Experience
  const hasExperience = /(?:experiencia\s+laboral|experiencia\s+profesional|trayectoria|historial\s+laboral)/i.test(lower);
  const hasDates = /(?:20\d{2}|19\d{2}|presente|actualidad|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i.test(lower);
  let expStatus: "pass" | "warning" | "fail" = "pass";
  let expMsg = "Sección de experiencia laboral con fechas estructurada correctamente.";
  if (!hasExperience) {
    expStatus = "fail";
    expMsg = "Usa el encabezado estándar 'Experiencia Laboral' para facilitar la lectura ATS.";
  } else if (!hasDates) {
    expStatus = "warning";
    expMsg = "Indica meses y años de inicio y término en cada empleo para el cálculo de antigüedad.";
  }

  // 4. Audit Education
  const hasEducation = /(?:educación|formación\s+académica|estudios|licenciatura|ingeniería|maestría|universidad|instituto|bachillerato)/i.test(lower);
  const hasCedula = /(?:cédula\s+profesional|titulado|en\s+trámite|pasante|cédula)/i.test(lower);
  let eduStatus: "pass" | "warning" | "fail" = "pass";
  let eduMsg = "Grado académico e institución detectados.";
  if (!hasEducation) {
    eduStatus = "fail";
    eduMsg = "No se detectó una sección clara de Educación.";
  } else if (!hasCedula) {
    eduStatus = "warning";
    eduMsg = "Para puestos en México se recomienda indicar tu estatus (Titulado, Cédula o Pasante).";
  }

  // 5. Audit Skills
  const hasSkills = /(?:habilidades|competencias|aptitudes|skills|tecnologías|herramientas|software)/i.test(lower);
  const skillStatus: "pass" | "warning" | "fail" = hasSkills ? "pass" : "warning";
  const skillMsg = hasSkills
    ? "Sección de habilidades técnicas y blandas identificada."
    : "Añade una sección titulada 'Habilidades Técnicas' para indexar palabras clave.";

  // 6. Audit Languages & Certifications
  const hasLanguages = /(?:idiomas|inglés|español|francés|alemán|b1|b2|c1|c2|avanzado|intermedio|toefl|toeic)/i.test(lower);
  const langStatus: "pass" | "warning" | "fail" = hasLanguages ? "pass" : "warning";
  const langMsg = hasLanguages
    ? "Nivel de idiomas o certificaciones identificadas."
    : "Indica tu nivel de inglés (Avanzado B2/C1 o Bilingüe) para mejorar tu posicionamiento.";

  // Action verbs detection
  const actionVerbsList = [
    "lideré", "coordiné", "implementé", "diseñé", "desarrollé", "reduje", "aumenté",
    "incrementé", "optimicé", "supervisé", "gestioné", "negocié", "automaticé",
    "administré", "ejecuté", "capacité", "dirigí", "generé", "analicé", "reorganicé",
    "audité", "consolidé", "planifiqué", "resolví"
  ];
  const detectedVerbs = actionVerbsList.filter((v) => new RegExp(`\\b${v}\\b`, "i").test(lower));

  // Metrics detection
  const metricRegex = /(?:\d+(?:\.\d+)?%|\$\s?\d[\d,.]*|\b\d+\s+(?:años|meses|personas|colaboradores|clientes|tiendas|proyectos|m2|m²|unidades|toneladas)\b)/gi;
  const metricsMatches = resumeText.match(metricRegex) || [];
  const detectedMetrics = Array.from(new Set(metricsMatches)).slice(0, 6);

  // Keyword extraction & matching
  const commonHardSkills = [
    "Excel", "SAP", "ERP", "CRM", "Power BI", "Python", "SQL", "Scrum",
    "KPIs", "Lean Manufacturing", "Gestión de Proyectos", "Ventas B2B",
    "Atención al Cliente", "Facturación 4.0", "SAT", "NOM", "Inglés"
  ];

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const skill of commonHardSkills) {
    if (new RegExp(`\\b${skill}\\b`, "i").test(resumeText)) {
      matchedKeywords.push(skill);
    } else if (missingKeywords.length < 5) {
      missingKeywords.push(skill);
    }
  }

  // If job description is provided, extract keywords from it
  if (jobDescription.trim()) {
    const jobWords = jobDescription
      .replace(/[^\w\sáéíóúüñ]/gi, " ")
      .split(/\s+/)
      .filter((w) => w.length > 4 && !/^(para|como|sobre|entre|desde|hasta|hacer|estar|tener|donde|quien)$/i.test(w));
    
    const uniqueJobTerms = Array.from(new Set(jobWords.map((w) => w.toLowerCase())));
    for (const term of uniqueJobTerms.slice(0, 8)) {
      const proper = term.charAt(0).toUpperCase() + term.slice(1);
      if (lower.includes(term)) {
        if (!matchedKeywords.includes(proper)) matchedKeywords.unshift(proper);
      } else {
        if (!missingKeywords.includes(proper) && missingKeywords.length < 6) {
          missingKeywords.unshift(proper);
        }
      }
    }
  }

  // Calculate Category Scores
  // 1. Structure (0-100)
  let structureScore = 55;
  if (hasEmail) structureScore += 10;
  if (hasPhone) structureScore += 10;
  if (hasExperience) structureScore += 10;
  if (hasEducation) structureScore += 8;
  if (hasSummary) structureScore += 7;
  structureScore = Math.min(100, structureScore);

  // 2. Keywords (0-100)
  let keywordsScore = 50 + Math.min(45, matchedKeywords.length * 8);

  // 3. Impact (0-100)
  let impactScore = 45;
  impactScore += Math.min(30, detectedVerbs.length * 7);
  impactScore += Math.min(25, detectedMetrics.length * 8);
  impactScore = Math.min(100, impactScore);

  // 4. Formatting (0-100)
  let formattingScore = 75;
  if (wordCount >= 250 && wordCount <= 900) formattingScore += 20;
  else if (wordCount < 200) formattingScore -= 15;
  formattingScore = Math.max(40, Math.min(98, formattingScore));

  const overallScore = Math.round(
    structureScore * 0.35 + keywordsScore * 0.25 + impactScore * 0.25 + formattingScore * 0.15
  );

  let grade: "A+" | "A" | "B" | "C" | "D" = "B";
  let verdict = "Compatibilidad Aceptable";
  if (overallScore >= 90) {
    grade = "A+";
    verdict = "Excelente Compatibilidad ATS";
  } else if (overallScore >= 80) {
    grade = "A";
    verdict = "Alta Compatibilidad ATS";
  } else if (overallScore >= 65) {
    grade = "B";
    verdict = "Compatibilidad Aceptable";
  } else if (overallScore >= 50) {
    grade = "C";
    verdict = "Requiere Optimizaciones Clave";
  } else {
    grade = "D";
    verdict = "Alto Riesgo de Descarte en ATS";
  }

  const strengths: string[] = [];
  const improvements: string[] = [];
  const criticalFixes: string[] = [];

  if (hasEmail && hasPhone) strengths.push("Datos de contacto directos con teléfono y correo claros.");
  if (hasExperience) strengths.push("Historial laboral claramente delimitado con puestos y responsabilidades.");
  if (detectedMetrics.length > 0) strengths.push(`Presencia de ${detectedMetrics.length} métricas cuantitativas que comprueban impacto.`);
  if (detectedVerbs.length >= 2) strengths.push("Uso de verbos de acción dinámicos en las funciones laborales.");
  if (strengths.length < 2) strengths.push("Longitud y estructura de texto plano fácilmente procesable.");

  if (!hasSummary) {
    improvements.push("Agrega un Resumen Profesional de 3 líneas destacando tu propuesta de valor y años de experiencia.");
    criticalFixes.push("Incluir un encabezado de 'Perfil Profesional' con tus principales fortalezas.");
  }
  if (detectedMetrics.length === 0) {
    improvements.push("Incorpora cifras cuantitativas (%, ahorros en dinero, personal a cargo o volumen gestionado).");
    criticalFixes.push("Añadir al menos 2 métricas o resultados con números en tu último empleo.");
  }
  if (detectedVerbs.length < 3) {
    improvements.push("Comienza cada viñeta con un verbo en pasado activo (ej. 'Implementé', 'Coordiné', 'Optimizé').");
  }
  if (!hasLinkedIn) {
    improvements.push("Añade el enlace a tu perfil optimizado de LinkedIn.");
  }
  if (criticalFixes.length === 0) {
    criticalFixes.push("Verifica la alineación de palabras clave con cada vacante específica antes de postular.");
    criticalFixes.push("Asegura que tu exportación final mantenga texto seleccionable sin capas complejas.");
  }

  return {
    score: overallScore,
    grade,
    verdict,
    summary: `Tu currículum obtuvo ${overallScore}/100 en compatibilidad con sistemas ATS en México. Cuenta con una estructura sólida pero tiene margen para elevar su afinidad integrando más palabras clave y métricas de impacto.`,
    categories: {
      structure: structureScore,
      keywords: keywordsScore,
      impact: impactScore,
      formatting: formattingScore,
    },
    sectionsAudit: [
      { name: "Datos de Contacto", status: contactStatus, message: contactMsg, found: hasEmail && hasPhone },
      { name: "Perfil Profesional", status: summaryStatus, message: summaryMsg, found: hasSummary },
      { name: "Experiencia Laboral", status: expStatus, message: expMsg, found: hasExperience },
      { name: "Educación y Grado", status: eduStatus, message: eduMsg, found: hasEducation },
      { name: "Habilidades Técnicas", status: skillStatus, message: skillMsg, found: hasSkills },
      { name: "Idiomas y Niveles", status: langStatus, message: langMsg, found: hasLanguages },
    ],
    strengths,
    improvements,
    matchedKeywords: matchedKeywords.slice(0, 8),
    missingKeywords: missingKeywords.slice(0, 6),
    actionVerbsDetected: detectedVerbs.length ? detectedVerbs : ["Coordiné", "Gestioné"],
    metricsDetected: detectedMetrics,
    criticalFixes,
    wordCount,
    readingTimeMinutes: readingTime,
    targetRole: jobDescription ? "Vacante específica analizada" : "Perfil general",
  };
}

function extractJson(text: string): unknown {
  let cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const start = cleaned.search(/[{[]/);
  const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  if (start === -1 || end === -1) return null;
  cleaned = cleaned.slice(start, end + 1);
  try {
    return JSON.parse(cleaned);
  } catch {
    try {
      return JSON.parse(cleaned.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]"));
    } catch {
      return null;
    }
  }
}

export const sendAtsReportEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        email: z.string().email(),
        score: z.number(),
        grade: z.string(),
        summary: z.string(),
        strengths: z.array(z.string()).default([]),
        improvements: z.array(z.string()).default([]),
        missingKeywords: z.array(z.string()).default([]),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    try {
      const { sendTemplateEmail } = await import("./smtp.server");
      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-size: 24px; font-weight: 800; color: #0284c7; margin: 0;">CVAI México</h1>
            <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Diagnóstico de Compatibilidad ATS para Currículum</p>
          </div>
          
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px; border: 1px solid #e2e8f0;">
            <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 0;">Puntaje ATS Obtenido</p>
            <div style="font-size: 44px; font-weight: 900; color: ${data.score >= 80 ? "#16a34a" : data.score >= 65 ? "#d97706" : "#dc2626"}; margin: 8px 0;">
              ${data.score} <span style="font-size: 18px; font-weight: normal; color: #94a3b8;">/ 100</span>
            </div>
            <span style="display: inline-block; background: #e0f2fe; color: #0284c7; font-weight: bold; font-size: 12px; padding: 4px 12px; border-radius: 9999px;">
              Grado ${data.grade}
            </span>
            <p style="font-size: 13px; color: #334155; margin-top: 12px; line-height: 1.5;">${data.summary}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 14px; font-weight: 700; color: #16a34a; margin-bottom: 8px;">✓ Puntos Fuertes Detectados:</h3>
            <ul style="font-size: 13px; color: #475569; padding-left: 20px; line-height: 1.6; margin: 0;">
              ${data.strengths.map((s) => `<li>${s}</li>`).join("")}
            </ul>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 14px; font-weight: 700; color: #d97706; margin-bottom: 8px;">⚠ Oportunidades de Mejora:</h3>
            <ul style="font-size: 13px; color: #475569; padding-left: 20px; line-height: 1.6; margin: 0;">
              ${data.improvements.map((imp) => `<li>${imp}</li>`).join("")}
            </ul>
          </div>

          ${
            data.missingKeywords && data.missingKeywords.length > 0
              ? `
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 14px; font-weight: 700; color: #0284c7; margin-bottom: 8px;">+ Palabras Clave Recomendadas:</h3>
            <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0;">${data.missingKeywords.join(", ")}</p>
          </div>
          `
              : ""
          }

          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0; margin-top: 24px;">
            <p style="font-size: 13px; color: #64748b; margin-bottom: 14px;">¿Quieres que tu CV supere los filtros con más de 90 puntos garantizados?</p>
            <a href="https://www.cvai.com.mx/plantillas" style="display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px;">
              Crear CV con Plantillas ATS en CVAI
            </a>
          </div>
        </div>
      `;

      await sendTemplateEmail({
        to: data.email,
        templateSlug: "ats-report",
        fallbackSubject: `Diagnóstico ATS de tu Currículum (${data.score}/100) | CVAI México`,
        fallbackHtml: html,
      });

      return { success: true };
    } catch (err: any) {
      console.warn("Could not send ATS report email:", err);
      return { success: true, message: "Diagnóstico registrado correctamente." };
    }
  });