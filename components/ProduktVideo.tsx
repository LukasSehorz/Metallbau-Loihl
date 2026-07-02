"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { preloadFrames, onProgress, getFrameCount } from "@/lib/videoFrameLoader";

const FRAME_COUNT   = getFrameCount();
const SCROLL_HEIGHT = "800vh";
const FACTS_START   = 7 / 8;

const STEPS = [
  { title: "Präzisions-Lochraster",  desc: "Jede Bohrung sitzt auf den Zehntel genau — gefräst nach DIN-Norm." },
  { title: "Stahl S355",              desc: "Ausschließlich geprüfter Baustahl S355 — plan, gehärtet, maßhaltig." },
  { title: "Modulares System",        desc: "Rahmen, Beine und Tischplatte greifen passgenau ineinander." },
  { title: "Maßanfertigung",          desc: "Jede Größe, jedes Lochsystem — kein Aufpreis, gleiche Qualität." },
  { title: "Made in Bayern",          desc: "Gefertigt und geprüft in Loiching. Lieferzeit 2–4 Wochen." },
];

const KEY_FACTS = [
  { value: "S355",      label: "Werkstoff" },
  { value: "±0,1 mm",  label: "Präzision" },
  { value: "2–4 Wo.",  label: "Lieferzeit" },
  { value: "Bayern",   label: "Hergestellt in" },
];

