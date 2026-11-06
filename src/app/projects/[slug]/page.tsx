import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { MetricCard } from "@/components/metric-card";
import { componentsFor, Figure } from "@/components/mdx-components";
import { getProject, getSlugs, type Project } from "@/lib/content/projects";

// Only the addresses from generateStaticParams exist. Anything else is a 404.
export const dynamicParams = false;

const KEY_NUMBERS = 4;

// The word shown on the page. "live" would suggest a public service.
const statusLabels: Record<Project["status"], string> = {
  live: "Released",
  building: "In progress",
  archived: "Archived",
};

const linkClass =
  "inline-flex min-h-6 items-center text-primary underline underline-offset-4";

function periodOf(project: Project) {
  return (
    project.period ??
    project.date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
  );
}

function ProjectLinks({
  links,
  label,
}: {
  links: { label: string; href: string }[];
  label: string;
}) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label={label}>
      {links.map((link) => (
        <li key={link.label}>
          <a href={link.href} className={linkClass}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

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
  ].filter((link): link is { label: string; href: string } =>
    Boolean(link.href),
  );

  // Results first, then size. The sort keeps each group in file order.
  const keyNumbers = [...project.metrics]
    .sort((a, b) => Number(a.kind === "scope") - Number(b.kind === "scope"))
    .slice(0, KEY_NUMBERS);

  const headings = project.sections.filter((section) => section.heading);

  return (
    <article>
      <header className="relative isolate pt-24 pb-12 lg:pt-12">
        <div aria-hidden="true" className="wash-top" />
        <div
          className={`page-frame grid gap-8 ${project.heroImage ? "lg:grid-cols-2 lg:items-center" : ""}`}
        >
          <div className="flex max-w-[65ch] flex-col gap-5">
            <Link
              href="/"
              className="inline-flex min-h-6 items-center gap-2 self-start rounded-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-primary motion-reduce:transition-none"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to home
            </Link>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {project.title}
            </h1>
            <p className="text-lg leading-relaxed">{project.summary}</p>
            <p className="leading-relaxed text-muted-foreground">
              {project.role}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="rounded-md border border-border bg-chip px-2 py-0.5 text-sm">
                {statusLabels[project.status]}
              </span>
              <span className="font-mono text-sm text-muted-foreground">
                {periodOf(project)}
              </span>
            </div>
            {links.length > 0 && (
              <ProjectLinks links={links} label="Project links" />
            )}
            {project.privacyNote && (
              <p className="border-l-2 border-border pl-4 text-muted-foreground">
                {project.privacyNote}
              </p>
            )}
          </div>
          {project.heroImage && (
            <Image
              src={project.heroImage.src}
              alt={project.heroImage.alt}
              width={project.heroImage.width}
              height={project.heroImage.height}
              priority
              className="h-auto w-full rounded-xl ring-1 ring-border"
            />
          )}
        </div>
      </header>

      <section aria-label="Key numbers" className="section-band py-10">
        <ul className="page-frame grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {keyNumbers.map((metric) => (
            <li key={metric.label}>
              <MetricCard metric={metric} large />
            </li>
          ))}
        </ul>
      </section>

      <div className="page-frame grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[10rem_minmax(0,65ch)_18rem] xl:justify-between">
        <nav
          aria-label="On this page"
          className="lg:col-start-1 lg:row-start-1 xl:sticky xl:top-6 xl:self-start"
        >
          <p className="font-medium">On this page</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 xl:flex-col">
            {headings.map(({ id, heading }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-flex min-h-6 items-center rounded-sm text-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-primary motion-reduce:transition-none"
                >
                  {heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* The panel can scroll by itself on a short screen. tabIndex lets
            keyboard users reach that scroll. */}
        <aside
          aria-labelledby="at-a-glance"
          tabIndex={0}
          className="quiet-card flex flex-col gap-4 rounded-xl bg-card p-4 text-card-foreground ring-1 lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto xl:col-start-3 xl:row-span-1"
        >
          <h2 id="at-a-glance" className="text-lg font-semibold">
            At a glance
          </h2>
          <div>
            <h3 className="text-sm text-muted-foreground">Role</h3>
            <p className="mt-1 leading-relaxed">{project.role}</p>
          </div>
          <div>
            <h3 className="text-sm text-muted-foreground">Stack</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md border border-border bg-chip px-2 py-0.5 text-sm"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
          {links.length > 0 && (
            <div>
              <h3 className="text-sm text-muted-foreground">Links</h3>
              <div className="mt-1">
                <ProjectLinks links={links} label="Links in this panel" />
              </div>
            </div>
          )}
        </aside>

        <div className="flex min-w-0 flex-col gap-12 lg:col-start-1 lg:row-start-2 xl:col-start-2 xl:row-start-1">
          {project.sections.map(({ id, heading, body }) => (
            <section
              key={id || "intro"}
              aria-labelledby={heading ? `${id}-heading` : undefined}
              id={id || undefined}
              className="scroll-mt-6"
            >
              {heading && (
                <>
                  <h2 id={`${id}-heading`} className="text-2xl font-semibold">
                    {heading}
                  </h2>
                  <div aria-hidden="true" className="sunset-bar mt-3" />
                </>
              )}
              <div className="mt-4">
                <MDXRemote
                  source={body}
                  components={componentsFor(project, heading)}
                  options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                />
                {heading === "Proof of work" &&
                  project.gallery?.map((image) => (
                    <Figure
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      caption={image.caption}
                      width={image.width}
                      height={image.height}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
