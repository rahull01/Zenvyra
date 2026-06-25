"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Clock, Calendar, CheckCircle2, Circle, 
  Download, Share2, HelpCircle, AlertTriangle, ShieldCheck, 
  Globe, Shield, Lock, Code, ChevronRight
} from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import { Button } from "@/components/ui/button";

// Mock Guide details based on slug
const guideDetails: Record<string, {
  title: string;
  category: string;
  time: string;
  lastUpdated: string;
  icon: any;
  overview: string;
  checklist: { id: string; label: string; details: string }[];
  content: { id: string; sectionTitle: string; paragraphs: string[] }[];
}> = {
  "gdpr-compliance-blueprint": {
    title: "GDPR Compliance Blueprint",
    category: "Regulation",
    time: "25 min read",
    lastUpdated: "May 2026",
    icon: Globe,
    overview: "This blueprint guides you through the full operational and technical measures required to achieve GDPR compliance as a SaaS business.",
    checklist: [
      { id: "gdpr-1", label: "Perform a comprehensive Data Mapping exercise", details: "Identify all personal data collected, stored, and processed by your systems." },
      { id: "gdpr-2", label: "Update privacy policy with explicit lawful bases", details: "Detail clear reasons for processing (consent, contract, legitimate interest)." },
      { id: "gdpr-3", label: "Implement cookie consent with granular choices", details: "Require clear opt-in consent before firing non-essential tracking scripts." },
      { id: "gdpr-4", label: "Draft a Standard Data Processing Agreement (DPA)", details: "Ensure all sub-processors are legally bound to protect personal data." },
      { id: "gdpr-5", label: "Establish a Data Breach Response protocol", details: "Must be capable of reporting to regulators within 72 hours of discovery." }
    ],
    content: [
      {
        id: "overview",
        sectionTitle: "1. Executive Overview & Scope",
        paragraphs: [
          "The General Data Protection Regulation (GDPR) is the toughest privacy and security law in the world. Though it was drafted and passed by the European Union (EU), it imposes obligations onto organizations anywhere, so long as they target or collect data related to people in the EU.",
          "As an enterprise SaaS platform, compliance is not just about avoiding severe fines (up to 4% of global annual turnover), but it is a critical competitive advantage that unlocks enterprise sales pipelines."
        ]
      },
      {
        id: "principles",
        sectionTitle: "2. The Seven Core Principles",
        paragraphs: [
          "GDPR compliance is built upon seven foundational concepts: Lawfulness, fairness and transparency; Purpose limitation; Data minimization; Accuracy; Storage limitation; Integrity and confidentiality (security); and Accountability.",
          "You must demonstrate that you actively think about privacy at every stage of product design (Privacy by Design) rather than treating it as an afterthought."
        ]
      },
      {
        id: "implementation",
        sectionTitle: "3. Operational Technical Controls",
        paragraphs: [
          "Technically, you must encrypt personal data at rest and in transit, configure secure access controls, and provide users with a clean interface to exercise their data rights (access, erasure, portability).",
          "Ensure your infrastructure maintains immutable audit logs documenting all access, modifications, and system security events."
        ]
      }
    ]
  },
  "cookie-consent-setup": {
    title: "Cookie Consent Setup Guide",
    category: "Technical",
    time: "15 min read",
    lastUpdated: "May 2026",
    icon: Code,
    overview: "Complete technical guide to deploying compliance banners, categorizing scripts, and configuring auto-blocking engines.",
    checklist: [
      { id: "cookie-1", label: "Deploy cookie banner global snippet", details: "Inject the async loader script at the absolute top of your HTML document." },
      { id: "cookie-2", label: "Classify tracking cookies & tags", details: "Categorize trackers into strictly necessary, functional, analytics, and marketing." },
      { id: "cookie-3", label: "Configure zero-cookie load behavior", details: "Ensure no marketing or analytics tags fire until active consent is received." },
      { id: "cookie-4", label: "Create a persistent consent trigger button", details: "Provide a small, subtle floating widget allowing users to change consent at any time." }
    ],
    content: [
      {
        id: "banner-deployment",
        sectionTitle: "1. Banner Deployment Strategy",
        paragraphs: [
          "Deploying a consent banner requires loading a lightweight tag manager script in the head element of your pages. This ensures it is the first script initialized, allowing it to hook and halt tracking scripts before they place cookies.",
          "Modern privacy rules demand standard layouts that avoid manipulative dark patterns. Equal weight must be given to Accept All and Reject All choices."
        ]
      },
      {
        id: "auto-blocking",
        sectionTitle: "2. Configuring Auto-Blocking Engines",
        paragraphs: [
          "Zenvyra features a dynamic auto-blocking engine that rewrites scripts on-the-fly. For custom configurations, you can manually mark up scripts by changing the type attribute to 'text/plain' and assigning it a compliance category class.",
          "Once the user gives consent, our engine automatically flips the type attribute back to 'text/javascript' and executes the target script."
        ]
      }
    ]
  },
  "mastering-dsar-requests": {
    title: "Mastering DSAR Requests",
    category: "Operations",
    time: "10 min read",
    lastUpdated: "May 2026",
    icon: Shield,
    overview: "A comprehensive guide on establishing standard operating procedures to verify identity, export data, and delete details securely.",
    checklist: [
      { id: "dsar-1", label: "Publish a secure public DSAR portal", details: "Create a dedicated form where users can submit and track request status." },
      { id: "dsar-2", label: "Establish identity verification rules", details: "Validate submitter's email and request supplementary verification if sensitive data is involved." },
      { id: "dsar-3", label: "Build database search & export routines", details: "Script mechanisms to compile all database rows containing user's identifiers." },
      { id: "dsar-4", label: "Configure data scrubbing & masking tools", details: "Safely delete records or anonymize them without breaking DB transactional integrity." }
    ],
    content: [
      {
        id: "dsar-foundations",
        sectionTitle: "1. DSAR Request Guidelines",
        paragraphs: [
          "Data Subject Access Requests (DSARs) are a core component of GDPR, CCPA, and general privacy legislation. Users have a legal right to request a copy of the data you hold about them or command you to destroy it.",
          "Under GDPR, you have exactly 30 calendar days to verify the identity and fully execute the request. Failure to comply can trigger major class-action suits."
        ]
      },
      {
        id: "security",
        sectionTitle: "2. Identity Verification & Security",
        paragraphs: [
          "Never distribute exported zip packages without robust verification. Malicious actors frequently leverage social-engineered DSAR requests to hijack private accounts and download database records.",
          "Enforce multi-factor confirmation steps before releasing data packages."
        ]
      }
    ]
  },
  "the-ccpa-checklist": {
    title: "The CCPA Compliance Checklist",
    category: "Regulation",
    time: "20 min read",
    lastUpdated: "May 2026",
    icon: Lock,
    overview: "Everything you need to adapt to the California Consumer Privacy Act and the revised CPRA updates.",
    checklist: [
      { id: "ccpa-1", label: "Add 'Do Not Sell My Info' footer link", details: "Provide a prominent, clear opt-out action targeting behavioral tracking tools." },
      { id: "ccpa-2", label: "Update privacy notice with California rights", details: "Add notices detail right to opt-out, know, delete, and correct incorrect information." },
      { id: "ccpa-3", label: "Set up opt-out link signals (GPC)", details: "Detect global privacy control headers sent by browsers and auto-honor opt-outs." },
      { id: "ccpa-4", label: "Validate service provider agreements", details: "Modify contracts with suppliers stating they will not retain, use, or sell private data." }
    ],
    content: [
      {
        id: "ccpa-vs-gdpr",
        sectionTitle: "1. CCPA Overview vs GDPR",
        paragraphs: [
          "The California Consumer Privacy Act (CCPA) protects the privacy rights of California consumers. While it shares many similarities with GDPR, it differs drastically in consent rules. GDPR enforces strict opt-in, whereas CCPA focuses heavily on the right to opt-out.",
          "If your business sells personal information (which includes sharing identifiers via analytics scripts), you must place an explicit 'Do Not Sell or Share My Personal Information' option in your page footers."
        ]
      },
      {
        id: "enforcement",
        sectionTitle: "2. CPRA Enhancements",
        paragraphs: [
          "The California Privacy Rights Act (CPRA) updated CCPA by creating a dedicated enforcement agency (CPPA) and adding a new category of 'Sensitive Personal Information' which carries stricter security obligations.",
          "Ensure your internal systems catalog sensitive metrics (SSNs, geolocations, financial access tokens) separately."
        ]
      }
    ]
  }
};

