"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#0F0F1A] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,126,34,0.08),transparent_50%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-md w-full text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto h-16 w-16 bg-brand-orange/10 border border-brand-orange/30 rounded-2xl flex items-center justify-center text-brand-orange mb-2"
        >
          <ShieldAlert className="h-8 w-8 animate-pulse-slow" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="text-8xl font-black tracking-tight bg-gradient-to-r from-brand-orange to-[#F39C12] bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl font-bold text-white">Compliance Checkpoint Not Found</h2>
          <p className="text-xs text-text-tertiary leading-relaxed">
            The page you are looking for does not exist, has been archived, or has migrated to a different compliance route.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
        >
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 px-6 rounded-xl shadow-btn flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto border-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2">
              Visit Homepage
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
