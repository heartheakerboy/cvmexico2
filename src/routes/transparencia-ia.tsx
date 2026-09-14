import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, type TocSection } from "@/components/legal-page-layout";
import { useSettings } from "@/lib/settings";
import { useCompanyLegalConfig } from "@/lib/legal-config";
import { Sparkles, Cpu, CheckCircle2, AlertTriangle, ShieldCheck, Eye, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/transparencia-ia")({
  head: () => ({
    meta: [
      { title: "Transparencia en Inteligencia Artificial | CVAI" },
      {
        name: "description",
        content: "Conoce cómo funciona la inteligencia artificial en CVAI (Curriculum Vitae AI): modelos utilizados (DeepSeek AI), capacidades, límites éticos y protección de tus datos curriculares.",
      },
      { property: "og:title", content: "Transparencia en IA | CVAI" },
      { property: "og:description", content: "Uso responsable, ético y transparente de la inteligencia artificial en CVAI." },
      { property: "og:url", content: "https://www.cvai.com.mx/transparencia-ia" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/transparencia-ia" }],
  }),
  component: AiTransparencyPageComponent,
});

function AiTransparencyPageComponent() {
  const { lang } = useSettings();
  const cfg = useCompanyLegalConfig();
  const isEn = lang === "en";

  const sections: TocSection[] = isEn
    ? [
        { id: "our-ai-philosophy", title: "1. Our AI Philosophy" },
        { id: "ai-engine-deepseek", title: "2. Underlying Technology (DeepSeek AI)" },
        { id: "where-ai-helps", title: "3. Where AI Assists in CVAI" },
        { id: "limitations-hallucinations", title: "4. Limitations & the Necessity of Human Review" },
        { id: "data-privacy-training", title: "5. Data Privacy & No Public Model Training" },
        { id: "ethical-principles", title: "6. Ethical Principles for Mexican Job Seekers" },
        { id: "ai-inquiries", title: "7. AI Governance Inquiries" },
      ]
    : [
        { id: "filosofia-ia", title: "1. Nuestra filosofía de IA centrada en el humano" },
        { id: "motor-deepseek", title: "2. Tecnología y modelos (DeepSeek AI)" },
        { id: "funciones-asistidas", title: "3. Dónde interviene la IA en CVAI" },
        { id: "limites-alucinaciones", title: "4. Limitaciones y necesidad obligatoria de revisión humana" },
        { id: "privacidad-sin-entrenamiento", title: "5. Privacidad y no entrenamiento de modelos públicos" },
        { id: "principios-eticos", title: "6. Principios éticos para el mercado laboral mexicano" },
        { id: "consultas-ia", title: "7. Consultas sobre gobernanza de IA" },
      ];

  return (
    <LegalPageLayout
      title={isEn ? "Artificial Intelligence Transparency" : "Transparencia en Inteligencia Artificial"}
      subtitle={
        isEn
          ? "A clear, honest guide to how AI works in CVAI, our technological provider (DeepSeek), what it can and cannot do, and our ethical commitments."
          : "Una guía honesta y transparente sobre el funcionamiento de la IA en CVAI, la tecnología de DeepSeek, sus alcances reales, limitaciones y nuestros compromisos éticos."
      }
      badge={isEn ? "AI Ethics & Technology" : "Ética y Tecnología de IA"}
      lastUpdated={cfg.aiTransparencyUpdated}
      sections={sections}
    >
      {/* 1. Philosophy */}
      <section id={isEn ? "our-ai-philosophy" : "filosofia-ia"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {isEn ? "1. Our Human-Centered AI Philosophy" : "1. Nuestra Filosofía de IA Centrada en el Ser Humano"}
        </h2>
        <p>
          {isEn ? (
            <>
              At <strong>CVAI</strong> ({cfg.companyName}), we believe artificial intelligence should augment human capability, not fabricate fictional qualifications. Our goal is to eliminate the 'blank canvas syndrome' by helping candidates express their authentic professional strengths with compelling, professional terminology.
            </>
          ) : (
            <>
              En <strong>CVAI</strong> ({cfg.companyName}), sostenemos con firmeza que la inteligencia artificial debe ser un amplificador del talento humano, jamás una fábrica de perfiles ficticios. Nuestro propósito es eliminar la 'parálisis de la hoja en blanco' y ayudar a los profesionistas a estructurar sus logros reales con el vocabulario profesional y conciso que valoran los reclutadores.
            </>
          )}
        </p>
      </section>

      {/* 2. DeepSeek Engine */}
      <section id={isEn ? "ai-engine-deepseek" : "motor-deepseek"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          {isEn ? "2. Underlying Technology: DeepSeek AI" : "2. Tecnología y Modelos Subyacentes: DeepSeek AI"}
        </h2>
        <p>
          {isEn
            ? `CVAI is powered by DeepSeek's state-of-the-art language models (specifically deepseek-chat via secured server-side API). DeepSeek models provide exceptional syntactic clarity, nuanced vocabulary in Mexican Spanish, and strong bilingual reasoning for international resumes.`
            : `El motor de lenguaje de CVAI está impulsado por modelos avanzados de DeepSeek (específicamente deepseek-chat a través de una API segura de servidor a servidor). Elegimos esta arquitectura por su destacada capacidad para procesar lenguaje natural en español con giros profesionales idiomáticos, así como su precisión en traducciones bilingües inglés-español.`}
        </p>
        <p className="text-xs text-muted-foreground">
          {isEn
            ? "API communications are routed exclusively through encrypted server-side channels. Client browsers never make direct unauthenticated calls to AI inference servers."
            : "Todas las peticiones a la API de IA se ejecutan de manera cifrada a través de nuestros servidores backend. El navegador del usuario jamás expone llaves de API ni interactúa sin autenticación."}
        </p>
      </section>

      {/* 3. Where AI Helps */}
      <section id={isEn ? "where-ai-helps" : "funciones-asistidas"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          {isEn ? "3. Where AI Assists in CVAI" : "3. Dónde Interviene la Inteligencia Artificial"}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 pt-1">
          <div className="rounded-xl border border-border p-4 bg-card">
            <h4 className="font-semibold text-foreground text-xs">
              {isEn ? "• Professional Profile Summary" : "• Resumen de Perfil Profesional"}
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              {isEn
                ? "Synthesizes your primary skills, field of specialization, and career goals into a coherent 3-4 sentence introductory paragraph."
                : "Sintetiza tus competencias principales, especialidad y objetivos laborales en un párrafo introductorio claro de 3 a 4 líneas."}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <h4 className="font-semibold text-foreground text-xs">
              {isEn ? "• Experience Bullet Rewriter" : "• Reescritura de Viñetas de Experiencia"}
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              {isEn
                ? "Restructures routine job duty lists into action-oriented statements emphasizing metrics, efficiency, and project deliverables."
                : "Reformula listas pasivas de tareas en enunciados orientados a impacto con verbos de acción y cuantificación de resultados."}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <h4 className="font-semibold text-foreground text-xs">
              {isEn ? "• Skill Recommendations" : "• Recomendaciones de Habilidades"}
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              {isEn
                ? "Suggests relevant hard and soft skills frequently sought by employers for your selected job title."
                : "Sugiere habilidades técnicas y blandas indispensables y comúnmente requeridas para el puesto al que aspiras."}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <h4 className="font-semibold text-foreground text-xs">
              {isEn ? "• Contextual Cover Letters" : "• Cartas de Presentación Contextuales"}
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              {isEn
                ? "Generates tailored cover letter drafts demonstrating how your resume experience matches a specific job vacancy."
                : "Redacta borradores personalizados de cartas de presentación alineando tu experiencia con los requisitos de la vacante."}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <h4 className="font-semibold text-foreground text-xs">
              {isEn ? "• Bilingual Translation" : "• Traducción Especializada Español-Inglés"}
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              {isEn
                ? "Translates Spanish resume sections into natural, professional English without awkward literal phrasing."
                : "Traduce secciones curriculares de español a inglés profesional, adaptando la terminología para empleadores internacionales."}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <h4 className="font-semibold text-foreground text-xs">
              {isEn ? "• Grammar & Tone Refinement" : "• Corrección Gramatical y Tono"}
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              {isEn
                ? "Detects passive voice, spelling slips, and suggests polished professional phrasing in Mexican Spanish."
                : "Detecta redundancias, inconsistencias de tiempo verbal y sugiere una redacción ejecutiva impecable."}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Limitations */}
      <section id={isEn ? "limitations-hallucinations" : "limites-alucinaciones"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          {isEn ? "4. Limitations & Mandatory Human Review" : "4. Limitaciones de la IA y Necesidad Obligatoria de Revisión"}
        </h2>
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs">
          <p className="font-semibold text-foreground">
            {isEn ? "Crucial Understanding of AI Capabilities:" : "Comprensión Esencial sobre la Tecnología:"}
          </p>
          <p>
            {isEn
              ? "1. AI is probabilistic: Large Language Models predict likely text sequences based on patterns. They do NOT possess personal knowledge of your life, degree certificates, or employment history."
              : "1. La IA es probabilística: Los modelos de lenguaje predicen secuencias de palabras basándose en patrones estadísticos. No tienen conocimiento omnisciente sobre tus estudios reales, certificaciones ni historial laboral."}
          </p>
          <p>
            {isEn
              ? "2. Potential for inaccuracies ('hallucinations'): AI may occasionally suggest placeholder metrics (e.g. 'increased sales by 25%') or skills you do not possess. You MUST edit these to match your authentic facts."
              : "2. Posibilidad de imprecisiones: La IA puede sugerir porcentajes ficticios de ejemplo (ej. 'incrementé las ventas un 25%') o herramientas técnicas que no dominas. Es tu obligación ineludible verificar que todo dato cuantitativo refleje tu realidad."}
          </p>
          <p>
            {isEn
              ? "3. You are the ultimate author: Never send a resume generated by AI without thoroughly reading and approving every single sentence."
              : "3. Tú eres el autor final: Nunca envíes una postulación sin haber leído, editado y aprobado personalmente cada párrafo."}
          </p>
        </div>
      </section>

      {/* 5. Data Privacy & Training */}
      <section id={isEn ? "data-privacy-training" : "privacidad-sin-entrenamiento"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {isEn ? "5. Data Privacy & No Public Model Training" : "5. Privacidad y no Entrenamiento de Modelos Públicos"}
        </h2>
        <p>
          {isEn
            ? "We respect your personal privacy. Our integration agreements with AI infrastructure providers stipulate:"
            : "Tu privacidad profesional es primordial. Nuestras directrices de integración tecnológica establecen:"}
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-xs text-muted-foreground">
          <li>
            {isEn
              ? "Your resume data is processed ephemerally solely to return the requested generation."
              : "Los datos de tu currículum se procesan de forma efímera únicamente para generar la respuesta solicitada."}
          </li>
          <li>
            {isEn
              ? "Your personal resume inputs are NOT used to train public foundation artificial intelligence models without explicit user consent."
              : "La información de tu currículum NO se utiliza para entrenar modelos públicos de inteligencia artificial sin tu consentimiento."}
          </li>
          <li>
            {isEn
              ? "Data in transit is secured with high-grade TLS 1.3 encryption."
              : "Todas las transferencias de datos en tránsito están aseguradas con cifrado TLS 1.3."}
          </li>
        </ul>
      </section>

      {/* 6. Ethical Principles */}
      <section id={isEn ? "ethical-principles" : "principios-eticos"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          {isEn ? "6. Ethical Principles for the Mexican Job Market" : "6. Principios Éticos para el Mercado Laboral Mexicano"}
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-xs">
          <li>
            <strong>{isEn ? "Combating Unconscious Bias:" : "Prevención de Sesgos Discriminatorios:"}</strong>{" "}
            {isEn
              ? "CVAI prompts are designed to focus on skills, achievements, and qualifications, reducing irrelevant or discriminatory attributes in career summaries."
              : "Nuestros prompts de IA están configurados para priorizar habilidades duras, logros comprobables y formación académica, evitando la inclusión de sesgos discriminatorios."}
          </li>
          <li>
            <strong>{isEn ? "Inclusivity Across Experience Levels:" : "Inclusividad en Todos los Niveles Laborales:"}</strong>{" "}
            {isEn
              ? "Whether assisting a blue-collar worker, a university graduate, or a seasoned corporate director, CVAI delivers equitable, dignified, and professional wording."
              : "Ya sea que redactemos el CV de un egresado de bachillerato técnico, una enfermera, un docente o un directivo corporativo, el tono de CVAI promueve el valor del trabajo y la dignidad laboral."}
          </li>
        </ul>
      </section>

      {/* 7. Contact */}
      <section id={isEn ? "ai-inquiries" : "consultas-ia"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          {isEn ? "7. AI Governance Inquiries" : "7. Consultas sobre Gobernanza y Uso de IA"}
        </h2>
        <p>
          {isEn
            ? `If you have feedback or questions regarding our AI implementation, please reach out to our technology desk at ${cfg.supportEmail}.`
            : `Si tienes observaciones o dudas sobre el funcionamiento ético de la IA en CVAI, comunícate con nuestro equipo técnico a través de ${cfg.supportEmail}.`}
        </p>
      </section>
    </LegalPageLayout>
  );
}
