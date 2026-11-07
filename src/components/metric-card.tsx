import { CountUp } from "@/components/count-up";
import type { Metric } from "@/lib/content/schema";

// Notes are plain text from the frontmatter. These parts must not break across
// lines: a date (2026-10-26), or a command with a short flag (pytest -m db).
const KEEP_TOGETHER = /(\d{4}-\d{2}-\d{2}|\S+ -[a-z] [^\s.,]+)/;

function keepTogether(note: string) {
  // split with a capture group puts each match at an odd index.
  return note.split(KEEP_TOGETHER).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

// One metric as a card. Large cards are the key numbers at the top of a project
// page. Small cards add the note that says how the number was measured. The
// kind stays printed on both, so a scope number never reads as a result.
export function MetricCard({
  metric,
  large = false,
}: {
  metric: Metric;
  large?: boolean;
}) {
  return (
    <div className="quiet-card flex h-full flex-col gap-1 rounded-xl bg-card p-4 text-card-foreground ring-1">
      <p className="font-mono text-sm text-muted-foreground">{metric.kind}</p>
      <p
        className={`font-mono font-semibold ${large ? "text-3xl tracking-tight" : "text-xl"}`}
      >
        <CountUp value={metric.value} />
      </p>
      <p className={large ? "mt-1" : "font-medium"}>{metric.label}</p>
      {!large && metric.note && (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {keepTogether(metric.note)}
        </p>
      )}
    </div>
  );
}
