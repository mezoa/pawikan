import type { Metadata } from "next";

// Site details shared by the layout, project pages, sitemap and robots file.

// || and not ??, so an empty variable also falls back to the live address.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pawikan-lilac.vercel.app";

export const SITE_NAME = "Meo Angelo Alcantara";

/** A full web address for a path. new URL also handles a trailing slash in SITE_URL. */
export function siteUrl(path: string) {
  return new URL(path, SITE_URL).href;
}

// A page's openGraph and twitter replace the layout's whole object instead of
// merging with it, so project pages must spread these in again.
export const openGraphDefaults = {
  type: "website",
  siteName: SITE_NAME,
  locale: "en_PH",
} satisfies Metadata["openGraph"];

export const twitterDefaults = {
  card: "summary_large_image",
} satisfies Metadata["twitter"];
