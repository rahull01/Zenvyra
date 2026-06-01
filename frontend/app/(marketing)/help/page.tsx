"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, MessageCircle, Shield, Key, CreditCard, Users, Settings, ArrowRight, HelpCircle } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { title: "Getting Started", icon: BookOpen, count: 12, description: "New to ComplianceAI Pro? Start here for the basics." },
  { title: "Privacy & Legal", icon: Shield, count: 24, description: "How to generate and manage your legal documents." },
  { title: "Cookie Consent", icon: Settings, count: 18, description: "Setup banners, blocking, and preference centers." },
  { title: "Account & Billing", icon: CreditCard, count: 8, description: "Manage subscriptions, seats, and payment methods." },
  { title: "Team Management", icon: Users, count: 10, description: "Inviting members and setting permissions." },
  { title: "API & Integrations", icon: Key, count: 15, description: "Developer docs and 3rd party tool connections." },
];

const popularArticles = [
  "How to install the cookie banner on WordPress",
  "Understanding GDPR vs CCPA requirements",
  "Setting up multi-domain consent sync",
  "Customizing your privacy policy clauses",
  "Managing Data Subject Access Requests (DSAR)",
];

export default function HelpCenterPage() {
  return (
    <PageScaffold
      title="Help Center"
      subtitle="Find answers, guides, and technical documentation to help you automate your compliance operations."
    >
      <div className="relative max-w-2xl mb-16">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-text-muted" />
        <Input 
          placeholder="Search for articles, guides, and tutorials..." 
          className="pl-16 h-16 bg-background-secondary border-border-light rounded-2xl text-lg focus:border-primary/40 shadow-xl"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group rounded-3xl border border-border-light bg-background-secondary p-8 shadow-card hover:border-primary/30 transition-all"
          >
            <div className="h-12 w-12 rounded-2xl bg-background-primary flex items-center justify-center text-primary mb-6 border border-border-light group-hover:bg-primary group-hover:text-background-primary transition-colors">
              <category.icon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">{category.title}</h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">{category.description}</p>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border-light/50">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{category.count} Articles</span>
              <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 grid gap-12 lg:grid-cols-2">
        <div className="rounded-[2.5rem] bg-background-primary border border-border-light p-10 shadow-card">
          <h2 className="text-2xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <HelpCircle className="text-primary h-7 w-7" /> Popular Articles
          </h2>
          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <a 
                key={index}
                href="#" 
                className="block p-4 rounded-xl hover:bg-background-secondary transition-colors text-text-secondary hover:text-primary font-medium"
              >
                {article}
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-primary/5 border border-primary/20 p-10 flex flex-col items-center justify-center text-center">
           <div className="h-16 w-16 rounded-full bg-primary text-background-primary flex items-center justify-center mb-6">
              <MessageCircle className="h-8 w-8" />
           </div>
           <h2 className="text-2xl font-bold text-text-primary mb-4">Still need help?</h2>
           <p className="text-text-secondary mb-8 max-w-sm">
             Our compliance experts are available 24/7 to help you with your specific regulatory needs.
           </p>
           <Button className="rounded-full px-10 py-6 h-auto text-lg bg-primary text-background-primary hover:bg-primary-hover shadow-button">
             Chat with Support
           </Button>
        </div>
      </div>
    </PageScaffold>
  );
}
