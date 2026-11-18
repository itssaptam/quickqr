"use client";

import type { QRGenerator } from "@/hooks/useQRGenerator";
import { EmailForm } from "./forms/EmailForm";
import { PhoneForm } from "./forms/PhoneForm";
import { SmsForm } from "./forms/SmsForm";
import { TextForm } from "./forms/TextForm";
import { UrlForm } from "./forms/UrlForm";
import { VCardForm } from "./forms/VCardForm";
import { WifiForm } from "./forms/WifiForm";

/** Renders the form for the active QR type, wired to the generator state. */
export function ContentForm({ generator }: { generator: QRGenerator }) {
  const { type, values, visibleErrors: errors, update, touch } = generator;

  switch (type) {
    case "url":
      return (
        <UrlForm
          values={values.url}
          errors={errors}
          onChange={(patch) => update("url", patch)}
          onBlur={(...fields) => touch("url", ...fields)}
        />
      );
    case "text":
      return (
        <TextForm
          values={values.text}
          errors={errors}
          onChange={(patch) => update("text", patch)}
          onBlur={(...fields) => touch("text", ...fields)}
        />
      );
    case "wifi":
      return (
        <WifiForm
          values={values.wifi}
          errors={errors}
          onChange={(patch) => update("wifi", patch)}
          onBlur={(...fields) => touch("wifi", ...fields)}
        />
      );
    case "email":
      return (
        <EmailForm
          values={values.email}
          errors={errors}
          onChange={(patch) => update("email", patch)}
          onBlur={(...fields) => touch("email", ...fields)}
        />
      );
    case "phone":
      return (
        <PhoneForm
          values={values.phone}
          errors={errors}
          onChange={(patch) => update("phone", patch)}
          onBlur={(...fields) => touch("phone", ...fields)}
        />
      );
    case "sms":
      return (
        <SmsForm
          values={values.sms}
          errors={errors}
          onChange={(patch) => update("sms", patch)}
          onBlur={(...fields) => touch("sms", ...fields)}
        />
      );
    case "vcard":
      return (
        <VCardForm
          values={values.vcard}
          errors={errors}
          onChange={(patch) => update("vcard", patch)}
          onBlur={(...fields) => touch("vcard", ...fields)}
        />
      );
  }
}
