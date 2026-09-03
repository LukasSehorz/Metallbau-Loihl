"use client";

import { useEffect, useRef } from "react";
import {
  CONSENT_EVENT,
  leseConsent,
  type ConsentState,
} from "@/lib/consent";

/*
 * Lädt den Google Tag Manager — aber ausschließlich nach ausdrücklicher
 * Einwilligung in die Kategorie "Statistik & Marketing".
 *
 * Das ist derselbe Container-Aufruf wie im Standard-Snippet von Google, nur
 * eben nicht beim Seitenaufruf, sondern erst nach dem Klick. Das
 * noscript-iframe aus dem Original-Snippet fehlt bewusst: Es würde ohne
 * JavaScript laden, und ohne JavaScript kann es keine Einwilligung geben.
 *
 * Zusätzlich wird der Consent Mode von Google bedient, damit Tags innerhalb
 * des Containers die Zustimmung ebenfalls kennen.
 */

const GTM_ID = "GTM-PSSC758T";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export default function GtmLoader() {
  // Der Container darf nur ein einziges Mal eingefügt werden, sonst zählt GTM
  // Seitenaufrufe doppelt.
  const geladen = useRef(false);

  useEffect(() => {
    const laden = () => {
      if (geladen.current) return;
      geladen.current = true;

      window.dataLayer = window.dataLayer || [];
      // Consent Mode: erst der Default (alles verweigert), dann die erteilte
      // Zustimmung — in dieser Reihenfolge erwartet Google die Signale.
      window.dataLayer.push({
        event: "default_consent",
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      window.dataLayer.push({
        event: "consent_granted",
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      document.head.appendChild(s);
    };

    if (leseConsent()?.statistik) laden();

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState | null>).detail;
      if (detail?.statistik) laden();
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return null;
}
