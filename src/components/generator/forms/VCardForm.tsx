import { TextField } from "@/components/ui/fields";
import type { QRInputByType } from "@/types/qr";
import type { FormProps } from "./types";

export function VCardForm({
  values,
  errors,
  onChange,
  onBlur,
}: FormProps<QRInputByType["vcard"]>) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="First name"
          required
          maxLength={80}
          autoComplete="given-name"
          value={values.firstName}
          error={errors.firstName}
          onChange={(firstName) => onChange({ firstName })}
          onBlur={() => onBlur("firstName")}
        />
        <TextField
          label="Last name"
          maxLength={80}
          autoComplete="family-name"
          value={values.lastName}
          // Leaving this field also counts as visiting the name pair.
          onBlur={() => onBlur("firstName")}
          onChange={(lastName) => onChange({ lastName })}
        />
        <TextField
          label="Organization"
          maxLength={120}
          value={values.organization}
          onChange={(organization) => onChange({ organization })}
        />
        <TextField
          label="Job title"
          maxLength={120}
          value={values.jobTitle}
          onChange={(jobTitle) => onChange({ jobTitle })}
        />
        <TextField
          label="Phone"
          type="tel"
          inputMode="tel"
          placeholder="+1 415 555 0132"
          value={values.phone}
          error={errors.phone}
          onChange={(phone) => onChange({ phone })}
          onBlur={() => onBlur("phone")}
        />
        <TextField
          label="Email"
          type="email"
          inputMode="email"
          value={values.email}
          error={errors.email}
          onChange={(email) => onChange({ email })}
          onBlur={() => onBlur("email")}
          spellCheck={false}
        />
      </div>
      <TextField
        label="Website"
        inputMode="url"
        placeholder="https://example.com"
        value={values.website}
        error={errors.website}
        onChange={(website) => onChange({ website })}
        onBlur={() => onBlur("website")}
        spellCheck={false}
      />

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold">Address (optional)</legend>
        <TextField
          label="Street"
          maxLength={120}
          autoComplete="street-address"
          value={values.street}
          onChange={(street) => onChange({ street })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="City"
            maxLength={80}
            value={values.city}
            onChange={(city) => onChange({ city })}
          />
          <TextField
            label="State / region"
            maxLength={80}
            value={values.region}
            onChange={(region) => onChange({ region })}
          />
          <TextField
            label="Postal code"
            maxLength={20}
            value={values.postalCode}
            onChange={(postalCode) => onChange({ postalCode })}
          />
          <TextField
            label="Country"
            maxLength={80}
            value={values.country}
            onChange={(country) => onChange({ country })}
          />
        </div>
      </fieldset>
    </div>
  );
}
