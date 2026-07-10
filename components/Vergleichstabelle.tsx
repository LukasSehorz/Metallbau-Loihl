const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-600 mx-auto"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="square"
      strokeWidth={2.5}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const XIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400 mx-auto"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="square"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const rows = [
  {
    criterion: "Preis pro m²",
    loihl: <span className="text-plasma font-mono font-bold text-sm">ab 1.980 €</span>,
    demmler: <span className="text-gray-500 text-sm">höher</span>,
    siegmund: <span className="text-gray-500 text-sm">höher</span>,
  },
  {
    criterion: "Lieferzeit",
    loihl: <span className="text-carbon font-mono font-semibold text-sm">2 Wochen</span>,
    demmler: <span className="text-gray-500 text-sm">8–12 Wochen</span>,
    siegmund: <span className="text-gray-500 text-sm">6–10 Wochen</span>,
  },
  {
    criterion: "Maßanfertigung",
    loihl: <CheckIcon />,
    demmler: <span className="text-gray-400 text-xs text-center block">Aufpreis</span>,
    siegmund: <span className="text-gray-400 text-xs text-center block">Aufpreis</span>,
  },
  {
    criterion: "Made in Germany",
    loihl: <CheckIcon />,
    demmler: <CheckIcon />,
    siegmund: <XIcon />,
  },
  {
    criterion: "Direkter Inhaberkontakt",
    loihl: <CheckIcon />,
    demmler: <XIcon />,
    siegmund: <XIcon />,
  },
];

export default function Vergleichstabelle() {
  return (
    <section className="bg-off-white px-6 md:px-10 py-16 md:py-24 lg:py-28">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 md:mb-14">
          <p className="text-plasma text-xs font-mono uppercase tracking-widest mb-3">
            Vergleich
          </p>
          <h2 className="text-carbon text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tightest mb-4">
            Loihl vs. Demmler vs. Siegmund
          </h2>
          <p className="text-carbon/60 text-base">
            Wir halten, was andere versprechen.
          </p>
        </div>

        <div className="overflow-x-auto -mx-6 md:mx-0">
          <table className="w-full min-w-[560px] border-collapse">
            {/* Header */}
            <thead>
              <tr>
                <th className="text-left py-4 px-6 text-carbon/50 text-xs font-mono uppercase tracking-widest font-normal w-[35%]">
                  Kriterium
                </th>
                <th className="py-4 px-4 text-center w-[21%]">
                  <div className="bg-plasma/10 border border-plasma/30 px-3 py-2">
                    <span className="text-carbon text-sm font-bold">LOIHL</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center text-carbon/50 text-sm font-semibold w-[22%]">
                  Demmler
                </th>
                <th className="py-4 px-4 text-center text-carbon/50 text-sm font-semibold w-[22%]">
                  Siegmund
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.criterion}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-4 px-6 text-carbon text-sm font-medium border-t border-gray-200">
                    {row.criterion}
                  </td>
                  <td className="py-4 px-4 text-center border-t border-gray-200 bg-plasma/5 border-x border-plasma/20">
                    {row.loihl}
                  </td>
                  <td className="py-4 px-4 text-center border-t border-gray-200">
                    {row.demmler}
                  </td>
                  <td className="py-4 px-4 text-center border-t border-gray-200">
                    {row.siegmund}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-carbon/40 text-xs mt-4 font-mono">
          Preisangaben und Lieferzeiten basieren auf öffentlich verfügbaren
          Informationen (Stand Mai 2026).
        </p>
      </div>
    </section>
  );
}
