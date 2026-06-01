'use client';

import React, { useState } from 'react';
import DashboardPageShell from '@/components/dashboard/DashboardPageShell';
import { Settings, User, CreditCard, Users, Shield, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TeamSettings } from '@/components/marketing/TeamSettings';
import { BillingSettings } from '@/components/marketing/BillingSettings';

const tabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'team', name: 'Team', icon: Users },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'notifications', name: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <DashboardPageShell
      title="Account Settings"
      subtitle="Manage your profile, team permissions, and billing preferences."
      icon={Settings}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-text-secondary hover:bg-white hover:text-text-primary"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
            {activeTab === 'profile' && (
              <div className="p-8 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-secondary-purple text-white flex items-center justify-center text-3xl font-bold">
                    JD
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Profile Photo</h3>
                    <p className="text-sm text-text-secondary mt-1">Update your photo to help team members identify you.</p>
                    <div className="flex gap-3 mt-4">
                      <Button variant="secondary" className="py-2 text-xs">Upload New</Button>
                      <button className="text-xs font-bold text-status-error hover:underline">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-50">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Full Name</label>
                    <input defaultValue="John Doe" className="w-full bg-slate-50 border border-border-light rounded-xl py-3 px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Email Address</label>
                    <input defaultValue="john@acme-corp.com" className="w-full bg-slate-50 border border-border-light rounded-xl py-3 px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" />
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}

            {activeTab === 'team' && <TeamSettings />}
            
            {activeTab === 'billing' && <BillingSettings />}

            {['security', 'notifications'].includes(activeTab) && (
              <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
                  <Settings className="w-8 h-8 text-text-tertiary" />
                </div>
                <p className="text-text-secondary font-medium">This section is being updated with the latest compliance controls.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}