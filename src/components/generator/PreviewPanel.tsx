import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import { byteLength } from "@/lib/qr-validation";
import type { QRPayloadResult } from "@/types/qr";
import { QRPreview } from "./QRPreview";

export function PreviewPanel({
  result,
  className,
}: {
  result: QRPayloadResult;
  className?: string;
}) {
  return (
    <aside
      aria-labelledby="preview-heading"
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 sm:p-6",
        className,
      )}
    >
      <h2 id="preview-heading" className="text-lg font-semibold">
        Live preview
      </h2>

      <div className="mt-4">
        <QRPreview
          data={result.ok ? result.data : null}
          label={result.ok ? `QR code. ${result.summary}` : "QR code preview"}
        />
      </div>

      <div aria-live="polite" className="mt-5 space-y-3 text-sm">
        {result.ok ? (
          <>
            <p>
              <span className="font-semibold">When scanned: </span>
              <span className="break-words text-muted">{result.summary}</span>
            </p>
            {result.warnings.map((warning) => (
              <p
                key={warning}
                className="flex gap-2 rounded-lg bg-brand-soft p-3 text-brand-text"
              >
                <TriangleAlert
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                {warning}
              </p>
            ))}
            <details className="rounded-lg border border-border">
              <summary className="cursor-pointer px-3 py-2 font-medium">
                Show encoded data ({byteLength(result.data)} bytes)
              </summary>
              <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all border-t border-border bg-surface-muted p-3 text-xs">
                {result.data}
              </pre>
            </details>
          </>
        ) : result.formError ? (
          <p className="font-medium text-red-700 dark:text-red-300">
            {result.formError}
          </p>
        ) : (
          <p className="text-muted">
            Fill in the required fields to generate your QR code. It updates as
            you type.
          </p>
        )}
      </div>
    </aside>
  );
}
