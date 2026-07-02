"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export type ShowroomConfig = {
  width: number;
  length: number;
  thickness: number;
  metalness: number;
  roughness: number;
  holeSystem: string;
  accentColor: string;
};

// ── Model-Pfade je Lochsystem ──────────────────────────────────
const MODEL_PATHS: Record<string, string> = {
  D26: "/3D-Bilder/Lochgr%C3%B6%C3%9Fe%2026mm.glb",
  D22: "/3D-Bilder/Lochgr%C3%B6%C3%9Fe%2022mm.glb",
  D16: "/3D-Bilder/Lochgr%C3%B6%C3%9Fe%2016mm.glb",
};

function getModelPath(holeSystem: string): string {
  return MODEL_PATHS[holeSystem] ?? MODEL_PATHS["D26"];
}

// ── Tisch-Modell ───────────────────────────────────────────────
function TableModel({
  config,
  modelPath,
}: {
  config: ShowroomConfig;
  modelPath: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(modelPath);

  const model = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => {
          mat.transparent = true;
          mat.alphaTest = 0.5;
          (mat as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
          mat.needsUpdate = true;
        });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const normScale = maxDim > 0 ? 6 / maxDim : 1;

    clone.scale.setScalar(normScale);
    clone.position.set(
      -center.x * normScale,
      -center.y * normScale,
      -center.z * normScale
    );

    return clone;
  }, [scene]);

  const s = Math.max(config.width, config.length) / 1000;

  // ── Wiggle bei Konfig-Änderung ──────────────────────────
  useEffect(() => {
    if (!groupRef.current) return;
    const tl = gsap.timeline();
    tl.to(groupRef.current.rotation, { y: 0.15, duration: 0.12, ease: "power2.out" })
      .to(groupRef.current.rotation, { y: -0.1, duration: 0.1, ease: "power2.inOut" })
      .to(groupRef.current.rotation, { y: 0, duration: 0.18, ease: "power2.out" });
  }, [config.width, config.length, config.holeSystem]);

  // ── Sauberer Eingang beim Modell-Wechsel ─────────────────────
  useEffect(() => {
    if (!groupRef.current) return;
    // Startet bei Scale 0 und wächst mit elastischem Ease rein
    gsap.fromTo(
      groupRef.current.scale,
      { x: 0, y: 0, z: 0 },
      { x: s, y: s, z: s, duration: 0.55, ease: "back.out(1.6)" }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // nur beim Mount (= jedem Modell-Wechsel via key-Prop)

  // ── Akzentfarbe bei Material-Wechsel ─────────────────────
  useEffect(() => {
    if (!groupRef.current) return;
    const color = new THREE.Color(config.accentColor);
    // Kurzer Emissive-Flash als Bestätigung
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (Array.isArray(mat)) return;
        mat.color = color;
        mat.emissive = color;
        mat.emissiveIntensity = 0.6;
        mat.needsUpdate = true;
      }
    });
    // Emissive nach 400ms ausblenden
    const timer = setTimeout(() => {
      groupRef.current?.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (Array.isArray(mat)) return;
          gsap.to(mat, { emissiveIntensity: 0, duration: 0.4 });
          mat.needsUpdate = true;
        }
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [config.accentColor]);

  return (
    <group ref={groupRef} scale={[s, s, s]}>
      <primitive object={model} />
    </group>
  );
}

// ── Haupt-Export ───────────────────────────────────────────────
export default function ShowroomViewer({
  config,
}: {
  config: ShowroomConfig;
}) {
  const modelPath = getModelPath(config.holeSystem);
  const s = Math.max(config.width, config.length) / 1000;
  const maxDist = Math.round(12 * s);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [5, 3.5, 7], fov: 45 }}
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
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      <Suspense fallback={null}>
        <TableModel
          key={modelPath}
          config={config}
          modelPath={modelPath}
        />
      </Suspense>

      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        autoRotate
        autoRotateSpeed={0.6}
        enablePan={false}
        minDistance={1.5}
        maxDistance={maxDist}
        maxPolarAngle={Math.PI - 0.05}
        minPolarAngle={0.2}
      />
    </Canvas>
  );
}

Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path));
