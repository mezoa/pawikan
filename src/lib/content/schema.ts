import { z } from "zod";

const url = z.string().url();

export const metricSchema = z.object({
  label: z.string().min(2), // "Automated tests"
  value: z.string().min(1), // "1,089 passed"
  kind: z.enum(["outcome", "scope"]), // outcome = measured result; scope = size or shape only
  note: z.string().optional(), // how it was measured
});

export const projectSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(20).max(200), // one-line problem statement for the card
  date: z.coerce.date(),
  status: z.enum(["live", "building", "archived"]),
  published: z.boolean().default(true), // false = hidden everywhere
  featured: z.boolean().default(false),
  order: z.number().int().default(100), // smaller shows first
  role: z.string().min(3), // "Sole developer", "Programmer, prototype to phase 1"
  techStack: z.array(z.string()).min(1),
  links: z
    .object({
      repo: url.optional(),
      demo: url.optional(),
      video: url.optional(),
      paper: url.optional(),
    })
    .default({}),
  metrics: z.array(metricSchema).min(1), // at least one metric, always
  cover: z.string().optional(), // image path under /public
  privacyNote: z.string().optional(), // shown on the page when set
});

export type Metric = z.infer<typeof metricSchema>;
export type ProjectFrontmatter = z.infer<typeof projectSchema>;
