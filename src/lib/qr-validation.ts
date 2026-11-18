import type { WifiSecurity } from "@/types/qr";

/**
 * Hard limit on encoded size. A QR code holds at most 2,331 bytes at error
 * correction level M, so this leaves headroom. Phase 3 (logos need higher
 * error correction, which holds less) will need to revisit this number.
 */
export const MAX_PAYLOAD_BYTES = 2000;
/** Above this the code gets dense and harder for phone cameras to read. */
export const WARN_PAYLOAD_BYTES = 700;

export type Checked<T> = { ok: true; value: T } | { ok: false; error: string };

const encoder = new TextEncoder();

export function byteLength(value: string): number {
  return encoder.encode(value).length;
}

/**
 * Validates a web address and returns it normalised. Adds https:// when the
 * scheme is missing and only accepts http and https, so values such as
 * `javascript:` or `data:` can never be encoded.
 */
export function checkUrl(raw: string): Checked<string> {
  const value = raw.trim();
  if (!value) return { ok: false, error: "Enter a website address." };
  if (/\s/.test(value)) {
    return { ok: false, error: "Web addresses can't contain spaces." };
  }

  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
  // "mailto:x", "tel:123" and similar: a scheme-like prefix that is not host:port.
  // ("localhost:3000" and "example.com:8080/path" are still allowed.)
  if (!hasScheme && /^[a-z][a-z0-9+.-]*:(?!\d+(?:[/?#]|$))/i.test(value)) {
    return { ok: false, error: "Only http and https links are supported." };
  }

  let url: URL;
  try {
    url = new URL(hasScheme ? value : `https://${value}`);
  } catch {
    return {
      ok: false,
      error: "Enter a valid web address, like https://example.com.",
    };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, error: "Only http and https links are supported." };
  }

  // https://google.com@evil.com style links are a common phishing trick.
  if (url.username || url.password) {
    return {
      ok: false,
      error: "Web addresses with a username or password aren't supported.",
    };
  }

  const host = url.hostname;
  const plausibleHost =
    host === "localhost" ||
    host.startsWith("[") ||
    (host.includes(".") && !host.endsWith(".") && !host.startsWith("."));
  if (!plausibleHost) {
    return {
      ok: false,
      error: "Enter a valid web address, like https://example.com.",
    };
  }

  return { ok: true, value: url.href };
}

const EMAIL_PATTERN =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function checkEmail(raw: string): Checked<string> {
  const value = raw.trim();
  if (!value) return { ok: false, error: "Enter an email address." };

  const [local = ""] = value.split("@");
  const valid =
    value.length <= 254 &&
    local.length <= 64 &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    !local.includes("..") &&
    EMAIL_PATTERN.test(value);

  if (!valid) {
    return {
      ok: false,
      error: "Enter a valid email address, like name@example.com.",
    };
  }
  return { ok: true, value };
}

/**
 * Accepts digits with optional spaces, dashes, dots and parentheses, and an
 * optional leading +. Returns digits only (plus the leading +). Phone numbers
 * are at most 15 digits (ITU E.164).
 */
export function checkPhone(raw: string): Checked<string> {
  const value = raw.trim();
  if (!value) return { ok: false, error: "Enter a phone number." };

  if (!/^\+?[\d\s().-]+$/.test(value)) {
    return {
      ok: false,
      error: "Use digits only, with an optional + at the start.",
    };
  }

  const digits = value.replace(/\D/g, "");
  if (digits.length < 5 || digits.length > 15) {
    return { ok: false, error: "Phone numbers have 5 to 15 digits." };
  }
  return { ok: true, value: `${value.startsWith("+") ? "+" : ""}${digits}` };
}

/** Returns an error message, or null when the Wi-Fi password is acceptable. */
export function checkWifiPassword(
  password: string,
  security: WifiSecurity,
): string | null {
  if (security === "nopass") return null;
  if (!password) return "Enter the network password.";

  if (security === "WPA") {
    const isPassphrase = password.length >= 8 && password.length <= 63;
    const isRawKey = /^[0-9a-f]{64}$/i.test(password);
    return isPassphrase || isRawKey
      ? null
      : "WPA passwords are 8 to 63 characters.";
  }

  const isAscii = password.length === 5 || password.length === 13;
  const isHex =
    /^[0-9a-f]+$/i.test(password) &&
    (password.length === 10 || password.length === 26);
  return isAscii || isHex
    ? null
    : "WEP keys are 5 or 13 characters, or 10 or 26 hex digits.";
}
