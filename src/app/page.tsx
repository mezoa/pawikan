import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { isTodo, profile } from "../../content/profile";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { ScoreMeter } from "@/components/score-meter";
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
  aside,
  children,
}: {
  id: string;
  label: string;
  title: string;
  band?: boolean;
  stacked?: boolean; // heading above the content, not beside it
  aside?: ReactNode; // a second column; the heading and content share the first
  children: ReactNode;
}) {
  const heading = (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <h2 id={`${id}-heading`} className="mt-1 text-xl font-semibold">
        {title}
      </h2>
      <div aria-hidden="true" className="sunset-bar mt-3" />
    </div>
  );

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`${band ? "section-band " : ""}py-14 lg:py-20`}
    >
      {aside ? (
        <Reveal className="page-frame grid gap-10 lg:grid-cols-12 lg:gap-x-12">
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
            {heading}
            {children}
          </div>
          <div className="min-w-0 lg:col-span-5">{aside}</div>
        </Reveal>
      ) : (
        <Reveal
          className={`${stacked ? "" : "lg:grid-cols-[14rem_minmax(0,1fr)] "}page-frame grid gap-6`}
        >
          {heading}
          <div className="min-w-0">{children}</div>
        </Reveal>
      )}
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
  const { name, publication, about } = profile;
  const lastSpace = name.lastIndexOf(" ");

  return (
    <>
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="relative isolate pt-24 pb-16 sm:pb-24"
      >
        <div aria-hidden="true" className="wash-top" />
        <div className="page-frame">
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

      <Section
        id="about"
        label="Background"
        title="About"
        aside={
          <>
            <h3 className="text-lg font-semibold">At a glance</h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {about.atAGlance.map(({ label, value }) => (
                <div
                  key={label}
                  className="quiet-card rounded-xl bg-card p-3 text-card-foreground ring-1 sm:last:col-span-2"
                >
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="mt-1">{value}</dd>
                </div>
              ))}
            </dl>
          </>
        }
      >
        <div className="flex flex-col gap-6 sm:flex-row">
          {about.photo && (
            <Image
              src={about.photo.src}
              alt={about.photo.alt}
              width={160}
              height={160}
              className="size-40 shrink-0 rounded-xl object-cover"
            />
          )}
          <div className="flex max-w-[65ch] flex-col gap-4 leading-relaxed">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="experience"
        label="Career so far"
        title="Experience and education"
        band
        stacked
      >
        <ol className="timeline flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-0">
          {profile.experience.map((item) => (
            <li key={`${item.role}-${item.period}`}>
              <p className="font-mono text-sm text-muted-foreground">
                {item.period}
              </p>
              <h3 className="mt-1 font-semibold">{item.role}</h3>
              <p className="text-muted-foreground">{item.organisation}</p>
              <p className="mt-1 leading-relaxed">{item.line}</p>
            </li>
          ))}
          {profile.education.map((item) => (
            <li key={`${item.school}-${item.period}`}>
              <p className="font-mono text-sm text-muted-foreground">
                {item.period}
              </p>
              <h3 className="mt-1 font-semibold">{item.degree}</h3>
              <p className="text-muted-foreground">{item.school}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="publication" label="Research" title="Publication" stacked>
        <article className="sunset-edge relative grid gap-8 overflow-hidden rounded-xl bg-card p-5 text-card-foreground ring-1 lg:grid-cols-12 lg:gap-x-12 lg:p-8">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <h3 className="text-lg font-semibold">{publication.title}</h3>
            <p className="text-muted-foreground">
              {publication.venue}, {publication.year}
            </p>
            <p className="leading-relaxed">{publication.scoresNote}</p>
            <p>
              {/* The ::after layer stretches this link over the whole card. */}
              <a
                href={publication.doi}
                className={`${linkClass} after:absolute after:inset-0`}
              >
                Read the paper (DOI)
              </a>
            </p>
          </div>
          <ul
            className="flex min-w-0 flex-col gap-8 lg:col-span-7"
            aria-label="Usability scores"
          >
            {publication.scores.map(({ label, score, grade }) => (
              <li key={label}>
                <ScoreMeter label={label} score={score} grade={grade} />
              </li>
            ))}
          </ul>
        </article>
      </Section>

      <Section
        id="skills"
        label="Where I used them"
        title="Skills in context"
        band
      >
        <div className="flex flex-col gap-4">
          <p className="max-w-[65ch] leading-relaxed">{profile.skillsNote}</p>
          <ul className="grid gap-x-10 gap-y-1 md:grid-cols-2 xl:grid-cols-3">
            {profile.skills.map((skill) => (
              <li
                key={skill.name}
                className="flex flex-wrap items-baseline justify-between gap-x-4"
              >
                <span className="font-medium">{skill.name}</span>
                <span className="flex gap-x-3">
                  {skill.usedIn.map((project) => (
                    <Link
                      key={project.slug}
                      href={`/projects/${project.slug}`}
                      aria-label={`${project.name}, where I used ${skill.name}`}
                      className={linkClass}
                    >
                      {project.name}
                    </Link>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="contact" label="Get in touch" title="Contact">
        <ContactLinks label="Contact links" />
      </Section>
    </>
  );
}
