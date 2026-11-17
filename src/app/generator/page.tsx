import type { Metadata } from "next";
import { QrCode } from "lucide-react";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Generator" };

export default function GeneratorPage() {
  return (
    <ComingSoon
      title="QR Generator"
      phase="Phase 2"
      icon={<QrCode className="h-6 w-6" />}
      description="The generator workspace is the next phase of the build. This page is a placeholder and does not create QR codes yet."
      planned={[
        "Content types: URL, text, Wi-Fi, email, phone, SMS and vCard",
        "Typed forms with helpful validation",
        "A live preview that updates as you type",
      ]}
    />
  );
}
