'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialButtons from '@/components/auth/SocialButtons';
import CookieConsent from '@/components/marketing/CookieConsent';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-8">
      <div className="w-full max-w-[420px] space-y-8">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-text-primary">ComplianceAI Pro</span>
        </Link>

        <div className="text-center">
          <h2 className="text-h2 font-bold text-text-primary tracking-tight">Sign In</h2>
          <p className="text-text-secondary mt-2">Welcome back! Please enter your details.</p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-caption font-bold text-text-secondary uppercase tracking-[0.05em] ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full bg-background-primary border border-border-light rounded-xl py-3 pl-11 pr-4 text-body-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-caption font-bold text-text-secondary uppercase tracking-[0.05em]">Password</label>
              <Link href="/auth/forgot-password" className="text-caption font-bold text-primary hover:underline">Forgot password?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-primary transition-colors" />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-background-primary border border-border-light rounded-xl py-3 pl-11 pr-11 text-body-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button variant="default" size="default" className="w-full hover:bg-primary-hover transition-colors">
            Sign In
          </Button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-light" /></div>
          <div className="relative flex justify-center text-caption uppercase tracking-[0.05em] font-bold text-text-tertiary bg-background-primary px-4">or continue with</div>
        </div>

        <SocialButtons />

        <p className="text-center text-body text-text-secondary">
          Don't have an account? <Link href="/auth/signup" className="text-primary font-bold hover:underline">Sign up</Link>
        </p>
      </div>
      <CookieConsent />
    </div>
  );
}