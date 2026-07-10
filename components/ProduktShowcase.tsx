"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";

// three.js-Layer nur client-seitig laden (kein SSR, eigener Chunk)
const ShowcaseSparks = dynamic(() => import("./ShowcaseSparks"), { ssr: false });

/*
 * Produktbühne — ersetzt die alte Video-Scrub-Section.
 * Zwei Scroll-Schritte:
 *   1. Scroll → das echte Produktfoto fährt groß auf die dunkle Showroom-Bühne
 *   2. Scroll → alle Infos erscheinen gemeinsam links, Messpunkte leuchten auf
 */

const SCROLL_HEIGHT = "300vh";
const INFO_START    = 0.45; // bis hier: Bild-Reveal, danach: alle Infos

type Step = {
  title: string;
  desc: string;
};

const STEPS: Step[] = [
  {
    title: "Präzisions-Lochraster",
    desc: "Jede Bohrung sitzt auf den Zehntel genau.",
  },
  {
    title: "Stahl S355",
    desc: "Ausschließlich geprüfter Baustahl S355 — plan, maßhaltig.",
  },
  {
    title: "Modulares System",
    desc: "Rahmen, Beine und Tischplatte greifen passgenau ineinander.",
  },
  {
    title: "Maßanfertigung",
    desc: "Jede Größe, jedes Lochsystem — kein Aufpreis, gleiche Qualität.",
  },
  {
    title: "Made in Bayern",
    desc: "Gefertigt und geprüft in Loiching. Lieferzeit 2 Wochen.",
  },
];

const KEY_FACTS = ["S355", "±0,1 mm", "2 Wochen", "Made in Bayern"];

type Phase = "intro" | "info";

