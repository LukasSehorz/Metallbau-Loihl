"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const categories = [
  {
    title: "Schweißtische",
    description: "Robuste Tische für präzises Schweißen und Montage. Modelle TO und TD mit Ø 28 mm Lochsystem, maßgefertigt ab 1.000 × 1.000 mm.",
    href: "/produkte#schweisstische",
    img: "/images/prod-schweisstisch-2.png",
    imgAlt: "Schweißtisch Loihl Modell TD",
  },
  {
    title: "Spanntische",
    description: "Flexible Spannlösungen für komplexe Werkstückgeometrien. Kompatibel mit dem universellen Zubehörsystem.",
    href: "/produkte#schweisstische",
    img: "/images/Produkt-Bilder/Spann- und Schweißtisch.png",
    imgAlt: "Spann- und Schweißtisch Loihl",
  },
  {
    title: "Zubehör & Spannelemente",
    description: "Bolzen, Anschläge, Winkel und Aufsätze — hochwertiges Zubehör für alle Tischmodelle aus dem Hause Loihl.",
    href: "/produkte#zubehoer",
    img: "/images/prod-zubehoer-1.png",
    imgAlt: "Zubehör und Spannelemente Loihl",
  },
];

const TOTAL      = categories.length;
const SIDE_X     = 370;   // px offset for side cards
const SIDE_SCALE = 0.80;
const SIDE_RY    = 9;     // rotateY degrees for side cards

function getOffset(idx: number, active: number): -1 | 0 | 1 {
  let off = idx - active;
  if (off >  1) off -= TOTAL;
  if (off < -1) off += TOTAL;
  return off as -1 | 0 | 1;
}

function cardCfg(off: -1 | 0 | 1) {
  if (off === 0) return {
    x: 0, scale: 1, rotateY: 0,
    opacity: 1, zIndex: 10,
    filter: "brightness(1) grayscale(0%)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.14)",
  };
  return {
    x: off * SIDE_X,
    scale: SIDE_SCALE,
    rotateY: -off * SIDE_RY,
    opacity: 0.55,
    zIndex: 5,
    filter: "brightness(0.65) grayscale(20%)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
  };
}

export default function ProductCategories() {
  const [active, setActive] = useState(0);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const activeRef  = useRef(0); // keeps sync without re-render in callbacks

  const applyPositions = useCallback((a: number, animate = true) => {
    activeRef.current = a;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const cfg = cardCfg(getOffset(i, a));
      if (animate) {
        gsap.to(el,  { ...cfg, duration: 0.65, ease: "power3.inOut", overwrite: true });
      } else {
        gsap.set(el, cfg);
      }
    });
  }, []);

  // Setup: positions + entrance animation
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Set positions first, then override y/opacity for entrance
    applyPositions(0, false);
    cardRefs.current.forEach((el) => el && gsap.set(el, { y: 70, autoAlpha: 0 }));

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 78%",
      once: true,
      onEnter: () => {
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const off  = getOffset(i, 0);
          const cfg  = cardCfg(off);
          // stagger: center card first, side cards slightly after
          const delay = off === 0 ? 0 : 0.18;
          gsap.to(el, {
            y: 0,
            autoAlpha: cfg.opacity,
            duration: 0.75,
            delay,
            ease: "power3.out",
            overwrite: true,
          });
        });
      },
    });

    // ── Haptic tilt on hover ──────────────────────────────────────────────
    const hoverCleanups: (() => void)[] = [];

    cardRefs.current.forEach((el, i) => {
      if (!el) return;

      const onMove = (e: MouseEvent) => {
        const off = getOffset(i, activeRef.current);
        const rect = el.getBoundingClientRect();
        // Normalized -1 → +1 within the card
        const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
        const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

        if (off === 0) {
          // Active card: full 3D tilt + slight lift
          gsap.to(el, {
            rotateY:   nx * 7,
            rotateX:  -ny * 5,
            y:        -6,
            boxShadow: `${-nx * 8}px ${-ny * 8 + 28}px 60px rgba(0,0,0,0.18)`,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          // Side cards: subtle brightness hint, no tilt
          gsap.to(el, {
            filter: "brightness(0.78) grayscale(10%)",
            scale:  SIDE_SCALE + 0.02,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      const onLeave = () => {
        const off = getOffset(i, activeRef.current);
        const cfg = cardCfg(off);
        gsap.to(el, {
          rotateY:   0,
          rotateX:   0,
          y:         0,
          scale:     cfg.scale,
          boxShadow: cfg.boxShadow,
          filter:    cfg.filter,
          duration:  0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      el.addEventListener("mousemove",  onMove);
      el.addEventListener("mouseleave", onLeave);
      hoverCleanups.push(() => {
        el.removeEventListener("mousemove",  onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      st.kill();
      hoverCleanups.forEach((fn) => fn());
    };
  }, [applyPositions]);

  const goTo = useCallback((next: number) => {
    setActive(next);
    applyPositions(next);
  }, [applyPositions]);

  const goNext = () => goTo((active + 1) % TOTAL);
  const goPrev = () => goTo((active - 1 + TOTAL) % TOTAL);

  return (
    <section ref={sectionRef} className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">Sortiment</p>
          <h2 className="text-carbon text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tightest">
            Unsere Produkte.
          </h2>
        </div>

        {/* Carousel stage */}
        <div className="relative" style={{ height: "520px" }}>

          {/* Perspective container — cards float here */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: "1400px", perspectiveOrigin: "50% 45%" }}
          >
            {categories.map((cat, i) => (
              <div
                key={cat.title}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="absolute flex flex-col bg-white border border-carbon/10 overflow-hidden"
                style={{
                  width: "clamp(300px, 30vw, 440px)",
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                  cursor: i !== active ? "pointer" : "default",
                }}
                onClick={() => { if (i !== active) goTo(i); }}
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-100" style={{ height: "240px" }}>
                  <Image
                    src={cat.img}
                    alt={cat.imgAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="440px"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-2">Sortiment</p>
                  <h3 className="text-carbon text-xl md:text-2xl font-bold mb-3 tracking-tight">{cat.title}</h3>
                  <p className="text-carbon/60 text-sm leading-relaxed flex-1">{cat.description}</p>
                  <Link
                    href={cat.href}
                    className="mt-5 inline-flex items-center gap-2 text-plasma text-sm font-semibold hover:gap-3 transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Mehr erfahren</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Arrow — left */}
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-white border border-carbon/10 hover:border-plasma hover:text-plasma text-carbon/60 transition-all duration-200"
            aria-label="Vorheriges Produkt"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Arrow — right */}
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-white border border-carbon/10 hover:border-plasma hover:text-plasma text-carbon/60 transition-all duration-200"
            aria-label="Nächstes Produkt"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center items-center gap-3 mt-8">
          {categories.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300"
              style={{
                width:      i === active ? "28px" : "8px",
                height:     "2px",
                background: i === active ? "#1FA9D9" : "rgba(10,10,10,0.2)",
              }}
              aria-label={`Produkt ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
