"use client";

import { Home, Ticket, CalendarDays, History, PlusCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Discover", href: "/home", icon: Home },
  { name: "My Tickets", href: "/tickets", icon: Ticket },
  { name: "Created Events", href: "/my-events", icon: CalendarDays },
  { name: "Attended", href: "/history", icon: History },
];

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-4 py-8">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="bg-brand p-1.5 rounded-lg shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)]">
           <Ticket className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tighter">Eventra</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
              isActive ? "bg-brand/10 text-brand shadow-[inset_0_0_10px_rgba(249,115,22,0.1)]" : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
            )}>
              <item.icon size={20} className={cn(isActive ? "text-brand" : "text-zinc-500 group-hover:text-zinc-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <Link href="/events/create">
          <div className="flex items-center justify-center gap-2 w-full bg-white text-zinc-950 font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-colors cursor-pointer">
            <PlusCircle size={18} />
            Create Event
          </div>
        </Link>
        
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}