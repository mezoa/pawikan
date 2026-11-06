"use client";

import { useEffect, useRef } from "react";

const CAN_RUN =
  "(min-width: 80rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function hasWebGL() {
  const context = document.createElement("canvas").getContext("webgl");
  context?.getExtension("WEBGL_lose_context")?.loseContext();
  return Boolean(context);
}

function savesData() {
  const { connection } = navigator as Navigator & {
    connection?: { saveData?: boolean };
  };
  return connection?.saveData === true;
}

function afterFirstPaint(run: () => void) {
  const idle = () => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 2000 });
    } else {
      setTimeout(run, 300);
    }
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

// The hexagon pattern beside the hero text. It is plain CSS, so the hero looks
// finished with no JavaScript. On a large screen with a mouse, the 3D scene
// loads after first paint and fades in over it. It is never loaded on phones,
// with reduced motion, without WebGL or with data saving on.
export function HeroArt() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const art = ref.current;
    if (!art) return;
    if (!window.matchMedia(CAN_RUN).matches || savesData() || !hasWebGL()) return;

    let cancelled = false;
    let stop: (() => void) | null | undefined;
    let canvas: HTMLCanvasElement | undefined;

    const remove = () => {
      stop?.();
      stop = undefined;
      canvas?.remove();
      art.classList.remove("is-live");
    };

    afterFirstPaint(async () => {
      if (cancelled) return;
      const { startHeroScene } = await import("@/lib/hero-scene");
      if (cancelled) return;

      canvas = document.createElement("canvas");
      art.append(canvas);
      stop = startHeroScene(
        canvas,
        () => art.classList.add("is-live"),
        remove,
      );
      if (!stop) remove();
    });

    return () => {
      cancelled = true;
      remove();
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="hero-art" />;
}
