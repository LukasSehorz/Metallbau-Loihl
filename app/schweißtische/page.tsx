"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const toSerie = [
  { maße: "2900×1400×200", bestell: "TO290.140", netto: "3.100,00 €", brutto: "3.689,00 €" },
  { maße: "2900×1200×200", bestell: "TO290.120", netto: "2.930,00 €", brutto: "3.486,70 €" },
  { maße: "2900×1000×200", bestell: "TO290.100", netto: "2.810,00 €", brutto: "3.343,90 €" },
  { maße: "2400×1400×200", bestell: "TO240.140", netto: "2.810,00 €", brutto: "3.343,90 €" },
  { maße: "2400×1200×200", bestell: "TO240.120", netto: "2.410,00 €", brutto: "2.867,90 €" },
  { maße: "2000×1400×200", bestell: "TO200.140", netto: "2.410,00 €", brutto: "2.867,90 €" },
  { maße: "2000×1200×200", bestell: "TO200.120", netto: "2.200,00 €", brutto: "2.618,00 €" },
  { maße: "2000×1000×200", bestell: "TO200.100", netto: "1.980,00 €", brutto: "2.356,20 €" },
  { maße: "1800×900×200",  bestell: "TO180.090", netto: "1.780,00 €", brutto: "2.118,20 €" },
  { maße: "1400×1400×200", bestell: "TO140.140", netto: "1.980,00 €", brutto: "2.356,20 €" },
  { maße: "1200×1200×200", bestell: "TO120.120", netto: "1.720,00 €", brutto: "2.046,80 €" },
  { maße: "1000×1000×200", bestell: "TO100.100", netto: "1.590,00 €", brutto: "1.892,10 €" },
];

const tdSerie = [
  { maße: "2900×1400×200", bestell: "TD290.140", netto: "3.300,00 €", brutto: "3.927,00 €" },
  { maße: "2900×1200×200", bestell: "TD290.120", netto: "3.150,00 €", brutto: "3.748,50 €" },
  { maße: "2900×1000×200", bestell: "TD290.100", netto: "3.050,00 €", brutto: "3.629,50 €" },
  { maße: "2400×1400×200", bestell: "TD240.140", netto: "3.000,00 €", brutto: "3.570,00 €" },
  { maße: "2400×1200×200", bestell: "TD240.120", netto: "2.590,00 €", brutto: "3.082,10 €" },
  { maße: "2000×1400×200", bestell: "TD200.140", netto: "2.590,00 €", brutto: "3.082,10 €" },
  { maße: "2000×1200×200", bestell: "TD200.120", netto: "2.460,00 €", brutto: "2.927,40 €" },
  { maße: "2000×1000×200", bestell: "TD200.100", netto: "2.210,00 €", brutto: "2.629,90 €" },
  { maße: "1800×900×200",  bestell: "TD180.090", netto: "1.950,00 €", brutto: "2.320,50 €" },
  { maße: "1400×1400×200", bestell: "TD140.140", netto: "2.200,00 €", brutto: "2.618,00 €" },
  { maße: "1200×1200×200", bestell: "TD120.120", netto: "1.900,00 €", brutto: "2.261,00 €" },
  { maße: "1000×1000×200", bestell: "TD100.100", netto: "1.650,00 €", brutto: "1.963,50 €" },
];

const aluOhne = [
  { maße: "2900×1400×2", bestell: "AO290.140", netto: "330,00 €", brutto: "392,70 €" },
  { maße: "2400×1400×2", bestell: "AO240.140", netto: "280,00 €", brutto: "333,20 €" },
  { maße: "2400×1200×2", bestell: "AO240.120", netto: "275,00 €", brutto: "327,25 €" },
  { maße: "2000×1400×2", bestell: "AO200.140", netto: "275,00 €", brutto: "327,25 €" },
  { maße: "2000×1200×2", bestell: "AO200.120", netto: "270,00 €", brutto: "321,30 €" },
  { maße: "2000×1000×2", bestell: "AO200.100", netto: "260,00 €", brutto: "309,40 €" },
  { maße: "1800×900×2",  bestell: "AO180.090", netto: "250,00 €", brutto: "297,50 €" },
  { maße: "1400×1400×2", bestell: "AO140.140", netto: "270,00 €", brutto: "321,30 €" },
  { maße: "1200×1200×2", bestell: "AO120.120", netto: "250,00 €", brutto: "297,50 €" },
  { maße: "1000×1000×2", bestell: "AO100.100", netto: "240,00 €", brutto: "285,60 €" },
];

