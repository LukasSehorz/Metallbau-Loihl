"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export type ShowroomConfig = {
  width: number;              // mm
  length: number;             // mm
  series: "TO" | "TD";        // TD = zusätzliche Diagonallochung auf der Oberseite
  feet: "fixed" | "casters";  // Feststehende Füße oder Blickle-Schwerlastrollen
  sheet: boolean;             // Aluabdeckblech aufgelegt
  metalness: number;
  roughness: number;
  accentColor: string;
  /** Zweiter Tisch daneben (Doppelplatz) */
  second?: boolean;
  /** Ausrichtung des zweiten Tisches: an der Längs- oder Stirnseite */
  secondArrangement?: "side" | "end";
  /** Beide Tische mit Schweißtischbrücken verbinden (erzeugt die mittige Öffnung) */
  bridge?: boolean;
  /** Produktzweig: Schweißtisch oder Hubbock */
  product?: "table" | "hubbock";
  /** Hubbock-Breite über alles: 1080 | 1280 | 1480 mm */
  hubbockWidth?: number;
  /** Abdeckung (S355, 28-mm-Lochsystem) auf dem Hubbock — +25 mm Höhe */
  hubbockCover?: boolean;
  /** Schonleiste PE 1000 obenauf */
  hubbockStrip?: boolean;
};

/*
 * Parametrisches Tischmodell — 1:1 nach dem realen Loihl-Schweißtisch.
 *
 * Verbindliche Vorgaben aus der Zoom-Abnahme mit Daniel Loihl (31.07.):
 *   · Immer eine DURCHGEHENDE Lochplatte — kein Mittelloch, keine Ausleger.
 *     (Das Mittelloch stammte von einem Foto mit ZWEI per Brücke verbundenen
 *     Tischen — deshalb ist es jetzt nur noch im Doppeltisch-Modus zu sehen.)
 *   · Seitenwangen: 3 Lochreihen — die mittlere versetzt ("wie ein Fünfer").
 *   · 4 Füße; erst ab 2.900 mm Länge 6 Füße.
 *   · In jeder Tischecke eine waagerechte STAHL-MONTAGEPLATTE (gehört zum
 *     Tisch, deshalb dunkel), die an beide Zargen stößt und die Ecke schließt.
 *     Der blaue Beinflansch wird von unten mit 4 Sechskantschrauben dagegen
 *     geschraubt — Fußteller ebenfalls blau, dazwischen Gewinde +
 *     SECHSKANT-Verstellmutter.
 *   · Unterbau: Querstreben (2.900er = 6 Stück) mit bogenförmig
 *     ausgeschnittener Unterkante.
 *     (Die früheren 45°-Eckbleche sind raus — sie schnitten sich bei einigen
 *     Größen mit den Querstegen, was real nie vorkommt.)
 *   · STIRNSEITEN: dort steht KEIN durchgehender Steg. An der Innenseite jeder
 *     Stirnzarge sitzen 3–4 einzelne, angeschweißte WINKELBLECHE ("wie eine
 *     Winkelschablone"): rechter Winkel oben an der Plattenunterseite und
 *     außen an der Zarge, die freie Kante KONKAV eingezogen. MASSIV, ohne
 *     Löcher. Reine Aussteifung.
 *     Korrektur vom 13.08.: Die "vier Segmente in einer Reihe" auf dem
 *     Werkstattfoto sind genau diese Einzelbleche — NICHT, wie zuvor
 *     modelliert, die stehengebliebenen Stege eines Bleches mit
 *     Bogenausschnitten in der Unterkante.
 *   · Blickle-Schwerlastrollen: gelbes Rad in verzinkter Gabel.
 */

// ── Konstanten (alle Maße in mm) ───────────────────────────────
const RASTER = 100;    // Lochraster 100 × 100 mm
const HOLE_R = 14;     // Ø 28 mm Lochsystem
const MARGIN = 50;     // Randabstand der Lochreihen
const TABLE_H = 850;   // Arbeitshöhe (Oberkante Platte)
const TOP_T = 20;      // Dicke der Arbeitsplatte
const APRON_H = 180;   // Höhe der Seitenwangen unter der Platte
const SKIRT_T = 10;    // Blechstärke der Seitenwangen
const CORPUS_H = TOP_T + APRON_H; // 200 mm Gesamt-Korpushöhe
const LEG_TOP = 90;    // Kantrohr-Kantenlänge oben (leicht konisch, wie real)
const LEG_BOT = 76;    // Kantrohr-Kantenlänge unten
const LEG_INSET = 74;  // Beinmitte von der Außenkante — Bein steht in der Ecke
// Anschraubflansch: endet exakt an der Zargeninnenkante. Breiter darf er
// nicht sein — er wird gegen die Montageplatte geschraubt und ein Flansch,
// der über seine Auflageplatte hinausragt, sieht falsch aus.
const MOUNT_W = 2 * (LEG_INSET - SKIRT_T);
// Der Flansch liegt UNTERHALB der Stahl-Montageplatte flach gegen diese
// geschraubt — nur so ist von außen/unten erkennbar, dass das Bein
// verschraubt und nicht angeklebt ist.
const MOUNT_H = 18;
// ── Montageplatte: das Bauteil AM TISCH, an dem der Fuß hängt ──
// Auf dem Werkstattfoto liegt in jeder Tischecke eine dunkle Stahlplatte, die
// an beide Zargeninnenkanten stößt und die Ecke nach unten abschließt. Das
// blaue Bein wird von UNTEN mit vier Sechskantschrauben dagegen geschraubt.
// Schichtung von oben nach unten: Zarge → Stahlplatte → blauer Beinflansch →
// Schraubenköpfe → Beinrohr. Ohne dieses Bauteil sah es aus, als hinge das
// Bein in der Luft und würde dort verschraubt.
// 185 statt breiter: die Platte darf das Stirnblech in der Ecke nicht
// verdecken — sonst liest der leere dunkle Fleck wie eine Lücke im Unterbau,
// genau dort, wo der Kunde mehrfach eine fehlende Aussteifung gemeldet hat.
// Untergrenze ist das Schraubenbild: BOLT_OFF 48 + Kopfradius 19 = 67 < 92,5.
const MPLATE_S = 185;  // Seitenlänge der quadratischen Eckplatte
const MPLATE_T = 20;   // Blechdicke — klobig wie am realen Tisch
const MPLATE_R = 90;   // Ausrundung der zur Tischmitte zeigenden Innenecke
// Schraubenbild: diagonal außerhalb des Rohrquerschnitts, sonst verdeckt das
// Bein die Köpfe und der Fuß sieht nicht verschraubt aus.
// 48 statt weiter außen: die Köpfe bleiben von unten sichtbar, lugen aber
// nicht mehr seitlich unter der Zarge hervor.
const BOLT_OFF = 48;
const BOLT_H = 14; // Kopfhöhe — hängt komplett unter dem Flansch
// Stellfuß gesamt (Teller + Mutter + Gewinde). Bewusst niedrig: auf den
// Werkstattfotos sitzt die Verstellmutter fast unmittelbar unter dem
// Rohrende, es bleibt nur ein kurzes Stück Gewinde sichtbar.
const FOOT_H = 45;
const CASTER_H = 210;  // Blickle-Schwerlastrolle gesamt
const RIB_T = 12;      // Blechstärke der Unterbau-Streben
// Höhe der Querstreben. Bewusst dicht an der Zargenhöhe (APRON_H = 180): die
// Stege enden nur 8 mm über der Zargenunterkante. Mit den früheren 155 mm
// standen sie 25 mm zu hoch und der Unterbau wirkte zu filigran — auf
// Kundenwunsch fast bündig, das lässt den Tisch deutlich stabiler wirken.
const RIB_H = 172;
// Abstand der beiden inneren Querstege zur mittleren Beinachse (nur 6-Fuß-
// Tische). Laut Kunde rücken sie dicht an den Fuß heran; dazwischen liegt die
// Montageplatte des mittleren Beins.
const RIB_NEAR = 130;
// Die beiden ÄUSSEREN Stege rücken zusätzlich von den Stirnzargen weg. Auf der
// reinen Gleichteilung standen sie dem Kunden zu dicht an der Kopfseite.
// Angegeben als Anteil der Stegteilung, damit der Abstand mit der Tischgröße
// mitwächst; die inneren Stege behalten ihre Lage.
const RIB_END_INSET_F = 0.25;
// Lage der beiden Stege beim kleinsten Tisch, als Anteil der Tischlänge vom
// Mittelpunkt aus. 0,20 statt der Gleichteilung 0,25 — der Kunde will sie
// enger beieinander.
const RIB_PAIR_F = 0.2;
// ── Winkelbleche an der Stirnzarge (siehe gussetGeometry) ──
// Sie ERSETZEN den früheren durchgehenden Stirnsteg: was auf dem Werkstattfoto
// wie "vier Segmente in einer Reihe" aussah, sind in Wirklichkeit einzelne
// angeschweißte Winkelbleche an der Zargeninnenseite — kein Blech mit
// Bogenausschnitten in der Unterkante.
const GUSSET_REACH = 220;   // Ausladung nach innen unter die Platte
const GUSSET_DROP = RIB_H;  // Höhe an der Zarge — bündig mit den Querstegen
// Gerades Kantenstück an beiden Enden, BEVOR die Kehle einsetzt. Ohne das
// begann die Rundung direkt an der Schweißkante und das Blech wirkte
// ausgefressen statt zugeschnitten.
const GUSSET_LEAD = 40;
// Tiefe der Kehle: 0 = gerade Fase, 1 = tiefste Einwölbung. 0,55 statt der
// vorherigen vollen Viertelellipse — die war laut Kunde "ein bisschen zu
// stark" eingewölbt.
const GUSSET_COVE = 0.55;
// Anzahl je Stirnseite: der Kunde spricht von "drei bis vier".
const gussetCount = (shortLen: number) => (shortLen >= 1400 ? 4 : 3);
const BRIDGE_W = 300;  // Schweißtischbrücke: Breite
const BRIDGE_H = 200;  // Schweißtischbrücke: Höhe
const GAP = 700;       // Abstand zwischen zwei Tischen (Brückenspannweite)

