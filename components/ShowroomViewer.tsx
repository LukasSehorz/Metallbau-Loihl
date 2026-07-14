"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
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
};

/*
 * Parametrisches Tischmodell — ersetzt die statischen Meshy-GLB-Scans.
 * Zwei Bauformen, abhängig von der Tischgröße:
 *   · bis 1.400 × 1.400 mm  → massiver Rechtecktisch wie das reale Produkt
 *     (volle Lochplatte, gelochte Wangen, 4 blaue Beine)
 *   · größere Maße          → Rahmentisch wie das Showroom-Modell
 *     ("Lochgröße 22mm.glb": zwei Plattenfelder, mittige Öffnung,
 *     Eck-Ausleger, 8 Beine)
 * Es reagiert live auf die Konfiguration:
 *   · Tischgröße   → echte Proportionen aus width × length
 *   · TD-Serie     → zusätzliche Diagonallochung
 *   · Füße/Rollen  → Stellfüße oder Blickle-Rollen (blau/rot)
 *   · Abdeckblech  → Aluplatten auf der Lochplatte
 */

// ── Konstanten (alle Maße in mm) ───────────────────────────────
const RASTER = 100;   // Lochraster 100 × 100 mm
const HOLE_R = 14;    // Ø 28 mm Lochsystem
const MARGIN = 50;    // Randabstand der Lochreihen
const PLATE_T = 200;  // Gesamt-Korpushöhe (dünne Arbeitsplatte + Zarge)
const TOP_T = 32;     // Dicke der Arbeitsplatte — nur EINE dünne Lochplatte oben
const TABLE_H = 850;  // Arbeitshöhe gesamt
const LEG_W = 80;     // Kantrohr-Querschnitt der Beine
const FOOT_H = 60;    // Höhe Stellfuß
const CASTER_H = 210; // Höhe Schwerlastrolle

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

  return new THREE.ExtrudeGeometry(shape, {
    depth: t,
    bevelEnabled: true,
    bevelThickness: 2.5,
    bevelSize: 2.5,
    bevelSegments: 1,
    curveSegments: 10,
  });
}

// ── Eck-Ausleger: trapezförmige Platte mit Lochreihe ───────────
function wingGeometry(len: number, baseW: number, tipW: number, t: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, -baseW / 2);
  shape.lineTo(len, -tipW / 2);
  shape.lineTo(len, tipW / 2);
  shape.lineTo(0, baseW / 2);
  shape.closePath();

  for (let x = RASTER; x <= len - 60; x += RASTER) {
    const p = new THREE.Path();
    p.absarc(x, 0, HOLE_R, 0, Math.PI * 2, true);
    shape.holes.push(p);
  }

  return new THREE.ExtrudeGeometry(shape, {
    depth: t,
    bevelEnabled: false,
    curveSegments: 10,
  });
}

// ── Unterbau: Hohlkasten-Verstrebung (diagonale Eckbleche + Querrippe) ──
// Bildet die von unten sichtbare Struktur eines echten Schweißtisches nach:
// offener Kasten mit Eck-Verstärkungen statt massiver Platte.
function addUnderStructure(
  g: THREE.Group,
  cx: number,
  cz: number,
  segW: number,
  segL: number,
  topUnderY: number, // Unterkante der Arbeitsplatte
  bottomY: number,   // Unterkante des Korpus (= Zargen-Unterkante)
  mat: THREE.Material
) {
  const apron = topUnderY - bottomY;   // Zargenhöhe
  const ribH = apron * 0.7;            // Höhe der Verstrebungen unter der Platte
  const ribY = topUnderY - ribH / 2;   // direkt unter der Platte zentriert
  const ribT = 12;

  // Diagonale dreieckige Eckbleche (Gussets): rechter Winkel in der Tischecke,
  // Hypotenuse diagonal nach innen — bleiben vollständig innerhalb der Platte.
  const gLen = Math.min(300, Math.min(segW, segL) * 0.34);
  const inset = 70;
  const cs: [number, number, number][] = [
    [1, 1, -Math.PI / 4],
    [-1, 1, (-3 * Math.PI) / 4],
    [1, -1, Math.PI / 4],
    [-1, -1, (3 * Math.PI) / 4],
  ];
  for (const [sx, sz, ang] of cs) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(-gLen, 0);
    shape.lineTo(0, -ribH);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: ribT, bevelEnabled: false });
    geo.translate(0, 0, -ribT / 2);
    const gm = new THREE.Mesh(geo, mat);
    gm.rotation.y = ang;
    gm.position.set(cx + sx * (segW / 2 - inset), topUnderY, cz + sz * (segL / 2 - inset));
    g.add(gm);
  }

  // Eine mittige Aussteifungsrippe quer zur längeren Achse
  const rib =
    segL >= segW
      ? new THREE.Mesh(new THREE.BoxGeometry(segW - 80, ribH, ribT), mat)
      : new THREE.Mesh(new THREE.BoxGeometry(ribT, ribH, segL - 80), mat);
  rib.position.set(cx, ribY, cz);
  g.add(rib);
}

