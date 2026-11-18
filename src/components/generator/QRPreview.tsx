"use client";

import { QrCode } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type QRCodeStyling from "qr-code-styling";
import { cn } from "@/lib/cn";
import { QR_PREVIEW_OPTIONS } from "@/lib/qr-render";

type QRPreviewProps = {
  /** The string to encode, or null when the form isn't valid yet. */
  data: string | null;
  /** Accessible description of what the code does. */
  label: string;
};

/**
 * Renders a real QR code with qr-code-styling. The library is loaded on the
 * client only, one instance is created, and later changes call `update()`
 * rather than building a new instance on every keystroke.
 */
export function QRPreview({ data, label }: QRPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!data) return;
    let cancelled = false;

    (async () => {
      try {
        if (!qrRef.current) {
          const { default: QRCodeStylingClass } = await import("qr-code-styling");
          if (cancelled) return;
          const qr = new QRCodeStylingClass({ ...QR_PREVIEW_OPTIONS, data });
          qrRef.current = qr;
          if (containerRef.current) {
            containerRef.current.replaceChildren();
            qr.append(containerRef.current);
          }
        } else {
          qrRef.current.update({ data });
        }
        setFailed(false);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [data]);

  return (
    <div className="mx-auto w-full max-w-80">
      {/* Always white: dark-on-white is the most reliable for scanners. */}
      <div
        className={cn(
          "rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border",
          (!data || failed) && "hidden",
        )}
      >
        <div
          ref={containerRef}
          role="img"
          aria-label={label}
          className="[&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
        />
      </div>

      {!data ? (
        <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border p-6 text-center text-muted">
          <QrCode className="h-10 w-10" aria-hidden="true" />
          <p className="text-sm">Your QR code will appear here.</p>
        </div>
      ) : null}

      {data && failed ? (
        <p
          role="alert"
          className="rounded-2xl border border-red-600 p-4 text-sm font-medium text-red-700 dark:border-red-400 dark:text-red-300"
        >
          Couldn&apos;t draw the QR code in this browser. Try reloading the page.
        </p>
      ) : null}
    </div>
  );
}
