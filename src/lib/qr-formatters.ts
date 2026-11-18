import type { QRInputByType, WifiSecurity } from "@/types/qr";

/*
 * Pure string formatters. They assume their inputs were already validated and
 * normalised by qr-validation.ts / qr-generator.ts.
 */

const enc = encodeURIComponent;

/** Wi-Fi: escape \ ; , : and " with a backslash (ZXing / Android format). */
export function escapeWifiValue(value: string): string {
  return value.replace(/[\\;,:"]/g, (char) => `\\${char}`);
}

/*
 * Note: some Android versions treat an SSID or password made only of hex
 * digits as raw hex unless it is wrapped in quotes. Wrapping is not done here
 * because iOS may then read the quotes literally. See README "Known risks".
 */
export function formatWifi(input: {
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
}): string {
  const fields = [`T:${input.security}`, `S:${escapeWifiValue(input.ssid)}`];
  if (input.security !== "nopass") {
    fields.push(`P:${escapeWifiValue(input.password)}`);
  }
  if (input.hidden) fields.push("H:true");
  return `WIFI:${fields.join(";")};;`;
}

/** RFC 6068 mailto: link. Line breaks in the body become CRLF. */
export function formatMailto(
  address: string,
  subject: string,
  body: string,
): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${enc(subject)}`);
  if (body) params.push(`body=${enc(body.replace(/\r?\n/g, "\r\n"))}`);
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return `mailto:${enc(address).replace(/%40/g, "@")}${query}`;
}

export function formatTel(phone: string): string {
  return `tel:${phone}`;
}

/** RFC 5724 sms: link with an optional prefilled body. */
export function formatSms(phone: string, message: string): string {
  return message ? `sms:${phone}?body=${enc(message)}` : `sms:${phone}`;
}

/** vCard 3.0 TEXT escaping. */
export function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

/** vCard 3.0, the version phone scanners support most widely. */
export function formatVCard(input: QRInputByType["vcard"]): string {
  const esc = escapeVCardValue;
  const first = input.firstName.trim();
  const last = input.lastName.trim();
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(last)};${esc(first)};;;`,
    `FN:${esc([first, last].filter(Boolean).join(" "))}`,
  ];

  const organization = input.organization.trim();
  const jobTitle = input.jobTitle.trim();
  if (organization) lines.push(`ORG:${esc(organization)}`);
  if (jobTitle) lines.push(`TITLE:${esc(jobTitle)}`);
  if (input.phone) lines.push(`TEL:${input.phone}`);
  if (input.email) lines.push(`EMAIL:${input.email}`);
  if (input.website) lines.push(`URL:${input.website}`);

  const address = [
    input.street,
    input.city,
    input.region,
    input.postalCode,
    input.country,
  ].map((part) => part.trim());
  if (address.some(Boolean)) {
    lines.push(`ADR:;;${address.map(esc).join(";")}`);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}
