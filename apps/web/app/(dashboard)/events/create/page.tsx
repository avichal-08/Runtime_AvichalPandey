"use client";

import { useRef, useState } from "react";
import { createEvent } from "@/app/actions/create-event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const locRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const seatsRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const title = titleRef.current?.value;
      const description = descRef.current?.value;
      const location = locRef.current?.value;
      const price = Number(priceRef.current?.value);
      const totalSeats = Number(seatsRef.current?.value);
      const dateStr = dateRef.current?.value;
      const timeStr = timeRef.current?.value;

      if (!title || !description || !location || !dateStr || !timeStr) {
        throw new Error("All fields are required.");
      }

      if (isNaN(price) || isNaN(totalSeats)) {
        throw new Error("Price and Seats must be valid numbers.");
      }

      const startDateTime = new Date(`${dateStr}T${timeStr}`);

      const result = await createEvent({
        title,
        description,
        location,
        price,
        totalSeats,
        startDateTime,
      });

      if (result?.error) throw new Error(result.error);
      
      router.push("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Sparkles className="text-brand" /> Host a New Event
        </h1>
        <p className="text-zinc-400 mt-2">No forms, no fuss. Just enter the details.</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Event Title</label>
            <Input ref={titleRef} placeholder="e.g. Lucknow Tech Meetup" className="bg-zinc-800/50 border-zinc-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Ticket Price (₹)</label>
              <Input ref={priceRef} type="number" defaultValue="0" className="bg-zinc-800/50 border-zinc-700" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Total Seats</label>
              <Input ref={seatsRef} type="number" defaultValue="100" className="bg-zinc-800/50 border-zinc-700" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Location</label>
            <Input ref={locRef} placeholder="Venue or Google Maps Link" className="bg-zinc-800/50 border-zinc-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Start Date</label>
              <Input ref={dateRef} type="date" className="bg-zinc-800/50 border-zinc-700 [color-scheme:dark]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Start Time</label>
              <Input ref={timeRef} type="time" className="bg-zinc-800/50 border-zinc-700 [color-scheme:dark]" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Description</label>
            <Textarea ref={descRef} placeholder="What should attendees expect?" className="bg-zinc-800/50 border-zinc-700 min-h-[120px]" />
          </div>

          <Button 
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark text-white font-bold h-12 rounded-xl shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)]"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Publish Event"}
          </Button>
        </form>
      </Card>
    </div>
  );
}