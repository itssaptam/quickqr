import {
  Download,
  History,
  Lock,
  Palette,
  QrCode,
  ScanLine,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const FEATURES: readonly Feature[] = [
  {
    icon: QrCode,
    title: "Seven content types",
    body: "Website, text, Wi-Fi, email, phone, SMS and contact cards.",
  },
  {
    icon: Palette,
    title: "Make it yours",
    body: "Pick colors, dot and corner styles, and add a center logo.",
  },
  {
    icon: Download,
    title: "PNG and SVG export",
    body: "Download at the size you need, or copy the image to your clipboard.",
  },
  {
    icon: History,
    title: "Saved on this device",
    body: "Keep recent designs in your browser. Rename, reopen or delete them.",
  },
  {
    icon: ScanLine,
    title: "Built-in scanner",
    body: "Scan with your camera or upload an image. You decide what to open.",
  },
  {
    icon: Lock,
    title: "Private by design",
    body: "No account and no server-side generation. Your content stays local.",
  },
];

export function Features() {
  return (
    <section
      aria-labelledby="features-heading"
      className="border-t border-border bg-surface-muted"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2
          id="features-heading"
          className="text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Everything you need, nothing you don&apos;t
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand-text">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
