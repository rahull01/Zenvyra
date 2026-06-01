'use client';

import React from 'react';
import { CreditCard, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BillingSettings = () => {
  return (
    <div className="p-8 space-y-8">
      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Current Plan</span>
            <h3 className="text-3xl font-bold">Pro+ Annual</h3>
            <p className="text-white/80 text-sm mt-2">Your next billing date is <span className="font-bold text-white underline decoration-white/30 underline-offset-4">March 12, 2025</span>.</p>
          </div>
          <Button className="bg-white text-primary hover:bg-slate-50 border-none shadow-lg">
            Upgrade Plan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Payment Method */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment Method
          </h4>
          <div className="border border-border-light rounded-2xl p-6 flex items-center justify-between bg-white shadow-sm hover:border-primary/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-center font-bold text-[10px] text-text-tertiary">VISA</div>
              <div>
                <p className="text-sm font-bold text-text-primary">Visa ending in 4242</p>
                <p className="text-xs text-text-secondary">Expires 12/26</p>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:underline transition-all">Edit</button>
          </div>
        </div>

        {/* Invoice History */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
            <Download className="w-4 h-4" />
            Invoice History
          </h4>
          <div className="border border-border-light rounded-2xl divide-y divide-border-light bg-white shadow-sm">
            {[
              { date: 'Feb 12, 2024', amount: '$144.00' },
              { date: 'Feb 12, 2023', amount: '$144.00' },
            ].map((invoice, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{invoice.date}</p>
                  <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">{invoice.amount}</p>
                </div>
                <button className="p-2 text-text-tertiary hover:text-primary transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};