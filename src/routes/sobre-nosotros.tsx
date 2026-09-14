import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageLayout, type TocSection } from "@/components/legal-page-layout";
import { useSettings } from "@/lib/settings";
import { useCompanyLegalConfig } from "@/lib/legal-config";
import {
  Sparkles, Target, Compass, Users, CheckCircle2, ShieldCheck,
  FileCheck, Cpu, ArrowRight, Award, Globe, HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sobre-nosotros")({
  head: () => ({
    meta: [
      { title: "Sobre Nosotros | CVAI (Curriculum Vitae AI)" },
      {
        name: "description",
        content: "Conoce CVAI (Curriculum Vitae AI): el constructor de currículums profesional con IA diseñado para el mercado laboral mexicano. Plantillas ATS, redacción inteligente y enfoque local.",
      },
      { property: "og:title", content: "Sobre Nosotros | CVAI" },
      { property: "og:description", content: "El constructor de currículums con inteligencia artificial optimizado para México." },
      { property: "og:url", content: "https://www.cvai.com.mx/sobre-nosotros" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/sobre-nosotros" }],
  }),
  component: AboutPageComponent,
});

function AboutPageComponent() {
  const { lang } = useSettings();
  const cfg = useCompanyLegalConfig();
  const isEn = lang === "en";

  const sections: TocSection[] = isEn
    ? [
        { id: "what-is-cvai", title: "1. What is CVAI?" },
        { id: "the-problem", title: "2. The Problem We Solve" },
        { id: "who-it-is-for", title: "3. Who CVAI is Built For" },
        { id: "how-it-works", title: "4. How the AI Builder Works" },
        { id: "templates-ats", title: "5. Templates & ATS Scoring" },
        { id: "cover-letters-bilingual", title: "6. Cover Letters & Bilingual Support" },
        { id: "mexico-first", title: "7. Our Mexico-First Approach" },
        { id: "mission-vision", title: "8. Mission & Vision" },
        { id: "independent-status", title: "9. Independent Platform Statement" },
      ]
    : [
        { id: "que-es-cvai", title: "1. ¿Qué es CVAI?" },
        { id: "el-problema", title: "2. El problema que resolvemos" },
        { id: "a-quien-va-dirigido", title: "3. ¿A quién va dirigido?" },
        { id: "como-funciona", title: "4. Cómo funciona el editor con IA" },
        { id: "plantillas-ats", title: "5. Plantillas y optimización ATS" },
        { id: "cartas-bilingue", title: "6. Cartas de presentación y bilingüismo" },
        { id: "enfoque-mexico", title: "7. Enfoque prioritario en México" },
        { id: "mision-vision", title: "8. Misión y Visión" },
        { id: "plataforma-independiente", title: "9. Declaración de plataforma independiente" },
      ];

  return (
    <LegalPageLayout
      title={isEn ? "About Us — CVAI" : "Sobre Nosotros — CVAI"}
      subtitle={
        isEn
          ? "Learn the story, mission, and technology behind Curriculum Vitae AI, the smart resume builder created for job seekers in Mexico and Latin America."
          : "Conoce la historia, misión y tecnología detrás de Curriculum Vitae AI, la plataforma inteligente creada para transformar la búsqueda de empleo en México."
      }
      badge={isEn ? "Company & Mission" : "Empresa y Misión"}
      lastUpdated={cfg.termsUpdated}
      sections={sections}
    >
      {/* Section 1 */}
      <section id={isEn ? "what-is-cvai" : "que-es-cvai"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {isEn ? "1. What is CVAI (Curriculum Vitae AI)?" : "1. ¿Qué es CVAI (Curriculum Vitae AI)?"}
        </h2>
        <p>
          {isEn ? (
            <>
              <strong>CVAI</strong> stands for <strong>Curriculum Vitae AI</strong>. We are a specialized Software-as-a-Service (SaaS) platform engineered to simplify, elevate, and accelerate how job applicants craft professional resumes and cover letters. By blending modern resume design with cutting-edge artificial intelligence, CVAI empowers candidates to articulate their professional trajectory, achievements, and technical abilities with clarity and impact.
            </>
          ) : (
            <>
              <strong>CVAI</strong> es el acrónimo de <strong>Curriculum Vitae AI</strong>. Somos una plataforma digital especializada (SaaS) desarrollada para simplificar, modernizar y acelerar la creación de currículums profesionales y cartas de presentación de alto impacto. Combinando principios modernos de diseño editorial con modelos avanzados de inteligencia artificial, CVAI permite a los candidatos comunicar sus logros, experiencia y competencias con precisión y contundencia.
            </>
          )}
        </p>
        <p>
          {isEn
            ? "Unlike generic document editors or translated foreign tools, CVAI was conceptualized from the ground up to reflect the nuances, hiring workflows, and expectations of recruiters in Mexico and Latin American markets."
            : "A diferencia de editores de texto genéricos o herramientas extranjeras simplemente traducidas, CVAI fue concebido desde sus cimientos para atender las particularidades, filtros de selección y expectativas reales de los reclutadores en México y Latinoamérica."}
        </p>
      </section>

      {/* Section 2 */}
      <section id={isEn ? "the-problem" : "el-problema"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {isEn ? "2. The Problem We Solve" : "2. El problema que resolvemos en el mercado laboral"}
        </h2>
        <p>
          {isEn
            ? "Job seeking is often hindered by common, frustrating barriers:"
            : "La búsqueda de empleo en México enfrenta barreras cotidianas y frustrantes para miles de candidatos:"}
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>{isEn ? "The ATS Black Hole:" : "El filtro invisible del ATS:"}</strong>{" "}
            {isEn
              ? "Over 70% of medium and large employers utilize Applicant Tracking Systems (ATS) to filter applications. Resumes with poor formatting, incompatible tables, or missing keywords get disqualified before a human recruiter even sees them."
              : "Más del 70% de las medianas y grandes empresas utilizan Sistemas de Seguimiento de Candidatos (ATS). Formatos incompatibles con tablas complejas, gráficos no legibles o falta de palabras clave provocan que currículums altamente calificados sean descartados de forma automática."}
          </li>
          <li>
            <strong>{isEn ? "Difficulty Framing Accomplishments:" : "Dificultad para redactar logros cuantificables:"}</strong>{" "}
            {isEn
              ? "Many talented professionals find it challenging to synthesize their daily duties into impact-oriented bullet points with action verbs and quantifiable metrics in Spanish."
              : "Muchos profesionistas talentosos tienen dificultades para traducir sus responsabilidades diarias en viñetas de impacto con verbos de acción y métricas cuantificables en español."}
          </li>
          <li>
            <strong>{isEn ? "Prohibitive Foreign Tools:" : "Herramientas extranjeras costosas y descontextualizadas:"}</strong>{" "}
            {isEn
              ? "Existing builders often charge in US dollars with aggressive hidden billing cycles, lack local Mexican hiring conventions, and produce unnatural translations."
              : "Los creadores de CV internacionales cobran en dólares con suscripciones confusas, no contemplan los estándares de contratación en México y ofrecen traducciones literales poco profesionales."}
          </li>
        </ul>
      </section>

      {/* Section 3 */}
      <section id={isEn ? "who-it-is-for" : "a-quien-va-dirigido"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {isEn ? "3. Who CVAI is Built For" : "3. ¿A quién va dirigido CVAI?"}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          <div className="rounded-xl border border-border p-4 bg-card">
            <h3 className="font-semibold text-foreground text-sm">
              {isEn ? "Students & Fresh Graduates" : "Estudiantes y Recién Egresados"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {isEn
                ? "Highlight academic projects, social service, internships, and hard skills even with little formal work experience."
                : "Estructura proyectos escolares, servicio social, prácticas profesionales y competencias clave aun sin experiencia previa."}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <h3 className="font-semibold text-foreground text-sm">
              {isEn ? "Mid-Level & Experienced Professionals" : "Profesionistas y Mandos Medios"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {isEn
                ? "Showcase career progression, leadership milestones, and quantifiable business outcomes tailored to target job posts."
                : "Demuestra tu trayectoria ascendente, liderazgo de proyectos e impacto directo en resultados de negocio."}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <h3 className="font-semibold text-foreground text-sm">
              {isEn ? "Executives & Team Leaders" : "Líderes y Directivos"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {isEn
                ? "Clean, executive layouts emphasizing strategy, P&L management, organizational transformation, and team growth."
                : "Diseños ejecutivos impecables enfocados en visión estratégica, presupuestos y dirección de equipos."}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <h3 className="font-semibold text-foreground text-sm">
              {isEn ? "Freelancers & Tech Specialists" : "Freelancers y Especialistas Tech"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {isEn
                ? "Organize portfolio projects, technical stacks, client achievements, and bilingual CV versions for remote global opportunities."
                : "Organiza tu portafolio, tecnologías dominadas y versiones bilingües para vacantes remotas nacionales o globales."}
            </p>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section id={isEn ? "how-it-works" : "como-funciona"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          {isEn ? "4. How the AI-Powered Resume Builder Works" : "4. Cómo funciona nuestro editor asistido por IA"}
        </h2>
        <p>
          {isEn
            ? "CVAI combines an intuitive visual editor with the processing capabilities of DeepSeek AI models to assist users at each stage of resume preparation:"
            : "CVAI combina un editor visual en tiempo real con la potencia analítica de modelos de DeepSeek AI para asistir al usuario en cada sección de su currículum:"}
        </p>
        <div className="space-y-3">
          <div className="rounded-lg border border-border/80 p-3 bg-secondary/20">
            <h4 className="font-semibold text-sm text-foreground">
              {isEn ? "• Professional Profile Summary Generator" : "• Generador de Perfil y Resumen Profesional"}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEn
                ? "Drafts concise 3-4 line introductory profiles articulating your career specialty, years of experience, and primary competencies."
                : "Genera introducciones concisas de 3 a 4 líneas que resumen tu especialidad, trayectoria y propuesta de valor única."}
            </p>
          </div>
          <div className="rounded-lg border border-border/80 p-3 bg-secondary/20">
            <h4 className="font-semibold text-sm text-foreground">
              {isEn ? "• Experience Bullet Rewriter & Quantifier" : "• Redactor de Viñetas de Experiencia con Resultados"}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEn
                ? "Transforms routine task descriptions into impact statements using strong action verbs (e.g. 'Coordinated', 'Implemented', 'Optimized')."
                : "Transforma descripciones pasivas de tareas en enunciados de impacto estructurados con verbos de acción ('Coordiné', 'Implementé', 'Optimizé')."}
            </p>
          </div>
          <div className="rounded-lg border border-border/80 p-3 bg-secondary/20">
            <h4 className="font-semibold text-sm text-foreground">
              {isEn ? "• Smart Skill Suggestions" : "• Recomendaciones Inteligentes de Habilidades"}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEn
                ? "Suggests relevant hard and soft skills aligned with the job title you are targeting."
                : "Sugiere habilidades técnicas y blandas relevantes y demandadas según el puesto al que aspiras."}
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 */}
      <section id={isEn ? "templates-ats" : "plantillas-ats"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          {isEn ? "5. Templates & ATS Optimization Engine" : "5. Plantillas profesionales y motor de optimización ATS"}
        </h2>
        <p>
          {isEn
            ? "Every CVAI template is built following strict ATS-compatibility rules: standard hierarchy (H1/H2), readable single-font typography, high contrast, clean margin structure, and export routines that generate clean, machine-readable text PDFs."
            : "Todas las plantillas de CVAI están diseñadas bajo normas estrictas de compatibilidad con ATS: jerarquía tipográfica estándar, fuentes legibles, márgenes balanceados y código de exportación que produce documentos PDF con texto real seleccionable y procesable por máquinas."}
        </p>
        <p>
          {isEn
            ? "Our built-in ATS checker analyzes keyword presence, contact completeness, bullet clarity, and section completeness to provide an educational score estimate with actionable improvement tips."
            : "Nuestro analizador ATS examina la densidad de palabras clave, la completitud de datos de contacto, la estructura de viñetas y emite una puntuación estimada de compatibilidad con sugerencias concretas de optimización."}
        </p>
      </section>

      {/* Section 6 */}
      <section id={isEn ? "cover-letters-bilingual" : "cartas-bilingue"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          {isEn ? "6. Cover Letters & Multilingual Capabilities" : "6. Cartas de presentación y funciones bilingües"}
        </h2>
        <p>
          {isEn
            ? "Beyond resumes, CVAI features a dedicated cover letter builder that matches your existing resume data with the vacancy description, producing tailored cover letters in seconds."
            : "Además de currículums, CVAI incluye una herramienta dedicada para crear cartas de presentación vinculadas directamente con tu experiencia y los requerimientos de la vacante deseada."}
        </p>
        <p>
          {isEn
            ? "With bilingual support (Mexican Spanish and English), users can generate native Spanish CVs for local companies or professional English resumes for international firms, nearshoring employers, and multinational companies in Mexico."
            : "Con soporte bilingüe integral (Español de México e Inglés profesional), puedes preparar versiones en español para empresas nacionales y versiones en inglés para corporativos multinacionales y vacantes de nearshoring."}
        </p>
      </section>

      {/* Section 7 */}
      <section id={isEn ? "mexico-first" : "enfoque-mexico"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          {isEn ? "7. Our Mexico-First Approach" : "7. Nuestro enfoque prioritario en México"}
        </h2>
        <p>
          {isEn
            ? "Mexico's employment landscape has specific conventions that global software ignores. CVAI respects and optimizes for these local realities:"
            : "El mercado de trabajo en México tiene normas y hábitos que el software extranjero ignora. CVAI fue creado para adaptarse a la realidad nacional:"}
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li>
            {isEn
              ? "Support for optional local identification standards (e.g. state/city slugs, educational degrees like Licenciatura, Ingeniería, Técnico Superior Universitario)."
              : "Reconocimiento de grados académicos nacionales (Licenciatura, Ingeniería, TSU, Posgrado, Diplomados) y ciudades de la República Mexicana."}
          </li>
          <li>
            {isEn
              ? "Formatting ready for Mexican portals such as OCCMundial, Computrabajo México, Indeed México, and LinkedIn México."
              : "Formatos probados para portales de empleo líderes en México (OCCMundial, Computrabajo, Indeed y LinkedIn)."}
          </li>
          <li>
            {isEn
              ? "Transparent pricing in Mexican Pesos (MXN) with accessible plans."
              : "Precios transparentes y claros expresados en Pesos Mexicanos (MXN)."}
          </li>
        </ul>
      </section>

      {/* Section 8 */}
      <section id={isEn ? "mission-vision" : "mision-vision"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          {isEn ? "8. Mission, Vision & Values" : "8. Misión, Visión y Valores"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-primary/20 bg-card p-5">
            <h3 className="font-semibold text-primary text-base mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {isEn ? "Our Mission" : "Nuestra Misión"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn
                ? "To empower every job seeker in Mexico with accessible, high-performance AI tools and designs that eliminate technical friction and help them land interviews with confidence."
                : "Empoderar a los profesionistas y trabajadores de México con herramientas tecnológicas accesibles de inteligencia artificial que eliminen barreras de formato y les permitan conseguir mejores oportunidades laborales."}
            </p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-card p-5">
            <h3 className="font-semibold text-primary text-base mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              {isEn ? "Our Vision" : "Nuestra Visión"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn
                ? "To be Mexico's leading career technology platform, recognized for technological integrity, human-centered artificial intelligence, and genuine support for career advancement."
                : "Ser la plataforma de referencia en tecnología para la carrera profesional en México y Latinoamérica, reconocida por su integridad, utilidad práctica y apoyo genuino al talento local."}
            </p>
          </div>
        </div>
      </section>

      {/* Section 9 */}
      <section id={isEn ? "independent-status" : "plataforma-independiente"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {isEn ? "9. Independent Platform Statement" : "9. Declaración formal de plataforma independiente"}
        </h2>
        <div className="rounded-xl border border-border bg-secondary/30 p-4 text-xs space-y-2">
          <p>
            {isEn
              ? `${cfg.brandName} (${cfg.companyName}) is an independent private technology initiative. CVAI is not affiliated with, sponsored by, or endorsed by any government entity (such as the Secretaría del Trabajo y Previsión Social - STPS, Servicio Nacional de Empleo - SNE), universities (such as UNAM, IPN, ITESM), or third-party employment portals, unless explicitly stated in a signed formal agreement.`
              : `${cfg.brandName} (${cfg.companyName}) es una plataforma privada e independiente de desarrollo tecnológico. CVAI no forma parte, no tiene patrocinio ni mantiene afiliación oficial con dependencias de gobierno (como la STPS o el SNE), universidades públicas o privadas (como UNAM, IPN o Tec de Monterrey) ni con bolsas de trabajo de terceros, salvo que se exprese lo contrario en convenios institucionales explícitos.`}
          </p>
          <p>
            {isEn
              ? "All registered trademarks, company names, and logos referenced on this site belong to their respective owners and are used purely for nominative and descriptive purposes."
              : "Todas las marcas registradas, nombres comerciales y logotipos mencionados en este sitio pertenecen a sus respectivos titulares y se utilizan con fines exclusivamente descriptivos e informativos."}
          </p>
        </div>
      </section>

      {/* Call to action */}
      <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-foreground text-sm">
            {isEn ? "¿Ready to build your professional CV?" : "¿Listo para crear tu currículum profesional?"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isEn ? "Start free with ATS-optimized templates." : "Comienza gratis con plantillas optimizadas para ATS."}
          </p>
        </div>
        <Link to="/plantillas">
          <Button className="gap-2">
            <span>{isEn ? "Explore Templates" : "Explorar Plantillas"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </LegalPageLayout>
  );
}