// ── Gelochte Platte: Rechteck + Lochraster als Extrusion ───────
// Liegt in der XY-Ebene, extrudiert entlang +Z (Dicke t).
function perforatedPlateGeometry(
  w: number,
  l: number,
  t: number,
  diagonal: boolean
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, -l / 2);
  shape.lineTo(w / 2, -l / 2);
  shape.lineTo(w / 2, l / 2);
  shape.lineTo(-w / 2, l / 2);
  shape.closePath();

  const addHole = (x: number, y: number) => {
    const p = new THREE.Path();
    p.absarc(x, y, HOLE_R, 0, Math.PI * 2, true);
    shape.holes.push(p);
  };

  const nx = Math.max(1, Math.floor((w - 2 * MARGIN) / RASTER) + 1);
  const ny = Math.max(1, Math.floor((l - 2 * MARGIN) / RASTER) + 1);
  const x0 = -((nx - 1) * RASTER) / 2;
  const y0 = -((ny - 1) * RASTER) / 2;

  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++) addHole(x0 + i * RASTER, y0 + j * RASTER);

  // TD-Serie: Diagonallochung in den Rasterfeld-Mitten
  if (diagonal)
    for (let i = 0; i < nx - 1; i++)
      for (let j = 0; j < ny - 1; j++)
        addHole(x0 + (i + 0.5) * RASTER, y0 + (j + 0.5) * RASTER);

  // Ohne Bevel: die Bohrungen bleiben oben wie unten sauber plan — eine Fase
  // ließe die Unterseite wie vernietet aussehen.
  return new THREE.ExtrudeGeometry(shape, {
    depth: t,
    bevelEnabled: false,
    curveSegments: 8,
  });
}

// ── Seitenwange: 3 Lochreihen, mittlere versetzt ("Fünfer") ────
// Liegt in der XY-Ebene (x = Länge der Wange, y = Höhe), extrudiert entlang +Z.
function skirtGeometry(len: number, h: number, t: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-len / 2, -h / 2);
  shape.lineTo(len / 2, -h / 2);
  shape.lineTo(len / 2, h / 2);
  shape.lineTo(-len / 2, h / 2);
  shape.closePath();

  const addHole = (x: number, y: number) => {
    if (Math.abs(x) > len / 2 - MARGIN * 0.6) return;
    const p = new THREE.Path();
    p.absarc(x, y, HOLE_R, 0, Math.PI * 2, true);
    shape.holes.push(p);
  };

  const n = Math.max(1, Math.floor((len - 2 * MARGIN) / RASTER) + 1);
  const x0 = -((n - 1) * RASTER) / 2;
  const dy = RASTER / 2; // vertikaler Reihenabstand 50 mm

  // Obere & untere Hauptreihe auf dem 100er-Raster …
  for (let i = 0; i < n; i++) {
    addHole(x0 + i * RASTER, dy);
    addHole(x0 + i * RASTER, -dy);
  }
  // … dazwischen die um 50 mm versetzte Mittelreihe → Würfel-Fünfer
  for (let i = 0; i < n - 1; i++) addHole(x0 + (i + 0.5) * RASTER, 0);

  return new THREE.ExtrudeGeometry(shape, {
    depth: t,
    bevelEnabled: false,
    curveSegments: 8,
  });
}

// ── Querstreg: hochkant stehendes Blech mit EINER Lochreihe ────
// Wie die Seitenwange aufgebaut (XY-Ebene, x = Länge, y = Höhe, Extrusion
// entlang +Z), aber nur eine mittige Reihe: auf den Kundenfotos sind die
// Unterbau-Stege schmaler als die Wangen und tragen genau eine Lochreihe.
function ribGeometry(len: number, h: number, t: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-len / 2, -h / 2);
  shape.lineTo(len / 2, -h / 2);
  shape.lineTo(len / 2, h / 2);
  shape.lineTo(-len / 2, h / 2);
  shape.closePath();

  const addHole = (x: number) => {
    if (Math.abs(x) > len / 2 - MARGIN * 0.6) return;
    const p = new THREE.Path();
    p.absarc(x, 0, HOLE_R, 0, Math.PI * 2, true);
    shape.holes.push(p);
  };

  const n = Math.max(1, Math.floor((len - 2 * MARGIN) / RASTER) + 1);
  const x0 = -((n - 1) * RASTER) / 2;
  for (let i = 0; i < n; i++) addHole(x0 + i * RASTER);

  return new THREE.ExtrudeGeometry(shape, {
    depth: t,
    bevelEnabled: false,
    curveSegments: 8,
  });
}

// ── Quersteg: EIN großer Ausschnitt, keine Lochung ─────────────
// Nach dem Werkstattfoto: das Blech hat keine Bohrungen und auch keine Reihe
// kleiner Bögen, sondern genau einen langen Ausschnitt in der Unterkante.
// Links und rechts bleibt je ein volles Stück Blech stehen ("Erhöhung"), das
// den Steg an die Zarge anbindet; dazwischen läuft der Ausschnitt mit weichen
// Radien durch.
function archedRibGeometry(
  len: number,
  h: number,
  t: number
): THREE.ExtrudeGeometry {
  // Ausschnitthöhe nur ~38 % der Blechhöhe: entscheidend ist nicht der
  // Ausschnitt, sondern der durchgehende Obergurt darüber. Mit den früheren
  // 62 % blieb bei h = 172 nur ein 65-mm-Streifen stehen und der Unterbau
  // wirkte filigran; jetzt sind es rund 107 mm — auf Kundenwunsch: "die
  // Einkerbung soll nicht so krass nach innen gehen, der Streifen in der
  // Mitte soll höher sein, damit es stabiler ausschaut".
  const cutH = 0.38 * h;
  // Auflagerbreite je Seite: so viel Blech bleibt außen stehen.
  const foot = Math.max(70, Math.min(150, len * 0.11));
  // Eckradius am Übergang Auflager → Ausschnitt
  const r = Math.min(45, cutH * 0.55, (len - 2 * foot) / 2);
  const yB = -h / 2;        // Unterkante
  const yT = yB + cutH;     // Oberkante des Ausschnitts
  const xL = -len / 2 + foot;
  const xR = len / 2 - foot;
  if (xR - xL < 4 * r) return ribGeometry(len, h, t);

  const shape = new THREE.Shape();
  shape.moveTo(-len / 2, yB);
  shape.lineTo(xL, yB);
  // linker Übergang nach oben, dann die gerade Ausschnittkante, dann rechts
  // wieder herunter — quadraticCurveTo gibt den weichen Radius aus dem Foto.
  shape.quadraticCurveTo(xL + r * 0.4, yB, xL + r, yT - r * 0.15);
  shape.quadraticCurveTo(xL + r * 1.5, yT, xL + r * 2.2, yT);
  shape.lineTo(xR - r * 2.2, yT);
  shape.quadraticCurveTo(xR - r * 1.5, yT, xR - r, yT - r * 0.15);
  shape.quadraticCurveTo(xR - r * 0.4, yB, xR, yB);
  shape.lineTo(len / 2, yB);
  shape.lineTo(len / 2, h / 2);
  shape.lineTo(-len / 2, h / 2);
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    depth: t,
    bevelEnabled: false,
    curveSegments: 8,
  });
}

