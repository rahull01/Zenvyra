'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Building2, Globe, Database, Share2, Eye, CheckCircle2, ArrowLeft, ArrowRight, Save, Search, Link as LinkIcon, Code, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Business Info', icon: Building2 },
  { id: 2, title: 'Data Collection', icon: Database },
  { id: 3, title: 'Third Parties', icon: Share2 },
  { id: 4, title: 'Review & Edit', icon: Eye },
  { id: 5, title: 'Publish', icon: CheckCircle2 },
];

export const PolicyWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-8">
      {/* Header & Progress */}
      <div className="bg-background-primary rounded-2xl p-8 border border-border-light shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-h2 font-bold text-text-primary">Privacy Policy Generator</h1>
            <p className="text-body-sm text-text-secondary mt-1">Answer a few questions to generate your custom policy.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="default">
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-background-tertiary -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          <div className="relative z-10 flex justify-between">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-4 border-background-primary transition-all duration-300 shadow-sm",
                    isCompleted ? "bg-status-success text-white" : 
                    isActive ? "bg-primary text-white scale-110 shadow-md" : "bg-background-primary text-text-tertiary border-border-light"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className={cn(
                    "text-caption font-bold uppercase tracking-[0.05em] mt-3",
                    isActive ? "text-primary" : "text-text-tertiary"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wizard Content */}
      <div className="bg-background-primary rounded-2xl border border-border-light shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-8 flex-1">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 max-w-2xl"
              >
                <div className="space-y-4">
                  <h3 className="text-h3 font-bold text-text-primary">Tell us about your business</h3>
                  <p className="text-body-sm text-text-secondary">We use this to customize the legal language in your policy.</p>
                </div>
                
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-body-sm font-semibold text-text-primary">Company Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Acme Corp"
                      className="w-full bg-background-primary border border-border-light rounded-xl py-3 px-4 text-body-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-body-sm font-semibold text-text-primary">Website URL</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                      <input 
                        type="url" 
                        placeholder="https://example.com"
                        className="w-full bg-background-primary border border-border-light rounded-xl py-3 pl-11 pr-4 text-body-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-body-sm font-semibold text-text-primary">Primary Region</label>
                    <select className="w-full bg-background-primary border border-border-light rounded-xl py-3 px-4 text-body-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none">
                      <option>United States</option>
                      <option>European Union (GDPR)</option>
                      <option>Canada (PIPEDA)</option>
                      <option>Brazil (LGPD)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-h3 font-bold text-text-primary">What data do you collect?</h3>
                  <p className="text-body-sm text-text-secondary">Select all categories of personal information your business handles.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'ident', label: 'Identifiers', desc: 'Names, email, IP addresses' },
                    { id: 'fin', label: 'Financial Info', desc: 'Credit card numbers, bank details' },
                    { id: 'geo', label: 'Geolocation', desc: 'GPS coordinates, physical address' },
                    { id: 'usage', label: 'Usage Data', desc: 'Browsing history, interactions' },
                    { id: 'social', label: 'Social Media', desc: 'Profile info from linked accounts' },
                    { id: 'health', label: 'Health Data', desc: 'Medical records or wellness info' },
                  ].map((item) => (
                    <label key={item.id} className="group cursor-pointer flex items-start gap-4 p-4 rounded-xl border border-border-light hover:border-primary/30 hover:bg-background-secondary transition-all">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded text-primary border-border-light focus:ring-primary" />
                      <div className="flex flex-col">
                        <span className="text-body-sm font-bold text-text-primary">{item.label}</span>
                        <span className="text-caption text-text-tertiary mt-1">{item.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-h3 font-bold text-text-primary">Third-party services</h3>
                  <p className="text-body-sm text-text-secondary">Select the services you use to help us generate the right disclosures.</p>
                </div>

                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input 
                    type="text" 
                    placeholder="Search services (e.g. Stripe, Google Analytics...)"
                    className="w-full bg-background-secondary border border-border-light rounded-xl py-3 pl-11 pr-4 text-body-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'ga', name: 'Google Analytics', cat: 'Analytics' },
                    { id: 'stripe', name: 'Stripe', cat: 'Payments' },
                    { id: 'fb', name: 'Facebook Pixel', cat: 'Advertising' },
                    { id: 'intercom', name: 'Intercom', cat: 'Support' },
                    { id: 'mailchimp', name: 'Mailchimp', cat: 'Marketing' },
                    { id: 'aws', name: 'AWS', cat: 'Infrastructure' },
                  ].map((service) => (
                    <label key={service.id} className="group cursor-pointer flex items-center gap-3 p-4 rounded-xl border border-border-light hover:border-primary/30 hover:bg-background-secondary transition-all">
                      <input type="checkbox" className="w-4 h-4 rounded text-primary border-border-light focus:ring-primary" />
                      <div className="flex flex-col">
                        <span className="text-body-sm font-bold text-text-primary">{service.name}</span>
                        <span className="text-caption text-text-tertiary uppercase font-bold tracking-[0.05em]">{service.cat}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-h3 font-bold text-text-primary">Review your policy</h3>
                  <p className="text-body-sm text-text-secondary">Preview the generated text below. You can make minor edits directly.</p>
                </div>

                <div className="border border-border-light rounded-2xl bg-background-secondary p-8 max-h-[400px] overflow-y-auto font-serif text-body-sm leading-relaxed text-text-primary space-y-6">
                  <div className="text-center mb-8">
                    <h1 className="text-h2 font-bold uppercase tracking-tight">Privacy Policy</h1>
                    <p className="text-caption text-text-tertiary mt-2 italic">Last Updated: {new Date().toLocaleDateString()}</p>
                  </div>
                  
                  <section className="space-y-2">
                    <h2 className="font-bold text-body">1. Introduction</h2>
                    <p>Welcome to our Privacy Policy. This document explains how we collect, use, and protect your information when you visit our website or use our services. We take your privacy seriously and are committed to protecting your personal data in accordance with global regulations including GDPR and CCPA.</p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-bold text-body">2. Information We Collect</h2>
                    <p>We collect various types of information, including identifiers (name, email address), financial information (billing details), and usage data (IP address, browser type). This information is necessary to provide our services and maintain a secure environment.</p>
                  </section>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 py-4"
              >
                <div className="text-center space-y-2">
                   <div className="w-16 h-16 bg-status-success/10 text-status-success rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                   </div>
                   <h3 className="text-h2 font-bold text-text-primary">Your policy is ready!</h3>
                   <p className="text-body-sm text-text-secondary">Choose how you want to publish or use your new Privacy Policy.</p>
                </div>

                <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 text-warning text-sm">
                  <strong>Not legal advice.</strong> This policy was generated by AI as a starting point. Regulations vary by jurisdiction and change over time. Have a qualified lawyer review it before you publish.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl border border-border-light hover:shadow-card-hover transition-all space-y-4">
                    <div className="w-10 h-10 bg-primary-light text-primary rounded-lg flex items-center justify-center">
                      <Code className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-text-primary">Embed Code</h4>
                    <p className="text-caption text-text-secondary">Copy a simple HTML snippet to add this policy to any page.</p>
                    <Button variant="outline" size="default" className="w-full text-caption">Copy Snippet</Button>
                  </div>

                  <div className="p-6 rounded-2xl border border-border-light hover:shadow-card-hover transition-all space-y-4">
                    <div className="w-10 h-10 bg-secondary-purple-light text-secondary-purple rounded-lg flex items-center justify-center">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-text-primary">Direct Link</h4>
                    <p className="text-caption text-text-secondary">Host your policy on our secure servers and use a short URL.</p>
                    <Button variant="outline" size="default" className="w-full text-caption">Copy Link</Button>
                  </div>

                  <div className="p-6 rounded-2xl border border-border-light hover:shadow-card-hover transition-all space-y-4">
                    <div className="w-10 h-10 bg-background-tertiary text-text-primary rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-text-primary">Download File</h4>
                    <p className="text-caption text-text-secondary">Export your policy as a PDF, Word, or HTML document.</p>
                    <Button variant="outline" size="default" className="w-full text-caption">Export PDF</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-background-secondary/50 border-t border-border-light flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            className={cn("transition-opacity", currentStep === 1 && "opacity-0 pointer-events-none")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex gap-3">
            {currentStep === steps.length ? (
              <Button variant="default">
                Download Policy
                <Save className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button variant="default" onClick={nextStep}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Context/Help Section */}
      <div className="bg-primary-light/30 border border-primary/10 rounded-2xl p-6 flex gap-4 items-start">
        <div className="bg-background-primary p-2 rounded-lg shadow-sm">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-body-sm font-bold text-text-primary">Why do we ask this?</h4>
          <p className="text-caption text-text-secondary mt-1 leading-relaxed">
            Under regulations like GDPR (Article 13) and CCPA, you are legally required to disclose the exact categories of data you collect. Being specific reduces your legal liability.
          </p>
        </div>
      </div>
    </div>
  );
};