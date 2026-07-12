CREATE TYPE public.job_status AS ENUM ('deseos', 'aplicado', 'entrevista', 'oferta', 'rechazado');

CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status public.job_status NOT NULL DEFAULT 'deseos',
  location TEXT,
  salary TEXT,
  url TEXT,
  notes TEXT,
  applied_at DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications"
  ON public.job_applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert their own applications"
  ON public.job_applications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own applications"
  ON public.job_applications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own applications"
  ON public.job_applications FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.job_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.job_applications ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  occurred_at DATE NOT NULL DEFAULT (now())::date,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_events TO authenticated;
GRANT ALL ON public.job_events TO service_role;

ALTER TABLE public.job_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own job events"
  ON public.job_events FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert their own job events"
  ON public.job_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own job events"
  ON public.job_events FOR DELETE TO authenticated
  USING (auth.uid() = user_id);