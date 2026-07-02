"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const features = [
  {
    title: "Gefertigt in Loiching",
    body: "Jeder Schweißtisch entsteht in unserer Werkstatt — handgefertigt, vermessen, geprüft. Keine anonymen Zulieferketten, kein Outsourcing. Was unsere Werkstatt verlässt, haben wir selbst gebaut.",
    image: "/images/phi-gefertigt.jpg",
  },
  {
    title: "Material ohne Kompromisse",
    body: "Wir verwenden ausschließlich S235 und S355 Baustahl — präzise gelagert, plan gefräst, mit engen Toleranzen verarbeitet. Das Ergebnis: Tische, die auch nach Jahren noch den gleichen Standhalten.",
    image: "/images/phi-material.jpg",
  },
  {
    title: "Direkt beim Hersteller",
    body: "Daniel Loihl beantwortet Ihre Fragen persönlich. Kein Callcenter, keine Vertriebsstufe dazwischen. Von der Konfiguration bis zur Lieferung haben Sie einen Ansprechpartner.",
    image: "/images/phi-direkt.jpg",
  },
  {
    title: "Maßanfertigung ohne Aufpreis-Wahnsinn",
    body: "Konfigurieren Sie Größe, Lochsystem und Material nach Ihren Anforderungen — zum fairen Preis.",
    image: "/images/phi-massanfertigung.jpg",
  },
];

export default function PhilosophieSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      gsap.from(".phi-eyebrow", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".phi-heading-area", start: "top 82%" },
      });

      gsap.from(".phi-heading-inner", {
        y: "110%",
        stagger: 0.12,
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: { trigger: ".phi-heading-area", start: "top 82%" },
      });

      gsap.utils.toArray<HTMLElement>(".phi-card", sectionRef.current!).forEach((card, i) => {
        const img     = card.querySelector<HTMLElement>(".phi-card-img");
        const content = card.querySelector<HTMLElement>(".phi-card-content");
        const line    = card.querySelector<HTMLElement>(".phi-card-line");

        const fromLeft = i % 2 === 0;
        const clipFrom = fromLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
        const xDrift   = fromLeft ? -7 : 7;
        const xContent = fromLeft ? -30 : 30;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 84%" },
        });

        tl.from(card, { clipPath: clipFrom, duration: 1.25, ease: "power3.inOut" }, 0);

        if (img)     tl.from(img,     { xPercent: xDrift, duration: 1.9, ease: "power2.out" }, 0);
        if (line)    tl.from(line,    { scaleY: 0, transformOrigin: "top center", duration: 0.6, ease: "power3.out" }, 0.4);
        if (content) tl.from(content, { x: xContent, opacity: 0, duration: 0.75, ease: "power3.out" }, 0.55);

        if (img) {
          gsap.to(img, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      });

      gsap.from(".phi-cta", {
        y: 20,
        opacity: 0,
        stagger: 0.12,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: { trigger: ".phi-cta-row", start: "top 88%" },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white px-[5%] py-16 md:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="phi-heading-area mb-14 max-w-2xl md:mb-18">
          <p className="phi-eyebrow mb-4 text-xs font-mono font-semibold uppercase tracking-[0.25em] text-plasma">
            Unser Anspruch
          </p>
          <h2
            className="font-bold leading-[1.05] tracking-tightest text-carbon"
            style={{ fontSize: "clamp(2.4rem, 4.5vw, 4.5rem)", fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            <span className="block" style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
              <span className="phi-heading-inner block">Wie wir fertigen.</span>
            </span>
            <span className="block" style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
              <span className="phi-heading-inner block">
                <em className="font-light not-italic text-carbon/40">
                  Wie wir denken.
                </em>
              </span>
            </span>
          </h2>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3">
          {features.map((f, i) => {
            const isEven = i % 2 === 0;
            const num = String(i + 1).padStart(2, "0");

            return (
              <div
                key={f.title}
                className="phi-card group relative overflow-hidden"
                style={{ height: "clamp(280px, 48vh, 520px)" }}
              >
                <img
                  src={f.image}
                  alt={f.title}
                  className="phi-card-img absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                  style={{ willChange: "transform" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    isEven ? "from-black/55 to-transparent" : "from-transparent to-black/55"
                  }`}
                />

                {/* Ghost number */}
                <div
                  className="pointer-events-none absolute top-4 font-bold leading-none text-white/5 select-none"
                  style={{
                    fontSize: "clamp(5rem, 14vw, 12rem)",
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    right: isEven ? "2rem" : "auto",
                    left: isEven ? "auto" : "2rem",
                  }}
                  aria-hidden="true"
                >
                  {num}
                </div>

                <div
                  className={`phi-card-content absolute bottom-0 ${isEven ? "left-0" : "right-0"} p-8 md:p-12 max-w-xl`}
                >
                  <div className="phi-card-line mb-4 h-px w-8 bg-plasma" />
                  <h3
                    className="mb-3 font-bold leading-tight tracking-tightest text-off-white"
                    style={{
                      fontSize: "clamp(1.5rem, 2.8vw, 2.4rem)",
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-off-white/60 md:text-base">
                    {f.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="phi-cta-row mt-12 flex flex-wrap items-center gap-6 md:mt-16">
          <a
            href="/schweißtische"
            className="phi-cta inline-flex items-center bg-plasma px-8 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-carbon transition-opacity duration-200 hover:opacity-85 font-mono"
          >
            Produkte entdecken
          </a>
          <a
            href="/manufaktur"
            className="phi-cta inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.1em] text-carbon/50 transition-colors duration-200 hover:text-carbon font-mono"
          >
            Zur Manufaktur
            <span className="text-plasma">→</span>
          </a>
        </div>

      </div>
    </section>
  );
}
