-- Fix: anonymous reads of blog_posts fail with
-- "permission denied for function has_role".
--
-- The SELECT policy "Anyone can view published posts" evaluates
-- public.has_role(auth.uid(), 'admin') for every row, but EXECUTE on
-- public.has_role was revoked from anon (and PUBLIC) in migration
-- 20260704165824 as a security hardening step. As a result every public
-- (anon) SELECT on blog_posts errors out, the blog index silently falls
-- back to its hardcoded default posts, and DB-published articles are
-- invisible to visitors.
--
-- Split the policy: a status-only policy that everyone can evaluate,
-- plus an admin read-all policy that only applies to authenticated
-- users (the only role allowed to execute has_role).

DROP POLICY "Anyone can view published posts" ON public.blog_posts;

CREATE POLICY "Public can view published posts"
  ON public.blog_posts FOR SELECT
  TO public
  USING (status = 'publicado');

CREATE POLICY "Admins can view all posts"
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
