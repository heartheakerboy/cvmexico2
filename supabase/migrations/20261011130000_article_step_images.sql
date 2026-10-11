-- Add step-by-step images to the article
-- "Cómo hacer un currículum sin experiencia: guía para tu primer empleo en México"
-- Images live in the repo at public/blog/curriculum-sin-experiencia/ (served
-- from the site root). Each UPDATE inserts one image right after its section
-- heading and is guarded so re-running never duplicates them.

UPDATE public.blog_posts
SET content = REPLACE(content,
  '# Qué cuenta como experiencia cuando nunca has trabajado',
  '# Qué cuenta como experiencia cuando nunca has trabajado

![Qué cuenta como experiencia sin empleo formal: prácticas, servicio social, proyectos, voluntariado, negocio familiar y cursos](/blog/curriculum-sin-experiencia/paso-1-experiencia.png)')
WHERE slug = 'curriculum-sin-experiencia-primer-empleo'
  AND content NOT LIKE '%paso-1-experiencia.png%';

UPDATE public.blog_posts
SET content = REPLACE(content,
  '# Estructura recomendada para un CV sin experiencia',
  '# Estructura recomendada para un CV sin experiencia

![Estructura recomendada del currículum en 6 secciones: datos de contacto, objetivo, formación, experiencia, habilidades e idiomas](/blog/curriculum-sin-experiencia/paso-2-estructura.png)')
WHERE slug = 'curriculum-sin-experiencia-primer-empleo'
  AND content NOT LIKE '%paso-2-estructura.png%';

UPDATE public.blog_posts
SET content = REPLACE(content,
  '# Tres ejemplos de objetivo profesional',
  '# Tres ejemplos de objetivo profesional

![Ejemplo de objetivo profesional bien redactado y destacado](/blog/curriculum-sin-experiencia/paso-3-objetivo.png)')
WHERE slug = 'curriculum-sin-experiencia-primer-empleo'
  AND content NOT LIKE '%paso-3-objetivo.png%';

UPDATE public.blog_posts
SET content = REPLACE(content,
  '# Errores que hacen que descarten tu CV',
  '# Errores que hacen que descarten tu CV

![Errores comunes que hacen que descarten tu CV: foto, columnas desordenadas y faltas de ortografía](/blog/curriculum-sin-experiencia/paso-4-errores.png)')
WHERE slug = 'curriculum-sin-experiencia-primer-empleo'
  AND content NOT LIKE '%paso-4-errores.png%';

UPDATE public.blog_posts
SET content = REPLACE(content,
  '# Cómo pasar los filtros ATS en tu primer empleo',
  '# Cómo pasar los filtros ATS en tu primer empleo

![Cómo superar los filtros ATS: palabras clave detectadas y CV aprobado](/blog/curriculum-sin-experiencia/paso-5-ats.png)')
WHERE slug = 'curriculum-sin-experiencia-primer-empleo'
  AND content NOT LIKE '%paso-5-ats.png%';
