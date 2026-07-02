"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HorizontalScrollSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        },
      });
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="overflow-hidden">
      <div ref={trackRef} className="flex will-change-transform">

        {/* ── Panel 1: Manufaktur ── */}
        <section className="w-screen shrink-0 min-h-screen bg-off-white flex items-center px-6 md:px-10 py-16 md:py-24 lg:py-28 border-b border-[#E0E0E0]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Bild */}
            <div className="relative">
              <div className="aspect-[4/5] md:aspect-[3/4] relative overflow-hidden bg-gray-200">
                <Image
                  src="/images/team-daniel-loihl.jpg"
                  alt="Daniel Loihl, Inhaber Loihl Metall- und Systembau"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-plasma hidden md:block" />
            </div>

            {/* Text */}
            <div className="flex flex-col">
              <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-4">
                Manufaktur
              </p>
              <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tightest mb-6">
                Eine Werkstatt. Ein Inhaber. Jeder Tisch persönlich geprüft.
              </h2>
              <p className="text-carbon/70 text-base leading-relaxed mb-5">
                Seit Jahren bauen wir Schweißtische, die halten. Nicht weil wir
                es müssen, sondern weil wir es können. Jeder Tisch verlässt
                unsere Werkstatt in Loiching mit dem Wissen, dass er gut ist.
                Das ist nicht Arroganz. Das ist Handwerk.
              </p>
              <p className="text-carbon/70 text-base leading-relaxed mb-8">
                Wir arbeiten ohne anonyme Lieferketten und ohne Kompromisse beim
                Material. Was wir nicht selbst überprüfen können, verlässt
                unsere Werkstatt nicht. So war es immer, so wird es bleiben.
              </p>
              <blockquote className="border-l-4 border-plasma pl-5 py-2 mb-8">
                <p className="text-plasma text-lg md:text-xl font-bold italic leading-snug">
                  &ldquo;Ich kenne jeden Tisch, der hier rausgeht.&rdquo;
                </p>
                <cite className="text-carbon/60 text-sm font-mono mt-2 block not-italic">
                  — Daniel Loihl, Inhaber
                </cite>
              </blockquote>
              <Link
                href="/manufaktur"
                className="inline-flex items-center gap-2 text-carbon font-semibold text-sm border-b-2 border-plasma pb-0.5 w-fit hover:text-plasma transition-colors"
              >
                Zur Manufaktur
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Panel 2: Team ── */}
        <section className="w-screen shrink-0 min-h-screen bg-off-white flex items-center px-6 md:px-10 py-16 md:py-24 lg:py-28 border-b border-[#E0E0E0]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div className="flex flex-col">
              <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-4">
                Das Team
              </p>
              <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tightest mb-6">
                Handwerk braucht Gesichter.
              </h2>
              <p className="text-carbon/60 text-base leading-relaxed mb-5">
                Hinter jedem Loihl-Tisch steckt ein kleines, eingespieltes Team
                aus Loiching. Kein Callcenter, keine anonyme Produktion —
                jeder, der hier arbeitet, kennt das Produkt von der ersten
                Schweißnaht bis zur Auslieferung.
              </p>
              <p className="text-carbon/60 text-base leading-relaxed mb-8">
                Daniel Loihl führt das Unternehmen persönlich und ist direkt
                erreichbar. Fragen zu Maßen, Material oder Liefertermin
                beantwortet er selbst — nicht sein Assistent.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-plasma text-3xl font-bold tracking-tightest">15+</p>
                  <p className="text-carbon/50 text-sm font-mono uppercase tracking-widest mt-1">
                    Jahre Erfahrung
                  </p>
                </div>
                <div>
                  <p className="text-plasma text-3xl font-bold tracking-tightest">100%</p>
                  <p className="text-carbon/50 text-sm font-mono uppercase tracking-widest mt-1">
                    Made in Bayern
                  </p>
                </div>
              </div>

              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 text-carbon font-semibold text-sm border-b-2 border-plasma pb-0.5 w-fit hover:text-plasma transition-colors"
              >
                Daniel direkt kontaktieren
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Bild */}
            <div className="relative">
              <div className="aspect-[4/5] md:aspect-[3/4] relative overflow-hidden bg-gray-200">
                <Image
                  src="/images/team-werkstatt.jpg"
                  alt="Team Loihl Werkstatt Loiching"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-plasma hidden md:block" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
