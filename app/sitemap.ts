import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { getModule } from "@/lib/content/registry";
import { FREE_MODULE_SLUG } from "@/lib/billing-access";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://plataforma-python.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/sobre",
    "/trilhas",
    "/recursos",
    "/projetos",
    "/carreira",
    "/precos",
    "/blog",
    "/aprender",
    "/assinar",
  ];
  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const lessons = getModule(FREE_MODULE_SLUG)?.lessons ?? [];
  const lessonEntries: MetadataRoute.Sitemap = lessons.map((l) => ({
    url: `${BASE}/aprender/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries, ...lessonEntries];
}
