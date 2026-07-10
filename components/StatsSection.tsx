"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { value: "350+", label: "Tische ausgeliefert",      num: 350, suffix: "+" },
  { value: "100%", label: "Gefertigt in Deutschland", num: 100, suffix: "%" },
  { value: "2",    label: "Wochen Lieferzeit",        num: 2,   suffix: "" },
  { value: "10+",  label: "Jahre Erfahrung",           num: 10,  suffix: "+" },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      gsap.set(".s17-content", { opacity: 0, y: 50 });
      gsap.set(".s17-bg-img",  { scale: 1.18 });
      gsap.set(".s17-overlay", { opacity: 0.15 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=180%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Bild öffnet sich vom kleinen Kasten auf Vollbild
      tl.fromTo(".s17-bg-clip",
        { clipPath: "inset(18% 22% 18% 22%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.55 },
        0
      );

      tl.to(".s17-bg-img",
        { scale: 1, ease: "power2.out", duration: 0.55 },
        0
      );

      // Phase 2: Dunkles Overlay für Textsichtbarkeit
      tl.to(".s17-overlay",
        { opacity: 0.75, ease: "power2.inOut", duration: 0.15 },
        0.5
      );

      // Phase 3: Inhalt fährt hoch
      tl.to(".s17-content",
        { opacity: 1, y: 0, ease: "power3.out", duration: 0.23 },
        0.62
      );

      // Phase 3: Zähler ticken hoch
      const numEls = gsap.utils.toArray<HTMLElement>(".s17-num", sectionRef.current!);
      numEls.forEach((el, i) => {
        const stat = stats[i];
        // "2–4" hat keinen sinnvollen Counter-Wert → direkt setzen
        if (stat.suffix === "" && stat.num === 4) {
          tl.to({}, { duration: 0.28 }, 0.7 + i * 0.04);
          tl.call(() => { el.textContent = stat.value; }, [], 0.7 + i * 0.04);
          return;
        }
        const obj = { val: 0 };
        tl.to(obj, {
          val: stat.num,
          ease: "power2.out",
          duration: 0.28,
          onUpdate() {
            el.textContent = Math.round(obj.val) + stat.suffix;
          },
        }, 0.7 + i * 0.04);
      });

      // Phase 3: Plasma-Bordüren fahren herunter
      tl.fromTo(".s17-item-border",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          stagger: 0.04,
          ease: "power3.out",
          duration: 0.18,
        },
        0.7
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white"
      style={{ height: "100vh" }}
    >
      {/* Hintergrundbild mit Clip-Path-Animation */}
      <div className="s17-bg-clip absolute inset-0 z-0">
        <img
          src="/images/werkstatt-interior.jpg"
          alt="Werkstatt Metallbau Loihl"
          className="s17-bg-img absolute inset-0 size-full object-cover"
          style={{ willChange: "transform" }}
        />
        <div className="s17-overlay absolute inset-0 bg-carbon" />
      </div>

      {/* Inhalt */}
      <div className="relative z-10 flex h-full items-center px-[5%] py-16 md:py-24 lg:py-28">
        <div className="s17-content max-w-7xl mx-auto w-full grid grid-cols-1 items-center gap-y-12 lg:grid-cols-2 lg:gap-x-20">

          {/* Links: Heading */}
          <div>
            <p className="mb-3 text-xs font-mono font-semibold uppercase tracking-[0.2em] text-plasma md:mb-4">
              Unsere Zahlen
            </p>
            <h2
              className="mb-5 font-bold leading-tight tracking-tightest text-off-white md:mb-6"
              style={{
                fontSize: "clamp(3rem, 7vw, 6rem)",
                fontFamily: "var(--font-inter), Inter, sans-serif",
              }}
            >
              Qualität,<br />die überzeugt.
            </h2>
            <p className="text-base text-off-white/65 md:text-lg" style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>
              Präzisionsgefertigt in Loiching. Jeder Tisch persönlich geprüft.
            </p>
            <div className="mt-8">
              <a
                href="/schweißtische"
                className="inline-flex items-center gap-3 border border-off-white/25 px-7 py-3 text-sm font-semibold tracking-wide text-off-white font-mono transition-all duration-200 hover:border-plasma hover:text-plasma"
              >
                Produkte entdecken
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Rechts: Stats Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-2 md:gap-x-12 md:gap-y-12">
            {stats.map((stat) => (
              <div key={stat.label} className="relative pl-6">
                <div className="s17-item-border absolute left-0 top-0 h-full w-0.5 bg-plasma" />
                <p
                  className="s17-num mb-2 font-bold leading-tight text-off-white"
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                  }}
                >
                  {stat.value}
                </p>
                <p className="text-sm font-mono font-medium text-off-white/60 md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