// ── Stirnseiten-Aussteifung: angeschweißtes Winkelblech ────────
// Auf der Untersicht des realen Tisches sitzen an der INNENSEITE jeder
// Stirnzarge mehrere gleiche, angeschweißte Aussteifungsbleche ("wie eine
// Winkelschablone"): oben ein gerader Schenkel gegen die Plattenunterseite,
// außen ein gerader Schenkel gegen die Zargeninnenfläche, dazwischen eine
// KONKAV eingezogene freie Kante.
//
// Zwei Dinge laut Nahaufnahme vom 13.08.:
//   · Das Blech ist MASSIV — keine Löcher. (Die Löcher, die auf der ersten
//     Untersicht neben dem Blech zu sehen waren, gehören zur Lochplatte
//     dahinter, nicht zum Winkelblech.)
//   · Die Kante ist KONKAV, nicht konvex: sie schwingt zur Ecke hin ein.
//     Das Blech ist dadurch an den beiden Schenkeln breit und in der
//     Diagonalen schlank — die typische Kehle eines Knotenblechs.
//
// Aufbau in der XY-Ebene: rechter Winkel im Ursprung, Schenkel nach +x (nach
// innen unter die Platte) und nach -y (nach unten an der Zarge), Extrusion
// entlang +z = Blechdicke. Der Ursprung liegt damit exakt in der Kante
// Zargeninnenfläche/Plattenunterseite, wo das Blech eingeschweißt ist.
function gussetGeometry(
  reach: number,
  drop: number,
  t: number,
  lead: number,
  cove: number
): THREE.ExtrudeGeometry {
  // Freie Kontur: Nase → gerades Stück → Kehle → gerades Stück → Zarge.
  const p1x = reach, p1y = -lead;   // Ende der geraden Anlaufkante an der Nase
  const p2x = lead, p2y = -drop;    // Beginn der geraden Auslaufkante unten
  // Kehle als quadratische Bézier. Der Kontrollpunkt wandert auf der Strecke
  // Sehnenmitte → Schweißecke (0|0): bei cove = 0 bleibt die Kante eine
  // gerade Fase, bei cove = 1 liegt er in der Ecke und die Kehle ist am
  // tiefsten. Über diesen einen Wert lässt sich die Einwölbung dosieren,
  // ohne die Anschlusspunkte zu verschieben.
  const mx = (p1x + p2x) / 2;
  const my = (p1y + p2y) / 2;
  const cx = mx * (1 - cove);
  const cy = my * (1 - cove);

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(reach, 0);          // oberer Schenkel, gegen die Plattenunterseite
  shape.lineTo(p1x, p1y);          // gerade Anlaufkante an der Nase
  shape.quadraticCurveTo(cx, cy, p2x, p2y); // eingezogene Kehle
  shape.lineTo(0, -drop);          // gerade Auslaufkante zur Zarge hin
  shape.closePath();               // senkrechter Schenkel hoch zur Zarge

  return new THREE.ExtrudeGeometry(shape, {
    depth: t,
    bevelEnabled: false,
    curveSegments: 24, // feiner als die übrigen Teile — der Bogen ist prägend
  });
}

// ── Schwerlastrolle: Anschraubplatte mit vier Befestigungsbohrungen ──
// Liegt in der XY-Ebene, wird beim Einbau in die Waagerechte gedreht.
function casterPlateGeometry(s: number, t: number, holeR: number, off: number) {
  const h = s / 2;
  const r = 10; // Eckenradius
  const shape = new THREE.Shape();
  shape.moveTo(-h + r, -h);
  shape.lineTo(h - r, -h);
  shape.quadraticCurveTo(h, -h, h, -h + r);
  shape.lineTo(h, h - r);
  shape.quadraticCurveTo(h, h, h - r, h);
  shape.lineTo(-h + r, h);
  shape.quadraticCurveTo(-h, h, -h, h - r);
  shape.lineTo(-h, -h + r);
  shape.quadraticCurveTo(-h, -h, -h + r, -h);
  for (const sx of [-1, 1])
    for (const sy of [-1, 1]) {
      const p = new THREE.Path();
      p.absarc(sx * off, sy * off, holeR, 0, Math.PI * 2, true);
      shape.holes.push(p);
    }
  return new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, curveSegments: 8 });
}

// ── Schwerlastrolle: Radkörper mit fünf Speichenöffnungen ──────
// Die Extrusion läuft entlang +z und damit direkt auf der Radachse — der
// Radkörper braucht deshalb keine Zusatzdrehung. Die fünf Ausschnitte
// erzeugen den Sternteiler, den man auf dem Produktbild in der Nabe sieht.
function casterHubGeometry(r: number, w: number) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, r, 0, Math.PI * 2, false);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + Math.PI / 10;
    const p = new THREE.Path();
    p.absarc(Math.cos(a) * r * 0.6, Math.sin(a) * r * 0.6, r * 0.24, 0, Math.PI * 2, true);
    shape.holes.push(p);
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: w, bevelEnabled: false, curveSegments: 20 });
  geo.translate(0, 0, -w / 2);
  return geo;
}

// ── Blickle-Schwerlastrolle als komplette Baugruppe ────────────
// Nullpunkt: Radaufstandspunkt (y = 0), Schwenkachse bei x = z = 0.
// Aufbau von unten nach oben, 1:1 nach dem Produktfoto:
//   gelbes PU-Rad mit Alu-Speichennabe → verzinkte Gabel → Schwenkkranz →
//   Anschraubplatte mit 4 Bohrungen; vorn der rote Totalfeststeller.
// Die Radachse steht um TRAIL vor der Schwenkachse (Nachlauf) — ohne diesen
// Versatz sieht die Rolle aus wie eine Bockrolle und nicht wie eine Lenkrolle.
function buildCaster(mats: ReturnType<typeof makeMaterials>): THREE.Group {
  const { wheelMat, forkMat, hubMat, brakeMat, boltMat } = mats;
  const g = new THREE.Group();

  const R = 75;        // Radradius (Ø 150)
  const TREAD = 50;    // Breite des Laufbelags
  const TRAIL = 40;    // Nachlauf: Radachse vor der Schwenkachse
  const AXLE_Y = R;    // Radmitte

  // ── Rad: gelber Laufbelag ──
  const tread = new THREE.Mesh(new THREE.CylinderGeometry(R, R, TREAD, 40), wheelMat);
  tread.rotation.x = Math.PI / 2; // Achse auf +z legen
  tread.position.set(TRAIL, AXLE_Y, 0);
  g.add(tread);

  // ── Radkörper: Alu-Nabe, beidseitig 3 mm breiter als der Belag, damit sie
  // von der Seite sichtbar bleibt und nicht im Gelb verschwindet ──
  const hub = new THREE.Mesh(casterHubGeometry(R * 0.54, TREAD + 6), hubMat);
  hub.position.set(TRAIL, AXLE_Y, 0);
  g.add(hub);

  // Nabenbuchse + durchgehende Achse
  const boss = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, TREAD + 10, 20), hubMat);
  boss.rotation.x = Math.PI / 2;
  boss.position.set(TRAIL, AXLE_Y, 0);
  g.add(boss);
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 96, 16), boltMat);
  axle.rotation.x = Math.PI / 2;
  axle.position.set(TRAIL, AXLE_Y, 0);
  g.add(axle);

  // ── Gabel: zwei SCHMALE verzinkte Laschen links/rechts des Rades ──
  // Bewusst schmal (36 mm) und nur über der Achse: eine breite Wange würde
  // Rad und Speichennabe zukleistern, das Bauteil sähe aus wie ein Kasten
  // mit Rad. Auf dem Produktbild bleibt das Rad das dominante Element.
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(36, 95, 10), forkMat);
    leg.position.set(TRAIL, 117, side * 36);
    g.add(leg);
    // Rundes Achsauge am unteren Ende der Lasche
    const lug = new THREE.Mesh(new THREE.CylinderGeometry(23, 23, 10, 24), forkMat);
    lug.rotation.x = Math.PI / 2;
    lug.position.set(TRAIL, AXLE_Y, side * 36);
    g.add(lug);
  }
  // Gabelrücken — überbrückt den Nachlauf von der Schwenkachse zu den Laschen
  const yoke = new THREE.Mesh(new THREE.BoxGeometry(110, 14, 82), forkMat);
  yoke.position.set(27, 171, 0);
  g.add(yoke);

  // ── Schwenkkranz (Kugeldrehkranz) auf der Schwenkachse ──
  const race = new THREE.Mesh(new THREE.CylinderGeometry(40, 40, 20, 28), forkMat);
  race.position.set(0, 188, 0);
  g.add(race);
  const raceTop = new THREE.Mesh(new THREE.CylinderGeometry(47, 47, 7, 28), forkMat);
  raceTop.position.set(0, 195, 0);
  g.add(raceTop);

  // ── Anschraubplatte mit vier Bohrungen ──
  const plateGeo = casterPlateGeometry(120, 12, 8, 42);
  plateGeo.rotateX(-Math.PI / 2);
  const plate = new THREE.Mesh(plateGeo, forkMat);
  plate.position.set(0, 198, 0);
  g.add(plate);

  // ── Roter Totalfeststeller ──
  // Sitzt vorn über dem Rad, entgegen der Nachlaufrichtung, und ragt als
  // flacher Tritthebel heraus — das auffälligste Merkmal auf dem Produktbild.
  const pedal = new THREE.Mesh(new THREE.BoxGeometry(86, 12, 56), brakeMat);
  pedal.rotation.z = -0.12;
  pedal.position.set(-44, 150, 0);
  g.add(pedal);
  // Anlenkung vom Tritthebel hinauf zur Gabel
  const link = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 46), brakeMat);
  link.position.set(6, 157, 0);
  g.add(link);

  return g;
}

