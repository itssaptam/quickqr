import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-hover",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-surface-muted",
};

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}
