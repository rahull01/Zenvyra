'use client';

import React from 'react';
import { motion } from 'framer-motion';

const StatsBar = () => {
  const stats = [
    { number: '10,000+', label: 'Businesses Protected' },
    { number: '50M+', label: 'Consent Banners Served' },
    { number: '150+', label: 'Countries Covered' },
    { number: '99.9%', label: 'Uptime Guaranteed' },
  ];

  return (
    <section className="bg-background-secondary py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-body font-medium text-text-secondary mb-8"
        >
          Trusted by 10,000+ businesses worldwide
        </motion.p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-[48px] font-extrabold text-primary leading-tight mb-2">
                {stat.number}
              </div>
              <div className="text-body-sm text-text-tertiary">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
