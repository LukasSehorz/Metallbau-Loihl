"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { ShowroomConfig } from "./ShowroomViewer";

const ShowroomViewer = dynamic(() => import("./ShowroomViewer"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-carbon/50 text-xs font-mono uppercase tracking-widest">
        Lädt 3D-Showroom…
      </span>
    </div>
  ),
});

/*
 * Konfigurator — alle Optionen und Preise stammen 1:1 von der Produktseite.
 * Serie (TO/TD) · 12 Tischgrößen · Füße/Rollen · Aluabdeckblech · Zubehör.
 * Bewusst ausgelassen: Hubböcke und Brücken (eigenständige Produkte, kein
 * Bestandteil einer Einzeltisch-Konfiguration).
 */

// ─── Tischgrößen mit echten Netto-Preisen (Produktseite: TO/TD/AO/AD-Tabellen) ───
type Size = {
  label: string;
  key: string;        // Bestellnummern-Suffix, z. B. "290.140"
  width: number;      // mm
  length: number;     // mm
  to: number;         // Preis TO-Serie
  td: number;         // Preis TD-Serie
  ao: number | null;  // Aluabdeckblech ohne Diagonallochung (null = nicht verfügbar)
  ad: number | null;  // Aluabdeckblech mit Diagonallochung
};

const SIZES: Size[] = [
  { label: "2.900 × 1.400 mm", key: "290.140", width: 2900, length: 1400, to: 3100, td: 3300, ao: 330,  ad: 340 },
  { label: "2.900 × 1.200 mm", key: "290.120", width: 2900, length: 1200, to: 2930, td: 3150, ao: null, ad: null },
  { label: "2.900 × 1.000 mm", key: "290.100", width: 2900, length: 1000, to: 2810, td: 3050, ao: null, ad: null },
  { label: "2.400 × 1.400 mm", key: "240.140", width: 2400, length: 1400, to: 2810, td: 3000, ao: 280,  ad: 290 },
  { label: "2.400 × 1.200 mm", key: "240.120", width: 2400, length: 1200, to: 2410, td: 2590, ao: 275,  ad: 285 },
  { label: "2.000 × 1.400 mm", key: "200.140", width: 2000, length: 1400, to: 2410, td: 2590, ao: 275,  ad: 285 },
  { label: "2.000 × 1.200 mm", key: "200.120", width: 2000, length: 1200, to: 2200, td: 2460, ao: 270,  ad: 280 },
  { label: "2.000 × 1.000 mm", key: "200.100", width: 2000, length: 1000, to: 1980, td: 2210, ao: 260,  ad: 270 },
  { label: "1.800 × 900 mm",   key: "180.090", width: 1800, length: 900,  to: 1780, td: 1950, ao: 250,  ad: 260 },
  { label: "1.400 × 1.400 mm", key: "140.140", width: 1400, length: 1400, to: 1980, td: 2200, ao: 270,  ad: 280 },
  { label: "1.200 × 1.200 mm", key: "120.120", width: 1200, length: 1200, to: 1720, td: 1900, ao: 250,  ad: 260 },
  { label: "1.000 × 1.000 mm", key: "100.100", width: 1000, length: 1000, to: 1590, td: 1650, ao: 240,  ad: 250 },
];

// ─── Serien (Produktseite: TO-Serie & TD-Serie) ───
const SERIES = [
  {
    value: "TO" as const,
    label: "TO-Serie — Oberseite 100×100 mm Lochraster",
    short: "TO-Serie",
  },
  {
    value: "TD" as const,
    label: "TD-Serie — Oberseite zusätzlich mit Diagonallochung",
    short: "TD-Serie",
  },
];

// ─── Füße & Rollen (Produktseite: Standfüße inkl. / Schwerlastrollen +279 €) ───
const FEET = [
  {
    label: "Feststehende Füße — im Preis enthalten",
    short: "Feststehende Füße",
    orderNo: null as string | null,
    price: 0,
  },
  {
    label: "Schwerlastrollen, 4× Blickle (1.375 kg/Rolle) — +279 €",
    short: "Schwerlastrollen 4× Blickle",
    orderNo: "–",
    price: 279,
  },
];

