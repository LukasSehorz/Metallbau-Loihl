"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const reviews = [
  {
    stars: 5,
    text: "Mega Produkte die jederzeit mit Demmler oder Siegmund mithalten können! Qualität top, Preis fair — und man bekommt genau das, was besprochen wurde.",
    author: "Stahlkunst Wallner",
    role: "Metallbau-Werkstatt",
    date: "März 2025",
  },
  {
    stars: 5,
    text: "Sehr hohe Qualität und top Verarbeitung. Das Preis/Leistungsverhältnis ist unschlagbar. Wer einen professionellen Schweißtisch sucht, ist bei Loihl genau richtig.",
    author: "Gabi Koelbl",
    role: "Kundin",
    date: "Januar 2025",
  },
  {
    stars: 5,
    text: "Freundliche und kompetente Fachberatung. Qualitativ hochwertige Fertigung made in Bayern. Lieferung pünktlich, Aufbau problemlos. Klare Weiterempfehlung.",
    author: "Jonas Maier",
    role: "Kunde",
    date: "Februar 2025",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-plasma" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading + rating fade up
      gsap.from(".tmn-heading", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".tmn-header", start: "top 85%", once: true },
      });
      gsap.from(".tmn-rating", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        delay: 0.2,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".tmn-header", start: "top 85%", once: true },
      });

      // Cards stagger in from below
      gsap.from(".tmn-card", {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".tmn-grid", start: "top 88%", once: true },
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
        {/* Header */}
        <div className="tmn-header mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="tmn-heading">
            <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">
              Kundenstimmen
            </p>
            <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest">
              Was Kunden sagen.
            </h2>
          </div>
          <p className="tmn-rating text-carbon/60 text-sm font-mono">
            <span className="text-plasma">★★★★★</span> 5,0 / 5 — Google Rezensionen
          </p>
        </div>

        {/* Cards */}
        <div className="tmn-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.author}
              className="tmn-card group flex flex-col bg-white border border-carbon/10 p-6 md:p-8
                         transition-all duration-300 ease-out
                         hover:-translate-y-1.5 hover:border-plasma/40 hover:shadow-[0_8px_32px_-8px_rgba(31,169,217,0.18)]
                         cursor-default"
            >
              <Stars count={review.stars} />

              <blockquote className="mt-5 text-carbon/80 text-base leading-relaxed flex-1 transition-colors duration-300 group-hover:text-carbon">
                &ldquo;{review.text}&rdquo;
              </blockquote>

              <div className="mt-6 pt-6 border-t border-carbon/10 flex items-center gap-4">
                <div className="w-10 h-10 bg-carbon/10 border border-carbon/10 flex items-center justify-center shrink-0
                                transition-colors duration-300 group-hover:bg-plasma/10 group-hover:border-plasma/20">
                  <svg className="w-5 h-5 text-carbon/60 transition-colors duration-300 group-hover:text-plasma/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth={1.5} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-carbon text-sm font-semibold">{review.author}</p>
                  <p className="text-carbon/60 text-xs">{review.role} · {review.date}</p>
                </div>
              </div>

              {/* Plasma accent line at bottom on hover */}
              <div className="mt-4 h-px w-0 bg-plasma transition-all duration-500 ease-out group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
