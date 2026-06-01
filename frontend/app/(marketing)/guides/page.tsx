"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Clock, ArrowRight, Shield, Globe, Lock, Code } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import { Button } from "@/components/ui/button";

const guides = [
  {
    title: "GDPR Compliance Blueprint",
    description: "A step-by-step roadmap to making your SaaS business fully GDPR compliant.",
    time: "25 min read",
    category: "Regulation",
    icon: Globe,
    progress: 0,
  },
  {
    title: "Cookie Consent Setup",
    description: "Technical guide to installing banners and configuring auto-blocking.",
    time: "15 min read",
    category: "Technical",
    icon: Code,
    progress: 0,
  },
  {
    title: "Mastering DSAR Requests",
    description: "How to handle data subject access requests efficiently and legally.",
    time: "10 min read",
    category: "Operations",
    icon: Shield,
    progress: 0,
  },
  {
    title: "The CCPA Checklist",
    description: "Everything you need to know about the California Consumer Privacy Act.",
    time: "20 min read",
    category: "Regulation",
    icon: Lock,
    progress: 0,
  },
];

export default function GuidesPage() {
  return (
    <PageScaffold
      title="Compliance Guides"
      subtitle="Comprehensive walkthroughs and blueprints to help you master global regulations."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {guides.map((guide, index) => (
          <motion.div
            key={guide.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col md:flex-row gap-6 p-8 rounded-[2.5rem] border border-bg-tertiary bg-bg-secondary hover:border-accent/40 transition-all shadow-xl"
          >
            <div className="h-20 w-20 shrink-0 rounded-[2rem] bg-bg-primary border border-bg-tertiary flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg-primary transition-colors">
              <guide.icon className="h-10 w-10" />
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">{guide.category}</span>
                <span className="h-1 w-1 rounded-full bg-text-muted" />
                <span className="flex items-center gap-1 text-[10px] font-bold text-text-muted uppercase">
                  <Clock className="h-3 w-3" /> {guide.time}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">{guide.title}</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">{guide.description}</p>
              
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-bg-tertiary/50">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 rounded-full bg-bg-primary overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${guide.progress}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{guide.progress}% Complete</span>
                </div>
                <Button asChild variant="ghost" className="text-accent hover:text-accent-light hover:bg-accent/5 p-0 font-bold uppercase tracking-widest text-xs">
                  <Link href={`/guides/${guide.title.toLowerCase().replace(/ /g, "-")}`}>
                    Start Guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="mt-20 p-12 rounded-[3rem] bg-bg-primary border border-bg-tertiary flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="max-w-xl">
           <h2 className="text-3xl font-bold text-text-primary mb-4">Want a custom compliance roadmap?</h2>
           <p className="text-text-secondary text-lg leading-relaxed">
             Take our 2-minute onboarding assessment and we'll generate a personalized guide based on your tech stack and target regions.
           </p>
        </div>
        <Button className="rounded-full px-10 py-7 h-auto text-xl bg-accent text-bg-primary hover:bg-accent-light shadow-glow-accent whitespace-nowrap">
          Get Your Roadmap
        </Button>
      </section>
    </PageScaffold>
  );
}
