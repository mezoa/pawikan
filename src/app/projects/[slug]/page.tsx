import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx-components";
import { MetricChip } from "@/components/metric-chip";
import { Badge } from "@/components/ui/badge";
import { getProject, getSlugs } from "@/lib/content/projects";

// Only the addresses from generateStaticParams exist. Anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: `${project.title} | Meo Angelo Alcantara`,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const links = [
    { label: "Code repository", href: project.links.repo },
    { label: "Live demo", href: project.links.demo },
    { label: "Video", href: project.links.video },
    { label: "Paper", href: project.links.paper },
  ].filter((link) => link.href);

  return (
    <article className="py-12">
      <header className="flex max-w-[65ch] flex-col gap-5">
        <Link
          href="/"
          className="inline-flex min-h-6 items-center gap-2 self-start rounded-sm text-muted-foreground transition-colors duration-200 hover:text-primary motion-reduce:transition-none"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to home
        </Link>
        <h1 className="text-4xl font-semibold tracking-tight">
          {project.title}
        </h1>
        <p className="text-muted-foreground">{project.role}</p>

        <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.techStack.map((tech) => (
            <li key={tech}>
              <Badge variant="secondary">{tech}</Badge>
            </li>
          ))}
        </ul>

        <ul className="flex flex-col gap-3" aria-label="Metrics">
          {project.metrics.map((metric) => (
            <li key={metric.label}>
              <MetricChip metric={metric} />
              {metric.note && (
                <p className="mt-1 text-muted-foreground">{metric.note}</p>
              )}
            </li>
          ))}
        </ul>

        {links.length > 0 && (
          <ul className="flex flex-wrap gap-4" aria-label="Project links">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="inline-flex min-h-6 items-center text-primary underline underline-offset-4"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {project.privacyNote && (
          <p className="border-l-2 border-border pl-4 text-muted-foreground">
            {project.privacyNote}
          </p>
        )}
      </header>

      <div aria-hidden="true" className="sunset-rule mt-10 max-w-[65ch]" />

      <div className="mt-6 max-w-[65ch]">
        <MDXRemote
          source={project.body}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>
    </article>
  );
}
