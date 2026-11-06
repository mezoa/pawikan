import type { ReactNode } from "react";
import { isTodo, profile } from "../../content/profile";
import { ProjectCard } from "@/components/project-card";
import { BentoGrid } from "@/components/ui/bento-grid";
import { getAllProjects } from "@/lib/content/projects";

const linkClass =
  "inline-flex min-h-6 items-center text-primary underline underline-offset-4";

// Bento pattern on the 12-column grid: wide + narrow, then narrow + wide.
const bentoSpans = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-7",
];

function Section({
  id,
  label,
  title,
  band = false,
  stacked = false,
  children,
}: {
  id: string;
  label: string;
  title: string;
  band?: boolean;
  stacked?: boolean; // heading above the content, not beside it
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`${band ? "peach-band " : ""}${stacked ? "" : "lg:grid-cols-[14rem_minmax(0,1fr)] "}grid gap-6 py-14 dark:py-10`}
    >
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <h2 id={`${id}-heading`} className="mt-1 text-xl font-semibold">
          {title}
        </h2>
        <div aria-hidden="true" className="sunset-bar mt-3" />
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function ContactLinks({ label }: { label: string }) {
  const { github, linkedin, email } = profile.links;
  const links = [
    { name: "GitHub", value: github, href: github },
    { name: "LinkedIn", value: linkedin, href: linkedin },
    { name: "Email", value: email, href: `mailto:${email}` },
  ];

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label={label}>
      {links.map(({ name, value, href }) => (
        <li key={name}>
          {/* A TODO stays plain text, so it can never become a broken link. */}
          {isTodo(value) ? (
            <span className="text-muted-foreground">
              {name}: link to be added
            </span>
          ) : (
            <a href={href} className={linkClass}>
              {name}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const featured = getAllProjects().filter((project) => project.featured);
  const { name, publication } = profile;
  const lastSpace = name.lastIndexOf(" ");

  return (
    <>
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="relative isolate pt-24 pb-16 sm:pb-24"
      >
        <div aria-hidden="true" className="wash-top" />
        <h1
          id="hero-heading"
          className="text-[clamp(3rem,12vw,7.5rem)] leading-none font-semibold tracking-tight"
        >
          <span className="block">{name.slice(0, lastSpace)}</span>{" "}
          <span className="block">{name.slice(lastSpace + 1)}</span>
        </h1>
        <p className="mt-8 text-xl font-medium sm:text-2xl">
          {profile.roleLine}
        </p>
        <p className="mt-4 max-w-[65ch] leading-relaxed text-muted-foreground">
          {profile.bio}
        </p>
        <p className="mt-4 max-w-[65ch] leading-relaxed text-muted-foreground">
          {profile.location}. {profile.availability}
        </p>
        <div className="mt-6">
          <ContactLinks label="Profile links" />
        </div>
      </section>

      <Section
        id="projects"
        label="Selected work"
        title="Featured projects"
        band
        stacked
      >
        {featured.length > 0 && (
          <BentoGrid>
            {featured.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                className={bentoSpans[index % bentoSpans.length]}
              />
            ))}
          </BentoGrid>
        )}
      </Section>

      <Section id="about" label="Background" title="About">
        <div className="flex max-w-[65ch] flex-col gap-8">
          <div className="flex flex-col gap-4 leading-relaxed">
            {profile.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-semibold">At a glance</h3>
            <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[7rem_minmax(0,1fr)]">
              {profile.about.atAGlance.map(({ label, value }) => (
                <div key={label} className="contents">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="mb-2 sm:mb-0">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section
        id="experience"
        label="Career so far"
        title="Experience and education"
        band
      >
        <div className="flex max-w-[65ch] flex-col gap-8">
          <div>
            <h3 className="text-lg font-semibold">Experience</h3>
            <ul className="mt-3 flex flex-col gap-4">
              {profile.experience.map((item) => (
                <li key={`${item.role}-${item.period}`}>
                  <p className="font-medium">{item.role}</p>
                  <p className="text-muted-foreground">
                    {item.organisation}, {item.period}
                  </p>
                  <p className="mt-1">{item.line}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Education</h3>
            <ul className="mt-3 flex flex-col gap-4">
              {profile.education.map((item) => (
                <li key={`${item.school}-${item.period}`}>
                  <p className="font-medium">{item.degree}</p>
                  <p className="text-muted-foreground">
                    {item.school}, {item.period}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="publication" label="Research" title="Publication">
        <div className="flex max-w-[65ch] flex-col gap-1">
          <p className="font-medium">{publication.title}</p>
          <p className="text-muted-foreground">
            {publication.venue}, {publication.year}
          </p>
          <p>
            <a href={publication.doi} className={linkClass}>
              Read the paper (DOI)
            </a>
          </p>
        </div>
      </Section>

      <Section id="contact" label="Get in touch" title="Contact" band>
        <ContactLinks label="Contact links" />
      </Section>
    </>
  );
}
