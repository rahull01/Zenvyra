"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, FileCheck2, Loader2, Search, ShieldCheck, Sparkles, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { useScan } from "@/hooks/useScan";
import PageContainer from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";

const proofStats = [
  { label: "AI systems mapped", value: "1,200+" },
  { label: "Evidence gaps resolved", value: "8,500+" },
  { label: "First report", value: "15 sec" },
];

const checks = [
  { label: "AI inventory coverage", value: "98%", tone: "bg-success" },
  { label: "Transparency readiness", value: "91%", tone: "bg-info" },
  { label: "Oversight evidence", value: "94%", tone: "bg-accent" },
];

export default function HeroSection() {
  const [url, setUrl] = useState("");
  const { scan, isScanning } = useScan();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Enter a website URL first");
      return;
    }
    await scan(url);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-bg-base pt-32 sm:pt-40 pb-20">
      {/* Animated Mesh Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-info/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 bg-accent/30 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              y: [null, Math.random() * -100 - 50 + "px"],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <PageContainer className="relative z-10">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-accent"
            >
              <ShieldCheck className="h-4 w-4" />
              EU AI Act Readiness Platform
            </motion.div>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.1] text-text-primary md:text-7xl tracking-tight">
              EU AI Act Readiness. <br />
              <span className="text-gradient-accent">Backed by Proof.</span>
            </h1>
            
            <p className="mt-8 max-w-xl text-lg font-medium leading-relaxed text-text-secondary">
              Inventory AI systems, prepare transparency and oversight evidence, and connect the
              supporting privacy, cookie, policy, and monitoring workflows in minutes, not weeks.
            </p>

            <form onSubmit={handleScan} className="mt-10 flex max-w-2xl flex-col gap-3 rounded-full border border-bg-tertiary bg-bg-primary/50 p-2 shadow-lg backdrop-blur-md sm:flex-row focus-within:border-accent/50 transition-all">
              <div className="flex min-h-14 flex-1 items-center gap-3 rounded-full bg-bg-secondary/30 px-6">
                <Search className="h-5 w-5 text-text-muted" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-company.com"
                  className="w-full bg-transparent text-sm font-semibold text-text-primary outline-none placeholder:text-text-muted"
                />
              </div>
              <Button
                type="submit"
                disabled={isScanning}
                size="lg"
                className="rounded-full px-8"
              >
                {isScanning ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                <span className="ml-2 uppercase tracking-widest text-xs font-bold">Start AI Readiness</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-12 flex items-center gap-8">
              {proofStats.map((stat, index) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-3xl font-extrabold text-text-primary">{stat.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:block"
            style={{ perspective: "1000px" }}
          >
            {/* 3D Dashboard Mockup */}
            <div className="relative rounded-[2.5rem] border border-bg-tertiary bg-bg-base p-4 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-accent opacity-5 group-hover:opacity-10 transition-opacity" />
              
              <div className="relative rounded-[2rem] bg-bg-primary border border-bg-tertiary overflow-hidden">
                <div className="flex items-center justify-between border-b border-bg-tertiary p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center shadow-glow-accent">
                      <Globe className="h-6 w-6 text-bg-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">acme-saas.io</h3>
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Live AI Readiness Status</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 border border-success/20">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-success">Healthy</span>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Readiness Score</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-7xl font-black text-text-primary">98</span>
                        <span className="text-sm font-bold text-success">+4%</span>
                      </div>
                      <div className="h-2 w-full bg-bg-tertiary rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "98%" }}
                          transition={{ duration: 1.5, delay: 1 }}
                          className="h-full bg-gradient-accent rounded-full shadow-glow-accent" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Risk Level</span>
                      <div className="h-[100px] flex items-end gap-1">
                        {[40, 60, 30, 80, 20, 90, 45].map((h, i) => (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: h + "%" }}
                            transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                            className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-accent shadow-glow-accent' : 'bg-bg-tertiary'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Active Evidence Areas</span>
                      <div className="grid grid-cols-3 gap-3">
                      {["AI Act", "GDPR", "CPRA"].map((reg) => (
                        <div key={reg} className="flex items-center gap-2 rounded-xl bg-bg-secondary p-3 border border-bg-tertiary">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span className="text-xs font-bold text-text-primary">{reg}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-1/4 rounded-2xl bg-bg-secondary/80 border border-bg-tertiary p-4 backdrop-blur-xl shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-info/20 flex items-center justify-center text-info">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary">AI Insight</p>
                  <p className="text-[10px] text-text-muted">AI transparency gap detected</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Logo Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-32 pt-16 border-t border-bg-tertiary/50"
        >
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-text-muted">
            Helping teams turn AI governance into visible evidence
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-20 gap-y-10 opacity-40 hover:opacity-100 transition-opacity">
            {["Stripe", "Linear", "Vercel", "Notion", "Figma", "Webflow", "Discord", "Slack"].map((logo) => (
              <span key={logo} className="text-2xl font-black italic text-text-secondary hover:text-accent transition-colors cursor-default">
                {logo}
              </span>
            ))}
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}

