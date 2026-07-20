import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "linear-gradient(165deg, #2f74b8 0%, #4f98d4 45%, #9ecae8 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>
          {SITE.name}
        </div>
        <div style={{ fontSize: 28, opacity: 0.9, marginTop: 12, maxWidth: 800 }}>
          {SITE.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
