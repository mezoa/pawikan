"use client";

import { animate, inView } from "motion";
import { useEffect, useRef } from "react";

const NUMBER = /\d+(?:\.\d+)?/;

// Counts the first number in a metric up from zero, once, as it scrolls into
// view. "13 of 14" counts the 13 only, because the 14 is a fixed total. The
// real value is always in the HTML, so it shows if JavaScript is off, and it
// comes back at the end. Use it in monospaced text: padding each number to its
// final width keeps the layout from shifting. Anything already on screen, and
// every visitor who asks for reduced motion, gets no animation.
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const match = value.match(NUMBER);
    if (!element || !match || match.index === undefined) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    const [number] = match;
    const before = value.slice(0, match.index);
    const after = value.slice(match.index + number.length);
    const decimals = number.split(".")[1]?.length ?? 0;
    let count: ReturnType<typeof animate> | undefined;

    const stop = inView(element, () => {
      count = animate(0, Number(number), {
        duration: 0.4,
        ease: "easeOut",
        onUpdate: (current) => {
          const text = current.toFixed(decimals).padStart(number.length, " ");
          element.textContent = `${before}${text}${after}`;
        },
        onComplete: () => {
          element.textContent = value;
        },
      });
    });

    return () => {
      stop();
      count?.stop();
      element.textContent = value;
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
