import type { ComponentProps } from "react";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";

// Tailwind removes the browser's default text styles, so MDX body text gets
// its basic look here. Polish comes later.
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
};
