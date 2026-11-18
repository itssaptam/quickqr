import { TextField } from "@/components/ui/fields";
import type { QRInputByType } from "@/types/qr";
import type { FormProps } from "./types";

export function SmsForm({
  values,
  errors,
  onChange,
  onBlur,
}: FormProps<QRInputByType["sms"]>) {
  return (
    <div className="space-y-4">
      <TextField
        label="Phone number"
        required
        type="tel"
        inputMode="tel"
        placeholder="+1 415 555 0132"
        hint="Include the country code (for example +880)."
        value={values.phone}
        error={errors.phone}
        onChange={(phone) => onChange({ phone })}
        onBlur={() => onBlur("phone")}
      />
      <TextField
        label="Message (optional)"
        multiline
        rows={4}
        maxLength={1000}
        value={values.message}
        onChange={(message) => onChange({ message })}
      />
    </div>
  );
}
