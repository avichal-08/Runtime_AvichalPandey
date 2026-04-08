"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function NavButtons() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/login">
        <Button variant="ghost" className="hidden sm:inline-flex text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full px-6">
          Sign In
        </Button>
      </Link>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/login">
          <Button className="bg-brand hover:bg-brand-dark text-white rounded-full px-6 font-medium">
            Get Started
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}