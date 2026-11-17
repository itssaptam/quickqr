import { ArrowRight, ScanLine } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";

/**
 * Decorative QR-style illustration. It is NOT a real, scannable code and is
 * hidden from assistive technology.
 */
function DecorativeMark() {
  const cells = [
    [0, 4, 6, 7, 9, 11], [1, 3, 5, 8, 10], [0, 2, 4, 7, 9, 11],
    [1, 5, 6, 8, 10], [0, 3, 4, 7, 9], [2, 5, 6, 8, 11],
  ];
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-xs rounded-3xl border border-border bg-surface p-6 shadow-sm"
    >
      <svg viewBox="0 0 120 120" className="h-full w-full">
        {[[8, 8], [76, 8], [8, 76]].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="36" height="36" rx="6" fill="var(--foreground)" />
            <rect x={x! + 6} y={y! + 6} width="24" height="24" rx="3" fill="var(--surface)" />
            <rect x={x! + 12} y={y! + 12} width="12" height="12" rx="2" fill="var(--brand-solid)" />
          </g>
        ))}
        {cells.map((row, r) =>
          row.map((c) => (
            <rect
              key={`${r}-${c}`}
              x={52 + (c % 4) * 8 + (r > 2 ? 24 : 0)}
              y={52 + r * 7}
              width="5"
              height="5"
              rx="1"
              fill={c % 3 === 0 ? "var(--brand-solid)" : "var(--foreground)"}
              opacity={r > 2 && c > 8 ? 0 : 1}
            />
          )),
        )}
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
      <div>
        <p className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
          Free · No account · Runs in your browser
        </p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          QR codes, made{" "}
          <span className="text-brand-text">quick and yours.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Create QR codes for links, Wi-Fi, contacts and more. Style them to
          match your brand, download them, and keep everything private on your
          own device.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/generator">
            Create QR code
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/scanner" variant="secondary">
            <ScanLine className="h-4 w-4" aria-hidden="true" />
            Scan a code
          </ButtonLink>
        </div>
        <p className="mt-4 text-sm text-muted">Create. Customize. Scan.</p>
      </div>
      <DecorativeMark />
    </section>
  );
}
