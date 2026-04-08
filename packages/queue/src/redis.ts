import { Redis } from "ioredis";

export const redisConnection = new Redis(process.env.REDIS_TCP_URL!, {
  maxRetriesPerRequest: null,
});