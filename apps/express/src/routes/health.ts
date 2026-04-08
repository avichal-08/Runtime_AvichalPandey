import { Router } from "express";
import type { Request, Response } from "express";
import { redisConnection } from "@repo/queue";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    redis: redisConnection.status,
    timestamp: new Date().toISOString(),
  });
});

export default router;