"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const CATEGORIES = ["Hubböcke", "Schweißtischbrücken", "Spannwerkzeug", "Anschläge & Winkel"] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">{children}</p>
  );
}

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <tr className="bg-gray-50 border-b border-carbon/10">
      {cols.map((col) => (
        <th
          key={col}
          className={`px-5 py-3 text-xs font-mono uppercase tracking-widest text-carbon/60 ${
            col.startsWith("Preis") ? "text-right" : "text-left"
          }`}
        >
          {col}
        </th>
      ))}
    </tr>
  );
}

type PriceRow = { col1: string; col2: string; netto: string; brutto: string };

function PriceTable({ cols, rows }: { cols: string[]; rows: PriceRow[] }) {
  return (
    <div className="border border-carbon/10 overflow-x-auto">
      <table className="w-full text-sm min-w-[540px]">
        <thead>
          <TableHeader cols={cols} />
        </thead>
        <tbody className="divide-y divide-carbon/10">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50/60 transition-colors">
              <td className="px-5 py-3.5 font-mono text-carbon text-sm">{row.col1}</td>
              <td className="px-5 py-3.5 font-mono text-carbon/60 text-sm">{row.col2}</td>
              <td className="px-5 py-3.5 text-right font-semibold text-carbon text-sm">{row.netto}</td>
              <td className="px-5 py-3.5 text-right text-carbon/60 text-sm">{row.brutto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ZubehoerPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  function scrollToSection(index: number) {
    setActiveCategory(index);
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:gap-16 lg:gap-24 gap-8">
          <div className="w-full md:max-w-lg">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Zubehör</p>
            <h1 className="text-carbon text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest leading-tight">
              Zubehör für Schweißtische
            </h1>
          </div>
          <div className="w-full md:max-w-lg flex flex-col justify-end gap-6">
            <p className="text-carbon/60 text-base leading-relaxed">
              Hubböcke, Schweißtischbrücken, Spannwerkzeug, Anschläge & Winkel — alles aus einer Manufaktur.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="bg-plasma text-white font-semibold px-6 py-3 hover:bg-plasma/90 transition-colors inline-block"
              >
                Direkt anfragen
              </Link>
              <Link
                href="/#konfigurator"
                className="border border-carbon/20 text-carbon font-semibold px-6 py-3 hover:border-carbon/40 transition-colors inline-block"
              >
                Konfigurator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Category Nav */}
      <div className="sticky top-0 z-40 bg-white border-b border-carbon/10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto py-3 no-scrollbar">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              onClick={() => scrollToSection(i)}
              className={`shrink-0 px-5 py-2 text-sm font-semibold font-mono whitespace-nowrap transition-all duration-150 ${
                activeCategory === i
                  ? "bg-carbon text-white"
                  : "border border-carbon/20 text-carbon hover:border-carbon/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── SECTION 1: Hubböcke ── */}
      <section
        id="hubböcke"
        ref={(el) => { sectionRefs.current[0] = el; }}
        className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28 border-b border-carbon/10 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Hubböcke</SectionLabel>
          <h2 className="text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-3">
            Hubböcke
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-10 max-w-2xl">
            Höhenverstellbar von 700–950 mm. Selbsthemmendes Spindelsystem. Tragfähigkeit bis 2000 kg. Pulverbeschichtet RAL 5015.
          </p>

          <PriceTable
            cols={["Bezeichnung", "Bestellnummer", "Preis netto", "inkl. 19% MwSt."]}
            rows={[
              { col1: "Hubbock 1080 mm breit stufenlos verstellbar", col2: "HB110.900", netto: "1.390,00 €", brutto: "1.654,10 €" },
              { col1: "Hubbock 1280 mm breit stufenlos verstellbar", col2: "HB130.900", netto: "1.490,00 €", brutto: "1.773,10 €" },
              { col1: "Hubbock 1480 mm breit stufenlos verstellbar", col2: "HB150.900", netto: "1.590,00 €", brutto: "1.892,10 €" },
            ]}
          />

          {/* Abdeckungen */}
          <div className="mt-12">
            <h3 className="text-carbon text-xl font-bold tracking-tightest mb-2">Abdeckungen für Hubböcke</h3>
            <p className="text-carbon/60 text-sm leading-relaxed mb-6">
              15 mm S355 Stahl, 28 mm Lochsystem, festverschraubbar.
            </p>
            <PriceTable
              cols={["Bezeichnung", "Bestellnummer", "Preis netto", "inkl. 19% MwSt."]}
              rows={[
                { col1: "Abdeckung Hubbock 1100×200×125 mm", col2: "LA110.200", netto: "290,00 €", brutto: "345,10 €" },
                { col1: "Abdeckung Hubbock 1300×200×125 mm", col2: "LA130.200", netto: "390,00 €", brutto: "464,10 €" },
                { col1: "Abdeckung Hubbock 1500×200×125 mm", col2: "LA150.200", netto: "490,00 €", brutto: "583,10 €" },
              ]}
            />
          </div>

          {/* Schonleisten */}
          <div className="mt-12">
            <h3 className="text-carbon text-xl font-bold tracking-tightest mb-2">Schonleisten PE 1000</h3>
            <p className="text-carbon/60 text-sm leading-relaxed mb-6">
              Kunststoff PE 1000 für Hubböcke, schützt empfindliche Oberflächen.
            </p>
            <PriceTable
              cols={["Bezeichnung", "Bestellnummer", "Preis netto", "inkl. 19% MwSt."]}
              rows={[
                { col1: "Schonleiste PE 1000  1079×90×4 mm", col2: "LK110.004", netto: "36,00 €", brutto: "42,84 €" },
                { col1: "Schonleiste PE 1000  1279×90×4 mm", col2: "LK130.004", netto: "43,00 €", brutto: "51,17 €" },
                { col1: "Schonleiste PE 1000  1479×90×4 mm", col2: "LK150.004", netto: "50,00 €", brutto: "59,50 €" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Schweißtischbrücken ── */}
      <section
        id="brücken"
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28 border-b border-carbon/10 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Schweißtischbrücken</SectionLabel>
          <h2 className="text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-3">
            Schweißtischbrücken
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-10 max-w-2xl">
            Zum Verbinden mehrerer Tische oder mit separatem Fuß als Erweiterung. Material S355 / 15 mm. Inklusive Montageset. Diagonallochung Ø 28 mm.
          </p>

          <PriceTable
            cols={["Maße (l×b×h) mm", "Bestellnummer", "Preis netto", "inkl. 19% MwSt."]}
            rows={[
              { col1: "500×300×200",  col2: "SB500.300",  netto: "450,00 €",   brutto: "535,50 €" },
              { col1: "600×300×200",  col2: "SB600.300",  netto: "490,00 €",   brutto: "583,10 €" },
              { col1: "700×300×200",  col2: "SB700.300",  netto: "550,00 €",   brutto: "654,50 €" },
              { col1: "800×300×200",  col2: "SB800.300",  netto: "590,00 €",   brutto: "702,10 €" },
              { col1: "900×300×200",  col2: "SB900.300",  netto: "650,00 €",   brutto: "773,50 €" },
              { col1: "1000×300×200", col2: "SB1000.300", netto: "690,00 €",   brutto: "821,10 €" },
              { col1: "1200×300×200", col2: "SB1200.300", netto: "790,00 €",   brutto: "940,10 €" },
              { col1: "1400×300×200", col2: "SB1400.300", netto: "890,00 €",   brutto: "1.059,10 €" },
              { col1: "1600×300×200", col2: "SB1600.300", netto: "990,00 €",   brutto: "1.178,10 €" },
              { col1: "1800×300×200", col2: "SB1800.300", netto: "1.090,00 €", brutto: "1.297,10 €" },
              { col1: "2000×300×200", col2: "SB2000.300", netto: "1.190,00 €", brutto: "1.416,10 €" },
            ]}
          />

          <div className="mt-6">
            <h3 className="text-carbon text-base font-bold tracking-tightest mb-3">Brückenfuß</h3>
            <PriceTable
              cols={["Bezeichnung", "Bestellnummer", "Preis netto", "inkl. 19% MwSt."]}
              rows={[
                { col1: "Brückenfuß", col2: "BF750x080", netto: "79,00 €", brutto: "94,01 €" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Spannwerkzeug ── */}
      <section
        id="spannwerkzeug"
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28 border-b border-carbon/10 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Spannwerkzeug</SectionLabel>
          <h2 className="text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-10">
            Spannwerkzeug
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 — Schraubzwingen */}
            <div className="border border-carbon/10 p-6 md:p-8 flex flex-col gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-plasma mb-1">Schraubzwingen</p>
                <h3 className="text-carbon font-bold text-xl mb-2">Schraubzwingen</h3>
                <p className="text-carbon/60 text-sm leading-relaxed">
                  Ø 28 mm, stabile Ganzstahl-Schraubzwingen, Eigenhemmung im Tisch.
                </p>
              </div>
              <div className="border border-carbon/10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-carbon/10">
                      <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Maße</th>
                      <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Bestell-Nr.</th>
                      <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Netto</th>
                      <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Brutto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-carbon/10">
                    <tr className="hover:bg-gray-50/60">
                      <td className="px-4 py-2.5 font-mono text-carbon text-sm">200×100 mm</td>
                      <td className="px-4 py-2.5 font-mono text-carbon/60 text-sm">SP200.100</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-carbon text-sm">39,00 €</td>
                      <td className="px-4 py-2.5 text-right text-carbon/60 text-sm">46,41 €</td>
                    </tr>
                    <tr className="hover:bg-gray-50/60">
                      <td className="px-4 py-2.5 font-mono text-carbon text-sm">300×120 mm</td>
                      <td className="px-4 py-2.5 font-mono text-carbon/60 text-sm">SP300.120</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-carbon text-sm">44,00 €</td>
                      <td className="px-4 py-2.5 text-right text-carbon/60 text-sm">52,36 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Link href="/kontakt" className="text-plasma text-sm font-semibold hover:underline">Anfragen →</Link>
            </div>

            {/* Card 2 — Absteckbolzen */}
            <div className="border border-carbon/10 p-6 md:p-8 flex flex-col gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-plasma mb-1">Absteckbolzen</p>
                <h3 className="text-carbon font-bold text-xl mb-2">Absteckbolzen</h3>
                <p className="text-carbon/60 text-sm leading-relaxed">
                  Einfaches Abstecken von Anschlägen. Kombinierbar mit Alu-Prismen. Material: S355.
                </p>
              </div>
              <div className="border border-carbon/10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-carbon/10">
                      <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Bestell-Nr.</th>
                      <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Netto</th>
                      <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Brutto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-carbon/10">
                    <tr className="hover:bg-gray-50/60">
                      <td className="px-4 py-2.5 font-mono text-carbon/60 text-sm">AB025.028</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-carbon text-sm">12,00 €</td>
                      <td className="px-4 py-2.5 text-right text-carbon/60 text-sm">14,28 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Link href="/kontakt" className="text-plasma text-sm font-semibold hover:underline">Anfragen →</Link>
            </div>

            {/* Card 3 — Schnellspanner Vertikal */}
            <div className="border border-carbon/10 p-6 md:p-8 flex flex-col gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-plasma mb-1">Schnellspanner</p>
                <h3 className="text-carbon font-bold text-xl mb-2">Schnellspanner Vertikal</h3>
                <p className="text-carbon/60 text-sm leading-relaxed">
                  Ø 28 mm, Spannkraft 4000 N (ca. 400 kg), einstellbare Höhe, schnelles Aufspannen.
                </p>
              </div>
              <div className="border border-carbon/10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-carbon/10">
                      <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Bestell-Nr.</th>
                      <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Netto</th>
                      <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Brutto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-carbon/10">
                    <tr className="hover:bg-gray-50/60">
                      <td className="px-4 py-2.5 font-mono text-carbon/60 text-sm">SD.200.028</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-carbon text-sm">59,00 €</td>
                      <td className="px-4 py-2.5 text-right text-carbon/60 text-sm">70,21 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Link href="/kontakt" className="text-plasma text-sm font-semibold hover:underline">Anfragen →</Link>
            </div>

            {/* Card 4 — Schnellspannkugelbolzen */}
            <div className="border border-carbon/10 p-6 md:p-8 flex flex-col gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-plasma mb-1">Schnellspannkugelbolzen</p>
                <h3 className="text-carbon font-bold text-xl mb-2">Schnellspannkugelbolzen</h3>
                <p className="text-carbon/60 text-sm leading-relaxed">
                  Ø 28 mm, Spannkraft bis 22 kN (ca. 2200 kg), Spannbereich 28–32 mm, verschleißfestes Messing.
                </p>
              </div>
              <div className="border border-carbon/10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-carbon/10">
                      <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Bestell-Nr.</th>
                      <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Netto</th>
                      <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60">Brutto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-carbon/10">
                    <tr className="hover:bg-gray-50/60">
                      <td className="px-4 py-2.5 font-mono text-carbon/60 text-sm">KB030.028</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-carbon text-sm">38,00 €</td>
                      <td className="px-4 py-2.5 text-right text-carbon/60 text-sm">45,22 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Link href="/kontakt" className="text-plasma text-sm font-semibold hover:underline">Anfragen →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Anschläge & Winkel ── */}
      <section
        id="anschlaege"
        ref={(el) => { sectionRefs.current[3] = el; }}
        className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Anschläge & Winkel</SectionLabel>
          <h2 className="text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-10">
            Anschläge & Winkel
          </h2>

          {/* Alu-Prismen */}
          <div className="mb-12">
            <div className="border border-carbon/10 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-plasma mb-1">Alu-Prismen</p>
                  <h3 className="text-carbon font-bold text-xl mb-2">Alu-Prismen 90° und 120°</h3>
                  <p className="text-carbon/60 text-sm leading-relaxed max-w-xl">
                    Zum schonenden Spannen von flachen Bauteilen, Vierkant- und Rundrohren. Neodym-Magnet. Kompatibel mit Absteckbolzen. Material: AlMgSi.
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-carbon font-bold text-2xl">23,00 €</p>
                  <p className="text-carbon/40 text-xs font-mono">27,37 € brutto</p>
                  <p className="text-carbon/40 text-xs font-mono mt-0.5">AP004.032</p>
                </div>
              </div>
              <Link href="/kontakt" className="text-plasma text-sm font-semibold hover:underline">Anfragen →</Link>
            </div>
          </div>

          {/* Anschläge */}
          <div className="mb-12">
            <h3 className="text-carbon text-xl font-bold tracking-tightest mb-2">Anschläge</h3>
            <p className="text-carbon/40 text-xs font-mono mb-5">Alle Anschläge aus 15 mm S355 J2+N, Bohrung Ø 28 mm</p>
            <PriceTable
              cols={["Bezeichnung", "Bestellnummer", "Preis netto", "inkl. 19% MwSt."]}
              rows={[
                { col1: "Anschlag 150×50 mm",                        col2: "AS150.050", netto: "25,00 €", brutto: "29,75 €" },
                { col1: "Anschlag 150×50 mm Langloch",               col2: "AL150.050", netto: "26,00 €", brutto: "30,94 €" },
                { col1: "Anschlag 300×50 mm Langloch + Loch",        col2: "AS300.050", netto: "29,00 €", brutto: "34,51 €" },
                { col1: "Anschlag 300×50 mm durchgehend Langloch",   col2: "AL300.050", netto: "30,00 €", brutto: "35,70 €" },
              ]}
            />
          </div>

          {/* Winkel */}
          <div className="mb-12">
            <h3 className="text-carbon text-xl font-bold tracking-tightest mb-2">Winkel</h3>
            <p className="text-carbon/40 text-xs font-mono mb-5">Auch als Tischverlängerung nutzbar. Sonderanfertigungen kein Problem.</p>
            <PriceTable
              cols={["Bezeichnung", "Bestellnummer", "Preis netto", "inkl. 19% MwSt."]}
              rows={[
                { col1: "Winkel 200×200×50 mm",  col2: "WA200.050", netto: "48,00 €",  brutto: "57,12 €" },
                { col1: "Winkel 400×200×100 mm", col2: "WA400.100", netto: "95,00 €",  brutto: "113,05 €" },
                { col1: "Winkel 400×200×200 mm", col2: "WA400.200", netto: "180,00 €", brutto: "214,20 €" },
                { col1: "Winkel 500×200×200 mm", col2: "WA500.200", netto: "200,00 €", brutto: "238,00 €" },
                { col1: "Winkel 600×200×200 mm", col2: "WA600.200", netto: "210,00 €", brutto: "249,90 €" },
                { col1: "Winkel 700×200×200 mm", col2: "WA700.200", netto: "220,00 €", brutto: "261,80 €" },
              ]}
            />
          </div>

          {/* Winkelschablonen */}
          <div>
            <h3 className="text-carbon text-xl font-bold tracking-tightest mb-5">Winkelschablonen</h3>
            <PriceTable
              cols={["Bezeichnung", "Bestellnummer", "Preis netto", "inkl. 19% MwSt."]}
              rows={[
                { col1: "Winkelschablone 250×250 mm",                  col2: "WS250.250", netto: "59,00 €",  brutto: "70,21 €" },
                { col1: "Winkelschablone 300×300×100 mm Seitenteile",  col2: "WS300.300", netto: "149,00 €", brutto: "177,31 €" },
              ]}
            />
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/kontakt"
              className="bg-plasma text-white font-semibold px-8 py-4 text-base hover:bg-plasma/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-6px_rgba(31,169,217,0.5)]"
            >
              Artikel anfragen
            </Link>
            <Link
              href="/schweißtische"
              className="border border-carbon/20 text-carbon font-semibold px-8 py-4 text-base hover:border-carbon/40 transition-colors"
            >
              Zu den Schweißtischen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
