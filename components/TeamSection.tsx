"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const daniel = {
  num: "01",
  name: "Daniel Loihl",
  title: "Inhaber",
  role: "Geschäftsführer",
  email: "info@metallbau-loihl.de",
  bio: "Daniel Loihl kennt jeden Tisch, der seine Werkstatt verlässt. Als Inhaber und gelernter Metallbauer steht er für Schweißtische, die halten — gefertigt in Loiching, geprüft nach eigenen Maßstäben. Kein Callcenter, kein Vermittler. Direkte Kommunikation, handwerkliche Verantwortung.",
  facts: [
    { label: "Standort", value: "Loiching, Bayern" },
    { label: "Schwerpunkt", value: "Schweißtische & Spanntische" },
    { label: "Prinzip", value: "Jeder Tisch persönlich geprüft" },
  ],
};

function TextPanel({ person }: { person: typeof daniel }) {
  return (
    <div className="flex h-full flex-col justify-center px-6 py-16 md:px-16 md:py-0 lg:px-20">
      <p className="team-item mb-4 text-xs font-mono font-semibold uppercase tracking-[0.3em] text-plasma">
        {person.num} · Über uns
      </p>
      <h2
        className="team-item mb-2 font-bold leading-tight tracking-tightest text-off-white"
        style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)", fontFamily: "var(--font-inter), Inter, sans-serif" }}
      >
        {person.name}
      </h2>
      <p className="team-item mb-8 text-sm uppercase tracking-[0.15em] text-off-white/40 font-mono">
        {person.title} · {person.role}
      </p>
      <div className="team-line mb-8 h-px w-12 bg-plasma/40" />
      <p className="team-item mb-10 max-w-md text-sm leading-relaxed text-off-white/55 md:text-base"
         style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>
        {person.bio}
      </p>
      <div className="mb-10 space-y-4">
        {person.facts.map((f) => (
          <div key={f.label} className="team-item flex items-baseline gap-4">
            <span className="w-28 shrink-0 text-xs font-mono font-semibold uppercase tracking-[0.15em] text-plasma/70">
              {f.label}
            </span>
            <span className="text-sm text-off-white/70"
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>
              {f.value}
            </span>
          </div>
        ))}
      </div>
      <a
        href={`mailto:${person.email}`}
        className="team-item inline-flex items-center gap-2 text-xs text-off-white/30 transition-colors duration-200 hover:text-plasma font-mono"
      >
        {person.email}
      </a>
    </div>
  );
}

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
        defaults: { force3D: true },
      });

      tl.from(".team-item", {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.09,
        }, 0)
        .from(".team-line", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.6,
          ease: "power3.inOut",
        }, 0.25)
        .from(".team-logo-panel", {
          clipPath: "inset(0 0 0 100%)",
          duration: 1.1,
          ease: "power3.inOut",
        }, 0)
        .from(".team-logo", {
          scale: 1.12,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        }, 0.45);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full overflow-hidden bg-carbon">
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="flex w-full md:w-1/2">
          <TextPanel person={daniel} />
        </div>
        <div className="team-logo-panel flex w-full items-center justify-center bg-white px-8 py-16 md:w-1/2 md:py-0">
          <img
            src="/images/logo-loihl.png"
            alt="Loihl Metall- und Systembau Logo"
            className="team-logo w-full max-w-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}
