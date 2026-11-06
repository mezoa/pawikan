import type { Metric } from "@/lib/content/schema";

export function MetricChip({ metric }: { metric: Metric }) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 rounded-md border border-border bg-chip px-2 py-1 text-sm">
      <span className="font-mono text-xs text-chip-foreground">
        {metric.kind}
      </span>
      <span className="font-mono font-medium">{metric.value}</span>
      <span className="text-chip-foreground">{metric.label}</span>
    </span>
  );
}
