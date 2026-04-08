"use client";

import { useEventSocket } from "@/hooks/use-event-socket";
import { Badge } from "@/components/ui/badge";

export function LiveSeatBadge({ 
  eventId, 
  initialSeats 
}: { 
  eventId: string; 
  initialSeats: number 
}) {
  const liveSeats = useEventSocket(eventId, initialSeats);

  return (
    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700 px-3 py-1 animate-in fade-in duration-500">
      {liveSeats} Seats Left
    </Badge>
  );
}