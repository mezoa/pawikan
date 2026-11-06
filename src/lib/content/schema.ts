import { z } from "zod";

const url = z.string().url();

export const metricSchema = z.object({
  label: z.string().min(2), // "Automated tests"
  value: z.string().min(1), // "1,089 passed"
  kind: z.enum(["outcome", "scope"]), // outcome = measured result; scope = size or shape only
  note: z.string().optional(), // how it was measured
});

// An image under public/images/. Alt text is required, so no image can skip it.
const imageSchema = z.object({
  src: z.string().regex(/^\/images\/.+/, "must start with /images/"),
  alt: z.string().min(10),
  caption: z.string().optional(),
  width: z.number().int().positive().default(1200),
  height: z.number().int().positive().default(800),
});

// One bar: value out of max. display is the text printed beside it.
const chartRowSchema = z
  .object({
    label: z.string().min(2),
    value: z.number().min(0),
    max: z.number().positive(),
    display: z.string().min(1),
  })
  .refine((row) => row.value <= row.max, {
    message: "value cannot be more than max",
  });

const chartSchema = z.object({
  title: z.string().min(3),
  caption: z.string().optional(),
  groups: z
    .array(
      z.object({
        name: z.string().optional(),
        rows: z.array(chartRowSchema).min(1),
      }),
    )
    .min(1),
});

export const projectSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(20).max(200), // one-line problem statement for the card
  date: z.coerce.date(),
  period: z.string().min(3).optional(), // "Oct 15 to Nov 2, 2026"; falls back to the date
  status: z.enum(["live", "building", "delivered", "archived"]),
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
  heroImage: imageSchema.optional(), // shown beside the title
  gallery: z.array(imageSchema).optional(), // shown at the end of Proof of work
  chart: chartSchema.optional(), // shown where the MDX puts <ProjectChart />
  privacyNote: z.string().optional(), // shown on the page when set
});

export type Metric = z.infer<typeof metricSchema>;
export type ProjectChart = z.infer<typeof chartSchema>;
export type ProjectFrontmatter = z.infer<typeof projectSchema>;
