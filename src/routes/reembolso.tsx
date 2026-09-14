import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, type TocSection } from "@/components/legal-page-layout";
import { useSettings } from "@/lib/settings";
import { useCompanyLegalConfig } from "@/lib/legal-config";
import { CreditCard, RefreshCw, XCircle, CheckCircle2, ShieldCheck, Mail } from "lucide-react";

export const Route = createFileRoute("/reembolso")({
  head: () => ({
    meta: [
      { title: "Política de Reembolso y Devoluciones | CVAI" },
      {
        name: "description",
        content: "Política de Reembolso, Cancelación y Facturación de CVAI (Curriculum Vitae AI). Información clara sobre compras digitales y suscripciones procesadas por Lemon Squeezy.",
      },
      { property: "og:title", content: "Política de Reembolso | CVAI" },
      { property: "og:description", content: "Condiciones de reembolso y cancelación de suscripciones en CVAI." },
      { property: "og:url", content: "https://www.cvai.com.mx/reembolso" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/reembolso" }],
  }),
  component: ReembolsoPageComponent,
});

function ReembolsoPageComponent() {
  const { lang } = useSettings();
  const cfg = useCompanyLegalConfig();
  const isEn = lang === "en";

  const sections: TocSection[] = isEn
    ? [
        { id: "digital-nature", title: "1. Digital SaaS Service Nature" },
        { id: "self-cancellation", title: "2. Subscription Cancellation Policy" },
        { id: "refund-eligibility", title: "3. Refund Eligibility & Exceptions" },
        { id: "ineligible-scenarios", title: "4. Non-Refundable Scenarios" },
        { id: "lemon-squeezy-role", title: "5. Lemon Squeezy (Merchant of Record)" },
        { id: "chargebacks-disputes", title: "6. Chargebacks & Payment Disputes" },
        { id: "how-to-request", title: "7. How to Request Billing Support" },
      ]
    : [
        { id: "naturaleza-digital", title: "1. Naturaleza digital del servicio SaaS" },
        { id: "cancelacion-suscripcion", title: "2. Política de cancelación de suscripciones" },
        { id: "criterios-reembolso", title: "3. Criterios de elegibilidad de reembolso" },
        { id: "casos-no-reembolsables", title: "4. Supuestos no reembolsables" },
        { id: "rol-lemon-squeezy", title: "5. Rol de Lemon Squeezy (Merchant of Record)" },
        { id: "contracargos-disputas", title: "6. Contracargos y disputas bancarias" },
        { id: "como-solicitar", title: "7. Cómo contactar a soporte de facturación" },
      ];

  return (
    <LegalPageLayout
      title={isEn ? "Refund & Cancellation Policy" : "Política de Reembolso y Cancelación"}
      subtitle={
        isEn
          ? "Clear guidelines on how subscription cancellations, digital purchases, and refund eligibility operate on CVAI."
          : "Términos claros y transparentes sobre compras digitales, cancelación de planes Pro y condiciones de reembolso en CVAI."
      }
      badge={isEn ? "Billing Policy" : "Facturación y Reembolsos"}
      lastUpdated={cfg.refundUpdated}
      sections={sections}
    >
      {/* 1. Digital Nature */}
      <section id={isEn ? "digital-nature" : "naturaleza-digital"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          {isEn ? "1. Digital SaaS Service Nature" : "1. Naturaleza del Servicio Digital e Inmediato"}
        </h2>
        <p>
          {isEn ? (
            <>
              <strong>{cfg.brandName}</strong> ({cfg.companyName}) provides instant, cloud-based Software-as-a-Service (SaaS). When upgrading to a Pro subscription or purchasing a premium plan, you gain immediate access to advanced ATS templates, unlimited AI generation, real-time export engines, and cloud hosting.
            </>
          ) : (
            <>
              <strong>{cfg.brandName}</strong> ({cfg.companyName}) ofrece software digital en la nube de consumo inmediato. Al adquirir un plan Pro, obtienes acceso instantáneo a nuestro catálogo completo de plantillas ATS, procesamiento por inteligencia artificial, descargas ilimitadas sin marca de agua y almacenamiento seguro.
            </>
          )}
        </p>
        <p>
          {isEn
            ? "Because digital computing capacity and AI tokens are consumed instantaneously upon purchase, all subscription sales are generally considered final, subject to the transparent consumer protection exceptions outlined below."
            : "Debido a que el cómputo en la nube y los créditos de IA se consumen de manera instantánea, las ventas se consideran definitivas como regla general, sujetas a las excepciones justas de protección al consumidor detalladas a continuación."}
        </p>
      </section>

      {/* 2. Cancellation */}
      <section id={isEn ? "self-cancellation" : "cancelacion-suscripcion"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          {isEn ? "2. Self-Service Subscription Cancellation Policy" : "2. Política de Cancelación de Suscripciones Autónomas"}
        </h2>
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs">
          <p className="font-semibold text-foreground">
            {isEn ? "Zero Cancellation Lock-In:" : "Cancelación Libre y sin Trabas:"}
          </p>
          <p>
            {isEn
              ? "You can cancel your Pro subscription at any moment directly from your user panel in 'My Account'. No complicated forms or phone calls required."
              : "Puedes cancelar tu suscripción Pro en cualquier momento con un solo clic desde tu panel en 'Mi Cuenta', sin llamadas telefónicas ni formularios engorrosos."}
          </p>
          <p>
            {isEn
              ? "Cancellation immediately stops future automated renewal charges. You will continue to enjoy full Pro benefits until the very end of your current paid billing cycle. Once that cycle concludes, your account automatically reverts to the Free tier without further charges."
              : "La cancelación detiene de forma inmediata cualquier cobro futuro de renovación. Conservarás todos los beneficios Pro hasta que concluya el periodo ya pagado. Tras esa fecha, tu cuenta pasará automáticamente al plan gratuito sin cargos adicionales."}
          </p>
        </div>
      </section>

      {/* 3. Eligibility */}
      <section id={isEn ? "refund-eligibility" : "criterios-reembolso"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          {isEn ? "3. Refund Eligibility & Exception Criteria" : "3. Criterios de Elegibilidad de Reembolso"}
        </h2>
        <p>
          {isEn
            ? "We believe in treating users fairly. Full or partial refunds will be processed under the following verified conditions:"
            : "Creemos en un trato justo y transparente. Emitiremos reembolsos en los siguientes casos verificables:"}
        </p>
        <div className="grid gap-3 sm:grid-cols-3 pt-1">
          <div className="rounded-xl border border-border p-4 bg-card">
            <h4 className="font-semibold text-foreground text-xs">
              {isEn ? "• Duplicate Charges" : "• Cobros Duplicados"}
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              {isEn
                ? "If a network glitch caused two identical charges for the same subscription period, the extra payment is refunded immediately."
                : "Si por un error de conexión se procesaron dos cobros idénticos para el mismo ciclo, el cargo duplicado se reembolsa de inmediato."}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <h4 className="font-semibold text-foreground text-xs">
              {isEn ? "• Verified Technical Blocker" : "• Fallas Técnicas Críticas"}
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              {isEn
                ? "If a proven bug prevented you from generating or downloading your resumes and our technical team was unable to resolve it within 48 hours."
                : "Si un fallo técnico de nuestra plataforma te impidió generar o descargar tu CV y nuestro equipo no pudo resolverlo en 48 horas."}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <h4 className="font-semibold text-foreground text-xs">
              {isEn ? "• Unauthorized Transactions" : "• Transacciones No Autorizadas"}
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              {isEn
                ? "Promptly reported fraudulent card use (verified in coordination with Lemon Squeezy anti-fraud systems)."
                : "Uso indebido o fraudulento de tarjeta reportado de forma oportuna y validado con los sistemas antifraude de Lemon Squeezy."}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Ineligible */}
      <section id={isEn ? "ineligible-scenarios" : "casos-no-reembolsables"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <XCircle className="h-5 w-5 text-primary" />
          {isEn ? "4. Non-Refundable Scenarios" : "4. Supuestos No Reembolsables"}
        </h2>
        <p>
          {isEn
            ? "To prevent abuse of digital downloads and AI computing resources, refunds will NOT be issued for:"
            : "Para prevenir el abuso de descargas de documentos y consumo masivo de servidores de IA, no se otorgarán reembolsos en los siguientes supuestos:"}
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-xs text-muted-foreground">
          <li>
            {isEn
              ? "Forgetting to cancel an active auto-renewing subscription before the scheduled renewal date after using the service."
              : "Olvidar cancelar una suscripción activa con renovación automática antes de la fecha de corte, habiendo hecho uso previo del servicio."}
          </li>
          <li>
            {isEn
              ? "Failure to secure job interviews, job offers, or recruiter responses (as outlined in our Legal Disclaimer, hiring is outside CVAI's control)."
              : "Falta de llamadas a entrevistas o no haber sido contratado por una empresa (conforme a nuestro Aviso Legal, la contratación es ajena a CVAI)."}
          </li>
          <li>
            {isEn
              ? "Accounts suspended or terminated due to violations of our Terms of Service (e.g. fraudulent resumes or automated scraping)."
              : "Cuentas suspendidas por infringir los Términos de Servicio (creación de currículums falsos, spam o scraping)."}
          </li>
          <li>
            {isEn
              ? "Partial or prorated months on monthly subscriptions already underway."
              : "Periodos parciales o días no utilizados dentro del mes de facturación en curso."}
          </li>
        </ul>
      </section>

      {/* 5. Lemon Squeezy */}
      <section id={isEn ? "lemon-squeezy-role" : "rol-lemon-squeezy"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {isEn ? "5. Lemon Squeezy as Merchant of Record" : "5. Rol de Lemon Squeezy como Merchant of Record"}
        </h2>
        <p>
          {isEn
            ? "All financial transactions and approved refunds are executed through Lemon Squeezy, our authorized Merchant of Record. Approved refunds are credited directly back to the original payment method (credit card, debit card, or digital wallet) used during checkout."
            : "Todos los pagos y reembolsos aprobados son procesados a través de Lemon Squeezy en su carácter de Merchant of Record. Los reembolsos aprobados se acreditan automáticamente al mismo método de pago (tarjeta de crédito, débito o billetera digital) utilizado originalmente."}
        </p>
        <p className="text-xs text-muted-foreground">
          {isEn
            ? "Depending on your banking institution (e.g. BBVA, Santander, Banorte, Citibanamex), the credited amount typically reflects on your statement within 5 to 10 business days."
            : "Dependiendo de tu institución bancaria en México (BBVA, Santander, Banorte, Citibanamex, etc.), el saldo a favor suele reflejarse en tu estado de cuenta en un plazo de 5 a 10 días hábiles bancarios."}
        </p>
      </section>

      {/* 6. Chargebacks */}
      <section id={isEn ? "chargebacks-disputes" : "contracargos-disputas"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          {isEn ? "6. Chargebacks & Payment Disputes" : "6. Contracargos y Disputas Bancarias"}
        </h2>
        <p>
          {isEn
            ? "If you experience any billing discrepancy, we strongly encourage contacting CVAI support first. Opening an unjustified chargeback with your bank will trigger automated account suspension by our payment gateway while the investigation is underway."
            : "Si experimentas algún inconveniente con un cobro, te invitamos a contactar primero a nuestro equipo de soporte. Iniciar un contracargo bancario no justificado provoca el bloqueo automático de tu cuenta por parte de la pasarela de pagos mientras se realiza la aclaración formal."}
        </p>
      </section>

      {/* 7. How to Request */}
      <section id={isEn ? "how-to-request" : "como-solicitar"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          {isEn ? "7. How to Submit a Billing Inquiry" : "7. Cómo Solicitar Asistencia de Facturación"}
        </h2>
        <p>
          {isEn
            ? "To request a billing review or refund assessment, please send an email with your registered account email, Order ID, and a brief description of the issue to:"
            : "Para solicitar una revisión de cargo o aclaración, envía un correo con tu dirección registrada, tu ID de Orden (recibido por correo de Lemon Squeezy) y una breve descripción a:"}
        </p>
        <div className="rounded-xl border border-border p-4 bg-card text-xs space-y-1">
          <p><strong>{isEn ? "Billing Desk: " : "Atención de Facturación: "}</strong> <a href={`mailto:${cfg.supportEmail}`} className="text-primary hover:underline">{cfg.supportEmail}</a></p>
          <p><strong>{isEn ? "Response Time: " : "Tiempo de respuesta: "}</strong> {isEn ? "24 to 48 business hours" : "24 a 48 horas hábiles"}</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
