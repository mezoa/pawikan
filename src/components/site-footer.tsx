import { ResumeLink } from "@/components/resume-link";

export function SiteFooter() {
  return (
    <footer className="page-frame relative isolate pb-40 text-muted-foreground lg:pb-56">
      <div aria-hidden="true" className="sunset-rule mb-10" />
      <p className="mb-2">
        <ResumeLink />
      </p>
      <p>Built with Next.js, Tailwind, shadcn/ui</p>
      <div aria-hidden="true" className="wash-bottom" />
    </footer>
  );
}
