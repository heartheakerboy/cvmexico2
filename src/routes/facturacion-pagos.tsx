import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageLayout, type TocSection } from "@/components/legal-page-layout";
import { useSettings } from "@/lib/settings";
import { useCompanyLegalConfig } from "@/lib/legal-config";
import { CreditCard, CheckCircle2, ShieldCheck, RefreshCw, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/facturacion-pagos")({
  head: () => ({
    meta: [
      { title: "Transparencia en Pagos y Facturación | CVAI" },
      {
        name: "description",
        content: "Conoce con total claridad cómo funcionan las suscripciones, cobros, cancelaciones y facturación en CVAI a través de Lemon Squeezy (Merchant of Record).",
      },
      { property: "og:title", content: "Facturación y Pagos | CVAI" },
      { property: "og:description", content: "Transparencia financiera y planes de suscripción en CVAI." },
      { property: "og:url", content: "https://www.cvai.com.mx/facturacion-pagos" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/facturacion-pagos" }],
  }),
  component: BillingPaymentsPageComponent,
});

function BillingPaymentsPageComponent() {
  const { lang } = useSettings();
  const cfg = useCompanyLegalConfig();
  const isEn = lang === "en";

  const sections: TocSection[] = isEn
    ? [
        { id: "plans-pricing-overview", title: "1. Free vs. Pro Plans Overview" },
        { id: "lemon-squeezy-mor", title: "2. Payment Processing via Lemon Squeezy" },
        { id: "card-security", title: "3. Card Security & Zero Card Data Stored" },
        { id: "billing-cycles-renewal", title: "4. Billing Cycles & Automatic Renewal" },
        { id: "easy-cancellation", title: "5. Effortless Cancellation Process" },
        { id: "receipts-invoices", title: "6. Receipts & Tax Invoices" },
        { id: "billing-support", title: "7. Billing Support Desk" },
      ]
    : [
        { id: "resumen-planes", title: "1. Comparativa de Plan Gratuito vs. Pro" },
        { id: "lemon-squeezy-mor", title: "2. Procesamiento de pagos vía Lemon Squeezy" },
        { id: "seguridad-bancaria", title: "3. Seguridad bancaria y no retención de tarjetas" },
        { id: "ciclos-renovacion", title: "4. Ciclos de facturación y renovación automática" },
        { id: "cancelacion-sencilla", title: "5. Proceso de cancelación sin fricción" },
        { id: "recibos-facturas", title: "6. Comprobantes fiscales y recibos" },
        { id: "atencion-facturacion", title: "7. Atención al cliente para pagos" },
      ];

  return (
    <LegalPageLayout
      title={isEn ? "Billing & Payment Transparency" : "Transparencia en Pagos y Facturación"}
      subtitle={
        isEn
          ? "Complete transparency on how subscriptions, renewals, cancellations, and payment processing work on CVAI."
          : "Información clara sobre cómo se procesan las suscripciones, cancelaciones, renovaciones y pagos en CVAI."
      }
      badge={isEn ? "Payment Integrity" : "Seguridad y Pagos"}
      lastUpdated={cfg.billingUpdated}
      sections={sections}
    >
      {/* 1. Plans */}
      <section id={isEn ? "plans-pricing-overview" : "resumen-planes"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          {isEn ? "1. Free vs. Pro Plan Comparison" : "1. Comparativa de Plan Gratuito vs. Plan Pro"}
        </h2>
        <p>
          {isEn ? (
            <>
              At <strong>CVAI</strong> ({cfg.companyName}), we believe every job seeker deserves access to professional resume formatting. We offer a transparent Free plan alongside optional Pro subscriptions for applicants who want unlimited AI generation and watermark-free exports:
            </>
          ) : (
            <>
              En <strong>CVAI</strong> ({cfg.companyName}), creemos que cualquier persona debe tener acceso a herramientas de calidad para armar su CV. Por ello, ofrecemos un plan Gratuito funcional junto a suscripciones Pro para quienes buscan IA ilimitada y descargas sin marca de agua:
            </>
          )}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <div className="rounded-2xl border border-border p-5 bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-muted-foreground" />
              {isEn ? "Free Plan ($0 MXN)" : "Plan Gratuito ($0 MXN)"}
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {isEn ? "Access to standard resume templates" : "Acceso a plantillas curriculares básicas"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {isEn ? "Interactive real-time editor" : "Editor visual en tiempo real"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {isEn ? "Basic ATS checklist check" : "Verificador ATS con recomendaciones básicas"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {isEn ? "PDF export with CVAI footer mark" : "Descarga PDF con marca de agua discreta"}
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/30 p-5 bg-primary/5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {isEn ? "Pro Plan (Monthly / Annual)" : "Plan Pro (Mensual o Anual)"}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">Pro</span>
            </div>
            <ul className="space-y-2 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {isEn ? "Unlimited AI generation (summaries, bullets, letters)" : "IA sin límites prácticos (resúmenes, viñetas, cartas)"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {isEn ? "All premium & executive templates unlocked" : "Todas las plantillas ejecutivas y modernas desbloqueadas"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {isEn ? "Watermark-free PDF + editable DOCX export" : "Descargas en PDF sin marca de agua + exportación DOCX"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {isEn ? "Full ATS keyword optimizer & version history" : "Optimizador ATS de palabras clave e historial de versiones"}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Lemon Squeezy */}
      <section id={isEn ? "lemon-squeezy-mor" : "lemon-squeezy-mor"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {isEn ? "2. Payment Processing via Lemon Squeezy (Merchant of Record)" : "2. Procesamiento de Pagos vía Lemon Squeezy (Merchant of Record)"}
        </h2>
        <p>
          {isEn
            ? "To ensure absolute financial security and global regulatory compliance, CVAI partners with Lemon Squeezy as our Merchant of Record. This means:"
            : "Para asegurar los más altos estándares de seguridad bancaria y cumplimiento fiscal, CVAI opera a través de Lemon Squeezy en su carácter de Merchant of Record. Esto garantiza:"}
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-xs text-muted-foreground">
          <li>
            {isEn
              ? "All checkout pages and payment forms are served directly by Lemon Squeezy's PCI-DSS Level 1 compliant infrastructure."
              : "Las pantallas de pago y cobro son provistas directamente por la infraestructura certificada PCI-DSS Nivel 1 de Lemon Squeezy."}
          </li>
          <li>
            {isEn
              ? "Lemon Squeezy automatically calculates, collects, and remits local sales taxes (such as Mexican IVA) in accordance with tax regulations."
              : "Lemon Squeezy calcula y desglosa los impuestos correspondientes (incluyendo el IVA mexicano) conforme a la legislación fiscal vigente."}
          </li>
        </ul>
      </section>

      {/* 3. Card Security */}
      <section id={isEn ? "card-security" : "seguridad-bancaria"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {isEn ? "3. Card Security: Zero Credit Card Data Stored" : "3. Seguridad Bancaria: Cero Almacenamiento de Tarjetas"}
        </h2>
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs space-y-2">
          <p className="font-semibold text-foreground">
            {isEn ? "Absolute Financial Privacy:" : "Garantía de Seguridad Financiera:"}
          </p>
          <p>
            {isEn
              ? "CVAI servers NEVER touch, see, or store your credit or debit card numbers, expiration dates, or CVV security codes. All sensitive payment details go directly from your browser to Lemon Squeezy's encrypted payment vaults."
              : "Los servidores de CVAI NUNCA reciben, ven ni almacenan los números completos de tu tarjeta de crédito o débito, fecha de vencimiento ni código CVV. Toda la información bancaria viaja cifrada directamente a las bóvedas seguras de Lemon Squeezy."}
          </p>
        </div>
      </section>

      {/* 4. Billing Cycles */}
      <section id={isEn ? "billing-cycles-renewal" : "ciclos-renovacion"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          {isEn ? "4. Billing Cycles & Automatic Renewal" : "4. Ciclos de Facturación y Renovación Automática"}
        </h2>
        <p>
          {isEn
            ? "When subscribing to a Pro plan, you choose between a monthly or annual billing interval. Your subscription renews automatically on the scheduled recurring date using your designated payment method to prevent sudden interruption of service during your job search."
            : "Al contratar un plan Pro, seleccionas un periodo de facturación mensual o anual. La suscripción se renueva automáticamente en cada fecha de corte utilizando el método de pago registrado, asegurando que tus descargas y documentos permanezcan accesibles durante tu búsqueda de empleo."}
        </p>
      </section>

      {/* 5. Cancellation */}
      <section id={isEn ? "easy-cancellation" : "cancelacion-sencilla"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          {isEn ? "5. Effortless Cancellation Anytime" : "5. Cancelación Sencilla y sin Fricción"}
        </h2>
        <p>
          {isEn
            ? "You are always in control. You can cancel your subscription at any time with a single click from 'My Account' in your user dashboard. Cancellation immediately halts future charges while preserving your Pro access until your current paid cycle ends."
            : "Tú tienes el control total en todo momento. Puedes cancelar tu suscripción con un solo clic desde la sección 'Mi Cuenta'. La cancelación previene de inmediato cualquier cobro posterior y te permite disfrutar de las ventajas Pro hasta que concluya el ciclo ya pagado."}
        </p>
      </section>

      {/* 6. Receipts */}
      <section id={isEn ? "receipts-invoices" : "recibos-facturas"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {isEn ? "6. Receipts and Tax Invoices" : "6. Comprobantes de Pago y Facturación"}
        </h2>
        <p>
          {isEn
            ? "Upon successful completion of any transaction, Lemon Squeezy delivers an itemized digital receipt directly to your email address, including order ID, date, billing interval, and tax breakdown."
            : "Al concretarse cualquier pago, Lemon Squeezy envía de manera automática a tu correo electrónico un recibo digital detallado con el número de orden, fecha, desglose de impuestos e importe cubierto."}
        </p>
      </section>

      {/* 7. Support */}
      <section id={isEn ? "billing-support" : "atencion-facturacion"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          {isEn ? "7. Billing Support Desk" : "7. Mesa de Ayuda para Facturación y Pagos"}
        </h2>
        <p>
          {isEn
            ? `If you have any questions regarding your subscription, charges, or receipts, please contact our billing desk at ${cfg.supportEmail}.`
            : `Si tienes cualquier duda respecto a un cobro, recibo o estado de tu suscripción, comunícate directamente con nuestro equipo de atención a pagos en ${cfg.supportEmail}.`}
        </p>
        <div className="pt-4 flex items-center gap-3">
          <Link to="/precios">
            <Button className="gap-2">
              <span>{isEn ? "View Pricing & Plans" : "Ver Planes y Precios"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/reembolso">
            <Button variant="outline">
              {isEn ? "Read Refund Policy" : "Consultar Política de Reembolso"}
            </Button>
          </Link>
        </div>
      </section>
    </LegalPageLayout>
  );
}
