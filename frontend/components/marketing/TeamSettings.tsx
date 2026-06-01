'use client';

import React from 'react';
import { Shield, UserPlus, Trash2, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';

const members = [
  { id: 1, name: 'Jane Doe', email: 'jane@acme-corp.com', role: 'Admin', status: 'Active', avatar: 'JD' },
  { id: 2, name: 'Mike Smith', email: 'mike@acme-corp.com', role: 'Member', status: 'Active', avatar: 'MS' },
  { id: 3, name: 'Sarah Wilson', email: 'sarah@acme-corp.com', role: 'Viewer', status: 'Pending', avatar: 'SW' },
];

export const TeamSettings = () => {
  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Team Members</h3>
          <p className="text-sm text-text-secondary mt-1">Manage who has access to your compliance workspace.</p>
        </div>
        <Button className="shadow-none">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="border border-border-light rounded-2xl overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-border-light">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Member</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Role</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-tertiary text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {members.map((member) => (
              <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-xs border border-primary/10">
                      {member.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-text-primary">{member.name}</span>
                      <span className="text-xs text-text-tertiary">{member.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
                    <Shield className="w-3.5 h-3.5 text-text-tertiary" />
                    {member.role}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    member.status === 'Active' 
                      ? 'bg-emerald-50 text-status-success border-emerald-100' 
                      : 'bg-slate-50 text-text-tertiary border-slate-100'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-2 text-text-tertiary hover:text-primary hover:bg-primary-light rounded-lg transition-all" title="Edit Role">
                      <UserCog className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-text-tertiary hover:text-status-error hover:bg-red-50 rounded-lg transition-all" title="Remove Member">
                      <Trash2 className="w-4 h-4" />
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