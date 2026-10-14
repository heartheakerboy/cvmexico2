import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  LifeBuoy, HelpCircle, PlayCircle, Mail, MessageCircle,
  MessageSquare, Lightbulb, Loader2, Send,
} from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/db/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/panel/ayuda")({
  component: AyudaPage,
});

const faqsEs = [
  { q: "¿Cómo creo mi primer currículum?", a: "Ve a “Mis currículums”, elige una plantilla y completa tus datos. Puedes usar la IA para redactar cada sección." },
  { q: "¿Los CV están optimizados para ATS?", a: "Sí, todas nuestras plantillas están diseñadas para pasar los filtros de los sistemas de seguimiento de candidatos (ATS)." },
  { q: "¿Puedo exportar en PDF y Word?", a: "Sí. Desde el editor puedes descargar en PDF o DOCX, y encontrarás todos tus archivos en el Centro de descargas." },
  { q: "¿Cómo cambio mi plan?", a: "Entra a “Suscripción y facturación” para mejorar, cambiar o cancelar tu plan en cualquier momento." },
  { q: "¿Mis datos están seguros?", a: "Tu información está protegida y solo tú puedes acceder a ella. Puedes ajustar la privacidad en Ajustes." },
];
const faqsEn = [
  { q: "How do I create my first resume?", a: "Go to “My resumes”, pick a template and fill in your data. You can use AI to write each section." },
  { q: "Are the resumes ATS-optimized?", a: "Yes, all our templates are designed to pass applicant tracking systems (ATS)." },
  { q: "Can I export to PDF and Word?", a: "Yes. From the editor you can download PDF or DOCX, and find all files in the Download Center." },
  { q: "How do I change my plan?", a: "Open “Subscription & billing” to upgrade, switch or cancel your plan anytime." },
  { q: "Is my data safe?", a: "Your information is protected and only you can access it. Adjust privacy in Settings." },
];
const videosEs = [
  { t: "Crea tu CV en 5 minutos", d: "Guía rápida de inicio" },
  { t: "Optimiza tu CV para ATS", d: "Consejos de palabras clave" },
  { t: "Escribe con IA", d: "Redacta secciones automáticamente" },
  { t: "Prepárate para la entrevista", d: "Simulador y retroalimentación" },
];
const videosEn = [
  { t: "Build your resume in 5 minutes", d: "Quick start guide" },
  { t: "Optimize your resume for ATS", d: "Keyword tips" },
  { t: "Write with AI", d: "Auto-draft sections" },
  { t: "Prepare for your interview", d: "Simulator and feedback" },
];

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-5">{children}</div>;
}