// ── Eck-Montageplatte: Quadrat mit ausgerundeter Innenecke ─────
// Wie die übrigen Platten in der XY-Ebene aufgebaut und über rotateX(-π/2) in
// die Waagerechte gelegt; dabei wird shape-x zu +x, shape-y zu −z und die
// Extrusion zu +y. Gebaut ist die Platte für die Tischecke (+x/+z) — die zur
// Tischmitte zeigende Ecke läuft mit einem weichen Bogen aus, genau wie auf
// dem Werkstattfoto. Die drei übrigen Ecken entstehen durch Drehung um Y.
function mountPlateGeometry(s: number, t: number, r: number): THREE.ExtrudeGeometry {
  const h = s / 2;
  const shape = new THREE.Shape();
  shape.moveTo(h, -h);                       // Außenecke = Tischecke
  shape.lineTo(h, h);                        // entlang der einen Zargeninnenkante
  shape.lineTo(-h + r, h);
  shape.quadraticCurveTo(-h, h, -h, h - r);  // ausgerundete Innenecke
  shape.lineTo(-h, -h);                      // entlang der zweiten Zargeninnenkante
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    depth: t,
    bevelEnabled: false,
    curveSegments: 12,
  });
}

// Drehung der Eckplatte je Tischecke — die Geometrie ist für (+x/+z) gebaut.
function mountPlateRotation(sx: number, sz: number): number {
  if (sx > 0) return sz > 0 ? 0 : Math.PI / 2;
  return sz > 0 ? -Math.PI / 2 : Math.PI;
}

// ── Quersteg-Positionen auf der Längsachse ─────────────────────
// Aufsteigend sortiert. Staffelung nach Kundenvorgabe — nicht rechnerisch,
// sondern so gebaut: ab 2.900 mm sechs Stege, über 1.400 mm vier, darunter
// ZWEI (13.08. von drei auf zwei reduziert, der mittlere ist entfallen).
function ribPositions(longLen: number): number[] {
  const n = longLen >= 2900 ? 6 : longLen > 1400 ? 4 : 2;
  const out: number[] = [];

  // Bei sechs Stegen (= sechs Füßen) sitzen zwei davon laut Foto dicht neben
  // der mittleren Beinachse; die restlichen vier verteilen sich gleichmäßig
  // auf die beiden Felder links und rechts davon.
  if (n === 6) {
    // RIB_NEAR = Abstand zur mittleren Beinachse. Dazwischen liegt die
    // Montageplatte des mittleren Fußes (2 · RIB_NEAR − RIB_T breit).
    out.push(-RIB_NEAR, RIB_NEAR);
    // Restfeld je Seite in DREI gleiche Abschnitte teilen — die beiden Stege
    // sitzen auf den Teilungspunkten, damit außen kein leeres Feld entsteht.
    const field = longLen / 2 - RIB_NEAR; // vom inneren Steg bis zur Tischkante
    for (const s of [-1, 1])
      for (let i = 0; i < 2; i++) out.push(s * (RIB_NEAR + (field * (i + 1)) / 3));
  } else if (n === 2) {
    // Kleinste Tische: nur zwei Stege, und die stehen bewusst enger beieinander
    // als die reine Gleichteilung (die läge bei ±longLen/4). Deshalb hier fest
    // gesetzt statt über die Teilung gerechnet — der Zusatzversatz weiter unten
    // greift bei zwei Stegen nicht, sonst rückten sie doppelt zusammen.
    out.push(-longLen * RIB_PAIR_F, longLen * RIB_PAIR_F);
  } else {
    for (let i = 0; i < n; i++)
      out.push(-longLen / 2 + (longLen * (i + 0.5)) / n);
  }

  out.sort((a, b) => a - b);
  // Früher wurden die beiden äußeren Stege an die Stirnzargen gerückt, weil
  // sie dort die Aussteifung bilden sollten. Diese Aufgabe übernehmen jetzt
  // die angeschweißten WINKELBLECHE (siehe gussetGeometry). Die Stege bleiben
  // deshalb auf ihrer gleichmäßigen Teilung stehen — sonst fehlen dem Unterbau
  // links und rechts genau die beiden äußeren Stege.
  //
  // Zusätzlich wandern die beiden äußeren noch ein Stück zur Tischmitte:
  // direkt auf der Gleichteilung standen sie zu dicht an der Kopfseite.
  // Beim 6-Steg-Tisch ist die Teilung nicht longLen/n, sondern das Restfeld
  // neben den beiden mittleren Stegen, gedrittelt.
  if (n > 2) {
    const pitch = n === 6 ? (longLen / 2 - RIB_NEAR) / 3 : longLen / n;
    const inset = pitch * RIB_END_INSET_F;
    out[0] += inset;
    out[out.length - 1] -= inset;
  }
  return out;
}

