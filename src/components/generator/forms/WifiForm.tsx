import {
  CheckboxField,
  SelectField,
  TextField,
} from "@/components/ui/fields";
import type { QRInputByType, WifiSecurity } from "@/types/qr";
import type { FormProps } from "./types";

const SECURITY_OPTIONS: ReadonlyArray<{ value: WifiSecurity; label: string }> =
  [
    { value: "WPA", label: "WPA / WPA2 / WPA3 (most common)" },
    { value: "WEP", label: "WEP (older routers)" },
    { value: "nopass", label: "No password" },
  ];

export function WifiForm({
  values,
  errors,
  onChange,
  onBlur,
}: FormProps<QRInputByType["wifi"]>) {
  return (
    <div className="space-y-4">
      <TextField
        label="Network name (SSID)"
        required
        maxLength={64}
        value={values.ssid}
        error={errors.ssid}
        onChange={(ssid) => onChange({ ssid })}
        onBlur={() => onBlur("ssid")}
        spellCheck={false}
      />
      <SelectField
        label="Security"
        value={values.security}
        options={SECURITY_OPTIONS}
        onChange={(security) => onChange({ security })}
      />
      {values.security !== "nopass" ? (
        <TextField
          label="Password"
          required
          maxLength={128}
          value={values.password}
          error={errors.password}
          hint="Shown as you type so you can check it. It never leaves this device."
          onChange={(password) => onChange({ password })}
          onBlur={() => onBlur("password")}
          spellCheck={false}
        />
      ) : null}
      <CheckboxField
        label="Hidden network"
        hint="Turn on if the network name is not broadcast."
        checked={values.hidden}
        onChange={(hidden) => onChange({ hidden })}
      />
    </div>
  );
}
