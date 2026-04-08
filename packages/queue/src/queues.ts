import { Queue } from "bullmq";
import { redisConnection } from "./redis";

export const bookingQueue = new Queue("booking-queue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
  },
});