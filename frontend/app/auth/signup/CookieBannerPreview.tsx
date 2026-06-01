'use client';

import React from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreviewProps {
  config: {
    theme: string;
    layout: string;
    primaryColor: string;
  };
}

export const CookieBannerPreview = ({ config }: PreviewProps) => {
  return (
    <div className="space-y-4">
      <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest ml-1">Live Interface Preview</p>
      <div className="relative h-[240px] bg-slate-100 rounded-2xl border-2 border-dashed border-border-medium flex flex-col items-center justify-center overflow-hidden">
        <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Website Preview Area</div>
        
        {/* The Banner Itself */}
        <div className={cn(
          "absolute transition-all duration-500 shadow-2xl border border-border-light",
          config.layout === 'banner' && "bottom-4 left-4 right-4 bg-white rounded-xl p-6",
          config.layout === 'box' && "bottom-4 right-4 w-72 bg-white rounded-2xl p-6",
          config.layout === 'bar' && "bottom-0 left-0 right-0 bg-white p-4 border-t"
        )}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-text-primary">Your privacy choice</h4>
              <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                We use cookies to enhance your experience and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
              </p>
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 bg-primary text-white text-[10px] font-bold rounded-lg hover:brightness-110 transition-all">Accept All</button>
                <button className="px-4 py-2 bg-white border border-border-light text-text-primary text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-all">Preferences</button>
              </div>
            </div>
            <button className="text-text-tertiary hover:text-text-primary"><X className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-center text-text-tertiary italic">Changes to design update instantly in this preview window.</p>
    </div>
  );
};