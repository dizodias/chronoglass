"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

type Profile = {
  name: string | null;
  avatar_url: string | null;
};

type StandupRow = {
  id: string;
  yesterday: string;
  today: string;
  blockers: string;
  created_at: string;
  profiles: Profile | null;
};

const StandupFeed: React.FC = () => {
  const [standups, setStandups] = useState<StandupRow[]>([]);
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [blockers, setBlockers] = useState("");
   const { language, translations } = useLanguage();

  const loadStandups = async () => {
    const { data, error } = await supabase
      .from("standups")
      .select("*, profiles(name, avatar_url)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar standups:", error.message);
      return;
    }

    setStandups((data ?? []) as StandupRow[]);
  };

  useEffect(() => {
    loadStandups();
  }, []);

  const handlePublish = async () => {
    if (!yesterday.trim() && !today.trim() && !blockers.trim()) {
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "Não foi possível obter o utilizador autenticado.",
        userError?.message
      );
      return;
    }

    const { error: insertError } = await supabase.from("standups").insert([
      {
        user_id: user.id,
        yesterday,
        today,
        blockers,
      },
    ]);

    if (insertError) {
      console.error("Erro ao publicar standup:", insertError.message);
      return;
    }

    setYesterday("");
    setToday("");
    setBlockers("");
    await loadStandups();
  };

  return (
    <section
      className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
      aria-labelledby="card-daily"
    >
      <h2
        id="card-daily"
        className="text-xl font-semibold tracking-tight text-white"
      >
        {translations.titles.dailyStandups}
      </h2>

      {/* Nova Atualização */}
      <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white shadow-inner backdrop-blur-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
          {translations.standups.sectionLabel}
        </p>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/70">
              {translations.standups.yesterdayLabel}
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white shadow-sm outline-none backdrop-blur-md placeholder:text-white/30 focus:ring-2 focus:ring-white/20"
              placeholder={translations.standups.yesterdayPlaceholder}
              value={yesterday}
              onChange={(event) => setYesterday(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/70">
              {translations.standups.todayLabel}
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white shadow-sm outline-none backdrop-blur-md placeholder:text-white/30 focus:ring-2 focus:ring-white/20"
              placeholder={translations.standups.todayPlaceholder}
              value={today}
              onChange={(event) => setToday(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/70">
              {translations.standups.blockersLabel}
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white shadow-sm outline-none backdrop-blur-md placeholder:text-white/30 focus:ring-2 focus:ring-white/20"
              placeholder={translations.standups.blockersPlaceholder}
              value={blockers}
              onChange={(event) => setBlockers(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handlePublish}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90 px-4 py-1.5 text-xs font-medium text-white shadow-[0_0_18px_rgba(168,85,247,0.55)] transition hover:shadow-[0_0_26px_rgba(168,85,247,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            {translations.standups.publishButton}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="mt-6 space-y-3 overflow-y-auto">
        {standups.map((standup) => {
          const profile = standup.profiles;
          const displayName =
            profile?.name ?? (language === "pt" ? "Membro remoto" : "Remote member");
          const avatarUrl =
            profile?.avatar_url ??
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              displayName
            )}`;
          const timestamp = formatDistanceToNow(new Date(standup.created_at), {
            addSuffix: true,
            locale: language === "pt" ? ptBR : enUS,
          });

          return (
          <article
            key={standup.id}
            className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white/80 shadow-sm backdrop-blur-xl"
          >
            <header className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-9 w-9 rounded-full border border-white/20 bg-white/10 object-cover shadow"
                />
                <div>
                  <p className="text-sm font-medium text-white">
                    {displayName}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-300/80">
                    {translations.standups.remoteDailyTag}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] text-white/50">
                {timestamp}
              </span>
            </header>

            <div className="space-y-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  {translations.standups.yesterdayTitle}
                </p>
                <p className="mt-0.5 text-xs text-white/80">
                  {standup.yesterday}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  {translations.standups.todayTitle}
                </p>
                <p className="mt-0.5 text-xs text-white/80">
                  {standup.today}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  {translations.standups.blockersTitle}
                </p>
                <p className="mt-0.5 text-xs text-white/80">
                  {standup.blockers}
                </p>
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
};

export default StandupFeed;

