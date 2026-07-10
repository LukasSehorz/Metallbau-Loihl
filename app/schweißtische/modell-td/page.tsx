import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

export default function ModellTdPage() {
  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:gap-16 lg:gap-24 gap-8">
          <div className="w-full md:max-w-lg">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Präzision</p>
            <h1 className="text-carbon text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest leading-tight">
              Modell TD Schweißtisch
            </h1>
          </div>
          <div className="w-full md:max-w-lg flex flex-col justify-end gap-6">
            <p className="text-carbon/60 text-base leading-relaxed">
              100 x 100 mm Lochabstand mit Diagonallochung auf der Oberseite. Gebaut für Schweißer, die keine Kompromisse eingehen. Schnell verfügbar, maßgefertigt ohne Aufpreis.
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

      {/* Flexibilität */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="flex flex-col gap-6">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest">Flexibilität</p>
            <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest leading-tight">
              Zwei Lochmuster, eine Oberfläche
            </h2>
            <p className="text-carbon/60 text-base leading-relaxed">
              Der Modell TD kombiniert die bewährte 100 x 100 mm Standard-Lochung mit einer zusätzlichen Diagonallochung auf der Oberseite. Das gibt Ihnen maximale Flexibilität beim Spannen und Schweißen.
            </p>
          </div>
          <div className="bg-gray-100 border border-carbon/10 aspect-[4/3] flex items-center justify-center">
            <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest">
              Bild: Modell TD Flexibilität
            </span>
          </div>
        </div>
      </section>

      {/* Robustheit */}
      <section className="bg-off-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="md:sticky md:top-24 flex flex-col gap-6">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest">Robustheit</p>
            <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest leading-tight">
              Gebaut für Dauereinsatz und Präzision
            </h2>
            <p className="text-carbon/60 text-base leading-relaxed">
              Der Modell TD steht auf einer massiven Basis aus S355-Baustahl, die Verschleiß und Temperaturwechsel aushält.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {[
              {
                title: "Skalierbar mit Zubehör",
                text: "Ihr Tisch wächst mit Ihren Anforderungen.",
              },
              {
                title: "Oberflächenqualität",
                text: "Die Arbeitsfläche wird plan bearbeitet und vor der Auslieferung geprüft.",
              },
              {
                title: "Aufrüstbar jederzeit",
                text: "Beginnen Sie mit dem Basis-Modell und erweitern Sie später.",
              },
              {
                title: "Schnelle Lieferung",
                text: "Standard-Ausführungen sind in zwei Wochen bei Ihnen.",
              },
            ].map((card, i) => (
              <div key={i} className="bg-white border border-carbon/10 p-6 flex flex-col gap-3">
                <h3 className="text-carbon font-bold text-base">{card.title}</h3>
                <p className="text-carbon/60 text-base leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vier Schritte */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Einfach</p>
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest mb-4">
            Vier Schritte zum fertigen Tisch
          </h2>
          <p className="text-carbon/60 text-base leading-relaxed mb-12 max-w-xl">
            Der Weg vom Gedanken zum Tisch ist kurz.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                num: "01",
                title: "Größe wählen",
                text: "Entscheiden Sie sich für eine Standardgröße oder geben Sie Ihre Wunschmaße ein.",
              },
              {
                num: "02",
                title: "Konfigurieren",
                text: "Lochsystem, Beschichtung und Ausstattung wählen. Alles ohne Aufpreis.",
              },
              {
                num: "03",
                title: "Bestellen",
                text: "Unverbindliche Anfrage absenden. Angebot in 24 Stunden.",
              },
              {
                num: "04",
                title: "Liefern lassen",
                text: "In 2 Wochen steht der Tisch in Ihrer Werkstatt.",
              },
            ].map((step, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="bg-gray-100 border border-carbon/10 aspect-[4/3] flex items-center justify-center">
                  <span className="text-carbon/40 text-xs font-mono uppercase tracking-widest">
                    Bild: Schritt {step.num}
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-plasma font-mono font-bold text-xl shrink-0">{step.num}</span>
                  <div>
                    <h3 className="text-carbon font-bold text-base mb-1">{step.title}</h3>
                    <p className="text-carbon/60 text-base leading-relaxed">{step.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-off-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest mb-12">
            Häufig gefragt
          </h2>
          <div className="max-w-3xl">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
