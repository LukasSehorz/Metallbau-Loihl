import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:gap-16 lg:gap-24 gap-8">
          <div className="w-full md:max-w-lg">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Datenschutz</p>
            <h1 className="text-carbon text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest leading-tight">
              Datenschutzerklärung
            </h1>
          </div>
          <div className="w-full md:max-w-lg flex flex-col justify-end gap-6">
            <p className="text-carbon/60 text-base leading-relaxed">
              Ihre Daten sind sicher. Wir erheben nur das Notwendige und geben nichts weiter.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/kontakt" className="bg-plasma text-white font-semibold px-6 py-3 hover:bg-plasma/90 transition-colors inline-block">
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Datenschutz-Inhalt */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col gap-8">
            <div>
              <h2 className="text-carbon font-bold text-xl mb-4">1. Datenschutz auf einen Blick</h2>
              <h3 className="text-carbon font-semibold text-base mb-2">Allgemeine Hinweise</h3>
              <p className="text-carbon/60 text-base leading-relaxed">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
              </p>
            </div>

            <div className="border-t border-carbon/10 pt-8">
              <h2 className="text-carbon font-bold text-xl mb-4">2. Verantwortliche Stelle</h2>
              <div className="text-carbon/60 text-base leading-relaxed flex flex-col gap-1">
                <p className="text-carbon font-semibold">Loihl Metall- und Systembau</p>
                <p>Daniel Loihl</p>
                <p>Hangweg 5a, 84180 Loiching</p>
                <p>
                  <a href="mailto:kontakt@loihl-metallbau.de" className="text-plasma hover:underline">
                    kontakt@loihl-metallbau.de
                  </a>
                </p>
              </div>
            </div>

            <div className="border-t border-carbon/10 pt-8">
              <h2 className="text-carbon font-bold text-xl mb-4">3. Datenerfassung auf dieser Website</h2>

              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-carbon font-semibold text-base mb-2">Server-Log-Dateien</h3>
                  <p className="text-carbon/60 text-base leading-relaxed">
                    Der Webhoster erhebt automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
                  </p>
                </div>

                <div>
                  <h3 className="text-carbon font-semibold text-base mb-2">Kontaktformular</h3>
                  <p className="text-carbon/60 text-base leading-relaxed">
                    Wenn Sie uns per Formular anfragen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                  </p>
                </div>

                <div>
                  <h3 className="text-carbon font-semibold text-base mb-2">Cookies</h3>
                  <p className="text-carbon/60 text-base leading-relaxed">
                    Diese Website verwendet keine Tracking-Cookies. Technisch notwendige Cookies können gesetzt werden, um die Funktionalität der Website zu gewährleisten.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-carbon/10 pt-8">
              <h2 className="text-carbon font-bold text-xl mb-4">4. Ihre Rechte</h2>
              <p className="text-carbon/60 text-base leading-relaxed mb-4">
                Sie haben jederzeit das Recht auf:
              </p>
              <ul className="flex flex-col gap-2 text-carbon/60 text-base leading-relaxed">
                {[
                  "Auskunft über Ihre bei uns gespeicherten Daten (Art. 15 DSGVO)",
                  "Berichtigung unrichtiger Daten (Art. 16 DSGVO)",
                  "Löschung Ihrer Daten (Art. 17 DSGVO)",
                  "Einschränkung der Verarbeitung (Art. 18 DSGVO)",
                  "Datenübertragbarkeit (Art. 20 DSGVO)",
                  "Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)",
                  "Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)",
                ].map((right, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-plasma mt-1 shrink-0">—</span>
                    {right}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-carbon/10 pt-8">
              <h2 className="text-carbon font-bold text-xl mb-4">5. Kontakt</h2>
              <p className="text-carbon/60 text-base leading-relaxed">
                Bei Fragen zum Datenschutz wenden Sie sich bitte an:{" "}
                <a href="mailto:kontakt@loihl-metallbau.de" className="text-plasma hover:underline">
                  kontakt@loihl-metallbau.de
                </a>
              </p>
            </div>

            <div className="border-t border-carbon/10 pt-8">
              <h2 className="text-carbon font-bold text-xl mb-4">6. Änderungen dieser Datenschutzerklärung</h2>
              <p className="text-carbon/60 text-base leading-relaxed">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie stets den aktuellen rechtlichen Anforderungen zu entsprechen oder um Änderungen unserer Leistungen zu berücksichtigen. Es gilt die jeweils aktuelle Fassung.
              </p>
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </>
  );
}
