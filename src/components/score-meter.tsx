import { CountUp } from "@/components/count-up";

// One score on a fixed 0 to 100 scale. A flat bar on purpose: the design rules
// allow no circles. The fill uses the control border colour because orange
// means "you can act on this", and the printed number carries the meaning.
export function ScoreMeter({
  label,
  score,
  grade,
}: {
  label: string;
  score: number;
  grade: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="font-mono text-5xl font-semibold tracking-tight sm:text-6xl">
          <CountUp value={score.toFixed(1)} />
          <span className="ml-2 text-lg font-normal tracking-normal text-muted-foreground">
            / 100
          </span>
        </p>
        <p className="sm:text-right">
          <span className="block font-medium">{label}</span>
          <span className="block text-sm text-muted-foreground">{grade}</span>
        </p>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-valuetext={`${score.toFixed(1)} out of 100, ${grade}`}
        className="mt-3 h-3 overflow-hidden rounded-sm bg-secondary ring-1 ring-border"
      >
        <div className="h-full bg-border" style={{ width: `${score}%` }} />
      </div>
      <div
        aria-hidden="true"
        className="mt-1 flex justify-between font-mono text-sm text-muted-foreground"
      >
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}
