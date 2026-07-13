-- Migration to create the cities table for city-specific SEO landing pages

CREATE TABLE IF NOT EXISTS public.cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  state_code text NOT NULL,
  phone_area_code text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  hero_image text,
  salary_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  industries jsonb NOT NULL DEFAULT '[]'::jsonb,
  hiring_sectors jsonb NOT NULL DEFAULT '[]'::jsonb,
  companies jsonb NOT NULL DEFAULT '[]'::jsonb,
  universities jsonb NOT NULL DEFAULT '[]'::jsonb,
  resume_tips jsonb NOT NULL DEFAULT '[]'::jsonb,
  cover_letter_tips jsonb NOT NULL DEFAULT '[]'::jsonb,
  interview_tips jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read-only access to cities" ON public.cities;
DROP POLICY IF EXISTS "Allow admins full access to cities" ON public.cities;

-- Create policies
CREATE POLICY "Allow public read-only access to cities" ON public.cities
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow admins full access to cities" ON public.cities
  ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update trigger
DROP TRIGGER IF EXISTS update_cities_updated_at ON public.cities;
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON public.cities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial 20 cities
INSERT INTO public.cities (slug, name, state_code, phone_area_code, is_active, seo_title, seo_description)
VALUES
  ('ciudad-de-mexico', 'Ciudad de México', 'CDMX', '55', true, 'Plantillas de Currículum en Ciudad de México | CVAI', 'Crea tu currículum optimizado para el mercado laboral de la Ciudad de México. Plantillas ATS-friendly y sugerencias con IA locales.'),
  ('guadalajara', 'Guadalajara', 'Jal.', '33', true, 'Plantillas de Currículum en Guadalajara | CVAI', 'Destaca en la capital tecnológica de México. Crea tu CV optimizado para empresas en Guadalajara con plantillas validadas.'),
  ('monterrey', 'Monterrey', 'N.L.', '81', true, 'Plantillas de Currículum en Monterrey | CVAI', 'Diseña tu currículum para el competitivo mercado laboral de Monterrey. Formatos ATS-friendly para sector industrial y corporativo.'),
  ('puebla', 'Puebla', 'Pue.', '222', true, 'Plantillas de Currículum en Puebla | CVAI', 'Crea un CV profesional adaptado al mercado automotriz e industrial de Puebla. Plantillas descargables en PDF.'),
  ('tijuana', 'Tijuana', 'B.C.', '664', true, 'Plantillas de Currículum en Tijuana | CVAI', 'Destaca en Tijuana y la región fronteriza. Plantillas de currículum optimizadas para el sector maquilador, logístico y de servicios.'),
  ('leon', 'León', 'Gto.', '477', true, 'Plantillas de Currículum en León | CVAI', 'Optimiza tu currículum para el sector cuero-calzado, comercio e industria en León. Descarga tu CV profesional en PDF.'),
  ('merida', 'Mérida', 'Yuc.', '999', true, 'Plantillas de Currículum en Mérida | CVAI', 'Crea tu currículum para el creciente mercado de Mérida. Formatos profesionales para turismo, comercio y tecnología.'),
  ('queretaro', 'Querétaro', 'Qro.', '442', true, 'Plantillas de Currículum en Querétaro | CVAI', 'Destaca en el sector aeronáutico y manufacturero de Querétaro. Crea tu currículum con IA y formatos compatibles con ATS.'),
  ('toluca', 'Toluca', 'Edomex', '722', true, 'Plantillas de Currículum en Toluca | CVAI', 'Diseña tu CV para el sector industrial, logístico y químico de Toluca. Optimización ATS para grandes corporativos.'),
  ('chihuahua', 'Chihuahua', 'Chih.', '614', true, 'Plantillas de Currículum en Chihuahua | CVAI', 'Formatos de CV adaptados al sector maquilador, aeroespacial y ganadero de Chihuahua. Descarga tu currículum en minutos.'),
  ('cancun', 'Cancún', 'Q. Roo', '998', true, 'Plantillas de Currículum en Cancún | CVAI', 'Currículum profesional para el sector hotelero, turístico y de servicios en Cancún. Destaca ante reclutadores locales.'),
  ('san-luis-potosi', 'San Luis Potosí', 'S.L.P.', '444', true, 'Plantillas de Currículum en San Luis Potosí | CVAI', 'Diseña tu currículum para la industria manufacturera y automotriz de San Luis Potosí. Formatos profesionales.'),
  ('aguascalientes', 'Aguascalientes', 'Ags.', '449', true, 'Plantillas de Currículum en Aguascalientes | CVAI', 'Crea tu CV optimizado para el sector Nissan, autopartes y servicios en Aguascalientes.'),
  ('mexicali', 'Mexicali', 'B.C.', '686', true, 'Plantillas de Currículum en Mexicali | CVAI', 'Formatos de currículum para el sector industrial y manufacturero de Mexicali. Compatibilidad ATS asegurada.'),
  ('hermosillo', 'Hermosillo', 'Son.', '662', true, 'Plantillas de Currículum en Hermosillo | CVAI', 'Destaca en el sector minero, automotriz y comercial de Hermosillo. Crea tu currículum profesional.'),
  ('morelia', 'Morelia', 'Mich.', '443', true, 'Plantillas de Currículum en Morelia | CVAI', 'Diseña tu CV para el mercado de educación, servicios y agroindustrial de Morelia. Plantillas profesionales.'),
  ('culiacan', 'Culiacán', 'Sin.', '667', true, 'Plantillas de Currículum en Culiacán | CVAI', 'Crea tu currículum para el sector agroindustrial, comercial y de servicios de Culiacán.'),
  ('veracruz', 'Veracruz', 'Ver.', '229', true, 'Plantillas de Currículum en Veracruz | CVAI', 'Diseña tu CV para el sector portuario, turístico y aduanero de Veracruz. Formatos de currículum profesional.'),
  ('saltillo', 'Saltillo', 'Coah.', '844', true, 'Plantillas de Currículum en Saltillo | CVAI', 'Crea tu CV para el clúster automotriz e industrial de Saltillo. Optimizado para sistemas ATS.'),
  ('torreon', 'Torreón', 'Coah.', '871', true, 'Plantillas de Currículum en Torreón | CVAI', 'Formatos de CV adaptados al sector lechero, metalúrgico y de servicios en Torreón.')
ON CONFLICT (slug) DO UPDATE 
SET 
  name = EXCLUDED.name,
  state_code = EXCLUDED.state_code,
  phone_area_code = EXCLUDED.phone_area_code,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description;
