import { auth } from "@/auth";
import { bookingQueue, type BookingJobData } from "@repo/queue";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { eventId, quantity } = await req.json();

    if (!eventId || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const jobData: BookingJobData = {
      userId: session.user.id,
      eventId,
      quantity: Number(quantity),
    };

    const job = await bookingQueue.add("process-booking", jobData);

    return NextResponse.json({ 
      success: true, 
      jobId: job.id,
      message: "Ticket request is in the queue!" 
    });

  } catch (error) {
    console.error("QUEUE_PRODUCER_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}