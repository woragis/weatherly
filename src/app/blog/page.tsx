import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { listPosts } from "@/lib/posts";
import { pageMetadata, PAGE_SEO } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata("blog", "/blog"),
  title: { absolute: PAGE_SEO.blog.title },
};

export default function BlogIndexPage() {
  const posts = listPosts();

  return (
    <MarketingShell
      title="Blog"
      subtitle="Guias práticos sobre clima, UV, chuva e o app"
    >
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-white/15 bg-white/10 p-5 transition hover:bg-white/15"
            >
              <p className="text-[0.7rem] uppercase tracking-[0.16em] text-white/55">
                {post.kicker} · {post.readMinutes} min
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl text-white">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-white/75">{post.excerpt}</p>
              <p className="mt-3 text-xs text-white/50">
                {new Date(post.date + "T12:00:00").toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </MarketingShell>
  );
}
