import { describe, expect, it } from "vitest";
import { getPost, listPosts, postMetadata } from "./posts";

describe("posts", () => {
  it("lista pelo menos 3 posts com slugs únicos", () => {
    const posts = listPosts();
    expect(posts.length).toBeGreaterThanOrEqual(3);
    expect(new Set(posts.map((p) => p.slug)).size).toBe(posts.length);
  });

  it("getPost e postMetadata usam seoTitle quando presente", () => {
    const post = getPost("como-ler-uv-e-qualidade-do-ar");
    expect(post).not.toBeNull();
    const meta = postMetadata(post!);
    expect(meta.title).toBe(post!.seoTitle);
    expect(meta.description).toBe(post!.seoDescription);
    expect(meta.canonical).toBe("/blog/como-ler-uv-e-qualidade-do-ar");
  });

  it("retorna null para slug inexistente", () => {
    expect(getPost("post-inexistente")).toBeNull();
  });
});
