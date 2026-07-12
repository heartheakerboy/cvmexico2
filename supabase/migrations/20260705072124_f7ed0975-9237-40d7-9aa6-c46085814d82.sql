-- Occupations table for the Jobs database module
CREATE TABLE public.occupations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  industry text,
  description text,
  skills text[] NOT NULL DEFAULT '{}',
  salary_min integer,
  salary_max integer,
  salary_currency text NOT NULL DEFAULT 'USD',
  universities text[] NOT NULL DEFAULT '{}',
  resume_examples text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.occupations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.occupations TO authenticated;
GRANT ALL ON public.occupations TO service_role;

ALTER TABLE public.occupations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Occupations are publicly readable"
  ON public.occupations FOR SELECT USING (true);

CREATE POLICY "Admins can insert occupations"
  ON public.occupations FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update occupations"
  ON public.occupations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete occupations"
  ON public.occupations FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_occupations_updated_at
  BEFORE UPDATE ON public.occupations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.occupations (title, slug, industry, description, skills, salary_min, salary_max, universities, resume_examples, featured) VALUES
('Software Engineer', 'software-engineer', 'Technology', 'Designs, develops and maintains software systems.', ARRAY['JavaScript','Python','System Design','Git'], 70000, 160000, ARRAY['MIT','Stanford','UC Berkeley'], ARRAY['Senior SWE Resume','Junior Developer Resume'], true),
('Registered Nurse', 'registered-nurse', 'Healthcare', 'Provides and coordinates patient care.', ARRAY['Patient Care','IV Therapy','EHR','Communication'], 60000, 110000, ARRAY['Johns Hopkins','Duke','UPenn'], ARRAY['RN Resume Example'], false),
('Data Analyst', 'data-analyst', 'Technology', 'Interprets data to support business decisions.', ARRAY['SQL','Excel','Tableau','Statistics'], 55000, 105000, ARRAY['Carnegie Mellon','Georgia Tech'], ARRAY['Data Analyst Resume'], true);