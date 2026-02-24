import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

type Status = "trabalhando" | "dormindo" | "offline";

export type TeamMemberCardProps = {
  name: string;
  role: string;
  timezone?: string; // Agora pode ser opcional
  avatarUrl?: string | null;
  status: Status;
};

const statusStyles: Record<Status, string> = {
  trabalhando: "bg-emerald-500",
  dormindo: "bg-blue-900",
  offline: "bg-zinc-500",
};

/**
 * Retorna a hora local formatada (HH:mm) para o timezone informado.
 * Usa Intl.DateTimeFormat nativo do JavaScript.
 */
function getLocalTime(timezone?: string): string | null {
  if (!timezone) return null;
  const now = new Date();
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
}

/**
 * Extrai iniciais do nome (ex: "Maria Silva" -> "MS").
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function TeamMemberCard({
  name,
  role,
  timezone,
  avatarUrl,
  status,
}: TeamMemberCardProps) {
  const { translations } = useLanguage();
  const localTime = getLocalTime(timezone);
  const statusDotClass = statusStyles[status];

  let displayRole = role;
  if (role === "Membro da Equipa" || role === "Team Member") {
    displayRole = translations.roles.teamMember;
  }

  return (
    <article
      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
      aria-label={`${name}, ${role}`}
    >
      {/* Esquerda: avatar + nome e cargo */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {avatarUrl ? (
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
            <Image
              src={avatarUrl}
              alt=""
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-medium text-white/90">
            {getInitials(name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium text-white">{name}</p>
          <p className="truncate text-sm text-white/60">{displayRole}</p>
          {/* Exibe o timezone logo abaixo do cargo, discreto, caso exista */}
          {timezone && (
            <p className="truncate text-xs text-white/50 font-mono">{timezone}</p>
          )}
        </div>
      </div>

      {/* Direita: hora em destaque + bolinha de status */}
      <div className="flex flex-shrink-0 flex-col items-end justify-center gap-1 min-w-[65px]">
        {/* Hora principal em destaque */}
        <span className="text-2xl font-bold tabular-nums text-white">
          {localTime}
        </span>
        {/* Alternativa: para exibir o timezone sob a hora (remover do bloco acima se quiser este layout) */}
        {/* {timezone && (
          <span className="text-xs text-white/50 font-mono">{timezone}</span>
        )} */}
        {/* Bolinha de status */}
        <span
          className={`h-3 w-3 rounded-full ${statusDotClass}`}
          title={translations.statuses[status]}
          aria-hidden
        />
      </div>
    </article>
  );
}
