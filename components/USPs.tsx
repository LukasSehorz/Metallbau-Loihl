"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const usps = [
  {
    title: "Manufaktur statt Massenware",
    description:
      "Jeder Tisch entsteht in unserer Werkstatt in Loiching — handgefertigt, geprüft, garantiert.",
    icon: (
      <svg className="w-8 h-8 text-plasma" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="square" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline strokeLinecap="square" points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    title: "Maßanfertigung ohne Aufpreis-Wahnsinn",
    description:
      "Konfigurieren Sie Größe, Lochsystem und Material nach Ihren Anforderungen — zum fairen Preis.",
    icon: (
      <svg className="w-8 h-8 text-plasma" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <line strokeLinecap="square" x1="4" y1="12" x2="20" y2="12" />
        <line strokeLinecap="square" x1="4" y1="6" x2="4" y2="18" />
        <line strokeLinecap="square" x1="20" y1="6" x2="20" y2="18" />
        <line strokeLinecap="square" x1="9" y1="9" x2="9" y2="15" />
        <line strokeLinecap="square" x1="14" y1="9" x2="14" y2="15" />
      </svg>
    ),
  },
  {
    title: "Lieferzeit 2–4 Wochen",
    description:
      "Schneller als die Konkurrenz, ohne Kompromisse bei der Qualität. Wir planen mit Ihnen gemeinsam.",
    icon: (
      <svg className="w-8 h-8 text-plasma" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <rect strokeLinecap="square" x="3" y="4" width="18" height="18" rx="0" />
        <line strokeLinecap="square" x1="16" y1="2" x2="16" y2="6" />
        <line strokeLinecap="square" x1="8" y1="2" x2="8" y2="6" />
        <line strokeLinecap="square" x1="3" y1="10" x2="21" y2="10" />
        <polyline strokeLinecap="square" points="12,14 12,17 14,17" />
      </svg>
    ),
  },
  {
    title: "Direkt mit dem Inhaber sprechen",
    description:
      "Daniel Loihl beantwortet Ihre Fragen persönlich — kein Callcenter, keine Warteschleifen.",
    icon: (
      <svg className="w-8 h-8 text-plasma" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="square" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 11.5 19.79 19.79 0 011.44 2.9 2 2 0 013.42 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.44a16 16 0 006.29 6.29l.81-.81a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
];

// Uhrzeigersinn: Oben-Links → Oben-Rechts → Unten-Rechts → Unten-Links
// Array-Indizes im 2×2-Grid: 0 (TL), 1 (TR), 3 (BR), 2 (BL)
const CLOCKWISE_ORDER = [0, 1, 3, 2];

export default function USPs() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const allCards = section.querySelectorAll<HTMLElement>(".usp-card");
    const orderedCards = CLOCKWISE_ORDER.map((i) => allCards[i]).filter(Boolean);

    gsap.set(orderedCards, { opacity: 0, y: 60 });

    // Nach Layout-Stabilisierung initialisieren (verhindert Fehlzündung durch Next.js Hydration)
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      const tween = gsap.to(orderedCards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top 35%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      return () => tween.kill();
    }, 300);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-off-white px-6 md:px-10 py-16 md:py-24 lg:py-28 border-y border-[#E0E0E0]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16 text-center">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">
            Warum Loihl
          </p>
          <h2 className="text-carbon text-4xl md:text-5xl font-bold tracking-tightest">
            Vier Gründe für Loihl
          </h2>
        </div>

        {/* 2×2 Grid für Uhrzeigersinn-Logik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#E0E0E0]">
          {usps.map((usp) => (
            <div
              key={usp.title}
              className="usp-card bg-off-white p-8 md:p-10 flex flex-col gap-5"
            >
              <div>{usp.icon}</div>
              <div>
                <h3 className="text-carbon text-lg font-bold leading-snug tracking-tight mb-3">
                  {usp.title}
                </h3>
                <p className="text-[#4A4A4A] text-sm leading-relaxed">
                  {usp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
