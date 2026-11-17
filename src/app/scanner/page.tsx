import type { Metadata } from "next";
import { ScanLine } from "lucide-react";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Scanner" };

export default function ScannerPage() {
  return (
    <ComingSoon
      title="QR Scanner"
      phase="Phase 5"
      icon={<ScanLine className="h-6 w-6" />}
      description="This page does not access your camera. Scanning arrives in the final phase."
      planned={[
        "Camera scanning, started only when you ask",
        "Decode a QR code from an uploaded image",
        "Decoded content shown first, never opened automatically",
      ]}
    />
  );
}