function AyudaPage() {
  const { lang } = useSettings();
  const es = lang === "es";
  const faqs = es ? faqsEs : faqsEn;
  const videos = es ? videosEs : videosEn;

  const [form, setForm] = useState({ subject: "", message: "", priority: "medium" });
  const [feedback, setFeedback] = useState("");
  const [feature, setFeature] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(kind: "support" | "feedback" | "feature") {
    const value = kind === "support" ? form.message : kind === "feedback" ? feedback : feature;
    if (!value.trim()) {
      toast.error(es ? "Escribe un mensaje" : "Write a message");
      return;
    }
    setSending(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;

      let name = "Anónimo";
      let email = "";
      if (user) {
        email = user.email || "";
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();
        if (profile?.full_name) name = profile.full_name;
      }

      const subjectText = kind === "support"
        ? (form.subject.trim() || (es ? "Solicitud de Soporte" : "Support Request"))
        : kind === "feedback"
          ? (es ? "Comentario de Usuario" : "User Feedback")
          : (es ? "Solicitud de Función" : "Feature Request");

      const { error } = await supabase.from("support_tickets").insert({
        subject: subjectText,
        message: value.trim(),
        type: kind === "support" ? "ticket" : kind,
        status: "open",
        priority: kind === "support" ? form.priority : "medium",
        requester_name: name,
        requester_email: email,
        user_id: user?.id || null,
      });

      if (error) throw error;

      if (kind === "support") setForm({ subject: "", message: "", priority: "medium" });
      if (kind === "feedback") setFeedback("");
      if (kind === "feature") setFeature("");
      toast.success(es ? "¡Enviado! Te responderemos pronto." : "Sent! We'll get back to you soon.");
    } catch (err: any) {
      console.error("Submit ticket error:", err);
      toast.error(es ? "Error al enviar. Inténtalo de nuevo." : "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-16">
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LifeBuoy className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold">{es ? "Centro de ayuda" : "Help Center"}</h1>
          <p className="text-sm text-muted-foreground">{es ? "Estamos aquí para apoyarte." : "We're here to support you."}</p>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <a href="#faq" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent">
          <HelpCircle className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">{es ? "Preguntas frecuentes" : "FAQ"}</span>
        </a>
        <a href="#videos" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent">
          <PlayCircle className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">{es ? "Tutoriales en video" : "Video tutorials"}</span>
        </a>
        <a href="#contacto" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent">
          <Mail className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">{es ? "Contactar soporte" : "Contact support"}</span>
        </a>
      </div>

      <div id="faq" className="scroll-mt-6">
        <Card>
          <div className="mb-2 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            <h2 className="font-display text-base font-semibold">{es ? "Preguntas frecuentes" : "Frequently asked questions"}</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>

      <div id="videos" className="scroll-mt-6">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <PlayCircle className="h-4 w-4 text-primary" />
            <h2 className="font-display text-base font-semibold">{es ? "Tutoriales en video" : "Video tutorials"}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {videos.map((v, i) => (
              <div key={i} className="group cursor-pointer overflow-hidden rounded-xl border border-border">
                <div className="flex aspect-video items-center justify-center bg-primary/5">
                  <PlayCircle className="h-10 w-10 text-primary/70 transition-transform group-hover:scale-110" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium">{v.t}</p>
                  <p className="text-xs text-muted-foreground">{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div id="contacto" className="scroll-mt-6">
        <Card>
          <Tabs defaultValue="support">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="support" className="gap-1.5"><Mail className="h-3.5 w-3.5" />{es ? "Soporte" : "Support"}</TabsTrigger>
              <TabsTrigger value="feedback" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" />{es ? "Comentarios" : "Feedback"}</TabsTrigger>
              <TabsTrigger value="feature" className="gap-1.5"><Lightbulb className="h-3.5 w-3.5" />{es ? "Función" : "Feature"}</TabsTrigger>
            </TabsList>

            <TabsContent value="support" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">{es ? "Asunto" : "Subject"}</Label>
                  <Input value={form.subject} onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))} placeholder={es ? "¿En qué te ayudamos?" : "How can we help?"} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{es ? "Prioridad" : "Priority"}</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm((s) => ({ ...s, priority: v }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{es ? "Baja" : "Low"}</SelectItem>
                      <SelectItem value="medium">{es ? "Media" : "Medium"}</SelectItem>
                      <SelectItem value="high">{es ? "Alta" : "High"}</SelectItem>
                      <SelectItem value="urgent">{es ? "Urgente" : "Urgent"}</SelectItem>
                      <SelectItem value="emergency">{es ? "Emergencia" : "Emergency"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{es ? "Mensaje" : "Message"}</Label>
                <Textarea rows={4} value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} placeholder={es ? "Describe tu problema..." : "Describe your issue..."} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => submit("support")} disabled={sending}>
                  {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {es ? "Enviar" : "Send"}
                </Button>
                <Button variant="outline" onClick={() => toast(es ? "El chat en vivo estará disponible pronto." : "Live chat coming soon.")}>
                  <MessageCircle className="mr-2 h-4 w-4" />{es ? "Chat en vivo" : "Live chat"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{es ? "Tus comentarios" : "Your feedback"}</Label>
                <Textarea rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder={es ? "Cuéntanos qué te parece..." : "Tell us what you think..."} />
              </div>
              <Button onClick={() => submit("feedback")} disabled={sending}>
                {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {es ? "Enviar comentarios" : "Send feedback"}
              </Button>
            </TabsContent>

            <TabsContent value="feature" className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{es ? "¿Qué función te gustaría?" : "What feature would you like?"}</Label>
                <Textarea rows={4} value={feature} onChange={(e) => setFeature(e.target.value)} placeholder={es ? "Describe la función que necesitas..." : "Describe the feature you need..."} />
              </div>
              <Button onClick={() => submit("feature")} disabled={sending}>
                {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                {es ? "Solicitar función" : "Request feature"}
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
