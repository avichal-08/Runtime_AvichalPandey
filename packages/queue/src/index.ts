export * from "./redis";
export * from "./queues";

export interface BookingJobData {
  userId: string;
  eventId: string;
  quantity: number;
}