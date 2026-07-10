"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function IntroScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      initial={{ opacity: 1 }}
      exit={{
        clipPath: "inset(0 0 100% 0)",
        transition: { duration: 0.7, ease: EASE },
      }}
    >
      <motion.img
        src="/images/logo-loihl.png"
        alt="Loihl Metall- und Systembau"
        style={{ width: "min(70vw, 560px)", height: "auto" }}
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.0, ease: EASE }}
      />
    </motion.div>
  );
}
