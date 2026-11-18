import { TextField } from "@/components/ui/fields";
import type { QRInputByType } from "@/types/qr";
import type { FormProps } from "./types";

export function UrlForm({
  values,
  errors,
  onChange,
  onBlur,
}: FormProps<QRInputByType["url"]>) {
  return (
    <TextField
      label="Website address"
      required
      inputMode="url"
      placeholder="https://example.com"
      hint="We add https:// for you if you leave it out."
      value={values.url}
      error={errors.url}
      onChange={(url) => onChange({ url })}
      onBlur={() => onBlur("url")}
      spellCheck={false}
    />
  );
}
