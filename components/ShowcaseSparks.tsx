"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

/*
 * Dezenter Funken-/Staub-Layer für die Produktbühne.
 * Weiche, runde Glow-Sprites (Canvas-Textur) — Partikel steigen langsam auf
 * wie Schweißfunken im Lichtkegel.
 */

// Weiche runde Partikel-Textur (radialer Verlauf), einmal pro Modul erzeugt
function makeGlowTexture(): THREE.Texture | null {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

type FieldProps = {
  count: number;
  color: string;
  size: number;
  opacity: number;
  speed: number;
  spread: [number, number, number];
  texture: THREE.Texture;
};

function ParticleField({ count, color, size, opacity, speed, spread, texture }: FieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);

  // Startpositionen + Seeds (Phase, Tempo-Faktor, Sway-Amplitude) je Partikel
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread[0];
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
      seeds[i * 3]     = Math.random() * Math.PI * 2;
      seeds[i * 3 + 1] = 0.4 + Math.random() * 0.9;
      seeds[i * 3 + 2] = 0.1 + Math.random() * 0.3;
    }
    return { pos, seeds };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useFrame((state, delta) => {
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const arr = geo.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    const halfH = spread[1] / 2;

    for (let i = 0; i < count; i++) {
      // Aufsteigen + sanftes seitliches Pendeln
      arr[i * 3 + 1] += delta * speed * data.seeds[i * 3 + 1];
      arr[i * 3]     += Math.sin(t * data.seeds[i * 3 + 1] + data.seeds[i * 3]) * delta * data.seeds[i * 3 + 2];
      // Oben angekommen → unten neu eintreten
      if (arr[i * 3 + 1] > halfH) {
        arr[i * 3 + 1] = -halfH;
        arr[i * 3]     = (Math.random() - 0.5) * spread[0];
      }
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        alphaMap={texture}
        size={size}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export default function ShowcaseSparks({ active }: { active: boolean }) {
  // Einmalig beim Mount entscheiden — Komponente wird nur client-seitig geladen (ssr:false)
  const [isMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const texture = useMemo(() => makeGlowTexture(), []);
  const sparkCount = isMobile ? 60 : 130;

  if (!texture) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      frameloop={active ? "always" : "never"}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden
    >
      {/* Plasma-Funken */}
      <ParticleField
        count={sparkCount}
        color="#1FA9D9"
        size={0.07}
        opacity={0.35}
        speed={0.2}
        spread={[11, 7, 4]}
        texture={texture}
      />
      {/* Feiner weißer Staub im Lichtkegel */}
      <ParticleField
        count={Math.round(sparkCount * 0.7)}
        color="#ffffff"
        size={0.035}
        opacity={0.14}
        speed={0.09}
        spread={[12, 7, 4]}
        texture={texture}
      />
    </Canvas>
  );
}
