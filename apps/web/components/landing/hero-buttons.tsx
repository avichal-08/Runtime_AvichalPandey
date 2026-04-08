"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

export function HeroButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
    >
      <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center">
      <Link href="/login">
        <Button className="h-14 px-8 rounded-2xl bg-brand hover:bg-brand-dark text-white font-bold text-lg shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)] transition-all hover:scale-105">
          Get Started — It's Free
        </Button>
      </Link>
      
      <Link href="/home">
        <Button variant="outline" className="h-14 px-8 rounded-2xl border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 font-bold text-lg transition-all">
          Browse Live Events <ExternalLink className="ml-2 w-4 h-4" />
        </Button>
      </Link>
    </div>
    </motion.div>
  );
}