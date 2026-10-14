import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LegalPageLayout } from "@/components/legal-page-layout";
import { useSettings } from "@/lib/settings";
import { useCompanyLegalConfig } from "@/lib/legal-config";
import { supabase } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Mail, MessageSquare, Shield, CreditCard, Wrench, Building2,
  Clock, CheckCircle2, AlertCircle, Loader2, Send
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contáctanos | CVAI (Curriculum Vitae AI)" },
      {
        name: "description",
        content: "Ponte en contacto con el equipo de soporte técnico, facturación, privacidad y alianzas de CVAI. Atención personalizada en México.",
      },
      { property: "og:title", content: "Contacto | CVAI" },
      { property: "og:description", content: "Atención al cliente, soporte y consultas de CVAI." },
      { property: "og:url", content: "https://www.cvai.com.mx/contacto" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/contacto" }],
  }),
  component: ContactPageComponent,
});

function ContactPageComponent() {
  const { lang } = useSettings();
  const cfg = useCompanyLegalConfig();
  const isEn = lang === "en";

  const [department, setDepartment] = useState("support");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [orderId, setOrderId] = useState("");
  // Honeypot field for spam prevention
  const [hpCheck, setHpCheck] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Anti-spam honeypot detection
    if (hpCheck) {
      console.warn("Spam detected via honeypot");
      setSubmitted(true);
      return;
    }

    if (!name.trim()) {
      toast.error(isEn ? "Please enter your name." : "Por favor ingresa tu nombre.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error(isEn ? "Please enter a valid email address." : "Por favor ingresa un correo electrónico válido.");
      return;
    }
    if (!subject.trim()) {
      toast.error(isEn ? "Please specify a subject." : "Por favor escribe el asunto de tu mensaje.");
      return;
    }
    if (!message.trim() || message.length < 15) {
      toast.error(isEn ? "Please provide a more detailed message (min 15 characters)." : "Por favor escribe un mensaje más detallado (mínimo 15 caracteres).");
      return;
    }

    setLoading(true);

    try {
      const fullMessage = [
        `[Departamento: ${department}]`,
        orderId ? `[Order ID: ${orderId}]` : "",
        userId ? `[User ID: ${userId}]` : "",
        "",
        message.trim(),
      ].filter(Boolean).join("\n");

      const payload = {
        requester_name: name.trim(),
        requester_email: email.trim(),
        subject: `[${department.toUpperCase()}] ${subject.trim()}`,
        message: fullMessage,
        type: "contact",
        status: "pending",
        priority: department === "billing" ? "high" : "normal",
        user_id: userId.trim() || null,
      };

      const { error } = await supabase.from("support_tickets").insert(payload);

      if (error) {
        console.error("Error creating support ticket:", error);
        toast.error(isEn ? "Could not send message. Please try again or email us directly." : "No se pudo enviar el mensaje. Intenta de nuevo o escríbenos directamente.");
      } else {
        setSubmitted(true);
        toast.success(isEn ? "Your message has been sent successfully!" : "¡Tu mensaje ha sido enviado exitosamente!");
      }
    } catch (err) {
      console.error("Submission exception:", err);
      toast.error(isEn ? "An unexpected error occurred." : "Ocurrió un error inesperado al procesar tu solicitud.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LegalPageLayout
      title={isEn ? "Contact Us" : "Contáctanos"}
      subtitle={
        isEn
          ? "We are here to assist with technical questions, billing inquiries, privacy rights, and corporate partnerships."
          : "Estamos a tu disposición para resolver dudas técnicas, consultas de facturación, solicitudes de privacidad y alianzas comerciales."
      }
      badge={isEn ? "User Support & Inquiries" : "Atención al Usuario"}
    >
      <div className="space-y-10">
        
        {/* Department Info Cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-2xl border border-border p-4 bg-card space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Wrench className="h-4 w-4" />
              <h3 className="font-semibold text-sm text-foreground">
                {isEn ? "Technical & General Support" : "Soporte Técnico y General"}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn
                ? "Help with your resume editor, downloads, formatting, or account access."
                : "Asistencia para el editor de CV, exportación PDF, plantillas o acceso a tu cuenta."}
            </p>
            <a href={`mailto:${cfg.supportEmail}`} className="text-xs text-primary font-medium hover:underline block pt-1">
              {cfg.supportEmail}
            </a>
          </div>

          <div className="rounded-2xl border border-border p-4 bg-card space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <CreditCard className="h-4 w-4" />
              <h3 className="font-semibold text-sm text-foreground">
                {isEn ? "Billing & Subscriptions" : "Facturación y Pagos"}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn
                ? "Inquiries regarding Pro subscriptions, renewal status, Lemon Squeezy receipts, or cancellations."
                : "Dudas sobre planes Pro, renovación, comprobantes de Lemon Squeezy o cancelaciones."}
            </p>
            <a href={`mailto:${cfg.supportEmail}`} className="text-xs text-primary font-medium hover:underline block pt-1">
              {cfg.supportEmail}
            </a>
          </div>

          <div className="rounded-2xl border border-border p-4 bg-card space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Shield className="h-4 w-4" />
              <h3 className="font-semibold text-sm text-foreground">
                {isEn ? "Privacy & ARCO Rights" : "Privacidad y Derechos ARCO"}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn
                ? "Requests for personal data access, rectification, cancellation, or complete deletion under LFPDPPP."
                : "Solicitudes de acceso, rectificación, cancelación u oposición de datos personales."}
            </p>
            <a href={`mailto:${cfg.legalEmail}`} className="text-xs text-primary font-medium hover:underline block pt-1">
              {cfg.legalEmail}
            </a>
          </div>
        </div>

        {/* Expected Response Time Banner */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3 text-xs text-muted-foreground">
          <Clock className="h-5 w-5 text-primary shrink-0" />
          <div>
            <strong className="text-foreground">
              {isEn ? "Estimated Response Time: " : "Tiempo estimado de respuesta: "}
            </strong>
            {isEn
              ? "Our team typically responds within 24 to 48 business hours (Monday to Friday, Mexico City time)."
              : "Nuestro equipo responde normalmente en un plazo de 24 a 48 horas hábiles (de lunes a viernes, hora de la Ciudad de México)."}
          </div>
        </div>

        {/* Contact Form Container */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4 max-w-md mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-foreground">
                {isEn ? "Message Received!" : "¡Mensaje Enviado con Éxito!"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isEn
                  ? `Thank you for reaching out to CVAI. A support ticket has been created and our team will reply to ${email} as soon as possible.`
                  : `Gracias por comunicarte con CVAI. Se ha generado tu ticket de atención y nuestro equipo te responderá a ${email} a la brevedad posible.`}
              </p>
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setSubject("");
                    setMessage("");
                  }}
                >
                  {isEn ? "Send Another Message" : "Enviar otro mensaje"}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-lg font-bold font-display text-foreground">
                  {isEn ? "Submit an Official Inquiry" : "Envíanos tu consulta"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isEn
                    ? "Fill out the form below. Your ticket will be routed to the appropriate department."
                    : "Completa el formulario a continuación para canalizar tu solicitud al área correspondiente."}
                </p>
              </div>

              {/* Honeypot field (hidden from legitimate users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company_code">Do not fill this</label>
                <input
                  id="company_code"
                  type="text"
                  value={hpCheck}
                  onChange={(e) => setHpCheck(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Department selection */}
              <div className="space-y-2">
                <Label htmlFor="department">
                  {isEn ? "Department / Category *" : "Departamento / Categoría *"}
                </Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="department">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">
                      {isEn ? "General & Technical Support" : "Soporte Técnico y General"}
                    </SelectItem>
                    <SelectItem value="billing">
                      {isEn ? "Billing & Subscriptions (Lemon Squeezy)" : "Facturación y Suscripciones"}
                    </SelectItem>
                    <SelectItem value="privacy">
                      {isEn ? "Privacy & ARCO Rights (LFPDPPP)" : "Privacidad y Derechos ARCO"}
                    </SelectItem>
                    <SelectItem value="business">
                      {isEn ? "Business & Commercial Inquiries" : "Consultas Comerciales y Alianzas"}
                    </SelectItem>
                    <SelectItem value="feedback">
                      {isEn ? "Product Feedback & Suggestions" : "Sugerencias y Mejoras del Producto"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Name & Email Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{isEn ? "Full Name *" : "Nombre Completo *"}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isEn ? "e.g. Maria Gonzalez" : "Ej. María González"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{isEn ? "Email Address *" : "Correo Electrónico *"}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isEn ? "you@example.com" : "tu@correo.com"}
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">{isEn ? "Subject *" : "Asunto *"}</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    isEn
                      ? "Brief summary of your inquiry"
                      : "Resumen breve de tu duda o solicitud"
                  }
                  required
                />
              </div>

              {/* Optional identifiers */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orderId" className="text-xs text-muted-foreground">
                    {isEn ? "Order ID / Invoice (Optional)" : "ID de Orden / Factura (Opcional)"}
                  </Label>
                  <Input
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Ej. LS-92841"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-xs text-muted-foreground">
                    {isEn ? "Account Email / User ID (Optional)" : "Correo de Cuenta / User ID (Opcional)"}
                  </Label>
                  <Input
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Ej. mi-cuenta@correo.com"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">{isEn ? "Message *" : "Mensaje Detallado *"}</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isEn
                      ? "Please describe your question, issue, or request in detail..."
                      : "Describe con claridad tu duda, inconveniente o solicitud para atenderte con rapidez..."
                  }
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  {isEn
                    ? "Do not include passwords or sensitive financial information in this form."
                    : "No incluyas contraseñas ni datos bancarios confidenciales en este mensaje."}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {isEn
                    ? "Protected by privacy policy and anti-spam controls."
                    : "Tus datos están protegidos conforme a nuestro Aviso de Privacidad."}
                </p>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{isEn ? "Sending..." : "Enviando..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>{isEn ? "Submit Message" : "Enviar Mensaje"}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </LegalPageLayout>
  );
}