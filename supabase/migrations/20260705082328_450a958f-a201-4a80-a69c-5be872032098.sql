
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'ticket',
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  requester_name TEXT,
  requester_email TEXT,
  admin_reply TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all tickets" ON public.support_tickets
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create their own tickets" ON public.support_tickets
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read their own tickets" ON public.support_tickets
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads published faqs" ON public.faqs
  FOR SELECT USING (published = true);
CREATE POLICY "Admins manage all faqs" ON public.faqs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.support_tickets (subject, message, type, status, priority, requester_name, requester_email) VALUES
('No puedo descargar mi CV en PDF', 'Al hacer clic en descargar no pasa nada.', 'bug', 'open', 'high', 'Ana López', 'ana@example.com'),
('¿Cómo cambio mi plan a Premium?', 'Quiero actualizar mi suscripción.', 'ticket', 'open', 'medium', 'Carlos Ruiz', 'carlos@example.com'),
('Excelente plataforma', 'Me encantó lo fácil que es crear un CV.', 'feedback', 'closed', 'low', 'María Gómez', 'maria@example.com'),
('Consulta sobre facturación', 'Necesito una factura con RFC.', 'contact', 'pending', 'medium', 'Jorge Díaz', 'jorge@example.com');

INSERT INTO public.faqs (question, answer, category, sort_order, published) VALUES
('¿Cómo creo mi primer currículum?', 'Ingresa a tu panel, haz clic en "Nuevo CV" y sigue el asistente paso a paso.', 'general', 1, true),
('¿Puedo descargar mi CV en PDF?', 'Sí, desde el editor haz clic en "Descargar" y elige el formato PDF.', 'general', 2, true),
('¿Qué incluye el plan Premium?', 'Plantillas premium, descargas ilimitadas y análisis ATS avanzado.', 'billing', 3, true),
('¿Cómo cancelo mi suscripción?', 'Ve a Ajustes > Suscripción y selecciona "Cancelar plan".', 'billing', 4, true);
