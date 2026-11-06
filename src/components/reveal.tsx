"use client";

import { animate, inView } from "motion";
import { useEffect, useRef, type ReactNode } from "react";

// Fades content in once as it scrolls into view. The content is always in the
// page's HTML at full opacity, and this only hides it after the page loads, so
// it stays readable if JavaScript is slow or off. Anything already on screen,
// and every visitor who asks for reduced motion, gets no animation at all.
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

    element.style.opacity = "0";
    const stop = inView(
      element,
      () => {
        animate(
          element,
          { opacity: [0, 1], y: [12, 0] },
          { duration: 0.4, ease: "easeOut" },
        );
      },
      { amount: 0.1 },
    );

    return () => {
      stop();
      element.style.opacity = "";
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
