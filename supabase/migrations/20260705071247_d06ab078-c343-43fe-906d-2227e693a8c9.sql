-- Media metadata table
CREATE TABLE public.media_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  folder TEXT NOT NULL DEFAULT 'general',
  mime_type TEXT,
  size INTEGER NOT NULL DEFAULT 0,
  width INTEGER,
  height INTEGER,
  is_svg BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_files TO authenticated;
GRANT ALL ON public.media_files TO service_role;

ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signed-in users can read media" ON public.media_files
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage media" ON public.media_files
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON public.media_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for the media bucket
CREATE POLICY "Signed-in users can view media objects" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media objects" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update media objects" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete media objects" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));