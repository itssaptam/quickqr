import type {
  FieldErrors,
  QRFormValues,
  QRInputByType,
  QRPayloadResult,
  QRType,
} from "@/types/qr";
import {
  formatMailto,
  formatSms,
  formatTel,
  formatVCard,
  formatWifi,
} from "./qr-formatters";
import {
  MAX_PAYLOAD_BYTES,
  WARN_PAYLOAD_BYTES,
  byteLength,
  checkEmail,
  checkPhone,
  checkUrl,
  checkWifiPassword,
} from "./qr-validation";

const success = (data: string, summary: string): QRPayloadResult => ({
  ok: true,
  data,
  summary,
  warnings: [],
});

const failure = (errors: FieldErrors): QRPayloadResult => ({
  ok: false,
  errors,
});

export function buildUrlPayload({ url }: QRInputByType["url"]): QRPayloadResult {
  const checked = checkUrl(url);
  if (!checked.ok) return failure({ url: checked.error });
  return success(checked.value, `Opens ${checked.value} in the browser.`);
}

export function buildTextPayload({
  text,
}: QRInputByType["text"]): QRPayloadResult {
  const value = text.trim();
  if (!value) return failure({ text: "Enter some text to encode." });
  return success(
    value,
    `Shows the text you entered (${[...value].length} characters).`,
  );
}

export function buildWifiPayload(
  input: QRInputByType["wifi"],
): QRPayloadResult {
  const errors: FieldErrors = {};

  if (!input.ssid.trim()) {
    errors.ssid = "Enter the network name (SSID).";
  } else if (byteLength(input.ssid) > 32) {
    errors.ssid = "Network names can be at most 32 bytes long.";
  }

  const passwordError = checkWifiPassword(input.password, input.security);
  if (passwordError) errors.password = passwordError;

  if (Object.keys(errors).length > 0) return failure(errors);

  const security =
    input.security === "nopass" ? "an open network" : `${input.security} security`;
  const hidden = input.hidden ? " It is marked as a hidden network." : "";
  return success(
    formatWifi(input),
    `Offers to join the Wi-Fi network "${input.ssid}" (${security}).${hidden}`,
  );
}

export function buildEmailPayload(
  input: QRInputByType["email"],
): QRPayloadResult {
  const address = checkEmail(input.address);
  if (!address.ok) return failure({ address: address.error });

  const subject = input.subject.trim();
  const body = input.body.trim();
  const extras = [subject && "a subject", body && "a message"].filter(Boolean);
  const prefilled = extras.length > 0 ? ` with ${extras.join(" and ")}` : "";
  return success(
    formatMailto(address.value, subject, body),
    `Starts an email to ${address.value}${prefilled}.`,
  );
}

export function buildPhonePayload({
  phone,
}: QRInputByType["phone"]): QRPayloadResult {
  const checked = checkPhone(phone);
  if (!checked.ok) return failure({ phone: checked.error });
  return success(formatTel(checked.value), `Starts a call to ${checked.value}.`);
}

export function buildSmsPayload(input: QRInputByType["sms"]): QRPayloadResult {
  const phone = checkPhone(input.phone);
  if (!phone.ok) return failure({ phone: phone.error });

  const message = input.message.trim();
  return success(
    formatSms(phone.value, message),
    `Starts a text message to ${phone.value}${message ? " with your message prefilled" : ""}.`,
  );
}

export function buildVCardPayload(
  input: QRInputByType["vcard"],
): QRPayloadResult {
  const errors: FieldErrors = {};
  const first = input.firstName.trim();
  const last = input.lastName.trim();
  if (!first && !last) errors.firstName = "Enter a first or last name.";

  const phone = input.phone.trim() ? checkPhone(input.phone) : null;
  if (phone && !phone.ok) errors.phone = phone.error;

  const email = input.email.trim() ? checkEmail(input.email) : null;
  if (email && !email.ok) errors.email = email.error;

  const website = input.website.trim() ? checkUrl(input.website) : null;
  if (website && !website.ok) errors.website = website.error;

  if (Object.keys(errors).length > 0) return failure(errors);

  const data = formatVCard({
    ...input,
    phone: phone?.ok ? phone.value : "",
    email: email?.ok ? email.value : "",
    website: website?.ok ? website.value : "",
  });
  return success(
    data,
    `Offers to add ${[first, last].filter(Boolean).join(" ")} to your contacts.`,
  );
}

/** Applies the size limit to a built payload and adds density warnings. */
function applySizeRules(result: QRPayloadResult): QRPayloadResult {
  if (!result.ok) return result;

  const size = byteLength(result.data);
  if (size > MAX_PAYLOAD_BYTES) {
    return {
      ok: false,
      errors: {},
      formError: `This is too much data for one QR code (${size} bytes; the limit is ${MAX_PAYLOAD_BYTES}). Shorten your content.`,
    };
  }
  if (size > WARN_PAYLOAD_BYTES) {
    return {
      ...result,
      warnings: [
        ...result.warnings,
        "This code holds a lot of data, so it will look dense and can be harder to scan. Test it before you print it.",
      ],
    };
  }
  return result;
}

/** Validates the form for `type` and builds the string to encode. */
export function buildQRPayload(
  type: QRType,
  values: QRFormValues,
): QRPayloadResult {
  switch (type) {
    case "url":
      return applySizeRules(buildUrlPayload(values.url));
    case "text":
      return applySizeRules(buildTextPayload(values.text));
    case "wifi":
      return applySizeRules(buildWifiPayload(values.wifi));
    case "email":
      return applySizeRules(buildEmailPayload(values.email));
    case "phone":
      return applySizeRules(buildPhonePayload(values.phone));
    case "sms":
      return applySizeRules(buildSmsPayload(values.sms));
    case "vcard":
      return applySizeRules(buildVCardPayload(values.vcard));
  }
}
