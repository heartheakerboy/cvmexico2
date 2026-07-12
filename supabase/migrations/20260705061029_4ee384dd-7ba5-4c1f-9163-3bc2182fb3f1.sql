CREATE TYPE public.download_kind AS ENUM ('pdf', 'docx', 'link', 'generado');

CREATE TABLE public.downloads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  kind public.download_kind NOT NULL,
  storage_path text,
  url text,
  source text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.downloads TO authenticated;
GRANT ALL ON public.downloads TO service_role;

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own downloads" ON public.downloads
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_downloads_updated_at BEFORE UPDATE ON public.downloads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();