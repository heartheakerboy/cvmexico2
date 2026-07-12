CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO authenticated;
GRANT ALL ON public.system_settings TO service_role;

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage settings"
ON public.system_settings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.system_settings (key, value) VALUES
('general', '{"siteName":"CVMéxico","tagline":"Crea tu currículum profesional con IA","supportEmail":"soporte@cvmexico.com","contactPhone":"+52 55 0000 0000"}'::jsonb),
('branding', '{"primaryColor":"#2563eb","logoUrl":"","faviconUrl":"","footerText":"© CVMéxico. Todos los derechos reservados."}'::jsonb),
('languages', '{"default":"es","enabled":["es","en"]}'::jsonb),
('currency', '{"default":"MXN","symbol":"$","position":"before"}'::jsonb),
('flags', '{"aiTools":true,"blog":true,"affiliates":true,"jobs":true,"interviews":true,"registration":true}'::jsonb),
('maintenance', '{"enabled":false,"message":"Estamos realizando tareas de mantenimiento. Volvemos pronto."}'::jsonb);