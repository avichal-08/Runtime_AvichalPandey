import { auth } from "@/auth";
import { db, bookings, events, tickets } from "@repo/db";
import { eq, and, desc, lt } from "drizzle-orm";
import { redirect } from "next/navigation";
import { 
  History, 
  CheckCircle2, 
  Calendar, 
  ArrowUpRight, 
  Clock,
  Ticket as TicketIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const now = new Date();

  const attendedBookings = await db.query.bookings.findMany({
    where: eq(bookings.userId, session.user.id),
    with: {
      event: true,
      tickets: {
        where: eq(tickets.isUsed, true)
      }
    },
    orderBy: [desc(bookings.createdAt)]
  });

  const historyAttended = attendedBookings.filter(b => b.tickets.length > 0);

 const pastHosted = await db.query.events.findMany({
  where: eq(events.organizerId, session.user.id),
  orderBy: [desc(events.startDateTime)]
});

  console.log("Past Hosted Events:", pastHosted);

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-10">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-brand">
          <History size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Activity History</h1>
          <p className="text-zinc-500">A timeline of your experiences and hosted events.</p>
        </div>
      </div>

      <Tabs defaultValue="attended" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 h-12 rounded-xl mb-8">
          <TabsTrigger value="attended" className="rounded-lg px-6 data-[state=active]:bg-zinc-800">
            Attended
          </TabsTrigger>
          <TabsTrigger value="hosted" className="rounded-lg px-6 data-[state=active]:bg-zinc-800">
            Past Hosted
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attended" className="space-y-4">
          {historyAttended.length === 0 ? (
            <EmptyState message="You haven't checked into any events yet." />
          ) : (
            historyAttended.map((booking) => (
              <HistoryCard 
                key={booking.id}
                title={booking.event.title}
                date={booking.event.startDateTime}
                type="ATTENDED"
                href={`/events/${booking.event.slug}`}
                meta={`${booking.quantity} Ticket(s)`}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="hosted" className="space-y-4">
          {pastHosted.length === 0 ? (
            <EmptyState message="No past events found in your records." />
          ) : (
            pastHosted.map((event) => (
              <HistoryCard 
                key={event.id}
                title={event.title}
                date={event.startDateTime}
                type="HOSTED"
                href={`/my-events/${event.id}`}
                meta="Event Completed"
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HistoryCard({ title, date, type, href, meta }: any) {
  return (
    <div className="group bg-zinc-900/40 border border-zinc-800/50 hover:border-brand/30 p-6 rounded-[2rem] transition-all flex items-center justify-between gap-6 backdrop-blur-sm">
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
          type === "ATTENDED" ? "bg-emerald-500/10 text-emerald-500" : "bg-indigo-500/10 text-indigo-400"
        }`}>
          {type === "ATTENDED" ? <CheckCircle2 size={24} /> : <Calendar size={24} />}
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-white group-hover:text-brand transition-colors leading-tight">
            {title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><Clock size={12} /> {date.toLocaleDateString()}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span className="font-medium text-zinc-400">{meta}</span>
          </div>
        </div>
      </div>
      <Link href={href}>
        <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all">
          <ArrowUpRight size={18} />
        </div>
      </Link>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-[3rem] text-zinc-600">
      <Clock size={40} className="mb-4 opacity-20" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}