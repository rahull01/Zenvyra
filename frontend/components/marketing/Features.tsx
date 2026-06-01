'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Cookie, Search, Clock, Globe, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: 'AI Policy Generator',
      description: 'Generate compliant policies in minutes with AI assistance',
    },
    {
      icon: Cookie,
      title: 'Cookie Consent Manager',
      description: 'Beautiful, customizable cookie banners for global compliance',
    },
    {
      icon: Search,
      title: 'Website Scanner',
      description: 'Automatically detect and categorize all cookies on your site',
    },
    {
      icon: Clock,
      title: 'Real-Time Monitoring',
      description: '24/7 compliance monitoring with instant alerts',
    },
    {
      icon: Globe,
      title: 'Multi-Region Support',
      description: 'One platform for GDPR, CCPA, PIPEDA, and more',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Manage compliance across your entire organization',
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

  return (
    <section className="py-32 bg-background-primary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-eyebrow font-bold text-primary uppercase tracking-[0.15em]">
            POWERFUL FEATURES
          </span>
          <h2 className="text-h2 font-extrabold text-text-primary mt-4 mb-4">
            Everything You Need to Stay Compliant
          </h2>
          <p className="text-body-lg text-text-secondary">
            From policy generation to real-time monitoring, we've got you covered.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-8 hover:shadow-card-hover hover:-translate-y-1 hover:border-border-medium transition-all duration-350 h-full">
                <CardContent className="p-0">
                  <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mb-5">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-h4 font-semibold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-body text-text-secondary leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <a href="#" className="text-body-sm text-primary font-medium hover:underline">
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
