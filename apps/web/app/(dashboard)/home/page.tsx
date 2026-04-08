import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { db, events } from "@repo/db";

export default async function HomePage() {
  const allEvents = await db.select().from(events).limit(6);

  return (
    <div className="space-y-10">
      {/* 1. Dashboard Welcome */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Discover Events</h1>
          <p className="text-zinc-400 mt-1 text-lg">Find and book the most anticipated events near you.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-300 px-4 py-2 rounded-lg">
            Lucknow, India
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEvents.map((event) => (
          <Card key={event.id} className="group relative overflow-hidden border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300 backdrop-blur-sm">
            <div className="aspect-[16/10] w-full bg-zinc-800 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent opacity-60" />
               <div className="absolute top-4 right-4">
                 <Badge className="bg-brand text-white border-none px-3 py-1 font-bold">
                   ₹{event.price}
                 </Badge>
               </div>
            </div>

            <CardHeader className="p-5">
              <div className="flex items-center gap-2 text-xs font-medium text-brand uppercase tracking-wider mb-2">
                <Calendar size={12} />
                {event.startDateTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
              <CardTitle className="text-xl text-white group-hover:text-brand transition-colors line-clamp-1">
                {event.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-2">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <MapPin size={14} className="text-zinc-500" />
                <span className="truncate">{event.location}</span>
              </div>
            </CardContent>

            <CardFooter className="p-5 flex items-center justify-between border-t border-zinc-800/50 mt-4">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Users size={14} />
                <span>{event.availableSeats} slots left</span>
              </div>
              <Link href={`/events/${event.slug}`}>
                <div className="p-2 rounded-full bg-zinc-800 text-white group-hover:bg-brand group-hover:scale-110 transition-all">
                  <ArrowUpRight size={18} />
                </div>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {allEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-zinc-800 rounded-3xl">
          <p className="text-zinc-500 mb-4">No events found in your area yet.</p>
          <Link href="/events/create">
            <span className="text-brand font-semibold hover:underline cursor-pointer">Host the first one →</span>
          </Link>
        </div>
      )}
    </div>
  );
}