// ─── Zubehör (Produktseite: Spannwerkzeug, Anschläge & Winkel) ───
type Accessory = {
  id: string;
  group: string;
  name: string;
  orderNo: string;
  price: number; // netto
  img?: string;
};

const ACCESSORIES: Accessory[] = [
  // Spannwerkzeug
  { id: "sp200", group: "Spannwerkzeug", name: "Schraubzwinge 200×100 mm",             orderNo: "SP200.100", price: 39,  img: "/images/product-schraubzwinge.jpg" },
  { id: "sp300", group: "Spannwerkzeug", name: "Schraubzwinge 300×120 mm",             orderNo: "SP300.120", price: 44,  img: "/images/product-schraubzwinge.jpg" },
  { id: "ab",    group: "Spannwerkzeug", name: "Absteckbolzen",                         orderNo: "AB025.028", price: 12,  img: "/images/product-absteckbolzen.jpg" },
  { id: "sd",    group: "Spannwerkzeug", name: "Schnellspanner Vertikal (4000 N)",      orderNo: "SD.200.028", price: 59, img: "/images/product-schnellspanner.jpg" },
  { id: "kb",    group: "Spannwerkzeug", name: "Schnellspannkugelbolzen (bis 22 kN)",   orderNo: "KB030.028", price: 38,  img: "/images/product-schnellspannkugelbolzen.jpg" },
  // Anschläge & Positionierhilfen
  { id: "ap",    group: "Anschläge & Positionierhilfen", name: "Alu-Prisma 90° / 120°",              orderNo: "AP004.032", price: 23, img: "/images/product-alu-prisma.jpg" },
  { id: "as150", group: "Anschläge & Positionierhilfen", name: "Anschlag 150×50 mm",                  orderNo: "AS150.050", price: 25, img: "/images/product-anschlag.jpg" },
  { id: "al150", group: "Anschläge & Positionierhilfen", name: "Anschlag 150×50 mm Langloch",         orderNo: "AL150.050", price: 26, img: "/images/product-anschlag.jpg" },
  { id: "as300", group: "Anschläge & Positionierhilfen", name: "Anschlag 300×50 mm Langloch + Loch",  orderNo: "AS300.050", price: 29, img: "/images/product-anschlag.jpg" },
  { id: "al300", group: "Anschläge & Positionierhilfen", name: "Anschlag 300×50 mm durchg. Langloch", orderNo: "AL300.050", price: 30, img: "/images/product-anschlag.jpg" },
  { id: "ws250", group: "Anschläge & Positionierhilfen", name: "Winkelschablone 250×250 mm",          orderNo: "WS250.250", price: 59, img: "/images/product-winkelschablone.jpg" },
  { id: "ws300", group: "Anschläge & Positionierhilfen", name: "Winkelschablone 300×300×100 mm",      orderNo: "WS300.300", price: 149, img: "/images/product-winkelschablone.jpg" },
  // Winkel
  { id: "wa200", group: "Winkel", name: "Winkel 200×200×50 mm",  orderNo: "WA200.050", price: 48,  img: "/images/product-winkel.jpg" },
  { id: "wa400", group: "Winkel", name: "Winkel 400×200×100 mm", orderNo: "WA400.100", price: 95,  img: "/images/product-winkel.jpg" },
  { id: "wa420", group: "Winkel", name: "Winkel 400×200×200 mm", orderNo: "WA400.200", price: 180, img: "/images/product-winkel.jpg" },
  { id: "wa500", group: "Winkel", name: "Winkel 500×200×200 mm", orderNo: "WA500.200", price: 200, img: "/images/product-winkel.jpg" },
  { id: "wa600", group: "Winkel", name: "Winkel 600×200×200 mm", orderNo: "WA600.200", price: 210, img: "/images/product-winkel.jpg" },
  { id: "wa700", group: "Winkel", name: "Winkel 700×200×200 mm", orderNo: "WA700.200", price: 220, img: "/images/product-winkel.jpg" },
];

