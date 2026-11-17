import type { Metadata } from "next";
import { History } from "lucide-react";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "My QR Codes" };

export default function MyCodesPage() {
  return (
    <ComingSoon
      title="My QR Codes"
      phase="Phase 4"
      icon={<History className="h-6 w-6" />}
      description="Saved designs will live in your browser. Nothing is saved yet because the generator is not built."
      planned={[
        "Save, reopen, rename and delete designs",
        "Clear history with confirmation",
        "Empty, loading and error states",
      ]}
    />
  );
}
