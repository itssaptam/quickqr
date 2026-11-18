"use client";

import { useCallback, useMemo, useState } from "react";
import { buildQRPayload } from "@/lib/qr-generator";
import { DEFAULT_VALUES } from "@/lib/qr-types";
import type {
  FieldErrors,
  QRFormValues,
  QRInputByType,
  QRType,
} from "@/types/qr";

type TouchedFields = Record<QRType, Record<string, boolean>>;

const NOTHING_TOUCHED: TouchedFields = {
  url: {},
  text: {},
  wifi: {},
  email: {},
  phone: {},
  sms: {},
  vcard: {},
};

/**
 * Holds all generator state. Every content type keeps its own form values, so
 * switching types never discards what was typed. Errors are only exposed for
 * fields the person has already visited, so an empty form isn't covered in red.
 */
export function useQRGenerator() {
  const [type, setType] = useState<QRType>("url");
  const [values, setValues] = useState<QRFormValues>(DEFAULT_VALUES);
  const [touched, setTouched] = useState<TouchedFields>(NOTHING_TOUCHED);

  const result = useMemo(() => buildQRPayload(type, values), [type, values]);

  const visibleErrors = useMemo<FieldErrors>(() => {
    if (result.ok) return {};
    const seen = touched[type];
    return Object.fromEntries(
      Object.entries(result.errors).filter(([field]) => seen[field]),
    );
  }, [result, touched, type]);

  const update = useCallback(
    <K extends QRType>(target: K, patch: Partial<QRInputByType[K]>) => {
      setValues(
        (previous) =>
          ({
            ...previous,
            [target]: { ...previous[target], ...patch },
          }) as QRFormValues,
      );
    },
    [],
  );

  const touch = useCallback((target: QRType, ...fields: string[]) => {
    setTouched((previous) => ({
      ...previous,
      [target]: {
        ...previous[target],
        ...Object.fromEntries(fields.map((field) => [field, true])),
      },
    }));
  }, []);

  const reset = useCallback(() => {
    setValues((previous) => ({ ...previous, [type]: DEFAULT_VALUES[type] }));
    setTouched((previous) => ({ ...previous, [type]: {} }));
  }, [type]);

  return { type, setType, values, update, touch, reset, result, visibleErrors };
}

export type QRGenerator = ReturnType<typeof useQRGenerator>;