export default function ProduktShowcase() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const entryRef   = useRef<HTMLDivElement>(null); // Reveal (Opacity/Y/Scale)
  const floatRef   = useRef<HTMLDivElement>(null); // Dauerhaftes Schweben
  const glowRef    = useRef<HTMLDivElement>(null); // Plasma-Glow + Kontaktschatten
  const progressObj = useRef({ p: 0 });

  const [phase, setPhase]   = useState<Phase>("intro");
  const [inView, setInView] = useState(false);
  const [sparksMounted, setSparksMounted] = useState(false);
  const prefersReduced = useReducedMotion();

  const info = phase === "info";

  // Bühne im Blick? → Funken mounten / pausieren
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setSparksMounted(true);
      },
      { rootMargin: "30% 0px 30% 0px" }
    );
    io.observe(wrapper);
    return () => io.disconnect();
  }, []);

  // Scroll-Scrub: Progress → Reveal-Timeline + Phase
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const wrapper = wrapperRef.current;
    if (!wrapper || !entryRef.current || !glowRef.current) return;

    // Reveal-Timeline, manuell über Scroll-Progress gescrubbt
    const entryTl = gsap.timeline({ paused: true });
    if (prefersReduced) {
      entryTl.fromTo(entryRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: "none" }, 0);
      entryTl.fromTo(glowRef.current,  { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: "none" }, 0);
    } else {
      entryTl
        .fromTo(
          entryRef.current,
          { autoAlpha: 0, y: 130, scale: 0.82 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
          0
        )
        .fromTo(
          glowRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.85, ease: "power1.out" },
          0.15
        );
    }

    progressObj.current.p = 0;
    const tween = gsap.to(progressObj.current, {
      p: 1,
      ease: "none",
      onUpdate() {
        const p = progressObj.current.p;
        entryTl.progress(Math.min(1, p / INFO_START));
        setPhase(p >= INFO_START ? "info" : "intro");
      },
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      entryTl.kill();
    };
  }, [prefersReduced]);

  // Dauerhaftes, ruhiges Schweben des Tischs
  useEffect(() => {
    if (prefersReduced || !floatRef.current) return;
    const t = gsap.to(floatRef.current, {
      y: -10,
      duration: 3.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      t.kill();
    };
  }, [prefersReduced]);

  return (
    <div ref={wrapperRef} style={{ height: SCROLL_HEIGHT }} className="bg-carbon">
      <section
        className="sticky top-0 h-screen w-full overflow-hidden bg-carbon"
        aria-label="Der Loihl Systemtisch im Detail"
      >
        {/* Hairline oben (wie im Hero) */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/10 z-30" />

        {/* Dot-Grid — Zitat des Lochrasters */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, black 25%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, black 25%, transparent 78%)",
          }}
        />

        {/* Lichtkegel von oben */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 62% 30%, rgba(255,255,255,0.05), transparent 65%)",
          }}
        />

        {/* three.js Funken-Layer */}
        {sparksMounted && !prefersReduced && (
          <div className="absolute inset-0 z-[1]">
            <ShowcaseSparks active={inView} />
          </div>
        )}

        {/* Blueprint-Ecklabels */}
        <div className="absolute top-6 left-6 right-6 md:top-7 md:left-10 md:right-10 flex justify-between z-20 pointer-events-none">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
            Produktdetail — Systemtisch
          </p>
          <p className="hidden md:block font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
            Werkstatt Loiching · Bayern
          </p>
        </div>

        {/* Inhalt — Mobile: Headline → Tisch → Infos · Desktop: links Text, rechts Bühne */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto] lg:grid-rows-[auto_auto] lg:grid-cols-12 items-center gap-3 lg:gap-x-8 lg:gap-y-0 pt-20 md:pt-24 pb-6 lg:py-0">

          {/* ── Headline ── */}
          <div className="order-1 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="text-plasma text-xs font-mono uppercase tracking-[0.2em] mb-3 md:mb-4">
              Der Loihl Systemtisch
            </p>
            <h2 className="text-off-white font-bold tracking-tightest leading-[1.05] text-2xl md:text-4xl xl:text-[2.6rem] mb-2 md:mb-3">
              Jedes Detail<br />hat einen Grund.
            </h2>
            <p className="hidden md:block text-gray-mid text-sm md:text-base leading-relaxed max-w-md lg:mb-6">
              Kein Rendering — das ist der Tisch, wie er unsere Werkstatt in
              Loiching verlässt.
            </p>
          </div>

          {/* ── Alle Infos — erscheinen gemeinsam beim zweiten Scroll ── */}
          <div className="order-3 lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:self-start">
            <div className="space-y-3 md:space-y-5">
              {STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  className="flex gap-3.5 md:gap-4"
                  initial={false}
                  animate={{ opacity: info ? 1 : 0, x: info ? 0 : -28 }}
                  transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1], delay: info ? i * 0.08 : 0 }}
                  aria-hidden={!info}
                >
                  <p className="text-plasma text-[11px] font-mono pt-1 shrink-0 w-6">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div className="border-l border-white/10 pl-3.5 md:pl-4">
                    <h3 className="text-off-white font-bold leading-tight text-sm md:text-base mb-0.5 md:mb-1">
                      {s.title}
                    </h3>
                    <p className="text-white/50 text-xs md:text-sm leading-relaxed max-w-sm">
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* CTA */}
              <motion.div
                initial={false}
                animate={{ opacity: info ? 1 : 0, x: info ? 0 : -28 }}
                transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1], delay: info ? STEPS.length * 0.08 + 0.05 : 0 }}
                style={{ pointerEvents: info ? "auto" : "none" }}
                aria-hidden={!info}
                className="pt-1 md:pt-2 pl-[2.35rem] md:pl-10"
              >
                <Link
                  href="/#konfigurator"
                  className="inline-flex items-center gap-2 text-plasma text-sm font-semibold hover:gap-3.5 transition-all"
                >
                  Tisch konfigurieren
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* ── Rechte Spalte: Produktbühne ── */}
          <div className="order-2 lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:row-span-2 relative h-full min-h-0 flex flex-col items-center justify-center">
            {/* Höhen-Cap auf Mobile ohne Aspect-Verzerrung (Messpunkte bleiben exakt) */}
            <div
              ref={entryRef}
              className="relative w-full max-w-[calc(30vh*1.5)] lg:max-w-none lg:w-[106%] xl:w-[108%] will-change-transform"
            >

              {/* Glow + Kontaktschatten unter dem Tisch */}
              <div ref={glowRef} className="absolute inset-0 pointer-events-none" aria-hidden>
                <div
                  className="absolute left-1/2 -translate-x-1/2 bottom-[0%] w-[92%] h-[30%]"
                  style={{
                    background: "radial-gradient(ellipse 50% 40% at 50% 62%, rgba(31,169,217,0.2), transparent 72%)",
                    filter: "blur(14px)",
                  }}
                />
                <div
                  className="absolute left-1/2 -translate-x-1/2 bottom-[7%] w-[58%] h-[8%] rounded-[50%]"
                  style={{ background: "rgba(0,0,0,0.4)", filter: "blur(30px)" }}
                />
              </div>

              <div ref={floatRef} className="relative will-change-transform">
                <div className="relative aspect-[3/2]">
                  <Image
                    src="/images/produkt/schweisstisch-freigestellt.png"
                    alt="Loihl Schweißtisch in Sonderform mit Auslegern, Präzisions-Lochraster und höhenverstellbaren Standfüßen"
                    fill
                    className="object-contain select-none"
                    sizes="(min-width: 1024px) 62vw, 92vw"
                    quality={90}
                    draggable={false}
                  />

                </div>
              </div>
            </div>

            {/* Key-Facts-Zeile unter dem Tisch (Desktop) */}
            <motion.p
              className="hidden lg:block absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs text-white/40 tracking-widest uppercase"
              initial={false}
              animate={{ opacity: info ? 1 : 0, y: info ? 0 : 14 }}
              transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1], delay: info ? 0.35 : 0 }}
              aria-hidden={!info}
            >
              {KEY_FACTS.map((f, i) => (
                <span key={f}>
                  {i > 0 && <span className="text-plasma mx-3">·</span>}
                  <span className="text-off-white/70">{f}</span>
                </span>
              ))}
            </motion.p>
          </div>
        </div>

        {/* Scroll-Hinweis (nur Intro) */}
        <div
          className="absolute bottom-8 right-6 md:right-10 flex items-center gap-2 z-20 transition-opacity duration-500 pointer-events-none"
          style={{ opacity: info ? 0 : 1 }}
        >
          <span className="text-white/30 text-xs font-mono uppercase tracking-widest">Scrollen</span>
          <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>
    </div>
  );
}
