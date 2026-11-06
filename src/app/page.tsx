import type { ReactNode } from "react";
import { isTodo, profile } from "../../content/profile";
import { ProjectCard } from "@/components/project-card";
import { getAllProjects } from "@/lib/content/projects";

const linkClass =
  "inline-flex min-h-6 items-center text-primary underline underline-offset-4";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="grid gap-6 py-10 lg:grid-cols-[14rem_minmax(0,1fr)]"
    >
      <h2 id={`${id}-heading`} className="text-xl font-semibold">
        {title}
      </h2>
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
        className="relative isolate py-16 sm:py-24"
      >
        <div aria-hidden="true" className="hero-glow" />
        <div aria-hidden="true" className="sunset-rule absolute inset-x-0 bottom-0" />
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

      <Section id="projects" title="Featured projects">
        {featured.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {featured.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="about" title="About">
        <div className="flex max-w-[65ch] flex-col gap-4 leading-relaxed">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>{profile.availability}</p>
        </div>
      </Section>

      <Section id="experience" title="Experience and education">
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

      <Section id="publication" title="Publication">
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

      <Section id="contact" title="Contact">
        <ContactLinks label="Contact links" />
      </Section>
    </>
  );
}
