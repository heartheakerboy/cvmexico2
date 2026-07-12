-- Email templates
CREATE TABLE public.email_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  type text NOT NULL DEFAULT 'transactional',
  subject text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read email_templates" ON public.email_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert email_templates" ON public.email_templates FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update email_templates" ON public.email_templates FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete email_templates" ON public.email_templates FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Email broadcasts
CREATE TABLE public.email_broadcasts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject text NOT NULL,
  body text NOT NULL DEFAULT '',
  audience text NOT NULL DEFAULT 'all',
  status text NOT NULL DEFAULT 'draft',
  scheduled_at timestamptz,
  recipients_count integer NOT NULL DEFAULT 0,
  sent_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_broadcasts TO authenticated;
GRANT ALL ON public.email_broadcasts TO service_role;
ALTER TABLE public.email_broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read email_broadcasts" ON public.email_broadcasts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert email_broadcasts" ON public.email_broadcasts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update email_broadcasts" ON public.email_broadcasts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete email_broadcasts" ON public.email_broadcasts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_email_broadcasts_updated_at BEFORE UPDATE ON public.email_broadcasts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Email logs
CREATE TABLE public.email_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient text NOT NULL,
  template text,
  subject text,
  status text NOT NULL DEFAULT 'sent',
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_logs TO authenticated;
GRANT ALL ON public.email_logs TO service_role;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read email_logs" ON public.email_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert email_logs" ON public.email_logs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete email_logs" ON public.email_logs FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.email_templates (name, slug, type, subject, body, active) VALUES
('Welcome email', 'welcome', 'transactional', 'Welcome to {{app}}!', 'Hi {{name}}, welcome aboard. We are glad to have you.', true),
('Email verification', 'verification', 'transactional', 'Verify your email', 'Hi {{name}}, please confirm your email by clicking {{link}}.', true),
('Password reset', 'password-reset', 'transactional', 'Reset your password', 'Click {{link}} to reset your password.', true);

INSERT INTO public.email_broadcasts (subject, body, audience, status, recipients_count, sent_count) VALUES
('New templates released', 'We just launched brand new resume templates. Check them out!', 'all', 'sent', 1240, 1218),
('Summer discount', 'Get 30% off premium plans this week only.', 'free', 'draft', 0, 0);

INSERT INTO public.email_logs (recipient, template, subject, status) VALUES
('user1@example.com', 'welcome', 'Welcome to CVApp!', 'sent'),
('user2@example.com', 'verification', 'Verify your email', 'sent'),
('bounce@example.com', 'welcome', 'Welcome to CVApp!', 'bounced');