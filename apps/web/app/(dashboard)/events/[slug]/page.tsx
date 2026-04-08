import { db, events } from "@repo/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, Info, ExternalLink, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookingButton } from "@/components/events/booking-button";
import { LiveSeatBadge } from "@/components/events/live-seat-badge";

import { auth } from "@/auth";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const session = await auth();

  const event = await db.query.events.findFirst({
    where: eq(events.slug, slug),
  });

  if (!event) notFound();

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <Badge className="bg-brand/10 text-brand border-brand/20 px-3 py-1">
              Upcoming Event
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-brand" /> 
                {event.startDateTime.toDateString()}
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-brand shrink-0 mt-1" /> 
                <div className="flex flex-col gap-2">
                {event.location.startsWith("http") ? (
                <a 
                    href={event.location} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                >
                    <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white gap-2 rounded-xl h-9 px-4 transition-all"
                    >
                    View on Google Maps 
                    <ExternalLink size={14} className="opacity-50" />
                    </Button>
                </a>
                ) : (
                <span className="text-zinc-400 text-lg">{event.location}</span>
                )}
                </div>
                </div>
            </div>
          </div>

          <div className="aspect-video rounded-[2rem] bg-zinc-900 border border-zinc-800 overflow-hidden relative group">
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
             <div className="flex items-center justify-center h-full text-zinc-800 font-black text-6xl italic tracking-tighter group-hover:scale-105 transition-transform duration-700">
               EVENTRA
             </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Info className="text-brand" size={24} />
              About the Event
            </h2>
            <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-10 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-2xl shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">Price</p>
                <h3 className="text-4xl font-black text-white">₹{event.price}</h3>
              </div>
              <LiveSeatBadge eventId={event.id} initialSeats={event.availableSeats} />
            </div>

            <Separator className="bg-zinc-800 mb-8" />

            <div className="space-y-6">
               <div className="flex items-center justify-between text-sm text-zinc-400">
                 <div className="flex items-center gap-2"><Users size={16} /> Capacity</div>
                 <span className="text-white font-medium">{event.totalSeats} Total</span>
               </div>
               
               <BookingButton 
                eventId={event.id} 
                availableSeats={event.availableSeats} 
                currentUserId={session?.user?.id || ""} 
                eventSlug={event.slug}
              />

               <div className="pt-4 flex flex-col gap-3">
                 <div className="flex items-center gap-2 text-[11px] text-zinc-500 uppercase tracking-wider justify-center">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Secure Queue-Based Booking
                 </div>
               </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}