"use client";

import { useState } from "react";
import { Home, Ticket, CalendarDays, History, PlusCircle, LogOut, Menu, X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const NavContent = () => (
    <div className="flex h-full flex-col px-4 py-8">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="bg-brand p-1.5 rounded-lg shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)]">
          <Ticket className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tighter uppercase italic">Eventra</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                isActive 
                  ? "bg-brand/10 text-brand shadow-[inset_0_0_10px_rgba(249,115,22,0.1)]" 
                  : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-brand" : "text-zinc-500 group-hover:text-zinc-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <Link href="/events/create" onClick={() => setIsOpen(false)}>
          <div className="flex items-center justify-center gap-2 w-full bg-white text-zinc-950 font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-colors cursor-pointer text-sm">
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

  return (
  <>
    {/* --- MOBILE TOP BAR (Fixed to top) --- */}
    <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-6 flex items-center justify-between z-[100]">
      <div className="flex items-center gap-2">
        <div className="bg-brand p-1.5 rounded-lg">
          <Ticket className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-white italic uppercase tracking-tighter">Eventra</span>
      </div>
      
      {/* The Hamburger Button */}
      <button 
        onClick={toggleMenu} 
        className="text-zinc-400 hover:text-white p-2 transition-colors active:scale-95"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>
    </div>

    {/* --- DESKTOP SIDEBAR (Static on left) --- */}
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-zinc-950 border-r border-zinc-900 z-50">
      <NavContent />
    </aside>

    {/* --- MOBILE DRAWER --- */}
    <div className={cn(
      "lg:hidden fixed inset-0 z-[110] transition-all duration-300",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Clickable Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "opacity-0"
        )} 
        onClick={toggleMenu} 
      />
      
      {/* Drawer Content */}
      <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-zinc-950 border-r border-zinc-800 shadow-2xl">
        <NavContent />
      </aside>
    </div>
  </>
);
}