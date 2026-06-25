"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { ChevronDown } from "lucide-react";

const faqs = [
  { question: "Can Zenvyra generate policies for my industry?", answer: "Yes. The platform supports SaaS, ecommerce, marketplace, mobile, community, medical, and finance variants with AI-assisted templates." },
  { question: "Does it support GDPR and CCPA?", answer: "Absolutely. We monitor GDPR, CCPA, LGPD, PIPEDA, POPIA, PDPA, PIPL, and other major regimes with real-time alerts." },
  { question: "How do I deploy a policy to my website?", answer: "Use our direct embed, WordPress, Shopify, or API deployment options and enable auto-updates for live policy changes." },
  { question: "Will it manage cookie consent automatically?", answer: "Yes. The consent manager includes banner themes, auto-blocking, regional rules, logs, and scenario-based preference centers." },
  { question: "Can I invite my team and control permissions?", answer: "You can create teams with Owner, Admin, Editor, Viewer, and Compliance Officer roles, plus audit trails and SSO." },
  { question: "Is my data stored securely in the EU?", answer: "EU data residency options are available for GDPR compliance, and we use encrypted storage and TLS 1.3 in transit." },
  { question: "Do you offer automated DSAR handling?", answer: "Yes. Our DSAR form builder captures requests, tracks deadlines, and sends auto-response emails." },
  { question: "What integrations are available?", answer: "We support Google Tag Manager, Google Consent Mode, Slack, Zapier, Shopify, and more via our API-first platform." },
  { question: "Can I compare my compliance against competitors?", answer: "Competitor benchmarking helps you identify gaps, track scores, and monitor industry trends." },
  { question: "How do I get started?", answer: "Sign up, launch the onboarding wizard, add your website, select regulations, and run your first scan in under 5 minutes." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SectionWrapper className="relative py-32 bg-bg-base text-text-primary">
      <PageContainer>
        <div className="mb-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">FAQ</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">Frequently asked questions</h2>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-text-secondary leading-relaxed">
            Everything you need to know before you commit to building your compliance stack on Zenvyra.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <motion.button
              key={faq.question}
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group rounded-[2rem] border border-bg-tertiary bg-bg-secondary/80 p-6 text-left shadow-sm transition-all duration-300 hover:border-accent/40"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-text-primary">{faq.question}</p>
                </div>
                <ChevronDown className={`h-5 w-5 text-accent transition-transform duration-300 ${openIndex === index ? "rotate-180" : "rotate-0"}`} />
              </div>
              {openIndex === index && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="mt-4 overflow-hidden text-sm text-text-secondary leading-7">
                  {faq.answer}
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
