import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { db, events } from "@repo/db";

const STATIC_BANNER = "https://res.cloudinary.com/dcwso7qst/image/upload/v1775715566/WhatsApp_Image_2026-04-09_at_11.48.12_t1u0ra.jpg";

export default async function HomePage() {
  const allEvents = await db.select().from(events).limit(6);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
            Discover Events
          </h1>
          <p className="text-zinc-400 mt-1 text-lg font-medium">
            Find and book the most anticipated events near you.
          </p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="border-zinc-800 bg-zinc-900/50 text-zinc-300 px-4 py-2 rounded-xl backdrop-blur-md">
            Lucknow, India
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allEvents.map((event) => {
          const displayImage = event.imageUrl || STATIC_BANNER;

          return (
            <Card key={event.id} className="group relative overflow-hidden border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all duration-500 backdrop-blur-sm rounded-[2rem]">
             
              <div className="aspect-[16/10] w-full bg-zinc-900 relative overflow-hidden">
               
                 <div 
                    className="absolute inset-0 opacity-20 blur-2xl scale-150 transition-transform duration-700 group-hover:scale-110" 
                    style={{ backgroundImage: `url(${displayImage})`, backgroundSize: 'cover' }}
                 />
                 
                 <img 
                    src={displayImage} 
                    alt={event.title} 
                    className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 />

                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent opacity-80" />
                 
                 <div className="absolute top-4 right-4">
                   <Badge className="bg-brand text-white border-none px-4 py-1.5 rounded-xl font-black shadow-lg">
                     ₹{event.price}
                   </Badge>
                 </div>
              </div>

              <CardHeader className="p-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-3">
                  <Calendar size={12} className="text-brand" />
                  {event.startDateTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-brand transition-colors line-clamp-1 tracking-tight italic uppercase">
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 pb-4">
                <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed font-medium">
                  {event.description}
                </p>
              </CardContent>

              <CardFooter className="p-6 flex items-center justify-between border-t border-zinc-800/30">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  <Users size={14} className="text-zinc-600" />
                  <span>{event.availableSeats} slots left</span>
                </div>
                <Link href={`/events/${event.slug}`}>
                  <div className="p-3 rounded-2xl bg-zinc-800 text-white group-hover:bg-brand group-hover:scale-110 transition-all duration-300 shadow-xl">
                    <ArrowUpRight size={20} />
                  </div>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {allEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-900 rounded-[3rem] bg-zinc-900/10">
          <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm mb-6">Zero Events Found</p>
          <Link href="/events/create">
            <Button className="bg-white text-black hover:bg-zinc-200 rounded-2xl px-8 h-14 font-black italic uppercase tracking-tighter">
              Host the first one
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
