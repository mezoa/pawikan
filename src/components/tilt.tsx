"use client";

import { animate } from "motion";
import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

const MAX_DEGREES = 2;
const DESKTOP_MOUSE =
  "(hover: hover) and (pointer: fine) and (min-width: 64rem) and (prefers-reduced-motion: no-preference)";

// A card whose surface (fill, outline, hover line) tilts toward the pointer on
// desktop. Only the surface moves: the text sits on the card itself, so it
// stays perfectly still. The perspective scales with the card, so a wide card
// swings no further than a narrow one. Touch, small screens and reduced motion
// get a flat card, because this only starts when DESKTOP_MOUSE matches.
export function Tilt({
  as: Tag = "div",
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: "article" | "div" | "li";
  children: ReactNode;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const surfaceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const surface = surfaceRef.current;
    if (!card || !surface) return;

    const query = window.matchMedia(DESKTOP_MOUSE);
    let towardX = 0;
    let towardY = 0;
    let strength = 0;
    let fade: ReturnType<typeof animate> | undefined;

    const draw = () => {
      const size = Math.max(1, Math.hypot(towardX, towardY));
      const angle = MAX_DEGREES * strength;
      surface.style.transform = `perspective(${card.offsetWidth * 4}px) rotateX(${(-towardY / size) * angle}deg) rotateY(${(towardX / size) * angle}deg)`;
    };

    const easeTo = (target: number, onComplete?: () => void) => {
      fade?.stop();
      fade = animate(strength, target, {
        duration: 0.2,
        ease: "easeOut",
        onUpdate: (value) => {
          strength = value;
          draw();
        },
        onComplete,
      });
    };

    const track = (event: PointerEvent) => {
      const box = card.getBoundingClientRect();
      towardX = ((event.clientX - box.left) / box.width - 0.5) * 2;
      towardY = ((event.clientY - box.top) / box.height - 0.5) * 2;
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !query.matches) return;
      track(event);
      easeTo(1);
    };

    const onMove = (event: PointerEvent) => {
      if (strength === 0 || event.pointerType !== "mouse") return;
      track(event);
      draw();
    };

    const onLeave = () => {
      if (strength > 0) {
        easeTo(0, () => {
          surface.style.transform = "";
        });
      }
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);

    return () => {
      fade?.stop();
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      surface.style.transform = "";
    };
  }, []);

  return (
    <Tag ref={cardRef as never} {...props}>
      <span
        ref={surfaceRef}
        aria-hidden="true"
        className="card-surface hover-line"
      />
      {children}
    </Tag>
  );
}
