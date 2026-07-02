"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// ── Data ─────────────────────────────────────────────────────────────────────

const milestones = [
  {
    year: "2018",
    title: "Die Gründung",
    desc: "Daniel Loihl gründet Loihl Metall- und Systembau in Loiching, Bayern. Das Ziel: Schweißtische direkt vom Hersteller – ohne Zwischenhändler, ohne Kompromisse.",
    detail: "Aus einer kleinen Werkstatt in Niederbayern entsteht ein Betrieb, der von Anfang an auf persönliche Betreuung und handwerkliche Qualität setzt.",
    img: "/images/werkstatt-interior.jpg",
  },
  {
    year: "2020",
    title: "Erste Schweißtische",
    desc: "Die ersten Schweißtische verlassen die Werkstatt. Zuschnitt, Fräsen, Anfasen, Schweißen und Nitrieren – alles in Eigenregie und unter direkter Qualitätskontrolle.",
    detail: "Jeder Schritt des Produktionsprozesses bleibt im Haus. Das ist kein Kostenfaktor, sondern das Fundament der Loihl-Qualität.",
    img: "/images/milestone-2020.jpg",
  },
  {
    year: "2022",
    title: "Wachstum & Sondermaße",
    desc: "Der Maschinenpark wächst. Sondermaße werden zur Selbstverständlichkeit – ohne Aufschlag. Kunden aus ganz Deutschland bestellen direkt beim Hersteller.",
    detail: "Was als Nische begann, wird zur Stärke: flexible Maßanfertigung mit kurzen Lieferzeiten, die große Hersteller nicht bieten können.",
    img: "/images/milestone-2022.jpg",
  },
  {
    year: "Heute",
    title: "Bayerische Manufaktur",
    desc: "Loihl steht für Qualität direkt vom Inhaber. Jeder Tisch wird vor dem Versand persönlich geprüft. 20 Werktage, faire Preise, direkte Kommunikation.",
    detail: "Daniel kennt jeden Tisch, der die Werkstatt verlässt. Dieses Versprechen ist der Kern von Loihl Metall- und Systembau.",
    img: "/images/milestone-heute.jpg",
  },
];

const werte = [
  {
    num: "01",
    title: "Persönlicher Inhaber-Kontakt",
    desc: "Daniel antwortet selbst. Kein Callcenter, keine Vertretung. Direkte Kommunikation vom ersten Angebot bis zur Lieferung.",
  },
  {
    num: "02",
    title: "Maßanfertigung inklusive",
    desc: "Sondermaße sind bei Loihl kein Aufschlag, sondern Standard. Jeder Tisch passt – für jede Werkstatt, jede Anforderung.",
  },
  {
    num: "03",
    title: "20 Werktage Lieferzeit",
    desc: "Keine 8–12 Wochen. Loihl hält, was es verspricht. Lieferzeit dokumentiert – nicht geschätzt.",
  },
  {
    num: "04",
    title: "Nitrierung in Eigenregie",
    desc: "Die Härtebehandlung erfolgt unter eigener Qualitätskontrolle – kein Unterauftrag, kein Qualitätsverlust durch Zwischenschritte.",
  },
  {
    num: "05",
    title: "Ehrliche Preisgestaltung",
    desc: "Material plus Arbeitszeit. Keine versteckten Gebühren, keine Überraschungen auf der Rechnung.",
  },
  {
    num: "06",
    title: "Made in Bayern",
    desc: "Jeder Schweißtisch wird in Loiching gefertigt und vor dem Versand persönlich geprüft. Qualität, die man sieht und fühlt.",
  },
];

