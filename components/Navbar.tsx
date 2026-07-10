"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Produkte", href: "/produkte" },
{ label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-carbon/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <img
            src="/images/logo-loihl-nav.png"
            alt="Loihl Metall- und Systembau"
            className="h-10 md:h-11 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-carbon/60 hover:text-carbon text-sm font-medium px-4 py-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex">
          <Link
            href="/#konfigurator"
            className="bg-plasma text-white text-sm font-semibold px-5 py-2.5 hover:bg-plasma/90 transition-colors"
          >
            Konfigurator starten
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden p-2 -mr-2 text-carbon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-carbon/10">
          <nav className="px-6 py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-carbon text-base font-medium py-3 border-b border-carbon/10 last:border-0"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#konfigurator"
              className="mt-5 bg-plasma text-white text-base font-semibold px-5 py-3 text-center hover:bg-plasma/90 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Konfigurator starten
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
