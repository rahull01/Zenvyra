'use client';

import React from 'react';
import { FileText, Cookie, ShieldCheck, UserPlus, Clock } from 'lucide-react';

const activities = [
  { id: 1, type: 'policy', text: 'Privacy Policy updated', time: '2 hours ago', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 2, type: 'consent', text: 'New cookie consent given', time: '3 hours ago', icon: Cookie, color: 'text-status-warning', bg: 'bg-status-warning/10' },
  { id: 3, type: 'scan', text: 'Cookie scan completed', time: '5 hours ago', icon: ShieldCheck, color: 'text-status-success', bg: 'bg-status-success/10' },
  { id: 4, type: 'team', text: 'New team member invited', time: '1 day ago', icon: UserPlus, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 5, type: 'policy', text: 'Terms & Conditions created', time: '2 days ago', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
];

export const RecentActivityFeed = () => {
  return (
    <div className="bg-background-primary rounded-2xl border border-border-light shadow-card h-full flex flex-col">
      <div className="p-6 border-b border-border-light">
        <h3 className="text-lg font-bold text-text-primary">Recent Activity</h3>
      </div>
      <div className="p-6 flex-1">
        <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-border-light">
          {activities.map((item) => (
            <div key={item.id} className="relative flex gap-4 items-start">
              <div className={`relative z-10 w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center border-4 border-background-primary shadow-sm flex-shrink-0`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="flex flex-col pt-1">
                <p className="text-sm font-semibold text-text-primary leading-tight">
                  {item.text}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-3 h-3 text-text-tertiary" />
                  <span className="text-caption font-medium text-text-tertiary">
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-background-secondary/50 mt-auto border-t border-border-light">
        <button className="w-full py-2 text-caption font-bold text-text-secondary hover:text-text-primary transition-colors">
          View Full Audit Log
        </button>
      </div>
    </div>
  );
};