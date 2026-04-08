import { auth } from "@/auth";
import { db, tickets, bookings } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id: eventId } = await params;
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { qrData } = await req.json();

  const ticket = await db.query.tickets.findFirst({
    where: eq(tickets.qrCodeData, qrData),
    with: {
      booking: true
    }
  });

  if (!ticket || ticket.booking.eventId !== eventId) {
    return NextResponse.json({ success: false, error: "Ticket not found for this event" });
  }

  if (ticket.isUsed) {
    return NextResponse.json({ success: false, error: "Ticket already scanned!" });
  }
  await db.update(tickets).set({ 
    isUsed: true, 
    scannedAt: new Date() 
  }).where(eq(tickets.id, ticket.id));

  return NextResponse.json({ 
    success: true, 
    message: `Verified for ${ticket.booking.quantity} ticket(s)` 
  });
}