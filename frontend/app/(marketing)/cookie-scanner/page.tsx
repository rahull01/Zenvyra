"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Shield, PieChart, Table as TableIcon, Loader2, ArrowRight, Check, AlertTriangle, Info, Database } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CookieScannerPage() {
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
        total: 18,
        categories: [
          { name: "Essential", count: 4, status: "Secure" },
          { name: "Analytics", count: 6, status: "Action Required" },
          { name: "Marketing", count: 5, status: "Action Required" },
          { name: "Functional", count: 3, status: "Secure" },
        ],
        cookies: [
          { name: "_ga", domain: "google.com", category: "Analytics", duration: "2 years", description: "Used to distinguish users." },
          { name: "_fbp", domain: "facebook.com", category: "Marketing", duration: "3 months", description: "Used by Facebook to deliver advertisements." },
          { name: "session_id", domain: "yourdomain.com", category: "Essential", duration: "Session", description: "Maintains user login session." },
        ]
      });
    }, 4000);
  };

  return (
    <PageScaffold
      title="Free Cookie Scanner"
      subtitle="Discover every cookie and tracker your website drops on visitors. Stay compliant with GDPR & CCPA cookie laws."
    >
      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4 p-2 bg-bg-secondary border border-bg-tertiary rounded-[2rem] shadow-2xl">
          <div className="flex-1 relative">
            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-text-muted" />
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
            className="h-16 px-10 rounded-2xl bg-accent text-bg-primary text-lg font-bold hover:bg-accent-light"
            disabled={scanning || !url}
          >
            {scanning ? <Loader2 className="h-6 w-6 animate-spin" /> : "Scan Cookies"}
          </Button>
        </form>

        <AnimatePresence>
          {scanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-16 text-center"
            >
              <div className="flex justify-center gap-2 mb-8">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="h-4 w-4 rounded-full bg-accent"
                  />
                ))}
              </div>
              <p className="text-xl font-bold text-text-primary">Crawling website for trackers...</p>
              <p className="mt-2 text-text-secondary">Testing 128 regulatory checkpoints</p>
            </motion.div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16"
            >
              <div className="grid gap-6 md:grid-cols-4 mb-8">
                {result.categories.map((cat: any) => (
                  <div key={cat.name} className="p-6 rounded-3xl bg-bg-primary border border-bg-tertiary text-center">
                    <div className="text-2xl font-black text-text-primary mb-1">{cat.count}</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-text-muted">{cat.name}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-[2.5rem] border border-bg-tertiary bg-bg-primary overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-bg-tertiary flex items-center justify-between bg-bg-secondary/50">
                  <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
                    <Database className="text-accent h-6 w-6" /> Detected Cookies ({result.total})
                  </h3>
                  <Button variant="outline" className="rounded-xl border-bg-tertiary text-text-secondary">
                    Export Results
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-bg-secondary/30 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                        <th className="px-8 py-4">Name</th>
                        <th className="px-8 py-4">Domain</th>
                        <th className="px-8 py-4">Category</th>
                        <th className="px-8 py-4">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-bg-tertiary">
                      {result.cookies.map((cookie: any) => (
                        <tr key={cookie.name} className="hover:bg-bg-secondary/20 transition-colors">
                          <td className="px-8 py-6 text-sm font-bold text-text-primary font-mono">{cookie.name}</td>
                          <td className="px-8 py-6 text-sm text-text-secondary">{cookie.domain}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              cookie.category === "Essential" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                            }`}>
                              {cookie.category}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-sm text-text-secondary">{cookie.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-12 rounded-3xl bg-gradient-to-r from-bg-secondary to-bg-primary border border-accent/20 p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="max-w-xl text-center lg:text-left">
                   <h3 className="text-3xl font-bold text-text-primary">Need an automated banner?</h3>
                   <p className="mt-4 text-text-secondary text-lg leading-relaxed">
                     ComplianceAI Pro can automatically block these trackers until user consent is given, ensuring you meet GDPR and CCPA requirements instantly.
                   </p>
                </div>
                <Button className="rounded-full px-10 py-7 h-auto text-xl bg-accent text-bg-primary hover:bg-accent-light shadow-glow-accent">
                  Build Your Banner <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-24 grid gap-8 md:grid-cols-3">
        {[
          { title: "AI-Powered Classification", desc: "Our neural network identifies 500,000+ trackers automatically.", icon: PieChart },
          { title: "Geo-Targeted Scanning", desc: "Simulate scans from 50+ countries to detect regional variances.", icon: Globe },
          { title: "Continuous Monitoring", desc: "Scheduled weekly scans detect new trackers the moment they land.", icon: Shield },
        ].map((feature, i) => (
          <div key={i} className="p-8 rounded-[2rem] border border-bg-tertiary bg-bg-secondary hover:border-accent/30 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
               <feature.icon className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-bold text-text-primary mb-2">{feature.title}</h4>
            <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </PageScaffold>
  );
}
