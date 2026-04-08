import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";

export class SocketService {
  private static instance: SocketService;
  private wss: WebSocketServer;
  private clients: Map<string, Set<WebSocket>> = new Map();

  private constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.init();
  }

  public static getInstance(server?: Server): SocketService {
    if (!SocketService.instance && server) {
      SocketService.instance = new SocketService(server);
    }
    return SocketService.instance;
  }

  private init() {
    this.wss.on("connection", (ws) => {
      ws.on("message", (data) => {
        const message = JSON.parse(data.toString());
        if (message.type === "SUBSCRIBE") {
          const { eventId } = message;
          if (!this.clients.has(eventId)) this.clients.set(eventId, new Set());
          this.clients.get(eventId)?.add(ws);
        }
      });

      ws.on("close", () => {
        this.clients.forEach((set) => set.delete(ws));
      });
    });
  }

  public broadcast(eventId: string, availableSeats: number, userId?: string) {
    const eventClients = this.clients.get(eventId);
    if (eventClients) {
      const payload = JSON.stringify({ type: "SEAT_UPDATE", availableSeats, confirmedUserId: userId });
      eventClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) client.send(payload);
      });
    }
  }
}