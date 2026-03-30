import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Website Upgraders: Managed Websites for Small Businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 40%, #2d1b4e 70%, #0a0a0f 100%)",
          position: "relative",
        }}
      >
        {/* Purple glow top-right */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
          }}
        />
        {/* Indigo glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: 800,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "24px",
          }}
        >
          S&C
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#f0f0f5",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: "900px",
            marginBottom: "16px",
          }}
        >
          Your Website,{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Managed for You
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            color: "#9595a8",
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Professional websites built, deployed, and managed for small businesses.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            gap: "32px",
            fontSize: "18px",
            color: "#5a5a6e",
          }}
        >
          <span>website-upgraders.vercel.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
