import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, type TocSection } from "@/components/legal-page-layout";
import { useSettings } from "@/lib/settings";
import { useCompanyLegalConfig } from "@/lib/legal-config";
import { Cookie, ShieldCheck, Settings2, Sliders, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Política de Cookies y Almacenamiento Local | CVAI" },
      {
        name: "description",
        content: "Conoce qué cookies y tecnologías de almacenamiento utiliza CVAI (Curriculum Vitae AI) para garantizar la seguridad de tu sesión y recordar tus preferencias.",
      },
      { property: "og:title", content: "Política de Cookies | CVAI" },
      { property: "og:description", content: "Uso transparente de cookies y privacidad en CVAI." },
      { property: "og:url", content: "https://www.cvai.com.mx/cookies" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/cookies" }],
  }),
  component: CookiesPageComponent,
});

function CookiesPageComponent() {
  const { lang } = useSettings();
  const cfg = useCompanyLegalConfig();
  const isEn = lang === "en";

  const sections: TocSection[] = isEn
    ? [
        { id: "what-are-cookies", title: "1. What are Cookies & Local Storage?" },
        { id: "cookies-we-use", title: "2. Types of Cookies We Use" },
        { id: "no-ad-tracking", title: "3. No Advertising Trackers Notice" },
        { id: "third-party-services", title: "4. Third-Party Technical Providers" },
        { id: "manage-cookies", title: "5. How to Manage or Disable Cookies" },
        { id: "updates-contact", title: "6. Updates & Contact" },
      ]
    : [
        { id: "que-son-cookies", title: "1. ¿Qué son las cookies y el almacenamiento local?" },
        { id: "cookies-que-usamos", title: "2. Categorías de cookies que utilizamos" },
        { id: "sin-rastreo-publicitario", title: "3. Ausencia total de rastreadores publicitarios" },
        { id: "proveedores-tecnicos", title: "4. Proveedores técnicos de terceros" },
        { id: "gestion-navegador", title: "5. Cómo configurar o desactivar cookies" },
        { id: "actualizaciones-contacto", title: "6. Actualizaciones y contacto" },
      ];

  return (
    <LegalPageLayout
      title={isEn ? "Cookie & Local Storage Policy" : "Política de Cookies y Almacenamiento"}
      subtitle={
        isEn
          ? "How CVAI utilizes essential cookies and local storage solely to provide secure authentication and preserve your preferences."
          : "Conoce cómo CVAI utiliza cookies técnicas y almacenamiento local exclusivamente para mantener tu sesión segura y recordar tus preferencias."
      }
      badge={isEn ? "Cookie Transparency" : "Transparencia Tecnológica"}
      lastUpdated={cfg.cookieUpdated}
      sections={sections}
    >
      {/* 1. What are Cookies */}
      <section id={isEn ? "what-are-cookies" : "que-son-cookies"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Cookie className="h-5 w-5 text-primary" />
          {isEn ? "1. What are Cookies and Local Storage?" : "1. ¿Qué son las Cookies y el Almacenamiento Local?"}
        </h2>
        <p>
          {isEn ? (
            <>
              Cookies and local storage are small text files and key-value pairs stored in your web browser by websites you visit. They allow web applications to recognize your browser, maintain active sessions between page clicks, and remember your interface settings (such as dark mode or Spanish language selection).
            </>
          ) : (
            <>
              Las cookies y las variables de almacenamiento local (Local Storage) son pequeños fragmentos de información que los sitios web guardan en tu navegador. Permiten que la plataforma reconozca tu sesión activa, recuerde tus preferencias de visualización (como el modo oscuro o el idioma español) y brinde una experiencia fluida sin solicitar tus credenciales en cada clic.
            </>
          )}
        </p>
      </section>

      {/* 2. Categories */}
      <section id={isEn ? "cookies-we-use" : "cookies-que-usamos"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          {isEn ? "2. Categories of Cookies Used by CVAI" : "2. Categorías de Cookies que Utilizamos en CVAI"}
        </h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-border p-4 bg-card">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>{isEn ? "Strictly Necessary / Authentication Cookies" : "Cookies Estrictamente Necesarias y de Autenticación"}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {isEn
                ? "Essential for site security and account navigation. Managed by Supabase Auth (e.g. sb-auth-token). They maintain your authenticated state so you can securely edit and download your personal resumes. These cannot be switched off without breaking core functionality."
                : "Fundamentales para la seguridad y navegación de tu cuenta. Gestionadas por Supabase Auth (como sb-auth-token). Mantienen tu sesión iniciada para que puedas editar y descargar tus currículums de forma privada y protegida."}
            </p>
          </div>

          <div className="rounded-xl border border-border p-4 bg-card">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>{isEn ? "Preference & Customization Tokens (Local Storage)" : "Variables de Preferencia y Personalización (Local Storage)"}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {isEn
                ? "Technical values such as 'app.lang' (storing your language choice: Spanish or English) and 'app.theme' (storing your preference for Light or Dark mode). They avoid having to re-select your preferred theme upon every visit."
                : "Valores almacenados en tu navegador como 'app.lang' (tu selección de idioma: Español o Inglés) y 'app.theme' (tu preferencia de Modo Claro u Oscuro), permitiendo que la interfaz se muestre de inmediato según tu gusto."}
            </p>
          </div>

          <div className="rounded-xl border border-border p-4 bg-card">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>{isEn ? "Payment Processing Session Tokens" : "Cookies de Sesión para Pasarela de Pago (Lemon Squeezy)"}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {isEn
                ? "When you initiate a checkout to upgrade to a Pro subscription, Lemon Squeezy utilizes secure session cookies to validate anti-fraud tokens and process your order securely."
                : "Al iniciar el proceso de contratación de un plan Pro, la ventana segura de Lemon Squeezy genera tokens temporales para prevenir fraude bancario y procesar el cobro con la debida seguridad."}
            </p>
          </div>
        </div>
      </section>

      {/* 3. No Ad Tracking */}
      <section id={isEn ? "no-ad-tracking" : "sin-rastreo-publicitario"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {isEn ? "3. Clear Disclosure: No Third-Party Advertising Trackers" : "3. Declaración Expresa: Sin Rastreadores de Publicidad"}
        </h2>
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs">
          <p className="font-semibold text-foreground">
            {isEn ? "Your Privacy is Not a Commodity:" : "Tu Privacidad no es una Mercancía:"}
          </p>
          <p>
            {isEn
              ? "CVAI does NOT utilize third-party advertising cookies, retargeting pixels (such as Facebook Pixel or cross-site ad networks), nor data broker trackers. We do not profile your resume information to sell targeted advertisements."
              : "CVAI NO utiliza cookies de publicidad comportamental de terceros, píxeles de retargeting intrusivos ni redes de comercialización de datos. No rastreamos tu actividad en otros sitios web ni vendemos perfiles de candidatos a agencias de marketing."}
          </p>
        </div>
      </section>

      {/* 4. Third-Party Technical Providers */}
      <section id={isEn ? "third-party-services" : "proveedores-tecnicos"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Sliders className="h-5 w-5 text-primary" />
          {isEn ? "4. Third-Party Technical Infrastructure" : "4. Proveedores Técnicos de Terceros"}
        </h2>
        <p>
          {isEn
            ? "The only third-party entities that may set technical session identifiers in connection with CVAI are our verified infrastructure partners:"
            : "Los únicos proveedores externos que pueden generar identificadores de sesión técnicos al interactuar con CVAI son nuestros socios de infraestructura:"}
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-xs text-muted-foreground">
          <li><strong>Supabase:</strong> {isEn ? "For authentication and user session verification." : "Autenticación segura y validación de sesiones activas."}</li>
          <li><strong>Lemon Squeezy:</strong> {isEn ? "Merchant of record for secure payment checkouts." : "Comerciante registrado para procesamiento seguro de pagos."}</li>
          <li><strong>Cloudflare:</strong> {isEn ? "Content delivery, DDoS mitigation, and SSL/TLS protection." : "Entrega de contenido estático, mitigación de ataques DDoS y certificados TLS."}</li>
        </ul>
      </section>

      {/* 5. Browser Management */}
      <section id={isEn ? "manage-cookies" : "gestion-navegador"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Sliders className="h-5 w-5 text-primary" />
          {isEn ? "5. How to Configure or Disable Cookies" : "5. Cómo Configurar o Desactivar Cookies en tu Navegador"}
        </h2>
        <p>
          {isEn
            ? "You can instruct your web browser to delete existing cookies or refuse new ones. Consult your browser's official support documentation:"
            : "Puedes configurar tu navegador web en cualquier momento para bloquear o eliminar cookies. Consulta las instrucciones oficiales de tu navegador:"}
        </p>
        <div className="grid gap-2 sm:grid-cols-2 text-xs">
          <div className="border border-border rounded-lg p-2.5 bg-card">
            <strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies de terceros
          </div>
          <div className="border border-border rounded-lg p-2.5 bg-card">
            <strong>Mozilla Firefox:</strong> Ajustes &gt; Privacidad y Seguridad &gt; Cookies y datos del sitio
          </div>
          <div className="border border-border rounded-lg p-2.5 bg-card">
            <strong>Apple Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear todas las cookies
          </div>
          <div className="border border-border rounded-lg p-2.5 bg-card">
            <strong>Microsoft Edge:</strong> Configuración &gt; Permisos de sitios &gt; Cookies y datos
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {isEn
            ? "Note: If you disable essential authentication cookies, you will be unable to log in, edit resumes, or access your saved CVs."
            : "Aviso técnico: Si bloqueas las cookies técnicas de autenticación, no podrás iniciar sesión en tu cuenta ni acceder a tus currículums guardados."}
        </p>
      </section>

      {/* 6. Contact */}
      <section id={isEn ? "updates-contact" : "actualizaciones-contacto"} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {isEn ? "6. Policy Updates & Privacy Contact" : "6. Actualizaciones de la Política y Contacto"}
        </h2>
        <p>
          {isEn
            ? `If you have technical questions regarding our cookie implementation, please contact our team at ${cfg.supportEmail}.`
            : `Si tienes dudas sobre nuestras medidas técnicas de cookies y almacenamiento, escríbenos a ${cfg.supportEmail}.`}
        </p>
      </section>
    </LegalPageLayout>
  );
}
