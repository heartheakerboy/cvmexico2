-- Create legal_pages table
CREATE TABLE public.legal_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.legal_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_pages TO authenticated;
GRANT ALL ON public.legal_pages TO service_role;

ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read legal pages" ON public.legal_pages
  FOR SELECT USING (true);

CREATE POLICY "Admins manage legal pages" ON public.legal_pages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_legal_pages_updated_at BEFORE UPDATE ON public.legal_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default data for terminos and privacidad
INSERT INTO public.legal_pages (slug, title, subtitle, content, published) VALUES
  (
    'terminos',
    'Términos y condiciones',
    'Reglas de uso del servicio.',
    'Al usar CVAI aceptas estos términos. El servicio se ofrece para crear currículums de uso personal y profesional. No está permitido el uso indebido de la plataforma ni la generación de contenido falso o fraudulento.

Los planes de pago se rigen por los precios vigentes en pesos mexicanos (MXN) publicados en la página de precios. Puedes cancelar tu suscripción en cualquier momento.',
    true
  ),
  (
    'privacidad',
    'Aviso de privacidad',
    'Conforme a la LFPDPPP.',
    'CVAI protege tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP). Solo recopilamos la información necesaria para crear y gestionar tu currículum.

Puedes ejercer tus derechos ARCO (acceso, rectificación, cancelación y oposición) y solicitar la eliminación de tu cuenta y datos en cualquier momento desde tu panel o escribiéndonos a través de la página de contacto.',
    true
  );
