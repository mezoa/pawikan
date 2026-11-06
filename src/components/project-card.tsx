import Link from "next/link";
import { MetricChip } from "@/components/metric-chip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Project } from "@/lib/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="sunset-edge relative h-full text-base">
      <CardHeader>
        <h3 className="text-lg font-semibold">
          {/* The ::after layer stretches this link over the whole card. */}
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-muted-foreground">{project.summary}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.techStack.map((tech) => (
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
      </CardContent>
    </Card>
  );
}