export default function GuideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const guide = guideDetails[slug];

  // Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (guide) {
      const initialChecked: Record<string, boolean> = {};
      guide.checklist.forEach(item => {
        initialChecked[item.id] = false;
      });
      setCheckedItems(initialChecked);
      if (guide.content.length > 0) {
        setActiveSection(guide.content[0].id);
      }
    }
  }, [guide]);

  if (!guide) {
    return (
      <PageScaffold title="Guide Not Found" subtitle="The requested regulation guide could not be located.">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="h-16 w-16 text-accent mb-6" />
          <h2 className="text-2xl font-bold text-text-primary mb-4">Oops! Guide Missing</h2>
          <p className="text-text-secondary max-w-md mb-8">This compliance tutorial may have been updated or moved. Check out other guidelines in our index.</p>
          <Button onClick={() => router.push("/guides")} className="rounded-full bg-accent text-bg-primary hover:bg-accent-light px-8 py-4 h-auto font-bold uppercase tracking-wider text-sm shadow-glow-accent">
            Back to Guides Index
          </Button>
        </div>
      </PageScaffold>
    );
  }

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalItems = guide.checklist.length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const GuideIcon = guide.icon || Globe;

  return (
    <PageScaffold
      title=""
      subtitle=""
    >
      <div className="max-w-6xl mx-auto -mt-16">
        {/* Back Link */}
        <button 
          onClick={() => router.push("/guides")}
          className="flex items-center gap-2 text-text-secondary hover:text-accent font-bold uppercase tracking-widest text-xs mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to All Guides
        </button>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-[3rem] border border-bg-tertiary bg-bg-secondary p-8 sm:p-12 shadow-2xl mb-12">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent uppercase tracking-wider">{guide.category}</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase">
                  <Clock className="h-4 w-4" /> {guide.time}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase">
                  <Calendar className="h-4 w-4" /> Updated {guide.lastUpdated}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight mb-4">{guide.title}</h1>
              <p className="text-text-secondary text-lg leading-relaxed max-w-3xl">{guide.overview}</p>
            </div>

            <div className="w-24 h-24 rounded-[2rem] bg-bg-primary border border-bg-tertiary flex items-center justify-center text-accent shrink-0 shadow-lg">
              <GuideIcon className="h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            {/* Real-time Checklist Tool */}
            <div className="rounded-[2.5rem] border border-bg-tertiary bg-bg-secondary/60 backdrop-blur-xl p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 pb-6 border-b border-bg-tertiary">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Actionable Steps Checklist</h2>
                  <p className="text-sm text-text-muted mt-1">Check off tasks as you complete them to track readiness</p>
                </div>
                
                <div className="flex items-center gap-3 bg-bg-primary border border-bg-tertiary rounded-2xl px-5 py-3 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-accent tracking-widest">Readiness Score</span>
                    <span className="text-xl font-bold text-text-primary">{progressPercent}% Ready</span>
                  </div>
                  <div className="h-10 w-10 rounded-full border border-bg-tertiary flex items-center justify-center text-accent relative">
                    <svg className="w-10 h-10 transform -rotate-90 absolute">
                      <circle cx="20" cy="20" r="16" stroke="currentColor" className="text-bg-secondary" strokeWidth="3" fill="transparent" />
                      <circle cx="20" cy="20" r="16" stroke="currentColor" className="text-accent" strokeWidth="3" fill="transparent"
                        strokeDasharray={100} strokeDashoffset={100 - progressPercent} />
                    </svg>
                    <ShieldCheck className="h-5 w-5 z-10" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {guide.checklist.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div 
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`flex gap-4 p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                        isChecked 
                          ? "bg-accent/5 border-accent/40 shadow-inner" 
                          : "bg-bg-primary/50 border-bg-tertiary hover:border-text-muted"
                      }`}
                    >
                      <button className={`mt-0.5 shrink-0 transition-colors ${isChecked ? "text-accent" : "text-text-muted"}`}>
                        {isChecked ? (
                          <CheckCircle2 className="h-6 w-6 text-bg-secondary fill-accent stroke-accent" fill="currentColor" />
                        ) : (
                          <Circle className="h-6 w-6" />
                        )}
                      </button>

                      <div>
                        <span className={`font-bold text-base transition-colors ${isChecked ? "text-accent line-through opacity-80" : "text-text-primary"}`}>
                          {item.label}
                        </span>
                        <p className="text-sm text-text-secondary mt-1 leading-relaxed">{item.details}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* In-depth content sections */}
            <div className="space-y-12">
              {guide.content.map((sec) => (
                <div 
                  key={sec.id} 
                  id={sec.id}
                  className="scroll-mt-24 space-y-6"
                >
                  <h3 className="text-2xl font-bold text-text-primary">{sec.sectionTitle}</h3>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-text-secondary text-base leading-relaxed">{p}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* FAQ Helper card */}
            <div className="rounded-[2.5rem] border border-bg-tertiary bg-bg-primary p-8 flex items-start gap-5 shadow-lg">
              <HelpCircle className="h-10 w-10 text-accent shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-text-primary">Need counsel-reviewed guidance?</h4>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                  These blueprints support operational readiness. For company-specific legal questions, pair the evidence pack with qualified counsel review.
                </p>
                <Button className="mt-5 rounded-full bg-accent text-bg-primary hover:bg-accent-light px-6 py-2.5 h-auto font-bold uppercase tracking-wider text-xs">
                  Request Audited Review
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Table of Contents */}
            <div className="rounded-[2.5rem] border border-bg-tertiary bg-bg-secondary p-8 sticky top-24 shadow-xl">
              <h3 className="text-lg font-black uppercase tracking-widest text-text-primary mb-6">Outline</h3>
              <nav className="space-y-1">
                <a 
                  href="#overview"
                  onClick={() => setActiveSection("overview")}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all group ${
                    activeSection === "overview" 
                      ? "bg-bg-primary text-accent border border-bg-tertiary" 
                      : "text-text-secondary hover:bg-bg-primary/50 hover:text-text-primary"
                  }`}
                >
                  Executive Overview <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                {guide.content.slice(1).map((sec) => (
                  <a 
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all group ${
                      activeSection === sec.id 
                        ? "bg-bg-primary text-accent border border-bg-tertiary" 
                        : "text-text-secondary hover:bg-bg-primary/50 hover:text-text-primary"
                    }`}
                  >
                    {sec.sectionTitle.substring(3)} <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </nav>

              {/* Resource Downloads */}
              <div className="mt-8 pt-8 border-t border-bg-tertiary space-y-4">
                <Button className="w-full justify-center rounded-full bg-accent text-bg-primary hover:bg-accent-light font-bold py-4 h-auto shadow-glow-accent inline-flex items-center gap-2">
                  <Download className="h-4 w-4" /> Download PDF Blueprint
                </Button>
                
                <Button variant="outline" className="w-full justify-center rounded-full border border-bg-tertiary text-text-primary hover:bg-bg-primary font-bold py-4 h-auto inline-flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> Share Guide Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageScaffold>
  );
}
