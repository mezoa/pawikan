import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { projectSchema, type ProjectFrontmatter } from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

const REQUIRED_HEADINGS = [
  "Problem",
  "Architecture",
  "Tech stack choices",
  "Proof of work",
  "Limitations and failure modes",
];
const OPTIONAL_HEADINGS = ["See it run", "What I would do next"];
const MIN_SECTION_LENGTH = 40;

export type ProjectSection = {
  heading: string; // "" for any text above the first heading
  id: string; // the web address anchor
  body: string;
};

export type Project = ProjectFrontmatter & {
  slug: string; // the file name without .mdx; also the web address
  body: string; // the MDX text below the frontmatter
  sections: ProjectSection[]; // the body, one entry per "## " heading
};

/** True if a path such as /images/a.webp is a file in public/. */
export function publicFileExists(src: string) {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}

/** Splits the body into { "Problem": "text under it", ... }. Only "## " headings count. */
function getSections(body: string) {
  const sections = new Map<string, string>([["", ""]]);
  let current = "";
  let inCodeBlock = false;

  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inCodeBlock = !inCodeBlock;

    const heading = inCodeBlock ? null : line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      current = heading[1];
      sections.set(current, sections.get(current) ?? "");
    } else {
      sections.set(current, `${sections.get(current)}${line}\n`);
    }
  }
  return sections;
}

/** Returns one plain-English problem per missing or too-short heading. */
function findBodyProblems(body: string) {
  const sections = getSections(body);
  const problems: string[] = [];

  for (const heading of REQUIRED_HEADINGS) {
    const text = sections.get(heading);
    if (text === undefined) {
      problems.push(`missing heading "## ${heading}"`);
      continue;
    }
    const length = text.trim().length;
    if (length < MIN_SECTION_LENGTH) {
      problems.push(
        `"## ${heading}" has ${length} characters of text, needs at least ${MIN_SECTION_LENGTH}`,
      );
    }
  }
  for (const heading of OPTIONAL_HEADINGS) {
    const length = sections.get(heading)?.trim().length;
    if (length !== undefined && length < MIN_SECTION_LENGTH) {
      problems.push(
        `"## ${heading}" has ${length} characters of text, needs at least ${MIN_SECTION_LENGTH}`,
      );
    }
  }
  return problems;
}

/** Each listed image must be a real file, so no broken image can go public. */
function findImageProblems(frontmatter: ProjectFrontmatter) {
  const images = [frontmatter.heroImage, ...(frontmatter.gallery ?? [])];
  return images
    .filter((image) => image && !publicFileExists(image.src))
    .map((image) => `image "${image?.src}" is not in public/`);
}

/** The body as ordered sections, ready for the project page. */
function toSections(body: string): ProjectSection[] {
  return [...getSections(body)]
    .filter(([heading, text]) => heading || text.trim())
    .map(([heading, text]) => ({
      heading,
      id: heading.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      body: text,
    }));
}

function loadProject(fileName: string): Project {
  const fail = (problems: string[]): never => {
    const list = problems.map((problem) => `  - ${problem}`).join("\n");
    throw new Error(`Invalid project file content/projects/${fileName}:\n${list}`);
  };

  const raw = fs.readFileSync(path.join(CONTENT_DIR, fileName), "utf8");

  let parsed: matter.GrayMatterFile<string> | undefined;
  try {
    // The empty options object turns off gray-matter's cache, which would
    // otherwise hide a broken frontmatter error on the second read.
    parsed = matter(raw, {});
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    fail([`frontmatter could not be read: ${reason}`]);
  }
  const { data, content } = parsed as matter.GrayMatterFile<string>;

  const frontmatter = projectSchema.safeParse(data);
  const problems = findBodyProblems(content);
  if (!frontmatter.success) {
    problems.unshift(
      ...frontmatter.error.issues.map(
        (issue) =>
          `frontmatter "${issue.path.join(".") || "(top level)"}": ${issue.message}`,
      ),
    );
  }
  if (frontmatter.success) problems.push(...findImageProblems(frontmatter.data));
  if (problems.length > 0) fail(problems);

  return {
    ...(frontmatter.data as ProjectFrontmatter),
    slug: fileName.replace(/\.mdx$/, ""),
    body: content,
    sections: toSections(content),
  };
}

/** Every project file, including hidden ones. All of them must be valid. */
function loadAllFiles() {
  // Git does not store empty folders, so this folder can be absent on a fresh clone.
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map(loadProject);
}

/** Published projects: smallest order first, then newest date. */
export function getAllProjects() {
  return loadAllFiles()
    .filter((project) => project.published)
    .sort(
      (a, b) => a.order - b.order || b.date.getTime() - a.date.getTime(),
    );
}

/** One published project, or null if it is missing or hidden. */
export function getProject(slug: string) {
  return getAllProjects().find((project) => project.slug === slug) ?? null;
}

/** The web address of every published project. */
export function getSlugs() {
  return getAllProjects().map((project) => project.slug);
}
