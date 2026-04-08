"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";

export function TicketQrSection({ qrData, eventTitle }: { qrData: string, eventTitle: string }) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div className="md:w-64 bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800 p-8 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
       
        <div className="hidden md:block absolute -top-4 -left-4 w-8 h-8 bg-zinc-950 rounded-full border border-zinc-800" />
        <div className="hidden md:block absolute -bottom-4 -left-4 w-8 h-8 bg-zinc-950 rounded-full border border-zinc-800" />

        <div 
          onClick={() => setIsZoomed(true)}
          className="relative group cursor-zoom-in bg-white p-3 rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          <QRCodeSVG value={qrData} size={130} level="H" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
             <Maximize2 className="text-white" size={24} />
          </div>
        </div>
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Tap to expand</p>
      </div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-xl"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] max-w-sm w-full flex flex-col items-center gap-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-1">
                <h3 className="text-xl font-black text-white">{eventTitle}</h3>
                <p className="text-zinc-500 text-sm">Entry Pass</p>
              </div>

              <div className="bg-white p-6 rounded-[2rem]">
                <QRCodeSVG value={qrData} size={260} level="H" includeMargin={true} />
              </div>

              <button 
                onClick={() => setIsZoomed(false)}
                className="mt-4 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} /> Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}