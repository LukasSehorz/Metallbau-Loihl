"use client";

// Temporäre Testseite (Preset im Pfad, z. B. /dev-viewer/rollen) —
// wird nach dem visuellen Abgleich wieder gelöscht.
import dynamic from "next/dynamic";
import type { ShowroomConfig } from "@/components/ShowroomViewer";

const ShowroomViewer = dynamic(() => import("@/components/ShowroomViewer"), {
  ssr: false,
});

const PRESETS: Record<string, Partial<ShowroomConfig>> = {
  standard: {},
  rollen: { feet: "casters" },
  blechtd: { series: "TD", sheet: true },
  gross: { width: 2900, length: 1400, feet: "casters" },
  grossblech: { width: 2900, length: 1400, sheet: true },
};

export default function DevViewerPresetPage({
  params,
}: {
  params: { preset: string };
}) {
  const config: ShowroomConfig = {
    width: 1000,
    length: 1000,
    series: "TO",
    feet: "fixed",
    sheet: false,
    metalness: 0.85,
    roughness: 0.3,
    accentColor: "#909090",
    ...(PRESETS[params.preset] ?? {}),
  };
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ShowroomViewer config={config} animate={false} />
    </div>
  );
}
