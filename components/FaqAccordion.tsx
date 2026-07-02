"use client";
import { useState } from "react";
type FaqItem = { question: string; answer: string };
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-0 border-t border-carbon/10">
      {items.map((item, i) => (
        <div key={i} className="border-b border-carbon/10">
          <button
            className="w-full flex items-center justify-between py-5 text-left text-carbon font-medium text-base hover:text-plasma transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.question}</span>
            <span className="text-plasma text-lg ml-4 shrink-0">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <p className="pb-5 text-carbon/60 text-base leading-relaxed">{item.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}
