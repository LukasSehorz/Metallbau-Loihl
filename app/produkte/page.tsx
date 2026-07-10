"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

type PRow = { a: string; b: string; netto: string; brutto: string };

// ── Data ──────────────────────────────────────────────────────────────────────

const TO_ROWS: PRow[] = [
  { a: "2900×1400×200", b: "TO290.140", netto: "3.100,00 €", brutto: "3.689,00 €" },
  { a: "2900×1200×200", b: "TO290.120", netto: "2.930,00 €", brutto: "3.486,70 €" },
  { a: "2900×1000×200", b: "TO290.100", netto: "2.810,00 €", brutto: "3.343,90 €" },
  { a: "2400×1400×200", b: "TO240.140", netto: "2.810,00 €", brutto: "3.343,90 €" },
  { a: "2400×1200×200", b: "TO240.120", netto: "2.410,00 €", brutto: "2.867,90 €" },
  { a: "2000×1400×200", b: "TO200.140", netto: "2.410,00 €", brutto: "2.867,90 €" },
  { a: "2000×1200×200", b: "TO200.120", netto: "2.200,00 €", brutto: "2.618,00 €" },
  { a: "2000×1000×200", b: "TO200.100", netto: "1.980,00 €", brutto: "2.356,20 €" },
  { a: "1800×900×200",  b: "TO180.090", netto: "1.780,00 €", brutto: "2.118,20 €" },
  { a: "1400×1400×200", b: "TO140.140", netto: "1.980,00 €", brutto: "2.356,20 €" },
  { a: "1200×1200×200", b: "TO120.120", netto: "1.720,00 €", brutto: "2.046,80 €" },
  { a: "1000×1000×200", b: "TO100.100", netto: "1.590,00 €", brutto: "1.892,10 €" },
];

const TD_ROWS: PRow[] = [
  { a: "2900×1400×200", b: "TD290.140", netto: "3.300,00 €", brutto: "3.927,00 €" },
  { a: "2900×1200×200", b: "TD290.120", netto: "3.150,00 €", brutto: "3.748,50 €" },
  { a: "2900×1000×200", b: "TD290.100", netto: "3.050,00 €", brutto: "3.629,50 €" },
  { a: "2400×1400×200", b: "TD240.140", netto: "3.000,00 €", brutto: "3.570,00 €" },
  { a: "2400×1200×200", b: "TD240.120", netto: "2.590,00 €", brutto: "3.082,10 €" },
  { a: "2000×1400×200", b: "TD200.140", netto: "2.590,00 €", brutto: "3.082,10 €" },
  { a: "2000×1200×200", b: "TD200.120", netto: "2.460,00 €", brutto: "2.927,40 €" },
  { a: "2000×1000×200", b: "TD200.100", netto: "2.210,00 €", brutto: "2.629,90 €" },
  { a: "1800×900×200",  b: "TD180.090", netto: "1.950,00 €", brutto: "2.320,50 €" },
  { a: "1400×1400×200", b: "TD140.140", netto: "2.200,00 €", brutto: "2.618,00 €" },
  { a: "1200×1200×200", b: "TD120.120", netto: "1.900,00 €", brutto: "2.261,00 €" },
  { a: "1000×1000×200", b: "TD100.100", netto: "1.650,00 €", brutto: "1.963,50 €" },
];

const AO_ROWS: PRow[] = [
  { a: "2900×1400×2", b: "AO290.140", netto: "330,00 €", brutto: "392,70 €" },
  { a: "2400×1400×2", b: "AO240.140", netto: "280,00 €", brutto: "333,20 €" },
  { a: "2400×1200×2", b: "AO240.120", netto: "275,00 €", brutto: "327,25 €" },
  { a: "2000×1400×2", b: "AO200.140", netto: "275,00 €", brutto: "327,25 €" },
  { a: "2000×1200×2", b: "AO200.120", netto: "270,00 €", brutto: "321,30 €" },
  { a: "2000×1000×2", b: "AO200.100", netto: "260,00 €", brutto: "309,40 €" },
  { a: "1800×900×2",  b: "AO180.090", netto: "250,00 €", brutto: "297,50 €" },
  { a: "1400×1400×2", b: "AO140.140", netto: "270,00 €", brutto: "321,30 €" },
  { a: "1200×1200×2", b: "AO120.120", netto: "250,00 €", brutto: "297,50 €" },
  { a: "1000×1000×2", b: "AO100.100", netto: "240,00 €", brutto: "285,60 €" },
];