export default function ProduktVideo() {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const framesRef    = useRef<ImageBitmap[]>([]);
  const frameObjRef  = useRef({ f: 0 });
  const progressObj  = useRef({ val: 0 });
  const lastDrawnRef = useRef(-1);
  const rafRef       = useRef<number>(0);
  const canvasDims   = useRef({ w: 0, h: 0 });

  const [loadPct, setLoadPct]     = useState(0);
  const [ready, setReady]         = useState(false);
  const [step, setStep]           = useState(0);
  const [showFacts, setShowFacts] = useState(false);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const frames = framesRef.current;
    const i = Math.max(0, Math.min(frames.length - 1, Math.round(index)));
    if (i === lastDrawnRef.current) return;
    lastDrawnRef.current = i;

    const frame = frames[i];
    if (!frame) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw  = canvas.offsetWidth;
    const ch  = canvas.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    if (canvasDims.current.w !== cw || canvasDims.current.h !== ch) {
      canvas.width  = cw * dpr;
      canvas.height = ch * dpr;
      canvasDims.current = { w: cw, h: ch };
    }

    const scale = Math.min(canvas.width / frame.width, canvas.height / frame.height);
    const dw = frame.width  * scale;
    const dh = frame.height * scale;
    const dx = (canvas.width  - dw) / 2;
    const dy = (canvas.height - dh) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, dx, dy, dw, dh);
  }, []);

  const startRAF = useCallback(() => {
    const loop = () => {
      drawFrame(frameObjRef.current.f);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [drawFrame]);

  // Phase 1: subscribe to shared loader (started by HomeClient on page load)
  useEffect(() => {
    const unsub = onProgress(setLoadPct);
    preloadFrames().then((frames) => {
      framesRef.current = frames;
      setReady(true);
    });
    return unsub;
  }, []);

  // Phase 2: single progress tween — first 7/8 drives frames, last 1/8 shows facts
  useEffect(() => {
    if (!ready) return;
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    drawFrame(0);
    startRAF();

    gsap.to(progressObj.current, {
      val: 1,
      ease: "none",
      onUpdate() {
        const p             = progressObj.current.val;
        const frameProgress = Math.min(1, p / FACTS_START);
        frameObjRef.current.f = frameProgress * (FRAME_COUNT - 1);
        setStep(Math.min(STEPS.length - 1, Math.floor(frameProgress * STEPS.length)));
        setShowFacts(p >= FACTS_START);
      },
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [ready, drawFrame, startRAF]);

  return (
    <div ref={wrapperRef} style={{ height: SCROLL_HEIGHT }}>
      <div
        className="sticky top-0 w-full bg-white overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Loading screen */}
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-white z-10">
            <p className="text-carbon/40 text-xs font-mono uppercase tracking-[0.25em]">
              Animation wird geladen
            </p>
            <div className="w-48 h-px bg-carbon/10 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-plasma transition-all duration-150"
                style={{ width: `${loadPct}%` }}
              />
            </div>
            <p className="text-plasma text-sm font-mono font-bold">{loadPct} %</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: ready ? "block" : "none" }}
        />

        {/* Step dots — right side */}
        <div
          className="absolute top-1/2 right-8 md:right-12 -translate-y-1/2 flex flex-col gap-3"
          style={{ opacity: ready ? 1 : 0, transition: "opacity 0.4s" }}
        >
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="transition-all duration-300"
              style={{
                width:      i === step ? "28px" : "8px",
                height:     "2px",
                background: i === step ? "#1FA9D9" : "rgba(10,10,10,0.2)",
              }}
            />
          ))}
        </div>

        {/* Step labels — top left for 03 & 04, bottom left for the rest */}
        <div
          className="absolute top-20 left-8 md:left-12 max-w-sm"
          style={{ opacity: ready ? 1 : 0, transition: "opacity 0.4s" }}
        >
          {STEPS.map((s, i) => i >= 2 && i <= 3 && (
            <div
              key={i}
              className="absolute top-0 left-0 transition-all duration-500"
              style={{
                opacity:       i === step ? 1 : 0,
                transform:     i === step ? "translateY(0)" : "translateY(-10px)",
                pointerEvents: "none",
              }}
            >
              <p className="text-plasma text-xs font-mono uppercase tracking-[0.2em] mb-2">
                {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
              </p>
              <h3
                className="text-carbon font-bold leading-tight mb-2"
                style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)", fontFamily: "var(--font-inter), Inter, sans-serif" }}
              >
                {s.title}
              </h3>
              <p className="text-carbon/50 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div
          className="absolute bottom-10 left-8 md:left-12 max-w-sm"
          style={{ opacity: ready ? 1 : 0, transition: "opacity 0.4s" }}
        >
          {STEPS.map((s, i) => (i < 2 || i > 3) && (
            <div
              key={i}
              className="absolute bottom-0 left-0 transition-all duration-500"
              style={{
                opacity:       i === step ? 1 : 0,
                transform:     i === step ? "translateY(0)" : "translateY(10px)",
                pointerEvents: "none",
              }}
            >
              <p className="text-plasma text-xs font-mono uppercase tracking-[0.2em] mb-2">
                {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
              </p>
              <h3
                className="text-carbon font-bold leading-tight mb-2"
                style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)", fontFamily: "var(--font-inter), Inter, sans-serif" }}
              >
                {s.title}
              </h3>
              <p className="text-carbon/50 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Key facts — dedicated scroll phase after step 05 */}
        <div
          className="absolute left-1/2 top-[25%] bg-white border border-carbon/10 transition-all duration-500"
          style={{
            opacity:       ready && showFacts ? 1 : 0,
            transform:     `translateX(-50%) translateY(${ready && showFacts ? "-50%" : "-40%"})`,
            pointerEvents: showFacts ? "auto" : "none",
            width:         "clamp(500px, 65vw, 900px)",
          }}
        >
          <div className="grid grid-cols-4">
            {KEY_FACTS.map((fact, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center py-7 px-5"
                style={{ borderRight: i < KEY_FACTS.length - 1 ? "1px solid rgba(10,10,10,0.1)" : "none" }}
              >
                <p className="text-carbon font-bold font-mono text-xl leading-none mb-2">
                  {fact.value}
                </p>
                <p className="text-carbon/50 text-xs font-mono uppercase tracking-widest">
                  {fact.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-10 right-8 md:right-12 flex items-center gap-2 transition-all duration-500"
          style={{ opacity: ready && step === 0 ? 1 : 0, pointerEvents: "none" }}
        >
          <span className="text-carbon/30 text-xs font-mono uppercase tracking-widest">Scrollen</span>
          <svg className="w-4 h-4 text-carbon/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
