-- Admins can view all invoices (for the admin subscriptions dashboard)
CREATE POLICY "Admins can view all invoices"
ON public.invoices FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can read every coupon (not just active ones)
CREATE POLICY "Admins can view all coupons"
ON public.coupons FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can create/update/delete coupons
CREATE POLICY "Admins can insert coupons"
ON public.coupons FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update coupons"
ON public.coupons FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete coupons"
ON public.coupons FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));