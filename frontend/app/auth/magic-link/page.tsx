"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MagicLinkPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="flex min-h-screen bg-background-secondary">
      {/* Visual Side Banner */}
      <div className="hidden w-[50%] bg-secondary-dark lg:flex lg:flex-col lg:justify-between lg:p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,126,34,0.15),transparent_60%)]" />
        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-black text-lg">C</span>
          </div>
          <span className="text-lg font-bold text-white tracking-wide">ComplianceAI Pro</span>
        </div>

        <div className="relative space-y-4 max-w-md">
          <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs font-bold text-primary uppercase tracking-widest">
            Passwordless Access
          </span>
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Sign in securely with one click
          </h2>
          <p className="text-sm text-text-tertiary leading-relaxed">
            Eliminate credential vulnerability. We'll email you a secure, temporary authentication link for instant dashboard access.
          </p>
        </div>

        <div className="relative text-xs text-text-tertiary font-semibold uppercase tracking-wider">
          © 2026 ComplianceAI Pro Enterprise
        </div>
      </div>

      {/* Interactive Form Panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-background-primary">
        <div className="w-full max-w-[420px] space-y-8">
          <div>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Standard Login
            </Link>
          </div>

          <div className="space-y-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Magic Link Sign In</h1>
            <p className="text-sm text-text-secondary">
              Input your account email to receive a password-free sign-in ticket.
            </p>
          </div>

          {sent ? (
            <div className="bg-primary-light/20 border border-primary/10 rounded-2xl p-6 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary-light flex items-center justify-center text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-text-primary">Verify your Inbox</h4>
                <p className="text-xs leading-relaxed text-text-secondary">
                  A verification ticket has been sent to <strong>{email}</strong>. The authentication link expires in 15 minutes.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSent(false)}
                className="w-full border-border-medium hover:bg-background-secondary rounded-xl text-xs font-bold py-2.5"
              >
                Request a new link
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-caption font-bold text-text-muted uppercase tracking-wider">
                  Work Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary placeholder-text-muted transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-button transition-transform hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending login link...
                  </>
                ) : (
                  "Email Magic Link"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
