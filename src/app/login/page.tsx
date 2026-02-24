"use client";

import AnimatedBackground from "@/components/AnimatedBackground";
import { Github } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const handleGithubLogin = async () => {
    const redirectTo =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error("Erro ao iniciar login com GitHub:", error.message);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-8 text-white">
      <AnimatedBackground />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
          <header className="mb-6 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
              Bem-vindo
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Entrar no ChronoGlass
            </h1>
            <p className="mt-2 text-xs text-white/60">
              Centralize seus daily stand-ups, horários e rituais remotos em um
              único lugar.
            </p>
          </header>

          <button
            type="button"
            onClick={handleGithubLogin}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/40 transition hover:bg-white/20 hover:shadow-[0_0_26px_rgba(255,255,255,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <Github className="h-4 w-4" />
            <span>Entrar com o GitHub</span>
          </button>

          <p className="mt-4 text-[10px] text-center text-white/40">
            Usaremos apenas seu nome, avatar e e-mail do GitHub para criar sua
            conta.
          </p>
        </section>
      </div>
    </main>
  );
}

