import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = { title: "About" };

const PRINCIPLES = [
  ["Simple", "Your first QR code should take seconds. Advanced options stay out of the way until you want them."],
  ["Reliable", "Codes are built to scan on common phone cameras and scanner apps."],
  ["Private", "QR content is created in your browser and is not sent to a server."],
  ["Accessible", "Clear labels, keyboard-friendly controls and readable contrast in light and dark."],
] as const;

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        About QuickQR
      </h1>
      <p className="mt-4 text-lg text-muted">
        QuickQR is a free QR code generator and scanner for anyone who needs a
        code quickly: students, creators, small businesses and individuals.
        There is no account to create.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Privacy first</h2>
      <p className="mt-3 text-muted">
        QuickQR is designed to work in your browser. What you type into a QR
        code is not sent to a backend, and saved designs will be stored only
        on your own device. There is no account, database or analytics in this
        version.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Principles</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map(([term, text]) => (
          <div
            key={term}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <dt className="font-semibold">{term}</dt>
            <dd className="mt-1 text-sm text-muted">{text}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <ButtonLink href="/generator">Create QR code</ButtonLink>
      </div>
    </article>
  );
}
