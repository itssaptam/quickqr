import { TextField } from "@/components/ui/fields";
import type { QRInputByType } from "@/types/qr";
import type { FormProps } from "./types";

export function PhoneForm({
  values,
  errors,
  onChange,
  onBlur,
}: FormProps<QRInputByType["phone"]>) {
  return (
    <TextField
      label="Phone number"
      required
      type="tel"
      inputMode="tel"
      placeholder="+1 415 555 0132"
      hint="Include the country code (for example +880) so it works from anywhere."
      value={values.phone}
      error={errors.phone}
      onChange={(phone) => onChange({ phone })}
      onBlur={() => onBlur("phone")}
    />
  );
}
