import Link from "next/link";

const navLinks = [
  { label: "Schweißtische", href: "/schweißtische" },
  { label: "Spanntische", href: "/spanntische" },
  { label: "Zubehör", href: "/zubehör" },
  { label: "Konfigurator", href: "/konfigurator" },
  { label: "Katalog", href: "/katalog" },
];

const companyLinks = [
{ label: "Über uns", href: "/ueber-uns" },
  { label: "Referenzen", href: "/referenzen" },
  { label: "Wissen", href: "/wissen" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-carbon/10 px-6 md:px-10 pt-16 md:pt-20 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 pb-12 md:pb-16 border-b border-carbon/10">
          {/* Col 1 — Logo + About */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" fill="#1FA9D9" />
                <rect x="6" y="10" width="20" height="3" fill="white" />
                <rect x="6" y="16" width="20" height="3" fill="white" />
                <rect x="6" y="22" width="12" height="3" fill="white" />
              </svg>
              <span className="text-carbon font-bold text-base tracking-tight">
                LOIHL
              </span>
            </Link>
            <p className="text-carbon/60 text-sm leading-relaxed">
              Schweißtische und Spanntische aus bayerischer Manufaktur.
              Maßgefertigt. Persönlich geprüft. Direkt vom Inhaber.
            </p>
            <p className="text-carbon/60 text-xs font-mono">
              Hangweg 5a · 84180 Loiching
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="text-carbon text-xs font-mono uppercase tracking-widest">
              Produkte
            </h3>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-carbon/60 text-sm hover:text-carbon transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div className="flex flex-col gap-4">
            <h3 className="text-carbon text-xs font-mono uppercase tracking-widest">
              Unternehmen
            </h3>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-carbon/60 text-sm hover:text-carbon transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Trust Badges + Kontakt */}
          <div className="flex flex-col gap-5">
            <h3 className="text-carbon text-xs font-mono uppercase tracking-widest">
              Kontakt
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+4917643444600"
                className="text-carbon/60 text-sm hover:text-plasma transition-colors font-mono"
              >
                0176 43444600
              </a>
              <a
                href="mailto:kontakt@loihl-metallbau.de"
                className="text-carbon/60 text-sm hover:text-plasma transition-colors"
              >
                kontakt@loihl-metallbau.de
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-2 flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 border border-carbon/10 px-3 py-2 w-fit">
                <span className="text-plasma text-sm">★★★★★</span>
                <span className="text-carbon/60 text-xs font-mono">
                  5,0 Google Rezensionen
                </span>
              </div>
              <div className="inline-flex items-center gap-2 border border-carbon/10 px-3 py-2 w-fit">
                <svg
                  className="w-4 h-4 text-carbon/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="square"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-carbon/60 text-xs font-mono">
                  Made in Bayern
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8">
          <p className="text-carbon/60 text-xs font-mono">
            © 2026 Loihl Metall- und Systembau. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/impressum"
              className="text-carbon/60 text-xs hover:text-carbon transition-colors"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="text-carbon/60 text-xs hover:text-carbon transition-colors"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
