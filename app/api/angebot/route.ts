import { NextResponse } from "next/server";

/*
 * Nimmt die Konfigurator-Zusammenstellung entgegen und sendet sie als
 * formatierte Angebotsanfrage per E-Mail (Resend) an den Betrieb.
 *
 * Benötigte Umgebungsvariablen (.env.local):
 *   RESEND_API_KEY   – API-Key von resend.com
 *   ANGEBOT_EMAIL    – Empfängeradresse (Test: eigene Mail, live: Daniel Loihl)
 *   ANGEBOT_FROM     – optional, Absender (Standard: onboarding@resend.dev,
 *                      funktioniert ohne Domain-Verifizierung)
 */

type Position = { qty: number; name: string; orderNo: string; price: number };

type Payload = {
  kontakt: {
    name: string;
    email: string;
    telefon?: string;
    firma?: string;
    nachricht?: string;
  };
  positionen: Position[];
  totalNetto: number;
  isSperrgut: boolean;
  serie: string;
  groesse: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function euro(n: number): string {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function buildEmailHtml(data: Payload, anfrageNr: string, datum: string): string {
  const { kontakt, positionen, totalNetto, isSperrgut } = data;
  const mwst = Math.round(totalNetto * 0.19 * 100) / 100;
  const brutto = Math.round(totalNetto * 1.19 * 100) / 100;

  const positionRows = positionen
    .map(
      (p, i) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #ECECEC;font-size:13px;color:#8A8A8A;">${i + 1}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #ECECEC;font-size:13px;color:#1A1A1A;text-align:center;">${p.qty}×</td>
          <td style="padding:10px 12px;border-bottom:1px solid #ECECEC;font-size:13px;color:#1A1A1A;font-weight:600;">${escapeHtml(p.name)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #ECECEC;font-size:12px;color:#8A8A8A;font-family:Consolas,Menlo,monospace;">${escapeHtml(p.orderNo)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #ECECEC;font-size:13px;color:#1A1A1A;text-align:right;white-space:nowrap;font-weight:600;">${euro(p.price)}</td>
        </tr>`
    )
    .join("");

  const kontaktRow = (label: string, value?: string) =>
    value
      ? `<tr>
          <td style="padding:6px 12px;font-size:12px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;width:110px;">${label}</td>
          <td style="padding:6px 12px;font-size:14px;color:#1A1A1A;font-weight:600;">${escapeHtml(value)}</td>
        </tr>`
      : "";

  const versandHinweis = isSperrgut
    ? "Versand auf Anfrage (Tischlänge über 2.400 mm) · zzgl. Verpackung 79,00 € netto"
    : "zzgl. Versand 249,00 € netto + Verpackung 79,00 € netto";

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2F2F0;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2F0;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#FFFFFF;border:1px solid #E4E4E2;">

        <!-- Header -->
        <tr>
          <td style="background:#141517;padding:28px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:1px;">L<span style="color:#1FA9D9;">O</span>IHL</span><br>
                  <span style="font-size:10px;color:#9A9DA1;text-transform:uppercase;letter-spacing:3px;">Metall- und Systembau</span>
                </td>
                <td align="right">
                  <span style="font-size:12px;color:#9A9DA1;text-transform:uppercase;letter-spacing:2px;">Angebotsanfrage</span><br>
                  <span style="font-size:14px;color:#FFFFFF;font-family:Consolas,Menlo,monospace;">${anfrageNr}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Intro -->
        <tr>
          <td style="padding:28px 32px 8px 32px;">
            <p style="margin:0 0 4px 0;font-size:11px;color:#1FA9D9;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Neue Konfiguration über den Website-Konfigurator</p>
            <p style="margin:0;font-size:13px;color:#6A6A6A;">Eingegangen am ${datum} · Der Kunde bittet um ein verbindliches Angebot.</p>
          </td>
        </tr>

        <!-- Kundendaten -->
        <tr>
          <td style="padding:20px 32px 0 32px;">
            <p style="margin:0 0 8px 0;font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Kunde</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F8F7;border:1px solid #ECECEC;">
              ${kontaktRow("Name", kontakt.name)}
              ${kontaktRow("Firma", kontakt.firma)}
              ${kontaktRow("E-Mail", kontakt.email)}
              ${kontaktRow("Telefon", kontakt.telefon)}
              ${
                kontakt.nachricht
                  ? `<tr><td colspan="2" style="padding:10px 12px;border-top:1px solid #ECECEC;font-size:13px;color:#4A4A4A;line-height:1.5;">${escapeHtml(kontakt.nachricht)}</td></tr>`
                  : ""
              }
            </table>
          </td>
        </tr>

        <!-- Positionen -->
        <tr>
          <td style="padding:24px 32px 0 32px;">
            <p style="margin:0 0 8px 0;font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Konfiguration · ${escapeHtml(data.serie)} · ${escapeHtml(data.groesse)}</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ECECEC;border-collapse:collapse;">
              <tr style="background:#F8F8F7;">
                <th align="left"  style="padding:10px 12px;font-size:10px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ECECEC;">Pos.</th>
                <th align="center" style="padding:10px 12px;font-size:10px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ECECEC;">Menge</th>
                <th align="left"  style="padding:10px 12px;font-size:10px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ECECEC;">Bezeichnung</th>
                <th align="left"  style="padding:10px 12px;font-size:10px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ECECEC;">Bestell-Nr.</th>
                <th align="right" style="padding:10px 12px;font-size:10px;color:#8A8A8A;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ECECEC;">Netto</th>
              </tr>
              ${positionRows}
            </table>
          </td>
        </tr>

        <!-- Summen -->
        <tr>
          <td style="padding:16px 32px 0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr><td></td><td width="280">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 12px;font-size:13px;color:#6A6A6A;">Zwischensumme netto</td>
                    <td align="right" style="padding:6px 12px;font-size:13px;color:#1A1A1A;font-weight:600;white-space:nowrap;">${euro(totalNetto)}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 12px;font-size:13px;color:#6A6A6A;border-bottom:1px solid #ECECEC;">MwSt. 19&nbsp;%</td>
                    <td align="right" style="padding:6px 12px;font-size:13px;color:#1A1A1A;border-bottom:1px solid #ECECEC;white-space:nowrap;">${euro(mwst)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px;font-size:15px;color:#1A1A1A;font-weight:800;">Gesamt brutto</td>
                    <td align="right" style="padding:10px 12px;font-size:16px;color:#1FA9D9;font-weight:800;white-space:nowrap;">${euro(brutto)}</td>
                  </tr>
                </table>
              </td></tr>
            </table>
            <p style="margin:8px 0 0 0;font-size:12px;color:#8A8A8A;">${versandHinweis}</p>
          </td>
        </tr>

        <!-- Hinweis -->
        <tr>
          <td style="padding:24px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0F9FD;border-left:3px solid #1FA9D9;">
              <tr><td style="padding:12px 16px;font-size:12px;color:#4A4A4A;line-height:1.6;">
                Fertigungszeit ca. <strong>10 Werktage</strong> ab Auftragsbestätigung ·
                Unverbindliche Anfrage über den Konfigurator auf metallbau-loihl.de ·
                Antwort direkt an den Kunden über &bdquo;Antworten&ldquo; möglich.
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#141517;padding:20px 32px;">
            <p style="margin:0;font-size:11px;color:#9A9DA1;line-height:1.8;">
              Loihl Metall- und Systembau · Hangweg 5a · 84180 Loiching, Bayern<br>
              kontakt@loihl-metallbau.de · 0176 43444600
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // ── Validierung ──
  const name = data?.kontakt?.name?.trim() ?? "";
  const email = data?.kontakt?.email?.trim() ?? "";
  if (!name || name.length > 120) {
    return NextResponse.json({ error: "Bitte geben Sie Ihren Namen an." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Bitte geben Sie eine gültige E-Mail-Adresse an." }, { status: 400 });
  }
  if (!Array.isArray(data.positionen) || data.positionen.length === 0 || data.positionen.length > 60) {
    return NextResponse.json({ error: "Die Konfiguration ist leer." }, { status: 400 });
  }
  for (const p of data.positionen) {
    if (
      typeof p.qty !== "number" || p.qty < 1 || p.qty > 99 ||
      typeof p.price !== "number" || p.price < 0 || p.price > 1_000_000 ||
      typeof p.name !== "string" || p.name.length > 200 ||
      typeof p.orderNo !== "string" || p.orderNo.length > 60
    ) {
      return NextResponse.json({ error: "Ungültige Positionsdaten." }, { status: 400 });
    }
  }
  if (typeof data.totalNetto !== "number" || data.totalNetto < 0 || data.totalNetto > 5_000_000) {
    return NextResponse.json({ error: "Ungültige Summe." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const empfaenger = process.env.ANGEBOT_EMAIL;
  if (!apiKey || !empfaenger) {
    return NextResponse.json(
      { error: "E-Mail-Versand ist noch nicht konfiguriert (RESEND_API_KEY / ANGEBOT_EMAIL fehlen)." },
      { status: 503 }
    );
  }

  const now = new Date();
  const anfrageNr = `ANF-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const datum = now.toLocaleString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin",
  }) + " Uhr";

  const html = buildEmailHtml(data, anfrageNr, datum);
  const from = process.env.ANGEBOT_FROM || "Loihl Konfigurator <onboarding@resend.dev>";
  const subject = `Angebotsanfrage ${anfrageNr} · ${data.serie} ${data.groesse} · ${euro(data.totalNetto)} netto`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [empfaenger],
      reply_to: email,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend-Fehler:", res.status, detail);
    return NextResponse.json(
      { error: "Die Anfrage konnte nicht versendet werden. Bitte versuchen Sie es später erneut." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, anfrageNr });
}
