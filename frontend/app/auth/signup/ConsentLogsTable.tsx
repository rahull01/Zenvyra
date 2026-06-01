'use client';

import React from 'react';
import { Search, Filter, Download, UserCheck, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const logs = [
  { id: '1', user: 'Anonymous (London)', action: 'Accept All', categories: 'Essential, Analytics, Marketing', ip: '82.xx.xx.xx', date: '2 mins ago', status: 'compliant' },
  { id: '2', user: 'Anonymous (New York)', action: 'Rejected All', categories: 'None', ip: '104.xx.xx.xx', date: '15 mins ago', status: 'compliant' },
  { id: '3', user: 'User_49202', action: 'Partial Consent', categories: 'Essential, Analytics', ip: '192.xx.xx.xx', date: '1 hour ago', status: 'compliant' },
  { id: '4', user: 'Anonymous (Berlin)', action: 'Accept All', categories: 'Essential, Analytics, Marketing', ip: '31.xx.xx.xx', date: '3 hours ago', status: 'compliant' },
];

export const ConsentLogsTable = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search by IP or ID..."
            className="w-full bg-white border border-border-light rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2 border border-border-light rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-text-secondary" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border-light rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Subject / ID</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Action Taken</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Categories</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-tertiary text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-text-primary">{log.user}</span>
                      <span className="text-[11px] text-text-tertiary font-mono">{log.ip}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-text-secondary">{log.action}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-text-tertiary truncate max-w-[180px] block">{log.categories}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{log.date}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-status-success bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                      <UserCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};