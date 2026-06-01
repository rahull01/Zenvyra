'use client';

import React from 'react';
import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';

export const TopBar = () => {
  return (
    <header className="h-16 bg-background-primary border-b border-border-light sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search policies, settings..." 
            aria-label="Search"
            className="w-full bg-background-secondary border border-border-light rounded-lg py-2 pl-10 pr-4 text-body-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 border-r border-border-light pr-6">
          <button 
            className="p-2 text-text-secondary hover:bg-background-secondary rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-status-error rounded-full border-2 border-background-primary" aria-hidden="true" />
          </button>
          <button 
            className="p-2 text-text-secondary hover:bg-background-secondary rounded-lg transition-colors"
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <button 
          className="flex items-center gap-3 hover:bg-background-secondary p-1.5 rounded-lg transition-colors group"
          aria-label="User menu"
          aria-haspopup="true"
        >
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs" aria-hidden="true">
            JD
          </div>
          <div className="text-left hidden md:block">
            <p className="text-body-sm font-semibold text-text-primary leading-none">Jane Doe</p>
            <p className="text-caption text-text-secondary mt-1">Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};