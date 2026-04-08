import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Ticket } from "lucide-react";

import { NavButtons } from "@/components/landing/nav-buttons";
import { HeroButtons } from "@/components/landing/hero-buttons";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/home"); 
  }

  return (
    <div className="relative min-h-screen bg-background selection:bg-brand/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-brand/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-brand p-2 rounded-xl">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Eventra</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>

        <NavButtons />
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-32">
        
        <Badge 
          variant="outline" 
          className="mb-8 border-brand/30 bg-brand/10 text-brand px-4 py-1.5 text-sm font-medium backdrop-blur-md rounded-full"
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand animate-pulse" />
          Trusted by 100+ event organizers
        </Badge>

        <h1 className="max-w-4xl text-6xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl leading-[1.1]">
          Event Ticketing <br />
          <span className="text-brand">Made Simple</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl leading-relaxed">
          Start selling tickets in minutes. Issue tickets, manage passes, handle concurrency queues, track check-ins, and analyze performance — all in one platform.
        </p>

        <HeroButtons />

        {/* Info/Stat Card */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center sm:text-right">
            <p className="text-5xl font-bold text-brand tracking-tighter">10k+</p>
            <p className="text-sm text-zinc-400 mt-1 uppercase tracking-wider font-medium">Req/sec handled</p>
          </div>
          <div className="hidden h-16 w-px bg-zinc-800 sm:block" />
          <div className="text-center sm:text-left">
            <p className="text-5xl font-bold text-white tracking-tighter">0</p>
            <p className="text-sm text-zinc-400 mt-1 uppercase tracking-wider font-medium">Overbooked seats</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-zinc-500 font-medium">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand" /> No credit card required
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand" /> Setup in 2 minutes
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand" /> Cancel anytime
          </span>
        </div>
      </main>
    </div>
  );
}