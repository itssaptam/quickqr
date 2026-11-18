"use client";

import { RotateCcw } from "lucide-react";
import { useQRGenerator } from "@/hooks/useQRGenerator";
import { QR_TYPE_OPTIONS } from "@/lib/qr-types";
import { ContentForm } from "./ContentForm";
import { PreviewPanel } from "./PreviewPanel";
import { TypeSelector } from "./TypeSelector";

export function GeneratorWorkspace() {
  const generator = useQRGenerator();
  const active = QR_TYPE_OPTIONS.find((option) => option.type === generator.type);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          QR Generator
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Pick a type, fill in the details, and your code updates live. Nothing
          you type leaves this device.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
        <div className="space-y-6">
          <section
            aria-label="QR code type"
            className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
          >
            <TypeSelector
              value={generator.type}
              onChange={generator.setType}
            />
          </section>

          <section
            aria-labelledby="content-heading"
            className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="content-heading" className="text-lg font-semibold">
                  {active?.label} details
                </h2>
                <p className="mt-1 text-sm text-muted">{active?.description}</p>
              </div>
              <button
                type="button"
                onClick={generator.reset}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Clear
              </button>
            </div>
            {/* No native submit: pressing Enter must not reload the page. */}
            <form
              noValidate
              className="mt-5"
              onSubmit={(event) => event.preventDefault()}
            >
              <ContentForm generator={generator} />
            </form>
          </section>
        </div>

        <PreviewPanel
          result={generator.result}
          className="lg:sticky lg:top-24"
        />
      </div>
    </div>
  );
}
