import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, MessagesSquare, Sparkles, Target } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

const TITLE = "Simulador de Entrevista de Trabajo con IA Gratis | CVAI";
const DESC =
  "Practica tu entrevista de trabajo con IA: preguntas reales por puesto y categoría (RR. HH., técnica, conductual STAR), retroalimentación de tus respuestas y simulacros completos. Gratis en México.";

export const Route = createFileRoute("/simulador-entrevista")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.cvai.com.mx/simulador-entrevista" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/simulador-entrevista" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: SimuladorPage,
});

const FAQS = [
  {
    q: "¿Cómo funciona el simulador de entrevistas de CVAI?",
    a: "Escribes el puesto al que aspiras y eliges una categoría: preguntas del rol, de Recursos Humanos, técnicas o conductuales. La IA genera preguntas realistas del mercado mexicano, tú respondes por escrito y recibes retroalimentación con sugerencias de mejora, incluyendo el método STAR para preguntas conductuales.",
  },
  {
    q: "¿El simulador es gratis?",
    a: "Sí. Con tu cuenta gratuita de CVAI puedes practicar entrevistas, crear un currículum y usar el verificador ATS. El plan Pro amplía los límites de uso de las herramientas de IA.",
  },
  {
    q: "¿Qué es el método STAR en una entrevista?",
    a: "Es una forma de responder preguntas conductuales contando una Situación, la Tarea que tenías, la Acción que tomaste y el Resultado obtenido. Los reclutadores lo usan para evaluar experiencias reales; el simulador te ayuda a practicarlo.",
  },
  {
    q: "¿Sirve para cualquier puesto?",
    a: "Sí. Las preguntas se generan según el puesto y nivel que indiques: desde primer empleo y prácticas hasta puestos gerenciales, en español de México o en inglés si tu entrevista será en ese idioma.",
  },
];

const CATEGORIES = [
  {
    icon: Briefcase,
    title: "Preguntas del rol",
    desc: "Específicas de tu puesto: experiencia, herramientas y cómo resolverías situaciones reales del trabajo.",
  },
  {
    icon: MessagesSquare,
    title: "Recursos Humanos",
    desc: "Las clásicas de RR. HH.: fortalezas, debilidades, por qué quieres el puesto y expectativas salariales.",
  },
  {
    icon: Target,
    title: "Técnicas",
    desc: "Conocimientos de tu área puestos a prueba, como los haría el líder técnico o tu futuro jefe directo.",
  },
  {
    icon: Sparkles,
    title: "Conductuales (STAR)",
    desc: "Preguntas de comportamiento pasado con retroalimentación para estructurar respuestas con el método STAR.",
  },
];

const EXAMPLE_QUESTIONS = [
  "Háblame de ti y de tu experiencia relacionada con este puesto.",
  "¿Por qué quieres trabajar en nuestra empresa?",
  "Cuéntame de una ocasión en la que resolviste un problema difícil en el trabajo.",
  "¿Cuál es tu mayor debilidad y cómo estás trabajando en ella?",
  "¿Dónde te ves en cinco años?",
  "¿Por qué deberíamos contratarte a ti y no a otro candidato?",
];

function SimuladorPage() {
  return (
    <PageShell
      title="Simulador de entrevistas con IA"
      subtitle="Practica antes de la entrevista real: preguntas por puesto, retroalimentación inmediata de tus respuestas y simulacros completos, en español de México."
    >
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
        <h2 className="text-xl font-bold">La entrevista se gana practicando</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          La mayoría de los candidatos improvisa. Con el simulador llegas con respuestas pensadas,
          ejemplos listos y la confianza de haber practicado las preguntas difíciles, incluyendo la
          de expectativas salariales.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/auth">
            <Button>Empezar a practicar gratis</Button>
          </Link>
          <Link to="/plantillas">
            <Button variant="outline">Primero crear mi CV</Button>
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Cuenta gratuita, sin tarjeta. El simulador está en tu panel, en la sección «Entrevistas».
        </p>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Cuatro tipos de práctica</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {CATEGORIES.map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-bold">Preguntas que vas a practicar</h2>
        <p className="mt-3 text-muted-foreground">
          Estas son solo el comienzo: el simulador genera preguntas a la medida de tu puesto y tu
          nivel de experiencia.
        </p>
        <ul className="mt-5 space-y-2.5">
          {EXAMPLE_QUESTIONS.map((q) => (
            <li
              key={q}
              className="rounded-xl border border-border bg-card px-4 py-3 text-[15px]"
            >
              “{q}”
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 max-w-3xl space-y-5 text-[15px] leading-relaxed text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">Cómo aprovechar tu práctica</h2>
        <p>
          <strong className="text-foreground">1. Prepara tu CV primero.</strong> Muchas preguntas
          salen directamente de tu currículum: si afirmas una habilidad, te preguntarán por ella.
        </p>
        <p>
          <strong className="text-foreground">2. Responde en voz alta.</strong> Aunque practiques
          por escrito, decir tus respuestas en voz alta revela muletillas y respuestas demasiado
          largas. Busca respuestas de uno a dos minutos.
        </p>
        <p>
          <strong className="text-foreground">3. Ten lista la pregunta salarial.</strong> Investiga
          el rango del puesto y calcula tu neto con nuestra calculadora de sueldo: negociar sin
          números es negociar a ciegas.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link to="/calculadora-sueldo-neto">
            <Button variant="outline" size="sm">
              Calculadora de sueldo neto
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="sm">Practicar ahora</Button>
          </Link>
        </div>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-bold">Preguntas frecuentes</h2>
        <div className="mt-5 space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
