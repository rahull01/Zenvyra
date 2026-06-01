'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, ShieldCheck } from 'lucide-react';

const TrustBadges = () => {
  const steps = [
    {
      icon: Search,
      number: '1',
      title: 'Scan Your Website',
      description: 'Enter your URL and our AI scans for compliance gaps',
    },
    {
      icon: FileText,
      number: '2',
      title: 'Generate Policies',
      description: 'AI creates customized policies based on your business',
    },
    {
      icon: ShieldCheck,
      number: '3',
      title: 'Stay Protected',
      description: 'Real-time monitoring keeps you compliant as laws change',
    },
  ];

  return (
    <section className="py-32 bg-background-secondary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-h2 font-extrabold text-text-primary mb-4">
            Get Compliant in 3 Simple Steps
          </h2>
          <p className="text-body-lg text-text-secondary">
            No legal expertise required. Our AI handles the complexity.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-background-primary rounded-2xl p-8 border border-border-light shadow-card hover:shadow-card-hover transition-all duration-350">
                {/* Step Number */}
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-h4 font-semibold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-body text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border-light border-t-2 border-dashed" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
