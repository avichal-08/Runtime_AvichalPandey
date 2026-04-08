import { auth } from "@/auth";
import { db, bookings, events, tickets } from "@repo/db";
import { eq, desc } from "drizzle-orm";
import { QRCodeSVG } from "qrcode.react";
import { Ticket, MapPin, Calendar, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { TicketQrSection } from "@/components/tickets/ticket-card";

export default async function TicketsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userBookings = await db.query.bookings.findMany({
    where: eq(bookings.userId, session.user.id),
    with: {
      event: true,
      tickets: true,
    },
    orderBy: [desc(bookings.createdAt)],
  });

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight">My Tickets</h1>
        <p className="text-zinc-500">Your passes for upcoming experiences.</p>
      </div>

      {userBookings.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[2rem] text-zinc-600">
          <Ticket size={48} className="mb-4 opacity-20" />
          <p>No tickets found. Go book some events!</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {userBookings.map((booking) => (
            <div key={booking.id} className="group relative">
              <div className="flex flex-col md:flex-row bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-zinc-700">
                
                <div className="flex-1 p-8 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white group-hover:text-brand transition-colors">
                      {booking.event.title}
                    </h2>
                    <div className="flex items-center gap-4 text-zinc-400 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-brand" /> 
                        {booking.event.startDateTime.toDateString()}
                      </span>
                      <div className="flex items-start gap-3">
                <MapPin size={20} className="text-brand shrink-0 mt-1" /> 
                <div className="flex flex-col gap-2">
                {booking.event.location.startsWith("http") ? (
                <a 
                    href={booking.event.location} 
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
                <span className="text-zinc-400 text-lg">{booking.event.location}</span>
                )}
                </div>
                </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Quantity</p>
                      <p className="text-white font-mono text-lg">{booking.quantity} Person(s)</p>
                    </div>
                    <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Status</p>
                      <p className="text-emerald-500 font-bold text-lg uppercase tracking-tight">{booking.status}</p>
                    </div>
                  </div>
                </div>

                <div className="md:w-64 bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800 p-8 flex flex-col items-center justify-center gap-4 relative">
                 
                  <div className="hidden md:block absolute -top-4 -left-4 w-8 h-8 bg-zinc-950 rounded-full border border-zinc-800" />
                  <div className="hidden md:block absolute -bottom-4 -left-4 w-8 h-8 bg-zinc-950 rounded-full border border-zinc-800" />
                  
                  <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <TicketQrSection 
                    qrData={booking.tickets[0]?.qrCodeData || ""} 
                    eventTitle={booking.event.title} 
                    />
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                    Booking ID: {booking.id.slice(0, 8)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}