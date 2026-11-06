import { MetricChip } from "@/components/metric-chip";
import { Badge } from "@/components/ui/badge";
import { BentoCard } from "@/components/ui/bento-grid";
import type { Project } from "@/lib/content/projects";

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <BentoCard
      name={project.title}
      description={project.summary}
      href={`/projects/${project.slug}`}
      className={className}
    >
      <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
        {project.techStack.slice(0, 2).map((tech) => (
          <li key={tech}>
            <Badge variant="secondary">{tech}</Badge>
          </li>
        ))}
      </ul>
      <ul className="mt-auto flex flex-wrap gap-2" aria-label="Metrics">
        {project.metrics.slice(0, 2).map((metric) => (
          <li key={metric.label}>
            <MetricChip metric={metric} />
          </li>
        ))}
      </ul>
    </BentoCard>
  );
}
