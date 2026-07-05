"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-x-hidden bg-background-base px-4 py-12 sm:px-6">
      <div className="w-full max-w-md min-w-0 space-y-10">
        <div className="rounded-[24px] border border-border-light bg-surface-card p-5 shadow-card sm:rounded-[32px] sm:p-8">
          <Link href="/" className="mb-8 flex min-w-0 items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent shadow-sm">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="min-w-0 text-xl font-bold tracking-tight text-text-primary sm:text-2xl">Zenvyra</span>
          </Link>

          <div className="mb-6 text-center">
            <h2 className="text-h2 font-bold tracking-tight text-text-primary">Sign Up</h2>
            <p className="mx-auto mt-3 max-w-sm text-balance text-text-secondary">Create your account to start monitoring live compliance data.</p>
          </div>

          <SignupForm />

          <p className="mt-6 text-center text-body text-text-secondary">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
