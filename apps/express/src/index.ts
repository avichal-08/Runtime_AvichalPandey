import express from "express";
import { createServer } from "http";
import healthRouter from "./routes/health";
import { SocketService } from "./services/websocket"
import { initWorker } from "./services/worker";
import "dotenv/config";

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 8080;

// 1. Routes
app.use(healthRouter);

// 2. Initialize Singleton Services
SocketService.getInstance(httpServer);
initWorker();

httpServer.listen(port, () => {
  console.log(`🚀 Realtime Engine running on http://localhost:${port}`);
});