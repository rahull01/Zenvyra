"use client";

import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Maya Li", role: "Head of Legal, Novus Labs", quote: "ComplianceAI Pro made our global policy updates effortless; it’s the first tool our product and legal teams both love.", company: "Novus Labs" },
  { name: "Ethan Hart", role: "VP Product, Atlas Commerce", quote: "The instant scan and AI fix suggestions saved us weeks of manual review.", company: "Atlas Commerce" },
  { name: "Priya Shah", role: "Chief Privacy Officer, Lumen Health", quote: "Their consent analytics and DSAR workflows are the most advanced we’ve tested.", company: "Lumen Health" },
  { name: "Rafael Costa", role: "CTO, Orchard AI", quote: "The competitor benchmarking and regulation alerts help us stay ahead in every market.", company: "Orchard AI" },
  { name: "Sara Malik", role: "Compliance Manager, FlowPay", quote: "From cookie banners to self-serve policy embeds, this feels like the compliance platform we needed.", company: "FlowPay" },
  { name: "Noah Kim", role: "Founder, HubPass", quote: "The onboarding wizard gets newcomers live fast and the AI assistant is incredibly helpful.", company: "HubPass" },
];

export default function Testimonials() {
  return (
    <SectionWrapper className="relative py-32 bg-bg-primary text-text-primary overflow-hidden">
      <PageContainer>
        <div className="relative z-10">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-info">Trusted by compliance teams</p>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">What compliance leaders say.</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="rounded-[2rem] border border-bg-tertiary bg-bg-secondary/80 p-8 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent grid place-items-center">
                    <span className="text-sm font-black">{testimonial.name.split(" ").map((word) => word[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">{testimonial.name}</p>
                    <p className="text-sm text-text-muted">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">“{testimonial.quote}”</p>
                <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-text-muted">
                  <Star className="h-4 w-4 text-accent" />
                  <span>{testimonial.company}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
