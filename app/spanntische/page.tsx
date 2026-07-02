import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function SpanntischePage() {
  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:gap-16 lg:gap-24 gap-8">
          <div className="w-full md:max-w-lg">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Spanntische</p>
            <h1 className="text-carbon text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest leading-tight">
              Spanntische — Präzision für schwere Werkstücke
            </h1>
          </div>
          <div className="w-full md:max-w-lg flex flex-col justify-end gap-6">
            <p className="text-carbon/60 text-base leading-relaxed">
              Massive Stahlplatten mit präzisem Lochraster. Für Maschinenbau, Prototyping und große Werkstücke. Made in Bayern, geprüft auf Maßhaltigkeit nach DIN.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#konfigurator" className="bg-plasma text-white font-semibold px-6 py-3 hover:bg-plasma/90 transition-colors inline-block">
                Konfigurator
              </Link>
              <Link href="/katalog" className="border border-carbon/20 text-carbon font-semibold px-6 py-3 hover:border-carbon/40 transition-colors inline-block">
                Katalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Einsatzbereiche */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Einsatzbereiche</p>
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest mb-4">
            Wo Spanntische ihre Stärke zeigen
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-12 max-w-xl">
            Spanntische sind die erste Wahl für Präzisionsarbeiten unter Last.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Maschinenbau und Vorrichtungsbau",
                text: "Stabile Basis für komplexe Spannvorrichtungen.",
              },
              {
                title: "Prototypenbau mit hohen Anforderungen",
                text: "Präzision im Zehntelbereich.",
              },
              {
                title: "Schwerlast-Montage und Justage",
                text: "Massive Stahlplatten halten große Werkstücke sicher.",
              },
              {
                title: "Präzisions-Bohrungen und Fräsarbeiten",
                text: "Vibrationsfrei und formstabil.",
              },
            ].map((card, i) => (
              <div key={i} className="flex flex-col gap-3 border-t-2 border-plasma pt-6">
                <h3 className="text-carbon font-bold text-base">{card.title}</h3>
                <p className="text-carbon/60 text-base leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standardmaße */}
      <section className="bg-off-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Modelle</p>
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest mb-4">
            Spanntische in Standardmaßen
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-12 max-w-xl">
            Jeder Tisch wird in Bayern gefertigt. Lieferung in 2–4 Wochen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                size: "1500 × 1000 mm",
                specs: ["20 mm Materialstärke", "15 t Belastbarkeit", "D22"],
              },
              {
                size: "2000 × 1500 mm",
                specs: ["25 mm Materialstärke", "20 t Belastbarkeit", "D28"],
              },
              {
                size: "2500 × 2000 mm",
                specs: ["30 mm Materialstärke", "25 t Belastbarkeit", "Schwerlast"],
              },
            ].map((model, i) => (
              <div key={i} className="bg-white border border-carbon/10 p-8 flex flex-col gap-4">
                <div className="bg-gray-100 aspect-[4/3] flex items-center justify-center">
                  <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest">
                    Bild: {model.size}
                  </span>
                </div>
                <h3 className="text-carbon font-bold text-xl">{model.size}</h3>
                <ul className="flex flex-col gap-2">
                  {model.specs.map((spec, j) => (
                    <li key={j} className="flex items-center gap-2 text-carbon/60 text-sm">
                      <span className="text-plasma">—</span>
                      {spec}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/#konfigurator"
                  className="text-plasma text-sm font-semibold hover:underline flex items-center gap-1 mt-2"
                >
                  Konfigurieren
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vergleich */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Vergleich</p>
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest mb-4">
            Schweißtisch oder Spanntisch?
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-12 max-w-xl">
            Beide Tische sind robust, aber für unterschiedliche Aufgaben gebaut
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Schweißtisch */}
            <div className="border border-carbon/10 p-8 flex flex-col gap-6">
              <div className="bg-gray-100 border border-carbon/10 aspect-[4/3] flex items-center justify-center">
                <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest">
                  Bild: Schweißtisch
                </span>
              </div>
              <div>
                <h3 className="text-carbon font-bold text-xl mb-1">Schweißtisch — für Schweißarbeiten</h3>
                <p className="text-carbon/60 text-sm">Ideal für Schweißprojekte und Zusammenbau</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="border-l-2 border-plasma pl-3">
                  <p className="text-carbon font-bold text-sm">ab 1.890 €</p>
                  <p className="text-carbon/40 text-xs">Preis</p>
                </div>
                <div className="border-l-2 border-plasma pl-3">
                  <p className="text-carbon font-bold text-sm">8–12 t</p>
                  <p className="text-carbon/40 text-xs">Belastbarkeit</p>
                </div>
                <div className="border-l-2 border-plasma pl-3">
                  <p className="text-carbon font-bold text-sm">2–4 Wo.</p>
                  <p className="text-carbon/40 text-xs">Lieferzeit</p>
                </div>
              </div>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-2 text-sm text-carbon/60"><span className="text-plasma">✓</span>Kunsthandwerk</li>
                <li className="flex items-center gap-2 text-sm text-carbon/60"><span className="text-plasma">✓</span>Kleine bis mittlere Werkstücke</li>
                <li className="flex items-center gap-2 text-sm text-carbon/40"><span>✗</span>Schwerlast-Montage</li>
              </ul>
              <Link href="/schweißtische" className="text-plasma text-sm font-semibold hover:underline flex items-center gap-1">
                Schweißtische ansehen →
              </Link>
            </div>

            {/* Spanntisch */}
            <div className="border-2 border-plasma p-8 flex flex-col gap-6">
              <div className="bg-gray-100 border border-carbon/10 aspect-[4/3] flex items-center justify-center">
                <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest">
                  Bild: Spanntisch
                </span>
              </div>
              <div>
                <h3 className="text-carbon font-bold text-xl mb-1">Spanntisch — für Spannen, Bohren, Fräsen, Montieren</h3>
                <p className="text-carbon/60 text-sm">Spezialisiert auf Präzisionsbearbeitung und Schwerlast</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="border-l-2 border-plasma pl-3">
                  <p className="text-carbon font-bold text-sm">ab 2.890 €</p>
                  <p className="text-carbon/40 text-xs">Preis</p>
                </div>
                <div className="border-l-2 border-plasma pl-3">
                  <p className="text-carbon font-bold text-sm">15–25 t</p>
                  <p className="text-carbon/40 text-xs">Belastbarkeit</p>
                </div>
                <div className="border-l-2 border-plasma pl-3">
                  <p className="text-carbon font-bold text-sm">2–4 Wo.</p>
                  <p className="text-carbon/40 text-xs">Lieferzeit</p>
                </div>
              </div>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-2 text-sm text-carbon/60"><span className="text-plasma">✓</span>Präzisions-Bohrungen</li>
                <li className="flex items-center gap-2 text-sm text-carbon/60"><span className="text-plasma">✓</span>Große/schwere Werkstücke</li>
                <li className="flex items-center gap-2 text-sm text-carbon/60"><span className="text-plasma">✓</span>Prototypenbau</li>
              </ul>
              <Link href="/#konfigurator" className="bg-plasma text-white font-semibold px-6 py-3 hover:bg-plasma/90 transition-colors inline-block text-center">
                Spanntisch konfigurieren
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Zubehör */}
      <section className="bg-off-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Zubehör</p>
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest mb-12">
            Das richtige Zubehör für Ihren Spanntisch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Schwerlast-Spannelemente", desc: "Maximale Kraft für große Werkstücke", price: "ab 145 €" },
              { title: "Bolzen und Anschläge", desc: "Präzise Positionierung für Schwerlasteinsatz", price: "ab 18 €" },
              { title: "Niederhalter und Druckplatten", desc: "Sichere Fixierung von oben", price: "ab 75 €" },
              { title: "Winkel und Aufbauelemente", desc: "Modulare Erweiterung für komplexe Setups", price: "ab 55 €" },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-carbon/10 p-6 flex flex-col gap-3">
                <div className="bg-gray-100 aspect-[4/3] flex items-center justify-center mb-2">
                  <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest text-center px-2">
                    Bild: {item.title}
                  </span>
                </div>
                <h3 className="text-carbon font-bold text-base">{item.title}</h3>
                <p className="text-carbon/60 text-sm leading-relaxed">{item.desc}</p>
                <p className="text-plasma font-semibold text-sm">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                stars: "★★★★★",
                quote: "Ich kenne jeden Tisch, der hier rausgeht. Wenn etwas nicht stimmt, rufen Sie mich an — nicht ein Callcenter.",
                name: "Daniel Loihl",
                role: "Inhaber",
              },
              {
                stars: "★★★★★",
                quote: "Wir bauen nicht für Kataloge. Wir bauen für Menschen, die wissen, was sie brauchen.",
                name: "Thomas Wallner",
                role: "Stahlkunst Wallner",
              },
              {
                stars: "★★★★★",
                quote: "Lieferzeit wie versprochen, Qualität wie erwartet, Preis wie besprochen. Das ist selten geworden.",
                name: "Michael Bauer",
                role: "Metallwerkstatt Bauer",
              },
            ].map((t, i) => (
              <div key={i} className="border border-carbon/10 p-8 flex flex-col gap-4">
                <p className="text-plasma text-sm">{t.stars}</p>
                <p className="text-carbon/60 text-base leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-carbon font-semibold text-sm">{t.name}</p>
                  <p className="text-carbon/40 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
