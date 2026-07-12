-- Language & locale preferences on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS dashboard_lang text NOT NULL DEFAULT 'es',
  ADD COLUMN IF NOT EXISTS resume_lang text NOT NULL DEFAULT 'es',
  ADD COLUMN IF NOT EXISTS ai_output_lang text NOT NULL DEFAULT 'es',
  ADD COLUMN IF NOT EXISTS date_format text NOT NULL DEFAULT 'dd/MM/yyyy',
  ADD COLUMN IF NOT EXISTS number_format text NOT NULL DEFAULT 'es-MX',
  ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'America/Mexico_City',
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'MXN';

-- Translation overrides managed from the admin panel
CREATE TABLE IF NOT EXISTS public.translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  locale text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (locale, key)
);

GRANT SELECT ON public.translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.translations TO authenticated;
GRANT ALL ON public.translations TO service_role;

ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Translations are readable by everyone"
  ON public.translations FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert translations"
  ON public.translations FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update translations"
  ON public.translations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete translations"
  ON public.translations FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON public.translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();