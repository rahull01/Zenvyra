"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bot, Loader2, Sparkles, User } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const SUGGESTIONS = [
  "What is the EU AI Act?",
  "How do I classify AI risk?",
  "What evidence do I need for high-risk AI?",
  "How do I publish an AI Act proof pack?",
];

function replyTo(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("risk") || lower.includes("classify")) {
    return "Risk classification depends on use case. Prohibited uses are banned. High-risk includes biometric, hiring, finance, education, and safety-critical systems. Limited-risk systems need transparency. Minimal-risk systems have only AI literacy obligations. Run an assessment in the AI Act workspace for a specific system.";
  }
  if (lower.includes("evidence") || lower.includes("proof pack")) {
    return "Evidence items include policy documents, model cards, risk assessments, log samples, process documents, and owner attestations. Link each item to a gap in your AI system details, then export the proof pack.";
  }
  if (lower.includes("publish") || lower.includes("verify") || lower.includes("certificate")) {
    return "Once gaps are addressed, open an AI system details page, issue a public readiness proof, and share the verification URL or embed the badge on your site.";
  }
  if (lower.includes("high-risk")) {
    return "High-risk AI systems must meet provider or deployer obligations: risk management, data governance, technical documentation, transparency, human oversight, accuracy, robustness, and cybersecurity. Start a conformity assessment workstream and involve counsel.";
  }
  if (lower.includes("eu ai act")) {
    return "The EU AI Act regulates AI systems placed on the EU market. It defines risk levels (prohibited, high-risk, limited-risk, minimal-risk) and sets obligations, evidence, and transparency requirements. Zenvyra helps you inventory systems and prepare evidence.";
  }
  return "I can help with AI Act risk classification, evidence requirements, and the Zenvyra workflow. Ask a specific question or pick a suggestion.";
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I'm your AI compliance assistant. I can answer questions about the EU AI Act, risk classification, evidence, and proof packs.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const question = text.trim();
    if (!question) return;
    setInput("");
    setMessages((current) => [...current, { role: "user", text: question }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((current) => [...current, { role: "assistant", text: replyTo(question) }]);
      setTyping(false);
    }, 600);
  };

  return (
    <DashboardPageShell
      title="AI Compliance Assistant"
      subtitle="Get plain-language guidance on AI Act readiness, risk classification, and evidence."
      icon={Sparkles}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="standard-card hover:!translate-y-0 flex flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-2">
            {messages.map((message, i) => (
              <div key={i} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.role === "user" ? "bg-accent" : "bg-accent/10"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-accent" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-accent text-white"
                      : "bg-background-secondary text-text-secondary"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
                <div className="rounded-2xl bg-background-secondary px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-text-tertiary" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="mt-4 border-t border-border-light pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                className="text-input flex-1"
                placeholder="Ask about AI Act readiness..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="btn-primary !px-4" disabled={typing || !input.trim()}>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="standard-card hover:!translate-y-0">
            <h3 className="mb-3 font-bold text-text-primary">Suggested questions</h3>
            <div className="space-y-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => send(suggestion)}
                  className="w-full rounded-lg border border-border-light bg-background-secondary px-3 py-2 text-left text-sm text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-status-warning/30 bg-status-warning/10 p-4 text-sm text-text-secondary">
            <p>This assistant provides general guidance, not legal advice. Always consult counsel for specific compliance decisions.</p>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
