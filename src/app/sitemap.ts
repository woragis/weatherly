import type { MetadataRoute } from "next";
import { listCities } from "@/lib/cities";
import { listPosts } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl().origin;

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/detalhes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/radar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/cidades`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/alertas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/config`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/clima`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const cityPages: MetadataRoute.Sitemap = listCities().map((c) => ({
    url: `${base}/clima/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.85,
  }));

  const blogPages: MetadataRoute.Sitemap = listPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date + "T12:00:00"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...cityPages, ...blogPages];
}
