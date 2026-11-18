"use client";

import {
  Contact,
  Link2,
  Mail,
  MessageSquare,
  Phone,
  Type,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { QR_TYPE_OPTIONS } from "@/lib/qr-types";
import type { QRType } from "@/types/qr";

const ICONS: Record<QRType, LucideIcon> = {
  url: Link2,
  text: Type,
  wifi: Wifi,
  email: Mail,
  phone: Phone,
  sms: MessageSquare,
  vcard: Contact,
};

export function TypeSelector({
  value,
  onChange,
}: {
  value: QRType;
  onChange: (type: QRType) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">What should the code do?</legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {QR_TYPE_OPTIONS.map((option) => {
          const Icon = ICONS[option.type];
          return (
            <label key={option.type} className="relative block cursor-pointer">
              <input
                type="radio"
                name="qr-type"
                value={option.type}
                checked={value === option.type}
                onChange={() => onChange(option.type)}
                className="peer sr-only"
              />
              <span className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-muted peer-checked:border-brand peer-checked:bg-brand-soft peer-checked:text-brand-text peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-text">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
