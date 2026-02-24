"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type Language = "en" | "pt";

const translations = {
  en: {
    header: {
      welcomePrefix: "Welcome,",
      loadingSession: "Loading session…",
      signOut: "Sign Out",
      sessionExpired: "Your session has expired. Redirecting to login…",
    },
    titles: {
      teamMembers: "Team Members",
      timeOverlap: "Time Overlap",
      dailyStandups: "Daily Stand-ups",
    },
    standups: {
      sectionLabel: "New update",
      yesterdayLabel: "What did I do?",
      yesterdayPlaceholder:
        "Quick summary of what you completed yesterday…",
      todayLabel: "What will I do?",
      todayPlaceholder: "What are the next important deliveries…",
      blockersLabel: "Blockers?",
      blockersPlaceholder:
        "Any risk, dependency or blocker where you need help…",
      publishButton: "Publish",
      remoteDailyTag: "Remote daily",
      yesterdayTitle: "Yesterday",
      todayTitle: "Today",
      blockersTitle: "Blockers",
    },
    statuses: {
      trabalhando: "Working",
      dormindo: "Sleeping",
      offline: "Offline",
    },
    roles: {
      teamMember: "Team Member",
    },
  },
  pt: {
    header: {
      welcomePrefix: "Bem-vindo,",
      loadingSession: "Carregando sessão…",
      signOut: "Sair",
      sessionExpired: "Sua sessão expirou. Redirecionando para a tela de login…",
    },
    titles: {
      teamMembers: "Membros da Equipe",
      timeOverlap: "Sobreposição de Horários",
      dailyStandups: "Daily Stand-ups",
    },
    standups: {
      sectionLabel: "Nova atualização",
      yesterdayLabel: "O que fiz?",
      yesterdayPlaceholder:
        "Resumo rápido do que você concluiu ontem…",
      todayLabel: "O que farei?",
      todayPlaceholder: "Quais são as próximas entregas importantes…",
      blockersLabel: "Impedimentos?",
      blockersPlaceholder:
        "Algum risco, dependência ou bloqueio que precisa de ajuda…",
      publishButton: "Publicar",
      remoteDailyTag: "Daily remoto",
      yesterdayTitle: "Ontem",
      todayTitle: "Hoje",
      blockersTitle: "Impedimentos",
    },
    statuses: {
      trabalhando: "Trabalhando",
      dormindo: "Dormindo",
      offline: "Offline",
    },
    roles: {
      teamMember: "Membro da Equipe",
    },
  },
} as const;

type Translations = (typeof translations)["en"];

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  translations: Translations;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () =>
        setLanguage((prev) => (prev === "en" ? "pt" : "en")),
      translations: translations[language],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

