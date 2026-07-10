"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// ── FAQ data ──────────────────────────────────────────────────────────────────

const faqItems = [
  {
    question: "Wie schnell bekomme ich eine Antwort?",
    answer: "Per Telefon sofort, Mo–Fr 8–18 Uhr. Per E-Mail innerhalb von 24 Stunden.",
  },
  {
    question: "Bekomme ich ein verbindliches Angebot per Mail?",
    answer: "Ja. Nach Ihrer Anfrage erstellen wir ein detailliertes, verbindliches Angebot – transparent und ohne versteckte Kosten.",
  },
  {
    question: "Kann ich die Werkstatt besichtigen?",
    answer: "Selbstverständlich. Werkstattbesuche sind nach kurzer Vorabsprache jederzeit möglich.",
  },
  {
    question: "Sind Sondermaße möglich und wie anfragen?",
    answer: "Sondermaße sind bei Loihl Standard, kein Aufschlag. Einfach Maße und Anforderungen per E-Mail oder Formular senden.",
  },
  {
    question: "Wie lange dauert die Lieferung nach Bestellung?",
    answer: "10 Werktage. Diese Zeit gilt für Standard- und Sondermaße gleichermaßen und wird eingehalten.",
  },
  {
    question: "Beraten Sie auch zu Tischen anderer Hersteller?",
    answer: "Nein. Wir kennen unsere Tische in- und auswendig und beraten ausschließlich zu Loihl-Produkten.",
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

// ── Input styles ──────────────────────────────────────────────────────────────

const inputCls = [
  "w-full border border-carbon/15 bg-white px-4 py-3",
  "text-sm text-carbon placeholder:text-carbon/35",
  "outline-none transition-colors duration-200",
  "focus:border-plasma focus:ring-0",
].join(" ");

const labelCls = "block mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-carbon/55";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function KontaktPage() {
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [product, setProduct]       = useState("");
  const [message, setMessage]       = useState("");
  const [datenschutz, setDatenschutz] = useState(false);

  // ── Refs for animations ───────────────────────────────────────────────────
  const heroRef    = useRef<HTMLElement>(null);
  const heroBgRef  = useRef<HTMLImageElement>(null);
  const infoRef    = useRef<HTMLElement>(null);
  const formRef    = useRef<HTMLElement>(null);
  const faqRef     = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Hero: image Ken Burns + content fade in ────────────────────────
      gsap.from(heroBgRef.current, { scale: 1.06, duration: 2.4, ease: "power1.out" });
      gsap.from(".kontakt-hero-line",   { scaleX: 0, transformOrigin: "left center", duration: 0.8, delay: 0.3, ease: "power3.out" });
      gsap.from(".kontakt-hero-eyebrow",{ y: "120%", duration: 0.65, delay: 0.55, ease: "power3.out" });
      gsap.from(".kontakt-hero-title span", { y: "110%", stagger: 0.10, duration: 0.9, delay: 0.75, ease: "power3.out" });
      gsap.from(".kontakt-hero-sub",    { y: 22, opacity: 0, duration: 0.7, delay: 1.3, ease: "power2.out" });
      gsap.from(".kontakt-hero-cta",    { y: 16, opacity: 0, stagger: 0.1, duration: 0.6, delay: 1.6, ease: "power2.out" });

      // ── Contact info section ───────────────────────────────────────────
      gsap.from(".kontakt-info-eyebrow", {
        y: 24, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: infoRef.current, start: "top 80%" },
      });
      gsap.from(".kontakt-info-heading span", {
        y: "110%", stagger: 0.08, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: infoRef.current, start: "top 80%" },
      });
      gsap.from(".kontakt-info-sub", {
        y: 20, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: infoRef.current, start: "top 80%" },
      });
      gsap.from(".kontakt-map", {
        clipPath: "inset(0 100% 0 0)", duration: 1.2, ease: "power3.inOut",
        scrollTrigger: { trigger: infoRef.current, start: "top 75%" },
      });
      gsap.from(".kontakt-info-card", {
        y: 36, opacity: 0, stagger: 0.12, duration: 0.8, ease: "expo.out",
        scrollTrigger: { trigger: ".kontakt-info-cards", start: "top 85%" },
      });

      // ── Form section ───────────────────────────────────────────────────
      gsap.from(".kontakt-form-left", {
        x: -40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: formRef.current, start: "top 80%" },
      });
      gsap.from(".kontakt-form-right", {
        x: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: formRef.current, start: "top 80%" },
      });

      // ── FAQ section ────────────────────────────────────────────────────
      gsap.from(".kontakt-faq-heading span", {
        y: "110%", stagger: 0.08, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: faqRef.current, start: "top 80%" },
      });
      gsap.from(".kontakt-faq-sub", {
        y: 20, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: faqRef.current, start: "top 80%" },
      });
      gsap.from(".kontakt-faq-body", {
        y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".kontakt-faq-body", start: "top 85%" },
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[55vh] overflow-hidden flex items-end"
      >
        <img
          ref={heroBgRef}
          src="/images/phi-direkt.jpg"
          alt="Loihl Werkstatt"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ willChange: "transform" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.65) 45%, rgba(10,10,10,0.25) 100%)",
          }}
        />

        <div className="relative z-10 px-6 md:px-10 pt-28 pb-16 md:pb-20 max-w-7xl mx-auto w-full">
          <div className="max-w-[52%]">
            <div className="mb-8 flex items-center gap-4">
              <span className="kontakt-hero-line h-px w-8 flex-shrink-0 bg-plasma" />
              <div style={{ overflow: "hidden" }}>
                <p className="kontakt-hero-eyebrow font-mono text-xs font-semibold uppercase tracking-widest text-white/50">
                  Direkter Kontakt
                </p>
              </div>
            </div>

            <h1
              className="kontakt-hero-title mb-8 font-bold tracking-tightest text-white"
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 5rem)", lineHeight: 1.05 }}
            >
              {["Sprechen Sie", "direkt mit Daniel."].map((line, i) => (
                <span key={i} className="block" style={{ overflow: "hidden", paddingBottom: "0.06em" }}>
                  <span className="block">{line}</span>
                </span>
              ))}
            </h1>

            <p className="kontakt-hero-sub mb-10 max-w-sm font-mono text-sm leading-relaxed text-white/55">
              Kein Callcenter. Keine Warteschleife.<br />Antwort innerhalb von 24 Stunden.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+4917643444600"
                className="kontakt-hero-cta bg-plasma text-white font-semibold px-7 py-3.5 hover:bg-plasma/90 transition-colors text-sm tracking-wide"
              >
                Jetzt anrufen
              </a>
              <a
                href="#formular"
                className="kontakt-hero-cta border border-white/25 text-white font-semibold px-7 py-3.5 hover:border-white/50 transition-colors text-sm tracking-wide"
              >
                Formular ausfüllen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Kontaktinfo + Map ────────────────────────────────────────────── */}
      <section ref={infoRef} className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">

          {/* Map + info grid */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 mb-14 md:mb-20 items-start">

            {/* Left: heading + contact cards */}
            <div className="flex flex-col gap-10">

              {/* Heading */}
              <div>
                <p className="kontakt-info-eyebrow mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-plasma">
                  Kontakt
                </p>
                <h2
                  className="kontakt-info-heading mb-4 font-bold tracking-tightest text-carbon"
                  style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
                >
                  {["Direkt", "zu uns."].map((word, i) => (
                    <span key={i} className="block" style={{ overflow: "hidden", paddingBottom: "0.06em" }}>
                      <span className="block">{word}</span>
                    </span>
                  ))}
                </h2>
                <p className="kontakt-info-sub font-mono text-sm text-carbon/55 max-w-sm">
                  Wir sind Ihr direkter Ansprechpartner – von der ersten Anfrage bis zur Lieferung.
                </p>
              </div>

            {/* Contact cards */}
            <div className="kontakt-info-cards flex flex-col gap-10">
              {/* Phone */}
              <div className="kontakt-info-card flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-1">
                  <svg className="w-5 h-5 text-plasma flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="font-bold text-base text-carbon">Telefon</p>
                </div>
                <p className="font-mono text-xs text-carbon/50 uppercase tracking-widest">Mo – Fr, 8:00 – 18:00 Uhr</p>
                <a href="tel:+4917643444600" className="text-plasma font-mono text-xl font-bold hover:underline">
                  0176 43444600
                </a>
              </div>

              {/* Email */}
              <div className="kontakt-info-card flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-1">
                  <svg className="w-5 h-5 text-plasma flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="font-bold text-base text-carbon">E-Mail</p>
                </div>
                <p className="font-mono text-xs text-carbon/50 uppercase tracking-widest">Antwort innerhalb von 24 Stunden</p>
                <a href="mailto:kontakt@loihl-metallbau.de" className="text-carbon/70 hover:text-plasma transition-colors text-base">
                  kontakt@loihl-metallbau.de
                </a>
              </div>

              {/* Address */}
              <div className="kontakt-info-card flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-1">
                  <svg className="w-5 h-5 text-plasma flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="square" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="font-bold text-base text-carbon">Werkstatt</p>
                </div>
                <p className="text-carbon/60 text-base">
                  Hangweg 5a<br />84180 Loiching, Bayern
                </p>
                <p className="font-mono text-xs text-carbon/40 uppercase tracking-widest">
                  Besichtigung nach Vereinbarung
                </p>
              </div>
            </div>
            </div>{/* end left column */}

            {/* OpenStreetMap — right column, full height aligned to top of heading */}
            <div className="kontakt-map overflow-hidden" style={{ minHeight: 560, height: "100%" }}>
              <iframe
                title="Loihl Metall- und Systembau Standort"
                src="https://www.openstreetmap.org/export/embed.html?bbox=12.34%2C48.50%2C12.40%2C48.54&layer=mapnik&marker=48.517%2C12.367"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 560, display: "block" }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Kontaktformular ──────────────────────────────────────────────── */}
      <section
        ref={formRef}
        id="formular"
        className="px-6 md:px-10 py-16 md:py-24 lg:py-28 border-t border-carbon/10"
        style={{ backgroundColor: "#f5f5f5" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">

          {/* Left: info + photo */}
          <div className="kontakt-form-left flex flex-col gap-8">
            <div>
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-plasma">
                Anfragen
              </p>
              <h2
                className="mb-4 font-bold tracking-tightest text-carbon"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
              >
                Ihr Projekt
              </h2>
              <p className="text-base text-carbon/60 leading-relaxed">
                Wir antworten innerhalb eines Werktages.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-plasma flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-carbon/70">kontakt@loihl-metallbau.de</p>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-plasma flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="font-mono text-sm text-carbon/70">0176 43444600</p>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-plasma flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="square" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-carbon/70">Hangweg 5a, 84180 Loiching</p>
              </div>
            </div>

            {/* Logo */}
            <div className="relative overflow-hidden aspect-[4/3] bg-white border border-carbon/10">
              <img
                src="/images/logo-loihl.png"
                alt="Loihl Metall- und Systembau Logo"
                loading="lazy"
                className="h-full w-full object-contain p-6"
              />
              <div className="absolute bottom-4 left-5">
                <p className="font-bold text-sm text-carbon">Daniel Loihl</p>
                <p className="font-mono text-[10px] text-carbon/50 uppercase tracking-widest">Inhaber & Ansprechpartner</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <form
            className="kontakt-form-right flex flex-col gap-5 bg-white p-8 md:p-10"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Name row */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Vorname</label>
                <input
                  type="text"
                  placeholder="Max"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Nachname</label>
                <input
                  type="text"
                  placeholder="Mustermann"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelCls}>E-Mail</label>
                <input
                  type="email"
                  placeholder="max@firma.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Telefon</label>
                <input
                  type="tel"
                  placeholder="0176 …"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Product type */}
            <div>
              <label className={labelCls}>Produkt</label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className={inputCls + " appearance-none cursor-pointer"}
              >
                <option value="" disabled>Bitte wählen</option>
                <option value="schweisstisch">Schweißtisch</option>
                <option value="spanntisch">Spanntisch</option>
                <option value="sondermass">Sondermaß</option>
                <option value="zubehoer">Zubehör</option>
                <option value="beratung">Beratung</option>
                <option value="sonstiges">Sonstiges</option>
              </select>
            </div>

            {/* Describe yourself */}
            <div>
              <p className={labelCls + " mb-3"}>Wie würden Sie sich beschreiben?</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {["Metallbauer", "Werkzeugmacher", "Industriebetrieb", "Handwerk", "Hobbyist", "Sonstiges"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="beschreibung"
                      value={opt}
                      className="appearance-none w-4 h-4 rounded-full border-2 border-carbon/25 checked:border-plasma checked:bg-plasma transition-colors duration-200 cursor-pointer flex-none"
                    />
                    <span className="text-sm text-carbon/65 group-hover:text-plasma transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className={labelCls}>Nachricht</label>
              <textarea
                rows={5}
                placeholder="Erzählen Sie uns von Ihrem Projekt – Maße, Stückzahl, Verwendungszweck …"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={inputCls + " resize-none"}
              />
            </div>

            {/* Datenschutz */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="datenschutz"
                checked={datenschutz}
                onChange={(e) => setDatenschutz(e.target.checked)}
                className="mt-0.5 w-4 h-4 appearance-none border-2 border-carbon/25 checked:border-plasma checked:bg-plasma transition-colors duration-200 cursor-pointer flex-none"
              />
              <label htmlFor="datenschutz" className="text-sm text-carbon/55 leading-relaxed cursor-pointer">
                Ich habe die{" "}
                <Link href="/datenschutz" className="text-plasma hover:underline">
                  Datenschutzerklärung
                </Link>{" "}
                gelesen und stimme zu.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="inline-flex items-center gap-2 border border-plasma bg-plasma px-8 py-4 font-mono text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-transparent hover:text-plasma"
            >
              Anfrage senden <span>→</span>
            </button>
          </form>

        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section ref={faqRef} className="bg-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <h2
            className="kontakt-faq-heading mb-4 font-bold tracking-tightest text-carbon"
            style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
          >
            {["Häufig", "gefragt."].map((word, i) => (
              <span key={i} className="block" style={{ overflow: "hidden", paddingBottom: "0.06em" }}>
                <span className="block">{word}</span>
              </span>
            ))}
          </h2>
          <p className="kontakt-faq-sub mb-12 font-mono text-sm text-carbon/55 max-w-sm">
            Antworten rund um Kontakt, Beratung und Lieferung.
          </p>
          <div className="kontakt-faq-body max-w-3xl">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