const AD_ROWS: PRow[] = [
  { a: "2900×1400×2", b: "AD290.140", netto: "340,00 €", brutto: "404,60 €" },
  { a: "2400×1400×2", b: "AD240.140", netto: "290,00 €", brutto: "345,10 €" },
  { a: "2400×1200×2", b: "AD240.120", netto: "285,00 €", brutto: "339,15 €" },
  { a: "2000×1400×2", b: "AD200.140", netto: "285,00 €", brutto: "339,15 €" },
  { a: "2000×1200×2", b: "AD200.120", netto: "280,00 €", brutto: "333,20 €" },
  { a: "2000×1000×2", b: "AD200.100", netto: "270,00 €", brutto: "321,30 €" },
  { a: "1800×900×2",  b: "AD180.090", netto: "260,00 €", brutto: "309,40 €" },
  { a: "1400×1400×2", b: "AD140.140", netto: "280,00 €", brutto: "333,20 €" },
  { a: "1200×1200×2", b: "AD120.120", netto: "260,00 €", brutto: "309,40 €" },
  { a: "1000×1000×2", b: "AD100.100", netto: "250,00 €", brutto: "297,50 €" },
];

const HB_ROWS: PRow[] = [
  { a: "1080 mm Breite", b: "HB110.900", netto: "1.390,00 €", brutto: "1.654,10 €" },
  { a: "1280 mm Breite", b: "HB130.900", netto: "1.490,00 €", brutto: "1.773,10 €" },
  { a: "1480 mm Breite", b: "HB150.900", netto: "1.590,00 €", brutto: "1.892,10 €" },
];

const HB_ABD_ROWS: PRow[] = [
  { a: "1100×200×125 mm", b: "LA110.200", netto: "290,00 €", brutto: "345,10 €" },
  { a: "1300×200×125 mm", b: "LA130.200", netto: "390,00 €", brutto: "464,10 €" },
  { a: "1500×200×125 mm", b: "LA150.200", netto: "490,00 €", brutto: "583,10 €" },
];

const HB_SCH_ROWS: PRow[] = [
  { a: "1079×90×4 mm", b: "LK110.004", netto: "36,00 €", brutto: "42,84 €" },
  { a: "1279×90×4 mm", b: "LK130.004", netto: "43,00 €", brutto: "51,17 €" },
  { a: "1479×90×4 mm", b: "LK150.004", netto: "50,00 €", brutto: "59,50 €" },
];

const SB_ROWS: PRow[] = [
  { a: "500×300×200",  b: "SB500.300",  netto: "450,00 €",   brutto: "535,50 €" },
  { a: "600×300×200",  b: "SB600.300",  netto: "490,00 €",   brutto: "583,10 €" },
  { a: "700×300×200",  b: "SB700.300",  netto: "550,00 €",   brutto: "654,50 €" },
  { a: "800×300×200",  b: "SB800.300",  netto: "590,00 €",   brutto: "702,10 €" },
  { a: "900×300×200",  b: "SB900.300",  netto: "650,00 €",   brutto: "773,50 €" },
  { a: "1000×300×200", b: "SB1000.300", netto: "690,00 €",   brutto: "821,10 €" },
  { a: "1200×300×200", b: "SB1200.300", netto: "790,00 €",   brutto: "940,10 €" },
  { a: "1400×300×200", b: "SB1400.300", netto: "890,00 €",   brutto: "1.059,10 €" },
  { a: "1600×300×200", b: "SB1600.300", netto: "990,00 €",   brutto: "1.178,10 €" },
  { a: "1800×300×200", b: "SB1800.300", netto: "1.090,00 €", brutto: "1.297,10 €" },
  { a: "2000×300×200", b: "SB2000.300", netto: "1.190,00 €", brutto: "1.416,10 €" },
];

const SCHRAUBZWINGE_ROWS: PRow[] = [
  { a: "200×100 mm", b: "SP200.100", netto: "39,00 €", brutto: "46,41 €" },
  { a: "300×120 mm", b: "SP300.120", netto: "44,00 €", brutto: "52,36 €" },
];

const ANSCHLAG_ROWS: PRow[] = [
  { a: "150×50 mm",                      b: "AS150.050", netto: "25,00 €", brutto: "29,75 €" },
  { a: "150×50 mm Langloch",             b: "AL150.050", netto: "26,00 €", brutto: "30,94 €" },
  { a: "300×50 mm Langloch + Loch",      b: "AS300.050", netto: "29,00 €", brutto: "34,51 €" },
  { a: "300×50 mm durchgehend Langloch", b: "AL300.050", netto: "30,00 €", brutto: "35,70 €" },
];

