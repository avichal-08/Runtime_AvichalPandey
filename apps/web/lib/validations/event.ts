import * as z from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  totalSeats: z.coerce.number().min(1, "At least 1 seat is required"),
  startDateTime: z.date().min(new Date(), "Start date must be in the future"),
});