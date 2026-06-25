"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, TrendingUp, AlertTriangle, MessageSquare, 
  Check, ArrowRight, Zap, RefreshCw, Send, HelpCircle, 
  Clock, ShieldAlert, Cpu, Eye, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";

// Mock Trajectory Data
const chartData = [
  { month: "Jan", score: 62, target: 95 },
  { month: "Feb", score: 68, target: 95 },
  { month: "Mar", score: 75, target: 95 },
  { month: "Apr", score: 84, target: 95 },
  { month: "May", score: 89, target: 95 },
];

const initialAlerts = [
  { id: 1, type: "critical", title: "Missing California (CCPA) Opt-Out Signal", desc: "You are sharing analytics identifiers in California without honoring Global Privacy Control (GPC) headers or showing a Do Not Sell link.", cost: "Potential $7,500 CPRA violation", applied: false },
  { id: 2, type: "high", title: "Contrast Ratio Policy Violation in Footer Links", desc: "Footer legal policy links have contrast ratios below WCAG 2.1 AA requirements (currently 2.8:1 instead of 4.5:1).", cost: "Exposes accessibility lawsuits", applied: false },
  { id: 3, type: "medium", title: "Unprotected Domain verification Endpoint", desc: "Endpoint /api/v1/organization/domain/verify lacks rate-limiting constraints, enabling potential brute-force vectors.", cost: "High vulnerability risk", applied: false },
];

const initialChatMessages = [
  { sender: "AI", content: "Hello! I am your Zenvyra regulatory copilot. Ask me anything about GDPR, CCPA, accessibility guidelines, or active system risks." }
];

const quickQuestions = [
  "How do I configure Google Consent Mode v2?",
  "What counts as sell/share under CPRA?",
  "Tell me my top accessibility findings."
];

