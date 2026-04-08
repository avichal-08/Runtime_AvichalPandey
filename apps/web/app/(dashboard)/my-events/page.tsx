import { auth } from "@/auth";
import { db, events, bookings } from "@repo/db";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { 
  Plus, 
  Users, 
  Ticket, 
  IndianRupee, 
  Calendar, 
  MapPin, 
  ExternalLink 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function MyEventsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userEvents = await db.query.events.findMany({
    where: eq(events.organizerId, session.user.id),
    orderBy: (events, { desc }) => [desc(events.createdAt)],
  });

  const stats = await db
    .select({
      totalTickets: sql<number>`cast(count(${bookings.id}) as int)`,
      totalRevenue: sql<string>`cast(sum(${events.price}) as text)`,
    })
    .from(bookings)
    .innerJoin(events, eq(bookings.eventId, events.id))
    .where(eq(events.organizerId, session.user.id));

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Organizer Dashboard</h1>
          <p className="text-zinc-400 mt-1">Manage your events and track sales performance.</p>
        </div>
        <Link href="/events/create">
          <Button className="bg-brand hover:bg-brand-dark text-white gap-2 h-12 px-6 rounded-xl font-bold shadow-[0_0_30px_-10px_rgba(249,115,22,0.5)]">
            <Plus size={20} />
            Host New Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-brand/10 text-brand">
                <Ticket size={24} />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Tickets Sold</p>
                <h3 className="text-3xl font-bold text-white">{stats[0]?.totalTickets || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                <IndianRupee size={24} />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Gross Revenue</p>
                <h3 className="text-3xl font-bold text-white">₹{stats[0]?.totalRevenue || "0"}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Active Events</p>
                <h3 className="text-3xl font-bold text-white">{userEvents.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Your Events
          <Badge variant="outline" className="border-zinc-800 text-zinc-500">{userEvents.length}</Badge>
        </h2>

        {userEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
            <p className="text-zinc-500">You haven't created any events yet.</p>
            <Link href="/events/create" className="mt-4 text-brand font-bold hover:underline">
              Create your first event →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {userEvents.map((event) => (
              <Card key={event.id} className="group overflow-hidden border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all backdrop-blur-sm">
                <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="hidden sm:flex h-20 w-20 rounded-2xl bg-zinc-800 items-center justify-center text-zinc-600 font-bold italic shrink-0">
                      EV
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white group-hover:text-brand transition-colors">
                          {event.title}
                        </h4>
                        <Badge className="bg-zinc-800 text-zinc-400 border-none text-[10px] uppercase tracking-tighter">
                          {event.availableSeats > 0 ? "Active" : "Sold Out"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {event.startDateTime.toDateString()}</span>
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
                        <span className="flex items-center gap-1.5 text-brand"><Users size={14} /> {event.totalSeats - event.availableSeats} Sold</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link href={`/events/${event.slug}`} className="flex-1 md:flex-none">
                      <Button variant="outline" className="w-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-white gap-2 rounded-xl">
                        View Event <ExternalLink size={14} />
                      </Button>
                    </Link>
                    <Link href={`/my-events/${event.id}`} className="flex-1 md:flex-none">
                    <Button variant="ghost" className="text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl">
                      Manage
                    </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}