"use client";

// Temporäre Testseite für den parametrischen Viewer — wird nach dem
// visuellen Abgleich wieder gelöscht. Aufruf z. B.:
//   /dev-viewer?w=2900&l=1400&series=TD&feet=casters&sheet=1
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import type { ShowroomConfig } from "@/components/ShowroomViewer";

const ShowroomViewer = dynamic(() => import("@/components/ShowroomViewer"), {
  ssr: false,
});

// Presets, damit die Test-URL ohne "&" auskommt (Headless-Screenshots)
const PRESETS: Record<string, Partial<ShowroomConfig>> = {
  rollen: { feet: "casters" },
  blechtd: { series: "TD", sheet: true },
  gross: { width: 2900, length: 1400, feet: "casters" },
  grossblech: { width: 2900, length: 1400, sheet: true },
};

function Viewer() {
  const sp = useSearchParams();
  const preset = PRESETS[sp.get("p") ?? ""] ?? {};
  const config: ShowroomConfig = {
    width: 1000,
    length: 1000,
    series: "TO",
    feet: "fixed",
    sheet: false,
    metalness: 0.85,
    roughness: 0.3,
    accentColor: "#909090",
    ...preset,
  };
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ShowroomViewer config={config} />
    </div>
  );
}

export default function DevViewerPage() {
  return (
    <Suspense fallback={null}>
      <Viewer />
    </Suspense>
  );
}
