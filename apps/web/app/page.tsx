import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Ticket, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Cpu, 
  QrCode,
  Globe 
} from "lucide-react";

import { NavButtons } from "@/components/landing/nav-buttons";
import { HeroButtons } from "@/components/landing/hero-buttons";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/home"); 
  }

  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-brand" />,
      title: "Queue-Based Booking",
      description: "Powered by BullMQ & Redis to handle thousands of concurrent requests without a single overbooked seat."
    },
    {
      icon: <Zap className="w-6 h-6 text-brand" />,
      title: "Real-time Engine",
      description: "WebSocket integration ensures users see live seat availability and instant booking confirmations."
    },
    {
      icon: <QrCode className="w-6 h-6 text-brand" />,
      title: "Secure Check-ins",
      description: "Built-in QR scanner for organizers to verify tickets instantly and prevent duplicate entries."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-brand" />,
      title: "Live Analytics",
      description: "Track revenue, attendance percentages, and check-in velocity with our comprehensive organizer console."
    }
  ];

  return (
    <div className="relative min-h-screen bg-zinc-950 selection:bg-brand/30 overflow-x-hidden">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-brand/10 blur-[140px] rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <header className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-zinc-800/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="bg-brand p-2 rounded-xl shadow-lg shadow-brand/20">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter italic uppercase">Eventra</span>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <a href="#features" className="hover:text-brand transition-colors">Infrastructure</a>
          <a href="#solutions" className="hover:text-brand transition-colors">Solutions</a>
          <a href="#tech" className="hover:text-brand transition-colors">Tech Stack</a>
        </nav>

        <NavButtons />
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">

        <section className="flex flex-col items-center text-center">
          <Badge 
            variant="outline" 
            className="mb-8 border-zinc-800 bg-zinc-900/50 text-zinc-400 px-5 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur-md rounded-full"
          >
            <span className="mr-3 inline-block h-2 w-2 rounded-full bg-brand animate-pulse" />
            Infrastructure for high-scale events
          </Badge>

          <h1 className="max-w-5xl text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-9xl leading-[0.9] uppercase italic">
            Ticketing at <br />
            <span className="text-brand">Scale.</span>
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-lg text-zinc-500 sm:text-xl leading-relaxed font-medium">
            A production-grade ticketing ecosystem designed for high-concurrency. 
            From <span className="text-white">Redis-backed queues</span> to <span className="text-white">Real-time WebSockets</span>, 
            we handle the complex stuff so you can host the best events.
          </p>

          <HeroButtons />

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <StatItem value="10k+" label="Req/sec handled" />
            <StatItem value="0" label="Overbooked seats" />
            <StatItem value="100ms" label="Avg. Confirmation" />
            <StatItem value="99.9%" label="System Uptime" />
          </div>
        </section>

        <section id="features" className="mt-40 space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tight sm:text-5xl">Built for Performance</h2>
            <p className="text-zinc-500 max-w-xl mx-auto font-medium">Our architecture is optimized for the moments when millions click "Buy" at the same time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] hover:bg-zinc-900 transition-all hover:border-brand/50">
                <div className="mb-6 p-4 bg-zinc-950 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="solutions" className="mt-40">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[3rem] p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={120} className="text-brand" />
            </div>
            
            <div className="max-w-2xl space-y-6">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">System Status: Operational</Badge>
              <h2 className="text-4xl font-black text-white italic uppercase leading-none">
                Experience the <br /> <span className="text-brand">Real-Time</span> Pulse
              </h2>
              <p className="text-zinc-500 font-medium">
                Our live dashboard shows you exactly what's happening. No more refreshing pages to see if an event is sold out. Our WebSocket layer pushes updates to every client in under 50ms.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live Seat Updates</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Queue Processing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tech" className="mt-32 text-center space-y-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">The Modern Event Stack</p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-bold text-white tracking-tighter">Next.js 15</span>
            <span className="text-2xl font-bold text-white tracking-tighter">TypeScript</span>
            <span className="text-2xl font-bold text-white tracking-tighter">Drizzle ORM</span>
            <span className="text-2xl font-bold text-white tracking-tighter">BullMQ</span>
            <span className="text-2xl font-bold text-white tracking-tighter">Redis</span>
            <span className="text-2xl font-bold text-white tracking-tighter">PostgreSQL</span>
            <span className="text-2xl font-bold text-white tracking-tighter">TurboRepo</span>
          </div>
        </section>

        <div className="mt-32 pt-12 border-t border-zinc-900 flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">
          <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> Global Distribution</span>
          <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> PCI-DSS Compliant</span>
          <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> Edge Runtime</span>
        </div>
      </main>

      <footer className="px-6 py-12 border-t border-zinc-900 text-center text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
        &copy; 2026 Eventra Systems. Built for the future of live experiences.
      </footer>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-zinc-950 p-10 flex flex-col items-center justify-center">
      <p className="text-4xl font-black text-white tracking-tighter mb-2">{value}</p>
      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{label}</p>
    </div>
  );
}