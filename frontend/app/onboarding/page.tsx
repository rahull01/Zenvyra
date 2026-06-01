"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(prevStep => Math.min(prevStep + 1, 4));
  };

  const handleBack = () => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  };

  return (
    <div className="min-h-screen bg-background-base flex flex-col justify-center items-center py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Onboarding</h1>
        <p className="text-sm text-text-secondary">Step {step} of 4</p>
      </div>

      <div className="w-full max-w-2xl rounded-[32px] border border-border-light bg-surface-card p-8 shadow-card">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-text-primary">Step 1: Website</h2>
            <p className="text-text-secondary">Enter your website URL</p>
            <input
              type="url"
              placeholder="https://example.com"
              className="w-full rounded-full border border-border-light bg-surface-card/80 px-4 py-3 text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
            />
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-text-primary">Step 2: Regulations</h2>
            <p className="text-text-secondary">Select applicable regulations</p>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-2 rounded-full border border-border-light bg-surface-card/80 px-3 py-2 text-text-secondary">
                <input type="checkbox" defaultChecked className="sr-only" />
                <span>GDPR</span>
              </label>
              <label className="flex items-center gap-2 rounded-full border border-border-light bg-surface-card/80 px-3 py-2 text-text-secondary">
                <input type="checkbox" defaultChecked className="sr-only" />
                <span>CCPA</span>
              </label>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-text-primary">Step 3: Team</h2>
            <p className="text-text-secondary">Invite team members</p>
            <input
              type="email"
              placeholder="team@example.com"
              className="w-full rounded-full border border-border-light bg-surface-card/80 px-4 py-3 text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
            />
          </div>
        )}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-text-primary">Step 4: Start Scan</h2>
            <p className="text-text-secondary">Ready to launch your first compliance scan?</p>
            <Button onClick={() => router.push("/dashboard")}>
              Start Scan
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <button onClick={handleBack} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
            Back
          </button>
        )}
        {step < 4 && (
          <button onClick={handleNext} className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover">
            Next Step
          </button>
        )}
      </div>
    </div>
  );
}