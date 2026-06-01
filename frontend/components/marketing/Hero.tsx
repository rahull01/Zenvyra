'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle2, Globe, ArrowRight, Check, Lock, FileText, Cookie, BarChart3 } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-[72px] min-h-screen bg-hero-gradient overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Hero Image/Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative lg:h-[500px] flex items-center justify-center order-2 lg:order-1"
          >
            {/* Dashboard Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-[500px] animate-float"
            >
              <div className="bg-secondary-dark rounded-2xl border border-white/10 shadow-modal p-6">
                {/* Mockup Header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                
                {/* Mockup Content */}
                <div className="space-y-4">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                  <div className="h-32 bg-white/5 rounded-lg border border-white/10" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-white/5 rounded-lg border border-white/10" />
                    <div className="h-20 bg-white/5 rounded-lg border border-white/10" />
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -top-4 -right-4 bg-background-primary rounded-xl border border-border-light shadow-card p-4 animate-float" 
                style={{ animationDelay: '0.5s' }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-status-success" />
                  <span className="text-body-sm font-medium text-text-primary">0 critical issues</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-background-primary rounded-xl border border-border-light shadow-card p-4 animate-float" 
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-body-sm font-medium text-text-primary">AI Auto-Fix applied</span>
                </div>
              </motion.div>

              {/* Live monitoring pill */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-primary/90 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-caption font-semibold">Live monitoring active</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 order-1 lg:order-2"
          >
            {/* Eyebrow */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary-light px-4 py-2 rounded-full"
            >
              <span className="text-eyebrow font-semibold text-primary uppercase tracking-[0.15em]">
                AI-POWERED COMPLIANCE AUTOMATION
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-hero font-extrabold text-text-primary leading-[1.1]"
            >
              All-in-One Data Privacy Compliance Solution for Websites & Apps
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-body-lg text-text-secondary max-w-[520px] leading-relaxed"
            >
              ComplianceAI Pro is your all-in-one compliance solution for data privacy laws worldwide. Generate policies, scan websites, and manage consent all in one place.
            </motion.p>

            {/* Feature List */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="space-y-3"
            >
              {[
                { icon: FileText, text: 'Auto-generate legal policies in minutes' },
                { icon: Cookie, text: 'Cookie consent management & scanning' },
                { icon: Lock, text: 'GDPR, CCPA, & global compliance' },
                { icon: BarChart3, text: 'Real-time compliance monitoring' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-body text-text-secondary">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* URL Input + CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                placeholder="https://yourwebsite.com"
                className="flex-1 h-[52px] rounded-lg border border-border-light px-4 text-base text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
              />
              <Link href="/auth/signup">
                <Button variant="default" className="h-[52px] px-7 hover:bg-primary-hover transition-colors">
                  Start Free Scan
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Trust Text */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-2 text-body-sm text-text-tertiary"
            >
              <span>No credit card required</span>
              <span className="w-1 h-1 rounded-full bg-border-medium" />
              <span>Instant scan</span>
              <span className="w-1 h-1 rounded-full bg-border-medium" />
              <span>Free setup</span>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pt-6 border-t border-border-light"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-border-medium border-2 border-background-primary" />
                  ))}
                </div>
                <div>
                  <p className="text-body-sm font-semibold text-text-primary">Trusted by 10,000+ businesses</p>
                  <p className="text-caption text-text-tertiary">Join companies staying compliant</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
