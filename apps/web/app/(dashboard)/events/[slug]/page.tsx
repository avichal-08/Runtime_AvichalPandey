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

const STATIC_BANNER = "https://res.cloudinary.com/dcwso7qst/image/upload/v1775715566/WhatsApp_Image_2026-04-09_at_11.48.12_t1u0ra.jpg";

export default async function EventDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const session = await auth();

  const event = await db.query.events.findFirst({
    where: eq(events.slug, slug),
  });

  if (!event) notFound();

  const displayImage = event.imageUrl || STATIC_BANNER;

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <Badge className="bg-brand/10 text-brand border-brand/20 px-3 py-1 font-bold italic uppercase tracking-wider">
              Upcoming Event
            </Badge>
            <h1 className="text-5xl font-black tracking-tighter text-white leading-[1.1] italic uppercase">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-zinc-400">
              <div className="flex items-center gap-2 font-medium">
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
                    <span className="text-zinc-400 text-lg font-medium">{event.location}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-video rounded-[2.5rem] bg-zinc-900 border border-zinc-800 overflow-hidden group shadow-2xl">
              <div 
                className="absolute inset-0 opacity-40 blur-[100px] scale-150 transition-all duration-1000 group-hover:opacity-60" 
                style={{ 
                  backgroundImage: `url(${displayImage})`, 
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <img 
                src={displayImage} 
                alt={event.title}
                className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
              {!event.imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <span className="text-zinc-400/20 font-black text-8xl italic tracking-tighter uppercase select-none">
                     Eventra
                   </span>
                </div>
              )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-2 italic uppercase">
              <Info className="text-brand" size={24} />
              About the Event
            </h2>
            <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap font-medium">
              {event.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-10 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-1 italic">Ticket Price</p>
                <h3 className="text-5xl font-black text-white italic tracking-tighter">₹{event.price}</h3>
              </div>
              <LiveSeatBadge eventId={event.id} initialSeats={event.availableSeats} />
            </div>

            <Separator className="bg-zinc-800/50 mb-8" />

            <div className="space-y-6">
               <div className="flex items-center justify-between text-sm text-zinc-400 font-bold uppercase tracking-wider">
                 <div className="flex items-center gap-2"><Users size={16} className="text-zinc-600" /> Capacity</div>
                 <span className="text-white">{event.totalSeats} Total</span>
               </div>
               
               <BookingButton 
                eventId={event.id} 
                availableSeats={event.availableSeats} 
                currentUserId={session?.user?.id || ""} 
                eventSlug={event.slug}
              />

               <div className="pt-4 flex flex-col gap-3">
                 <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest justify-center font-bold italic">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Verified Secure Booking
                 </div>
               </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
