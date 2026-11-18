import type { Metadata } from "next";
import { GeneratorWorkspace } from "@/components/generator/GeneratorWorkspace";

export const metadata: Metadata = { title: "Generator" };

export default function GeneratorPage() {
  return <GeneratorWorkspace />;
}