// ── Kompletter Tisch als THREE.Group ───────────────────────────
function buildTable(cfg: ShowroomConfig): THREE.Group {
  const g = new THREE.Group();
  const { width: w, length: l } = cfg;
  const diagonal = cfg.series === "TD";

  const steel = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.accentColor),
    metalness: cfg.metalness,
    roughness: cfg.roughness,
  });
  // Dunkler Stahl für Lochwände & Schnittkanten — lässt die Bohrungen
  // tief wirken (ExtrudeGeometry: Gruppe 0 = Deckflächen, 1 = Seitenwände)
  const darkSteel = new THREE.MeshStandardMaterial({
    color: 0x565b60,
    metalness: 0.5,
    roughness: 0.55,
  });
  // Pulverbeschichtetes Blau der Beine & Rollenhalter (wie am realen Tisch)
  const legMat = new THREE.MeshStandardMaterial({
    color: 0x1e8fcc,
    metalness: 0.3,
    roughness: 0.45,
  });
  const footMat = new THREE.MeshStandardMaterial({
    color: 0x3c4046,
    metalness: 0.6,
    roughness: 0.5,
  });
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0xc03a2b,
    metalness: 0.15,
    roughness: 0.55,
  });
  const aluMat = new THREE.MeshStandardMaterial({
    color: 0xd8dbde,
    metalness: 0.9,
    roughness: 0.35,
  });

  const plateY = TABLE_H - PLATE_T; // Unterkante Platte
  const footH = cfg.feet === "casters" ? CASTER_H : FOOT_H;

  // Bauform: bis 1.400 × 1.400 massiver Rechtecktisch (wie das reale
  // Produktfoto), darüber Rahmentisch (wie "Lochgröße 22mm.glb")
  const isRing = Math.max(w, l) > 1400;

  // Rahmen-Layout: zwei breite Plattenfelder an den Enden, schmale
  // Verbindungsstege längs, große mittige Öffnung
  const openW = Math.max(
    RASTER * 4,
    Math.round((0.32 * w) / RASTER) * RASTER
  ); // Öffnung in Tisch-Längsrichtung
  const railL = 250; // Tiefe der Verbindungsstege
  const endW = (w - openW) / 2; // Breite der Endfelder

  const segments: { w: number; l: number; x: number; z: number }[] = isRing
    ? [
        { w: endW, l, x: -(openW / 2 + endW / 2), z: 0 },
        { w: endW, l, x: openW / 2 + endW / 2, z: 0 },
        { w: openW, l: railL, x: 0, z: -(l / 2 - railL / 2) },
        { w: openW, l: railL, x: 0, z: l / 2 - railL / 2 },
      ]
    : [{ w, l, x: 0, z: 0 }];

  // Arbeitsplatte: nur EINE dünne Lochplatte oben. (Eine massive 200-mm-Platte
  // ließe die Unterseite wie ein zweites Lochblech wirken und den Tisch zu dick
  // aussehen.) Darunter offener Hohlkasten aus Zarge + Eck-Verstrebungen.
  const topUnderY = TABLE_H - TOP_T; // Unterkante der Arbeitsplatte
  for (const s of segments) {
    const geo = perforatedPlateGeometry(s.w, s.l, TOP_T, diagonal);
    geo.rotateX(-Math.PI / 2); // Extrusion zeigt nach +Y (Plattendicke)
    const mesh = new THREE.Mesh(geo, [steel, darkSteel]);
    mesh.position.set(s.x, topUnderY, s.z);
    g.add(mesh);

    // Unterbau nur für ausreichend große Felder (nicht für schmale Stege)
    if (Math.min(s.w, s.l) > 350) {
      addUnderStructure(g, s.x, s.z, s.w, s.l, topUnderY, plateY, darkSteel);
    }
  }

  // Seitenwangen außen: dünne gelochte Blenden, 2 mm vorstehend
  const skirtT = 10;
  const skirts: { w: number; rotY: number; x: number; z: number }[] = [
    { w, rotY: 0, x: 0, z: -(l / 2 + 2) },
    { w, rotY: 0, x: 0, z: l / 2 - 8 },
    { w: l, rotY: Math.PI / 2, x: -(w / 2 + 2), z: 0 },
    { w: l, rotY: Math.PI / 2, x: w / 2 - 8, z: 0 },
  ];
  for (const s of skirts) {
    const geo = perforatedPlateGeometry(s.w - 4, PLATE_T, skirtT, false);
    const mesh = new THREE.Mesh(geo, [steel, darkSteel]);
    mesh.rotation.y = s.rotY;
    mesh.position.set(s.x, plateY + PLATE_T / 2, s.z);
    g.add(mesh);
  }

  // Pfähler (Ausleger-Arme) — Anordnung wie am realen Rahmentisch:
  // je Stirnseite 2 lange Arme an den Ecken (in Längsrichtung), je
  // Längsseite 3 kürzere Arme quer nach außen
  if (isRing) {
    const wingT = 40;

    // Stirnseiten: 2 lange Pfähler pro Ende
    const endArmLen = Math.min(700, Math.max(400, 0.22 * w));
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const geo = wingGeometry(endArmLen, 280, 130, wingT);
        geo.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geo, steel);
        mesh.rotation.y = sx === 1 ? 0 : Math.PI;
        mesh.position.set(
          sx * (w / 2 - 100),
          TABLE_H - wingT,
          sz * (l / 2 - 200)
        );
        g.add(mesh);
      }
    }

    // Längsseiten: 3 kürzere Pfähler pro Seite (Enden + Mitte)
    const sideArmLen = Math.min(400, Math.max(250, 0.28 * l));
    const sideArmXs = [-(w / 2 - 350), 0, w / 2 - 350];
    for (const sz of [-1, 1]) {
      for (const xi of sideArmXs) {
        const geo = wingGeometry(sideArmLen, 240, 120, wingT);
        geo.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geo, steel);
        mesh.rotation.y = sz === 1 ? -Math.PI / 2 : Math.PI / 2;
        mesh.position.set(xi, TABLE_H - wingT, sz * (l / 2 - 100));
        g.add(mesh);
      }
    }
  }

  // Beine: massiver Tisch 4 Ecken (wie das reale Produkt),
  // Rahmentisch 8 Stück (Ecken, Endfeld-Mitten, Steg-Mitten)
  const legH = plateY - footH;
  const legGeo = new THREE.BoxGeometry(LEG_W, legH, LEG_W);
  // Rahmentisch: 6 Beine in 2–2–2 (wie das reale Produkt) — je Endreihe
  // 2 Eckbeine, dazu 2 Beine unter den Stegmitten
  const legPositions: [number, number][] = isRing
    ? [
        [w / 2 - 250, l / 2 - 250],
        [w / 2 - 250, -(l / 2 - 250)],
        [-(w / 2 - 250), l / 2 - 250],
        [-(w / 2 - 250), -(l / 2 - 250)],
        [0, l / 2 - railL / 2],
        [0, -(l / 2 - railL / 2)],
      ]
    : [
        [w / 2 - 140, l / 2 - 140],
        [w / 2 - 140, -(l / 2 - 140)],
        [-(w / 2 - 140), l / 2 - 140],
        [-(w / 2 - 140), -(l / 2 - 140)],
      ];
  for (const [x, z] of legPositions) {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, footH + legH / 2, z);
    g.add(leg);

    if (cfg.feet === "casters") {
      // Blickle-Schwerlastrolle: blaue Anschraubplatte & Gabel, rotes Rad
      const mount = new THREE.Mesh(new THREE.BoxGeometry(130, 14, 130), legMat);
      mount.position.set(x, CASTER_H - 7, z);
      g.add(mount);
      const swivel = new THREE.Mesh(new THREE.CylinderGeometry(35, 35, 24, 20), footMat);
      swivel.position.set(x, CASTER_H - 26, z);
      g.add(swivel);
      for (const side of [-1, 1]) {
        const fork = new THREE.Mesh(new THREE.BoxGeometry(14, 115, 100), legMat);
        fork.position.set(x + side * 34, 118, z);
        g.add(fork);
      }
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(72, 72, 48, 24), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 72, z);
      g.add(wheel);
      const axle = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 84, 12), footMat);
      axle.rotation.z = Math.PI / 2;
      axle.position.set(x, 72, z);
      g.add(axle);
    } else {
      // Feststehender, höhenverstellbarer Stellfuß
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, FOOT_H, 12), footMat);
      stem.position.set(x, FOOT_H / 2 + 8, z);
      g.add(stem);
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(55, 62, 22, 24), footMat);
      disc.position.set(x, 11, z);
      g.add(disc);
    }
  }

  // Aluabdeckblech: Platten liegen sichtbar auf der Lochplatte auf
  if (cfg.sheet) {
    for (const s of segments) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(s.w - 12, 8, s.l - 12), aluMat);
      plate.position.set(s.x, TABLE_H + 4, s.z);
      g.add(plate);
    }
  }

  g.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Vertikal zentrieren (Drehpunkt = Tischmitte)
  g.position.y = -TABLE_H / 2;

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
    () => buildTable(config),
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

  // Maßstab: mm → Szenen-Einheiten über die echte Bounding-Box (inkl.
  // Eck-Ausleger), damit das Modell immer sauber im Bild steht.
  const maxDim = Math.max(config.width, config.length);
  const s = useMemo(() => {
    const box = new THREE.Box3().setFromObject(built);
    const size = new THREE.Vector3();
    box.getSize(size);
    const horiz = Math.max(size.x, size.z, 1);
    return sceneUnits(maxDim) / horiz;
  }, [built, maxDim]);

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
}: {
  config: ShowroomConfig;
  animate?: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [5.5, 4, 7.5], fov: 45 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#ffffff"]} />

      <Environment preset="city" />

      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048] as unknown as number}
        shadow-bias={-0.0003}
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
        target={[0, 0, 0]}
        autoRotate
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
