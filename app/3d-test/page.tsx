"use client";

// Interne Prüfseite für das parametrische Tischmodell (nicht verlinkt).
// Rendert feste Kamerawinkel, damit Änderungen am 3D-Modell vergleichbar
// per Screenshot kontrolliert werden können.

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ShowroomConfig } from "@/components/ShowroomViewer";

const ShowroomViewer = dynamic(() => import("@/components/ShowroomViewer"), {
  ssr: false,
});

const base: ShowroomConfig = {
  width: 2000,
  length: 1000,
  series: "TO",
  feet: "fixed",
  sheet: false,
  metalness: 0.55,
  roughness: 0.5,
  accentColor: "#9aa1a8",
};

type View = {
  id: string;
  title: string;
  cfg: Partial<ShowroomConfig>;
  cam: [number, number, number];
  target?: [number, number, number];
};

const VIEWS: View[] = [
  { id: "a-persp",   title: "2.000×1.000 · Perspektive",        cfg: {},                                        cam: [5.5, 4, 7.5] },
  { id: "b-unten",   title: "2.000×1.000 · Untersicht (Streben)", cfg: {},                                      cam: [4.5, -4.5, 6] },
  { id: "c-wange",   title: "2.000×1.000 · Wange (Fünfer-Lochung)", cfg: {},                                    cam: [0.4, 0.2, 7.2] },
  { id: "d-fuss",    title: "Fuß-Detail (Sechskantmutter)",     cfg: { width: 1000, length: 1000 },             cam: [2.6, -0.9, 3.4] },
  { id: "e-2900",    title: "2.900×1.000 · 6 Füße / 6 Streben", cfg: { width: 2900, length: 1000 },             cam: [4.5, -4.5, 6] },
  { id: "f-2900p",   title: "2.900×1.000 · Perspektive",        cfg: { width: 2900, length: 1000 },             cam: [5.5, 4, 7.5] },
  { id: "g-td",      title: "2.400×1.400 · TD-Serie",           cfg: { width: 2400, length: 1400, series: "TD" }, cam: [5.5, 4.5, 7.5] },
  { id: "h-rollen",  title: "Blickle-Rollen",                   cfg: { width: 1400, length: 1400, feet: "casters" }, cam: [5, 2.4, 7] },
  // Nahaufnahme einer Rolle — Abgleich mit dem Produktfoto (Bremse, Nabe, Platte)
  { id: "h-rolldet", title: "Schwerlastrolle Detail",           cfg: { width: 1000, length: 1000, feet: "casters" }, cam: [3.7, -1.25, 3.95], target: [2.34, -1.92, 2.34] },
  { id: "i-klein",   title: "1.000×1.000 · Perspektive",        cfg: { width: 1000, length: 1000 },             cam: [5.5, 4, 7.5] },
  { id: "s-klein-u", title: "1.000×1.000 · Untersicht (2 Stege)", cfg: { width: 1000, length: 1000 },           cam: [4.5, -4.5, 6] },
  { id: "t-2400-u",  title: "2.400×1.400 · Untersicht (4 Stege)", cfg: { width: 2400, length: 1400 },           cam: [4.5, -4.5, 6] },
  { id: "u-fuss2",   title: "Fuß-Detail nah (Mutter + Platte)", cfg: { width: 1000, length: 1000 },             cam: [3.35, -1.15, 3.6], target: [2.34, -2.05, 2.34] },
  { id: "v-flansch", title: "Flansch am Beinkopf (verschraubt)", cfg: { width: 1000, length: 1000 },           cam: [4.1, 0.45, 4.4], target: [2.34, 1.15, 2.34] },
  { id: "w-stirn",   title: "Stirnseite von unten (Bögen)",     cfg: { width: 2400, length: 1400 },            cam: [7.6, -3.4, 1.6] },
  { id: "x-stirn10", title: "Stirnseite 2.000×1.000 von unten", cfg: { width: 2000, length: 1000 },            cam: [7.2, -3.2, 1.4] },
  { id: "y-1200-u",  title: "1.200×1.200 · Untersicht",         cfg: { width: 1200, length: 1200 },            cam: [4.5, -4.5, 6] },
  { id: "z-steg",    title: "Quersteg nah (Bogen-Unterkante)",  cfg: { width: 2400, length: 1400 },            cam: [2.2, -1.9, 4.2], target: [0, -1.2, 0] },
  // Stirnseite frontal — genau die Perspektive, aus der der Kunde die
  // Aussteifung zwischen den beiden Eckfüßen beurteilt.
  { id: "sa-2400",   title: "Stirnseite frontal 2.400×1.400",   cfg: { width: 2400, length: 1400 },            cam: [9.5, -0.7, 0.01] },
  { id: "sb-2000",   title: "Stirnseite frontal 2.000×1.000",   cfg: { width: 2000, length: 1000 },            cam: [9.0, -0.7, 0.01] },
  { id: "sc-1000",   title: "Stirnseite frontal 1.000×1.000",   cfg: { width: 1000, length: 1000 },            cam: [8.0, -0.7, 0.01] },
  { id: "sd-2900",   title: "Stirnseite frontal 2.900×1.000",   cfg: { width: 2900, length: 1000 },            cam: [9.5, -0.7, 0.01] },
  { id: "j-doppel",  title: "2 Tische längs + Brücken",         cfg: { width: 2000, length: 1000, second: true, bridge: true }, cam: [6, 5, 8] },
  { id: "k-doppels", title: "2 Tische quer + Brücken",          cfg: { width: 2000, length: 1000, second: true, secondArrangement: "side", bridge: true }, cam: [6, 5, 8] },
  { id: "l-doppeln", title: "2 Tische ohne Brücke",             cfg: { width: 2000, length: 1000, second: true }, cam: [6, 5, 8] },
  { id: "m-blech",   title: "Mit Aluabdeckblech",               cfg: { width: 2000, length: 1000, sheet: true }, cam: [5.5, 4, 7.5] },
  { id: "n-top",     title: "Draufsicht (durchgehende Platte)", cfg: { width: 2400, length: 1400 },             cam: [0.1, 9, 0.1] },
  { id: "o-hb1080",  title: "Hubbock 1.080 mm",                cfg: { product: "hubbock", hubbockWidth: 1080 }, cam: [5.5, 3.2, 7.5] },
  { id: "p-hb1480",  title: "Hubbock 1.480 mm",                cfg: { product: "hubbock", hubbockWidth: 1480 }, cam: [5.5, 3.2, 7.5] },
  { id: "q-hbcover", title: "Hubbock + Abdeckung + Schonleiste", cfg: { product: "hubbock", hubbockWidth: 1280, hubbockCover: true, hubbockStrip: true }, cam: [5.5, 3.2, 7.5] },
  { id: "r-hbfront", title: "Hubbock frontal",                 cfg: { product: "hubbock", hubbockWidth: 1080 }, cam: [0.3, 1.2, 8] },
];

