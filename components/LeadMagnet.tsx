"use client";

import { useState } from "react";

export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="bg-off-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left — Form */}
        <div className="flex flex-col">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-4">
            Katalog 2026
          </p>
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tightest mb-4">
            Hol dir den Loihl-Katalog 2026
          </h2>
          <p className="text-carbon/70 text-base leading-relaxed mb-8">
            28 Seiten. Alle Modelle, Maße und Preise auf einen Blick.
            Kostenlos.
          </p>

          {submitted ? (
            <div className="border-l-4 border-plasma pl-5 py-4 bg-plasma/5">
              <p className="text-carbon font-semibold">
                Katalog wird versendet!
              </p>
              <p className="text-carbon/60 text-sm mt-1">
                Bitte prüfen Sie Ihren Posteingang (auch Spam).
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ihre E-Mail-Adresse"
                className="flex-1 bg-white border border-gray-300 px-4 py-3 text-carbon text-sm placeholder:text-gray-400 focus:outline-none focus:border-plasma"
              />
              <button
                type="submit"
                className="bg-plasma text-white font-semibold px-6 py-3 text-sm hover:bg-plasma/90 transition-colors whitespace-nowrap shrink-0"
              >
                Katalog herunterladen
              </button>
            </form>
          )}

          <p className="text-carbon/40 text-xs mt-3 font-mono">
            Kein Spam. Nur der Katalog.
          </p>
        </div>

        {/* Right — PDF Mockup Placeholder */}
        <div className="relative flex items-center justify-center">
          <div className="w-full max-w-xs mx-auto">
            {/* Stacked pages effect */}
            <div className="absolute top-3 left-3 right-3 bottom-0 bg-gray-300 border border-gray-400" />
            <div className="absolute top-1.5 left-1.5 right-1.5 bottom-0 bg-gray-200 border border-gray-300" />
            <div className="relative aspect-[3/4] bg-white border border-gray-300 flex flex-col items-center justify-center gap-4 shadow-md">
              <svg
                className="w-12 h-12 text-red-500/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="15" y2="17" />
              </svg>
              <div className="text-center px-6">
                <p className="text-carbon font-bold text-sm tracking-tight">
                  LOIHL KATALOG 2026
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Schweißtische & Spanntische
                </p>
              </div>
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="text-gray-400 text-xs font-mono">28 Seiten · PDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
