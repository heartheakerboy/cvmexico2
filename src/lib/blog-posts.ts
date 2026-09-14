/**
 * Verified Published Blog Posts
 * 
 * Source of truth for existing, publicly accessible blog articles on cvai.com.mx.
 * Every article in this registry is verified to:
 * 1. Exist and return HTTP 200 at its exact `url`.
 * 2. Contain full, comprehensive editorial content.
 * 3. Have matching visible titles and destination URLs (preventing misleading links).
 */

export interface VerifiedBlogPost {
  id: string;
  title: string;
  slug: string;
  url: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  featured?: boolean;
}

export const VERIFIED_BLOG_POSTS: readonly VerifiedBlogPost[] = [
  {
    id: "f0c298b6-503f-40b8-a95e-de1c73690561",
    title: "¿Cómo hacer un currículum vitae en México? Guía paso a paso para crear un CV profesional",
    slug: "como-hacer-un-curriculum-vitae-mexico",
    url: "/blog/como-hacer-un-curriculum-vitae-mexico",
    excerpt: "Aprende cómo hacer un currículum vitae profesional en México paso a paso. Conoce qué poner, ejemplos reales antes/después, optimización para filtros ATS y formatos recomendados.",
    category: "Guías",
    readTime: "12 min de lectura",
    publishedAt: "2026-09-14T06:57:47.065Z",
    featured: true,
  },
  {
    id: "0fe4f03d-b7bf-4793-a745-97ac76865d03",
    title: "10 ejemplos de currículum vitae para diferentes trabajos y perfiles profesionales",
    slug: "10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos",
    url: "/blog/10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos",
    excerpt: "Descubre 10 ejemplos de currículum vitae reales adaptados a México: estudiantes, sin experiencia, recién egresados, ingenieros, ventas, directivos, trabajo remoto y más.",
    category: "Ejemplos",
    readTime: "14 min de lectura",
    publishedAt: "2026-09-14T07:04:14.528Z",
    featured: false,
  },
  {
    id: "73382f83-c5d6-485b-8c6d-acdb5ed71241",
    title: "¿Qué es un currículum ATS y cómo hacer un CV que pase los filtros de selección?",
    slug: "que-es-un-curriculum-ats-como-hacer-cv-compatible",
    url: "/blog/que-es-un-curriculum-ats-como-hacer-cv-compatible",
    excerpt: "Descubre qué es un sistema ATS en México, cómo analizan tu CV las empresas y cómo optimizar el formato, estructura y palabras clave para superar los filtros de contratación.",
    category: "ATS",
    readTime: "11 min de lectura",
    publishedAt: "2026-09-14T07:15:00.000Z",
    featured: false,
  },
] as const;

/**
 * Returns verified, published blog articles for recommendation sections on city pages.
 * Ensures that:
 * - Visible title matches the actual published article title.
 * - Destination URL links directly to the specific article (never to generic /blog).
 * - No fake city-specific titles are fabricated.
 */
export function getRecommendedArticlesForCity(_citySlug?: string): readonly VerifiedBlogPost[] {
  return VERIFIED_BLOG_POSTS;
}
