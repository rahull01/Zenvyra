'use client';

import React from 'react';
import { Globe, ShieldCheck, AlertTriangle, MoreVertical, RefreshCw, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const websites = [
  { id: 1, url: 'acme-corp.com', status: 'Healthy', score: 98, policies: 4, lastScan: '2 hours ago' },
  { id: 2, url: 'shop.acme-corp.com', status: 'Warning', score: 72, policies: 3, lastScan: '5 hours ago' },
  { id: 3, url: 'blog.acme-corp.com', status: 'Healthy', score: 91, policies: 2, lastScan: '1 day ago' },
  { id: 4, url: 'docs.acme-corp.com', status: 'Healthy', score: 95, policies: 2, lastScan: '3 days ago' },
];

export const WebsiteList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {websites.map((site) => (
        <div 
          key={site.id} 
          className="bg-white rounded-2xl border border-border-light p-6 shadow-sm hover:shadow-md hover:border-border-medium transition-all group"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                site.status === 'Healthy' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              )}>
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">{site.url}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                    site.status === 'Healthy' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                  )}>
                    {site.status}
                  </span>
                  <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">
                    {site.lastScan}
                  </span>
                </div>
              </div>
            </div>
            <button className="p-2 text-text-tertiary hover:bg-slate-50 rounded-lg">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Compliance Score</p>
              <p className={cn(
                "text-xl font-bold",
                site.score > 90 ? "text-emerald-600" : "text-amber-600"
              )}>{site.score}%</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Active Policies</p>
              <p className="text-xl font-bold text-text-primary">{site.policies}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-2 text-xs font-bold text-primary bg-primary-light/50 hover:bg-primary-light rounded-lg transition-colors flex items-center justify-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Scan Now
            </button>
            <button className="flex-1 py-2 text-xs font-bold text-text-secondary bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2">
              <BarChart2 className="w-3.5 h-3.5" />
              View Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};