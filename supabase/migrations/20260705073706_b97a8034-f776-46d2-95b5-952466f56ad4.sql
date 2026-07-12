CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  channel TEXT NOT NULL DEFAULT 'in_app',
  audience TEXT NOT NULL DEFAULT 'all',
  variant TEXT NOT NULL DEFAULT 'info',
  link_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  sent_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.notifications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active notifications"
  ON public.notifications FOR SELECT
  USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert notifications"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete notifications"
  ON public.notifications FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.notifications (title, body, channel, audience, variant, active) VALUES
  ('Mantenimiento programado', 'Realizaremos tareas de mantenimiento el domingo de 02:00 a 04:00 UTC.', 'banner', 'all', 'warning', true),
  ('Nuevas plantillas disponibles', 'Explora las nuevas plantillas de CV en tu panel.', 'announcement', 'all', 'info', true),
  ('¡Bienvenido!', 'Gracias por unirte. Completa tu perfil para empezar.', 'in_app', 'all', 'success', true);