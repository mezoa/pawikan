// All non-project text for the site. Facts come from docs/extracts/profile-facts.md
// and the "My decisions" list at the bottom of that file.
// Hard rules: no phone, home address or birth date. Keep employment status out.
// Institutional systems stay unnamed until written approval arrives.

export type ExperienceItem = {
  role: string;
  organisation: string;
  period: string;
  line: string;
};

export type EducationItem = {
  school: string;
  degree: string;
  period: string;
};

export type Publication = {
  title: string;
  venue: string;
  year: string;
  doi: string; // full https://doi.org/ address
};

export type Skill = {
  name: string;
  usedIn: string[]; // the projects that used it
};

export type Profile = {
  name: string;
  roleLine: string;
  bio: string; // two sentences
  about: {
    paragraphs: string[]; // three short paragraphs
    atAGlance: { label: string; value: string }[];
  };
  location: string; // city and country only
  availability: string;
  links: {
    github: string;
    linkedin: string;
    email: string;
  };
  experience: ExperienceItem[]; // newest first
  education: EducationItem[];
  publication: Publication;
  skills: Skill[];
};

/** Marks a value Eo still has to fill in. The site never turns these into links. */
const TODO = "TODO:";

export function isTodo(value: string) {
  return value.startsWith(TODO);
}

const TTLO = "TTLO Portfolio Management System";
const AGILA =
  "Project Agila (built with Claude Code under my direction and checks)";

export const profile: Profile = {
  name: "Meo Angelo Alcantara",
  roleLine: "Full-stack developer building AI automation",
  bio: "I have built and maintained internal university systems, and I led the group behind a web-based portfolio management system for technology transfer offices. My latest project, Project Agila, is a private, local AI assistant built with Claude Code under my direction and checks.",
  about: {
    paragraphs: [
      "I am a full-stack developer building AI automation, based in Surigao City, Philippines. I studied Information Technology at Caraga State University from 2020 to 2025. I also completed 486 hours of technical training at the university's Technology Transfer and Licensing Office.",
      "I moved from web development to AI automation as AI grew. I wanted to explore it as a more creative way of working, and to keep learning. I enjoy directing the work, using AI tools to speed up the building, and checking the results myself. I like everyday pain points that anyone runs into, and I look for an easier way to solve them.",
      "I measure what I build and write it down. On Project Agila I measured the results, graded answers by hand, and recorded the limitations and every change to the plan. Next I want to learn hybrid search and reranking. I would like to join a remote team building AI automation tools, where people work toward the same goal and a mistake is a chance to learn and try another way.",
    ],
    atAGlance: [
      { label: "Location", value: "Surigao City, Philippines" },
      {
        label: "Education",
        value:
          "BS Information Technology, Caraga State University, 2020 to 2025",
      },
      { label: "Focus", value: "Building AI automation tools" },
      {
        label: "Open to",
        value: "Remote roles and private-sector software development roles",
      },
      {
        label: "Next",
        value:
          "Hybrid search and reranking, and shorter answers for Project Agila",
      },
      { label: "Languages", value: "Filipino and English" },
      {
        label: "Outside work",
        value:
          "Light and web novels, anime, travel, coffee, and a theatre musical I hope to see one day",
      },
    ],
  },
  location: "Surigao City, Philippines",
  availability:
    "Open to remote roles and private-sector software development roles.",
  links: {
    github: `https://github.com/mezoa`,
    linkedin: `https://www.linkedin.com/in/meo-angelo-alcantara-97571b443`,
    email: `meoangeloalcantara@gmail.com`,
  },
  experience: [
    {
      role: "Project Management Officer I",
      organisation: "Caraga State University",
      period: "Aug 2025 to Jul 2026",
      line: "Built and maintained internal university systems.",
    },
    {
      role: "On-the-Job Trainee",
      organisation: "CSU Technology Transfer & Licensing Office",
      period: "Jan 2025 to May 2025",
      line: "Completed 486 hours of technical on-the-job training supporting the office's technology transfer and licensing operations.",
    },
  ],
  education: [
    {
      school: "Caraga State University",
      degree: "Bachelor of Science in Information Technology",
      period: "2020 to 2025",
    },
  ],
  publication: {
    title:
      "Web-based Portfolio Management System for Technology Transfer and Licensing Offices",
    venue:
      "Proceedings of International Exchange and Innovation Conference on Engineering & Sciences (IEICES) 11, pp. 377-382",
    year: "Oct 2025",
    doi: "https://doi.org/10.5109/7395544",
  },
  skills: [
    { name: "Next.js", usedIn: [TTLO] },
    { name: "HTML, CSS, JS", usedIn: [TTLO] },
    { name: "PostgreSQL", usedIn: [TTLO, AGILA] },
    { name: "Python", usedIn: [AGILA] },
    { name: "FastAPI", usedIn: [AGILA] },
    { name: "pgvector", usedIn: [AGILA] },
    { name: "Local LLMs (Ollama)", usedIn: [AGILA] },
    { name: "n8n", usedIn: [AGILA] },
    { name: "discord.py", usedIn: [AGILA] },
    { name: "Docker", usedIn: [AGILA] },
    { name: "GitHub Actions", usedIn: [AGILA] },
    { name: "gitleaks", usedIn: [AGILA] },
  ],
};
