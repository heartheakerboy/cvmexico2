import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, type TocSection } from "@/components/legal-page-layout";
import { useSettings } from "@/lib/settings";
import { useCompanyLegalConfig } from "@/lib/legal-config";
import { Shield, Lock, Database, CreditCard, Cpu, FileText, UserCheck, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Aviso de Privacidad Integral | CVAI" },
      {
        name: "description",
        content: "Aviso de Privacidad Integral de CVAI (Curriculum Vitae AI) conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) en México.",
      },
      { property: "og:title", content: "Aviso de Privacidad | CVAI" },
      { property: "og:description", content: "Protección y tratamiento de datos personales en CVAI conforme a la legislación mexicana." },
      { property: "og:url", content: "https://www.cvai.com.mx/privacidad" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/privacidad" }],
  }),
  component: PrivacidadPageComponent,
});

function PrivacidadPageComponent() {
  const { lang } = useSettings();
  const cfg = useCompanyLegalConfig();
  const isEn = lang === "en";

  const sections: TocSection[] = isEn
    ? [
        { id: "controller-identity", title: "1. Data Controller Identity" },
        { id: "data-we-collect", title: "2. Personal Data We Collect" },
        { id: "processing-purposes", title: "3. Purposes of Processing" },
        { id: "payment-processing", title: "4. Payments & Lemon Squeezy" },
        { id: "ai-processing", title: "5. AI Processing with DeepSeek" },
        { id: "cloud-storage", title: "6. Cloud Storage & Infrastructure" },
        { id: "data-retention", title: "7. Retention & Account Deletion" },
        { id: "arco-rights", title: "8. ARCO Rights & Mexican Law" },
        { id: "cookies-tracking", title: "9. Cookies & Telemetry" },
        { id: "policy-updates", title: "10. Changes & Legal Contact" },
      ]
    : [
        { id: "identidad-responsable", title: "1. Identidad del Responsable" },
        { id: "datos-recabados", title: "2. Datos personales que recabamos" },
        { id: "finalidades-tratamiento", title: "3. Finalidades del tratamiento" },
        { id: "procesamiento-pagos", title: "4. Pagos y Lemon Squeezy" },
        { id: "inteligencia-artificial", title: "5. Tratamiento de IA (DeepSeek)" },
        { id: "infraestructura-nube", title: "6. Infraestructura y Nube (Cloudflare / Supabase)" },
        { id: "retencion-eliminacion", title: "7. Conservación y eliminación de cuenta" },
        { id: "derechos-arco", title: "8. Derechos ARCO (LFPDPPP)" },
        { id: "cookies-tecnologia", title: "9. Cookies y tecnologías de rastreo" },
        { id: "modificaciones-contacto", title: "10. Cambios al aviso y contacto legal" },
      ];

  return (
    <LegalPageLayout
      title={isEn ? "Comprehensive Privacy Policy" : "Aviso de Privacidad Integral"}
      subtitle={
        isEn
          ? "How CVAI protects, processes, and manages your personal and career data in strict compliance with Mexican data protection laws (LFPDPPP)."
          : "Conoce cómo CVAI protege, trata y resguarda tus datos personales y laborales en estricto cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) en México."
      }
      badge={isEn ? "Privacy & Data Protection" : "Privacidad y LFPDPPP"}
      lastUpdated={cfg.privacyUpdated}
      sections={sections}
    >
      {/* 1. Identity */}
      <section id={isEn ? "controller-identity" : "identidad-responsable"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {isEn ? "1. Identity and Domicile of the Data Controller" : "1. Identidad y Domicilio del Responsable"}
        </h2>
        <p>
          {isEn ? (
            <>
              <strong>{cfg.companyName}</strong> (operating under the brand <strong>{cfg.brandName}</strong> and reachable at the official domain <strong>{cfg.websiteUrl}</strong>), with domicile in {cfg.address}, {cfg.country}, is the legal controller responsible for the lawful, controlled, and informed treatment of the personal data you provide when creating an account, building resumes, or contacting our team.
            </>
          ) : (
            <>
              <strong>{cfg.companyName}</strong> (operando comercialmente bajo la marca <strong>{cfg.brandName}</strong> y a través del dominio oficial <strong>{cfg.websiteUrl}</strong>), con domicilio en {cfg.address}, {cfg.country}, es el responsable del tratamiento, uso y protección de los datos personales que nos proporciones al registrarte, utilizar el editor de currículums o comunicarte con nosotros.
            </>
          )}
        </p>
        <p>
          {isEn
            ? "This Privacy Policy is drafted in accordance with Mexico's Federal Law on the Protection of Personal Data Held by Private Parties (Ley Federal de Protección de Datos Personales en Posesión de los Particulares - LFPDPPP) and its corresponding Regulations."
            : "El presente Aviso de Privacidad se emite en apego a los principios de licitud, consentimiento, información, calidad, finalidad, lealtad, proporcionalidad y responsabilidad previstos en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento."}
        </p>
      </section>

      {/* 2. Data Collected */}
      <section id={isEn ? "data-we-collect" : "datos-recabados"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          {isEn ? "2. Personal Data We Collect" : "2. Datos personales que recabamos"}
        </h2>
        <p>
          {isEn
            ? "To deliver our resume builder and AI career tools, we collect the following categories of information:"
            : "Para ofrecerte las herramientas del creador de currículums y asistencia por IA, recabamos las siguientes categorías de datos:"}
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>{isEn ? "Account Information:" : "Datos de Cuenta y Acceso:"}</strong>{" "}
            {isEn
              ? "Full name, email address, authentication credentials (passwords are stored as salted cryptographic hashes managed securely by Supabase Auth; CVAI never sees plaintext passwords)."
              : "Nombre completo, correo electrónico y credenciales de acceso (las contraseñas se almacenan mediante hashes criptográficos gestionados por Supabase Auth; CVAI nunca tiene acceso a contraseñas en texto plano)."}
          </li>
          <li>
            <strong>{isEn ? "Curriculum Vitae & Career Data:" : "Datos Curriculares y Laborales:"}</strong>{" "}
            {isEn
              ? "Contact details (phone number, city, state, LinkedIn profile, portfolio URL), professional title, work history, employer names, job responsibilities, achievements, academic degrees, educational institutions, languages, certifications, and technical and interpersonal skills."
              : "Datos de contacto profesional (teléfono, ciudad, estado, enlace de LinkedIn o portafolio), título profesional, historial laboral, empresas previas, funciones, logros, formación académica, cédula o carrera, idiomas, certificaciones y habilidades."}
          </li>
          <li>
            <strong>{isEn ? "Uploaded Files & Profile Photos:" : "Archivos y Fotografías Subidas:"}</strong>{" "}
            {isEn
              ? "If you upload a profile picture or prior resume document, it is encrypted and stored in Cloudflare R2 cloud storage solely for inclusion in your generated templates."
              : "Si decides subir una fotografía de perfil o un CV previo para importación, se procesa de forma segura y se almacena en Cloudflare R2 únicamente para renderizarse en tus plantillas elegidas."}
          </li>
          <li>
            <strong>{isEn ? "Telemetry & Technical Logs:" : "Datos Técnicos y Telemáticos:"}</strong>{" "}
            {isEn
              ? "IP address, browser type, operating system, timestamp of access, and session activity strictly necessary for security monitoring and fraud prevention."
              : "Dirección IP, tipo de navegador, sistema operativo y registros de sesión necesarios para auditoría de seguridad y prevención de abusos."}
          </li>
        </ul>
      </section>

      {/* 3. Purposes */}
      <section id={isEn ? "processing-purposes" : "finalidades-tratamiento"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {isEn ? "3. Purposes of Data Processing" : "3. Finalidades del tratamiento de datos"}
        </h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-border p-4 bg-card">
            <h3 className="font-semibold text-foreground text-sm">
              {isEn ? "Primary Purposes (Necessary for Service Delivery):" : "Finalidades Primarias (Necesarias para el Servicio):"}
            </h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-muted-foreground">
              <li>{isEn ? "Creating and managing your CVAI user account." : "Crear, activar y administrar tu cuenta de usuario en CVAI."}</li>
              <li>{isEn ? "Rendering, formatting, and exporting your resumes in PDF and DOCX formats." : "Generar, maquetar y exportar tus currículums en formatos PDF y DOCX."}</li>
              <li>{isEn ? "Processing AI text generation requests (summaries, bullet points, cover letters)." : "Procesar peticiones de generación y mejora de textos mediante inteligencia artificial."}</li>
              <li>{isEn ? "Validating subscriptions and granting access to Pro features." : "Verificar el estado de tus suscripciones activas y otorgar acceso a funciones Pro."}</li>
              <li>{isEn ? "Responding to technical support, billing, or privacy inquiries." : "Brindar atención a tus solicitudes de soporte técnico, facturación o derechos ARCO."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <h3 className="font-semibold text-foreground text-sm">
              {isEn ? "Secondary Purposes (Optional / Service Improvement):" : "Finalidades Secundarias (Mejora del Servicio):"}
            </h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-muted-foreground">
              <li>{isEn ? "Aggregated, anonymized telemetry to detect application bugs and improve UI loading speeds." : "Análisis estadístico agregado y disociado para optimizar tiempos de carga y corregir errores."}</li>
              <li>{isEn ? "Transactional notifications regarding major security or policy updates." : "Envío de notificaciones transaccionales sobre actualizaciones críticas de seguridad o políticas."}</li>
            </ul>
            <p className="text-[11px] text-muted-foreground mt-2">
              {isEn
                ? "CVAI does NOT sell, rent, or trade your resume data or contact information to advertisers, third-party recruiters, or data brokers."
                : "CVAI NO vende, renta ni comercializa tus datos personales ni la información de tu currículum a terceros, agencias de publicidad ni intermediarios de bases de datos."}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Payment Processing */}
      <section id={isEn ? "payment-processing" : "procesamiento-pagos"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          {isEn ? "4. Payment Processing & Financial Security (Lemon Squeezy)" : "4. Procesamiento de pagos y seguridad financiera (Lemon Squeezy)"}
        </h2>
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs">
          <p className="font-semibold text-foreground">
            {isEn ? "Important Financial Notice:" : "Aviso Financiero Importante:"}
          </p>
          <p>
            {isEn
              ? "All payments, recurring subscriptions, and credit/debit card transactions on CVAI are handled exclusively by Lemon Squeezy (Merchant of Record). CVAI NEVER collects, processes, or stores your credit or debit card numbers, CVVs, or bank credentials."
              : "Todos los pagos, suscripciones y transacciones con tarjeta de crédito o débito en CVAI son procesados de forma exclusiva por Lemon Squeezy en su carácter de Merchant of Record (Comerciante Registrado). CVAI NUNCA recopila, procesa ni almacena números de tarjeta, códigos de seguridad (CVV) ni contraseñas bancarias en sus servidores."}
          </p>
          <p>
            {isEn
              ? "CVAI receives only confirmation tokens, order identifiers, and subscription renewal statuses required to activate your Pro plan."
              : "CVAI únicamente recibe identificadores de orden, fecha de renovación y confirmaciones de pago exitoso para activar de manera automática tus funciones Pro."}
          </p>
        </div>
      </section>

      {/* 5. AI Processing */}
      <section id={isEn ? "ai-processing" : "inteligencia-artificial"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          {isEn ? "5. Artificial Intelligence Processing (DeepSeek AI)" : "5. Tratamiento de datos en funciones de Inteligencia Artificial (DeepSeek)"}
        </h2>
        <p>
          {isEn
            ? "When you trigger AI features (such as 'Generate Profile', 'Rewrite Bullet', or 'Create Cover Letter'), the specific text prompt you request is transmitted securely via an encrypted server-to-server API to our AI model provider (DeepSeek):"
            : "Cuando solicitas funciones de IA (como 'Generar resumen profesional', 'Mejorar viñeta' o 'Redactar carta de presentación'), los fragmentos de texto enviados se transmiten de manera cifrada a través de una API servidor-a-servidor a nuestro proveedor de modelos de lenguaje (DeepSeek):"}
        </p>
        <ul className="list-disc pl-6 space-y-1 text-xs">
          <li>
            {isEn
              ? "Requests are processed ephemerally in real-time to generate text suggestions."
              : "Las solicitudes se procesan en tiempo real para generar sugerencias textuales inmediatas."}
          </li>
          <li>
            {isEn
              ? "Your personal resume data is not used to train public foundation artificial intelligence models without your consent."
              : "Tus datos curriculares personales no son utilizados para entrenar modelos públicos de inteligencia artificial sin tu consentimiento."}
          </li>
          <li>
            {isEn
              ? "AI outputs are suggestions only; you retain full control to edit, accept, or reject any generated draft."
              : "Las respuestas de la IA son únicamente borradores sugeridos; tú conservas control total para editarlos, aceptarlos o descartarlos."}
          </li>
        </ul>
      </section>

      {/* 6. Cloud Storage */}
      <section id={isEn ? "cloud-storage" : "infraestructura-nube"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          {isEn ? "6. Cloud Infrastructure & Storage (Cloudflare R2 / Supabase)" : "6. Infraestructura en la nube (Cloudflare R2 / Supabase)"}
        </h2>
        <p>
          {isEn
            ? "To maintain maximum reliability and high availability, CVAI utilizes enterprise-grade cloud providers:"
            : "Para garantizar disponibilidad y alta seguridad operativa, CVAI utiliza infraestructura tecnológica de primer nivel:"}
        </p>
        <ul className="list-disc pl-6 space-y-2 text-xs">
          <li>
            <strong>Supabase:</strong>{" "}
            {isEn
              ? "Provides encrypted database storage and authentication session management with row-level security (RLS), ensuring users can only read and write their own documents."
              : "Aloja nuestra base de datos relacional y autenticación con políticas de seguridad a nivel de fila (Row Level Security - RLS), garantizando que ningún usuario pueda acceder a currículums de otros."}
          </li>
          <li>
            <strong>Cloudflare R2:</strong>{" "}
            {isEn
              ? "S3-compatible secure object storage for uploaded profile photos and generated export assets, protected with encrypted transport (TLS 1.3)."
              : "Almacenamiento de objetos seguro compatible con S3 para imágenes y archivos temporales, protegido con cifrado en tránsito (TLS 1.3)."}
          </li>
        </ul>
      </section>

      {/* 7. Retention & Deletion */}
      <section id={isEn ? "data-retention" : "retencion-eliminacion"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          {isEn ? "7. Data Retention & Account Deletion" : "7. Conservación de datos y eliminación de cuenta"}
        </h2>
        <p>
          {isEn
            ? "Your resume data is retained while your user account remains active so that you can update and download your resumes across multiple job search cycles."
            : "Tus currículums y datos de perfil se conservan mientras tu cuenta permanezca activa, permitiéndote actualizar y descargar tus documentos cada vez que busques nuevas oportunidades."}
        </p>
        <div className="rounded-xl border border-border p-4 bg-card text-xs space-y-2">
          <h4 className="font-semibold text-foreground text-sm">
            {isEn ? "Permanent Account Deletion:" : "Eliminación permanente de cuenta y datos:"}
          </h4>
          <p>
            {isEn
              ? "You may permanently delete your account and all associated resumes, documents, and profile data directly at any time from your Account Settings ('Mi Cuenta') or by submitting a privacy deletion request to legal@cvai.com.mx."
              : "Puedes solicitar la eliminación definitiva de tu cuenta, currículums, fotografías y registros asociados en cualquier momento desde tu panel de usuario en 'Mi Cuenta' o enviando una solicitud formal a legal@cvai.com.mx."}
          </p>
          <p>
            {isEn
              ? "Once confirmed, all your resumes and files are irreversibly deleted from our primary database and object storage."
              : "Una vez confirmada la eliminación, tus currículums y archivos son eliminados de forma definitiva e irreversible de nuestras bases de datos activas."}
          </p>
        </div>
      </section>

      {/* 8. ARCO Rights */}
      <section id={isEn ? "arco-rights" : "derechos-arco"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          {isEn ? "8. ARCO Rights (Access, Rectification, Cancellation, Opposition)" : "8. Ejercicio de Derechos ARCO (LFPDPPP)"}
        </h2>
        <p>
          {isEn
            ? "Under Mexican law (LFPDPPP), you have the right to know what personal data we have about you, what we use it for, and the conditions of its use (Access). You also have the right to request the correction of your personal data if it is outdated, inaccurate, or incomplete (Rectification); that we delete it from our records or databases when you consider that it is not being used properly (Cancellation); as well as oppose the use of your personal data for specific purposes (Opposition)."
            : "Conforme a la LFPDPPP, tienes derecho a conocer qué datos personales tenemos de ti, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es tu derecho solicitar la corrección de tu información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando consideres que la misma no está siendo utilizada adecuadamente (Cancelación); así como oponerte al uso de tus datos personales para fines específicos (Oposición)."}
        </p>
        <div className="rounded-xl border border-border p-4 bg-secondary/30 text-xs space-y-2">
          <h4 className="font-semibold text-foreground text-sm">
            {isEn ? "Procedure to Exercise ARCO Rights:" : "Procedimiento para ejercer tus Derechos ARCO:"}
          </h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              {isEn
                ? `Send an email to our Data Protection Officer at ${cfg.legalEmail}.`
                : `Envía un correo electrónico a nuestro Oficial de Privacidad a ${cfg.legalEmail}.`}
            </li>
            <li>
              {isEn
                ? "Include your registered account email, full name, a clear description of the specific right you wish to exercise (Access, Rectification, Cancellation, or Opposition), and any relevant supporting details."
                : "Indica tu nombre completo, el correo electrónico con el que te registraste en CVAI, la descripción clara del derecho que deseas ejercer y cualquier antecedente relevante."}
            </li>
            <li>
              {isEn
                ? "Our team will acknowledge receipt and deliver an official determination within maximum 20 business days as established by the LFPDPPP."
                : "Nuestro equipo acusará recibo y emitirá una resolución en un plazo máximo de 20 días hábiles conforme a los plazos legales establecidos en la LFPDPPP."}
            </li>
          </ol>
        </div>
      </section>

      {/* 9. Cookies */}
      <section id={isEn ? "cookies-tracking" : "cookies-tecnologia"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {isEn ? "9. Cookies and Local Storage Technologies" : "9. Cookies y tecnologías de almacenamiento local"}
        </h2>
        <p>
          {isEn
            ? "CVAI uses strictly necessary cookies and local storage tokens (such as app.lang and app.theme) solely to maintain your authentication session and preserve your user interface preferences. We do NOT deploy third-party behavioral advertising trackers. For comprehensive details, please review our dedicated Cookie Policy."
            : "CVAI utiliza cookies técnicas estrictamente necesarias y variables de almacenamiento local (como app.lang y app.theme) con la única finalidad de mantener activa tu sesión y recordar tus preferencias de idioma y tema. No utilizamos cookies de publicidad dirigida de terceros. Para mayor detalle, consulta nuestra Política de Cookies."}
        </p>
      </section>

      {/* 10. Modifications & Contact */}
      <section id={isEn ? "policy-updates" : "modificaciones-contacto"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {isEn ? "10. Modifications to this Privacy Notice & Contact" : "10. Modificaciones al Aviso de Privacidad y Contacto"}
        </h2>
        <p>
          {isEn
            ? "We reserve the right to update this Privacy Notice to reflect legal modifications or enhancements to our platform. Any updates will be published on this URL with an updated revision date."
            : "Nos reservamos el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente Aviso de Privacidad para la atención de novedades legislativas o mejoras en la plataforma. Cualquier cambio será publicado en esta misma dirección web con su fecha de vigencia actualizada."}
        </p>
        <div className="pt-2 text-xs space-y-1 text-muted-foreground border-t border-border">
          <p><strong>{cfg.companyName} ({cfg.brandName})</strong></p>
          <p>{isEn ? "Legal & Privacy Department: " : "Departamento Legal y de Privacidad: "} <a href={`mailto:${cfg.legalEmail}`} className="text-primary hover:underline">{cfg.legalEmail}</a></p>
          <p>{isEn ? "General Support: " : "Atención a Usuarios: "} <a href={`mailto:${cfg.supportEmail}`} className="text-primary hover:underline">{cfg.supportEmail}</a></p>
          <p>{cfg.address}, {cfg.country}</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}