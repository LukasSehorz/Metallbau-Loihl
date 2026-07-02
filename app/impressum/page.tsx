import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ImpressumPage() {
  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:gap-16 lg:gap-24 gap-8">
          <div className="w-full md:max-w-lg">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Transparenz</p>
            <h1 className="text-carbon text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest leading-tight">
              Impressum und Rechtliches
            </h1>
          </div>
          <div className="w-full md:max-w-lg flex flex-col justify-end gap-6">
            <p className="text-carbon/60 text-base leading-relaxed">
              Hier finden Sie alle erforderlichen Angaben zu Loihl Metall- und Systembau.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/kontakt" className="bg-plasma text-white font-semibold px-6 py-3 hover:bg-plasma/90 transition-colors inline-block">
                Kontakt
              </Link>
              <Link href="/" className="border border-carbon/20 text-carbon font-semibold px-6 py-3 hover:border-carbon/40 transition-colors inline-block">
                Zurück
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impressum-Inhalt */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col gap-8">
            <div>
              <h2 className="text-carbon font-bold text-xl mb-4">Angaben gemäß § 5 TMG</h2>
              <div className="text-carbon/60 text-base leading-relaxed flex flex-col gap-1">
                <p className="text-carbon font-semibold">Loihl Metall- und Systembau</p>
                <p>Inhaber: Daniel Loihl</p>
                <p>Hangweg 5a</p>
                <p>84180 Loiching</p>
              </div>
            </div>

            <div className="border-t border-carbon/10 pt-8">
              <h2 className="text-carbon font-bold text-xl mb-4">Kontakt</h2>
              <div className="text-carbon/60 text-base leading-relaxed flex flex-col gap-1">
                <p>
                  Telefon:{" "}
                  <a href="tel:+4917643444600" className="text-plasma hover:underline">
                    0176 43444600
                  </a>
                </p>
                <p>
                  E-Mail:{" "}
                  <a href="mailto:kontakt@loihl-metallbau.de" className="text-plasma hover:underline">
                    kontakt@loihl-metallbau.de
                  </a>
                </p>
              </div>
            </div>

            <div className="border-t border-carbon/10 pt-8">
              <h2 className="text-carbon font-bold text-xl mb-4">
                Umsatzsteuer-Identifikationsnummer
              </h2>
              <p className="text-carbon/60 text-base leading-relaxed">
                Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
                <br />
                <span className="text-carbon/40 italic">[Wird nach Erhalt ergänzt]</span>
              </p>
            </div>

            <div className="border-t border-carbon/10 pt-8">
              <h2 className="text-carbon font-bold text-xl mb-4">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p className="text-carbon/60 text-base leading-relaxed">
                Daniel Loihl, Hangweg 5a, 84180 Loiching
              </p>
            </div>

            <div className="border-t border-carbon/10 pt-8">
              <h2 className="text-carbon font-bold text-xl mb-4">Haftung für Inhalte</h2>
              <p className="text-carbon/60 text-base leading-relaxed">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </div>

            <div className="border-t border-carbon/10 pt-8">
              <h2 className="text-carbon font-bold text-xl mb-4">Haftung für Links</h2>
              <p className="text-carbon/60 text-base leading-relaxed">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </div>

            <div className="border-t border-carbon/10 pt-8">
              <h2 className="text-carbon font-bold text-xl mb-4">Urheberrecht</h2>
              <p className="text-carbon/60 text-base leading-relaxed">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </>
  );
}
