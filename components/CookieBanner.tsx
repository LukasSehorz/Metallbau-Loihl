"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CONSENT_EVENT,
  KEINE_EINWILLIGUNG,
  leseConsent,
  speichereConsent,
  type ConsentState,
} from "@/lib/consent";

/*
 * Einwilligungsbanner für Google Tag Manager und Google Maps.
 *
 * Beide Hauptschaltflächen sind bewusst gleich groß und gleich prominent:
 * Ein Banner, auf dem "Ablehnen" schwerer zu finden ist als "Akzeptieren",
 * gilt als unwirksame Einwilligung. Die nicht notwendigen Kategorien sind
 * standardmäßig aus — vorangekreuzte Häkchen sind ebenfalls unwirksam.
 */

const KATEGORIEN: {
  key: keyof ConsentState;
  titel: string;
  text: string;
}[] = [
  {
    key: "statistik",
    titel: "Statistik & Marketing",
    text:
      "Google Tag Manager. Erfasst anonymisiert, wie die Website genutzt wird, und steuert Marketing-Tags. Setzt Cookies und überträgt Daten an Google.",
  },
  {
    key: "karten",
    titel: "Externe Karten",
    text:
      "Google Maps zur Anzeige unseres Standorts. Beim Laden werden Ihre IP-Adresse und Browserdaten an Google übertragen.",
  },
];

export default function CookieBanner() {
  const [offen, setOffen] = useState(false);
  const [details, setDetails] = useState(false);
  const [wahl, setWahl] = useState<ConsentState>(KEINE_EINWILLIGUNG);

  useEffect(() => {
    // Erst nach dem Mount lesen, sonst weicht das Server-Rendering vom Client ab.
    if (leseConsent() === null) setOffen(true);

    // Auf den Footer-Link "Cookie-Einstellungen" reagieren.
    const onChange = (e: Event) => {
      if ((e as CustomEvent<ConsentState | null>).detail === null) {
        setWahl(KEINE_EINWILLIGUNG);
        setDetails(false);
        setOffen(true);
      }
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  const abschliessen = (state: ConsentState) => {
    // Ein einmal geladener Tag Manager lässt sich nicht wieder entfernen. Wird
    // die Zustimmung zurückgenommen, während er läuft, muss die Seite neu
    // geladen werden — sonst liefe er trotz Widerruf weiter.
    const laeuftGtm =
      typeof window !== "undefined" &&
      Array.isArray((window as { dataLayer?: unknown[] }).dataLayer);

    speichereConsent(state);
    setOffen(false);
    setDetails(false);

    if (laeuftGtm && !state.statistik) window.location.reload();
  };

  if (!offen) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Einwilligung zu externen Diensten"
      className="fixed inset-x-0 bottom-0 z-[9999] p-3 sm:p-5"
    >
      <div className="mx-auto max-w-3xl bg-carbon text-off-white border border-white/15 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-base font-bold mb-2">Ihre Privatsphäre</p>
          <p className="text-sm leading-relaxed text-off-white/70">
            Wir verwenden Cookies und externe Dienste. Technisch notwendige
            Funktionen sind immer aktiv. Alles Weitere — Statistik, Marketing und
            eingebettete Karten — nur mit Ihrer Einwilligung. Sie können diese
            jederzeit im Footer unter &bdquo;Cookie-Einstellungen&ldquo;
            widerrufen.{" "}
            <Link href="/datenschutz" className="underline hover:text-white">
              Datenschutzerklärung
            </Link>
          </p>

          {details && (
            <div className="mt-5 flex flex-col gap-3">
              <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">Notwendig</p>
                  <span className="text-xs uppercase tracking-wider text-off-white/40 shrink-0">
                    Immer aktiv
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-off-white/50 mt-1">
                  Erforderlich für den Betrieb der Website, etwa zum Speichern
                  dieser Auswahl. Überträgt keine Daten an Dritte.
                </p>
              </div>

              {KATEGORIEN.map((k) => (
                <label
                  key={k.key}
                  className="border border-white/10 bg-white/[0.03] px-4 py-3 cursor-pointer hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold">{k.titel}</span>
                    <input
                      type="checkbox"
                      checked={wahl[k.key]}
                      onChange={(e) =>
                        setWahl((w) => ({ ...w, [k.key]: e.target.checked }))
                      }
                      className="w-5 h-5 shrink-0 accent-plasma cursor-pointer"
                    />
                  </div>
                  <p className="text-xs leading-relaxed text-off-white/50 mt-1">
                    {k.text}
                  </p>
                </label>
              ))}
            </div>
          )}

          {/* Beide Hauptschaltflächen identisch dimensioniert — sonst ist die
              Einwilligung angreifbar. */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => abschliessen({ statistik: true, karten: true })}
              className="flex-1 bg-plasma text-white text-sm font-semibold px-5 py-3 hover:opacity-90 transition-opacity"
            >
              Alle akzeptieren
            </button>
            <button
              type="button"
              onClick={() =>
                abschliessen(details ? wahl : KEINE_EINWILLIGUNG)
              }
              className="flex-1 bg-white/10 text-white text-sm font-semibold px-5 py-3 border border-white/20 hover:bg-white/15 transition-colors"
            >
              {details ? "Auswahl speichern" : "Nur notwendige"}
            </button>
          </div>

          {!details && (
            <button
              type="button"
              onClick={() => setDetails(true)}
              className="mt-3 text-xs text-off-white/50 underline hover:text-off-white/80 transition-colors"
            >
              Einstellungen anpassen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
