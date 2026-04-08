import { auth } from "@/auth";
import { db, events, bookings, tickets } from "@repo/db";
import { eq, sql, desc, inArray } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scan, BarChart3, Users, CheckCircle } from "lucide-react";
import { ScannerComponent } from "@/components/organizer/scanner-component";

export default async function ManageEventPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const event = await db.query.events.findFirst({
    where: eq(events.id, id),
  });

  if (!event || event.organizerId !== session.user.id) notFound();

const eventBookingIds = await db
  .select({ id: bookings.id })
  .from(bookings)
  .where(eq(bookings.eventId, id));

const ids = eventBookingIds.map(b => b.id);

const eventTickets = ids.length > 0 
  ? await db.query.tickets.findMany({
      where: inArray(tickets.bookingId, ids),
      with: {
        booking: { with: { user: true } }
      },
      orderBy: [desc(tickets.scannedAt)]
    })
  : [];

const totalTicketsSold = eventTickets.length;
const checkedInCount = eventTickets.filter(t => t.isUsed).length;
const attendancePercentage = totalTicketsSold > 0 
  ? ((checkedInCount / totalTicketsSold) * 100).toFixed(1) 
  : 0;

const recentAttendees = eventTickets.filter(t => t.isUsed);

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white">{event.title}</h1>
        <p className="text-zinc-500">Event Management & Check-in Console</p>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 h-14 rounded-2xl mb-8">
          <TabsTrigger value="stats" className="rounded-xl gap-2 data-[state=active]:bg-zinc-800">
            <BarChart3 size={18} /> Analytics
          </TabsTrigger>
          <TabsTrigger value="scan" className="rounded-xl gap-2 data-[state=active]:bg-brand data-[state=active]:text-white">
            <Scan size={18} /> Entry Scanner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Attendance %</p>
            <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-brand">{attendancePercentage}%</h3>
                <span className="text-zinc-600 text-sm">of total sold</span>
            </div>
        
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div 
                className="bg-brand h-full transition-all duration-1000" 
                style={{ width: `${attendancePercentage}%` }} 
                />
            </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Checked In</p>
            <h3 className="text-3xl font-black text-emerald-500 mt-2">{checkedInCount}</h3>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Tickets Sold</p>
            <h3 className="text-3xl font-black text-white mt-2">{totalTicketsSold}</h3>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Remaining</p>
            <h3 className="text-3xl font-black text-zinc-500 mt-2">{totalTicketsSold - checkedInCount}</h3>
            </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Recent Check-ins</h3>
            <Users size={20} className="text-zinc-600" />
            </div>
            
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                <tr className="bg-zinc-950/50 text-zinc-500 text-[10px] uppercase tracking-widest">
                    <th className="px-8 py-4 font-bold">Attendee</th>
                    <th className="px-8 py-4 font-bold">Ticket ID</th>
                    <th className="px-8 py-4 font-bold">Check-in Time</th>
                    <th className="px-8 py-4 font-bold">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                {eventTickets.map((ticket) => (
                    <tr key={ticket.id} className="group hover:bg-zinc-800/20 transition-colors">
                    <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                            {ticket.booking.user.name?.[0] || "U"}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{ticket.booking.user.name}</p>
                            <p className="text-xs text-zinc-500">{ticket.booking.user.email}</p>
                        </div>
                        </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-[10px] text-zinc-500">
                        {ticket.id.split('-')[0]}...
                    </td>
                    <td className="px-8 py-5 text-sm text-zinc-400">
                        {ticket.scannedAt ? ticket.scannedAt.toLocaleTimeString() : "—"}
                    </td>
                    <td className="px-8 py-5">
                        {ticket.isUsed ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
                            <CheckCircle size={12} /> Present
                        </span>
                        ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase">
                            Absent
                        </span>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </TabsContent>
        <TabsContent value="scan">
          <div className="flex flex-col items-center">
            <ScannerComponent eventId={id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}