"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, Send, CheckCircle2, ChevronRight, BrainCircuit, ShieldAlert, Cpu } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([
    {
      sender: "user",
      text: "Does CCPA apply if we are based in New York but have California web visitors?",
    },
    {
      sender: "ai",
      text: "Yes! CCPA/CPRA applies to businesses targeting California residents, regardless of where the business is headquartered, if they meet any of these thresholds: annual gross revenue over $25M, processing data of 50k+ consumers/devices, or deriving 50%+ of revenue from selling personal info.",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;

    const newMsgs = [...messages, { sender: "user", text: inputVal }];
    setMessages(newMsgs);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I've analyzed your question against current GDPR & CCPA statutes. You should update your Privacy Policy to clearly state the data sharing rules with subprocessors and offer a 'Do Not Sell My Info' page.",
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      {/* Hero Section */}
      <SectionWrapper className="pt-24 pb-16 lg:pt-32 relative overflow-hidden bg-gradient-to-b from-primary/10 to-background-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,126,34,0.08),transparent_50%)]" />
        <PageContainer className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Compliance Assistant
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary"
            >
              Your virtual <span className="text-primary">Privacy Readiness Assistant</span>, active 24/7.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
            >
              Ask privacy readiness questions, draft review-ready clauses, and detect website tracking gaps using AI-assisted workflows.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex justify-center"
            >
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary-hover text-white px-8 py-6 rounded-xl text-base font-semibold shadow-button">
                  Launch Assistant Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Simulator Section */}
      <SectionWrapper className="bg-background-secondary/40 border-y border-border-light">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Context Left */}
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-extrabold text-text-primary">Instant compliance readiness guidance, tailored for developers</h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Prepare better questions for counsel, flag third-party vendor risks, and draft policy updates when privacy requirements change.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Grounded in GDPR, CCPA, and HIPAA readiness references",
                  "Scans website HTML to map cookie behavior against disclosures",
                  "Recommends specific visual controls and banner setups",
                  "Flags unclassified vendors and suggests auto-block rules",
                ].map((item) => (
                  <div key={item} className="flex gap-2 text-sm text-text-primary font-medium">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Simulator Right */}
            <div className="lg:col-span-7 bg-background-primary border border-border-light rounded-3xl overflow-hidden shadow-modal flex flex-col h-[450px]">
              {/* Header */}
              <div className="p-4 border-b border-border-light bg-background-secondary flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">Zenvyra</h4>
                    <span className="text-[10px] text-status-success font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-status-success rounded-full animate-pulse-slow" /> Online & Indexed
                    </span>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-background-secondary/20">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                        m.sender === "user"
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-background-primary border border-border-light text-text-secondary rounded-bl-none shadow-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-background-primary border border-border-light text-text-secondary rounded-2xl rounded-bl-none p-4 text-xs font-semibold shadow-sm animate-pulse-slow">
                      AI is formulating compliance brief...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={sendMessage} className="p-3 border-t border-border-light bg-background-primary flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a compliance query (e.g. Does my GDPR policy need a DPO?)..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={isTyping}
                  className="flex-1 text-sm border-none outline-none px-3 bg-background-secondary rounded-xl placeholder-text-muted text-text-primary"
                />
                <Button type="submit" disabled={isTyping} className="bg-primary hover:bg-primary-hover text-white rounded-xl">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>
    </main>
  );
}
