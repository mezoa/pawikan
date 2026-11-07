import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// The shared look of the social preview images and the browser icon.
// next/og cannot read CSS variables, so these hex values are copied by hand from
// the .dark tokens in src/app/globals.css. If a token changes, change it here too.
const BACKGROUND = "#150b0d"; // --background
const TEXT = "#fff1e6"; // --foreground, 17.48:1 on BACKGROUND
const MUTED = "#d1ae9d"; // --muted-foreground, 9.44:1 on BACKGROUND
const AMBER = "#fbbf24"; // --sunset-amber
const ORANGE = "#f97316"; // --sunset-orange
const ROSE = "#f43f5e"; // --sunset-rose

export const CARD_SIZE = { width: 1200, height: 630 };

/** The six corners of a hexagon with a point at the top, as an SVG points list. */
export function hexagonPoints(x: number, y: number, radius: number) {
  return [30, 90, 150, 210, 270, 330]
    .map((degrees) => {
      const angle = (degrees * Math.PI) / 180;
      const cornerX = x + radius * Math.cos(angle);
      const cornerY = y + radius * Math.sin(angle);
      return `${cornerX.toFixed(2)},${cornerY.toFixed(2)}`;
    })
    .join(" ");
}

/** Amber through orange to rose, shared by the card and the icon. */
export function sunsetStops() {
  return (
    <>
      <stop offset="0%" stopColor={AMBER} />
      <stop offset="50%" stopColor={ORANGE} />
      <stop offset="100%" stopColor={ROSE} />
    </>
  );
}

// The turtle-shell pattern from the site's hero, as a cluster running off the top
// right corner. Each row is one shorter, so the pattern steps up and away from the
// text in the bottom left, and no colour sits behind it. Hexagons fade with distance.
const HEX_RADIUS = 66;
const HEX_WIDTH = HEX_RADIUS * Math.sqrt(3) + 8;
const HEX_ROW_HEIGHT = HEX_RADIUS * 1.5 + 7;

function ShellPattern() {
  const hexagons = [5, 4, 3, 2].flatMap((count, row) =>
    Array.from({ length: count }, (_, column) => ({
      key: `${row}-${column}`,
      x: 1240 - column * HEX_WIDTH - (row % 2 ? HEX_WIDTH / 2 : 0),
      y: -20 + row * HEX_ROW_HEIGHT,
      opacity: Math.max(0.3, 0.95 - (row + column) * 0.12),
    })),
  );

  return (
    <svg
      width={CARD_SIZE.width}
      height={CARD_SIZE.height}
      viewBox={`0 0 ${CARD_SIZE.width} ${CARD_SIZE.height}`}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <defs>
        <linearGradient
          id="shell"
          gradientUnits="userSpaceOnUse"
          x1="1200"
          y1="0"
          x2="880"
          y2="240"
        >
          {sunsetStops()}
        </linearGradient>
      </defs>
      {hexagons.map(({ key, x, y, opacity }) => (
        <polygon
          key={key}
          points={hexagonPoints(x, y, HEX_RADIUS)}
          fill="url(#shell)"
          opacity={opacity}
        />
      ))}
    </svg>
  );
}

/** One preview image: a large title, and the name below it when there is one. */
export async function renderCard({
  title,
  name,
}: {
  title: string;
  name?: string;
}) {
  const font = await readFile(
    join(
      process.cwd(),
      "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf",
    ),
  );

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        padding: 72,
        background: BACKGROUND,
        fontFamily: "Geist",
      }}
    >
      <ShellPattern />
      <div
        style={{
          width: 800,
          color: TEXT,
          // Long titles step down one size, so they stay on two or three lines.
          fontSize: title.length > 24 ? 72 : 88,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          textWrap: "balance",
        }}
      >
        {title}
      </div>
      {name && (
        <div style={{ marginTop: 28, color: MUTED, fontSize: 36 }}>{name}</div>
      )}
    </div>,
    {
      ...CARD_SIZE,
      fonts: [{ name: "Geist", data: font, weight: 600, style: "normal" }],
    },
  );
}

export { BACKGROUND };
