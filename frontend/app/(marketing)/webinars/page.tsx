"use client";

import { motion } from "framer-motion";
import { Play, Calendar, User, Clock, ArrowRight, Video, Filter } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import { Button } from "@/components/ui/button";

const webinars = [
  {
    title: "Mastering the AI Regulation Wave",
    description: "Learn how the EU AI Act and upcoming US regulations will impact your product roadmap.",
    date: "May 28, 2026",
    time: "10:00 AM EST",
    speaker: "Sarah Jenkins, Head of Legal",
    type: "Upcoming",
    thumbnail: "bg-accent/10",
  },
  {
    title: "Cookie Consent: Beyond the Banner",
    description: "Deep dive into GCM v2, TCF 2.3, and automated blocking strategies for 2026.",
    date: "June 05, 2026",
    time: "2:00 PM EST",
    speaker: "Michael Chen, Lead Engineer",
    type: "Upcoming",
    thumbnail: "bg-info/10",
  },
  {
    title: "GDPR for Founders: 0 to 100",
    description: "Practical compliance for early-stage startups without a dedicated legal team.",
    date: "Available Now",
    time: "45 min",
    speaker: "Rahul Singh, CEO",
    type: "On-Demand",
    thumbnail: "bg-success/10",
  },
];

export default function WebinarsPage() {
  return (
    <PageScaffold
      title="Compliance Webinars"
      subtitle="Join live sessions with legal experts and watch on-demand workshops on regulatory trends."
    >
      <div className="flex justify-center mb-16">
        <div className="inline-flex p-1.5 bg-bg-secondary rounded-2xl border border-bg-tertiary">
          <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-accent text-bg-primary shadow-lg">Upcoming Sessions</button>
          <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">On-Demand</button>
        </div>
      </div>

      <div className="grid gap-8">
        {webinars.map((webinar, index) => (
          <motion.div
            key={webinar.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col lg:flex-row gap-8 p-6 rounded-[2.5rem] border border-bg-tertiary bg-bg-secondary hover:border-accent/30 transition-all shadow-2xl overflow-hidden relative"
          >
            <div className={`w-full lg:w-72 h-48 lg:h-auto rounded-[1.5rem] ${webinar.thumbnail} flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500`}>
               <Video className="h-12 w-12 text-accent opacity-50" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-accent group-hover:border-accent group-hover:text-bg-primary transition-all shadow-xl">
                    <Play className="h-6 w-6 ml-1" />
                  </div>
               </div>
               <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    webinar.type === "Upcoming" ? "bg-accent text-bg-primary" : "bg-success text-white"
                  }`}>
                    {webinar.type}
                  </span>
               </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
                <span className="flex items-center gap-2 text-accent"><Calendar className="h-4 w-4" /> {webinar.date}</span>
                <span className="h-1 w-1 rounded-full bg-bg-tertiary" />
                <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {webinar.time}</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">{webinar.title}</h2>
              <p className="text-base text-text-secondary leading-relaxed mb-6 max-w-2xl">{webinar.description}</p>
              
              <div className="mt-auto flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-bg-tertiary/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-bg-primary border border-bg-tertiary flex items-center justify-center text-text-muted">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{webinar.speaker}</p>
                  </div>
                </div>
                <Button className="rounded-2xl px-8 py-4 h-auto font-bold bg-accent text-bg-primary hover:bg-accent-light shadow-glow-accent">
                  Register for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="mt-20 p-12 rounded-[3rem] bg-accent/5 border border-accent/10 text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Host a workshop?</h2>
        <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
          Are you a legal or compliance expert interested in sharing your knowledge with our community? We'd love to hear from you.
        </p>
        <Button variant="outline" className="rounded-full px-10 py-6 h-auto text-lg border-bg-tertiary hover:border-accent text-text-primary">
          Partner with us
        </Button>
      </section>
    </PageScaffold>
  );
}
