import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";

export const alt = "Blog Weatherly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogOgImage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Blog Weatherly";
  const kicker = post?.kicker ?? "Weatherly";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 64,
          background: "linear-gradient(165deg, #1c2b4a 0%, #2f4063 50%, #4f657c 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.7, marginBottom: 12 }}>
          Weatherly · {kicker}
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: -1,
            maxWidth: 1000,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}
