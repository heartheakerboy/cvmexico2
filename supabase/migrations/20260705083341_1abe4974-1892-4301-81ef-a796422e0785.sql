
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  actor_name TEXT,
  actor_email TEXT,
  entity TEXT,
  ip_address TEXT,
  severity TEXT NOT NULL DEFAULT 'info',
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage audit logs" ON public.audit_logs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  scopes TEXT NOT NULL DEFAULT 'read',
  last_used_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage api keys" ON public.api_keys
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON public.api_keys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.audit_logs (action, actor_name, actor_email, entity, ip_address, severity, details) VALUES
('user.login', 'Ana López', 'ana@example.com', 'auth', '187.190.12.4', 'info', 'Inicio de sesión exitoso'),
('role.granted', 'Admin', 'admin@cvmexico.mx', 'user_roles', '187.190.12.4', 'warning', 'Rol admin asignado a carlos@example.com'),
('plan.upgraded', 'Carlos Ruiz', 'carlos@example.com', 'subscriptions', '201.145.9.88', 'info', 'Actualizó a plan Premium'),
('login.failed', 'Desconocido', 'attacker@example.com', 'auth', '45.9.148.11', 'critical', '5 intentos fallidos de inicio de sesión');

INSERT INTO public.api_keys (name, key_prefix, scopes, active) VALUES
('Integración Zapier', 'cvmx_live_a1b2', 'read', true),
('Exportación de datos', 'cvmx_live_c3d4', 'read,write', true),
('Clave de pruebas', 'cvmx_test_e5f6', 'read', false);
