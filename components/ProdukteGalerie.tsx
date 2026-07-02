"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const produkte = [
  {
    id: "01",
    image: "/images/product-schweisstische.jpg",
    title: "Schweißtische",
    category: "System 16 · Stärke 8 mm · S235/S355",
    href: "/schweißtische",
  },
  {
    id: "02",
    image: "/images/product-spanntische.jpg",
    title: "Spanntische",
    category: "Modular · T-Nutensystem · konfigurierbar",
    href: "/spanntische",
  },
  {
    id: "03",
    image: "/images/product-zubehoer.jpg",
    title: "Zubehör & Komponenten",
    category: "Spanner · Anschläge · Aufnahmen",
    href: "/zubehör",
  },
];

export default function ProdukteGalerie() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      gsap.from(".pg-eyebrow", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pg-heading-area", start: "top 82%" },
      });

      gsap.from(".pg-heading-inner", {
        y: "110%",
        stagger: 0.12,
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pg-heading-area", start: "top 82%" },
      });

      gsap.utils.toArray<HTMLElement>(".pg-row", sectionRef.current!).forEach((row, i) => {
        const card     = row.querySelector<HTMLElement>(".pg-card");
        const img      = row.querySelector<HTMLElement>(".pg-card-img");
        const content  = row.querySelector<HTMLElement>(".pg-card-content");
        const line     = row.querySelector<HTMLElement>(".pg-card-line");
        const numPanel = row.querySelector<HTMLElement>(".pg-num-panel");

        const fromRight = i % 2 === 0;
        const clipFrom  = fromRight ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
        const xDrift    = fromRight ? 7 : -7;
        const xNumber   = fromRight ? -40 : 40;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 82%" },
        });

        if (card)     tl.from(card,     { clipPath: clipFrom, duration: 1.25, ease: "power3.inOut" }, 0);
        if (img)      tl.from(img,      { xPercent: xDrift, scale: 1.14, duration: 1.85, ease: "power2.out" }, 0);
        if (line)     tl.from(line,     { scaleY: 0, transformOrigin: "top center", duration: 0.6, ease: "power3.out" }, 0.4);
        if (content)  tl.from(content,  { y: 24, opacity: 0, duration: 0.75, ease: "power3.out" }, 0.55);
        if (numPanel) tl.from(numPanel, { x: xNumber, opacity: 0, duration: 1.1, ease: "power3.out" }, 0.3);

        if (img) {
          gsap.to(img, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      });

      gsap.from(".pg-cta", {
        y: 20,
        opacity: 0,
        stagger: 0.12,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pg-cta-row", start: "top 88%" },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white px-[5%] py-16 md:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="pg-heading-area mb-14 max-w-2xl md:mb-18">
          <p className="pg-eyebrow mb-4 text-xs font-mono font-semibold uppercase tracking-[0.25em] text-plasma">
            Produkte
          </p>
          <h2
            className="font-bold leading-[1.05] tracking-tightest text-carbon"
            style={{ fontSize: "clamp(2.4rem, 4.5vw, 4.5rem)", fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            <span className="block" style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
              <span className="pg-heading-inner block">Ausgewählte</span>
            </span>
            <span className="block" style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
              <span className="pg-heading-inner block">
                <em className="font-light not-italic text-carbon/40">
                  Produkte.
                </em>
              </span>
            </span>
          </h2>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-16 md:gap-24">
          {produkte.map((p, i) => {
            const fromRight = i % 2 === 0;

            return (
              <div
                key={p.id}
                className={`pg-row grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 ${
                  fromRight ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                {/* Image card */}
                <a href={p.href} className="pg-card group relative w-full overflow-hidden block" style={{ aspectRatio: "1 / 1" }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    className="pg-card-img absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                    style={{ willChange: "transform" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon/75 via-carbon/10 to-transparent" />

                  <div className="pg-card-content absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="pg-card-line mb-3 h-px w-8 bg-plasma" />
                    <h3
                      className="font-bold leading-tight tracking-tightest text-off-white"
                      style={{
                        fontSize: "clamp(1.25rem, 2.2vw, 2rem)",
                        fontFamily: "var(--font-inter), Inter, sans-serif",
                      }}
                    >
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-off-white/65 font-mono">
                      {p.category}
                    </p>
                  </div>
                </a>

                {/* Number panel */}
                <div className="pg-num-panel flex items-center justify-center">
                  <span
                    className="font-bold leading-none tracking-tightest text-carbon/8 select-none"
                    style={{
                      fontSize: "clamp(8rem, 18vw, 18rem)",
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                    }}
                    aria-hidden="true"
                  >
                    {p.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="pg-cta-row mt-12 flex flex-wrap items-center gap-6 md:mt-16">
          <a
            href="/#konfigurator"
            className="pg-cta inline-flex items-center bg-carbon px-8 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-off-white transition-opacity duration-200 hover:opacity-80 font-mono"
          >
            Tisch konfigurieren
          </a>
          <a
            href="/kontakt"
            className="pg-cta inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.1em] text-carbon/50 transition-colors duration-200 hover:text-carbon font-mono"
          >
            Anfrage stellen
            <span className="text-plasma">→</span>
          </a>
        </div>

      </div>
    </section>
  );
}
