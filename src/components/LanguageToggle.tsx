"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  const label = language === "en" ? "EN" : "PT";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/80 shadow-sm backdrop-blur-md transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      aria-label="Toggle language"
    >
      {label}
    </button>
  );
}

