import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

// Alle Angaben auf dieser Seite stammen aus dem Loihl-Katalog
// („Schweiß- und Spanntische“, Stand 01/2026) bzw. der Preisliste auf
// /schweisstische und /zubehoer. Ausnahme: Fertigungszeit ca. 10 Werktage
// nach Daniel Loihls Vorgabe (wie auf allen anderen Seiten; Katalog: 20).
// Ein eigenes Produkt „Spanntisch“ gibt es nicht — Schweiß- und Spanntisch
// sind bei Loihl derselbe Tisch (TO/TD).

const TECH_DATA = [
  { label: "Material", value: "S355 J2+N" },
  { label: "Plattenstärke", value: "15 mm" },
  { label: "Lochsystem", value: "Ø 28 mm" },
  { label: "Rasterabstand", value: "100 × 100 mm" },
  { label: "Zargenhöhe", value: "200 mm" },
  { label: "Tischhöhe", value: "850–950 mm, höhenverstellbar" },
];

const SERIES = [
  {
    label: "TO-Serie",
    price: "ab 1.590 € netto",
    desc: "Oberseite im Lochabstand 100 × 100 mm, Seitenteile mit Diagonallochung.",
  },
  {
    label: "TD-Serie",
    price: "ab 1.650 € netto",
    desc: "Oberseite im Lochabstand 100 × 100 mm plus Diagonallochung, Seitenteile mit Diagonallochung.",
  },
];

const SPANNZUBEHOER = [
  {
    img: "/images/product-schraubzwinge.jpg",
    name: "Schraubzwingen",
    desc: "Ganzstahl, Ø 28 mm. Halten durch Eigenhemmung im Tisch.",
    price: "ab 39,00 €",
  },
  {
    img: "/images/product-schnellspannkugelbolzen.jpg",
    name: "Schnellspannkugelbolzen",
    desc: "Spannkraft bis 22 kN. Messing MS 58, Schweißspritzer brennen nicht fest.",
    price: "38,00 €",
  },
  {
    img: "/images/product-schnellspanner.jpg",
    name: "Schnellspanner vertikal",
    desc: "Spannkraft 4.000 N (ca. 400 kg). Höhe über den Spannring einstellbar.",
    price: "59,00 €",
  },
  {
    img: "/images/product-absteckbolzen.jpg",
    name: "Absteckbolzen",
    desc: "Zum Abstecken von Anschlägen und für eigene Vorrichtungen. Material S355.",
    price: "12,00 €",
  },
  {
    img: "/images/product-alu-prisma.jpg",
    name: "Alu-Prismen 90° / 120°",
    desc: "Zum schonenden Spannen von Flachteilen, Vierkant- und Rundrohren. Mit Neodym-Magnet, selbstzentrierend.",
    price: "23,00 €",
  },
  {
    img: "/images/product-anschlag-150.jpg",
    name: "Anschläge",
    desc: "15 mm S355 J2+N, Bohrung Ø 28 mm. Mit Loch oder Langloch.",
    price: "ab 25,00 €",
  },
  {
    img: "/images/product-winkel.jpg",
    name: "Winkel",
    desc: "Von 200 bis 700 mm. Auch als Tischverlängerung nutzbar.",
    price: "ab 48,00 €",
  },
  {
    img: "/images/product-winkelschablone.jpg",
    name: "Winkelschablonen",
    desc: "250 × 250 mm oder 300 × 300 × 100 mm mit Seitenteilen.",
    price: "ab 59,00 €",
  },
];

