import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #7c3aed, #a855f7, #6d28d9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "white",
            letterSpacing: -1,
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
