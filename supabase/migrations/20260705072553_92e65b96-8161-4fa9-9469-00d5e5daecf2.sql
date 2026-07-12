-- AI models catalog
CREATE TABLE public.ai_models (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  model_id text NOT NULL UNIQUE,
  provider text NOT NULL DEFAULT 'Lovable AI',
  cost_input numeric NOT NULL DEFAULT 0,
  cost_output numeric NOT NULL DEFAULT 0,
  monthly_credit_limit integer,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_models TO authenticated;
GRANT ALL ON public.ai_models TO service_role;

ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read ai_models"
  ON public.ai_models FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert ai_models"
  ON public.ai_models FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update ai_models"
  ON public.ai_models FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete ai_models"
  ON public.ai_models FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_ai_models_updated_at
  BEFORE UPDATE ON public.ai_models FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AI prompts
CREATE TABLE public.ai_prompts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text,
  content text NOT NULL DEFAULT '',
  model text,
  temperature numeric NOT NULL DEFAULT 0.7,
  max_tokens integer,
  version integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_prompts TO authenticated;
GRANT ALL ON public.ai_prompts TO service_role;

ALTER TABLE public.ai_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read ai_prompts"
  ON public.ai_prompts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert ai_prompts"
  ON public.ai_prompts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update ai_prompts"
  ON public.ai_prompts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete ai_prompts"
  ON public.ai_prompts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_ai_prompts_updated_at
  BEFORE UPDATE ON public.ai_prompts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AI prompt versions (history)
CREATE TABLE public.ai_prompt_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id uuid NOT NULL REFERENCES public.ai_prompts(id) ON DELETE CASCADE,
  version integer NOT NULL,
  content text NOT NULL DEFAULT '',
  model text,
  temperature numeric,
  max_tokens integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_prompt_versions TO authenticated;
GRANT ALL ON public.ai_prompt_versions TO service_role;

ALTER TABLE public.ai_prompt_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read ai_prompt_versions"
  ON public.ai_prompt_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert ai_prompt_versions"
  ON public.ai_prompt_versions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete ai_prompt_versions"
  ON public.ai_prompt_versions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.ai_models (name, model_id, provider, cost_input, cost_output, monthly_credit_limit, enabled) VALUES
('Gemini 3 Flash', 'google/gemini-3-flash-preview', 'Lovable AI', 0.075, 0.30, 5000, true),
('Gemini 2.5 Pro', 'google/gemini-2.5-pro', 'Lovable AI', 1.25, 10.0, 2000, true),
('GPT-5 Mini', 'openai/gpt-5-mini', 'Lovable AI', 0.25, 2.0, 1000, false);

INSERT INTO public.ai_prompts (name, slug, category, content, model, temperature, max_tokens, version, active) VALUES
('Resume summary generator', 'resume-summary', 'Resumes', 'Write a concise professional summary for the following resume: {{resume}}', 'google/gemini-3-flash-preview', 0.7, 500, 1, true),
('Cover letter writer', 'cover-letter', 'Cover letters', 'Write a tailored cover letter for the role {{role}} using this profile: {{profile}}', 'google/gemini-2.5-pro', 0.8, 900, 2, true),
('ATS keyword extractor', 'ats-keywords', 'ATS', 'Extract the top ATS keywords from this job description: {{job}}', 'google/gemini-3-flash-preview', 0.3, 300, 1, false);