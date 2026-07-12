-- SEO page meta settings
CREATE TABLE public.seo_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  keywords TEXT,
  noindex BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.seo_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_pages TO authenticated;
GRANT ALL ON public.seo_pages TO service_role;

ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read seo pages" ON public.seo_pages
  FOR SELECT USING (true);
CREATE POLICY "Admins manage seo pages" ON public.seo_pages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_seo_pages_updated_at BEFORE UPDATE ON public.seo_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Redirects + 404 monitor
CREATE TABLE public.redirects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_path TEXT NOT NULL UNIQUE,
  to_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301,
  hits INTEGER NOT NULL DEFAULT 0,
  is_404 BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.redirects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.redirects TO authenticated;
GRANT ALL ON public.redirects TO service_role;

ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read redirects" ON public.redirects
  FOR SELECT USING (true);
CREATE POLICY "Admins manage redirects" ON public.redirects
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_redirects_updated_at BEFORE UPDATE ON public.redirects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed example data
INSERT INTO public.seo_pages (path, meta_title, meta_description, og_title, og_description, keywords, noindex) VALUES
  ('/', 'Crea tu CV profesional gratis | CVApp', 'Crea currículums optimizados para ATS en minutos con plantillas profesionales.', 'Crea tu CV profesional', 'Plantillas ATS y editor de CV gratis.', 'cv, curriculum, plantillas cv, ats', false),
  ('/plantillas', 'Plantillas de CV profesionales | CVApp', 'Explora plantillas de currículum modernas, clásicas y creativas.', 'Plantillas de CV', 'Modernas, clásicas y creativas.', 'plantillas cv, modelos curriculum', false),
  ('/precios', 'Precios y planes | CVApp', 'Planes gratuitos y Pro para crear currículums ilimitados.', 'Precios y planes', 'Gratis y Pro.', 'precios cv, plan pro', false);

INSERT INTO public.redirects (from_path, to_path, status_code, hits, is_404, active) VALUES
  ('/curriculum', '/plantillas', 301, 42, false, true),
  ('/pricing', '/precios', 301, 18, false, true),
  ('/blog/old-post', '/blog', 301, 7, true, false);