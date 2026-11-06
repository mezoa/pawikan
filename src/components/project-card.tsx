import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CountUp } from "@/components/count-up";
import { Tilt } from "@/components/tilt";
import {
  outcomesFirst,
  statusLabels,
  type Project,
} from "@/lib/content/projects";

const MAX_CHIPS = 3;
const MAX_METRICS = 2;

// A uniform card. It spans six rows of the parent grid and shares them through
// subgrid, so every row lines up across cards even when one title wraps. That
// also pins the metric row above the footer, with the big numbers level. The
// whole card is one link: the ::after layer stretches the title's link over it.
export function ProjectCard({ project }: { project: Project }) {
  const metrics = outcomesFirst(project.metrics).slice(0, MAX_METRICS);
  // The role field can run to several sentences. The first one is the short role.
  const role = project.role.split(".")[0];

  return (
    <Tilt
      as="li"
      className="sunset-edge relative isolate row-span-6 grid grid-rows-subgrid gap-y-3 rounded-xl p-5 text-card-foreground"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="shrink-0 rounded-md border border-border bg-chip px-2 py-0.5 text-sm">
          {statusLabels[project.status]}
        </span>
        <span className="pt-0.5 text-right text-sm text-muted-foreground">
          {role}
        </span>
      </div>

      <h3 className="text-lg font-semibold">
        <Link
          href={`/projects/${project.slug}`}
          className="after:absolute after:inset-0"
        >
          {project.title}
        </Link>
      </h3>

      <p className="line-clamp-4 text-muted-foreground">{project.summary}</p>

      <ul className="flex flex-wrap content-start gap-1.5" aria-label="Tech stack">
        {project.techStack.slice(0, MAX_CHIPS).map((tech) => (
          <li
            key={tech}
            className="rounded-md border border-border bg-chip px-2 py-0.5 text-sm"
          >
            {tech}
          </li>
        ))}
      </ul>

      <dl className="grid grid-cols-2 gap-x-4 pt-1">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col-reverse justify-end">
            <dt className="mt-1 text-sm text-muted-foreground">
              {metric.label}
              {metric.kind === "scope" && ", scope"}
            </dt>
            <dd className="font-mono text-xl font-semibold tracking-tight">
              {/* A bracketed extra, such as (0.93), stays on the project page. */}
              <CountUp value={metric.value.replace(/\s*\(.*\)$/, "")} />
            </dd>
          </div>
        ))}
      </dl>

      <p className="flex items-center gap-2 border-t border-border pt-3 text-primary">
        Read the case study
        <ArrowRight aria-hidden="true" className="card-arrow size-4" />
      </p>
    </Tilt>
  );
}
