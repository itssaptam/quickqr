"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const controlBase =
  "block w-full min-h-11 rounded-lg border bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-muted/70 transition-colors";

function controlClass(hasError: boolean): string {
  return cn(
    controlBase,
    hasError ? "border-red-600 dark:border-red-400" : "border-border",
  );
}

type FieldShellProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
};

function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  children,
}: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-brand-text">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          className="text-sm font-medium text-red-700 dark:text-red-300"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  const ids = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: "text" | "email" | "tel";
  inputMode?: "text" | "email" | "tel" | "url";
  maxLength?: number;
  placeholder?: string;
  autoComplete?: string;
  spellCheck?: boolean;
};

export function TextField({
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required,
  multiline,
  rows = 4,
  type = "text",
  inputMode,
  maxLength,
  placeholder,
  autoComplete = "off",
  spellCheck,
}: TextFieldProps) {
  const id = useId();
  const shared = {
    id,
    value,
    onBlur,
    maxLength,
    placeholder,
    autoComplete,
    spellCheck,
    inputMode,
    "aria-invalid": error ? true : undefined,
    "aria-required": required ? true : undefined,
    "aria-describedby": describedBy(id, hint, error),
    className: controlClass(Boolean(error)),
  };

  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
    >
      {multiline ? (
        <textarea
          {...shared}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          {...shared}
          type={type}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </FieldShell>
  );
}

export type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
  hint?: string;
};

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: SelectFieldProps<T>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint}>
      <select
        id={id}
        value={value}
        aria-describedby={describedBy(id, hint)}
        className={controlClass(false)}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export type CheckboxFieldProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
};

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
}: CheckboxFieldProps) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(event) => onChange(event.target.checked)}
          className="h-5 w-5 rounded border-border accent-[var(--brand-solid)]"
        />
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="pl-8 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
