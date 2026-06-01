"use client";

import { motion } from "framer-motion";
import { Download, FileText, Image as ImageIcon, ExternalLink, Award, Newspaper } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import { Button } from "@/components/ui/button";

const pressKits = [
  { title: "Brand Identity", description: "Logos, marks, and brand guidelines for ComplianceAI Pro.", icon: ImageIcon },
  { title: "Executive Bios", description: "Professional headshots and bios for our leadership team.", icon: FileText },
  { title: "Product Fact Sheet", description: "Key features, stats, and company overview document.", icon: Newspaper },
];

const mediaMentions = [
  { source: "TechCrunch", title: "ComplianceAI Pro raises $25M to automate enterprise legal workflows.", date: "May 10, 2026" },
  { source: "Forbes", title: "The top 10 AI startups transforming the SaaS industry in 2026.", date: "April 22, 2026" },
  { source: "VentureBeat", title: "How ComplianceAI is solving the GDPR headache for small businesses.", date: "March 15, 2026" },
];

export default function PressPage() {
  return (
    <PageScaffold
      title="Press & Media"
      subtitle="Resources and news for journalists covering the future of compliance automation."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {pressKits.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="rounded-3xl border border-bg-tertiary bg-bg-secondary p-8 shadow-xl hover:border-accent/30 transition-all group"
          >
            <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
              <item.icon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-3">{item.title}</h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">{item.description}</p>
            <Button variant="outline" className="w-full rounded-xl border-bg-tertiary hover:border-accent/40 text-text-primary">
              Download Kit <Download className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-bold text-text-primary mb-10 flex items-center gap-4">
          <Award className="text-accent h-8 w-8" /> Recent Coverage
        </h2>
        <div className="grid gap-4">
          {mediaMentions.map((mention, index) => (
            <motion.a
              key={mention.title}
              href="#"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-bg-tertiary bg-bg-primary/50 hover:bg-bg-secondary hover:border-accent/20 transition-all group"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent mb-1 block">{mention.source}</span>
                <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors">{mention.title}</h3>
                <span className="text-xs text-text-muted mt-2 block">{mention.date}</span>
              </div>
              <ExternalLink className="h-5 w-5 text-text-muted group-hover:text-accent mt-4 md:mt-0 transition-colors" />
            </motion.a>
          ))}
        </div>
      </div>

      <section className="mt-20 p-10 rounded-[2.5rem] bg-accent/5 border border-accent/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Media Inquiries</h2>
          <p className="mt-2 text-text-secondary">For interviews and media requests, please reach out to our PR team.</p>
        </div>
        <Button className="rounded-full px-8 py-6 h-auto text-lg bg-accent text-bg-primary hover:bg-accent-light">
          press@complianceai.pro
        </Button>
      </section>
    </PageScaffold>
  );
}
