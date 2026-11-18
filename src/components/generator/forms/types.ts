import type { FieldErrors } from "@/types/qr";

/** Props shared by every content form. `T` is that type's input shape. */
export interface FormProps<T> {
  values: T;
  /** Only the errors that should be visible right now. */
  errors: FieldErrors;
  onChange: (patch: Partial<T>) => void;
  /** Called when a field loses focus, so its error can start showing. */
  onBlur: (...fields: Array<keyof T & string>) => void;
}
