
-- Cron jobs
CREATE TABLE public.system_cron_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  schedule TEXT NOT NULL,
  command TEXT NOT NULL DEFAULT '',
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  last_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_cron_jobs TO authenticated;
GRANT ALL ON public.system_cron_jobs TO service_role;
ALTER TABLE public.system_cron_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage cron jobs" ON public.system_cron_jobs FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Queue jobs
CREATE TABLE public.system_queue_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_type TEXT NOT NULL,
  payload TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'queued',
  attempts INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_queue_jobs TO authenticated;
GRANT ALL ON public.system_queue_jobs TO service_role;
ALTER TABLE public.system_queue_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage queue jobs" ON public.system_queue_jobs FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- System logs (api + error)
CREATE TABLE public.system_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL DEFAULT 'info',
  source TEXT NOT NULL DEFAULT 'api',
  method TEXT,
  path TEXT,
  status_code INTEGER,
  message TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_logs TO authenticated;
GRANT ALL ON public.system_logs TO service_role;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage system logs" ON public.system_logs FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Backups
CREATE TABLE public.system_backups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed',
  storage_location TEXT NOT NULL DEFAULT 'cloud',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_backups TO authenticated;
GRANT ALL ON public.system_backups TO service_role;
ALTER TABLE public.system_backups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage backups" ON public.system_backups FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at triggers
CREATE TRIGGER trg_cron_jobs_updated BEFORE UPDATE ON public.system_cron_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_queue_jobs_updated BEFORE UPDATE ON public.system_queue_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data
INSERT INTO public.system_cron_jobs (name, schedule, command, enabled, last_run_at, next_run_at, last_status) VALUES
  ('Limpieza de sesiones', '0 2 * * *', 'cleanup_sessions', true, now() - interval '10 hours', now() + interval '14 hours', 'success'),
  ('Envío de recordatorios', '0 9 * * *', 'send_reminders', true, now() - interval '3 hours', now() + interval '21 hours', 'success'),
  ('Reporte semanal', '0 8 * * 1', 'weekly_report', false, now() - interval '3 days', now() + interval '4 days', 'success'),
  ('Sincronización de empleos', '*/30 * * * *', 'sync_jobs', true, now() - interval '12 minutes', now() + interval '18 minutes', 'error');

INSERT INTO public.system_queue_jobs (job_type, payload, status, attempts, error) VALUES
  ('email:welcome', '{"to":"ana@example.com"}', 'completed', 1, NULL),
  ('pdf:export', '{"resume_id":"abc"}', 'processing', 1, NULL),
  ('email:broadcast', '{"campaign":"promo"}', 'queued', 0, NULL),
  ('image:optimize', '{"file":"foto.png"}', 'failed', 3, 'Timeout al procesar la imagen');

INSERT INTO public.system_logs (level, source, method, path, status_code, message) VALUES
  ('info', 'api', 'GET', '/api/resumes', 200, 'Listado de CV solicitado'),
  ('info', 'api', 'POST', '/api/cover-letters', 201, 'Carta creada correctamente'),
  ('error', 'error', 'POST', '/api/ats', 500, 'Fallo en el servicio de IA: timeout'),
  ('warning', 'api', 'GET', '/api/jobs', 429, 'Límite de peticiones alcanzado'),
  ('error', 'error', 'GET', '/api/downloads', 404, 'Archivo no encontrado');

INSERT INTO public.system_backups (label, size_bytes, status, storage_location) VALUES
  ('Backup automático diario', 52428800, 'completed', 'cloud'),
  ('Backup manual pre-migración', 51380224, 'completed', 'cloud'),
  ('Backup automático diario', 50331648, 'completed', 'cloud');
