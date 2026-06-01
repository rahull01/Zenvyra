"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, Sparkles, AlertTriangle, CheckCircle, FileText, Wand2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PolicyEditorPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState(
    `# Privacy Policy\n\nLast updated: May 23, 2026\n\nWe collect personal identifiers such as name, email, IP addresses, and billing credentials when you interact with our platform services.\n\n## 1. Third Party Subprocessors\nWe share customer data with Stripe for payments and Google Analytics for web telemetry tracking.`
  );
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = () => {
    // Handle save
  };

  const handleAiSuggest = () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    setTimeout(() => {
      setContent(
        (prev) =>
          prev +
          `\n\n## 2. California Consumer Privacy Rights (CCPA)\nUnder CCPA, California residents have the right to request access to their collected data profiles and opt-out of data sale frameworks. Contact us at compliance@acme.com to file DSAR inquiries.`
      );
      setIsGenerating(false);
      setAiPrompt("");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-background-secondary p-6 md:p-10 text-text-primary">
      {/* Top action row */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/policies" className="text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Policy Document</h1>
            <p className="text-caption text-text-muted mt-0.5">Policy ID: {params.id} — Live hosted draft</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={`/dashboard/policies/${params.id}/preview`}>
            <Button variant="outline" className="border-border-medium rounded-xl text-caption font-bold gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Preview Live
            </Button>
          </Link>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover text-white rounded-xl font-bold gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Editor layout grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Rich text area */}
        <div className="lg:col-span-8 bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex justify-between items-center border-b border-border-light pb-3">
            <span className="text-caption font-bold text-text-muted uppercase tracking-wider">Markdown Source Editor</span>
            <span className="text-caption text-primary font-bold uppercase bg-primary-light px-2.5 py-1 rounded-full">
              Autosaved
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[450px] font-mono text-sm leading-relaxed p-4 bg-background-secondary rounded-2xl border border-border-light outline-none focus:border-primary text-text-primary resize-y"
          />
        </div>

        {/* Sidebar panels */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Helper Card */}
          <div className="bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="text-primary h-4 w-4" />
              AI Legal Copilot
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Describe a custom business practice or subprocessor in simple English to generate legal clause text.
            </p>
            <div className="space-y-3">
              <textarea
                placeholder="e.g. Generate a CCPA do-not-sell clause with support contact details..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                disabled={isGenerating}
                className="w-full text-xs p-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary placeholder-text-muted resize-none min-h-[80px]"
              />
              <Button
                onClick={handleAiSuggest}
                disabled={isGenerating || !aiPrompt}
                className="w-full bg-secondary-dark hover:bg-primary text-white text-caption font-bold py-2.5 rounded-xl gap-2 transition-all"
              >
                <Wand2 className="h-4 w-4" />
                {isGenerating ? "Synthesizing clause..." : "Generate & Append Clause"}
              </Button>
            </div>
          </div>

          {/* Compliance checklist */}
          <div className="bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Compliance Checklist</h3>
            <div className="space-y-3">
              {[
                { label: "DPO Email & Contact Address defined", ok: true },
                { label: "GDPR rights detailed (access/deletion)", ok: true },
                { label: "Third-party subprocessors itemized", ok: true },
                { label: "CCPA data sharing opt-out explained", ok: false },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs">
                  {item.ok ? (
                    <CheckCircle className="h-4.5 w-4.5 text-status-success shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4.5 w-4.5 text-status-warning shrink-0 mt-0.5" />
                  )}
                  <span className={`font-medium ${item.ok ? "text-text-primary" : "text-text-secondary"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
