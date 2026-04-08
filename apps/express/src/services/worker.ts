import { Worker } from "bullmq";
import { redisConnection, type BookingJobData } from "@repo/queue";
import { db, events, bookings, tickets } from "@repo/db";
import { eq, and, gte, sql} from "drizzle-orm";
import { SocketService } from "./websocket";

export const initWorker = () => {
  const worker = new Worker<BookingJobData>(
    "booking-queue",
    async (job) => {
      const { userId, eventId, quantity } = job.data;
      const socketService = SocketService.getInstance();

      return await db.transaction(async (tx) => {
        const [event] = await tx.select().from(events).where(eq(events.id, eventId)).limit(1);

        if (!event || event.availableSeats < quantity) {
          throw new Error("SOLD_OUT");
        }

        const [updatedEvent] = await tx
            .update(events)
            .set({
              availableSeats: sql`${events.availableSeats} - ${quantity}`
            })
            .where(
              and(
                eq(events.id, eventId),
                gte(events.availableSeats, quantity)
              )
            )
            .returning();

        if (!updatedEvent) {
          throw new Error("EVENT_UPDATE_FAILED_OR_SOLD_OUT");
        }

        const [newBooking] = await tx.insert(bookings).values({
          userId, eventId, quantity, status: "CONFIRMED"
        }).returning();

        if(!newBooking) {
          throw new Error("BOOKING_FAILED");
        }

        const ticketsData = Array.from({ length: quantity }).map((_, i) => ({
          bookingId: newBooking.id,
          qrCodeData: `PASS-${newBooking.id}-${i}`,
        }));

        await tx.insert(tickets).values(ticketsData);

        if (!updatedEvent) {
          throw new Error("EVENT_UPDATE_FAILED");
        }
        socketService.broadcast(eventId, updatedEvent.availableSeats,userId);
        
        return { success: true };
      });
    },
    { connection: redisConnection, concurrency: 1 }
  );

  worker.on("completed", (job) => console.log(`Job ${job.id} done`));
  worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed: ${err.message}`));
};