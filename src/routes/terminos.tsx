import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageLayout, type TocSection } from "@/components/legal-page-layout";
import { useSettings } from "@/lib/settings";
import { useCompanyLegalConfig } from "@/lib/legal-config";
import { Scale, CheckCircle2, AlertTriangle, CreditCard, Shield, FileText, Ban } from "lucide-react";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y Condiciones de Uso | CVAI" },
      {
        name: "description",
        content: "Términos y Condiciones de Uso de la plataforma CVAI (Curriculum Vitae AI). Condiciones de servicio, planes de suscripción, propiedad intelectual y límites de responsabilidad.",
      },
      { property: "og:title", content: "Términos y Condiciones | CVAI" },
      { property: "og:description", content: "Condiciones legales de uso y suscripciones en CVAI." },
      { property: "og:url", content: "https://www.cvai.com.mx/terminos" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/terminos" }],
  }),
  component: TerminosPageComponent,
});

function TerminosPageComponent() {
  const { lang } = useSettings();
  const cfg = useCompanyLegalConfig();
  const isEn = lang === "en";

  const sections: TocSection[] = isEn
    ? [
        { id: "acceptance", title: "1. Acceptance & Eligibility" },
        { id: "account-security", title: "2. Account Security & Registration" },
        { id: "use-of-services", title: "3. Permitted Platform Use" },
        { id: "ai-assistance-disclaimer", title: "4. AI Assistance & No Guarantee of Employment" },
        { id: "subscriptions-billing", title: "5. Subscriptions & Lemon Squeezy" },
        { id: "cancellations-refunds", title: "6. Cancellations & Refund Terms" },
        { id: "intellectual-property", title: "7. Intellectual Property & User Content" },
        { id: "prohibited-activities", title: "8. Prohibited Conduct & Fair Usage" },
        { id: "limitation-liability", title: "9. Limitation of Liability" },
        { id: "governing-law", title: "10. Governing Law & Dispute Resolution" },
      ]
    : [
        { id: "aceptacion", title: "1. Aceptación y elegibilidad" },
        { id: "seguridad-cuenta", title: "2. Registro y seguridad de la cuenta" },
        { id: "uso-servicios", title: "3. Uso permitido de la plataforma" },
        { id: "asistencia-ia-garantias", title: "4. Asistencia por IA y deslinde laboral" },
        { id: "suscripciones-pagos", title: "5. Suscripciones y cobros (Lemon Squeezy)" },
        { id: "cancelaciones-reembolsos", title: "6. Cancelaciones y reembolsos" },
        { id: "propiedad-intelectual", title: "7. Propiedad intelectual y contenido del usuario" },
        { id: "conductas-prohibidas", title: "8. Conductas prohibidas y uso justo" },
        { id: "limite-responsabilidad", title: "9. Límite de responsabilidad" },
        { id: "legislacion-jurisdiccion", title: "10. Legislación aplicable y jurisdicción" },
      ];

  return (
    <LegalPageLayout
      title={isEn ? "Terms & Conditions of Service" : "Términos y Condiciones de Servicio"}
      subtitle={
        isEn
          ? "Please review these legal terms carefully before using CVAI's resume builder, AI features, templates, and subscription services."
          : "Por favor lee atentamente estos términos legales antes de utilizar el constructor de currículums, las funciones de IA y los planes de suscripción de CVAI."
      }
      badge={isEn ? "Legal Agreement" : "Contrato de Servicios"}
      lastUpdated={cfg.termsUpdated}
      sections={sections}
    >
      {/* 1. Acceptance */}
      <section id={isEn ? "acceptance" : "aceptacion"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          {isEn ? "1. Acceptance of Terms & Eligibility" : "1. Aceptación de los Términos y Elegibilidad"}
        </h2>
        <p>
          {isEn ? (
            <>
              Welcome to <strong>{cfg.brandName}</strong> ({cfg.companyName}). By creating an account, accessing, or utilizing any feature on <strong>{cfg.websiteUrl}</strong>, you enter into a legally binding agreement with {cfg.companyName} governed by these Terms and Conditions. If you do not agree with any provision herein, you must refrain from accessing or using the platform.
            </>
          ) : (
            <>
              Bienvenido a <strong>{cfg.brandName}</strong> ({cfg.companyName}). Al crear una cuenta, navegar o utilizar cualquier herramienta en <strong>{cfg.websiteUrl}</strong>, celebras un contrato vinculante con {cfg.companyName} sujeto a los presentes Términos y Condiciones. Si no estás de acuerdo con alguna de las cláusulas aquí estipuladas, debes abstenerte de utilizar la plataforma.
            </>
          )}
        </p>
        <p>
          {isEn
            ? "To use CVAI, you must be at least 18 years of age or possess legal capacity under Mexican employment legislation to seek employment."
            : "Para utilizar CVAI debes tener al menos 18 años de edad cumplidos o contar con la edad legal permitida por la Ley Federal del Trabajo en México para prestar servicios laborales."}
        </p>
      </section>

      {/* 2. Account Security */}
      <section id={isEn ? "account-security" : "seguridad-cuenta"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {isEn ? "2. Account Registration & Credential Security" : "2. Registro y Seguridad de la Cuenta"}
        </h2>
        <p>
          {isEn
            ? "When registering, you agree to provide truthful, accurate, and current contact details. You are solely responsible for maintaining the confidentiality of your authentication credentials and for all activities that occur under your user session."
            : "Al darte de alta, te comprometes a proporcionar información veraz, exacta y actualizada. Eres el único responsable de salvaguardar la confidencialidad de tu contraseña y de todas las acciones efectuadas dentro de tu cuenta."}
        </p>
        <p>
          {isEn
            ? "If you suspect unauthorized access or a security compromise of your credentials, you must notify CVAI immediately at support@cvai.com.mx."
            : "En caso de detectar cualquier acceso no autorizado o vulneración de seguridad en tu cuenta, debes notificarlo de inmediato a support@cvai.com.mx."}
        </p>
      </section>

      {/* 3. Permitted Use */}
      <section id={isEn ? "use-of-services" : "uso-servicios"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {isEn ? "3. Permitted Use of Platform Features" : "3. Uso Permitido de las Funciones de la Plataforma"}
        </h2>
        <p>
          {isEn
            ? "CVAI grants you a personal, non-exclusive, non-transferable, revocable license to use the following career tools:"
            : "CVAI te otorga una licencia personal, no exclusiva, intransferible y revocable para utilizar las siguientes herramientas de desarrollo profesional:"}
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-xs">
          <li>{isEn ? "Visual resume builder and template customizer." : "Constructor visual de currículums y personalizador de plantillas."}</li>
          <li>{isEn ? "AI text generation (professional summaries, bullet improvements, skill suggestions)." : "Generación de textos asistidos por IA (resumen profesional, viñetas de logros, sugerencias de habilidades)."}</li>
          <li>{isEn ? "ATS keyword check and formatting analysis." : "Analizador de compatibilidad con sistemas ATS y densidad de palabras clave."}</li>
          <li>{isEn ? "Cover letter generator and export tools." : "Creador de cartas de presentación y herramientas de exportación."}</li>
          <li>{isEn ? "Exporting finished documents in PDF and DOCX formats." : "Exportación de documentos terminados en formatos PDF y DOCX."}</li>
        </ul>
      </section>

      {/* 4. AI Disclaimer */}
      <section id={isEn ? "ai-assistance-disclaimer" : "asistencia-ia-garantias"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          {isEn ? "4. AI Assistance & No Guarantee of Employment" : "4. Asistencia por Inteligencia Artificial y Deslinde Laboral"}
        </h2>
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs">
          <p className="font-semibold text-foreground">
            {isEn ? "Crucial Employment Disclaimer:" : "Deslinde Laboral y Profesional Esencial:"}
          </p>
          <p>
            {isEn
              ? "CVAI is a productivity tool. We do NOT guarantee employment, interviews, hiring, job offers, ATS passage, or salary increases. Hiring decisions are made solely by independent employers and recruitment teams based on their own criteria."
              : "CVAI es una herramienta de productividad y diseño. CVAI NO garantiza la obtención de empleo, llamadas a entrevistas, ofertas laborales, aprobación definitiva de filtros ATS ni aumentos salariales. La decisión de contratación corresponde de forma exclusiva a los empleadores independientes."}
          </p>
          <p>
            {isEn
              ? "AI-generated text is provided as drafting suggestions. You are legally responsible for reviewing and validating all facts, metrics, and dates before submitting your resume to any prospective employer."
              : "Los textos generados por inteligencia artificial son sugerencias y borradores automatizados. Tú eres el único responsable de revisar, verificar y validar que los datos, fechas, títulos y competencias plasmados en tu currículum sean verídicos antes de postularte a cualquier vacante."}
          </p>
        </div>
      </section>

      {/* 5. Subscriptions */}
      <section id={isEn ? "subscriptions-billing" : "suscripciones-pagos"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          {isEn ? "5. Subscription Plans & Payment Processing (Lemon Squeezy)" : "5. Planes de Suscripción y Procesamiento de Pagos (Lemon Squeezy)"}
        </h2>
        <p>
          {isEn
            ? "CVAI offers a Free Plan with standard features and optional Premium (Pro) subscription plans unlocking full template catalogs, unlimited AI generation, and watermark-free exports:"
            : "CVAI ofrece un plan gratuito ('Free') con funciones básicas y planes de suscripción 'Pro' de pago que desbloquean el catálogo completo de plantillas, IA sin límites prácticos y descargas sin marca de agua:"}
        </p>
        <ul className="list-disc pl-6 space-y-2 text-xs">
          <li>
            <strong>{isEn ? "Pricing & Currency:" : "Precios y Moneda:"}</strong>{" "}
            {isEn
              ? "Current subscription rates are clearly published on our Pricing page in Mexican Pesos (MXN) or US Dollars (USD)."
              : "Los precios vigentes se encuentran publicados con total transparencia en nuestra página de precios, expresados en Pesos Mexicanos (MXN) o Dólares (USD)."}
          </li>
          <li>
            <strong>{isEn ? "Merchant of Record:" : "Comerciante Registrado (Merchant of Record):"}</strong>{" "}
            {isEn
              ? "All payments are handled securely by Lemon Squeezy, which acts as the Merchant of Record. Lemon Squeezy manages card security, global tax compliance (including VAT/IVA where applicable), and recurring transaction processing."
              : "Todas las transacciones son gestionadas de forma segura por Lemon Squeezy en calidad de Merchant of Record, entidad responsable de la seguridad de cobro con tarjeta, cumplimiento fiscal de IVA e impuestos y renovación recurrente."}
          </li>
          <li>
            <strong>{isEn ? "Automatic Renewal:" : "Renovación Automática:"}</strong>{" "}
            {isEn
              ? "Active subscriptions renew automatically at the end of each billing cycle (monthly or annually) unless cancelled before the renewal date."
              : "Las suscripciones activas se renuevan de manera automática al término de cada ciclo de facturación (mensual o anual) utilizando el método de pago registrado, a menos que canceles antes de la fecha de corte."}
          </li>
        </ul>
      </section>

      {/* 6. Cancellations & Refunds */}
      <section id={isEn ? "cancellations-refunds" : "cancelaciones-reembolsos"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          {isEn ? "6. Cancellations & Refund Policy" : "6. Cancelaciones y Política de Reembolso"}
        </h2>
        <p>
          {isEn
            ? "You may cancel your Pro subscription at any time directly through your user panel in 'My Account'. Upon cancellation, automatic renewals stop immediately, and you retain uninterrupted access to Pro benefits until the conclusion of your current paid billing period."
            : "Puedes cancelar tu suscripción Pro en cualquier momento de forma autónoma desde el panel en 'Mi Cuenta'. La cancelación detiene de inmediato los cargos futuros y mantienes acceso a las funciones Pro hasta que finalice el periodo ya pagado."}
        </p>
        <p>
          {isEn
            ? "Due to the immediate digital consumption of SaaS resources and AI generation credits, sales are generally final. Specific exceptions (such as duplicate transactions or verified billing errors) are governed by our dedicated Refund Policy."
            : "Debido a la naturaleza digital e inmediata del servicio y al consumo instantáneo de créditos de IA y descargas, las compras son de carácter definitivo. Excepciones por duplicidad o fallas técnicas no atribuibles al usuario se rigen por nuestra Política de Reembolsos."}
        </p>
      </section>

      {/* 7. Intellectual Property */}
      <section id={isEn ? "intellectual-property" : "propiedad-intelectual"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {isEn ? "7. Intellectual Property Rights" : "7. Derechos de Propiedad Intelectual"}
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-xs">
          <li>
            <strong>{isEn ? "CVAI Property:" : "Propiedad de CVAI:"}</strong>{" "}
            {isEn
              ? "All platform code, visual designs, template architectures, algorithms, trademarks, and logos remain the exclusive intellectual property of CVAI."
              : "Todo el software, código, diseño visual de interfaces, arquitectura de plantillas, algoritmos, marcas y logotipos son propiedad intelectual exclusiva de CVAI."}
          </li>
          <li>
            <strong>{isEn ? "User Content Ownership:" : "Propiedad del Usuario:"}</strong>{" "}
            {isEn
              ? "You retain complete ownership over all personal career information, employment history, text inputs, and photographs you provide. You grant CVAI only the limited license necessary to render, host, and export your resumes as instructed by you."
              : "Tú conservas la titularidad y propiedad absoluta sobre tus datos personales, trayectoria laboral y textos aportados. Únicamente otorgas a CVAI la licencia técnica necesaria para procesar, maquetar y exportar tus documentos a petición tuya."}
          </li>
        </ul>
      </section>

      {/* 8. Prohibited Conduct */}
      <section id={isEn ? "prohibited-activities" : "conductas-prohibidas"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Ban className="h-5 w-5 text-primary" />
          {isEn ? "8. Prohibited Activities & Fair Usage" : "8. Conductas Prohibidas y Política de Uso Justo"}
        </h2>
        <p>
          {isEn
            ? "When using CVAI, you agree not to engage in:"
            : "Al utilizar CVAI, te comprometes formalmente a no incurrir en:"}
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-xs">
          <li>{isEn ? "Automated scraping, bot crawling, or reverse engineering of CVAI code or AI prompts." : "Extracción automatizada (scraping), rastreo por bots o ingeniería inversa del código o prompts de IA."}</li>
          <li>{isEn ? "Generating fraudulent resumes, counterfeit academic titles, or defamatory content." : "Generación de currículums falsos, usurpación de identidad o falsificación de grados académicos."}</li>
          <li>{isEn ? "Circumventing subscription payment checks or abusing AI token limits." : "Evadir controles de acceso a suscripciones o abusar de forma masiva de las cuotas de procesamiento de IA."}</li>
          <li>{isEn ? "Sharing single user accounts across commercial recruiting agencies without authorization." : "Compartir cuentas personales de uso individual entre agencias de colocación comercial sin autorización."}</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-2">
          {isEn
            ? "CVAI reserves the right to suspend or terminate accounts engaging in abusive behavior without refund."
            : "CVAI se reserva el derecho de suspender o revocar el acceso a cuentas que incurran en prácticas abusivas o fraudulentas, sin derecho a reembolso."}
        </p>
      </section>

      {/* 9. Limitation of Liability */}
      <section id={isEn ? "limitation-liability" : "limite-responsabilidad"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          {isEn ? "9. Limitation of Liability" : "9. Límite de Responsabilidad"}
        </h2>
        <p>
          {isEn
            ? "To the maximum extent permitted by applicable Mexican law, CVAI and its creators shall not be liable for indirect, incidental, special, or consequential damages resulting from inability to access the service, recruiter decisions, lost employment opportunities, or algorithmic inaccuracies in AI suggestions."
            : "En la máxima medida permitida por la legislación mexicana aplicable, CVAI no responderá por daños indirectos, incidentales, punitivos o consecuenciales derivados de fallas de conexión a internet del usuario, decisiones de reclutadores externos, oportunidades de empleo no obtenidas o inexactitudes en las sugerencias generadas por la IA."}
        </p>
      </section>

      {/* 10. Governing Law */}
      <section id={isEn ? "governing-law" : "legislacion-jurisdiccion"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          {isEn ? "10. Governing Law & Jurisdiction" : "10. Legislación Aplicable y Jurisdicción"}
        </h2>
        <p>
          {isEn
            ? "These Terms and Conditions are governed by the federal laws of the United Mexican States. For the interpretation and fulfillment of these terms, both parties submit to the jurisdiction of the competent courts of Mexico City, expressly waiving any other jurisdiction."
            : "Los presentes Términos y Condiciones se rigen e interpretan de conformidad con las leyes federales de los Estados Unidos Mexicanos. Para cualquier controversia, las partes se someten expresamente a la jurisdicción de los tribunales competentes en la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros."}
        </p>
        <div className="pt-2 text-xs space-y-1 text-muted-foreground border-t border-border">
          <p><strong>{cfg.companyName} ({cfg.brandName})</strong></p>
          <p>{isEn ? "Legal Support: " : "Atención Legal: "} <a href={`mailto:${cfg.legalEmail}`} className="text-primary hover:underline">{cfg.legalEmail}</a></p>
          <p>{isEn ? "Official Domain: " : "Dominio Oficial: "} {cfg.websiteUrl}</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}