import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(165deg, #2f74b8 0%, #4f98d4 45%, #9ecae8 100%)",
          color: "#fff",
          fontSize: 110,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: -4,
        }}
      >
        W
      </div>
    ),
    { ...size }
  );
}
