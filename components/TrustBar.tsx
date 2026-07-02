"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const logos = [
  {
    name: "Stahlkunst Wallner",
    svg: (
      <svg width="160" height="48" viewBox="0 0 160 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Raute-Mark in Stahl-Blau */}
        <polygon points="24,2 44,24 24,46 4,24" fill="#1A56A0"/>
        <text x="24" y="29" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="800" fontSize="13" fill="white">SW</text>
        {/* Wordmark */}
        <text x="56" y="20" fontFamily="Inter,sans-serif" fontWeight="800" fontSize="11" fill="#1A56A0" letterSpacing="0.5">STAHLKUNST</text>
        <line x1="56" y1="25" x2="155" y2="25" stroke="#1A56A0" strokeWidth="1" opacity="0.3"/>
        <text x="56" y="37" fontFamily="Inter,sans-serif" fontWeight="400" fontSize="10" fill="#374151" letterSpacing="1.5">WALLNER</text>
      </svg>
    ),
  },
  {
    name: "Gabi Koelbl Metallbau",
    svg: (
      <svg width="155" height="48" viewBox="0 0 155 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Kreis-Mark Kupfer/Amber */}
        <circle cx="24" cy="24" r="22" fill="#B45309"/>
        <circle cx="24" cy="24" r="17" fill="none" stroke="#FCD34D" strokeWidth="1.5"/>
        <text x="24" y="29" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="900" fontSize="13" fill="white">GK</text>
        {/* Wordmark */}
        <text x="58" y="18" fontFamily="Inter,sans-serif" fontWeight="700" fontSize="12" fill="#92400E">Koelbl</text>
        <text x="58" y="32" fontFamily="Inter,sans-serif" fontWeight="400" fontSize="9" fill="#6B7280" letterSpacing="2">METALLBAU</text>
        <line x1="58" y1="38" x2="150" y2="38" stroke="#FCD34D" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    name: "Jonas Maier Werkstatt",
    svg: (
      <svg width="148" height="48" viewBox="0 0 148 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hexagon-Mark Grün */}
        <polygon points="24,2 42,12 42,36 24,46 6,36 6,12" fill="#065F46"/>
        <text x="24" y="29" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="900" fontSize="12" fill="#6EE7B7">JM</text>
        {/* Wordmark */}
        <text x="54" y="19" fontFamily="Inter,sans-serif" fontWeight="800" fontSize="11" fill="#065F46">Jonas Maier</text>
        <rect x="54" y="25" width="86" height="1.5" fill="#6EE7B7"/>
        <text x="54" y="37" fontFamily="Inter,sans-serif" fontWeight="400" fontSize="8.5" fill="#374151" letterSpacing="2.5">WERKSTATT</text>
      </svg>
    ),
  },
  {
    name: "Industriebetrieb AG",
    svg: (
      <svg width="152" height="48" viewBox="0 0 152 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Rechteck-Mark Navy */}
        <rect width="44" height="44" x="2" y="2" fill="#1E3A5F"/>
        <text x="24" y="21" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="900" fontSize="11" fill="#93C5FD" letterSpacing="1">INDUST</text>
        <line x1="8" y1="26" x2="40" y2="26" stroke="#3B82F6" strokeWidth="0.75"/>
        <text x="24" y="38" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="900" fontSize="11" fill="white" letterSpacing="1">BETRIEB</text>
        {/* Wordmark */}
        <text x="58" y="22" fontFamily="Inter,sans-serif" fontWeight="900" fontSize="16" fill="#1E3A5F">AG</text>
        <line x1="58" y1="27" x2="148" y2="27" stroke="#3B82F6" strokeWidth="1"/>
        <text x="58" y="39" fontFamily="Inter,sans-serif" fontWeight="400" fontSize="8" fill="#6B7280" letterSpacing="2">INDUSTRIEBETRIEB</text>
      </svg>
    ),
  },
  {
    name: "Kunstschmiede Bayern",
    svg: (
      <svg width="158" height="48" viewBox="0 0 158 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Schild-Mark Bayern Rot/Gold */}
        <path d="M24 2 L42 10 L42 28 Q42 42 24 46 Q6 42 6 28 L6 10 Z" fill="#991B1B"/>
        <path d="M24 8 L36 14 L36 28 Q36 38 24 42 Q12 38 12 28 L12 14 Z" fill="none" stroke="#FDE68A" strokeWidth="1"/>
        <text x="24" y="30" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="900" fontSize="12" fill="#FDE68A">KB</text>
        {/* Wordmark */}
        <text x="54" y="19" fontFamily="Inter,sans-serif" fontWeight="700" fontSize="10.5" fill="#991B1B">Kunstschmiede</text>
        <text x="54" y="32" fontFamily="Inter,sans-serif" fontWeight="900" fontSize="12" fill="#7C2D12" letterSpacing="3">BAYERN</text>
        <line x1="54" y1="38" x2="155" y2="38" stroke="#FDE68A" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    name: "Profi Schweißtechnik",
    svg: (
      <svg width="150" height="48" viewBox="0 0 150 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Flammen-/Schweiss-Mark Orange */}
        <rect x="2" y="2" width="44" height="44" fill="#EA580C"/>
        <rect x="2" y="2" width="44" height="3" fill="#FB923C"/>
        <text x="24" y="25" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="900" fontSize="15" fill="white" letterSpacing="-0.5">PST</text>
        <text x="24" y="38" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="400" fontSize="7" fill="#FED7AA" letterSpacing="1">PROFI</text>
        {/* Wordmark */}
        <text x="58" y="20" fontFamily="Inter,sans-serif" fontWeight="900" fontSize="12" fill="#EA580C">Schweißtechnik</text>
        <rect x="58" y="24" width="3" height="16" fill="#EA580C"/>
        <text x="65" y="34" fontFamily="Inter,sans-serif" fontWeight="400" fontSize="9" fill="#374151">Profi-Lösungen</text>
        <text x="65" y="44" fontFamily="Inter,sans-serif" fontWeight="400" fontSize="8" fill="#9CA3AF">seit 1998</text>
      </svg>
    ),
  },
  {
    name: "Metallbau Reiter",
    svg: (
      <svg width="145" height="48" viewBox="0 0 145 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Balken-Mark Teal */}
        <rect x="2" y="8" width="6" height="32" fill="#0E7490"/>
        <rect x="12" y="2" width="6" height="44" fill="#0E7490"/>
        <rect x="22" y="8" width="6" height="32" fill="#0E7490"/>
        {/* Wordmark */}
        <text x="42" y="20" fontFamily="Inter,sans-serif" fontWeight="900" fontSize="14" fill="#0E7490" letterSpacing="-0.5">REITER</text>
        <line x1="42" y1="25" x2="140" y2="25" stroke="#67E8F9" strokeWidth="1.5"/>
        <text x="42" y="37" fontFamily="Inter,sans-serif" fontWeight="400" fontSize="8.5" fill="#374151" letterSpacing="1.5">METALLBAU</text>
      </svg>
    ),
  },
  {
    name: "Technische Werke GmbH",
    svg: (
      <svg width="158" height="48" viewBox="0 0 158 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Zahnrad-ähnlicher Kreis mit Violett */}
        <circle cx="24" cy="24" r="22" fill="#5B21B6"/>
        <circle cx="24" cy="24" r="13" fill="none" stroke="#C4B5FD" strokeWidth="1"/>
        <circle cx="24" cy="24" r="5" fill="#C4B5FD"/>
        {/* Zacken */}
        {[0,45,90,135,180,225,270,315].map((deg, i) => (
          <line
            key={i}
            x1={24 + 14 * Math.cos((deg * Math.PI) / 180)}
            y1={24 + 14 * Math.sin((deg * Math.PI) / 180)}
            x2={24 + 20 * Math.cos((deg * Math.PI) / 180)}
            y2={24 + 20 * Math.sin((deg * Math.PI) / 180)}
            stroke="#C4B5FD"
            strokeWidth="2.5"
          />
        ))}
        {/* Wordmark */}
        <text x="58" y="19" fontFamily="Inter,sans-serif" fontWeight="700" fontSize="11" fill="#5B21B6">Technische Werke</text>
        <text x="58" y="32" fontFamily="Inter,sans-serif" fontWeight="900" fontSize="12" fill="#3B0764">GmbH</text>
        <line x1="58" y1="38" x2="155" y2="38" stroke="#C4B5FD" strokeWidth="1"/>
      </svg>
    ),
  },
];

export default function TrustBar() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 32,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  const allLogos = [...logos, ...logos];

  return (
    <section className="bg-white py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10">
        <h2 className="text-carbon text-center text-xs md:text-sm font-bold uppercase tracking-widest">
          Werkstätten, Künstler und Industrie schweißen mit Loihl
        </h2>
      </div>

      <div className="relative">
        {/* Fade-Masken links/rechts */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div ref={trackRef} className="flex items-center gap-16 w-max py-2">
            {allLogos.map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                title={logo.name}
              >
                {logo.svg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
