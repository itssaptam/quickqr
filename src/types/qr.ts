export const QR_TYPES = [
  "url",
  "text",
  "wifi",
  "email",
  "phone",
  "sms",
  "vcard",
] as const;

export type QRType = (typeof QR_TYPES)[number];

export type WifiSecurity = "WPA" | "WEP" | "nopass";

/** Raw, user-entered values for each QR content type. */
export interface QRInputByType {
  url: { url: string };
  text: { text: string };
  wifi: {
    ssid: string;
    password: string;
    security: WifiSecurity;
    hidden: boolean;
  };
  email: { address: string; subject: string; body: string };
  phone: { phone: string };
  sms: { phone: string; message: string };
  vcard: {
    firstName: string;
    lastName: string;
    organization: string;
    jobTitle: string;
    phone: string;
    email: string;
    website: string;
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
}

/** One form state per type, so switching tabs never loses what was typed. */
export type QRFormValues = { [K in QRType]: QRInputByType[K] };

/** Field name -> message. Field names match the keys of the type's input. */
export type FieldErrors = Partial<Record<string, string>>;

export type QRPayloadResult =
  | {
      ok: true;
      /** The exact string that gets encoded into the QR code. */
      data: string;
      /** Plain-language description of what scanning the code will do. */
      summary: string;
      warnings: string[];
    }
  | {
      ok: false;
      errors: FieldErrors;
      /** An error that is not tied to one field, such as "too much data". */
      formError?: string;
    };
