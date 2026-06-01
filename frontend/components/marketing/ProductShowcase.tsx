'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const ProductShowcase = () => {
  const features = [
    'Real-time compliance score tracking',
    'AI-powered policy recommendations',
    'One-click policy updates',
    'Team activity monitoring',
  ];

  return (
    <section className="py-32 bg-background-primary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="bg-secondary-dark rounded-2xl border border-white/10 shadow-modal p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-32 bg-white/5 rounded-lg border border-white/10" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-white/5 rounded-lg border border-white/10" />
                  <div className="h-20 bg-white/5 rounded-lg border border-white/10" />
                  <div className="h-20 bg-white/5 rounded-lg border border-white/10" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 order-1 lg:order-2"
          >
            <h2 className="text-h2 font-extrabold text-text-primary">
              Powerful Dashboard at Your Fingertips
            </h2>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <motion.li 
                  key={index} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-body text-text-secondary">{feature}</span>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button variant="default" size="lg">
                Explore Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
