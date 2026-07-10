"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
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
 * Der Tisch wird 1:1 aus der Konfiguration aufgebaut (Rahmen mit mittiger
 * Öffnung, Eck-Ausleger, 8 Beine — Optik des bisherigen Showroom-Modells):
 *   · Tischgröße   → echte Proportionen aus width × length
 *   · TD-Serie     → zusätzliche Diagonallochung
 *   · Füße/Rollen  → Stellfüße oder Blickle-Rollen an allen Beinen
 *   · Abdeckblech  → Aluplatten auf der Lochplatte
 */

// ── Konstanten (alle Maße in mm) ───────────────────────────────
const RASTER = 100;   // Lochraster 100 × 100 mm
const HOLE_R = 14;    // Ø 28 mm Lochsystem
const MARGIN = 50;    // Randabstand der Lochreihen
const PLATE_T = 200;  // Wangenhöhe der Tischplatte
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
    bevelEnabled: false,
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
  const legMat = new THREE.MeshStandardMaterial({
    color: 0x74797f,
    metalness: 0.7,
    roughness: 0.4,
  });
  const footMat = new THREE.MeshStandardMaterial({
    color: 0x3c4046,
    metalness: 0.6,
    roughness: 0.5,
  });
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x8a3038,
    metalness: 0.2,
    roughness: 0.6,
  });
  const aluMat = new THREE.MeshStandardMaterial({
    color: 0xd8dbde,
    metalness: 0.9,
    roughness: 0.35,
  });

  const plateY = TABLE_H - PLATE_T; // Unterkante Platte
  const footH = cfg.feet === "casters" ? CASTER_H : FOOT_H;

  // Ringbreite proportional zur Tischgröße, auf das Raster gerundet
  const rw = Math.min(
    500,
    Math.max(300, Math.round((0.32 * Math.min(w, l)) / RASTER) * RASTER)
  );
  const innerW = w - 2 * rw;
  const innerL = l - 2 * rw;
  const isRing = innerW > RASTER * 1.5 && innerL > RASTER * 1.5;

  // Plattensegmente (Rahmen mit mittiger Öffnung — wie das bisherige Modell)
  const segments: { w: number; l: number; x: number; z: number }[] = isRing
    ? [
        { w, l: rw, x: 0, z: -(l / 2 - rw / 2) },
        { w, l: rw, x: 0, z: l / 2 - rw / 2 },
        { w: rw, l: innerL, x: -(w / 2 - rw / 2), z: 0 },
        { w: rw, l: innerL, x: w / 2 - rw / 2, z: 0 },
      ]
    : [{ w, l, x: 0, z: 0 }];

  for (const s of segments) {
    const geo = perforatedPlateGeometry(s.w, s.l, PLATE_T, diagonal);
    geo.rotateX(-Math.PI / 2); // Extrusion zeigt nach +Y (Plattendicke)
    const mesh = new THREE.Mesh(geo, steel);
    mesh.position.set(s.x, plateY, s.z);
    g.add(mesh);
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
    const mesh = new THREE.Mesh(geo, steel);
    mesh.rotation.y = s.rotY;
    mesh.position.set(s.x, plateY + PLATE_T / 2, s.z);
    g.add(mesh);
  }

  // Eck-Ausleger: 4 trapezförmige Platten, diagonal nach außen
  const wingLen = Math.min(600, Math.max(300, 0.45 * Math.min(w, l)));
  const wingT = 60;
  const wingCorners: { sx: number; sz: number; rotY: number }[] = [
    { sx: 1, sz: 1, rotY: -Math.PI / 4 },
    { sx: 1, sz: -1, rotY: Math.PI / 4 },
    { sx: -1, sz: 1, rotY: (-3 * Math.PI) / 4 },
    { sx: -1, sz: -1, rotY: (3 * Math.PI) / 4 },
  ];
  for (const c of wingCorners) {
    const geo = wingGeometry(wingLen, rw * 0.9, rw * 0.35, wingT);
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, steel);
    mesh.rotation.y = c.rotY;
    mesh.position.set(
      c.sx * (w / 2 - rw / 2),
      TABLE_H - wingT,
      c.sz * (l / 2 - rw / 2)
    );
    g.add(mesh);
  }

  // 8 Beine: 4 Ecken + 4 Seitenmitten
  const legH = plateY - footH;
  const legGeo = new THREE.BoxGeometry(LEG_W, legH, LEG_W);
  const legPositions: [number, number][] = [
    [w / 2 - rw / 2, l / 2 - rw / 2],
    [w / 2 - rw / 2, -(l / 2 - rw / 2)],
    [-(w / 2 - rw / 2), l / 2 - rw / 2],
    [-(w / 2 - rw / 2), -(l / 2 - rw / 2)],
    [0, l / 2 - rw / 2],
    [0, -(l / 2 - rw / 2)],
    [w / 2 - rw / 2, 0],
    [-(w / 2 - rw / 2), 0],
  ];
  for (const [x, z] of legPositions) {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, footH + legH / 2, z);
    g.add(leg);

    if (cfg.feet === "casters") {
      // Blickle-Schwerlastrolle: Anschraubplatte, Gabel, Rad
      const mount = new THREE.Mesh(new THREE.BoxGeometry(130, 14, 130), footMat);
      mount.position.set(x, CASTER_H - 7, z);
      g.add(mount);
      const swivel = new THREE.Mesh(new THREE.CylinderGeometry(35, 35, 24, 20), footMat);
      swivel.position.set(x, CASTER_H - 26, z);
      g.add(swivel);
      for (const side of [-1, 1]) {
        const fork = new THREE.Mesh(new THREE.BoxGeometry(14, 115, 100), footMat);
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
  }, [s]);

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
  }, [built]);

  return (
    <group ref={groupRef} scale={[s, s, s]}>
      <primitive object={built} />
      <ContactShadows
        position={[0, -TABLE_H / 2 + 1, 0]}
        opacity={0.35}
        scale={maxDim * 2}
        blur={2.2}
        far={TABLE_H}
      />
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
