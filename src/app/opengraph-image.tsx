import { CARD_SIZE, renderCard } from "./og-card";

const HEADLINE =
  "Meo Angelo Alcantara, full-stack developer building AI automation";

export const alt = `Title card with the words: ${HEADLINE}.`;
export const size = CARD_SIZE;
export const contentType = "image/png";

// The headline already has the name, so the card does not print it twice.
export default function OpengraphImage() {
  return renderCard({ title: HEADLINE });
}
