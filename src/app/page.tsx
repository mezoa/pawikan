const sections = [
  { id: "projects", title: "Featured projects" },
  { id: "about", title: "About" },
  { id: "experience", title: "Experience and education" },
  { id: "publication", title: "Publication" },
  { id: "contact", title: "Contact" },
];

export default function Home() {
  return (
    <>
      <section id="hero" aria-labelledby="hero-heading" className="py-16 sm:py-24">
        <h1
          id="hero-heading"
          className="text-[clamp(3rem,12vw,7.5rem)] leading-none font-semibold tracking-tight"
        >
          <span className="block">Meo Angelo</span>{" "}
          <span className="block">Alcantara</span>
        </h1>
        <p className="mt-8 text-xl font-medium sm:text-2xl">
          Junior AI &amp; Automation Engineer
        </p>
        <p className="mt-4 max-w-[65ch] leading-relaxed text-muted-foreground">
          I build practical automation and AI tools, from a university reporting
          dashboard to a private question-answering assistant that cites its
          sources. Based in Butuan City, Philippines. Open to remote roles.
        </p>
      </section>

      {sections.map(({ id, title }) => (
        <section
          key={id}
          id={id}
          aria-labelledby={`${id}-heading`}
          className="grid gap-6 py-10 lg:grid-cols-[14rem_minmax(0,1fr)]"
        >
          <h2 id={`${id}-heading`} className="text-xl font-semibold">
            {title}
          </h2>
        </section>
      ))}
    </>
  );
}
