"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
    >
      <Link href="/login" className="w-full sm:w-auto">
        <Button size="lg" className="w-full bg-brand hover:bg-brand-dark text-white font-semibold h-14 px-8 text-lg rounded-xl shadow-[0_0_40px_-10px_rgba(249,115,22,0.6)] transition-all hover:scale-105">
          Create Event — It's Free <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
      <Link href="/explore" className="w-full sm:w-auto">
        <Button size="lg" variant="outline" className="w-full border-zinc-700 bg-zinc-900/50 text-white hover:bg-zinc-800 h-14 px-8 text-lg rounded-xl transition-all hover:scale-105">
          View Pricing
        </Button>
      </Link>
    </motion.div>
  );
}