// ── Unterbau: gelochte Querstege mit Bogen-Unterkante ──────────
// Bildet die real sichtbare Struktur nach: offener Kasten, gelochte Querstege
// quer zur Längsachse (Anzahl nach Kundenvorgabe), deren Unterkante
// bogenförmig ausgeschnitten ist.
function addUnderStructure(
  g: THREE.Group,
  w: number,
  l: number,
  mats: ReturnType<typeof makeMaterials>
) {
  const { steel, darkSteel } = mats;
  const topUnderY = TABLE_H - TOP_T; // Unterkante der Arbeitsplatte
  const ribY = topUnderY - RIB_H / 2;
  const alongX = w >= l;
  const longLen = alongX ? w : l;
  const shortLen = alongX ? l : w;

  const ribPos = ribPositions(longLen);

  // Stege spannen zwischen den Wangen und hängen von der Platte herab.
  const span = shortLen - 2 * SKIRT_T;
  // ALLE Stege laufen über die volle Spannweite von Längszarge zu Längszarge —
  // auch die beiden äußeren an den Stirnseiten. Die waren früher zwischen den
  // Eckfüßen verkürzt (bei shortLen = 1000 nur 762 statt 980 mm); genau dadurch
  // blieben die Ecken zwischen Stirnzarge und erstem Steg leer — die Stelle,
  // die der Kunde auf der Untersicht angestrichen hat. Auf dem Werkstattfoto
  // reicht das Blech dort durchgehend von Zarge zu Zarge.
  // Um die Füße muss der Steg dabei nicht herum: er liegt vertikal bei
  // y 675…830 (ribY ± RIB_H/2), das oberste Beinbauteil — die Montageplatte —
  // endet bei y 650 (apronBottomY). Bleiben 25 mm Luft, der Steg läuft über
  // den Füßen hinweg, ohne sie zu berühren.
  // ALLE Stege werden gebaut — auch die beiden äußeren. Die waren zeitweise
  // entfallen, weil die Winkelbleche an den Stirnseiten ihre Position belegt
  // hatten; dadurch fehlten dem Unterbau links und rechts je ein Steg.
  for (const p of ribPos) {
    const geo = archedRibGeometry(span, RIB_H, RIB_T);
    geo.translate(0, 0, -RIB_T / 2);
    const rib = new THREE.Mesh(geo, [steel, darkSteel]);
    rib.rotation.y = alongX ? Math.PI / 2 : 0; // Steg quer zur Längsachse
    rib.position.set(alongX ? p : 0, ribY, alongX ? 0 : p);
    g.add(rib);
  }

  // ── Winkelbleche innen an beiden Stirnzargen ──
  // Sie sitzen mit ihrem senkrechten Schenkel direkt auf der Zargeninnenfläche
  // (longLen/2 − SKIRT_T) und mit dem oberen Schenkel unter der Platte
  // (topUnderY) — also genau in der Kante, in der sie real eingeschweißt sind.
  const nG = gussetCount(shortLen);
  const gSpan = shortLen - 2 * SKIRT_T;
  // Ausladung so weit zurücknehmen, dass die Bleche nicht in den äußersten
  // Quersteg laufen: bei kurzen Tischen steht der schon bei ~1/6 der Länge,
  // die vollen 220 mm würden ihn dort durchdringen. 20 mm Luft bleiben.
  const outerRib = Math.max(...ribPos.map(Math.abs));
  const gapToRib = longLen / 2 - SKIRT_T - (outerRib + RIB_T / 2) - 20;
  const gReach = Math.max(90, Math.min(GUSSET_REACH, gapToRib));
  for (const sgn of [-1, 1]) {
    const atSkirt = sgn * (longLen / 2 - SKIRT_T);
    for (let i = 0; i < nG; i++) {
      // gleichmäßig über die lichte Breite verteilt, mit halbem Teilungs-
      // abstand zu den Längszargen — so klebt keins in der Ecke.
      const q = -gSpan / 2 + (gSpan * (i + 0.5)) / nG;
      const geo = gussetGeometry(gReach, GUSSET_DROP, RIB_T, GUSSET_LEAD, GUSSET_COVE);
      geo.translate(0, 0, -RIB_T / 2); // Blech auf seine Mittelebene zentrieren
      const gus = new THREE.Mesh(geo, [steel, darkSteel]);
      if (alongX) {
        // Lange Achse = X → Stirnzargen bei ±x, Bleche nach innen (−sgn·x)
        gus.rotation.y = sgn > 0 ? Math.PI : 0;
        gus.position.set(atSkirt, topUnderY, q);
      } else {
        // Lange Achse = Z → Stirnzargen bei ±z; rot.y = ∓π/2 dreht +x auf ∓z
        gus.rotation.y = sgn > 0 ? Math.PI / 2 : -Math.PI / 2;
        gus.position.set(q, topUnderY, atSkirt);
      }
      g.add(gus);
    }
  }
}

// ── Beinpositionen: 4 Füße, ab 2.900 mm Länge 6 Füße ───────────
function legLayout(w: number, l: number): [number, number][] {
  const alongX = w >= l;
  const longLen = alongX ? w : l;
  const shortLen = alongX ? l : w;
  const a = longLen / 2 - LEG_INSET;  // Position auf der langen Achse
  const b = shortLen / 2 - LEG_INSET; // Position auf der kurzen Achse

  // Ab 2.900 mm Länge kommt eine dritte Beinreihe in der Mitte dazu
  const rows = longLen >= 2900 ? [-a, 0, a] : [-a, a];

  const out: [number, number][] = [];
  for (const p of rows) for (const q of [-b, b]) out.push(alongX ? [p, q] : [q, p]);
  return out;
}

