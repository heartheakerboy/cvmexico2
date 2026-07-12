CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  author TEXT,
  seo_title TEXT,
  seo_description TEXT,
  cover_url TEXT,
  status TEXT NOT NULL DEFAULT 'borrador',
  published_at TIMESTAMP WITH TIME ZONE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'publicado' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert posts"
  ON public.blog_posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update posts"
  ON public.blog_posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete posts"
  ON public.blog_posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.blog_posts (title, slug, excerpt, category, author, seo_title, seo_description, status, published_at, sort_order) VALUES
  ('Cómo crear un CV que pase los filtros ATS', 'cv-filtros-ats', 'Guía práctica para optimizar tu currículum ante los sistemas de seguimiento de candidatos.', 'consejos', 'Equipo Editorial', 'CV para ATS: guía 2026', 'Aprende a estructurar tu CV para superar los filtros ATS y llegar a los reclutadores.', 'publicado', now(), 0),
  ('10 errores comunes en la carta de presentación', 'errores-carta-presentacion', 'Evita estos fallos frecuentes que restan puntos a tu candidatura.', 'consejos', 'Equipo Editorial', '10 errores en tu carta de presentación', 'Descubre los errores más comunes en cartas de presentación y cómo corregirlos.', 'publicado', now(), 1),
  ('Tendencias de reclutamiento para 2026', 'tendencias-reclutamiento-2026', 'Lo que buscarán las empresas el próximo año.', 'tendencias', 'Equipo Editorial', 'Tendencias de reclutamiento 2026', 'Las principales tendencias de reclutamiento y contratación para el 2026.', 'borrador', NULL, 2);