import { profile } from "../../content/profile";

// A plain <a>, because the PDF is a file and not a page of the app. min-h-6 keeps
// the 24px target, and the focus ring comes from :focus-visible in globals.css.
export function ResumeLink() {
  return (
    <a
      href={profile.links.resume}
      target="_blank"
      rel="noopener"
      className="inline-flex min-h-6 items-center text-primary underline underline-offset-4"
    >
      Download resume (PDF)
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