// ── Ein einzelner Schweißtisch als THREE.Group ─────────────────
function buildTable(cfg: ShowroomConfig, mats: ReturnType<typeof makeMaterials>): THREE.Group {
  const g = new THREE.Group();
  const { width: w, length: l } = cfg;
  const diagonal = cfg.series === "TD";
  const { steel, darkSteel, midSteel, legMat, legFlatMat, boltMat, boltFlatMat, wheelMat, forkMat, aluMat } = mats;

  const footH = cfg.feet === "casters" ? CASTER_H : FOOT_H;
  const topUnderY = TABLE_H - TOP_T;
  const apronBottomY = TABLE_H - CORPUS_H;

  // ── Arbeitsplatte: EINE durchgehende Lochplatte, kein Mittelloch ──
  const topGeo = perforatedPlateGeometry(w, l, TOP_T, diagonal);
  topGeo.rotateX(-Math.PI / 2);
  const top = new THREE.Mesh(topGeo, [steel, darkSteel]);
  top.position.set(0, topUnderY, 0);
  g.add(top);

  // ── Seitenwangen: 3 Lochreihen, mittlere versetzt ──
  const skirtY = apronBottomY + APRON_H / 2;
  const alongX = w >= l;
  // Alle vier Zargen sind AUSSEN identisch: glattes Blech mit dem
  // Fünfer-Lochbild. Bogenausschnitte gibt es nur in den Querstegen im
  // Tischinneren — von außen soll die Stirnseite genauso aussehen wie die
  // Längsseiten.
  const skirts: { len: number; rotY: number; x: number; z: number }[] = [
    { len: w, rotY: 0,           x: 0,                        z: -(l / 2 - SKIRT_T / 2) },
    { len: w, rotY: Math.PI,     x: 0,                        z: l / 2 - SKIRT_T / 2 },
    { len: l, rotY: Math.PI / 2, x: -(w / 2 - SKIRT_T / 2),   z: 0 },
    { len: l, rotY: -Math.PI / 2, x: w / 2 - SKIRT_T / 2,     z: 0 },
  ];
  for (const s of skirts) {
    const geo = skirtGeometry(s.len, APRON_H, SKIRT_T);
    geo.translate(0, 0, -SKIRT_T / 2);
    const mesh = new THREE.Mesh(geo, [steel, darkSteel]);
    mesh.rotation.y = s.rotY;
    mesh.position.set(s.x, skirtY, s.z);
    g.add(mesh);
  }

  const legPositions = legLayout(w, l);

  // ── Unterbau ──
  addUnderStructure(g, w, l, mats);

  // ── Beine + Füße ──
  // Stapel von oben nach unten (Zahlen für apronBottomY = 650):
  //   Stahl-Montageplatte (darkSteel) 635–650
  //   blauer Beinflansch (legMat)     617–635
  //   Sechskant-Schraubenköpfe        603–617  (komplett unter dem Flansch)
  //   Beinrohr ab                     617      (Oberkante steckt im Flansch)
  // Alles lückenlos gestapelt → die Arbeitshöhe bleibt exakt TABLE_H.
  const legH = apronBottomY - MPLATE_T - MOUNT_H - footH;
  const plateTopY = apronBottomY;              // 650 — Oberkante Stahlplatte
  const plateBottomY = apronBottomY - MPLATE_T; // 635 — Unterkante Stahlplatte
  const mountBottomY = plateBottomY - MOUNT_H;  // 617 — Unterkante Beinflansch
  // Vierkantrohr: CylinderGeometry mit 4 Segmenten — Umkreisradius = Kante/√2
  const SQ = Math.SQRT1_2;
  for (const [x, z] of legPositions) {
    // Echte Tischecke oder mittlere Beinreihe? Nur die Eckbeine bekommen die
    // quadratische Eckplatte, die mittleren die Platte zwischen den Stegen —
    // jedes Bein also genau eine Platte.
    const isCorner =
      Math.abs(Math.abs(x) - (w / 2 - LEG_INSET)) < 1 &&
      Math.abs(Math.abs(z) - (l / 2 - LEG_INSET)) < 1;

    if (isCorner) {
      // Eckplatte: stößt mit zwei Kanten an die Zargeninnenkanten
      // (w/2 − SKIRT_T bzw. l/2 − SKIRT_T) und schließt den Korpus unten ab.
      const sx = Math.sign(x) || 1;
      const sz = Math.sign(z) || 1;
      const geo = mountPlateGeometry(MPLATE_S, MPLATE_T, MPLATE_R);
      geo.rotateX(-Math.PI / 2); // Extrusion zeigt danach nach +y
      // Gleicher heller Stahlton wie die Zarge: dunklere Töne verschwimmen von
      // unten mit der Tischunterseite, dann liest die Platte als Schattenfleck
      // statt als das Bauteil, an dem das Bein hängt.
      const plate = new THREE.Mesh(geo, steel);
      plate.rotation.y = mountPlateRotation(sx, sz);
      plate.position.set(
        sx * (w / 2 - SKIRT_T - MPLATE_S / 2),
        plateBottomY,
        sz * (l / 2 - SKIRT_T - MPLATE_S / 2)
      );
      g.add(plate);
    } else {
      // Mittlere Beinreihe (nur 6-Fuß-Tische): rechteckige Platte, die exakt
      // zwischen den beiden inneren Querstegen aufgeht — 2 · RIB_NEAR − RIB_T
      // ist genau der lichte Abstand ihrer Innenflächen, sie durchdringen
      // sich also nicht. Quer bleibt sie an der Zargeninnenkante bündig.
      const midLen = 2 * RIB_NEAR - RIB_T;
      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(
          alongX ? midLen : MPLATE_S,
          MPLATE_T,
          alongX ? MPLATE_S : midLen
        ),
        steel
      );
      plate.position.set(
        alongX ? 0 : Math.sign(x) * (w / 2 - SKIRT_T - MPLATE_S / 2),
        plateBottomY + MPLATE_T / 2,
        alongX ? Math.sign(z) * (l / 2 - SKIRT_T - MPLATE_S / 2) : 0
      );
      g.add(plate);
    }

    // Kantrohr, leicht konisch nach unten (wie am realen Tisch).
    // legFlatMat = flatShading, sonst würden die 4 Flächen rund interpoliert.
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(LEG_TOP * SQ, LEG_BOT * SQ, legH, 4, 1),
      legFlatMat
    );
    leg.rotation.y = Math.PI / 4; // Vierkant achsparallel ausrichten
    leg.position.set(x, footH + legH / 2, z);
    g.add(leg);

    // Blauer Beinflansch — liegt jetzt UNTER der Stahl-Montageplatte und wird
    // von unten gegen sie geschraubt. Weil die Platte darüber dunkel ist,
    // liest sich der Flansch endlich als Teil des Beins und die Verschraubung
    // als Verbindung zweier Bauteile.
    const mount = new THREE.Mesh(new THREE.BoxGeometry(MOUNT_W, MOUNT_H, MOUNT_W), legMat);
    mount.position.set(x, mountBottomY + MOUNT_H / 2, z);
    g.add(mount);
    for (const dx of [-BOLT_OFF, BOLT_OFF])
      for (const dz of [-BOLT_OFF, BOLT_OFF]) {
        const bolt = new THREE.Mesh(
          new THREE.CylinderGeometry(19, 19, BOLT_H, 6),
          boltFlatMat
        );
        bolt.rotation.y = Math.PI / 6;
        // Kopf hängt komplett unter dem Flansch (Oberkante bündig mit dessen
        // Unterseite) — so steht die Verschraubung von unten klar vor.
        bolt.position.set(x + dx, mountBottomY - BOLT_H / 2, z + dz);
        g.add(bolt);
        // Schaft: vom Kopf hinauf durch Flansch UND Stahlplatte (endet 2 mm
        // unter deren Oberseite) — die Schraube greift sichtbar durch beide
        // Bauteile und hält das Bein nicht "in der Luft".
        const shankTop = plateTopY - 2;
        const shankLen = shankTop - mountBottomY;
        const shank = new THREE.Mesh(
          new THREE.CylinderGeometry(9, 9, shankLen, 10),
          boltMat
        );
        shank.position.set(x + dx, mountBottomY + shankLen / 2, z + dz);
        g.add(shank);
      }

    if (cfg.feet === "casters") {
      // Komplette Blickle-Schwerlastrolle als Baugruppe (siehe buildCaster).
      // Alle vier stehen gleich ausgerichtet — wie auf dem Produktbild.
      const caster = buildCaster(mats);
      caster.position.set(x, 0, z);
      g.add(caster);
    } else {
      // Stellfuß nach Kundenfoto: Kette Rohr → blanke Gewindestange →
      // SECHSKANT-Verstellmutter → flache blaue Fußplatte, lückenlos
      // gestapelt bis FOOT_H (45 mm über dem Boden).
      // Stapel von unten nach oben, lückenlos bis zum Rohrende (FOOT_H = 45):
      // Achteckplatte 0–9, flache Verstellmutter 9–31, Gewinde 31–45.
      // Achteck (8 Segmente, um 22,5° gedreht) = quadratische Platte mit
      // abgeschrägten Ecken. legFlatMat, sonst interpoliert der Shader die
      // Facetten rund und die Platte wirkt wie eine Kalotte.
      const base = new THREE.Mesh(new THREE.CylinderGeometry(56, 56, 9, 8), legFlatMat);
      base.rotation.y = Math.PI / 8;
      base.position.set(x, 4.5, z);
      g.add(base);
      // Sechskant flach und deutlich schmaler als die Fußplatte — auf dem
      // Foto steht die Platte ringsum sichtbar über die Mutter hinaus.
      // flatShading, damit die sechs Schlüsselflächen als Sechskant lesbar
      // bleiben statt rund interpoliert zu werden
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(34, 34, 22, 6), boltFlatMat);
      nut.rotation.y = Math.PI / 6;
      nut.position.set(x, 20, z);
      g.add(nut);
      const thread = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 14, 12), boltMat);
      thread.position.set(x, 38, z);
      g.add(thread);
    }
  }

  // ── Aluabdeckblech ──
  if (cfg.sheet) {
    // Das Aluabdeckblech ist GELOCHT, nicht geschlossen — im Katalog als
    // AO (Grundraster) bzw. AD (mit Diagonallochung) geführt. Es folgt damit
    // derselben Lochung wie die Tischplatte, sodass Spannwerkzeug auch bei
    // aufgelegtem Blech benutzbar bleibt.
    const geo = perforatedPlateGeometry(w - 12, l - 12, 8, diagonal);
    geo.rotateX(-Math.PI / 2);
    const plate = new THREE.Mesh(geo, [aluMat, midSteel]);
    plate.position.set(0, TABLE_H, 0);
    g.add(plate);
  }

  return g;
}

// ── Schweißtischbrücke (SB…300): 300 × 200 mm, Diagonallochung ──
function buildBridge(len: number, mats: ReturnType<typeof makeMaterials>): THREE.Group {
  const g = new THREE.Group();
  const { steel, darkSteel } = mats;

  // Oberseite mit Diagonallochung
  const topGeo = perforatedPlateGeometry(len, BRIDGE_W, 15, true);
  topGeo.rotateX(-Math.PI / 2);
  const top = new THREE.Mesh(topGeo, [steel, darkSteel]);
  top.position.set(0, TABLE_H - 15, 0);
  g.add(top);

  // Seitenwangen der Brücke — gleiche Fünfer-Lochung
  for (const sz of [-1, 1]) {
    const geo = skirtGeometry(len, BRIDGE_H - 15, 12);
    geo.translate(0, 0, -6);
    const mesh = new THREE.Mesh(geo, [steel, darkSteel]);
    mesh.rotation.y = sz > 0 ? Math.PI : 0;
    mesh.position.set(0, TABLE_H - 15 - (BRIDGE_H - 15) / 2, sz * (BRIDGE_W / 2 - 6));
    g.add(mesh);
  }

  return g;
}

// ── Hubbock (HB…900) ───────────────────────────────────────────
// Nachbau des realen Unterstellbocks: durchgehender Kastenträger oben,
// zwei konische Säulen, quer liegende Fußplatten, unten ein Längsbalken mit
// vier schrägen Auslegern für die Blickle-Kugellagerrollen.
// Die drei Baugrößen unterscheiden sich NUR in der Mitte — Säulen, Füße und
// Rollen bleiben identisch ("außen schaut er komplett gleich aus").
const HB_H = 700;          // Höhe abgesenkt (verstellbar 700–950 mm)
const HB_BEAM_H = 130;     // Kastenträger oben
const HB_BEAM_D = 110;     // Trägertiefe
const HB_COL = 105;        // Säulenquerschnitt
const HB_END = 150;        // Säulenmitte vom Trägerende
const HB_FOOT_L = 620;     // Fußplatte quer zum Träger
const HB_FOOT_H = 70;