const ACCESSORY_GROUPS = Array.from(new Set(ACCESSORIES.map((a) => a.group)));

// ─── Helpers ───
function euro(n: number): string {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export default function KonfiguratorTeaser() {
  const [seriesIdx, setSeriesIdx] = useState(0);
  const [sizeIdx, setSizeIdx]     = useState(11); // Start: 1.000 × 1.000 (Einstiegspreis)
  const [feetIdx, setFeetIdx]     = useState(0);
  const [sheet, setSheet]         = useState(false); // Aluabdeckblech
  const [qty, setQty]             = useState<Record<string, number>>({});
  const [accOpen, setAccOpen]     = useState(false);

  const series = SERIES[seriesIdx];
  const size   = SIZES[sizeIdx];
  const feet   = FEET[feetIdx];

  const tablePrice  = series.value === "TO" ? size.to : size.td;
  const tableOrder  = `${series.value}${size.key}`;
  const sheetPrice  = series.value === "TO" ? size.ao : size.ad;
  const sheetOrder  = `${series.value === "TO" ? "AO" : "AD"}${size.key}`;
  const sheetAvailable = sheetPrice !== null;
  const isSperrgut  = size.width > 2400;

  const accessoryCount = Object.values(qty).reduce((s, n) => s + n, 0);
  const accessoryTotal = ACCESSORIES.reduce((s, a) => s + (qty[a.id] ?? 0) * a.price, 0);

  const total =
    tablePrice +
    feet.price +
    (sheet && sheetAvailable ? sheetPrice! : 0) +
    accessoryTotal;

  function setQuantity(id: string, next: number) {
    setQty((prev) => {
      const q = Math.max(0, Math.min(99, next));
      const copy = { ...prev };
      if (q === 0) delete copy[id];
      else copy[id] = q;
      return copy;
    });
  }

  function handleSizeChange(idx: number) {
    setSizeIdx(idx);
    // Blech abwählen, wenn es für die neue Größe nicht verfügbar ist
    const s = SIZES[idx];
    const p = series.value === "TO" ? s.ao : s.ad;
    if (p === null) setSheet(false);
  }

  // Live-3D-Vorschau: das parametrische Modell folgt der Konfiguration
  // (Tischgröße, Serie, Füße/Rollen, Abdeckblech).
  const config = useMemo<ShowroomConfig>(
    () => ({
      width:       size.width,
      length:      size.length,
      series:      series.value,
      feet:        feetIdx === 1 ? "casters" : "fixed",
      sheet:       sheet && sheetAvailable,
      metalness:   0.85,
      roughness:   0.3,
      accentColor: "#909090",
    }),
    [size, series, feetIdx, sheet, sheetAvailable]
  );

  // Stückliste (nur gewählte Positionen)
  const bom = useMemo(() => {
    const items: { qty: number; name: string; orderNo: string; price: number }[] = [
      { qty: 1, name: `Schweißtisch ${series.short} ${size.label}`, orderNo: tableOrder, price: tablePrice },
    ];
    if (feet.price > 0) items.push({ qty: 1, name: feet.short, orderNo: "Blickle", price: feet.price });
    if (sheet && sheetAvailable) items.push({ qty: 1, name: "Aluabdeckblech passend", orderNo: sheetOrder, price: sheetPrice! });
    for (const a of ACCESSORIES) {
      const n = qty[a.id] ?? 0;
      if (n > 0) items.push({ qty: n, name: a.name, orderNo: a.orderNo, price: a.price * n });
    }
    return items;
  }, [series, size, feet, sheet, sheetAvailable, sheetPrice, sheetOrder, tableOrder, tablePrice, qty]);

  // ─── Select-Schritte 01–04 ───
  const steps = [
    {
      num: "01",
      label: "Serie wählen",
      value: seriesIdx,
      options: SERIES.map((s, i) => {
        const price = s.value === "TO" ? size.to : size.td;
        return `${s.label} — ${euro(price)} €`;
      }),
      onChange: (v: number) => setSeriesIdx(v),
    },
    {
      num: "02",
      label: "Tischgröße",
      value: sizeIdx,
      options: SIZES.map(
        (s) => `${s.label} — ${euro(series.value === "TO" ? s.to : s.td)} €`
      ),
      onChange: handleSizeChange,
    },
    {
      num: "03",
      label: "Füße & Rollen",
      value: feetIdx,
      options: FEET.map((f) => f.label),
      onChange: (v: number) => setFeetIdx(v),
    },
    {
      num: "04",
      label: "Aluabdeckblech",
      value: sheet ? 1 : 0,
      options: sheetAvailable
        ? ["Ohne Abdeckblech", `Passend (${sheetOrder}) — +${euro(sheetPrice!)} €`]
        : ["Ohne Abdeckblech", "Für diese Größe auf Anfrage"],
      onChange: (v: number) => setSheet(v === 1 && sheetAvailable),
      disabledIdx: sheetAvailable ? undefined : 1,
    },
  ];

  return (
    <section id="konfigurator" className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28 border-t border-carbon/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left — Steps */}
        <div className="flex flex-col">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-4">
            Konfigurator
          </p>
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tightest mb-4">
            In 5 Schritten zum Preis.
          </h2>
          <p className="text-carbon/60 text-base mb-10">
            Stellen Sie Ihren Wunschtisch komplett zusammen — mit den
            Originalpreisen der Produktseite.
          </p>

          {/* Schritte 01–04 */}
          <div className="flex flex-col gap-0 border border-carbon/10">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 p-5 border-b border-carbon/10"
              >
                <div className="flex items-center gap-4 md:gap-0 md:contents">
                  <span className="text-plasma font-mono text-sm font-bold shrink-0 w-6">
                    {step.num}
                  </span>
                  <span className="text-carbon text-sm font-medium shrink-0 md:w-40">
                    {step.label}
                  </span>
                </div>
                <div className="flex-1 relative">
                  <select
                    value={step.value}
                    onChange={(e) => step.onChange(Number(e.target.value))}
                    className="w-full bg-white border border-carbon/10 px-3 py-2 pr-8 text-carbon text-sm font-mono appearance-none cursor-pointer hover:border-plasma/60 focus:border-plasma focus:outline-none transition-colors truncate"
                  >
                    {step.options.map((opt, j) => (
                      <option key={j} value={j} disabled={j === step.disabledIdx} className="bg-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-plasma text-xs">
                    ▾
                  </span>
                </div>
              </div>
            ))}

            {/* Schritt 05: Zubehör */}
            <div className="p-5">
              <button
                onClick={() => setAccOpen((o) => !o)}
                className="w-full flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-left group"
              >
                <div className="flex items-center gap-4 md:gap-0 md:contents">
                  <span className="text-plasma font-mono text-sm font-bold shrink-0 w-6">05</span>
                  <span className="text-carbon text-sm font-medium shrink-0 md:w-40">
                    Zubehör
                    <span className="text-carbon/40 font-normal"> (optional)</span>
                  </span>
                </div>
                <span className="flex-1 flex items-center justify-between border border-carbon/10 px-3 py-2 text-sm font-mono text-carbon group-hover:border-plasma/60 transition-colors">
                  <span>
                    {accessoryCount > 0
                      ? `${accessoryCount} Artikel — ${euro(accessoryTotal)} €`
                      : "Zubehör hinzufügen"}
                  </span>
                  <span
                    className="text-plasma text-xs inline-block transition-transform duration-300"
                    style={{ transform: accOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    ▾
                  </span>
                </span>
              </button>

              {/* Zubehör-Liste */}
              {accOpen && (
                <div className="mt-4 border border-carbon/10 divide-y divide-carbon/10 max-h-[380px] overflow-y-auto">
                  {ACCESSORY_GROUPS.map((group) => (
                    <div key={group}>
                      <p className="px-4 py-2 bg-gray-50 text-[10px] font-mono uppercase tracking-widest text-carbon/50 sticky top-0">
                        {group}
                      </p>
                      {ACCESSORIES.filter((a) => a.group === group).map((a) => {
                        const n = qty[a.id] ?? 0;
                        return (
                          <div key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                            {a.img && (
                              <img
                                src={a.img}
                                alt={a.name}
                                loading="lazy"
                                className="w-9 h-9 object-cover border border-carbon/10 shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-carbon text-xs font-medium truncate">{a.name}</p>
                              <p className="text-carbon/40 text-[10px] font-mono">
                                {a.orderNo} · {euro(a.price)} €
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => setQuantity(a.id, n - 1)}
                                disabled={n === 0}
                                aria-label={`${a.name} entfernen`}
                                className="w-7 h-7 border border-carbon/15 text-carbon text-sm leading-none hover:border-plasma hover:text-plasma disabled:opacity-30 disabled:hover:border-carbon/15 disabled:hover:text-carbon transition-colors"
                              >
                                −
                              </button>
                              <span
                                className={`w-8 text-center text-sm font-mono ${n > 0 ? "text-plasma font-bold" : "text-carbon/40"}`}
                              >
                                {n}
                              </span>
                              <button
                                onClick={() => setQuantity(a.id, n + 1)}
                                aria-label={`${a.name} hinzufügen`}
                                className="w-7 h-7 border border-carbon/15 text-carbon text-sm leading-none hover:border-plasma hover:text-plasma transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Price Preview */}
          <div className="mt-8 pt-8 border-t border-carbon/10">
            <p className="text-carbon/60 text-xs font-mono uppercase tracking-widest mb-2">
              Geschätzter Preis
            </p>
            <p className="text-carbon font-mono text-4xl md:text-5xl font-bold tracking-tightest">
              <span className="text-plasma">{euro(total)} €</span>
              <span className="text-carbon/60 text-xl ml-2">netto</span>
            </p>
            <p className="text-carbon/50 text-sm font-mono mt-1">
              {euro(Math.round(total * 1.19 * 100) / 100)} € inkl. MwSt.
            </p>
            <p className="text-carbon/60 text-xs mt-3">
              zzgl. Versand 249 € netto + 79 € Verpackung
              {isSperrgut && " · Versand auf Anfrage (über 2.400 mm)"} · Festpreis nach
              Konfiguration · Fertigungszeit ca. 10 Werktage
            </p>
          </div>

          <Link
            href="/kontakt"
            className="mt-8 bg-plasma text-white font-semibold px-8 py-4 text-base text-center hover:bg-plasma/90 transition-colors w-full md:w-auto md:self-start"
          >
            Unverbindlich anfragen →
          </Link>
        </div>

        {/* Right — 3D Showroom Viewer + Stückliste */}
        <div className="flex flex-col gap-3 lg:sticky lg:top-24">
          <div className="aspect-square md:aspect-[4/3] bg-gray-100 border border-carbon/10 relative overflow-hidden">
            <ShowroomViewer config={config} />
          </div>
          <p className="text-carbon/60 text-xs text-center font-mono">
            3D-Ansicht: Live-Vorschau — Größe, Füße/Rollen &amp; Abdeckblech folgen Ihrer Auswahl (vereinfachte Darstellung)
          </p>

          {/* Stückliste */}
          <div className="border border-carbon/10 mt-2">
            <p className="px-5 py-3 bg-gray-50 border-b border-carbon/10 text-xs font-mono uppercase tracking-widest text-carbon/60">
              Ihre Zusammenstellung
            </p>
            <div className="divide-y divide-carbon/10">
              {bom.map((item, i) => (
                <div key={i} className="flex items-baseline gap-3 px-5 py-3">
                  <span className="text-plasma font-mono text-xs shrink-0 w-8">
                    {item.qty}×
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-carbon text-sm font-medium leading-snug">{item.name}</p>
                    <p className="text-carbon/40 text-[10px] font-mono">{item.orderNo}</p>
                  </div>
                  <span className="text-carbon text-sm font-semibold font-mono whitespace-nowrap">
                    {euro(item.price)} €
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-baseline justify-between px-5 py-3.5 border-t border-carbon/10 bg-gray-50">
              <span className="text-carbon text-sm font-bold">Gesamt netto</span>
              <span className="text-plasma text-base font-bold font-mono">{euro(total)} €</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
