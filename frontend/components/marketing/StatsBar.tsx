'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe2, Clock3, Users } from 'lucide-react';

const stats = [
  { icon: ShieldCheck, value: '10,000+', label: 'Businesses protected' },
  { icon: Globe2, value: '150+', label: 'Countries covered' },
  { icon: Clock3, value: '99.9%', label: 'Platform uptime' },
  { icon: Users, value: '4.8/5', label: 'Customer satisfaction' },
];

const StatsBar = () => {
  return (
    <section className="bg-background-secondary py-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="mb-12 text-center">
          <p className="text-eyebrow font-semibold uppercase tracking-[0.25em] text-primary">
            Built for high-growth teams
          </p>
          <h2 className="mt-4 text-h2 font-extrabold text-text-primary">
            Trusted by modern companies for product-grade compliance
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-[32px] border border-border-light bg-white/80 p-8 shadow-sm backdrop-blur-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-4xl font-extrabold text-text-primary">{stat.value}</p>
                <p className="mt-3 text-body-sm text-text-secondary">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