function buildHubbock(cfg: ShowroomConfig, mats: ReturnType<typeof makeMaterials>): THREE.Group {
  const g = new THREE.Group();
  const { legMat, legFlatMat, boltMat, wheelMat, forkMat, steel, midSteel, peMat } = mats;
  const w = cfg.hubbockWidth ?? 1080;
  const SQ = Math.SQRT1_2;

  const beamY = HB_H - HB_BEAM_H / 2;
  const colX = w / 2 - HB_END;

  // Kastenträger oben — das ist das Bauteil, das mit der Baugröße wächst
  const beam = new THREE.Mesh(new THREE.BoxGeometry(w, HB_BEAM_H, HB_BEAM_D), legMat);
  beam.position.set(0, beamY, 0);
  g.add(beam);

  // Spindelzapfen (Sechskant) an der Stirnseite — selbsthemmendes Spindelsystem
  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(26, 26, 90, 6), legMat);
  spindle.rotation.z = Math.PI / 2;
  spindle.position.set(w / 2 + 45, beamY - 18, 0);
  g.add(spindle);
  const spindleTip = new THREE.Mesh(new THREE.CylinderGeometry(17, 17, 40, 6), boltMat);
  spindleTip.rotation.z = Math.PI / 2;
  spindleTip.position.set(w / 2 + 105, beamY - 18, 0);
  g.add(spindleTip);

  const colH = HB_H - HB_BEAM_H - HB_FOOT_H;
  for (const sx of [-1, 1]) {
    // Säule — leicht konisch, wie am realen Bock
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(HB_COL * SQ, (HB_COL - 14) * SQ, colH, 4, 1),
      legFlatMat
    );
    col.rotation.y = Math.PI / 4;
    col.position.set(sx * colX, HB_FOOT_H + colH / 2, 0);
    g.add(col);

    // Fußplatte quer zum Träger
    const foot = new THREE.Mesh(new THREE.BoxGeometry(150, HB_FOOT_H, HB_FOOT_L), legMat);
    foot.position.set(sx * colX, HB_FOOT_H / 2, 0);
    g.add(foot);

    // Verschraubung Säule/Fußplatte
    for (const dz of [-46, 46]) {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 10, 6), boltMat);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(sx * colX, HB_FOOT_H + 42, dz + (dz > 0 ? 56 : -56));
      g.add(bolt);
    }
  }

  // Längsbalken unten zwischen den Säulen
  const spine = new THREE.Mesh(new THREE.BoxGeometry(2 * colX, 95, 95), legMat);
  spine.position.set(0, HB_FOOT_H + 165, 0);
  g.add(spine);

  // Vier Rollen (2 vorne, 2 hinten) an Auslegern, die vom Längsbalken
  // nach außen zu den Rollenkonsolen führen
  const CASTER_R = 62;
  const armY = HB_FOOT_H + 120;
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      const ax = sx * (colX - 165);
      const az = sz * 230;

      // Ausleger quer vom Längsbalken zur Rolle
      const arm = new THREE.Mesh(new THREE.BoxGeometry(80, 30, Math.abs(az) + 40), legMat);
      arm.position.set(ax, armY, az / 2);
      g.add(arm);
      // Schräge Konsole vom Ausleger hinunter zur Rollenplatte
      const stay = new THREE.Mesh(new THREE.BoxGeometry(70, 22, 120), legMat);
      stay.position.set(ax, armY - 32, az - sz * 30);
      stay.rotation.x = sz * 0.55;
      g.add(stay);

      // Rollenkonsole
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(118, 16, 118), legMat);
      bracket.position.set(ax, 2 * CASTER_R + 46, az);
      g.add(bracket);

      const swivel = new THREE.Mesh(new THREE.CylinderGeometry(34, 34, 20, 20), forkMat);
      swivel.position.set(ax, 2 * CASTER_R + 28, az);
      g.add(swivel);
      for (const side of [-1, 1]) {
        const fork = new THREE.Mesh(new THREE.BoxGeometry(11, 76, 76), forkMat);
        fork.position.set(ax + side * 36, CASTER_R + 34, az);
        g.add(fork);
      }
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(CASTER_R, CASTER_R, 44, 28),
        wheelMat
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(ax, CASTER_R + 8, az); // leicht angehoben: steht auf den Füßen
      g.add(wheel);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 50, 16), forkMat);
      hub.rotation.z = Math.PI / 2;
      hub.position.set(ax, CASTER_R + 8, az);
      g.add(hub);
    }

  // Abdeckung: gelochter S355-Balken (200 × 125 mm), festverschraubbar.
  // Sie greift wie eine Haube über den Träger — die Bauhöhe steigt nur um
  // 25 mm, genau wie im Katalog angegeben.
  let topY = HB_H;
  if (cfg.hubbockCover) {
    const cLen = w + 20;      // Länge über alles
    const cDepth = 200;       // Breite laut Katalog
    const cH = 125;           // Bauhöhe der Haube
    const cT = 15;            // Blechstärke (S355, 15 mm)
    const cTopY = HB_H + 25;  // Oberkante — Bauhöhe steigt um 25 mm

    // Deckplatte mit dem 28-mm-Lochsystem
    const topGeo = perforatedPlateGeometry(cLen, cDepth, cT, true);
    topGeo.rotateX(-Math.PI / 2);
    const coverTop = new THREE.Mesh(topGeo, [steel, midSteel]);
    coverTop.position.set(0, cTopY - cT, 0);
    g.add(coverTop);

    // Die beiden LANGEN Seiten sind ebenfalls gelocht — die Haube ist von
    // oben und seitlich bestückbar, nicht nur auf der Deckfläche.
    const sideH = cH - cT;
    for (const sz of [-1, 1]) {
      const geo = ribGeometry(cLen, sideH, cT);
      geo.translate(0, 0, -cT / 2);
      const side = new THREE.Mesh(geo, [steel, midSteel]);
      side.position.set(0, cTopY - cT - sideH / 2, sz * (cDepth / 2 - cT / 2));
      g.add(side);
    }
    topY = cTopY;
  }

  // Schonleiste PE 1000 — schützt empfindliche Oberflächen
  if (cfg.hubbockStrip) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(w - 2, 4, 90), peMat);
    strip.position.set(0, topY + 2, 0);
    g.add(strip);
  }

  g.position.y = -HB_H / 2;
  return g;
}

// ── Materialien ────────────────────────────────────────────────
function makeMaterials(cfg: ShowroomConfig) {
  return {
    steel: new THREE.MeshStandardMaterial({
      color: new THREE.Color(cfg.accentColor),
      metalness: cfg.metalness,
      roughness: cfg.roughness,
    }),
    // Dunkler Stahl für Lochwände & Schnittkanten — lässt die Bohrungen tief wirken
    darkSteel: new THREE.MeshStandardMaterial({
      color: 0x565b60,
      metalness: 0.5,
      roughness: 0.55,
    }),
    // Pulverbeschichtung RAL 5015 — Beine UND Fußteller
    legMat: new THREE.MeshStandardMaterial({
      color: 0x2a7fc1,
      metalness: 0.25,
      roughness: 0.42,
    }),
    // Gleiche Farbe, aber flatShading — sonst wirkt das Vierkantrohr rund
    legFlatMat: new THREE.MeshStandardMaterial({
      color: 0x2a7fc1,
      metalness: 0.25,
      roughness: 0.42,
      flatShading: true,
    }),
    // Blanke Schrauben, Gewinde & Sechskant-Verstellmutter — silbrig hell.
    // Bewusst wenig metallisch und eher matt: von unten ist die Environment-
    // Map dunkel, ein hoher Metalness-Wert ließ die Mutter dort fast schwarz
    // spiegeln. So trägt die diffuse Eigenfarbe aus jedem Blickwinkel.
    // Blanke Verstellmutter, Gewinde & Schrauben. Bewusst helle Eigenfarbe bei
    // mäßiger metalness — auf dem Foto ist die Mutter das hellste Teil am Fuß,
    // und von unten liefert die Environment-Map kaum Licht zum Spiegeln.
    boltMat: new THREE.MeshStandardMaterial({
      color: 0xb8bec4,
      metalness: 0.4,
      roughness: 0.42,
    }),
    // Gleiches Material mit flatShading für die Sechskant-Schraubenköpfe:
    // ohne das interpoliert der Shader die sechs Flächen rund und der Kopf
    // liest sich als glatter Zylinder statt als Schraube.
    boltFlatMat: new THREE.MeshStandardMaterial({
      color: 0xa8aeb5,
      metalness: 0.45,
      roughness: 0.38,
      flatShading: true,
    }),
    // Blickle-Rad: gelbes Polyurethan. Heller und gesättigter als früher —
    // auf dem Produktbild ist der Laufbelag ein kräftiges Gelb, kein Ocker.
    wheelMat: new THREE.MeshStandardMaterial({
      color: 0xf0be20,
      metalness: 0.05,
      roughness: 0.55,
    }),
    // Aluminium-Radkörper (Nabe) — heller und matter als die verzinkte Gabel,
    // sonst verschwimmt die Nabe mit der Gabel zu einer Fläche.
    hubMat: new THREE.MeshStandardMaterial({
      color: 0xc9cdd1,
      metalness: 0.55,
      roughness: 0.45,
    }),
    // Rote Feststellbremse (Totalfeststeller) — Signalrot wie am realen Bauteil
    brakeMat: new THREE.MeshStandardMaterial({
      color: 0xd62d20,
      metalness: 0.25,
      roughness: 0.5,
    }),
    // Verzinkte Rollengabel
    forkMat: new THREE.MeshStandardMaterial({
      color: 0xb4bac1,
      metalness: 0.8,
      roughness: 0.35,
    }),
    aluMat: new THREE.MeshStandardMaterial({
      color: 0xd8dbde,
      metalness: 0.9,
      roughness: 0.35,
    }),
    // Hellere Lochwände für dicke Bauteile (Hubbock-Abdeckung, Brücken) —
    // darkSteel würde sie fast schwarz erscheinen lassen
    midSteel: new THREE.MeshStandardMaterial({
      color: 0xa2a8ae,
      metalness: 0.5,
      roughness: 0.5,
    }),
    // Schonleiste PE 1000 — mattes Kunststoffschwarz
    peMat: new THREE.MeshStandardMaterial({
      color: 0x2c2f33,
      metalness: 0.05,
      roughness: 0.85,
    }),
  };
}

