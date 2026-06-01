'use client';

import React from 'react';
import { MoreHorizontal, ExternalLink, FileEdit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const policies = [
  { id: 1, name: 'Main Privacy Policy', type: 'Privacy Policy', website: 'acme-corp.com', status: 'Active', updated: '2 hours ago' },
  { id: 2, name: 'Cookie Policy 2024', type: 'Cookie Policy', website: 'acme-corp.com', status: 'Active', updated: '5 hours ago' },
  { id: 3, name: 'Terms of Service', type: 'Terms & Conditions', website: 'shop.acme.com', status: 'Draft', updated: '1 day ago' },
  { id: 4, name: 'EULA - Mobile App', type: 'EULA', website: 'App Store', status: 'Expired', updated: '3 days ago' },
];

const statusStyles = {
  Active: "bg-status-success/10 text-status-success border-status-success/20",
  Draft: "bg-status-warning/10 text-status-warning border-status-warning/20",
  Expired: "bg-status-error/10 text-status-error border-status-error/20",
};

export const RecentPoliciesTable = () => {
  return (
    <div className="bg-background-primary rounded-2xl border border-border-light shadow-card overflow-hidden">
      <div className="p-6 border-b border-border-light flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary">Recent Policies</h3>
        <button className="text-sm font-bold text-primary hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-secondary/50">
              <th className="px-6 py-4 text-caption font-bold uppercase tracking-wider text-text-tertiary">Policy Name</th>
              <th className="px-6 py-4 text-caption font-bold uppercase tracking-wider text-text-tertiary">Type</th>
              <th className="px-6 py-4 text-caption font-bold uppercase tracking-wider text-text-tertiary">Website</th>
              <th className="px-6 py-4 text-caption font-bold uppercase tracking-wider text-text-tertiary">Status</th>
              <th className="px-6 py-4 text-caption font-bold uppercase tracking-wider text-text-tertiary text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {policies.map((policy) => (
              <tr key={policy.id} className="group hover:bg-background-secondary/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-text-primary">{policy.name}</span>
                    <span className="text-xs text-text-tertiary">Updated {policy.updated}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">{policy.type}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <span className="truncate max-w-[120px]">{policy.website}</span>
                    <ExternalLink className="w-3 h-3 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-bold border",
                    statusStyles[policy.status as keyof typeof statusStyles]
                  )}>
                    {policy.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-text-tertiary hover:text-primary hover:bg-primary-light rounded-lg transition-all">
                      <FileEdit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-text-tertiary hover:text-status-error hover:bg-status-error/10 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-text-tertiary hover:bg-background-secondary rounded-lg transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};