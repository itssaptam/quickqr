import type { QRFormValues, QRType } from "@/types/qr";

export const QR_TYPE_OPTIONS: ReadonlyArray<{
  type: QRType;
  label: string;
  description: string;
}> = [
  { type: "url", label: "Website", description: "Open a web page" },
  { type: "text", label: "Text", description: "Show plain text" },
  { type: "wifi", label: "Wi-Fi", description: "Join a Wi-Fi network" },
  { type: "email", label: "Email", description: "Start an email" },
  { type: "phone", label: "Phone", description: "Start a phone call" },
  { type: "sms", label: "SMS", description: "Start a text message" },
  { type: "vcard", label: "Contact", description: "Add a contact card" },
];

export const DEFAULT_VALUES: QRFormValues = {
  url: { url: "" },
  text: { text: "" },
  wifi: { ssid: "", password: "", security: "WPA", hidden: false },
  email: { address: "", subject: "", body: "" },
  phone: { phone: "" },
  sms: { phone: "", message: "" },
  vcard: {
    firstName: "",
    lastName: "",
    organization: "",
    jobTitle: "",
    phone: "",
    email: "",
    website: "",
    street: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
  },
};
