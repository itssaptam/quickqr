import { TextField } from "@/components/ui/fields";
import type { QRInputByType } from "@/types/qr";
import type { FormProps } from "./types";

export function TextForm({
  values,
  errors,
  onChange,
  onBlur,
}: FormProps<QRInputByType["text"]>) {
  return (
    <TextField
      label="Text"
      required
      multiline
      rows={5}
      placeholder="Type or paste anything"
      hint="Longer text makes a denser code that is harder to scan."
      value={values.text}
      error={errors.text}
      onChange={(text) => onChange({ text })}
      onBlur={() => onBlur("text")}
    />
  );
}
