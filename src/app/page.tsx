import {
  Briefcase,
  Coffee,
  Compass,
  GraduationCap,
  Handshake,
  Languages,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { isTodo, profile } from "../../content/profile";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { ScoreMeter } from "@/components/score-meter";
import { Tilt } from "@/components/tilt";
import { BentoGrid } from "@/components/ui/bento-grid";
import { getAllProjects } from "@/lib/content/projects";

const linkClass =
  "inline-flex min-h-6 items-center text-primary underline underline-offset-4";

// One decorative icon per At a glance row, matched by its label.
const glanceIcons: Record<string, LucideIcon> = {
  Location: MapPin,
  Education: GraduationCap,
  Focus: Briefcase,
  "Open to": Handshake,
  Next: Compass,
  Languages,
  "Outside work": Coffee,
};

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
  label?: string;
  title: string;
  band?: boolean;
  stacked?: boolean; // heading above the content, not beside it
  aside?: ReactNode; // a second column; the heading and content share the first
  children: ReactNode;
}) {
  const heading = (
    <div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
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
            <span className="headline-line block">
              {name.slice(0, lastSpace)}
            </span>{" "}
            <span className="headline-line block">
              {name.slice(lastSpace + 1)}
            </span>
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
            <dl className="mt-3 grid gap-3 md:grid-cols-2">
              {about.atAGlance.map(({ label, value }) => {
                const Icon = glanceIcons[label];

                return (
                  <div
                    key={label}
                    className="fact-card quiet-card rounded-xl bg-card p-4 text-card-foreground ring-1 md:last:col-span-2"
                  >
                    <dt className="flex items-center gap-2 text-muted-foreground">
                      {Icon && (
                        <span
                          aria-hidden="true"
                          className="fact-badge inline-flex size-8 shrink-0 items-center justify-center rounded-full"
                        >
                          <Icon className="size-4" />
                        </span>
                      )}
                      {label}
                    </dt>
                    <dd className="mt-2">{value}</dd>
                  </div>
                );
              })}
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
              className="size-40 shrink-0 rounded-xl object-cover ring-1 ring-border"
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
            <li key={`${item.role}-${item.period}`} className="hover-line">
              <p className="font-mono text-sm text-muted-foreground">
                {item.period}
              </p>
              <h3 className="mt-1 font-semibold">{item.role}</h3>
              <p className="text-muted-foreground">{item.organisation}</p>
              <p className="mt-1 leading-relaxed">{item.line}</p>
            </li>
          ))}
          {profile.education.map((item) => (
            <li key={`${item.school}-${item.period}`} className="hover-line">
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
        <Tilt
          as="article"
          className="sunset-edge relative isolate grid gap-8 rounded-xl p-5 text-card-foreground lg:grid-cols-12 lg:gap-x-12 lg:p-8"
        >
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
        </Tilt>
      </Section>

      <Section id="skills" title="Skills" band>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 lg:gap-3">
            {profile.skillGroups.map((group) => (
              <div
                key={group.name}
                className="flex flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-6"
              >
                <h3 className="font-medium lg:w-44 lg:shrink-0">
                  {group.name}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-md border border-border bg-chip px-2 py-0.5 text-sm"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="max-w-[65ch] leading-relaxed">{profile.skillsNote}</p>
        </div>
      </Section>

      <Section id="contact" label="Get in touch" title="Contact">
        <ContactLinks label="Contact links" />
      </Section>
    </>
  );
}
