import type { ReactNode } from "react";
import { ButtonLink } from "./ButtonLink";

type ComingSoonProps = {
  title: string;
  phase: string;
  description: string;
  planned: readonly string[];
  icon?: ReactNode;
};

/**
 * Honest placeholder for a route whose feature is scheduled for a later phase.
 * It does not simulate the feature.
 */
export function ComingSoon({
  title,
  phase,
  description,
  planned,
  icon,
}: ComingSoonProps) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <div className="flex items-center gap-3">
          {icon ? (
            <span className="text-brand-text" aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-text">
            Not yet implemented · {phase}
          </span>
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-muted">{description}</p>
        <h2 className="mt-8 text-sm font-semibold">Planned for this page</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
          {planned.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mt-8">
          <ButtonLink href="/" variant="secondary">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
