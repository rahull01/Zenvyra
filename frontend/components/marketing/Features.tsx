'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Cookie, Search, Clock, Globe, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: FileText,
    title: 'Policy generation in minutes',
    description: 'AI drafts custom policies that match your business and keep you audit-ready.',
  },
  {
    icon: Cookie,
    title: 'Consent & cookie automation',
    description: 'Deploy banner flows, scan trackers, and keep consent records automatically.',
  },
  {
    icon: Search,
    title: 'Website risk discovery',
    description: 'Find hidden cookies, trackers, and compliance drift without manual reviews.',
  },
  {
    icon: Clock,
    title: 'Live monitoring',
    description: 'Continuous scanning and alerts mean compliance moves with your site.',
  },
  {
    icon: Globe,
    title: 'Global regulation coverage',
    description: 'GDPR, CCPA, LGPD, PIPEDA, and local privacy rules in one dashboard.',
  },
  {
    icon: Users,
    title: 'Team-ready controls',
    description: 'Give legal, product, and growth teams the visibility they need.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Features = () => {
  return (
    <section className="py-24 bg-[radial-gradient(circle_at_top_left,_rgba(255,135,55,0.08),_transparent_52%),_radial-gradient(circle_at_bottom_right,_rgba(8,63,102,0.08),_transparent_45%)]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-eyebrow font-bold text-primary uppercase tracking-[0.15em]">
            FEATURE-RICH AUTOMATION
          </span>
          <h2 className="text-h2 font-extrabold text-text-primary mt-4 mb-4">
            Compliance workflows built for product, legal, and ops teams
          </h2>
          <p className="text-body-lg text-text-secondary">
            From live cookie scans to AI policy drafts and audit-ready consent records, everything is designed to reduce review time and keep your launch schedule moving.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-8 shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 h-full border border-border-light bg-white/90">
                <CardContent className="p-0">
                  <div className="w-14 h-14 bg-primary-light rounded-3xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-h4 font-semibold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-body text-text-secondary leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <a href="#" className="text-body-sm font-semibold text-primary hover:text-primary-hover">
                    Learn more →
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
