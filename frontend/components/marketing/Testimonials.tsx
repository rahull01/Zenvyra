'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "ComplianceAI Pro has made compliance effortless for our startup. The automated policy updates save us countless hours.",
      author: "Sarah Johnson",
      title: "CTO",
      company: "TechStart Inc.",
    },
    {
      quote: "The cookie consent management is seamless. Our users love the transparent approach to data privacy.",
      author: "Michael Chen",
      title: "Founder",
      company: "EcoShop",
    },
    {
      quote: "Best compliance platform we've used. The dashboard is intuitive and the support team is incredibly responsive.",
      author: "Emily Rodriguez",
      title: "Operations Manager",
      company: "Digital Agency Pro",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-h2 font-extrabold text-text-primary mb-4">
            Loved by Compliance Teams Worldwide
          </h2>
        </motion.div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-8 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-350 h-full">
                <CardContent className="p-0">
                  <Quote className="w-8 h-8 text-primary opacity-30 mb-4" />
                  <p className="text-body-lg text-text-secondary italic mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary text-base">
                        {testimonial.author}
                      </div>
                      <div className="text-body-sm text-text-tertiary">
                        {testimonial.title}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
