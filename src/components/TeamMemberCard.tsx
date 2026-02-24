import Image from "next/image";

type Status = "working" | "sleeping" | "offline";

export type TeamMemberCardProps = {
  name: string;
  role: string;
  timezone?: string;
  avatarUrl?: string | null;
  status: Status;
};

const statusStyles: Record<Status, string> = {
  working: "bg-emerald-500",
  sleeping: "bg-blue-900",
  offline: "bg-zinc-500",
};

// Returns the local time (HH:mm) for the given timezone using Intl.DateTimeFormat.
function getLocalTime(timezone?: string): string | null {
  if (!timezone) return null;
  const now = new Date();
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
}

// Extracts initials from the name (e.g. "Maria Silva" -> "MS").
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
  const localTime = getLocalTime(timezone);
  const statusDotClass = statusStyles[status];

  let displayRole = role;
  if (role === "Membro da Equipa" || role === "Team Member") {
    displayRole = "Team Member";
  }

  const statusTitleMap: Record<Status, string> = {
    working: "Working",
    sleeping: "Sleeping",
    offline: "Offline",
  };

  return (
    <article
      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
      aria-label={`${name}, ${role}`}
    >
      {/* Left side: avatar + name and role */}
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
          {/* Show timezone below the role, subtly, when available */}
          {timezone && (
            <p className="truncate text-xs font-mono text-white/50">
              {timezone}
            </p>
          )}
        </div>
      </div>

      {/* Right side: time and status dot */}
      <div className="min-w-[65px] flex flex-shrink-0 flex-col items-end justify-center gap-1">
        <span className="text-2xl font-bold tabular-nums text-white">
          {localTime}
        </span>
        <span
          className={`h-3 w-3 rounded-full ${statusDotClass}`}
          title={statusTitleMap[status]}
          aria-hidden
        />
      </div>
    </article>
  );
}
