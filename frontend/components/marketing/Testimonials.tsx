'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote:
      'The scan-to-proof workflow gave our account team one clean place to show clients what was fixed, what was pending, and what evidence we had.',
    author: 'Aisha Mehta',
    role: 'Operations Director',
    company: 'Northstar Growth Studio',
    photo:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  },
  {
    quote:
      'Before launch we could see policy gaps, cookie categories, consent setup, and our request workflow in one view instead of chasing notes across tools.',
    author: 'Daniel Brooks',
    role: 'Founder',
    company: 'LedgerPilot',
    photo:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  },
  {
    quote:
      'The public certificate is helpful on sales calls because it shows monitoring history and clear disclaimers instead of vague privacy promises.',
    author: 'Maya Collins',
    role: 'Revenue Lead',
    company: 'BrightCart Supply',
    photo:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80',
  },
  {
    quote:
      'The GTM and WordPress notes were specific enough that our developer knew exactly what to change without reverse engineering the checklist.',
    author: 'Marcus Reed',
    role: 'Marketing Manager',
    company: 'StudioNest Media',
    photo:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  },
  {
    quote:
      'Our legal review was calmer because every issue had a source, status, owner, and evidence record. We were not debating screenshots anymore.',
    author: 'Priya Nair',
    role: 'Product Lead',
    company: 'VendorLoop',
    photo:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
  },
  {
    quote:
      'Zenvyra feels built for teams that need to ship trust signals, not just download another template and hope nobody asks follow-up questions.',
    author: 'Oliver Grant',
    role: 'Managing Partner',
    company: 'Cedar & Co. Advisory',
    photo:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80',
  },
];

const awards = ['Policy evidence', 'Cookie scanner', 'Consent logs', 'Public proof', 'Agency handoff'];

const Testimonials = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-eyebrow font-semibold uppercase tracking-[0.25em] text-primary">
              Customer proof
            </p>
            <h2 className="mt-3 text-h2 font-extrabold text-text-primary">
              What teams notice after the first scan
            </h2>
            <p className="mt-4 text-body-lg text-text-secondary">
              The page should make users feel the product is real, practical, and review-ready
              before they even sign up.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-1 text-primary">
              {[0, 1, 2, 3, 4].map((item) => (
                <Star key={item} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              Representative feedback from practical compliance workflows
            </p>
          </div>
        </div>

        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {awards.map((award) => (
            <div
              key={award}
              className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-center text-sm font-bold text-slate-800"
            >
              {award}
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.quote}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="rounded-lg border border-slate-200 bg-white p-7 shadow-[0_18px_46px_rgba(15,23,42,0.06)]"
            >
              <Quote className="mb-4 h-7 w-7 text-primary/35" />
              <p className="text-body leading-relaxed text-slate-700">"{testimonial.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={testimonial.photo}
                  alt={`${testimonial.author}, ${testimonial.role} at ${testimonial.company}`}
                  className="h-12 w-12 rounded-full border border-slate-200 object-cover shadow-sm"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-semibold text-slate-950">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
