import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, type TocSection } from "@/components/legal-page-layout";
import { useSettings } from "@/lib/settings";
import { useCompanyLegalConfig } from "@/lib/legal-config";
import { AlertCircle, ShieldAlert, CheckCircle2, FileSearch, Building2, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/aviso-legal")({
  head: () => ({
    meta: [
      { title: "Aviso Legal y Deslinde de Responsabilidad | CVAI" },
      {
        name: "description",
        content: "Aviso Legal y Deslinde de Responsabilidad de CVAI (Curriculum Vitae AI). Información clara sobre la naturaleza de la herramienta, puntuaciones ATS y ausencia de garantías laborales.",
      },
      { property: "og:title", content: "Aviso Legal (Disclaimer) | CVAI" },
      { property: "og:description", content: "Límites legales, estimaciones ATS y deslinde de garantías de empleo en CVAI." },
      { property: "og:url", content: "https://www.cvai.com.mx/aviso-legal" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/aviso-legal" }],
  }),
  component: AvisoLegalPageComponent,
});

function AvisoLegalPageComponent() {
  const { lang } = useSettings();
  const cfg = useCompanyLegalConfig();
  const isEn = lang === "en";

  const sections: TocSection[] = isEn
    ? [
        { id: "nature-of-platform", title: "1. Nature of the Platform" },
        { id: "ai-assistance-limits", title: "2. Scope & Limits of AI Assistance" },
        { id: "no-employment-guarantee", title: "3. Explicit Non-Guarantees (Hiring, Interviews, Salary)" },
        { id: "ats-score-estimation", title: "4. ATS Score as an Estimate, Not a Guarantee" },
        { id: "user-verification", title: "5. Mandatory User Review & Accuracy" },
        { id: "entity-non-affiliation", title: "6. Non-Affiliation with Employers or Government" },
        { id: "external-links", title: "7. Third-Party Services & External Links" },
        { id: "legal-contact", title: "8. Legal Contact" },
      ]
    : [
        { id: "naturaleza-plataforma", title: "1. Naturaleza de la plataforma" },
        { id: "alcances-limites-ia", title: "2. Alcance y límites de la asistencia por IA" },
        { id: "ausencia-garantias", title: "3. Deslinde explícito de garantías laborales" },
        { id: "estimacion-ats", title: "4. Puntuación ATS como estimación no vinculante" },
        { id: "responsabilidad-usuario", title: "5. Revisión y veracidad obligatoria del usuario" },
        { id: "no-afiliacion", title: "6. Deslinde de afiliación institucional o gubernamental" },
        { id: "enlaces-terceros", title: "7. Servicios de terceros y enlaces externos" },
        { id: "contacto-legal", title: "8. Contacto para aclaraciones" },
      ];

  return (
    <LegalPageLayout
      title={isEn ? "Legal Disclaimer" : "Aviso Legal y Deslinde de Responsabilidad"}
      subtitle={
        isEn
          ? "Clear, transparent disclosure regarding the software nature of CVAI, AI drafting assistance, ATS estimates, and non-guarantee of employment outcomes."
          : "Información clara y transparente sobre el alcance de CVAI como herramienta tecnológica, el carácter asistencial de la IA, las estimaciones ATS y el deslinde de garantías de contratación."
      }
      badge={isEn ? "Transparency & Disclaimer" : "Transparencia y Deslinde"}
      lastUpdated={cfg.disclaimerUpdated}
      sections={sections}
    >
      {/* 1. Nature */}
      <section id={isEn ? "nature-of-platform" : "naturaleza-plataforma"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          {isEn ? "1. Nature of the Platform" : "1. Naturaleza de la Plataforma"}
        </h2>
        <p>
          {isEn ? (
            <>
              <strong>{cfg.brandName}</strong> ({cfg.companyName}) is a self-service Software-as-a-Service (SaaS) application designed to assist job candidates in formatting, styling, and writing resumes and cover letters. CVAI provides document editing software and algorithmic content drafting tools.
            </>
          ) : (
            <>
              <strong>{cfg.brandName}</strong> ({cfg.companyName}) es una herramienta digital de auto-servicio (SaaS) diseñada para apoyar a los candidatos en la maquetación, diseño y redacción de currículums y cartas de presentación. CVAI provee software de edición documental y herramientas asistidas por computadora.
            </>
          )}
        </p>
        <p>
          {isEn
            ? "CVAI is NOT an employment agency, headhunter, staffing firm, recruiter, labor legal counsel, or certified career psychologist. Using CVAI does not establish an employment agency or professional advisory relationship."
            : "CVAI NO es una agencia de colocación de empleo, empresa de reclutamiento y selección de personal, despacho de asesoría laboral ni consultoría certificada de carrera. El uso de esta plataforma no constituye asesoría legal laboral ni crea una relación de intermediación de empleo."}
        </p>
      </section>

      {/* 2. AI Limits */}
      <section id={isEn ? "ai-assistance-limits" : "alcances-limites-ia"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-primary" />
          {isEn ? "2. Scope & Limits of AI Assistance" : "2. Alcance y Límites de la Asistencia por IA"}
        </h2>
        <p>
          {isEn
            ? "The artificial intelligence features within CVAI (such as summary drafting, bullet point suggestions, and skill recommendations powered by DeepSeek AI) operate as automated writing assistants. They generate suggestions based on linguistic probabilistic models."
            : "Las funciones de inteligencia artificial dentro de CVAI (como la generación de perfiles, reescritura de viñetas y sugerencias de habilidades impulsadas por DeepSeek AI) operan como asistentes automáticos de redacción. Generan propuestas basadas en modelos probabilísticos del lenguaje."}
        </p>
        <div className="rounded-xl border border-border bg-card p-4 text-xs space-y-2">
          <p>
            {isEn
              ? "• AI models cannot independently verify the historical reality of your career, certifications, degrees, or actual job performance."
              : "• Los modelos de IA no pueden verificar de forma independiente la veracidad histórica de tus empleos pasados, certificaciones o desempeño real."}
          </p>
          <p>
            {isEn
              ? "• Suggested text may occasionally contain generalities or inaccuracies that must be adapted to your authentic professional circumstances."
              : "• Los textos sugeridos pueden contener imprecisiones que deben ser forzosamente adaptadas a tu realidad laboral por ti."}
          </p>
        </div>
      </section>

      {/* 3. Non-Guarantees */}
      <section id={isEn ? "no-employment-guarantee" : "ausencia-garantias"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          {isEn ? "3. Explicit Non-Guarantees" : "3. Deslinde Explícito de Garantías Laborales"}
        </h2>
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-xs space-y-3">
          <p className="font-bold text-foreground text-sm">
            {isEn ? "Under no circumstances does CVAI promise or guarantee:" : "Bajo ninguna circunstancia CVAI garantiza ni promete:"}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li><strong>{isEn ? "Employment or Job Offers:" : "Obtención de empleo u ofertas formales:"}</strong> {isEn ? "Securing a job depends exclusively on external hiring authorities." : "La contratación depende única y exclusivamente de la decisión soberana del empleador."}</li>
            <li><strong>{isEn ? "Interviews or Recruiter Responses:" : "Entrevistas o llamadas de reclutadores:"}</strong> {isEn ? "We cannot guarantee that any recruiter will contact you or review your application." : "No garantizamos que las empresas receptoras respondan o agenden entrevistas."}</li>
            <li><strong>{isEn ? "Salary or Compensation Levels:" : "Sueldos o beneficios salariales:"}</strong> {isEn ? "CVAI does not influence wage negotiation or job offers." : "CVAI no tiene injerencia en las propuestas económicas de las empresas."}</li>
            <li><strong>{isEn ? "Hiring Success:" : "Éxito en procesos de selección:"}</strong> {isEn ? "A well-designed resume is a communication tool, not a guarantee of selection." : "Un currículum bien diseñado es una herramienta de presentación, no una garantía de admisión."}</li>
          </ul>
        </div>
      </section>

      {/* 4. ATS Estimation */}
      <section id={isEn ? "ats-score-estimation" : "estimacion-ats"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-primary" />
          {isEn ? "4. ATS Score as an Estimate, Not a Guarantee" : "4. Puntuación ATS como Estimación no Vinculante"}
        </h2>
        <p>
          {isEn
            ? "The 'ATS Score' and keyword checks displayed in CVAI are mathematical approximations calculated by our internal algorithm. They evaluate adherence to general formatting best practices (font readability, contact details presence, bullet structures, and keyword density)."
            : "La 'Puntuación ATS' y las verificaciones de palabras clave mostradas en CVAI son aproximaciones didácticas calculadas por algoritmos internos. Evalúan la conformidad de tu currículum con buenas prácticas estándar de maquetación (legibilidad de texto, presencia de datos de contacto y estructura de viñetas)."}
        </p>
        <p className="text-xs text-muted-foreground">
          {isEn
            ? "Because third-party employers utilize hundreds of distinct, proprietary ATS software platforms (e.g. Workday, Taleo, Greenhouse, Lever, SAP SuccessFactors) with confidential parsing rules, CVAI CANNOT guarantee that your resume will score identically or pass any third-party system."
            : "Dado que cada empresa utiliza sistemas ATS propietarios distintos (como Workday, Taleo, Greenhouse, Lever o SAP) configurados con filtros exclusivos, CVAI NO puede garantizar que tu CV obtendrá la misma puntuación ni que superará de forma infalible los filtros de un empleador particular."}
        </p>
      </section>

      {/* 5. User Responsibility */}
      <section id={isEn ? "user-verification" : "responsabilidad-usuario"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          {isEn ? "5. Mandatory User Review & Accuracy Responsibility" : "5. Obligación de Revisión y Veracidad por Parte del Usuario"}
        </h2>
        <p>
          {isEn
            ? "You are solely and strictly responsible for reviewing every section, title, date, credential, and statement in your generated resume before submitting it to any company, job board, or recruiter."
            : "El usuario asume la responsabilidad total, exclusiva y estricta de leer y verificar minuciosamente cada dato, fecha, cédula profesional y descripción en su currículum antes de postularse a cualquier vacante."}
        </p>
        <p className="text-xs text-muted-foreground">
          {isEn
            ? "Under Mexican federal and state employment laws, misrepresenting credentials or presenting fraudulent resumes is prohibited. CVAI disclaims any liability for misstatements made by users in their documents."
            : "Presentar información falsa o documentos apócrifos ante empleadores está penado por la legislación laboral mexicana. CVAI se deslinda de cualquier falsedad incurrida por el usuario en sus postulaciones."}
        </p>
      </section>

      {/* 6. Non-Affiliation */}
      <section id={isEn ? "entity-non-affiliation" : "no-afiliacion"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          {isEn ? "6. Non-Affiliation with Employers or Government Agencies" : "6. Deslinde de Afiliación Institucional o Gubernamental"}
        </h2>
        <p>
          {isEn
            ? `${cfg.brandName} (${cfg.companyName}) is an independent commercial platform. Unless expressly stated in writing, CVAI is NOT affiliated with, sponsored by, authorized by, or endorsed by:`
            : `${cfg.brandName} (${cfg.companyName}) es una plataforma privada e independiente. Salvo que se señale expresamente por escrito, CVAI NO mantiene relación laboral, patrocinio ni afiliación oficial con:`}
        </p>
        <ul className="list-disc pl-6 space-y-1 text-xs text-muted-foreground">
          <li>{isEn ? "Mexican government ministries (STPS, SNE, SEP, SAT, IMSS)." : "Dependencias del Gobierno de México (STPS, SNE, SEP, SAT, IMSS)."}</li>
          <li>{isEn ? "Public or private universities (UNAM, IPN, ITESM, UAM, UANL)." : "Instituciones universitarias públicas o privadas (UNAM, IPN, Tec de Monterrey, etc.)."}</li>
          <li>{isEn ? "Third-party job boards (LinkedIn, OCCMundial, Computrabajo, Indeed, Glassdoor)." : "Portales de empleo externos (LinkedIn, OCCMundial, Computrabajo, Indeed o Glassdoor)."}</li>
          <li>{isEn ? "Immigration, visa, or labor legal advisory services." : "Servicios migratorios, consulares ni despachos de trámites de visado de trabajo."}</li>
        </ul>
      </section>

      {/* 7. External Links */}
      <section id={isEn ? "external-links" : "enlaces-terceros"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          {isEn ? "7. External Links & Third-Party Platforms" : "7. Servicios de Terceros y Enlaces Externos"}
        </h2>
        <p>
          {isEn
            ? "Our website may include links to external resources, job portals, or our payment provider (Lemon Squeezy). CVAI does not exercise control over the content, privacy policies, or practices of third-party platforms."
            : "Nuestro sitio puede contener hipervínculos a bolsas de trabajo o a nuestro procesador de pagos (Lemon Squeezy). CVAI no ejerce control sobre el contenido, políticas de privacidad ni prácticas comerciales de sitios web de terceros."}
        </p>
      </section>

      {/* 8. Contact */}
      <section id={isEn ? "legal-contact" : "contacto-legal"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          {isEn ? "8. Inquiries & Legal Clarifications" : "8. Dudas y Aclaraciones Legales"}
        </h2>
        <p>
          {isEn
            ? `If you have questions regarding this Disclaimer, please reach out to our legal compliance desk at ${cfg.legalEmail}.`
            : `Si tienes cualquier duda respecto a este Aviso Legal y Deslinde de Responsabilidad, comunícate con nuestro equipo en ${cfg.legalEmail}.`}
        </p>
        <div className="pt-2 text-xs text-muted-foreground border-t border-border">
          <p><strong>{cfg.companyName} ({cfg.brandName})</strong> • {cfg.address}, {cfg.country}</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