const WINKEL_ROWS: PRow[] = [
  { a: "200×200×50 mm",  b: "WA200.050", netto: "48,00 €",  brutto: "57,12 €" },
  { a: "400×200×100 mm", b: "WA400.100", netto: "95,00 €",  brutto: "113,05 €" },
  { a: "400×200×200 mm", b: "WA400.200", netto: "180,00 €", brutto: "214,20 €" },
  { a: "500×200×200 mm", b: "WA500.200", netto: "200,00 €", brutto: "238,00 €" },
  { a: "600×200×200 mm", b: "WA600.200", netto: "210,00 €", brutto: "249,90 €" },
  { a: "700×200×200 mm", b: "WA700.200", netto: "220,00 €", brutto: "261,80 €" },
];

const WINKELSCHABLONE_ROWS: PRow[] = [
  { a: "250×250 mm",                 b: "WS250.250", netto: "59,00 €",  brutto: "70,21 €" },
  { a: "300×300×100 mm Seitenteile", b: "WS300.300", netto: "149,00 €", brutto: "177,31 €" },
];

// ── Shared Components ─────────────────────────────────────────────────────────

function PriceTable({
  rows,
  colA = "Maße (mm)",
  colB = "Bestellnummer",
  noBorder = false,
}: {
  rows: PRow[];
  colA?: string;
  colB?: string;
  noBorder?: boolean;
}) {
  return (
    <div className={`overflow-x-auto${noBorder ? "" : " border border-carbon/10"}`}>
      <table className="w-full text-sm min-w-[360px]">
        <thead>
          <tr className="bg-gray-50 border-b border-carbon/10">
            <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60 whitespace-nowrap">{colA}</th>
            <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60 whitespace-nowrap">{colB}</th>
            <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60 whitespace-nowrap">Netto</th>
            <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-carbon/60 whitespace-nowrap">inkl. MwSt.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-carbon/10">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50/60 transition-colors">
              <td className="px-4 py-3 font-mono text-carbon text-sm">{row.a}</td>
              <td className="px-4 py-3 font-mono text-carbon/60 text-sm">{row.b}</td>
              <td className="px-4 py-3 text-right font-semibold text-carbon text-sm whitespace-nowrap">{row.netto}</td>
              <td className="px-4 py-3 text-right text-carbon/60 text-sm whitespace-nowrap">{row.brutto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface AccordionProps {
  id: string;
  rows: PRow[];
  isOpen: boolean;
  onToggle: (id: string) => void;
  colA?: string;
  colB?: string;
}

function PriceAccordion({ id, rows, isOpen, onToggle, colA, colB }: AccordionProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (!bodyRef.current) return;
    if (isFirst.current) {
      isFirst.current = false;
      // set initial closed state without animation
      if (!isOpen) gsap.set(bodyRef.current, { height: 0, opacity: 0 });
      return;
    }
    if (isOpen) {
      gsap.to(bodyRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
        onComplete: () => {
          // stagger table rows in after expand
          if (bodyRef.current) {
            const trs = bodyRef.current.querySelectorAll("tbody tr");
            gsap.fromTo(trs,
              { x: -12, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.28, stagger: 0.03, ease: "power2.out" }
            );
          }
        },
      });
    } else {
      gsap.to(bodyRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  // single-row: show inline price
  if (rows.length === 1) {
    const row = rows[0];
    const hasOrderNr = row.b && row.b !== "–";
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-carbon font-bold text-xl">{row.netto}</span>
          <span className="text-carbon/40 text-xs font-mono">{row.brutto}</span>
        </div>
        <p className="text-carbon/40 text-xs font-mono">
          {hasOrderNr ? `${row.a} · ${row.b}` : row.a}
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold font-mono border border-carbon/20 hover:border-plasma/50 hover:text-plasma transition-all duration-200 group"
      >
        <span className="transition-colors duration-200">{rows.length} Größen verfügbar</span>
        <span className="text-carbon/50 group-hover:text-plasma transition-colors duration-200">
          Preisübersicht{" "}
          <span
            className="inline-block transition-transform duration-300"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▾
          </span>
        </span>
      </button>
      <div ref={bodyRef} style={{ overflow: "hidden" }}>
        <div className="border-x border-b border-carbon/20">
          <PriceTable rows={rows} colA={colA} colB={colB} noBorder />
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  img?: string;
  imgAlt?: string;
  label: string;
  name: string;
  desc: string;
  rows?: PRow[];
  accordionId?: string;
  isOpen?: boolean;
  onToggle?: (id: string) => void;
  colA?: string;
  colB?: string;
  badge?: string;
  cta?: React.ReactNode;
}

function ProductCard({
  img,
  imgAlt,
  label,
  name,
  desc,
  rows,
  accordionId,
  isOpen,
  onToggle,
  colA,
  colB,
  badge,
  cta,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    cardRef.current.style.willChange = "transform";
    const r = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    gsap.to(cardRef.current, {
      rotateY: x * 6,
      rotateX: -y * 6,
      scale: 1.018,
      duration: 0.35,
      ease: "power2.out",
      transformPerspective: 900,
      transformOrigin: "center center",
    });
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        x: x * 6,
        y: y * 4,
        scale: 1.05,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }

  function onMouseLeave() {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.55,
      ease: "power3.out",
      onComplete: () => {
        if (cardRef.current) cardRef.current.style.willChange = "auto";
      },
    });
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="product-card border border-carbon/10 flex flex-col h-full
                 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_12px_40px_-12px_rgba(31,169,217,0.15)]
                 hover:border-carbon/20"
    >
      {/* Fixed-height image area */}
      <div className="h-56 bg-gray-50 shrink-0 flex items-center justify-center border-b border-carbon/10 overflow-hidden">
        {img ? (
          <img
            ref={imgRef}
            src={img}
            alt={imgAlt ?? name}
            className="w-full h-full object-contain p-6"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-carbon/20">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs font-mono uppercase tracking-widest">Im Lieferumfang</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6 gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-plasma mb-1">{label}</p>
            <h3 className="text-carbon font-bold text-lg leading-tight tracking-tightest">{name}</h3>
          </div>
          {badge && (
            <span className="shrink-0 bg-carbon/5 border border-carbon/10 text-carbon/60 text-xs font-mono px-3 py-1 mt-0.5">
              {badge}
            </span>
          )}
        </div>

        <p className="text-carbon/60 text-sm leading-relaxed">{desc}</p>

        {rows && accordionId && onToggle && (
          <PriceAccordion
            id={accordionId}
            rows={rows}
            isOpen={isOpen ?? false}
            onToggle={onToggle}
            colA={colA}
            colB={colB}
          />
        )}

        {cta && <div className="mt-auto pt-2">{cta}</div>}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="sec-label text-plasma text-xs font-mono uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <div className="divider-line border-t border-carbon/10" />
    </div>
  );
}

const NAV_ITEMS = [
  "Schweißtische",
  "Füße & Rollen",
  "Alubleche",
  "Hubböcke",
  "Brücken",
  "Spannwerkzeug",
  "Anschläge & Winkel",
  "Versand",
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProduktePage() {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function isOpen(id: string) {
    return open.has(id);
  }

  function scrollTo(index: number) {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── GSAP Animations ──────────────────────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      // ① Scroll progress bar (plasma line, scrub with scroll)
      gsap.set(".progress-bar", { scaleX: 0, transformOrigin: "left center" });
      gsap.to(".progress-bar", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      // ② Hero entrance — staggered word-mask reveal
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl
        .from(".hero-label", { y: 24, opacity: 0, duration: 0.6 })
        .from(".hero-word", { yPercent: 115, duration: 1.0, stagger: 0.12 }, "-=0.35")
        .from(".hero-desc", { y: 30, opacity: 0, duration: 0.8 }, "-=0.55")
        .from(".hero-cta", { y: 22, opacity: 0, duration: 0.55, stagger: 0.1 }, "-=0.5");

      // ③ Sticky nav slides in after hero
      gsap.from(".sticky-nav", {
        y: -28,
        opacity: 0,
        duration: 0.55,
        delay: 0.7,
        ease: "power3.out",
      });

      // ④ Section labels + headings + descs — all via ScrollTrigger
      gsap.utils.toArray<HTMLElement>(".sec-label").forEach((el) => {
        gsap.from(el, {
          y: 20,
          opacity: 0,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".sec-h2").forEach((el) => {
        gsap.from(el, {
          y: 45,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".sec-p").forEach((el) => {
        gsap.from(el, {
          y: 22,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      // ⑤ Product card grids — stagger in (y + opacity only, no scale = no reflow flicker)
      gsap.utils.toArray<HTMLElement>(".products-grid").forEach((grid) => {
        const cards = grid.querySelectorAll(".product-card");
        gsap.from(cards, {
          y: 55,
          opacity: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: grid, start: "top 88%", once: true },
        });
      });

      // ⑥ Section divider lines grow in from left
      gsap.utils.toArray<HTMLElement>(".divider-line").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        });
      });

      // ⑦ ZUBEHÖR dark banner — cinematic slide from both sides
      gsap.from(".zubehoer-left", {
        x: -70,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".zubehoer-banner", start: "top 85%", once: true },
      });
      gsap.from(".zubehoer-right", {
        x: 70,
        opacity: 0,
        duration: 0.9,
        delay: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".zubehoer-banner", start: "top 85%", once: true },
      });
      gsap.from(".zubehoer-plasma-line", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: ".zubehoer-banner", start: "top 85%", once: true },
      });

      // ⑧ Versand rows stagger
      gsap.from(".versand-row", {
        y: 22,
        opacity: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: ".versand-section", start: "top 88%", once: true },
      });

      // ⑨ Versand CTAs
      gsap.from(".versand-cta", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".versand-section", start: "top 75%", once: true },
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  const DefaultCTA = (
    <Link href="/kontakt" className="text-plasma text-sm font-semibold hover:underline group">
      Anfragen{" "}
      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );

  return (
    <div ref={pageRef}>
      {/* ① Scroll progress bar */}
      <div
        ref={progressRef}
        className="progress-bar fixed top-0 left-0 right-0 h-0.5 bg-plasma z-[60] pointer-events-none"
        style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
      />

      <Navbar />

      {/* Page Header */}
      <section className="bg-white px-6 md:px-10 py-16 md:py-24 border-b border-carbon/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:gap-16 lg:gap-24 gap-8">
          <div className="w-full md:max-w-lg">
            <p className="hero-label text-plasma text-xs font-mono uppercase tracking-widest mb-3">
              Produkte
            </p>
            {/* Word-mask hero title */}
            <h1 className="text-carbon text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest leading-tight">
              {["Schweißtische", "&", "Zubehör"].map((word, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom leading-none">
                  <span className="hero-word inline-block leading-tight">
                    {word}{i < 2 ? " " : ""}
                  </span>
                </span>
              ))}
            </h1>
          </div>
          <div className="w-full md:max-w-lg flex flex-col justify-end gap-6">
            <p className="hero-desc text-carbon/60 text-base leading-relaxed">
              Standardmaße ab 1.590 € netto. Gefertigt in Loiching, Bayern. Fertigungszeit ca. 10 Werktage.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#konfigurator"
                className="hero-cta bg-plasma text-white font-semibold px-6 py-3 hover:bg-plasma/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-6px_rgba(31,169,217,0.5)] inline-block"
              >
                Konfigurator starten
              </Link>
              <Link
                href="/kontakt"
                className="hero-cta border border-carbon/20 text-carbon font-semibold px-6 py-3 hover:border-carbon/40 transition-colors inline-block"
              >
                Direkt anfragen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Nav */}
      <div className="sticky-nav sticky top-0 z-40 bg-white border-b border-carbon/10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto py-3">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item}
              onClick={() => scrollTo(i)}
              className="shrink-0 px-4 py-1.5 text-xs font-semibold font-mono uppercase tracking-widest whitespace-nowrap border border-carbon/20 text-carbon hover:border-plasma hover:text-plasma transition-all duration-150"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* ── 0: Schweißtische ── */}
      <section
        id="schweisstische"
        ref={(el) => { sectionRefs.current[0] = el; }}
        className="bg-white px-6 md:px-10 py-16 md:py-24 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Schweißtische</SectionLabel>
          <h2 className="sec-h2 text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-3">
            TO-Serie & TD-Serie
          </h2>
          <p className="sec-p text-carbon/60 text-base leading-relaxed mb-10 max-w-2xl">
            Beide Serien mit Ø 28 mm Bohrungen im 100×100 mm Raster. Beim TD hat auch die{" "}
            <strong className="text-carbon">Oberseite</strong> eine zusätzliche Diagonallochung — für mehr Spannpositionen.
          </p>
          <div className="products-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductCard
              img="/images/product-schweisstisch-to.jpg"
              label="Schweißtisch"
              name="TO-Serie"
              desc="Oberseite: nur 100×100 mm Lochraster · Seitenteile: Diagonallochung. Ø 28 mm Bohrungen. Material S355. Pulverbeschichtet."
              rows={TO_ROWS}
              accordionId="to"
              isOpen={isOpen("to")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
            <ProductCard
              img="/images/product-schweisstisch-td.jpg"
              label="Schweißtisch"
              name="TD-Serie"
              desc="Oberseite: 100×100 mm Lochraster + Diagonallochung · Seitenteile: Diagonallochung. Maximale Spannpositionen auf allen Flächen."
              rows={TD_ROWS}
              accordionId="td"
              isOpen={isOpen("td")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
          </div>
          <p className="sec-p text-carbon/40 text-xs font-mono mt-4">
            Alle Preise zzgl. MwSt. · Sondermaße realisierbar · Fertigungszeit ca. 10 Werktage
          </p>
        </div>
      </section>

      <Divider />

      {/* ── 1: Füße & Rollen ── */}
      <section
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="bg-white px-6 md:px-10 py-16 md:py-24 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Füße & Rollen</SectionLabel>
          <h2 className="sec-h2 text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-10">
            Standfüße & Schwerlastrollen
          </h2>
          <div className="products-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductCard
              img="/images/product-fuesse.jpg"
              label="Standard"
              name="Feststehende Füße"
              desc="Stabile, höhenverstellbare Standfüße aus Stahl. Im Lieferumfang aller Schweißtische enthalten."
              badge="Im Preis enthalten"
            />
            <ProductCard
              img="/images/product-schwerlastrollen.jpg"
              label="Upgrade"
              name="Schwerlastrollen"
              desc="Blickle-Schwerlastrollen, 4 Stück. Tragfähigkeit 1.375 kg/Rolle. Alle 4 Rollen können in der Drehbewegung gesperrt werden. Zum Schweißtisch dazubestellbar."
              rows={[{ a: "4 Stück · Blickle", b: "–", netto: "279,00 €", brutto: "332,01 €" }]}
              accordionId="rollen"
              isOpen={isOpen("rollen")}
              onToggle={toggle}
              cta={
                <Link
                  href="/kontakt"
                  className="inline-block bg-plasma text-white font-semibold px-5 py-2.5 text-sm hover:bg-plasma/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-6px_rgba(31,169,217,0.5)]"
                >
                  Zum Tisch dazubestellen
                </Link>
              }
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 2: Alubleche ── */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="bg-white px-6 md:px-10 py-16 md:py-24 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Alubleche</SectionLabel>
          <h2 className="sec-h2 text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-3">
            Aluabdeckbleche
          </h2>
          <p className="sec-p text-carbon/60 text-base leading-relaxed mb-10 max-w-2xl">
            Verhindert Fremdrost bei der Edelstahlverarbeitung. Ø 28 mm Bohrungen passend zur
            Tischoberfläche. 100×100 mm Hilfsmarkierung.
          </p>
          <div className="products-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductCard
              img="/images/product-alublech.jpg"
              label="Aluabdeckblech"
              name="AO-Serie — Ohne Diagonallochung"
              desc="Aluminium 2 mm · Ø 28 mm Lochraster 100×100 mm · für TO-Tische passend."
              rows={AO_ROWS}
              accordionId="ao"
              isOpen={isOpen("ao")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
            <ProductCard
              img="/images/product-alublech.jpg"
              label="Aluabdeckblech"
              name="AD-Serie — Mit Diagonallochung"
              desc="Aluminium 2 mm · Ø 28 mm Lochraster 100×100 mm + Diagonallochung · für TD-Tische passend."
              rows={AD_ROWS}
              accordionId="ad"
              isOpen={isOpen("ad")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
          </div>
          <p className="sec-p text-carbon/40 text-xs font-mono mt-4">
            Materialstärke 2 mm Aluminium · alle Preise zzgl. MwSt.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          ZUBEHÖR — Cinematic divider
          ════════════════════════════════════════════════════════════════════ */}
      <div id="zubehoer" className="zubehoer-banner bg-carbon px-6 md:px-10 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-4">
          <div className="zubehoer-left flex items-center gap-4">
            <div className="zubehoer-plasma-line w-px h-10 bg-plasma" />
            <div>
              <p className="text-plasma text-xs font-mono uppercase tracking-[0.3em] mb-1">Ab hier</p>
              <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tightest">Zubehör</h3>
            </div>
          </div>
          <p className="zubehoer-right text-white/40 text-sm md:ml-8 max-w-lg">
            Hubböcke, Brücken, Spannwerkzeug, Anschläge & Winkel — alles kompatibel mit dem Ø 28 mm
            Lochsystem.
          </p>
        </div>
      </div>

      {/* ── 3: Hubböcke ── */}
      <section
        ref={(el) => { sectionRefs.current[3] = el; }}
        className="bg-white px-6 md:px-10 py-16 md:py-24 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Zubehör · Hubböcke</SectionLabel>
          <h2 className="sec-h2 text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-3">
            Hubböcke
          </h2>
          <p className="sec-p text-carbon/60 text-base leading-relaxed mb-10 max-w-2xl">
            Höhenverstellbar 700–950 mm. Selbsthemmendes Spindelsystem. Tragfähigkeit bis 2000 kg.
            4×360° drehbare Blickle-Kugellagerrollen. Komplett montiert. RAL 5015.
          </p>
          <div className="products-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProductCard
              img="/images/product-hubbock.jpg"
              label="Hubbock"
              name="Hubbock höhenverstellbar"
              desc="3 Breiten: 1080 / 1280 / 1480 mm. Stufenlos verstellbar 700–950 mm. Selbsthemmend."
              rows={HB_ROWS}
              accordionId="hb"
              isOpen={isOpen("hb")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
            <ProductCard
              img="/images/product-hubbock-abdeckung.jpg"
              label="Hubbock Zubehör"
              name="Abdeckungen"
              desc="15 mm S355 Stahl · Ø 28 mm Lochsystem · festverschraubbar. Passend zu allen Hubbock-Breiten."
              rows={HB_ABD_ROWS}
              accordionId="hb-abd"
              isOpen={isOpen("hb-abd")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
            <ProductCard
              img="/images/product-schonleiste.jpg"
              label="Hubbock Zubehör"
              name="Schonleisten PE 1000"
              desc="Kunststoff PE 1000 · schützt empfindliche Oberflächen. 3 Längen passend zu den Hubbock-Breiten."
              rows={HB_SCH_ROWS}
              accordionId="hb-sch"
              isOpen={isOpen("hb-sch")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 4: Brücken ── */}
      <section
        ref={(el) => { sectionRefs.current[4] = el; }}
        className="bg-white px-6 md:px-10 py-16 md:py-24 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Zubehör · Schweißtischbrücken</SectionLabel>
          <h2 className="sec-h2 text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-3">
            Schweißtischbrücken
          </h2>
          <p className="sec-p text-carbon/60 text-base leading-relaxed mb-10 max-w-2xl">
            Zum Verbinden mehrerer Tische oder mit separatem Fuß als Erweiterung. Material S355 / 15 mm.
            Montageset inklusive. Diagonallochung Ø 28 mm.
          </p>
          <div className="products-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductCard
              img="/images/product-bruecke.jpg"
              label="Schweißtischbrücke"
              name="Brücke"
              desc="11 Längen von 500 bis 2000 mm. Breite 300 mm. Tiefe 200 mm. Material S355 / 15 mm."
              rows={SB_ROWS}
              accordionId="sb"
              isOpen={isOpen("sb")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
            <ProductCard
              img="/images/product-brueckenfuss.jpg"
              label="Brücken-Zubehör"
              name="Brückenfuß"
              desc="Für freistehenden Betrieb der Brücke ohne Schweißtisch. Stabile Stahlkonstruktion."
              rows={[{ a: "BF750x080", b: "–", netto: "79,00 €", brutto: "94,01 €" }]}
              accordionId="sb-fuss"
              isOpen={isOpen("sb-fuss")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 5: Spannwerkzeug ── */}
      <section
        ref={(el) => { sectionRefs.current[5] = el; }}
        className="bg-white px-6 md:px-10 py-16 md:py-24 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Zubehör · Spannwerkzeug</SectionLabel>
          <h2 className="sec-h2 text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-10">
            Spannwerkzeug
          </h2>
          <div className="products-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductCard
              img="/images/product-schraubzwinge.jpg"
              label="Spannwerkzeug"
              name="Schraubzwingen"
              desc="Ø 28 mm, Ganzstahl, Eigenhemmung im Tisch. 2 Größen verfügbar."
              rows={SCHRAUBZWINGE_ROWS}
              accordionId="sz"
              isOpen={isOpen("sz")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
            <ProductCard
              img="/images/product-absteckbolzen.jpg"
              label="Spannwerkzeug"
              name="Absteckbolzen"
              desc="Einfaches Abstecken von Anschlägen. Kombinierbar mit Alu-Prismen. Material: S355."
              rows={[{ a: "AB025.028", b: "–", netto: "12,00 €", brutto: "14,28 €" }]}
              accordionId="ab"
              isOpen={isOpen("ab")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
            <ProductCard
              img="/images/product-schnellspanner.jpg"
              label="Spannwerkzeug"
              name="Schnellspanner Vertikal"
              desc="Ø 28 mm, Spannkraft 4000 N (ca. 400 kg), einstellbare Höhe."
              rows={[{ a: "SD.200.028", b: "–", netto: "59,00 €", brutto: "70,21 €" }]}
              accordionId="sd"
              isOpen={isOpen("sd")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
            <ProductCard
              img="/images/product-schnellspannkugelbolzen.jpg"
              label="Spannwerkzeug"
              name="Schnellspannkugelbolzen"
              desc="Ø 28 mm, bis 22 kN (ca. 2200 kg), Spannbereich 28–32 mm, verschleißfestes Messing."
              rows={[{ a: "KB030.028", b: "–", netto: "38,00 €", brutto: "45,22 €" }]}
              accordionId="kb"
              isOpen={isOpen("kb")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 6: Anschläge & Winkel ── */}
      <section
        ref={(el) => { sectionRefs.current[6] = el; }}
        className="bg-white px-6 md:px-10 py-16 md:py-24 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Zubehör · Anschläge & Winkel</SectionLabel>
          <h2 className="sec-h2 text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-10">
            Anschläge & Winkel
          </h2>
          <div className="products-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductCard
              img="/images/product-alu-prisma.jpg"
              label="Positionierhilfe"
              name="Alu-Prismen 90° / 120°"
              desc="Zum schonenden Spannen von flachen Bauteilen, Vierkant- und Rundrohren. Neodym-Magnet. Kompatibel mit Absteckbolzen. Material: AlMgSi."
              rows={[{ a: "AP004.032", b: "–", netto: "23,00 €", brutto: "27,37 €" }]}
              accordionId="ap"
              isOpen={isOpen("ap")}
              onToggle={toggle}
              cta={DefaultCTA}
            />
            <ProductCard
              img="/images/product-anschlag.jpg"
              label="Anschläge"
              name="Anschläge"
              desc="15 mm S355 J2+N · Bohrung Ø 28 mm. 4 Varianten: Standard, Langloch, kombiniert, durchgehend."
              rows={ANSCHLAG_ROWS}
              accordionId="as"
              isOpen={isOpen("as")}
              onToggle={toggle}
              colA="Maße"
              cta={DefaultCTA}
            />
            <ProductCard
              img="/images/product-winkel.jpg"
              label="Winkel"
              name="Winkel"
              desc="Auch als Tischverlängerung einsetzbar. Sonderanfertigungen möglich. 6 Standardgrößen."
              rows={WINKEL_ROWS}
              accordionId="wa"
              isOpen={isOpen("wa")}
              onToggle={toggle}
              colA="Maße"
              cta={DefaultCTA}
            />
            <ProductCard
              img="/images/product-winkelschablone.jpg"
              label="Positionierhilfe"
              name="Winkelschablonen"
              desc="Präzises Ausrichten von Werkstücken. Sämtliche Anschläge kompatibel mit Schnellspannkugelbolzen."
              rows={WINKELSCHABLONE_ROWS}
              accordionId="ws"
              isOpen={isOpen("ws")}
              onToggle={toggle}
              colA="Maße"
              cta={DefaultCTA}
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 7: Versand ── */}
      <section
        ref={(el) => { sectionRefs.current[7] = el; }}
        className="versand-section bg-white px-6 md:px-10 py-16 md:py-24 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Versand & Konditionen</SectionLabel>
          <h2 className="sec-h2 text-carbon text-3xl md:text-4xl font-bold tracking-tightest mb-8">
            Lieferung & Versand
          </h2>
          <div className="border border-carbon/10 divide-y divide-carbon/10 mb-10">
            {[
              {
                label: "Versand Deutschland",
                value: "249,00 € netto",
                sub: "(296,31 € brutto) · zzgl. 79,00 € netto Verpackungspauschale",
              },
              {
                label: "Tische über 2400 mm",
                value: "Versand auf Anfrage",
                sub: "Wir erstellen Ihnen ein individuelles Versandangebot",
              },
              {
                label: "Fertigungszeit",
                value: "ca. 10 Werktage",
                sub: "Ab Auftragsbestätigung",
              },
              {
                label: "Sondermaße",
                value: "Jederzeit realisierbar",
                sub: "Gleicher m²-Preis · Anfrage genügt",
              },
            ].map((row) => (
              <div key={row.label} className="versand-row grid grid-cols-1 md:grid-cols-2 gap-2 px-6 py-5">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-carbon/40 mb-1">
                    {row.label}
                  </p>
                  <p className="text-carbon font-semibold">{row.value}</p>
                </div>
                <p className="text-carbon/50 text-sm self-center">{row.sub}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/#konfigurator"
              className="versand-cta bg-plasma text-white font-semibold px-8 py-4 text-base hover:bg-plasma/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-6px_rgba(31,169,217,0.5)]"
            >
              Jetzt konfigurieren
            </Link>
            <Link
              href="/kontakt"
              className="versand-cta border border-carbon/20 text-carbon font-semibold px-8 py-4 text-base hover:border-carbon/40 transition-colors"
            >
              Direkt anfragen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
