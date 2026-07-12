-- Billing details (one per user)
CREATE TABLE public.billing_details (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  legal_name text,
  tax_id text,
  company text,
  email text,
  address text,
  city text,
  country text DEFAULT 'México',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.billing_details TO authenticated;
GRANT ALL ON public.billing_details TO service_role;
ALTER TABLE public.billing_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own billing details" ON public.billing_details
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_billing_details_updated_at BEFORE UPDATE ON public.billing_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Invoices / payment history
CREATE TYPE public.invoice_status AS ENUM ('pagado', 'pendiente', 'fallido', 'reembolsado');
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  number text NOT NULL,
  concept text NOT NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'MXN',
  status public.invoice_status NOT NULL DEFAULT 'pendiente',
  method text,
  period text,
  issued_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own invoices" ON public.invoices
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Coupons (public catalog) + redemptions
CREATE TABLE public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  description text,
  percent_off int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coupons TO authenticated, anon;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active coupons" ON public.coupons
  FOR SELECT USING (active = true);

CREATE TABLE public.coupon_redemptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coupon_id uuid NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, coupon_id)
);
GRANT SELECT, INSERT, DELETE ON public.coupon_redemptions TO authenticated;
GRANT ALL ON public.coupon_redemptions TO service_role;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own redemptions" ON public.coupon_redemptions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Seed a couple of demo coupons
INSERT INTO public.coupons (code, description, percent_off, active) VALUES
  ('BIENVENIDA20', 'Descuento de bienvenida', 20, true),
  ('PRO50', '50% en tu primer mes Pro', 50, true);