"use client";
import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";

const TEXT = "Metallbau Loihl";
const CHARS = TEXT.split("");

const FONT: React.CSSProperties = {
  fontFamily: "var(--font-inter), Inter, sans-serif",
  fontWeight: 700,
  fontSize: "clamp(1.4rem, 2.8vw, 3.4rem)",
  color: "#F5F5F2",
  letterSpacing: "0.05em",
  whiteSpace: "pre",
  display: "inline-block",
};

const ICON_SIZE: React.CSSProperties = {
  width: "clamp(28px, 3vw, 46px)",
  height: "clamp(28px, 3vw, 46px)",
};

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

// Bold "L" drawn as two strokes — evokes precision, industrial craft
const L_PATH = "M 11 8 L 11 40 L 37 40";

export default function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 1000);
    const t2 = setTimeout(onComplete, 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#0A0A0A",
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
      <LayoutGroup>

        {/* Phase 1: "L" icon draws itself, centred */}
        {!revealed && (
          <motion.div layoutId="brand-icon">
            <svg viewBox="0 0 48 48" fill="none" style={{ display: "block", ...ICON_SIZE }}>
              <motion.path
                d={L_PATH}
                stroke="#1FA9D9"
                strokeWidth="3.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 0.85, ease: EASE },
                  opacity: { duration: 0.1 },
                }}
              />
            </svg>
          </motion.div>
        )}

        {/* Phase 2: icon slides left, company name staggered in */}
        {revealed && (
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 1.4vw, 20px)" }}>

            <motion.div
              layoutId="brand-icon"
              transition={{ duration: 1.05, ease: EASE }}
            >
              <svg viewBox="0 0 48 48" fill="none" style={{ display: "block", ...ICON_SIZE }}>
                <path
                  d={L_PATH}
                  stroke="#1FA9D9"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </motion.div>

            <div style={{ overflow: "hidden" }}>
              <motion.div
                style={{ display: "flex" }}
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.048, delayChildren: 0.9 } },
                }}
              >
                {CHARS.map((char, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { y: "110%", opacity: 0 },
                      visible: {
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.55, ease: EASE },
                      },
                    }}
                    style={FONT}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </div>

          </div>
        )}

      </LayoutGroup>
    </motion.div>
  );
}
