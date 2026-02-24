"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

/** Tipo do usuário (compatível com mockUsers da página). */
export type TimeOverlapUser = {
  name: string;
  role: string;
  timezone: string;
  avatarUrl?: string | null;
  status: string;
};

type TimeOverlapBarProps = {
  users: TimeOverlapUser[];
};

const WORK_START = 9; // 09:00
const WORK_END = 18; // 18:00
const MINUTES_PER_DAY = 24 * 60;

/**
 * Retorna a hora local (0-24) e minuto para um instante UTC em um timezone.
 */
function getLocalHourMinute(date: Date, timezone: string): { hour: number; minute: number } {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  return { hour, minute };
}

/**
 * Calcula onde o horário comercial (09:00–18:00 no fuso local) cai na régua de 24h UTC.
 * Retorna start e width em porcentagem (0–100).
 */
function getWorkSegmentPercentages(timezone: string): { startPercent: number; widthPercent: number } {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();

  const utcMidnight = Date.UTC(year, month, day, 0, 0, 0);
  let startMin: number | null = null;
  let endMin: number | null = null;

  for (let min = 0; min < MINUTES_PER_DAY; min += 15) {
    const d = new Date(utcMidnight + min * 60 * 1000);
    const { hour, minute } = getLocalHourMinute(d, timezone);
    const localMinutes = hour * 60 + minute;

    const workStartMinutes = WORK_START * 60;
    const workEndMinutes = WORK_END * 60;

    if (startMin === null && localMinutes >= workStartMinutes) {
      startMin = min;
    }
    if (localMinutes <= workEndMinutes) {
      endMin = min + 15;
    }
  }

  const start = startMin ?? 0;
  const end = endMin ?? MINUTES_PER_DAY;
  const startPercent = (start / MINUTES_PER_DAY) * 100;
  // Se o expediente cruzar meia-noite UTC, evita largura negativa
  const widthPercent = Math.max(0, ((end - start) / MINUTES_PER_DAY) * 100);

  return { startPercent, widthPercent };
}

export default function TimeOverlapBar({ users }: TimeOverlapBarProps) {
  const { translations } = useLanguage();

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
      {/* Régua de 24h UTC */}
      <div className="mb-4 flex justify-between text-xs text-white/50">
        <span>0h UTC</span>
        <span>6h</span>
        <span>12h</span>
        <span>18h</span>
        <span>24h UTC</span>
      </div>

      <div className="space-y-3">
        {users.map((user, index) => {
          const { startPercent, widthPercent } = getWorkSegmentPercentages(user.timezone);
          return (
            <div
              key={`${user.name}-${user.timezone}`}
              className="flex items-center gap-4"
            >
              <div className="w-28 flex-shrink-0 truncate text-sm text-white/80">
                {user.name}
              </div>
              <div className="relative h-10 flex-1 overflow-hidden rounded-xl bg-white/5">
                {/* Faixa de horário comercial: cresce com scaleX ao carregar */}
                <motion.div
                  className="absolute inset-y-0 rounded-xl bg-emerald-500/40"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                    transformOrigin: "left",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
