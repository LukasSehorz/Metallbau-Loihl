"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_EVENT,
  leseConsent,
  speichereConsent,
  type ConsentState,
} from "@/lib/consent";

/*
 * Zwei-Klick-Lösung für die Google-Maps-Karte.
 *
 * Ohne Einwilligung wird KEIN Request an Google gesendet — der iframe entsteht
 * erst nach dem Klick. Vorher steht an seiner Stelle ein Platzhalter mit
 * Hinweis darauf, welche Daten übertragen werden. Das ist der Grund für diese
 * Komponente: Beim direkten Einbetten lädt die Karte schon beim Seitenaufruf
 * und überträgt dabei die IP-Adresse jedes Besuchers an Google.
 *
 * Die Entscheidung teilt sich denselben Speicher wie das Cookie-Banner. Wer
 * dort "Externe Karten" erlaubt, sieht die Karte sofort; der Klick hier setzt
 * umgekehrt dieselbe Kategorie. Sonst würden Banner und Karte
 * widersprüchliche Zustände anzeigen.
 */

const MAP_SRC =
  "https://maps.google.com/maps?q=Hangweg%205a%2C%2084180%20Loiching&t=m&z=16&output=embed&hl=de";
const ROUTE_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Hangweg+5a,+84180+Loiching";

export default function MapConsent({ minHeight = 560 }: { minHeight?: number }) {
  const [loaded, setLoaded] = useState(false);

  // Erst nach dem Mount lesen — sonst weicht das Server-Rendering vom Client ab.
  useEffect(() => {
    setLoaded(leseConsent()?.karten === true);

    // Auf Änderungen im Banner reagieren, damit die Karte nicht stehen bleibt.
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState | null>).detail;
      setLoaded(detail?.karten === true);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  const accept = () => {
    // Die übrigen Kategorien unangetastet lassen: Wer nur die Karte sehen
    // will, hat damit nicht dem Tracking zugestimmt.
    const aktuell = leseConsent();
    speichereConsent({ statistik: aktuell?.statistik === true, karten: true });
  };

  if (loaded) {
    return (
      <iframe
        title="Loihl Metall- und Systembau Standort"
        src={MAP_SRC}
        referrerPolicy="no-referrer-when-downgrade"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight, display: "block" }}
        allowFullScreen
        loading="lazy"
      />
    );
  }

  return (
    <div
      className="h-full w-full bg-gray-100 border border-carbon/10 flex flex-col items-center justify-center gap-5 px-8 py-12 text-center"
      style={{ minHeight }}
    >
      <svg
        className="w-10 h-10 text-carbon/30"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="square"
          strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path strokeLinecap="square" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>

      <div className="max-w-md">
        <p className="font-bold text-base text-carbon mb-2">Karte von Google Maps</p>
        <p className="text-carbon/60 text-sm leading-relaxed">
          Beim Laden der Karte wird eine Verbindung zu Google hergestellt. Dabei
          werden Ihre IP-Adresse und Browserdaten an Google übertragen. Näheres
          in unserer{" "}
          <a href="/datenschutz" className="underline hover:text-carbon">
            Datenschutzerklärung
          </a>
          .
        </p>
      </div>

      <button
        type="button"
        onClick={accept}
        className="bg-plasma text-white font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
      >
        Karte laden
      </button>

      <div className="text-carbon/50 text-sm">
        <p className="mb-1">Hangweg 5a · 84180 Loiching</p>
        <a
          href={ROUTE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-carbon"
        >
          Route in Google Maps öffnen →
        </a>
      </div>
    </div>
  );
}
