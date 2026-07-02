"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ModellToPage() {
  const [email, setEmail] = useState("");

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:gap-16 lg:gap-24 gap-8">
          <div className="w-full md:max-w-lg">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Schweißtisch</p>
            <h1 className="text-carbon text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest leading-tight">
              Modell TO
            </h1>
          </div>
          <div className="w-full md:max-w-lg flex flex-col justify-end gap-6">
            <p className="text-carbon/60 text-base leading-relaxed">
              100x100er Lochraster mit Diagonallochung auf der Oberseite. Kompromisslos robust, individuell gefertigt nach deinen Anforderungen.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#konfigurator" className="bg-plasma text-white font-semibold px-6 py-3 hover:bg-plasma/90 transition-colors inline-block">
                Konfigurieren
              </Link>
              <Link href="/katalog" className="border border-carbon/20 text-carbon font-semibold px-6 py-3 hover:border-carbon/40 transition-colors inline-block">
                Katalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lochsystem */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="flex flex-col gap-6">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest">Lochsystem</p>
            <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest leading-tight">
              100×100 Millimeter Raster mit Diagonallochung
            </h2>
            <p className="text-carbon/60 text-base leading-relaxed">
              Das 100x100er Raster ist der Standard für professionelle Werkstätten. Die Diagonallochung auf der Oberseite verdoppelt deine Spannpositionen.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="border border-carbon/20 text-carbon font-semibold px-6 py-3 hover:border-carbon/40 transition-colors inline-block">
                Mehr erfahren
              </a>
              <Link href="/#konfigurator" className="bg-plasma text-white font-semibold px-6 py-3 hover:bg-plasma/90 transition-colors inline-block">
                Konfigurator
              </Link>
            </div>
          </div>
          <div className="bg-gray-100 border border-carbon/10 aspect-[4/3] flex items-center justify-center">
            <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest">
              Bild: Lochsystem Modell TO
            </span>
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="bg-off-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="flex flex-col gap-6">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest">Galerie</p>
            <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest leading-tight">
              Modell TO in der Praxis
            </h2>
            <p className="text-carbon/60 text-base leading-relaxed">
              Hochauflösende Aufnahmen zeigen die Verarbeitung und das Lochsystem.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Oberseite mit Diagonallochung",
                "Seitenansicht zeigt Stabilität",
                "Detail der Lochung",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-carbon/60 text-base">
                  <span className="text-plasma font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 border border-carbon/10 aspect-[4/3] flex items-center justify-center">
            <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest">
              Bild: Modell TO Galerie
            </span>
          </div>
        </div>
      </section>

      {/* Technische Daten */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="flex flex-col gap-6">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest">Spezifikationen</p>
            <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest leading-tight">
              Technische Daten auf einen Blick
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {[
              { value: "15 mm", label: "Materialstärke S355" },
              { value: "100×100", label: "Lochraster Millimeter" },
              { value: "2–4", label: "Wochen Lieferzeit" },
              { value: "Unbegrenzt", label: "Spannpositionen möglich" },
            ].map((stat, i) => (
              <div key={i} className="border-l-2 border-plasma pl-6">
                <p className="text-carbon font-bold text-2xl md:text-3xl mb-1">{stat.value}</p>
                <p className="text-carbon/60 text-sm leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ausstattung */}
      <section className="bg-off-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Ausstattung</p>
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest mb-4">
            Was du bekommst
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-12 max-w-xl">
            100×100 Millimeter Lochraster, Standard für Profis
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-carbon/10 p-6 flex flex-col gap-4">
              <h3 className="text-carbon font-bold text-base">Individuelle Maße</h3>
              <p className="text-carbon/60 text-sm leading-relaxed">Alle Größen anzeigen</p>
              <div className="bg-gray-100 border border-carbon/10 aspect-[4/3] flex items-center justify-center mt-2">
                <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest">Bild: Maße</span>
              </div>
            </div>
            <div className="bg-white border border-carbon/10 p-6 flex flex-col gap-4">
              <h3 className="text-carbon font-bold text-base">Kompatibilität mit Zubehör</h3>
              <p className="text-carbon/60 text-sm leading-relaxed">Spannelemente, Bolzen und Anschläge passen sofort</p>
              <div className="bg-gray-100 border border-carbon/10 aspect-[4/3] flex items-center justify-center mt-2">
                <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest">Bild: Zubehör</span>
              </div>
            </div>
            <div className="bg-white border border-carbon/10 p-6 flex flex-col gap-4">
              <h3 className="text-carbon font-bold text-base">Kompatibilität mit Zubehör</h3>
              <p className="text-carbon/60 text-sm leading-relaxed">Spannelemente, Bolzen und Anschläge passen sofort</p>
              <div className="bg-gray-100 border border-carbon/10 aspect-[4/3] flex items-center justify-center mt-2">
                <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest">Bild: Zubehör 2</span>
              </div>
            </div>
            <div className="bg-white border border-carbon/10 p-6 flex flex-col gap-4">
              <h3 className="text-carbon font-bold text-base">Beschichtung</h3>
              <p className="text-carbon/60 text-sm leading-relaxed">Verzugsarm und wartungsarm mit Oberflächenschutz</p>
              <div className="bg-gray-100 border border-carbon/10 aspect-[4/3] flex items-center justify-center mt-2">
                <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest">Bild: Beschichtung</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest mb-4">
            Dein unverbindliches Angebot
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-8 max-w-xl">
            Teile deine Anforderungen mit uns. Wir antworten schnell und ehrlich.
          </p>
          <form
            className="flex flex-col md:flex-row gap-4 mb-12 max-w-xl"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Deine E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-carbon/20 px-4 py-3 text-carbon text-sm w-full md:w-auto flex-1 focus:outline-none focus:border-plasma"
            />
            <button
              type="submit"
              className="bg-plasma text-white font-semibold px-6 py-3 hover:bg-plasma/90 transition-colors"
            >
              Absenden
            </button>
          </form>
          <div className="bg-gray-100 border border-carbon/10 aspect-[16/6] flex items-center justify-center">
            <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest">
              Bild: Werkstatt Loihl
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
