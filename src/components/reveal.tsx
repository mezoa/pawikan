"use client";

import { animate, inView } from "motion";
import { useEffect, useRef, type ReactNode } from "react";

// Fades content in once as it starts to scroll into view. Nothing is hidden in
// advance: the content stays at full opacity until the fade plays. If the fade
// never runs (print, a full-page capture, a tab that is not painting), the
// content is simply visible. Do not set opacity 0 ahead of the animation.
// Anything already on screen, and every visitor who asks for reduced motion,
// gets no animation at all.
export function Reveal({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    return inView(element, () => {
      animate(
        element,
        { opacity: [0, 1], y: [12, 0] },
        { duration: 0.4, ease: "easeOut" },
      );
    });
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
