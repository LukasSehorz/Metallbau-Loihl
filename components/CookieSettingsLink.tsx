"use client";

import { consentErneutAbfragen } from "@/lib/consent";

/*
 * Öffnet das Einwilligungsbanner erneut. Ohne eine jederzeit erreichbare
 * Widerrufsmöglichkeit ist die Einwilligung nicht wirksam — deshalb steht
 * dieser Link im Footer jeder Seite.
 *
 * Der Tag Manager lässt sich nach dem Laden nicht wieder entfernen. Wird die
 * Zustimmung zurückgenommen, lädt die Seite deshalb neu, damit der Container
 * tatsächlich verschwindet.
 */

export default function CookieSettingsLink({
  className,
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={consentErneutAbfragen}
      className={className}
    >
      Cookie-Einstellungen
    </button>
  );
}
