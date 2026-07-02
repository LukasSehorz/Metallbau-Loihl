import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KonfiguratorTeaser from "@/components/KonfiguratorTeaser";
import FaqAccordion from "@/components/FaqAccordion";
import Link from "next/link";

const faqItems = [
  {
    question: "Ist meine Anfrage verbindlich?",
    answer: "Nein. Eine Anfrage über den Konfigurator ist unverbindlich. Sie erhalten ein Angebot, das Sie annehmen oder ablehnen können.",
  },
  {
    question: "Kann ich noch ändern?",
    answer: "Ja, jederzeit. Nach dem Absenden können Sie Ihre Konfiguration per E-Mail oder Telefon anpassen.",
  },
  {
    question: "Bekomme ich ein Angebot?",
    answer: "Selbstverständlich. Nach Ihrer Anfrage erhalten Sie innerhalb von 24 Stunden ein Angebot.",
  },
  {
    question: "Wie lange gilt der Preis?",
    answer: "Das Angebot ist 30 Tage gültig.",
  },
  {
    question: "Was passiert danach?",
    answer: "Daniel kontaktiert Sie persönlich. Gemeinsam finalisieren Sie die Anfrage.",
  },
];

export default function KonfiguratorPage() {
  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:gap-16 lg:gap-24 gap-8">
          <div className="w-full md:max-w-lg">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Konfigurator</p>
            <h1 className="text-carbon text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest leading-tight">
              Bauen Sie Ihren Tisch
            </h1>
          </div>
          <div className="w-full md:max-w-lg flex flex-col justify-end gap-6">
            <p className="text-carbon/60 text-base leading-relaxed">
              Wählen Sie Modell, Maße und Ausstattung. Der Preis berechnet sich live. In fünf Schritten zum perfekten Schweißtisch.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#konfigurator" className="bg-plasma text-white font-semibold px-6 py-3 hover:bg-plasma/90 transition-colors inline-block">
                Starten
              </a>
              <Link href="/katalog" className="border border-carbon/20 text-carbon font-semibold px-6 py-3 hover:border-carbon/40 transition-colors inline-block">
                Katalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Konfigurator Teaser */}
      <div id="konfigurator">
        <KonfiguratorTeaser />
      </div>

      {/* Konfigurations-Übersicht */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Zusammenfassung</p>
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest mb-4">
            Ihre Konfiguration im Überblick
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-12 max-w-xl">
            Alle gewählten Optionen, der Gesamtpreis und die voraussichtliche Lieferzeit sind hier zusammengefasst.
          </p>
          <div className="flex flex-col gap-0">
            {[
              {
                label: "Serie",
                text: "TO-Serie mit 100×100 mm Lochraster oder TD-Serie mit zusätzlicher Diagonallochung auf der Oberseite.",
              },
              {
                label: "Tischgröße",
                text: "12 Standardmaße von 1.000×1.000 bis 2.900×1.400 mm — Sondermaße jederzeit auf Anfrage realisierbar.",
              },
              {
                label: "Füße & Rollen",
                text: "Feststehende, höhenverstellbare Standfüße im Preis enthalten — optional Blickle-Schwerlastrollen.",
              },
              {
                label: "Aluabdeckblech & Zubehör",
                text: "Passendes Abdeckblech, Schraubzwingen, Anschläge, Winkel und mehr — alles kompatibel mit dem Ø 28 mm Lochsystem.",
              },
              {
                label: "Fertigungszeit",
                text: "Ca. 20 Werktage ab Auftragsbestätigung. Gefertigt in Loiching, Bayern.",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-row gap-8 border-l-2 border-plasma pl-6 py-6 relative">
                <div className="absolute -left-[9px] top-7 w-4 h-4 rounded-full bg-plasma border-2 border-white" />
                <div className="flex flex-col gap-1">
                  <p className="text-carbon font-semibold text-sm">{item.label}</p>
                  <p className="text-carbon/60 text-base leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-off-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest mb-4">
            Fragen
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-12 max-w-xl">
            Alles Wichtige zur Anfrage und zum nächsten Schritt.
          </p>
          <div className="max-w-3xl">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
