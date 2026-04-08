"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function ScannerComponent({ eventId }: { eventId: string }) {
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
  const scanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: 250 },
    false
  );

  const onScanSuccess = async (decodedText: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/verify`, {
        method: "POST",
        body: JSON.stringify({ qrData: decodedText }),
      });
      const data = await res.json();
      
      setLastResult(data);
      if (data.success) toast.success("Verified!");
      else toast.error(data.error);
    } catch (e) {
      toast.error("Scanning failed");
    }
  };

  scanner.render(onScanSuccess, (err) => {
    console.warn("QR Scan Error:", err);
  });

  return () => {
    scanner.clear().catch((error) => {
      console.error("Failed to clear html5-qrcode scanner: ", error);
    });
  };
}, [eventId]);

  return (
    <div className="w-full max-w-md space-y-6">
      <div id="reader" className="overflow-hidden rounded-3xl border-2 border-zinc-800 bg-black shadow-2xl"></div>
      
      {lastResult && (
        <div className={`p-6 rounded-2xl border flex items-center gap-4 animate-in zoom-in duration-300 ${
          lastResult.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {lastResult.success ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
          <div>
            <p className="font-bold text-lg">{lastResult.success ? "Check-in Successful" : "Invalid Ticket"}</p>
            <p className="text-sm opacity-80">{lastResult.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}