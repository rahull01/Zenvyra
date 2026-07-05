"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background-base flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-10">
        <div className="rounded-[32px] border border-border-light bg-surface-card p-8 shadow-card">
          <Link href="/" className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent shadow-sm">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-text-primary">Zenvyra</span>
          </Link>

          <div className="mb-6 text-center">
            <h2 className="text-h2 font-bold tracking-tight text-text-primary">Sign In</h2>
            <p className="mt-3 text-text-secondary">Enter your credentials to continue.</p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-body text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
