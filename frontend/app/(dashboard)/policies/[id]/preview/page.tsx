"use client";

import React, { useState } from "react";
import { ArrowLeft, Edit, Copy, Check, Printer, FileDown, Globe, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PolicyPreviewPage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false);
  const embedCode = `<iframe src="https://cdn.complianceai.pro/policies/${params.id}" width="100%" height="600" frameborder="0"></iframe>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-background-secondary p-6 md:p-10 text-text-primary print:bg-white print:p-0">
      {/* Action Row */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/policies" className="text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hosted Preview</h1>
            <p className="text-caption text-text-muted mt-0.5">ID: {params.id} — Published state</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handlePrint} variant="outline" className="border-border-medium rounded-xl text-caption font-bold gap-2">
            <Printer className="h-4 w-4" />
            Print / PDF
          </Button>
          <Link href={`/dashboard/policies/${params.id}/edit`}>
            <Button className="bg-secondary-dark hover:bg-primary text-white rounded-xl font-bold gap-2">
              <Edit className="h-4 w-4" />
              Edit Draft
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Policy Document Content Card */}
        <div className="lg:col-span-8 bg-background-primary border border-border-light rounded-3xl p-8 shadow-card print:border-none print:shadow-none">
          <span className="text-caption font-bold text-status-success uppercase tracking-widest bg-status-success/10 text-status-success px-2.5 py-1 rounded-full mb-6 inline-block">
            ● Active & Hosted on CDN
          </span>
          <div className="prose prose-slate max-w-none space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary border-b border-border-light pb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-text-muted">Last updated: May 23, 2026</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              We process personal data based on user consent, contract necessity, or legitimate business interests. Users have the right to access, rectify, erase, or restrict processing of their personal data.
            </p>
            <h2 className="text-xl font-bold text-text-primary pt-4">1. Data Categories Collected</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              We collect names, emails, billing locations, and browser cookie telemetry. We use cookies to improve user experience, deliver targeted advertising, and capture traffic statistics.
            </p>
            <h2 className="text-xl font-bold text-text-primary pt-4">2. Third Party Processing</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Third party processors are only authorized to use customer files in line with instructions. Key subprocessors include Stripe for billing checkout and Google Analytics for performance telemetry.
            </p>
          </div>
        </div>

        {/* Sidebar Embed Card */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          <div className="bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Code className="text-primary h-4 w-4" />
              Embed on website
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              Copy the iframe code snippet below to embed the dynamically hosted version directly onto your website's privacy page.
            </p>
            <div className="bg-background-secondary p-3 rounded-2xl border border-border-light">
              <code className="text-caption font-mono text-text-secondary break-all">
                {embedCode}
              </code>
            </div>
            <Button
              onClick={handleCopyEmbed}
              className="w-full bg-primary hover:bg-primary-hover text-white text-caption font-bold py-2.5 rounded-xl gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Embed copied" : "Copy Embed Snippet"}
            </Button>
          </div>

          <div className="bg-secondary-dark text-white p-6 rounded-3xl space-y-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,126,34,0.1),transparent_50%)]" />
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <h4 className="font-bold text-sm">Need direct JSON feeds?</h4>
            <p className="text-caption text-text-tertiary leading-relaxed">
              Fetch policy clauses dynamically using our API to render them natively inside mobile applications or CLI terminals.
            </p>
            <Link href="/dashboard/integrations/api" className="block text-caption font-bold text-primary hover:underline">
              Generate API Key →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
