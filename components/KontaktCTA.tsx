"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function KontaktCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Left column slides in from left
      gsap.from(".kct-left", {
        x: -50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
      });

      // Right column slides in from right
      gsap.from(".kct-right", {
        x: 50,
        opacity: 0,
        duration: 0.9,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
      });

      // Contact items stagger up
      gsap.from(".kct-item", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".kct-left", start: "top 80%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28 border-t border-carbon/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

          {/* Left — Daniel Photo + Identity + Contact */}
          <div className="kct-left flex flex-col items-start gap-6">
            {/* Logo */}
            <div className="kct-item w-32 h-32 md:w-40 md:h-40 overflow-hidden border border-carbon/10 bg-white flex items-center justify-center p-3">
              <img
                src="/images/logo-loihl.png"
                alt="Loihl Metall- und Systembau Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="kct-item">
              <p className="text-carbon font-bold text-lg">Daniel Loihl</p>
              <p className="text-carbon/60 text-sm font-mono">Inhaber</p>
            </div>

            {/* Headline */}
            <div className="kct-item">
              <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">
                Kontakt
              </p>
              <h2 className="text-carbon text-3xl md:text-4xl font-bold leading-tight tracking-tightest">
                Sprechen Sie direkt mit Daniel.
              </h2>
              <p className="text-carbon/60 text-base mt-4 leading-relaxed">
                Fragen, Sonderwünsche, Konfigurationshilfe — Daniel Loihl
                antwortet persönlich. Kein Callcenter.
              </p>
            </div>

            {/* Contact info */}
            <div className="kct-item flex flex-col gap-4 w-full">
              <div>
                <p className="text-carbon/60 text-xs font-mono uppercase tracking-wider mb-1">
                  Telefon
                </p>
                <a
                  href="tel:+4917643444600"
                  className="text-carbon font-mono text-2xl md:text-3xl font-bold hover:text-plasma transition-colors duration-200"
                >
                  0176 43444600
                </a>
              </div>
              <div>
                <p className="text-carbon/60 text-xs font-mono uppercase tracking-wider mb-1">
                  E-Mail
                </p>
                <a
                  href="mailto:kontakt@loihl-metallbau.de"
                  className="text-carbon/60 text-base hover:text-plasma transition-colors duration-200 font-mono"
                >
                  kontakt@loihl-metallbau.de
                </a>
              </div>
            </div>

            <a
              href="tel:+4917643444600"
              className="kct-item bg-plasma text-white font-semibold px-8 py-4 text-base
                         hover:bg-plasma/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-6px_rgba(31,169,217,0.5)]"
            >
              Jetzt anrufen
            </a>
          </div>

          {/* Right — Google Maps */}
          <div className="kct-right flex flex-col gap-4">
            <div className="flex-1 min-h-[320px] md:min-h-[440px] overflow-hidden border border-carbon/10">
              <iframe
                src="https://maps.google.com/maps?q=Hangweg+5a,84180+Loiching,Bayern,Germany&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "440px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Metallbau Loihl Standort"
              />
            </div>
            <div className="flex items-center gap-2 text-carbon/60 text-sm">
              <svg className="w-4 h-4 text-carbon/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Hangweg 5a · 84180 Loiching · Bayern</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
