import type { MetadataRoute } from "next";
import { getSlugs } from "@/lib/content/projects";
import { siteUrl } from "@/lib/site";

// getSlugs lists published projects only, so a hidden project can never appear.
// No lastModified: a project's date is when it happened, not when the page changed.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl("/") },
    ...getSlugs().map((slug) => ({ url: siteUrl(`/projects/${slug}`) })),
  ];
}
