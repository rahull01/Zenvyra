"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, AlertCircle, CheckCircle2, Info, Loader2, ArrowRight, ShieldCheck, Globe, Lock, Code } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ComplianceCheckerPage() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setScanning(true);
    setResult(null);
    
    // Simulate scan
    setTimeout(() => {
      setScanning(false);
      setResult({
        score: 72,
        status: "Action Required",
        url: url,
        findings: [
          { type: "Cookies", status: "Warning", msg: "Found 12 analytics cookies without active blocking.", icon: Globe },
          { type: "Privacy Policy", status: "Pass", msg: "Found valid policy with GDPR clauses.", icon: Lock },
          { type: "SSL/Security", status: "Pass", msg: "SSL certificate is valid and active.", icon: ShieldCheck },
          { type: "Accessibility", status: "Fail", msg: "Missing 14 alt text tags and poor color contrast.", icon: Code },
        ]
      });
    }, 3000);
  };

  return (
    <PageScaffold
      title="Compliance Checker"
      subtitle="Run a free diagnostic scan on any URL to identify common regulatory risks and compliance gaps."
    >
      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleScan} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-info/50 rounded-[2.2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex flex-col md:flex-row gap-4 p-2 bg-bg-secondary border border-bg-tertiary rounded-[2rem] shadow-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-text-muted" />
              <Input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com" 
                className="pl-16 h-16 bg-transparent border-none text-xl focus-visible:ring-0 placeholder:text-text-muted"
                disabled={scanning}
              />
            </div>
            <Button 
              type="submit" 
              className="h-16 px-10 rounded-2xl bg-accent text-bg-primary text-lg font-bold hover:bg-accent-light shadow-glow-accent disabled:opacity-50"
              disabled={scanning || !url}
            >
              {scanning ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Analyzing Site...
                </>
              ) : (
                "Run Free Scan"
              )}
            </Button>
          </div>
        </form>

        <AnimatePresence>
          {scanning && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-16 text-center"
            >
              <div className="relative inline-block">
                <div className="h-24 w-24 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
                <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-accent" />
              </div>
              <p className="mt-8 text-xl font-bold text-text-primary animate-pulse">Running deep-tissue compliance audit...</p>
              <p className="mt-2 text-text-secondary">Checking policies, cookies, and regulatory headers</p>
            </motion.div>
          )}

          {result && !scanning && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 space-y-8"
            >
              <div className="rounded-[2.5rem] border border-bg-tertiary bg-bg-primary p-10 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10">
                   <div className="flex items-center justify-center h-24 w-24 rounded-full border-8 border-bg-tertiary relative">
                      <div className="text-3xl font-black text-text-primary">{result.score}</div>
                      <svg className="absolute inset-0 h-full w-full -rotate-90">
                        <circle 
                          cx="48" cy="48" r="40" 
                          fill="transparent" 
                          stroke="currentColor" 
                          strokeWidth="8"
                          className="text-accent/10"
                        />
                        <circle 
                          cx="48" cy="48" r="40" 
                          fill="transparent" 
                          stroke="currentColor" 
                          strokeWidth="8"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                          className="text-accent transition-all duration-1000"
                        />
                      </svg>
                   </div>
                   <div className="mt-2 text-center text-xs font-bold uppercase tracking-widest text-text-muted">Overall Score</div>
                </div>

                <div className="relative z-10">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    result.status === "Pass" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}>
                    {result.status}
                  </span>
                  <h2 className="mt-4 text-3xl font-bold text-text-primary">Scan Results for:</h2>
                  <p className="text-lg text-accent font-mono mt-1">{result.url}</p>
                </div>

                <div className="grid gap-4 mt-12">
                  {result.findings.map((item: any, idx: number) => (
                    <motion.div 
                      key={item.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-6 p-5 rounded-2xl bg-bg-secondary border border-bg-tertiary"
                    >
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        item.status === "Pass" ? "bg-success/10 text-success" : item.status === "Warning" ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                      }`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-text-primary">{item.type}</h3>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            item.status === "Pass" ? "text-success" : item.status === "Warning" ? "text-warning" : "text-danger"
                          }`}>{item.status}</span>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{item.msg}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 p-8 rounded-3xl bg-accent text-bg-primary">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-black italic">Get the full report</h3>
                      <p className="font-medium">Unlock deep analysis and step-by-step fix guides with a free trial.</p>
                    </div>
                    <Button className="rounded-full px-8 py-6 h-auto text-lg bg-bg-primary text-text-primary hover:bg-bg-primary/90">
                      Start Pro+ Trial <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-24 grid gap-12 md:grid-cols-2">
        <div className="rounded-3xl bg-bg-secondary p-10 border border-bg-tertiary">
          <h3 className="text-2xl font-bold text-text-primary mb-4">What we check</h3>
          <ul className="space-y-4">
             <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent mt-1" />
                <p className="text-text-secondary"><strong>Policy Presence:</strong> We detect Privacy, Terms, and Cookie policies.</p>
             </li>
             <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent mt-1" />
                <p className="text-text-secondary"><strong>Cookie Compliance:</strong> Analysis of third-party tracking scripts.</p>
             </li>
             <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent mt-1" />
                <p className="text-text-secondary"><strong>WCAG Standards:</strong> Basic check for accessibility violations.</p>
             </li>
          </ul>
        </div>
        <div className="rounded-3xl bg-bg-secondary p-10 border border-bg-tertiary">
          <h3 className="text-2xl font-bold text-text-primary mb-4">Why it matters</h3>
          <p className="text-text-secondary leading-relaxed">
            Non-compliance can lead to massive fines under GDPR (up to 4% of global turnover) and CCPA. Regular automated checks help you stay ahead of regulation changes and protect your business reputation.
          </p>
          <div className="mt-8 flex items-center gap-4 p-4 rounded-xl bg-bg-primary border border-bg-tertiary">
             <Info className="h-6 w-6 text-info" />
             <p className="text-xs text-text-muted">This free scan provides a surface-level overview. Deep scans require authentication.</p>
          </div>
        </div>
      </div>
    </PageScaffold>
  );
}
