import { useEffect, useState } from "react";

export function useEventSocket(eventId: string, initialSeats: number) {
  const [availableSeats, setAvailableSeats] = useState(initialSeats);

  useEffect(() => {
    const socket = new WebSocket("https://eventra-sxic.onrender.com");

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "SUBSCRIBE", eventId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "SEAT_UPDATE") {
        setAvailableSeats(data.availableSeats);
      }
    };

    return () => socket.close();
  }, [eventId]);

  return availableSeats;
}