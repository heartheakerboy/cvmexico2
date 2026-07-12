CREATE TABLE public.ai_usage_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  feature text NOT NULL DEFAULT 'unknown',
  model text,
  input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  total_tokens integer NOT NULL DEFAULT 0,
  cost numeric NOT NULL DEFAULT 0,
  response_ms integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'success',
  error text,
  country text,
  plan text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_usage_logs_user ON public.ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_created ON public.ai_usage_logs(created_at DESC);
CREATE INDEX idx_ai_usage_logs_feature ON public.ai_usage_logs(feature);
GRANT SELECT, INSERT ON public.ai_usage_logs TO authenticated;
GRANT ALL ON public.ai_usage_logs TO service_role;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own ai usage" ON public.ai_usage_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all ai usage" ON public.ai_usage_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own ai usage" ON public.ai_usage_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.ai_user_limits (
  user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_limit integer,
  monthly_limit integer,
  lifetime_limit integer,
  bonus_credits integer NOT NULL DEFAULT 0,
  unlimited boolean NOT NULL DEFAULT false,
  disabled boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ai_user_limits TO authenticated;
GRANT ALL ON public.ai_user_limits TO service_role;
ALTER TABLE public.ai_user_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own ai limits" ON public.ai_user_limits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage ai limits" ON public.ai_user_limits FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_ai_user_limits_updated_at BEFORE UPDATE ON public.ai_user_limits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.ai_credit_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  amount integer,
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_credit_events_user ON public.ai_credit_events(user_id);
GRANT SELECT ON public.ai_credit_events TO authenticated;
GRANT ALL ON public.ai_credit_events TO service_role;
ALTER TABLE public.ai_credit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own credit events" ON public.ai_credit_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage credit events" ON public.ai_credit_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));