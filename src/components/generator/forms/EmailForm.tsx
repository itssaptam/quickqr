import { TextField } from "@/components/ui/fields";
import type { QRInputByType } from "@/types/qr";
import type { FormProps } from "./types";

export function EmailForm({
  values,
  errors,
  onChange,
  onBlur,
}: FormProps<QRInputByType["email"]>) {
  return (
    <div className="space-y-4">
      <TextField
        label="Email address"
        required
        type="email"
        inputMode="email"
        placeholder="name@example.com"
        value={values.address}
        error={errors.address}
        onChange={(address) => onChange({ address })}
        onBlur={() => onBlur("address")}
        spellCheck={false}
      />
      <TextField
        label="Subject (optional)"
        maxLength={200}
        value={values.subject}
        onChange={(subject) => onChange({ subject })}
      />
      <TextField
        label="Message (optional)"
        multiline
        rows={4}
        maxLength={1000}
        value={values.body}
        onChange={(body) => onChange({ body })}
      />
    </div>
  );
}