export default function SpanntischePage() {
  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
          <div className="flex flex-col gap-6">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest">Spanntische</p>
            <h1 className="text-carbon text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest leading-tight">
              Spanntische mit Ø&nbsp;28&nbsp;mm Lochsystem
            </h1>
            <p className="text-carbon/60 text-base leading-relaxed max-w-lg">
              Bei uns sind Schweißtisch und Spanntisch ein Tisch. Über das Lochraster spannen Sie Ihr
              Werkstück sicher fest — mit Bolzen, Zwingen, Anschlägen und Winkeln. Gefertigt in
              Loiching aus S355 J2+N. Standardmaße ab 1.590 € netto, Fertigungszeit ca. 10 Werktage.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#konfigurator"
                className="bg-plasma text-white font-semibold px-6 py-3 hover:bg-plasma/90 transition-colors inline-block"
              >
                Konfigurator
              </Link>
              <Link
                href="/schweisstische"
                className="border border-carbon/20 text-carbon font-semibold px-6 py-3 hover:border-carbon/40 transition-colors inline-block"
              >
                Alle Größen &amp; Preise
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] md:aspect-[933/997] overflow-hidden bg-gray-100 border border-carbon/10">
            <img
              src="/images/Produkt-Bilder/Spann- und Schweißtisch.png"
              alt="Zwei verbundene Loihl-Spanntische mit Brücken und Winkel in der Werkstatt"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Technische Daten */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Technische Daten</p>
          <h2 className="text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-3">
            Ein Tisch zum Spannen und Schweißen
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-10 max-w-2xl">
            Alle Tische sind unten mit Querstreben verstärkt und stehen auf höhenverstellbaren,
            pulverbeschichteten Füßen (80 × 80 × 4 mm).
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-carbon/10 border border-carbon/10">
            {TECH_DATA.map((item) => (
              <div key={item.label} className="bg-white p-5 md:p-6">
                <p className="text-xs font-mono uppercase tracking-widest text-carbon/40 mb-2">{item.label}</p>
                <p className="text-carbon font-bold text-base md:text-lg leading-snug">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zwei Lochbilder */}
      <section className="bg-off-white px-6 md:px-10 py-16 md:py-24 lg:py-28 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Modelle</p>
          <h2 className="text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-3">
            Zwei Lochbilder, 12 Standardmaße
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-10 max-w-2xl">
            Von 1.000 × 1.000 bis 2.900 × 1.400 mm. Sondermaße fertigen wir auf Anfrage.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERIES.map((s) => (
              <div key={s.label} className="bg-white border border-carbon/10 p-8 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-carbon font-bold text-xl">{s.label}</h3>
                  <p className="text-plasma font-semibold text-sm shrink-0 pt-1">{s.price}</p>
                </div>
                <p className="text-carbon/60 text-sm leading-relaxed flex-1">{s.desc}</p>
                <Link
                  href="/schweisstische"
                  className="text-plasma text-sm font-semibold hover:underline flex items-center gap-1"
                >
                  Preistabelle ansehen <span>→</span>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-carbon/40 text-xs font-mono mt-6">
            Alle Preise zzgl. MwSt. · Fertigungszeit ca. 10 Werktage
          </p>
        </div>
      </section>

      {/* Spannzubehör */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Spannzubehör</p>
          <h2 className="text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-3">
            Das passende Zubehör zum Spannen
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-10 max-w-2xl">
            Passend zum Ø 28 mm Lochsystem. Preise netto.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPANNZUBEHOER.map((item) => (
              <div key={item.name} className="border border-carbon/10 flex flex-col">
                <div className="h-48 bg-gray-50 border-b border-carbon/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-6"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2 flex-1">
                  <h3 className="text-carbon font-bold text-base">{item.name}</h3>
                  <p className="text-carbon/60 text-sm leading-relaxed flex-1">{item.desc}</p>
                  <p className="text-plasma font-semibold text-sm">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/zubehoer"
              className="text-plasma text-sm font-semibold hover:underline inline-flex items-center gap-1"
            >
              Gesamtes Zubehör mit Bestellnummern <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Nach Maß + Abschluss */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Nach Maß</p>
          <h2 className="text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-3">
            Sondermaße und Sonderwünsche
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed max-w-2xl">
            Individuelle Kundenwünsche setzen wir gerne um. Anschlagleisten, Tischverlängerungen und
            Winkel fertigen wir auch nach Ihren Vorgaben.
          </p>
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
