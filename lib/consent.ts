/*
 * Zentraler Einwilligungs-Zustand für alle Dienste, die Daten an Dritte
 * übertragen — aktuell Google Tag Manager und Google Maps.
 *
 * Grundregel: Nichts lädt, bevor der Besucher zugestimmt hat. Der Tag Manager
 * setzt Cookies und kontaktiert Google, sobald sein Script im Dokument steht;
 * ein nachträgliches "Abschalten" gibt es nicht. Deshalb wird das Script erst
 * nach der Zustimmung überhaupt eingefügt, und ein Widerruf lädt die Seite neu,
 * statt so zu tun, als sei der Container wieder weg.
 *
 * Der Zustand liegt in localStorage. Das kann in privaten Fenstern oder bei
 * gesperrten Cookies werfen — jeder Zugriff ist deshalb gekapselt und fällt im
 * Zweifel auf "nicht zugestimmt" zurück.
 */

export type ConsentState = {
  /** Google Tag Manager samt der darin verwalteten Tags. */
  statistik: boolean;
  /** Eingebettete Google-Maps-Karten. */
  karten: boolean;
};

export const CONSENT_KEY = "loihl-consent-v1";
/** Schlüssel der früheren Nur-Karten-Lösung, wird einmalig übernommen. */
const ALT_MAPS_KEY = "loihl-maps-consent";
export const CONSENT_EVENT = "loihl-consent-change";

export const KEINE_EINWILLIGUNG: ConsentState = { statistik: false, karten: false };

/**
 * Liest den gespeicherten Zustand. Gibt `null` zurück, solange der Besucher
 * noch gar nicht entschieden hat — dann muss der Banner erscheinen.
 */
export function leseConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const roh = window.localStorage.getItem(CONSENT_KEY);
    if (roh) {
      const d = JSON.parse(roh) as Partial<ConsentState>;
      return { statistik: d.statistik === true, karten: d.karten === true };
    }
    // Wer der Karte früher schon zugestimmt hat, soll nicht erneut gefragt
    // werden — die Zustimmung galt aber nur der Karte, nicht dem Tracking.
    if (window.localStorage.getItem(ALT_MAPS_KEY) === "1") {
      return { statistik: false, karten: true };
    }
  } catch {
    /* privates Fenster o. ä. — als "noch nicht entschieden" behandeln */
  }
  return null;
}

export function speichereConsent(state: ConsentState): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
    // Den alten Schlüssel mitpflegen, damit beide Stände nicht auseinanderlaufen.
    window.localStorage.setItem(ALT_MAPS_KEY, state.karten ? "1" : "0");
  } catch {
    /* nicht speicherbar — die Wahl gilt dann nur für diese Sitzung */
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }));
}

/** Öffnet den Banner erneut, z. B. über den Link im Footer. */
export function consentErneutAbfragen(): void {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
    window.localStorage.removeItem(ALT_MAPS_KEY);
  } catch {
    /* ignorieren */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}
