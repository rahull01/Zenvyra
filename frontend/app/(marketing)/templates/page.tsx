"use client";

import { motion } from "framer-motion";
import { Search, FileCode, Shield, Scale, ShoppingCart, Smartphone, Globe, Filter, Download, ArrowRight } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = ["All", "Privacy", "Legal", "Ecommerce", "Mobile", "Enterprise"];

const templates = [
  { title: "Standard Privacy Policy", category: "Privacy", icon: Shield, description: "GDPR & CCPA compliant base template for SaaS products." },
  { title: "SaaS Terms of Service", category: "Legal", icon: Scale, description: "Comprehensive ToS including liability, usage, and billing clauses." },
  { title: "Ecommerce Return Policy", category: "Ecommerce", icon: ShoppingCart, description: "Regional templates for EU 14-day and US return rules." },
  { title: "Mobile EULA", category: "Mobile", icon: Smartphone, description: "End User License Agreement for iOS and Android applications." },
  { title: "Acceptable Use Policy", category: "Legal", icon: Scale, description: "Community standards and prohibited content guidelines." },
  { title: "Cookie Policy Template", category: "Privacy", icon: Globe, description: "Automated structure to list and describe your site's cookies." },
];

export default function TemplatesPage() {
  return (
    <PageScaffold
      title="Policy Templates"
      subtitle="Start with industry-vetted templates and customize them with AI for your specific product."
    >
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
          <Input 
            placeholder="Search templates..." 
            className="pl-12 h-14 bg-bg-secondary border-bg-tertiary rounded-2xl focus:border-accent/40"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                cat === "All" ? "bg-accent text-bg-primary" : "bg-bg-secondary text-text-secondary border border-bg-tertiary hover:border-accent/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template, index) => (
          <motion.div
            key={template.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group rounded-[2rem] border border-bg-tertiary bg-bg-secondary p-8 shadow-xl hover:-translate-y-1 hover:border-accent/40 transition-all flex flex-col"
          >
            <div className="h-14 w-14 rounded-3xl bg-bg-primary flex items-center justify-center text-accent mb-6 border border-bg-tertiary group-hover:bg-accent group-hover:text-bg-primary transition-colors">
              <template.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">{template.category}</span>
              <h2 className="text-xl font-bold text-text-primary mb-3">{template.title}</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-8">{template.description}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl border-bg-tertiary text-text-primary hover:bg-bg-primary">
                Preview
              </Button>
              <Button className="flex-1 rounded-xl bg-accent text-bg-primary hover:bg-accent-light">
                Use Template
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="mt-20 p-12 rounded-[3rem] bg-gradient-to-br from-bg-secondary to-bg-primary border border-bg-tertiary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <h2 className="text-4xl font-extrabold text-text-primary mb-6">Need a custom policy?</h2>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            Our AI Drafter can build custom policies from scratch based on your unique data collection practices and industry requirements.
          </p>
          <Button className="rounded-full px-8 py-6 h-auto text-lg bg-accent text-bg-primary hover:bg-accent-light">
            Start AI Drafting <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </PageScaffold>
  );
}