const jobs = [
  {
    title: "Metallbauer / Schweißer (m/w/d)",
    type: "Vollzeit",
    location: "Loiching · Niederbayern",
    desc: "Fertigung und Montage von Schweißtischen und Spanntischen. Du arbeitest direkt am Produkt – von der Stahlplatte bis zum versandfertigen Tisch.",
    anforderungen: [
      "Abgeschlossene Ausbildung als Metallbauer oder Schweißer",
      "Erfahrung in MAG-/WIG-Schweißen von Vorteil",
      "Sorgfalt, Präzision und Qualitätsbewusstsein",
      "Teamfähigkeit und Zuverlässigkeit",
    ],
    bieten: [
      "Direkte Zusammenarbeit mit dem Inhaber",
      "Faire und übertarifliche Bezahlung",
      "Moderne Maschinen und Werkzeuge",
      "Abwechslungsreiche Aufgaben, kein Fließbandbetrieb",
    ],
  },
  {
    title: "CNC-Fräser / Maschinenbediener (m/w/d)",
    type: "Vollzeit",
    location: "Loiching · Niederbayern",
    desc: "Bedienung unserer CNC-Fräsmaschinen für das Lochmuster in unseren Schweißtischen. Präzision von Anfang an – jedes Loch sitzt, wo es sein muss.",
    anforderungen: [
      "Erfahrung in CNC-Fräsen oder Bereitschaft zur Einarbeitung",
      "Technisches Verständnis und Genauigkeit",
      "Eigenverantwortliches Arbeiten",
      "Zuverlässigkeit und Teamgeist",
    ],
    bieten: [
      "Sicherer Arbeitsplatz in wachsendem Betrieb",
      "Faire Bezahlung",
      "Moderner Maschinenpark",
      "Kleines Team, kurze Wege, direkte Kommunikation",
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function splitWords(el: HTMLElement, text: string): HTMLElement[] {
  el.innerHTML = "";
  return text.split(" ").map((word, i, arr) => {
    const wrap = document.createElement("span");
    wrap.style.display = "inline-block";
    wrap.style.overflow = "hidden";
    wrap.style.paddingBottom = "0.08em";
    if (i < arr.length - 1) wrap.style.marginRight = "0.28em";
    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.textContent = word;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    return inner;
  });
}

// ── Geschichte ────────────────────────────────────────────────────────────────

function GeschichteSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const eyebrowRef   = useRef<HTMLParagraphElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const timelineRef  = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const dotRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(eyebrowRef.current, { y: 22, opacity: 0 });
      const headingWords = headingRef.current
        ? splitWords(headingRef.current, "Unsere Geschichte")
        : [];
      gsap.set(headingWords, { yPercent: 110 });
      gsap.set(subRef.current, { y: 22, opacity: 0 });

      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        defaults: { force3D: true },
      })
        .to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" })
        .to(headingWords, { yPercent: 0, duration: 1.0, ease: "expo.out", stagger: 0.07 }, "-=0.35")
        .to(subRef.current, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.5");

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 75%",
            end: "bottom 75%",
            scrub: 1.2,
          },
        }
      );

      dotRefs.current.forEach((dot) => {
        if (!dot) return;
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.5)",
            scrollTrigger: { trigger: dot, start: "top 72%", toggleActions: "play none none reverse" },
          }
        );
      });

      cardRefs.current.forEach((card) => {
        if (!card) return;
        const imgWrapper = card.querySelector("[data-milestone-img]") as HTMLElement | null;
        const innerImg   = imgWrapper?.querySelector("img") as HTMLImageElement | null;

        gsap.fromTo(card,
          { opacity: 0, x: 60 },
          {
            opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );

        if (imgWrapper) {
          gsap.set(imgWrapper, { clipPath: "inset(0 0 100% 0)" });
          gsap.set(innerImg, { scale: 1.2 });
          gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 78%", toggleActions: "play none none reverse" },
          })
            .to(imgWrapper, { clipPath: "inset(0 0 0% 0)", duration: 1.0, ease: "expo.inOut" }, 0.2)
            .to(innerImg,   { scale: 1,                    duration: 1.3, ease: "power3.out" }, 0.3);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-white">

      {/* Header with background image */}
      <div
        className="relative px-6 md:px-10 py-16 md:py-24 lg:py-28"
        style={{
          backgroundImage: "url('/images/ueber-geschichte-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.94) 60%, rgba(255,255,255,1) 100%)" }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <p ref={eyebrowRef} className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-plasma">
              Seit 2018
            </p>
            <h2
              ref={headingRef}
              className="mb-5 font-bold leading-tight tracking-tightest text-carbon"
              style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
            >
              Unsere Geschichte
            </h2>
            <p ref={subRef} className="text-base leading-relaxed text-carbon/60">
              Gegründet 2018 in Loiching, Bayern.<br />
              Ein Anspruch: Schweißtische, die halten, was sie versprechen.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 md:px-10 pb-16 md:pb-24 lg:pb-28">
        <div className="max-w-7xl mx-auto">
          <div ref={timelineRef} className="relative">

            {/* Thread */}
            <div
              className="absolute top-0 bottom-0"
              style={{ left: "18px", width: "10px", background: "rgba(0,0,0,0.06)", borderRadius: "5px" }}
            >
              <div
                ref={lineRef}
                className="absolute inset-0 origin-top"
                style={{
                  borderRadius: "5px",
                  background: "linear-gradient(to bottom, #1FA9D9, #0d8ab5)",
                  boxShadow: "0 0 10px rgba(31,169,217,0.35)",
                  transform: "scaleY(0)",
                }}
              />
            </div>

            <div>
              {milestones.map((m, i) => (
                <div key={m.year} className="relative grid grid-cols-[48px_1fr] pb-14 last:pb-0">

                  {/* Dot */}
                  <div className="flex justify-center pt-2 z-10">
                    <div
                      ref={(el) => { dotRefs.current[i] = el; }}
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 32%, #56c9ed, #1FA9D9 48%, #0d8ab5 100%)",
                        boxShadow: "0 0 0 3px white, 0 0 0 5px rgba(31,169,217,0.25), 2px 3px 8px rgba(0,0,0,0.12)",
                        opacity: 0,
                        transform: "scale(0)",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div
                    ref={(el) => { cardRefs.current[i] = el; }}
                    className="pl-8 md:pl-12 grid gap-8 md:grid-cols-[1fr_280px] md:gap-10 md:items-start"
                    style={{ opacity: 0 }}
                  >
                    <div>
                      <div className="flex items-baseline gap-4 mb-3">
                        <span
                          className="font-bold leading-none select-none text-carbon"
                          style={{ fontSize: "clamp(2rem, 3.5vw, 3.25rem)", opacity: 0.05 }}
                        >
                          {m.year}
                        </span>
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-plasma">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="mb-3 text-2xl font-bold tracking-tightest text-carbon md:text-3xl">
                        {m.title}
                      </h3>
                      <p className="mb-2 text-base leading-relaxed text-carbon/65 max-w-2xl">{m.desc}</p>
                      <p className="text-sm leading-relaxed text-carbon/40 max-w-xl">{m.detail}</p>
                    </div>

                    <div data-milestone-img className="relative aspect-[4/3] overflow-hidden shadow-md">
                      <img
                        src={m.img}
                        alt={m.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute bottom-3 left-4 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-white/85">
                        {m.year}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ── Team ─────────────────────────────────────────────────────────────────────

function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(eyebrowRef.current, { y: 22, opacity: 0 });
      const headingWords = headingRef.current ? splitWords(headingRef.current, "Der Inhaber") : [];
      gsap.set(headingWords, { yPercent: 110 });
      gsap.set(subRef.current, { y: 18, opacity: 0 });

      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none reverse" },
        defaults: { force3D: true },
      })
        .to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" })
        .to(headingWords, { yPercent: 0, duration: 1.0, ease: "expo.out", stagger: 0.07 }, "-=0.35")
        .to(subRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.5");

      if (cardRef.current) {
        const photo  = cardRef.current.querySelector("[data-team-photo]") as HTMLElement | null;
        const img    = cardRef.current.querySelector("img") as HTMLImageElement | null;
        const name   = cardRef.current.querySelector("[data-team-name]") as HTMLElement | null;
        const role   = cardRef.current.querySelector("[data-team-role]") as HTMLElement | null;

        gsap.set(photo, { clipPath: "inset(100% 0 0 0)" });
        gsap.set(img, { scale: 1.18 });
        gsap.set([name, role], { y: 14, opacity: 0 });

        gsap.timeline({
          scrollTrigger: { trigger: cardRef.current, start: "top 92%", toggleActions: "play none none reverse" },
          defaults: { force3D: true },
        })
          .to(photo, { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "expo.inOut" })
          .to(img,   { scale: 1,                    duration: 1.1, ease: "power3.out" }, "-=0.7")
          .to(name,  { y: 0, opacity: 1,            duration: 0.5, ease: "power3.out" }, "-=0.5")
          .to(role,  { y: 0, opacity: 1,            duration: 0.45, ease: "power3.out" }, "-=0.35");
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-6 md:px-10 py-16 md:py-24 lg:py-28 border-t border-carbon/10"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p ref={eyebrowRef} className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-plasma">
            Menschen bei Loihl
          </p>
          <h2
            ref={headingRef}
            className="font-bold leading-tight tracking-tightest text-carbon"
            style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
          >
            Der Inhaber
          </h2>
          <p ref={subRef} className="mt-4 max-w-xl text-base text-carbon/60">
            Daniel Loihl führt den Betrieb persönlich – mit dem Anspruch, jeden Tisch so zu bauen,
            als würde er ihn selbst täglich benutzen.
          </p>
        </div>

        <div className="max-w-xs">
          <div ref={cardRef} className="group flex flex-col items-center text-center">
            <div data-team-photo className="relative mb-4 overflow-hidden w-full aspect-[3/2] bg-white border border-carbon/10">
              <img
                src="/images/logo-loihl.png"
                alt="Loihl Metall- und Systembau Logo"
                loading="lazy"
                className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-plasma transition-all duration-500 group-hover:w-full" />
            </div>
            <h3 data-team-name className="font-bold text-base text-carbon">Daniel Loihl</h3>
            <p data-team-role className="mt-1 font-mono text-xs text-carbon/50 uppercase tracking-widest">
              Inhaber & Meister
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Werte ─────────────────────────────────────────────────────────────────────

function WerteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLAnchorElement>(null);
  const cellsRef   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(eyebrowRef.current, { y: 22, opacity: 0 });
      const headingWords = headingRef.current
        ? splitWords(headingRef.current, "Was Loihl ausmacht")
        : [];
      gsap.set(headingWords, { yPercent: 110 });
      gsap.set(subRef.current, { y: 18, opacity: 0 });
      gsap.set(ctaRef.current, { y: 18, opacity: 0 });

      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" },
        defaults: { force3D: true },
      })
        .to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" })
        .to(headingWords, { yPercent: 0, duration: 1.0, ease: "expo.out", stagger: 0.07 }, "-=0.35")
        .to(subRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.5")
        .to(ctaRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, "-=0.4");

      cellsRef.current.filter(Boolean).forEach((cell, idx) => {
        const num   = cell!.querySelector("[data-vt-num]")   as HTMLElement | null;
        const title = cell!.querySelector("[data-vt-title]") as HTMLElement | null;
        const desc  = cell!.querySelector("[data-vt-desc]")  as HTMLElement | null;
        const line  = cell!.querySelector("[data-vt-line]")  as HTMLElement | null;

        gsap.set(cell,  { y: 36, opacity: 0 });
        gsap.set(num,   { scale: 0.5, opacity: 0, transformOrigin: "left center" });
        gsap.set(title, { y: 14, opacity: 0 });
        gsap.set(desc,  { y: 14, opacity: 0 });
        gsap.set(line,  { scaleX: 0, transformOrigin: "left center" });

        gsap.timeline({
          scrollTrigger: { trigger: cell, start: "top 88%", toggleActions: "play none none reverse" },
          delay: (idx % 3) * 0.08,
          defaults: { force3D: true },
        })
          .to(cell,  { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" })
          .to(num,   { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)" }, "-=0.55")
          .to(title, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, "-=0.45")
          .to(desc,  { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, "-=0.4")
          .to(line,  { scaleX: 1, duration: 0.7, ease: "expo.inOut" }, "-=0.4");
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-white">

      {/* Header with background */}
      <div
        className="relative px-6 md:px-10 py-16 md:py-24 lg:py-28"
        style={{
          backgroundImage: "url('/images/werkstatt-interior.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.94) 60%, rgba(255,255,255,1) 100%)" }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end">
            <div>
              <p ref={eyebrowRef} className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-plasma">
                Unsere Werte
              </p>
              <h2
                ref={headingRef}
                className="font-bold leading-tight tracking-tightest text-carbon"
                style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
              >
                Was Loihl ausmacht
              </h2>
            </div>
            <div className="md:text-right">
              <p ref={subRef} className="text-base leading-relaxed text-carbon/60 max-w-md md:ml-auto">
                Keine leeren Versprechen. Loihl steht für Qualität, die man anfassen kann –
                und für Lieferzeiten, die wir einhalten.
              </p>
              <Link
                ref={ctaRef}
                href="/#konfigurator"
                className="mt-6 inline-flex items-center gap-2 border border-plasma/40 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-plasma transition-all duration-200 hover:bg-plasma hover:text-white hover:border-plasma"
              >
                Jetzt konfigurieren <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits grid */}
      <div className="px-6 md:px-10 pb-16 md:pb-24 lg:pb-28">
        <div className="max-w-7xl mx-auto">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{ backgroundColor: "rgba(31,169,217,0.10)" }}
          >
            {werte.map((v, idx) => (
              <div
                key={v.num}
                ref={(el) => { cellsRef.current[idx] = el; }}
                className="group relative p-8 md:p-10 bg-white transition-colors duration-300 hover:bg-[#f0fafd]"
              >
                <span data-vt-num className="mb-6 block font-mono text-[10px] font-semibold uppercase tracking-[0.32em] text-plasma">
                  {v.num}
                </span>
                <h3 data-vt-title className="mb-3 text-lg font-bold tracking-tightest text-carbon md:text-xl">
                  {v.title}
                </h3>
                <p data-vt-desc className="text-sm leading-relaxed text-carbon/55">{v.desc}</p>
                <div data-vt-line className="absolute bottom-0 left-0 h-[2px] w-full bg-plasma/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UeberUnsPage() {
  return (
    <>
      <Navbar />
      <GeschichteSection />
      <TeamSection />
      <WerteSection />
      <Footer />
    </>
  );
}
