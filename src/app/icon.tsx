import { ImageResponse } from "next/og";
import { BACKGROUND, hexagonPoints, sunsetStops } from "./og-card";

// One shell hexagon on a dark tile. The tile keeps it visible on a pale browser tab.
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        borderRadius: 11,
        background: BACKGROUND,
      }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48">
        <defs>
          <linearGradient id="shell" x1="0" y1="0" x2="1" y2="1">
            {sunsetStops()}
          </linearGradient>
        </defs>
        <polygon points={hexagonPoints(24, 24, 19)} fill="url(#shell)" />
      </svg>
    </div>,
    size,
  );
}
