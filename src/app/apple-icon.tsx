import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #7c3aed, #a855f7, #6d28d9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 100,
            fontWeight: 800,
            color: "white",
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          W
        </span>
      </div>
    ),
    { ...size }
  );
}
