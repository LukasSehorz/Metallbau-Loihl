"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import { AnimatePresence } from "framer-motion";
import IntroScreen from "./IntroScreen";
import Hero from "./Hero";

// Module-level flag: resets on every page reload, persists across client-side navigation
let introShownInMemory = false;

// useLayoutEffect on client (fires before paint = no flash), useEffect on server (SSR-safe)
const useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function HomeClient({ children }: { children: React.ReactNode }) {
  const [introDone, setIntroDone] = useState(false);

  // Skip intro instantly (before paint) only if navigated here without a reload
  useSafeLayoutEffect(() => {
    if (introShownInMemory) {
      setIntroDone(true);
    }
  }, []);

  function handleComplete() {
    introShownInMemory = true;
    setIntroDone(true);
  }

  return (
    <>
      <AnimatePresence>
        {!introDone && (
          <IntroScreen onComplete={handleComplete} />
        )}
      </AnimatePresence>
      <Hero />
      {children}
    </>
  );
}
