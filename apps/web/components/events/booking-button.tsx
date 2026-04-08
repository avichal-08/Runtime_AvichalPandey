"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, TicketCheck, Minus, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function BookingButton({ 
  eventId, 
  availableSeats, 
  currentUserId, // Add this prop
  eventSlug      // Add this prop
}: { 
  eventId: string, 
  availableSeats: number, 
  currentUserId: string,
  eventSlug: string 
}) {
  const [status, setStatus] = useState<"idle" | "requested" | "booked">("idle");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
  let isMounted = true;
  const socket = new WebSocket("ws://localhost:8080");

  socket.onopen = () => {
    console.log("🔌 Connected to Realtime Engine");
    socket.send(JSON.stringify({ type: "SUBSCRIBE", eventId }));
  };

  socket.onmessage = (event) => {
    if (!isMounted) return;
    
    const data = JSON.parse(event.data);
    console.log("📩 WS RECEIVED:", data);

    if (data.type === "SEAT_UPDATE") {
  const incomingId = String(data.confirmedUserId).trim();
  const myId = String(currentUserId).trim();

  console.log("Comparing:", incomingId, "with", myId);

  if (incomingId === myId) {
    console.log("MATCH FOUND!");
    setTimeout(() => {
    setStatus("booked");
  }, 100);
  }
}
  };

  socket.onerror = (err) => console.error(" WS Error:", err);
  socket.onclose = () => console.log("WS Disconnected");

  return () => {
    isMounted = false;
    socket.close();
  };
}, [eventId, currentUserId]);

  const handleBooking = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ eventId, quantity }),
      });
      if (!res.ok) throw new Error();
      setStatus("requested");
    } catch (err) {
      toast.error("Queueing failed");
    } finally {
      setLoading(false);
    }
  };

  if (status === "booked") {
    return (
      <Link href="/tickets" className="block w-full">
        <Button className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
          <TicketCheck size={20} />
          View My Tickets
          <ArrowRight size={18} />
        </Button>
      </Link>
    );
  }

  return (
    <div className="space-y-4">
      {status === "idle" && (
        <div className="flex items-center justify-between bg-zinc-950/50 border border-zinc-800 p-2 rounded-2xl">
          <span className="text-sm font-medium text-zinc-500 ml-3">Quantity</span>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
              <Minus size={16} />
            </Button>
            <span className="text-xl font-bold text-white w-4 text-center">{quantity}</span>
            <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(availableSeats, q + 1))}>
              <Plus size={16} />
            </Button>
          </div>
        </div>
      )}

      <Button 
        onClick={handleBooking}
        disabled={loading || status === "requested" || availableSeats <= 0}
        className={`w-full h-14 rounded-2xl font-bold text-lg transition-all ${
          status === "requested" ? "bg-amber-500/20 text-amber-500 border border-amber-500/50" : "bg-brand hover:bg-brand-dark text-white"
        }`}
      >
        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
        {status === "requested" ? (
          "Processing Request..."
        ) : (
          `Confirm ${quantity} Ticket${quantity > 1 ? 's' : ''}`
        )}
      </Button>
    </div>
  );
}