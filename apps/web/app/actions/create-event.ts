"use server";

import { db, events } from "@repo/db";
import { auth } from "@/auth";
import slugify from "slugify";
import { revalidatePath } from "next/cache";

export async function createEvent(data: {
  title: string;
  description: string;
  location: string;
  price: number;
  totalSeats: number;
  startDateTime: Date;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const slug = `${slugify(data.title, { lower: true })}-${Math.random().toString(36).substring(2, 7)}`;

    await db.insert(events).values({
      title: data.title,
      description: data.description,
      location: data.location,
      price: data.price.toString(),
      totalSeats: data.totalSeats,
      availableSeats: data.totalSeats,
      startDateTime: data.startDateTime,
      organizerId: session.user.id,
      slug,
    });

    revalidatePath("/home");
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { error: "Failed to create event. Title might be too long or database error." };
  }
}