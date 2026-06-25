"use client";

import { motion } from "framer-motion";
import { Briefcase, Zap, BarChart3, Globe, Shield, Users, ArrowRight } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Referral Partner",
    description: "Ideal for consultants and agencies who want to refer clients to Zenvyra.",
    benefits: ["15% recurring commission", "Partner dashboard", "Marketing collateral", "Priority support"],
    icon: Users,
  },
  {
    name: "Integration Partner",
    description: "For technology providers who want to build integrations with our API.",
    benefits: ["API access & support", "Co-marketing opportunities", "Developer sandbox", "Early access to features"],
    icon: Zap,
  },
  {
    name: "Strategic Partner",
    description: "Deep partnerships for enterprise legal firms and global consulting groups.",
    benefits: ["Custom revenue sharing", "Dedicated account manager", "Joint solution engineering", "White-label options"],
    icon: Globe,
  },
];

export default function PartnersPage() {
  return (
    <PageScaffold
      title="Partner with Zenvyra"
      subtitle="Join the ecosystem building the future of automated compliance operations."
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="rounded-[2rem] border border-bg-tertiary bg-bg-secondary p-8 shadow-2xl hover:border-accent/40 transition-all group"
          >
            <div className="h-14 w-14 rounded-3xl bg-accent/10 flex items-center justify-center text-accent mb-6">
              <tier.icon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">{tier.name}</h2>
            <p className="text-sm leading-relaxed text-text-secondary mb-8">{tier.description}</p>
            
            <ul className="space-y-4 mb-8">
              {tier.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm text-text-primary font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {benefit}
                </li>
              ))}
            </ul>
            
            <Button className="w-full rounded-2xl group-hover:bg-accent group-hover:text-bg-primary transition-colors">
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 rounded-[2.5rem] border border-bg-tertiary bg-bg-primary p-12 text-center shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-info/5 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">Why partner with us?</h2>
        <div className="grid gap-12 md:grid-cols-3 mt-12">
          <div>
            <div className="text-4xl font-black text-accent mb-2">3x</div>
            <p className="text-sm text-text-secondary uppercase tracking-widest font-bold">Client Retention</p>
          </div>
          <div>
            <div className="text-4xl font-black text-accent mb-2">24h</div>
            <p className="text-sm text-text-secondary uppercase tracking-widest font-bold">Onboarding</p>
          </div>
          <div>
            <div className="text-4xl font-black text-accent mb-2">99%</div>
            <p className="text-sm text-text-secondary uppercase tracking-widest font-bold">Partner Satisfaction</p>
          </div>
        </div>
      </motion.section>
    </PageScaffold>
  );
}
