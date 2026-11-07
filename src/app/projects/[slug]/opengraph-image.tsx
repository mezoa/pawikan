import { notFound } from "next/navigation";
import { CARD_SIZE, renderCard } from "@/app/og-card";
import { getProject, getSlugs } from "@/lib/content/projects";
import { SITE_NAME } from "@/lib/site";

// A shared alt text: a per-project one needs generateImageMetadata, which replaces
// generateStaticParams here and changes the image's address.
export const alt = `Title card for a project by ${SITE_NAME}, with the project name in large text on a dark background.`;
export const size = CARD_SIZE;
export const contentType = "image/png";

// Published projects only. The page's own dynamicParams does not cover this route.
export const dynamicParams = false;

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return renderCard({ title: project.title, name: SITE_NAME });
}
