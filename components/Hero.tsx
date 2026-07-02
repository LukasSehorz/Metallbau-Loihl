"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Seek to second-to-last second, then play immediately
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const seekAndPlay = () => {
      video.currentTime = Math.max(0, video.duration - 5);
      video.play().catch(() => {});
    };
    if (video.readyState >= 1) {
      seekAndPlay();
    } else {
      video.addEventListener("loadedmetadata", seekAndPlay, { once: true });
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/hero-video.mp4"
        muted
        loop
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Linkes Vignette-Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent z-10 pointer-events-none" />

      {/* Akzentlinie oben */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10 z-20" />

      {/* Text-Content */}
      <div className="relative z-20 w-full px-6 md:px-10 lg:px-[10%] py-24">
        <div className="max-w-4xl flex flex-col">

          {/* Eyebrow */}
          <p className="text-plasma text-xs font-mono uppercase tracking-[0.2em] mb-6">
            Loihl Metall- und Systembau · Made in Loiching
          </p>

          {/* H1 */}
          <h1 className="text-[2.75rem] md:text-6xl lg:text-6xl xl:text-7xl font-bold leading-[1.02] tracking-tightest text-off-white mb-6 md:mb-8">
            Schweißtische aus Bayern.<br />Präzise.<br />Höchste Qualität.
          </h1>

          {/* Sub */}
          <p className="text-gray-mid text-base md:text-lg lg:text-xl leading-relaxed mb-8 md:mb-10 max-w-lg">
            Schweiß- und Spanntische aus bayerischer Manufaktur.
            Konfigurierbar. Lieferbar in 2–4 Wochen.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-8 md:mb-10">
            <Link
              href="/#konfigurator"
              className="bg-plasma text-white font-semibold px-7 py-3.5 text-base hover:bg-plasma/90 transition-colors"
            >
              Konfigurator starten
            </Link>
            <Link
              href="/kontakt"
              className="border border-off-white/30 text-off-white font-semibold px-7 py-3.5 text-base hover:border-off-white/60 transition-colors"
            >
              Termin vereinbaren
            </Link>
          </div>

          {/* Trust */}
          <p className="text-gray-mid text-sm font-mono">
            <span className="text-plasma">★★★★★</span> 4.9 · 20+ Google
            Reviews · Made in Loiching, Bayern
          </p>
        </div>
      </div>

      {/* Unteres Fade für Übergang zur nächsten Section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-carbon to-transparent z-10 pointer-events-none" />
    </section>
  );
}
