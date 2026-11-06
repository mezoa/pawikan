import { TriangleAlert } from "lucide-react";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { AgilaFlow } from "@/components/agila-flow";
import { MetricCard } from "@/components/metric-card";
import { ProofChart } from "@/components/proof-chart";
import { ThreeBoxFlow } from "@/components/three-box-flow";
import { publicFileExists, type Project } from "@/lib/content/projects";

// MDX runs with JavaScript blocked, so these components take plain text props.
// Anything structured (metrics, chart data) comes from the project's frontmatter.

/** A short highlighted note. */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-5 rounded-lg border-l-4 border-border bg-secondary px-4 py-1 text-secondary-foreground">
      {children}
    </div>
  );
}

/** An image with alt text and an optional caption. The build fails without both a file and alt text. */
export function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 800,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  if (!alt?.trim()) throw new Error(`Figure "${src}" needs alt text.`);
  if (!publicFileExists(src)) {
    throw new Error(`Figure "${src}" has no matching file in public/.`);
  }

  return (
    <figure className="my-6">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full rounded-lg ring-1 ring-border"
      />
      {caption && (
        <figcaption className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Real program output. Long lines wrap, so a phone needs no sideways scroll. */
export function Transcript({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-6 [&_pre]:my-0 [&_pre]:break-words [&_pre]:whitespace-pre-wrap">
      {children}
      <figcaption className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

/** Holds a group of Tradeoff cards. */
export function Tradeoffs({ children }: { children: ReactNode }) {
  return <div className="my-5 grid gap-3 sm:grid-cols-2">{children}</div>;
}

/** One tool. Leave out tradeoff unless a source names one. */
export function Tradeoff({
  tool,
  what,
  tradeoff,
}: {
  tool: string;
  what: string;
  tradeoff?: string;
}) {
  return (
    <div className="quiet-card flex flex-col gap-2 rounded-xl bg-card p-4 text-card-foreground ring-1">
      <h3 className="font-semibold">{tool}</h3>
      <dl className="flex flex-col gap-2">
        <div>
          <dt className="text-sm text-muted-foreground">What</dt>
          <dd>{what}</dd>
        </div>
        {tradeoff && (
          <div>
            <dt className="text-sm text-muted-foreground">Trade-off</dt>
            <dd>{tradeoff}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

// Tailwind removes the browser's default text styles, so MDX body text gets
// its basic look here.
export const mdxComponents: MDXRemoteProps["components"] = {
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="mt-10 mb-3 text-2xl font-semibold" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="mt-6 mb-2 text-xl font-semibold" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="my-4 leading-relaxed" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="my-4 list-disc space-y-1 pl-6" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="my-4 list-decimal space-y-1 pl-6" {...props} />
  ),
  a: (props: ComponentProps<"a">) => (
    <a className="text-primary underline underline-offset-4" {...props} />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="my-4 border-l-2 border-border pl-4 text-muted-foreground"
      {...props}
    />
  ),
  code: (props: ComponentProps<"code">) => (
    <code className="font-mono text-[0.9em]" {...props} />
  ),
  pre: (props: ComponentProps<"pre">) => (
    <pre className="my-4 overflow-x-auto rounded-md bg-muted p-4" {...props} />
  ),
  // The wrapper lets a wide table scroll sideways on a phone. tabIndex lets
  // keyboard users focus it and scroll with the arrow keys.
  table: (props: ComponentProps<"table">) => (
    <div className="my-4 overflow-x-auto" tabIndex={0}>
      <table className="w-full border-collapse text-left" {...props} />
    </div>
  ),
  th: (props: ComponentProps<"th">) => (
    <th className="border-b border-border py-2 pr-4 font-semibold" {...props} />
  ),
  td: (props: ComponentProps<"td">) => (
    <td className="border-b border-border py-2 pr-4 align-top" {...props} />
  ),
  AgilaFlow,
  Callout,
  Figure,
  ThreeBoxFlow,
  Transcript,
  Tradeoffs,
  Tradeoff,
};

// In Limitations and failure modes, each list item gets a warning icon.
const limitationComponents: MDXRemoteProps["components"] = {
  ul: (props: ComponentProps<"ul">) => (
    <ul
      className="my-4 flex flex-col gap-3 rounded-lg bg-secondary p-4 text-secondary-foreground"
      {...props}
    />
  ),
  li: ({ children, ...props }: ComponentProps<"li">) => (
    <li className="flex gap-3 leading-relaxed" {...props}>
      <TriangleAlert
        aria-hidden="true"
        className="mt-1 size-4 shrink-0 text-border"
      />
      <span>{children}</span>
    </li>
  ),
};

/** The MDX components for one heading of one project. */
export function componentsFor(
  project: Project,
  heading: string,
): MDXRemoteProps["components"] {
  return {
    ...mdxComponents,
    ...(heading === "Limitations and failure modes" && limitationComponents),
    MetricRow: ({ kind }: { kind?: Project["metrics"][number]["kind"] }) => (
      <ul className="my-5 grid gap-3 sm:grid-cols-2" aria-label="Metrics">
        {project.metrics
          .filter((metric) => !kind || metric.kind === kind)
          .map((metric) => (
            <li key={metric.label}>
              <MetricCard metric={metric} />
            </li>
          ))}
      </ul>
    ),
    ProjectChart: () =>
      project.chart ? <ProofChart chart={project.chart} /> : null,
  };
}
