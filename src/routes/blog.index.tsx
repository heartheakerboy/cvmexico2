import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar, Clock, Search, Sparkles, ArrowRight, BookOpen, Filter,
  FileText, CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/db/client";
import { PageShell } from "@/components/page-shell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      {
        title: "Blog de Empleo y Currículum Vitae en México | CVAI",
      },
      {
        name: "description",
        content: "Consejos prácticos, ejemplos de currículum vitae por profesión, guías paso a paso, optimización para filtros ATS y tendencias de contratación en México.",
      },
      { property: "og:title", content: "Blog de Empleo y Currículum Vitae en México | CVAI" },
      { property: "og:description", content: "Guías prácticas, 10 ejemplos de CV por profesión y estrategias para conseguir trabajo en México." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.cvai.com.mx/blog" },
    ],
    links: [{ rel: "canonical", href: "https://www.cvai.com.mx/blog" }],
  }),
  component: BlogPage,
});

type BlogPostItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  author: string | null;
  published_at: string | null;
  read_time?: string;
  featured?: boolean;
};

const DEFAULT_POSTS: BlogPostItem[] = [
  {
    id: "f0c298b6-503f-40b8-a95e-de1c73690561",
    title: "¿Cómo hacer un currículum vitae en México? Guía paso a paso para crear un CV profesional",
    slug: "como-hacer-un-curriculum-vitae-mexico",
    excerpt: "Aprende cómo hacer un currículum vitae profesional en México paso a paso. Conoce qué poner, ejemplos reales antes/después, optimización para filtros ATS y formatos recomendados.",
    category: "Guías",
    author: "Equipo Editorial CVAI",
    published_at: "2026-09-14T06:57:47.065Z",
    read_time: "12 min de lectura",
    featured: true,
  },
  {
    id: "0fe4f03d-b7bf-4793-a745-97ac76865d03",
    title: "10 ejemplos de currículum vitae para diferentes trabajos y perfiles profesionales",
    slug: "10-ejemplos-de-curriculum-vitae-para-diferentes-trabajos",
    excerpt: "Descubre 10 ejemplos de currículum vitae reales adaptados a México: estudiantes, sin experiencia, recién egresados, ingenieros, ventas, directivos, trabajo remoto y más.",
    category: "Ejemplos",
    author: "Equipo Editorial CVAI",
    published_at: "2026-09-14T07:04:14.528Z",
    read_time: "14 min de lectura",
    featured: false,
  },
  {
    id: "73382f83-c5d6-485b-8c6d-acdb5ed71241",
    title: "¿Qué es un currículum ATS y cómo hacer un CV que pase los filtros de selección?",
    slug: "que-es-un-curriculum-ats-como-hacer-cv-compatible",
    excerpt: "Descubre qué es un sistema ATS en México, cómo analizan tu CV las empresas y cómo optimizar el formato, estructura y palabras clave para superar los filtros de contratación.",
    category: "ATS",
    author: "Equipo Editorial CVAI",
    published_at: "2026-09-14T07:15:00.000Z",
    read_time: "11 min de lectura",
  },
  {
    id: "9ca27780-681d-4483-b516-14d790f1a31e",
    title: "10 errores comunes en la carta de presentación y cómo evitarlos",
    slug: "errores-carta-presentacion",
    excerpt: "Aprende a redactar una carta de presentación que complemente tu CV y capte la atención de los reclutadores desde el primer párrafo.",
    category: "Consejos",
    author: "Equipo Editorial CVAI",
    published_at: "2026-07-15T12:00:00.000Z",
    read_time: "5 min de lectura",
  },
];

function formatDate(d: string | null) {
  if (!d) return "Reciente";
  return new Date(d).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function BlogPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>(DEFAULT_POSTS);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Todos");

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, category, author, published_at")
      .eq("status", "publicado")
      .order("published_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const slugsInDb = new Set(data.map((p) => p.slug));
          const missingDefaults = DEFAULT_POSTS.filter((p) => !slugsInDb.has(p.slug));
          setPosts([...(data as BlogPostItem[]), ...missingDefaults]);
        }
      })
      .catch(() => {
        // Fallback already in place
      });
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(["Todos"]);
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt ?? "").toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "Todos" || p.category.toLowerCase() === selectedCat.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [posts, search, selectedCat]);

  // Featured article is our comprehensive guide
  const featured = posts.find((p) => p.slug === "como-hacer-un-curriculum-vitae-mexico") || posts[0];
  const gridPosts = filteredPosts.filter((p) => p.slug !== featured?.slug);

  return (
    <PageShell
      title="Blog y Guías de Carrera"
      subtitle="Estrategias prácticas, formatos recomendados y consejos de contratación para el mercado laboral mexicano."
    >
      <div className="space-y-12">
        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  selectedCat === c
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar artículos o guías..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </div>

        {/* Featured Hero Article */}
        {featured && (
          <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 md:p-10 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="default" className="rounded-full px-3 py-0.5 text-xs font-semibold">
                Destacado
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-0.5 text-xs font-normal">
                {featured.category}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> 12 min de lectura
              </span>
            </div>

            <div className="max-w-3xl space-y-4">
              <Link to="/blog/$slug" params={{ slug: featured.slug }}>
                <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-foreground hover:text-primary transition-colors cursor-pointer">
                  {featured.title}
                </h2>
              </Link>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {featured.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{featured.author}</span>
                  <span>•</span>
                  <span>{formatDate(featured.published_at)}</span>
                </div>

                <Link to="/blog/$slug" params={{ slug: featured.slug }}>
                  <Button className="gap-2">
                    Leer guía completa <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Grid of Other Articles */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold tracking-tight">
              {selectedCat === "Todos" ? "Más artículos y recursos" : `Artículos en ${selectedCat}`}
            </h3>
            <span className="text-xs text-muted-foreground">
              {gridPosts.length} {gridPosts.length === 1 ? "artículo" : "artículos"}
            </span>
          </div>

          {gridPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              No se encontraron artículos con ese criterio de búsqueda.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {post.category}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {post.read_time ?? "8 min"}
                      </span>
                    </div>

                    <Link to="/blog/$slug" params={{ slug: post.slug }}>
                      <h4 className="font-display text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                        {post.title}
                      </h4>
                    </Link>

                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3 text-xs">
                    <span className="text-muted-foreground">{formatDate(post.published_at)}</span>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      Leer más <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Bottom Banner CTA */}
        <section className="rounded-3xl border border-border bg-secondary/30 p-8 text-center space-y-4">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="font-display text-xl font-bold">
            ¿Listo para poner en práctica estos consejos?
          </h3>
          <p className="mx-auto max-w-md text-xs sm:text-sm text-muted-foreground">
            Diseña un currículum vitae optimizado para el mercado mexicano con plantillas profesionales y sugerencias en tiempo real con Inteligencia Artificial.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/plantillas">
              <Button variant="outline" size="sm">Explorar plantillas</Button>
            </Link>
            <Link to="/curriculum-vitae">
              <Button size="sm" className="gap-1.5">
                Crear mi CV gratis <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
