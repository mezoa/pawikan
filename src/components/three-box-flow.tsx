import { ArrowDown, ArrowRight } from "lucide-react";
import { Fragment } from "react";

// A generic three-tier diagram: Browser, API, Database. It is real text, so it
// stays sharp and screen readers can read it. Each project's wording comes from
// its MDX file, so nothing about a project lives in this component.
export function ThreeBoxFlow({
  browser,
  api,
  database,
  caption,
}: {
  browser: string;
  api: string;
  database: string;
  caption: string;
}) {
  const boxes = [
    { name: "Browser", detail: browser },
    { name: "API", detail: api },
    { name: "Database", detail: database },
  ];

  return (
    <figure className="my-6">
      <ol className="flex flex-col items-stretch gap-1 sm:flex-row sm:items-center">
        {boxes.map(({ name, detail }, index) => (
          <Fragment key={name}>
            {index > 0 && (
              <li
                aria-hidden="true"
                className="flex shrink-0 justify-center text-border"
              >
                <ArrowDown className="size-4 sm:hidden" />
                <ArrowRight className="hidden size-4 sm:block" />
              </li>
            )}
            <li className="quiet-card flex-1 rounded-lg bg-card p-3 text-sm text-card-foreground ring-1">
              <span className="block font-medium">{name}</span>
              {detail}
            </li>
          </Fragment>
        ))}
      </ol>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
