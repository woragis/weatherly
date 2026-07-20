import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostJsonLd } from "@/components/json-ld";
import { MarketingShell } from "@/components/marketing-shell";
import { getPost, listPosts, postMetadata } from "@/lib/posts";
import { siteUrl, SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post não encontrado" };

  const meta = postMetadata(post);

  return {
    title: { absolute: meta.title },
    description: meta.description,
    authors: [{ name: post.author }],
    alternates: { canonical: meta.canonical },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
      publishedTime: meta.publishedAt,
      locale: SITE.locale,
      siteName: SITE.name,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const meta = postMetadata(post);
  const absoluteUrl = new URL(meta.canonical, siteUrl()).toString();
  const others = listPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <BlogPostJsonLd
        title={post.title}
        description={meta.description}
        url={absoluteUrl}
        datePublished={post.date}
        author={post.author}
      />
      <MarketingShell title={post.title} subtitle={`${post.kicker} · ${post.readMinutes} min`}>
        <p className="text-sm text-white/60">
          {post.author} ·{" "}
          {new Date(post.date + "T12:00:00").toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <article className="flex flex-col gap-4 text-white/90">
          {post.body.map((block, i) => {
            if (block.kind === "h2") {
              return (
                <h2
                  key={i}
                  className="mt-2 font-[family-name:var(--font-display)] text-xl text-white"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.kind === "quote") {
              return (
                <blockquote
                  key={i}
                  className="border-l-2 border-white/40 pl-4 text-white/80 italic"
                >
                  {block.text}
                </blockquote>
              );
            }
            return (
              <p key={i} className="text-base leading-relaxed text-white/85">
                {block.text}
              </p>
            );
          })}
        </article>

        {others.length > 0 && (
          <section className="mt-4 border-t border-white/15 pt-6">
            <h2 className="mb-3 text-[0.7rem] uppercase tracking-[0.16em] text-white/55">
              Continuar lendo
            </h2>
            <ul className="flex flex-col gap-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="text-sm text-white/80 underline hover:text-white"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </MarketingShell>
    </>
  );
}
