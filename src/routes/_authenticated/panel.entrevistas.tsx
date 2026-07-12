import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  MessagesSquare,
  Loader2,
  Wand2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { toast } from "sonner";
import { generateQuestions, evaluateAnswer } from "@/lib/entrevistas.functions";
import { generateMockInterview } from "@/lib/entrevistas.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/_authenticated/panel/entrevistas")({
  component: EntrevistasPage,
});

type Category = "rol" | "rrhh" | "tecnica" | "conductual";

const categories: { key: Category; labelKey: string; descKey: string }[] = [
  { key: "rol", labelKey: "interview.category.rol.label", descKey: "interview.category.rol.desc" },
  { key: "rrhh", labelKey: "interview.category.rrhh.label", descKey: "interview.category.rrhh.desc" },
  { key: "tecnica", labelKey: "interview.category.tecnica.label", descKey: "interview.category.tecnica.desc" },
  { key: "conductual", labelKey: "interview.category.conductual.label", descKey: "interview.category.conductual.desc" },
];

type Feedback = {
  score: number;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
};

function EntrevistasPage() {
  const { t, lang } = useSettings();
  const genQuestions = useServerFn(generateQuestions);
  const genMock = useServerFn(generateMockInterview);
  const [role, setRole] = useState("");
  const [seniority, setSeniority] = useState("");
  const [category, setCategory] = useState<Category>("rol");
  const [loading, setLoading] = useState(false);
  const [mockLoading, setMockLoading] = useState(false);
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [mockTitle, setMockTitle] = useState<string | null>(null);

  async function start(cat: Category) {
    if (!role.trim()) {
      toast.error(t("interview.error.role"));
      return;
    }
    setCategory(cat);
    setLoading(true);
    try {
      const res = await genQuestions({ data: { role, category: cat, seniority, lang } });
      setQuestions(res.questions);
      setMockTitle(null);
    } catch (e) {
      console.error(e);
      toast.error(t("interview.error.generateQuestions"));
    } finally {
      setLoading(false);
    }
  }

  async function startMock() {
    if (!role.trim()) {
      toast.error(t("interview.error.role"));
      return;
    }
    setMockLoading(true);
    try {
      const res = await genMock({ data: { role, seniority, lang } });
      setQuestions(res.questions);
      setMockTitle(t("interview.mock.title"));
    } catch (e) {
      console.error(e);
      toast.error(t("interview.error.startMock"));
    } finally {
      setMockLoading(false);
    }
  }

  if (questions) {
    return (
      <Simulator
        role={role}
        title={mockTitle ?? t(categories.find((c) => c.key === category)!.labelKey)}
        questions={questions}
        onBack={() => {
          setQuestions(null);
          setMockTitle(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MessagesSquare className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">{t("interview.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("interview.subtitle")}</p>
        </div>
      </div>

      <div className="mt-8 max-w-2xl rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{t("interview.roleLabel")}</Label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder={t("interview.rolePlaceholder")}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("interview.experienceLabel")}</Label>
            <Input
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              placeholder={t("interview.experiencePlaceholder")}
            />
          </div>
        </div>
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold">{t("interview.chooseType")}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => start(c.key)}
            disabled={loading}
            className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-shadow hover:shadow-md disabled:opacity-60"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {loading && category === c.key ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </span>
            <div>
              <h3 className="font-semibold">{t(c.labelKey)}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{t(c.descKey)}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={startMock}
        disabled={loading || mockLoading}
        className="group mt-4 flex w-full items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-left transition-shadow hover:shadow-md disabled:opacity-60"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          {mockLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MessagesSquare className="h-5 w-5" />
          )}
        </span>
        <div>
          <h3 className="font-semibold">{t("interview.mock.label")}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {t("interview.mock.desc")}
          </p>
        </div>
      </button>
    </div>
  );
}

function Simulator({
  role,
  title,
  questions,
  onBack,
}: {
  role: string;
  title: string;
  questions: string[];
  onBack: () => void;
}) {
  const { t, lang } = useSettings();
  const evaluate = useServerFn(evaluateAnswer);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  async function handleEvaluate() {
    if (!answer.trim()) {
      toast.error(t("interview.simulator.error.answer"));
      return;
    }
    setEvaluating(true);
    try {
      const res = await evaluate({ data: { role, question, answer, lang } });
      setFeedback(res);
    } catch (e) {
      console.error(e);
      toast.error(t("interview.simulator.error.evaluate"));
    } finally {
      setEvaluating(false);
    }
  }

  function next() {
    setIndex((i) => Math.min(i + 1, questions.length - 1));
    setAnswer("");
    setFeedback(null);
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("interview.simulator.back")}
      </button>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">{title}</h1>
        <span className="text-sm text-muted-foreground">
          {index + 1} / {questions.length}
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t("interview.simulator.question")}</p>
        <p className="mt-1.5 text-lg font-medium">{question}</p>

        <div className="mt-5 space-y-1.5">
          <Label>{t("interview.simulator.answerLabel")}</Label>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={t("interview.simulator.answerPlaceholder")}
            className="min-h-[140px] resize-none"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button className="gap-2" onClick={handleEvaluate} disabled={evaluating}>
            {evaluating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t("interview.simulator.evaluating")}
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" /> {t("interview.simulator.evaluate")}
              </>
            )}
          </Button>
          {!isLast && (
            <Button variant="outline" onClick={next}>
              {t("interview.simulator.next")}
            </Button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
              {feedback.score}
            </span>
            <div>
              <h3 className="font-display font-semibold">{t("interview.feedback.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("interview.feedback.score")}</p>
            </div>
          </div>

          {feedback.strengths.length > 0 && (
            <div className="mt-5">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> {t("interview.feedback.strengths")}
              </p>
              <ul className="mt-2 space-y-1.5">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-foreground/80">
                    • {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback.improvements.length > 0 && (
            <div className="mt-5">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                <AlertCircle className="h-4 w-4" /> {t("interview.feedback.improvements")}
              </p>
              <ul className="mt-2 space-y-1.5">
                {feedback.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-foreground/80">
                    • {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback.modelAnswer && (
            <div className="mt-5 rounded-xl bg-muted/50 p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-primary" /> {t("interview.feedback.modelAnswer")}
              </p>
              <p className="mt-2 text-sm text-foreground/80">{feedback.modelAnswer}</p>
            </div>
          )}

          {!isLast && (
            <Button className="mt-6" onClick={next}>
              {t("interview.simulator.next")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
