import { ArrowDown, ArrowRight } from "lucide-react";

// Boxes joined by arrows, in reading order. MDX runs with JavaScript blocked, so
// an array prop would vanish. nodes and notes are plain text with a | between
// items. The first note belongs to the first box, and a note can be left empty:
//   <ArchitectureDiagram nodes="Web app | API" notes="Runs in the browser |" />

function splitItems(text: string) {
  return text.split("|").map((item) => item.trim());
}

export function ArchitectureDiagram({
  nodes,
  notes = "",
  caption,
}: {
  nodes: string;
  notes?: string;
  caption?: string;
}) {
  const names = splitItems(nodes);
  const details = notes ? splitItems(notes) : [];

  // Same as Figure: a mistake in the MDX fails the build, not the live page.
  if (names.some((name) => !name)) {
    throw new Error(`ArchitectureDiagram has an empty box in "${nodes}".`);
  }
  if (details.length > names.length) {
    throw new Error(`ArchitectureDiagram has more notes than boxes: "${notes}".`);
  }

  const boxes = names.map((name, index) => ({
    name,
    note: details[index] ?? "",
  }));

  // role="img" hides everything inside from screen readers, so the label has to
  // carry the notes too, or those users would miss them.
  const label = boxes
    .map(({ name, note }) => (note ? `${name} (${note})` : name))
    .join(", then ");

  return (
    <figure className="my-6">
      <div
        role="img"
        aria-label={`Diagram, in order: ${label}`}
        className="flex flex-col gap-1 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:gap-2"
      >
        {boxes.map(({ name, note }, index) => (
          // The first box has no arrow, so its basis is smaller by the arrow's
          // 1.5rem. That keeps every box the same width on a row.
          <div
            key={name}
            className="flex flex-col gap-1 min-[480px]:flex-[1_1_8rem] min-[480px]:flex-row min-[480px]:gap-2 min-[480px]:first:basis-[6.5rem]"
          >
            {index > 0 && (
              <span aria-hidden="true" className="shrink-0 self-center text-border">
                <ArrowDown className="size-4 min-[480px]:hidden" />
                <ArrowRight className="hidden size-4 min-[480px]:block" />
              </span>
            )}
            <div className="quiet-card flex-1 rounded-lg bg-card p-3 text-sm text-card-foreground ring-1">
              <span className="block font-medium">{name}</span>
              {note}
            </div>
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
