"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TeamMemberCard from "@/components/TeamMemberCard";
import TimeOverlapBar from "@/components/TimeOverlapBar";
import StandupFeed from "@/components/StandupFeed";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const router = useRouter();

  const SESSION_EXPIRED_MESSAGE =
    "Your session has expired. Redirecting to the login screen…";
  const LOADING_SESSION_MESSAGE = "Loading session…";

  useEffect(() => {
    let isMounted = true;

    // Fetch team members from Supabase
    const fetchTeamMembers = async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.error("Error loading team members:", error.message);
        return;
      }
      if (isMounted) {
        setTeamMembers(data ?? []);
      }
    };

    // Validate current user session on app load
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        return;
      }
      const session = data.session;
      if (!session) {
        setAuthMessage(SESSION_EXPIRED_MESSAGE);
        router.push("/login");
      } else if (isMounted) {
        setUser(session.user);
        fetchTeamMembers();
      }
    };

    fetchSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setAuthMessage(SESSION_EXPIRED_MESSAGE);
        router.push("/login");
      } else {
        setUser(session.user);
        setAuthMessage(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, SESSION_EXPIRED_MESSAGE]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }
    setUser(null);
    router.push("/login");
  };

  return (
    <main className="min-h-screen p-8">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-white">
            ChronoGlass
          </h1>
          <p className="mt-1 text-xs text-white/60">
            {user
              ? `Welcome, ${
                  user.user_metadata?.full_name ?? user.email ?? "user"
                }`
              : authMessage ?? LOADING_SESSION_MESSAGE}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 shadow-sm backdrop-blur-md transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Sign Out
        </button>
      </header>

      {/* Time Overlap */}
      <section className="mt-8" aria-labelledby="overlap-title">
        <h2
          id="overlap-title"
          className="mb-4 text-3xl font-light tracking-wide text-white"
        >
          Time Overlap
        </h2>
        <TimeOverlapBar users={teamMembers} />
      </section>

      {/* Cards grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Card: Team Members (2 columns on desktop) */}
        <section
          className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl lg:col-span-2"
          aria-labelledby="card-membros"
        >
          <h2
            id="card-membros"
            className="text-xl font-semibold tracking-tight text-white"
          >
            Team Members
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={`${member.id}-${member.timezone}`}
                name={member.name}
                role={member.role}
                timezone={member.timezone}
                avatarUrl={member.avatar_url}
                status="working"
              />
            ))}
          </div>
        </section>

        {/* Card: Daily Stand-ups (1 column) */}
        <StandupFeed />
      </div>
    </main>
  );
}
