'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-4xl bg-gradient-to-b from-background-primary to-background-secondary">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-primary mb-md block">
          All-In-One Compliance Solution
        </span>
        
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary leading-[1.1] tracking-tight mb-lg">
          Stay Compliant. <br />
          <span className="text-primary">Stay Protected.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-xl leading-relaxed">
          Generate legal policies, manage cookie consent, and stay up-to-date with global privacy laws — all in one platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-md justify-center mb-3xl">
          <Button size="lg">Get Started Free</Button>
          <Button variant="secondary" size="lg">View Pricing</Button>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-xl opacity-60 grayscale hover:grayscale-0 transition-all">
          <span className="text-sm font-medium text-text-secondary">Trusted by 2M+ businesses</span>
          <div className="h-6 w-px bg-border-light hidden sm:block" />
          <span className="text-sm font-bold text-text-primary">GDPR Compliant</span>
          <span className="text-sm font-bold text-text-primary">CCPA Ready</span>
        </div>
      </motion.div>

      {/* Floating Mockup Illustration Wrapper */}
      <motion.div 
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mt-4xl w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden border border-border-light"
      >
        <div className="bg-white p-4 flex items-center gap-2 border-bottom border-border-light">
           <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-status-error/20" />
              <div className="w-3 h-3 rounded-full bg-status-warning/20" />
              <div className="w-3 h-3 rounded-full bg-status-success/20" />
           </div>
        </div>
        <div className="aspect-video bg-slate-50 flex items-center justify-center text-text-tertiary">
          Dashboard Mockup Preview
        </div>
      </motion.div>
    </section>
  );
};