const aluMit = [
  { maße: "2900×1400×2", bestell: "AD290.140", netto: "340,00 €", brutto: "404,60 €" },
  { maße: "2400×1400×2", bestell: "AD240.140", netto: "290,00 €", brutto: "345,10 €" },
  { maße: "2400×1200×2", bestell: "AD240.120", netto: "285,00 €", brutto: "339,15 €" },
  { maße: "2000×1400×2", bestell: "AD200.140", netto: "285,00 €", brutto: "339,15 €" },
  { maße: "2000×1200×2", bestell: "AD200.120", netto: "280,00 €", brutto: "333,20 €" },
  { maße: "2000×1000×2", bestell: "AD200.100", netto: "270,00 €", brutto: "321,30 €" },
  { maße: "1800×900×2",  bestell: "AD180.090", netto: "260,00 €", brutto: "309,40 €" },
  { maße: "1400×1400×2", bestell: "AD140.140", netto: "280,00 €", brutto: "333,20 €" },
  { maße: "1200×1200×2", bestell: "AD120.120", netto: "260,00 €", brutto: "309,40 €" },
  { maße: "1000×1000×2", bestell: "AD100.100", netto: "250,00 €", brutto: "297,50 €" },
];

function PriceTable({ rows }: { rows: { maße: string; bestell: string; netto: string; brutto: string }[] }) {
  return (
    <div className="border border-carbon/10 overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="bg-gray-50 border-b border-carbon/10">
            <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-carbon/60">Maße (l×b×h) mm</th>
            <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-carbon/60">Bestellnummer</th>
            <th className="text-right px-5 py-3 text-xs font-mono uppercase tracking-widest text-carbon/60">Preis netto</th>
            <th className="text-right px-5 py-3 text-xs font-mono uppercase tracking-widest text-carbon/60">inkl. 19% MwSt.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-carbon/10">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50/60 transition-colors">
              <td className="px-5 py-3.5 font-mono text-carbon text-sm">{row.maße}</td>
              <td className="px-5 py-3.5 font-mono text-carbon/60 text-sm">{row.bestell}</td>
              <td className="px-5 py-3.5 text-right font-semibold text-carbon text-sm">{row.netto}</td>
              <td className="px-5 py-3.5 text-right text-carbon/60 text-sm">{row.brutto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabPills({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => onChange(i)}
          className={`px-5 py-2 text-sm font-semibold font-mono transition-all duration-150 ${
            active === i
              ? "bg-carbon text-white"
              : "border border-carbon/20 text-carbon hover:border-carbon/40"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default function SchweißtischePage() {
  const [serieTab, setSerieTab] = useState(0);
  const [aluTab, setAluTab] = useState(0);

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:gap-16 lg:gap-24 gap-8">
          <div className="w-full md:max-w-lg">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Schweißtische</p>
            <h1 className="text-carbon text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest leading-tight">
              Schweißtische — bayerische Manufaktur, geprüfte Präzision
            </h1>
          </div>
          <div className="w-full md:max-w-lg flex flex-col justify-end gap-6">
            <p className="text-carbon/60 text-base leading-relaxed">
              Standardmaße ab 1.590 € netto. Maßanfertigung möglich. Fertigungszeit ca. 10 Werktage.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#konfigurator"
                className="bg-plasma text-white font-semibold px-6 py-3 hover:bg-plasma/90 transition-colors inline-block"
              >
                Konfigurator
              </Link>
              <Link
                href="/kontakt"
                className="border border-carbon/20 text-carbon font-semibold px-6 py-3 hover:border-carbon/40 transition-colors inline-block"
              >
                Katalog anfragen
              </Link>
            </div>
            <p className="text-carbon/40 text-xs font-mono">Auch Sondermaße sind realisierbar.</p>
          </div>
        </div>
      </section>

      {/* Serie wählen */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Serie wählen</p>
          <h2 className="text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-3">
            TO-Serie oder TD-Serie?
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-8 max-w-2xl">
            Beide Serien bieten Ø 28 mm Bohrungen im 100×100 mm Raster. Der Unterschied liegt in der Lochung der Tischoberfläche und der Seitenteile.
          </p>

          {/* Serie description cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              {
                label: "TO-Serie",
                desc: "Lochabstand 100×100 an der Oberseite, Seitenteile mit Diagonallochung",
                highlight: serieTab === 0,
              },
              {
                label: "TD-Serie",
                desc: "Lochabstand 100×100 + Diagonallochung an der Oberseite, Seitenteile mit Diagonallochung",
                highlight: serieTab === 1,
              },
            ].map((card, i) => (
              <button
                key={card.label}
                onClick={() => setSerieTab(i)}
                className={`text-left p-6 border transition-all duration-150 ${
                  card.highlight
                    ? "border-plasma/50 bg-plasma/5"
                    : "border-carbon/10 hover:border-carbon/20"
                }`}
              >
                <p
                  className={`text-sm font-mono font-semibold uppercase tracking-widest mb-2 ${
                    card.highlight ? "text-plasma" : "text-carbon/40"
                  }`}
                >
                  {card.label}
                </p>
                <p className="text-carbon text-sm leading-relaxed">{card.desc}</p>
              </button>
            ))}
          </div>

          <TabPills
            tabs={["TO-Serie", "TD-Serie"]}
            active={serieTab}
            onChange={setSerieTab}
          />

          <PriceTable rows={serieTab === 0 ? toSerie : tdSerie} />

          <p className="text-carbon/40 text-xs font-mono mt-4">
            Alle Preise zzgl. MwSt. · Sondermaße realisierbar · Fertigungszeit ca. 10 Werktage
          </p>
        </div>
      </section>

      {/* Füße */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Füße</p>
          <h2 className="text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-8">
            Standfüße & Rollen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard */}
            <div className="border border-carbon/10 p-8 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-carbon/40 mb-1">Standard</p>
                  <h3 className="text-carbon font-bold text-xl">Feststehende Füße</h3>
                </div>
                <span className="bg-carbon/5 border border-carbon/10 text-carbon/60 text-xs font-mono px-3 py-1 shrink-0">
                  Im Preis enthalten
                </span>
              </div>
              <p className="text-carbon/60 text-sm leading-relaxed">
                Stabile, höhenverstellbare Standfüße aus Stahl. Im Lieferumfang aller Schweißtische enthalten.
              </p>
            </div>

            {/* Upgrade */}
            <div className="border border-plasma/30 bg-plasma/3 p-8 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-plasma mb-1">Upgrade</p>
                  <h3 className="text-carbon font-bold text-xl">Schwerlastrollen</h3>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-carbon font-bold text-lg">279,00 €</p>
                  <p className="text-carbon/40 text-xs font-mono">332,01 € brutto</p>
                </div>
              </div>
              <p className="text-carbon/60 text-sm leading-relaxed">
                Blickle-Schwerlastrollen, 4 Stück. Tragfähigkeit 1.375 kg/Rolle. Alle 4 Rollen können in der Drehbewegung gesperrt werden. Für einfaches Verschieben des Tisches.
              </p>
              <div className="mt-auto pt-2">
                <Link
                  href="/kontakt"
                  className="inline-block bg-plasma text-white font-semibold px-5 py-2.5 text-sm hover:bg-plasma/90 transition-colors"
                >
                  Zum Tisch dazubestellen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alubleche */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Alubleche</p>
          <h2 className="text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-3">
            Aluabdeckbleche
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-8 max-w-2xl">
            Aluabdeckbleche verhindern Fremdrost bei der Edelstahlverarbeitung. Ø 28 mm Bohrungen wie Schweißtisch-Oberseite. 100×100 Hilfsmarkierung gleich wie Schweißtisch.
          </p>

          <TabPills
            tabs={["OHNE Diagonallochung (AO)", "MIT Diagonallochung (AD)"]}
            active={aluTab}
            onChange={setAluTab}
          />

          <PriceTable rows={aluTab === 0 ? aluOhne : aluMit} />

          <p className="text-carbon/40 text-xs font-mono mt-4">
            Alle Preise zzgl. MwSt. · Materialstärke 2 mm Aluminium
          </p>
        </div>
      </section>

      {/* Versand & Hinweise */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Versand & Hinweise</p>
          <h2 className="text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-8">
            Lieferung & Konditionen
          </h2>
          <div className="border border-carbon/10 divide-y divide-carbon/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-5">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-carbon/40 mb-1">Versand Deutschland</p>
                <p className="text-carbon font-semibold">249,00 € netto <span className="text-carbon/50 font-normal text-sm">(296,31 € brutto)</span></p>
              </div>
              <p className="text-carbon/60 text-sm leading-relaxed self-center">
                Zuzüglich 79,00 € netto (94,01 € brutto) Verpackungspauschale
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-5">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-carbon/40 mb-1">Tische über 2400 mm</p>
                <p className="text-carbon font-semibold">Versand auf Anfrage</p>
              </div>
              <p className="text-carbon/60 text-sm leading-relaxed self-center">
                Bei Längen über 2400 mm erstellen wir Ihnen ein individuelles Versandangebot
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-5">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-carbon/40 mb-1">Fertigungszeit</p>
                <p className="text-carbon font-semibold">ca. 10 Werktage</p>
              </div>
              <p className="text-carbon/60 text-sm leading-relaxed self-center">
                Ab Auftragsbestätigung. Sondermaße auf Anfrage.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-5">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-carbon/40 mb-1">Sondermaße</p>
                <p className="text-carbon font-semibold">Jederzeit realisierbar</p>
              </div>
              <p className="text-carbon/60 text-sm leading-relaxed self-center">
                Individuelle Abmessungen zum gleichen Quadratmeterpreis. Anfrage genügt.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/#konfigurator"
              className="bg-plasma text-white font-semibold px-8 py-4 text-base hover:bg-plasma/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-6px_rgba(31,169,217,0.5)]"
            >
              Jetzt konfigurieren
            </Link>
            <Link
              href="/kontakt"
              className="border border-carbon/20 text-carbon font-semibold px-8 py-4 text-base hover:border-carbon/40 transition-colors"
            >
              Direkt anfragen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
