import Link from "next/link";

export default function ManufakturStory() {
  return (
    <section className="bg-off-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left — Image Placeholder */}
        <div className="relative">
          <div className="aspect-[4/5] md:aspect-[3/4] bg-gray-300 border border-gray-400 flex items-center justify-center">
            <span className="text-gray-500 text-xs font-mono uppercase tracking-widest text-center px-6">
              FOTO: Werkstatt Loiching — S/W
            </span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-plasma hidden md:block" />
        </div>

        {/* Right — Text */}
        <div className="flex flex-col">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-4">
            Manufaktur
          </p>
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tightest mb-6">
            Eine Werkstatt. Ein Inhaber. Jeder Tisch persönlich geprüft.
          </h2>
          <p className="text-carbon/70 text-base leading-relaxed mb-5">
            Seit Jahren bauen wir Schweißtische, die halten. Nicht weil wir es
            müssen, sondern weil wir es können. Jeder Tisch verlässt unsere
            Werkstatt in Loiching mit dem Wissen, dass er gut ist. Das ist nicht
            Arroganz. Das ist Handwerk.
          </p>
          <p className="text-carbon/70 text-base leading-relaxed mb-8">
            Wir arbeiten ohne anonyme Lieferketten und ohne Kompromisse beim
            Material. Was wir nicht selbst überprüfen können, verlässt unsere
            Werkstatt nicht. So war es immer, so wird es bleiben.
          </p>

          {/* Pull Quote */}
          <blockquote className="border-l-4 border-plasma pl-5 py-2 mb-8">
            <p className="text-plasma text-lg md:text-xl font-bold italic leading-snug">
              &ldquo;Ich kenne jeden Tisch, der hier rausgeht.&rdquo;
            </p>
            <cite className="text-carbon/60 text-sm font-mono mt-2 block not-italic">
              — Daniel Loihl, Inhaber
            </cite>
          </blockquote>

          <Link
            href="/manufaktur"
            className="inline-flex items-center gap-2 text-carbon font-semibold text-sm border-b-2 border-plasma pb-0.5 w-fit hover:text-plasma transition-colors"
          >
            Zur Manufaktur
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="square"
                strokeWidth={2}
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
