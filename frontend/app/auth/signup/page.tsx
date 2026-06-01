'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialButtons from '@/components/auth/SocialButtons';
import CookieConsent from '@/components/marketing/CookieConsent';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 25) return 'bg-status-error';
    if (strength <= 50) return 'bg-status-warning';
    if (strength <= 75) return 'bg-primary';
    return 'bg-status-success';
  };

  const getStrengthLabel = (strength: number) => {
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-background-base flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-10">
        <div className="rounded-[32px] border border-border-light bg-surface-card p-8 shadow-card">
          <Link href="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center shadow-sm">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-text-primary">ComplianceAI Pro</span>
          </Link>

          <div className="text-center mb-6">
            <h2 className="text-h2 font-bold text-text-primary tracking-tight">Sign Up</h2>
            <p className="text-text-secondary mt-3">Create your account to get started</p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-caption font-semibold text-text-secondary uppercase tracking-[0.12em] ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary transition-colors" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-border-light bg-surface-card py-3 pl-11 pr-4 text-body-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-caption font-bold text-text-secondary uppercase tracking-[0.05em] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full rounded-xl border border-border-light bg-surface-card py-3 pl-11 pr-11 text-body-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex gap-1 h-1">
                  {[0, 25, 50, 75, 100].map((threshold) => {
                    const segmentClass = passwordStrength >= threshold
                      ? getStrengthColor(passwordStrength)
                      : 'bg-background-tertiary';

                    return (
                      <div
                        key={threshold}
                        className={`flex-1 rounded-full transition-colors ${segmentClass}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-caption text-text-secondary uppercase tracking-[0.05em]">
                    Password strength: <span className={`font-semibold ${passwordStrength > 50 ? 'text-status-success' : passwordStrength > 25 ? 'text-status-warning' : 'text-status-error'}`}>{getStrengthLabel(passwordStrength)}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-caption font-semibold text-text-secondary uppercase tracking-[0.12em] ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary transition-colors" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border-light bg-surface-card py-3 pl-11 pr-11 text-body-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button variant="default" size="default" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-light" />
            </div>
            <div className="relative flex justify-center text-caption uppercase tracking-[0.12em] font-semibold text-text-secondary bg-surface-card px-4">or continue with</div>
          </div>

          <SocialButtons />

          <p className="text-center text-body text-text-secondary">
            Already have an account? <Link href="/auth/login" className="text-accent font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
        <CookieConsent />
      </div>
    </div>
  );
}