export default function Test3DPage() {
  // ?only=a-persp,d-fuss rendert nur diese Ansichten — spart beim Iterieren
  // viel Zeit, weil jeder Canvas ein eigener WebGL-Kontext ist.
  // Erst nach dem Mount auswerten, sonst Hydration-Mismatch.
  const [views, setViews] = useState<View[]>([]);
  useEffect(() => {
    const only = new URLSearchParams(window.location.search).get("only");
    const wanted = only ? only.split(",").map((s) => s.trim()) : null;
    setViews(wanted ? VIEWS.filter((v) => wanted.includes(v.id)) : VIEWS);
  }, []);

  return (
    <main style={{ padding: 24, background: "#f4f5f6" }}>
      <h1 style={{ fontFamily: "monospace", fontSize: 18, marginBottom: 16 }}>
        3D-Modell — Prüfansichten
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
      >
        {views.map((v) => (
          <figure
            key={v.id}
            id={v.id}
            style={{ margin: 0, background: "#fff", border: "1px solid #d8dade" }}
          >
            <figcaption
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                padding: "6px 10px",
                borderBottom: "1px solid #e6e8ea",
                color: "#333",
              }}
            >
              {v.title}
            </figcaption>
            <div style={{ height: 420 }}>
              <ShowroomViewer
                config={{ ...base, ...v.cfg }}
                animate={false}
                autoRotate={false}
                cameraPosition={v.cam}
                target={v.target}
              />
            </div>
          </figure>
        ))}
      </div>
    </main>
  );
}
