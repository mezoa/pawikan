import type { ProjectChart } from "@/lib/content/schema";

// A bar chart built as a real table, so screen readers get the data and it needs
// no chart library. One colour, because the bars show one measure. The fill is
// the control border colour: orange means "you can act on this". Each bar is a
// share of its own total, so bars with different totals stay comparable, and
// the printed value always shows the real count.
export function ProofChart({ chart }: { chart: ProjectChart }) {
  return (
    <figure className="my-6">
      <table className="w-full border-collapse text-left">
        <caption className="mb-3 text-left font-medium">{chart.title}</caption>
        {chart.groups.map((group, index) => (
          <tbody key={group.name ?? index}>
            {group.name && (
              <tr>
                <th
                  colSpan={2}
                  scope="rowgroup"
                  className="pt-3 pb-1 font-medium text-muted-foreground"
                >
                  {group.name}
                </th>
              </tr>
            )}
            {group.rows.map((row) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  className="w-2/5 py-1 pr-4 align-middle text-sm font-normal"
                >
                  {row.label}
                </th>
                <td className="py-1 align-middle">
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden="true"
                      className="h-3 min-w-0 flex-1 overflow-hidden rounded-sm bg-secondary ring-1 ring-border"
                    >
                      <div
                        className="h-full bg-border"
                        style={{ width: `${(row.value / row.max) * 100}%` }}
                      />
                    </div>
                    <span className="w-20 shrink-0 text-right font-mono text-sm whitespace-nowrap">
                      {row.display}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
      {chart.caption && (
        <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {chart.caption}
        </figcaption>
      )}
    </figure>
  );
}
