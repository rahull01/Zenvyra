'use client';

import React from 'react';
import { PolicyWizard } from '@/components/policies/PolicyWizard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function NewPolicyPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <nav className="flex items-center gap-2 text-sm font-medium text-text-tertiary">
        <Link href="/dashboard" className="hover:text-text-primary transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/policies" className="hover:text-text-primary transition-colors">Policies</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-text-primary">New Privacy Policy</span>
      </nav>

      <PolicyWizard />
    </div>
  );
}