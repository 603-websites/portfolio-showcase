import { ImageResponse } from "next/og";

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
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #1e1040 100%)",
          position: "relative",
        }}
      >
        {/* Logo box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1,
            }}
          >
            W
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#f0f0f5",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "8px",
          }}
        >
          Website Upgraders
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#a78bfa",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          Your Website, Managed for You
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "22px",
            color: "#8585a0",
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
            fontSize: "18px",
            color: "#4a4a60",
          }}
        >
          <span>website-upgraders.vercel.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
