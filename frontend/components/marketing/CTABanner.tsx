'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const CTABanner = () => {
  return (
    <section className="py-24 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[1400px] mx-auto rounded-2xl bg-cta-gradient p-12 md:p-20 text-center text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 space-y-8"
        >
          <h2 className="text-h2 font-extrabold tracking-tight">
            Ready to Get Compliant?
          </h2>
          <p className="text-body-lg text-white/85 max-w-xl mx-auto">
            Join 10,000+ businesses using ComplianceAI Pro
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Button variant="default" size="lg" className="bg-white text-primary hover:bg-background-secondary border-none shadow-xl px-8 py-4">
              Start Free Scan
            </Button>
          </motion.div>
          <p className="text-caption font-bold uppercase tracking-[0.05em] text-white/70">
            No credit card required · Setup in 2 minutes
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};