export default function AiInsightsDashboardPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [applyingId, setApplyingId] = useState<number | null>(null);

  const handleApplyResolution = (id: number) => {
    setApplyingId(id);
    setTimeout(() => {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, applied: true } : a));
      setApplyingId(null);
    }, 1500);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // User Message
    setChatMessages(prev => [...prev, { sender: "User", content: text }]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "I am compiling standard guidelines based on latest regulatory changes. Let me know if you would like me to draft direct patch code for this.";
      
      const lower = text.toLowerCase();
      if (lower.includes("consent mode")) {
        aiResponse = "To configure Google Consent Mode v2, you need to update your GTM script triggers to check 'ad_storage' and 'analytics_storage' permissions before firing tags. Our Consent Manager script handles this automatically out-of-the-box.";
      } else if (lower.includes("sell") || lower.includes("cpra")) {
        aiResponse = "Under CPRA, 'selling' is defined as sharing personal information for monetary or valuable consideration, while 'sharing' covers behavioral advertising tracking. Providing a persistent opt-out link is required.";
      } else if (lower.includes("accessibility") || lower.includes("contrast")) {
        aiResponse = "Your top accessibility issue is text color contrast in footer lists under WCAG 2.1 AA. Our auto-fix tool can automatically override the CSS to apply a compliant theme in one click.";
      }

      setChatMessages(prev => [...prev, { sender: "AI", content: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-10 text-text-primary p-1 md:p-4">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tight text-text-primary flex items-center gap-3">
          <Sparkles className="h-10 w-10 text-accent animate-pulse" /> AI Insights & Copilot Hub
        </h1>
        <p className="text-text-secondary mt-2 max-w-2xl leading-relaxed">
          Forecast compliance performance, remediate accessibility and privacy alerts automatically, and consult the Zenvyra GPT-4 legal engine in real-time.
        </p>
      </div>

      {/* Grid: Trends and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Trajectory Chart & Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Compliance Trajectory Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border-light bg-surface-card p-8 shadow-card">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-accent/10 rounded-full blur-[50px] -mr-20 -mt-20 pointer-events-none" />
            
            <div className="flex justify-between items-center pb-6 border-b border-border-light/60">
              <div>
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" /> Compliance Trajectory Forecast
                </h3>
                <p className="text-caption text-text-secondary mt-1">Calculated based on 200+ continuous scanning checkpoints</p>
              </div>
              <span className="text-caption font-bold text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/20">
                Score Trajectory: +27%
              </span>
            </div>

            <div className="h-72 w-full mt-6 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="8 8" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background-tertiary border border-border-light p-4 rounded-2xl shadow-modal backdrop-blur-xl">
                            <p className="text-caption font-black text-text-secondary uppercase tracking-wider mb-2">{label} 2026</p>
                            <div className="space-y-1">
                              <span className="text-caption font-bold text-text-primary block">Score: <strong className="text-accent">{payload[0].value}%</strong></span>
                              <span className="text-caption font-bold text-text-secondary block">Target: 95%</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--accent)" 
                    strokeWidth={3} 
                    fill="url(#scoreGlow)" 
                    name="Compliance Score"
                    activeDot={{ r: 6, fill: "var(--accent)", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Actionable Recommendations list */}
          <div className="rounded-[2.5rem] border border-border-light bg-surface-card p-8 shadow-card">
            <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-accent" /> Continuous Monitoring Findings & Remediations
            </h3>

            <div className="space-y-4">
              {alerts.map((a) => (
                <div 
                  key={a.id} 
                  className={`p-6 rounded-3xl border transition-all ${
                    a.applied 
                      ? "bg-background-primary/20 border-border-light/40 opacity-70" 
                      : "bg-background-primary border-border-light hover:border-accent/40"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-1 rounded-full text-caption font-black uppercase tracking-widest border ${
                          a.type === "critical" ? "bg-status-error/10 border-status-error/20 text-status-error" :
                          a.type === "high" ? "bg-accent/10 border-accent/20 text-accent" :
                          "bg-status-warning/10 border-status-warning/20 text-status-warning"
                        }`}>
                          {a.type}
                        </span>
                        <span className="text-caption font-black text-status-error">{a.cost}</span>
                      </div>
                      <h4 className="text-base font-bold text-text-primary mt-2">{a.title}</h4>
                      <p className="text-sm text-text-secondary mt-1 leading-relaxed max-w-xl">{a.desc}</p>
                    </div>

                    <div className="shrink-0">
                      {a.applied ? (
                        <span className="text-caption font-bold text-status-success flex items-center gap-1.5 bg-status-success/10 border border-status-success/20 rounded-full px-4 py-2">
                          <Check className="h-4 w-4" /> Applied & Resolved
                        </span>
                      ) : (
                        <Button
                          disabled={applyingId !== null}
                          onClick={() => handleApplyResolution(a.id)}
                          className="rounded-full bg-accent text-white hover:bg-accent-hover px-5 py-2.5 h-auto font-bold uppercase tracking-wider text-caption shadow-button flex items-center gap-1.5"
                        >
                          {applyingId === a.id ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Deploying...
                            </>
                          ) : (
                            <>
                              <Zap className="h-3.5 w-3.5 fill-background-primary" /> Auto-Fix Issue
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Chatbot Companion */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-[2.5rem] border border-border-light bg-surface-card p-6 shadow-card flex flex-col min-h-[640px]">
            
            {/* Chatbot Header */}
            <div className="pb-4 border-b border-border-light flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Cpu className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">Zenvyra Brain</h3>
                <span className="text-caption font-bold text-status-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-status-success rounded-full animate-ping" /> Online Copilot
                </span>
              </div>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4 max-h-[360px] pr-2">
              <AnimatePresence>
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`p-4 rounded-3xl max-w-[85%] text-sm leading-relaxed ${
                      msg.sender === "User"
                        ? "bg-accent text-white font-semibold"
                        : "bg-background-primary border border-border-light text-text-secondary"
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-background-primary border border-border-light p-4 rounded-3xl flex gap-1 items-center">
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="py-4 border-t border-border-light space-y-2">
              <span className="text-caption font-black uppercase tracking-widest text-text-secondary">Quick Queries</span>
              <div className="space-y-1">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-left p-2.5 rounded-xl bg-background-primary/50 border border-border-light hover:border-accent/40 text-caption font-semibold text-text-secondary transition-all truncate"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="pt-4 border-t border-border-light flex gap-2">
              <input
                type="text"
                placeholder="Ask our AI brain..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(chatInput)}
                className="flex-1 rounded-full border border-border-light bg-background-primary/80 py-3 px-5 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent/40 focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage(chatInput)}
                className="h-11 w-11 rounded-full bg-accent hover:bg-accent-hover text-white flex items-center justify-center shrink-0 shadow-button transition-all"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
