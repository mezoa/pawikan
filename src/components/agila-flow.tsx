import { ArrowDown } from "lucide-react";
import type { ReactNode } from "react";

// Agila's two paths, built from real text so it stays sharp and screen readers
// can read it. The boxes use the control border colour: orange is for actions.

function Step({ last = false, children }: { last?: boolean; children: ReactNode }) {
  return (
    <li className="flex flex-col items-center gap-1">
      <div className="quiet-card w-full rounded-lg bg-card p-3 text-sm text-card-foreground ring-1">
        {children}
      </div>
      {!last && (
        <ArrowDown aria-hidden="true" className="size-4 text-border" />
      )}
    </li>
  );
}

export function AgilaFlow() {
  return (
    <figure className="my-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 font-medium">Saving</p>
          <ol className="flex flex-col gap-1">
            <Step>Save a link, note, Markdown file or text PDF</Step>
            <Step>Cut it into chunks</Step>
            <Step>Turn each chunk into 384 numbers with a local model</Step>
            <Step last>Store them in PostgreSQL with pgvector</Step>
          </ol>
        </div>
        <div>
          <p className="mb-2 font-medium">Asking</p>
          <ol className="flex flex-col gap-1">
            <Step>Ask a question</Step>
            <Step>Find the 3 closest chunks by cosine similarity</Step>
            <Step last>
              <span className="block font-medium">Best score below 0.68</span>
              Refuse, with no model call
            </Step>
            <li className="text-center text-sm text-muted-foreground">or</li>
            <Step last>
              <span className="block font-medium">Best score 0.68 or higher</span>
              The local model writes an answer as checked JSON. Every citation
              must point to a retrieved chunk.
            </Step>
          </ol>
        </div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
        How Agila saves and answers. Both paths run on one laptop.
      </figcaption>
    </figure>
  );
}