// ── Komplette Szene: 1 oder 2 Tische, optional per Brücke verbunden ──
function buildScene(cfg: ShowroomConfig): THREE.Group {
  const g = new THREE.Group();
  const mats = makeMaterials(cfg);
  const { width: w, length: l } = cfg;

  if (cfg.product === "hubbock") {
    g.add(buildHubbock(cfg, mats));
  } else if (!cfg.second) {
    g.add(buildTable(cfg, mats));
  } else {
    // "end" = in Längsrichtung hintereinander, "side" = an der Längsseite
    const alongX = cfg.secondArrangement !== "side";
    const pitch = (alongX ? w : l) + (cfg.bridge ? GAP : 60);

    for (const s of [-1, 1]) {
      const t = buildTable(cfg, mats);
      t.position.set(alongX ? (s * pitch) / 2 : 0, 0, alongX ? 0 : (s * pitch) / 2);
      g.add(t);
    }

    // Brücken überspannen den Zwischenraum → erzeugen die mittige Öffnung.
    // Sie liegen außen an den Kanten auf ("da oben draußen jeweils die Winkel").
    if (cfg.bridge) {
      // SB1000.300 überspannt die 700-mm-Lücke mit je 150 mm Auflage
      const bridgeLen = 1000;
      const across = alongX ? l : w;
      const offs = across / 2 - BRIDGE_W / 2;
      for (const s of [-1, 1]) {
        const b = buildBridge(bridgeLen, mats);
        if (alongX) {
          b.position.set(0, 0, s * offs);
        } else {
          b.rotation.y = Math.PI / 2;
          b.position.set(s * offs, 0, 0);
        }
        g.add(b);
      }
    }
  }

  g.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Vertikal zentrieren (Drehpunkt = Bauteilmitte). Der Hubbock bringt seine
  // eigene Zentrierung mit, weil er niedriger ist als ein Tisch.
  if (cfg.product !== "hubbock") g.position.y = -TABLE_H / 2;

  const wrapper = new THREE.Group();
  wrapper.add(g);
  return wrapper;
}

// Ziel-Größe in Szenen-Einheiten: 5,5 (kleinster Tisch) bis 7,5 (größter)
function sceneUnits(maxDim: number): number {
  return 5.5 + 2 * Math.min(1, Math.max(0, (maxDim - 1000) / 1900));
}

// ── Tisch-Modell (React-Seite) ─────────────────────────────────
function TableModel({
  config,
  animate = true,
}: {
  config: ShowroomConfig;
  animate?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  const built = useMemo(
    () => buildScene(config),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      config.width,
      config.length,
      config.series,
      config.feet,
      config.sheet,
      config.metalness,
      config.roughness,
      config.accentColor,
      config.second,
      config.secondArrangement,
      config.bridge,
      config.product,
      config.hubbockWidth,
      config.hubbockCover,
      config.hubbockStrip,
    ]
  );

  // Geometrien & Materialien des Vorgänger-Builds freigeben
  useEffect(() => {
    return () => {
      built.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => m.dispose());
        }
      });
    };
  }, [built]);

  // Maßstab: mm → Szenen-Einheiten über die echte Bounding-Box.
  // Doppeltisch-Aufstellungen sind flacher und dürfen das Bild breiter füllen,
  // der Hubbock ist deutlich kleiner und bekommt einen eigenen Zielwert.
  const maxDim = Math.max(config.width, config.length);
  const s = useMemo(() => {
    const box = new THREE.Box3().setFromObject(built);
    const size = new THREE.Vector3();
    box.getSize(size);
    const horiz = Math.max(size.x, size.z, 1);
    const target =
      config.product === "hubbock"
        ? 5.6
        : sceneUnits(maxDim) * (config.second ? 1.32 : 1);
    return target / horiz;
  }, [built, maxDim, config.product, config.second]);

  // ── Eingang beim Mount, danach weiche Skalierung bei Größenwechsel ──
  const mounted = useRef(false);
  useEffect(() => {
    if (!groupRef.current || !animate) return;
    if (!mounted.current) {
      mounted.current = true;
      gsap.fromTo(
        groupRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: s, y: s, z: s, duration: 0.55, ease: "back.out(1.6)" }
      );
    } else {
      gsap.to(groupRef.current.scale, { x: s, y: s, z: s, duration: 0.45, ease: "power2.out" });
    }
  }, [s, animate]);

  // ── Wiggle als Bestätigung bei jeder Konfig-Änderung ──────────
  useEffect(() => {
    if (!groupRef.current || !mounted.current || !animate) return;
    const tl = gsap.timeline();
    tl.to(groupRef.current.rotation, { y: 0.15, duration: 0.12, ease: "power2.out" })
      .to(groupRef.current.rotation, { y: -0.1, duration: 0.1, ease: "power2.inOut" })
      .to(groupRef.current.rotation, { y: 0, duration: 0.18, ease: "power2.out" });
    return () => {
      tl.kill();
    };
  }, [built, animate]);

  return (
    <group ref={groupRef} scale={[s, s, s]}>
      <primitive object={built} />
    </group>
  );
}

// ── Haupt-Export ───────────────────────────────────────────────
export default function ShowroomViewer({
  config,
  animate = true,
  cameraPosition,
  autoRotate = true,
  target,
}: {
  config: ShowroomConfig;
  animate?: boolean;
  cameraPosition?: [number, number, number];
  autoRotate?: boolean;
  /** Blickziel — für Detailaufnahmen (z. B. Fußende) statt Tischmitte */
  target?: [number, number, number];
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: cameraPosition ?? [5.5, 4, 7.5], fov: 45 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={["#ffffff"]} />

      {/* Studio-Umgebung aus Lightformern statt eines Environment-Presets.
          Die Presets laden eine HDRI von raw.githack.com nach — das kostete
          beim Öffnen mehrere Sekunden, hing an der Verfügbarkeit eines
          fremden Servers und schickte die Besucher-IP dorthin. Diese Variante
          wird lokal in die Cubemap gerendert: gleiche Spiegelungen auf den
          Metallflächen, kein externer Request. frames={1} rendert sie einmal
          statt in jedem Frame. Der Flächenstrahler unter dem Tisch ist wichtig,
          weil die Untersicht die meistgenutzte Perspektive ist. */}
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.2} position={[0, 6, -9]} scale={[14, 10, 1]} />
        <Lightformer intensity={1.1} position={[-8, 2, 2]} rotation-y={Math.PI / 2} scale={[22, 4, 1]} />
        <Lightformer intensity={1.1} position={[8, 2, 2]} rotation-y={-Math.PI / 2} scale={[22, 4, 1]} />
        <Lightformer intensity={0.9} position={[0, 7, 4]} rotation-x={Math.PI / 2} scale={[16, 16, 1]} />
        <Lightformer intensity={0.7} position={[0, -7, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} />
      </Environment>

      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048] as unknown as number}
        // normalBias verhindert Selbstschattierung auf der großen Lochplatte
        // (sonst zeichnet sich die Triangulierung als feine Linie ab)
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      <Suspense fallback={null}>
        <TableModel config={config} animate={animate} />
      </Suspense>

      <OrbitControls
        makeDefault
        target={target ?? [0, 0, 0]}
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enablePan={false}
        minDistance={3}
        maxDistance={18}
        maxPolarAngle={Math.PI - 0.05}
        minPolarAngle={0.2}
      />
    </Canvas>
  );
}
