"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Check, ArrowLeft, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary p-8">
            <div className="w-full max-w-[420px] space-y-8">
                {/* Back Link */}
                <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to login
                </Link>

                {/* Form Card */}
                <div className="rounded-3xl border border-border-light bg-background-primary p-8 shadow-card">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-3 text-primary mb-4">
                            <Mail className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
                            {isSubmitted ? "Check Your Email" : "Reset Password"}
                        </h2>
                        <p className="text-sm text-text-secondary mt-2">
                            {isSubmitted
                                ? "We've sent you instructions to reset your password"
                                : "Enter your email and we'll send you a reset link"}
                        </p>
                    </div>

                    {isSubmitted ? (
                        <div className="text-center space-y-6">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-success/10 text-status-success border border-status-success/20 shadow-lg">
                                <Check className="h-8 w-8" />
                            </div>

                            <div className="rounded-xl border border-border-light bg-background-secondary p-4">
                                <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                                    Didn't receive the email?
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                                >
                                    Try again
                                </button>
                            </div>

                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-caption font-bold uppercase tracking-[0.05em] text-text-secondary">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        required
                                        className="w-full rounded-xl border border-border-light bg-background-primary py-3 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl py-3 shadow-button"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Link"}
                                {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
                            </Button>

                            <Link
                                href="/auth/login"
                                className="flex items-center justify-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to login
                            </Link>
                        </form>
                    )}

                    {/* Trust Seal Footer inside Card */}
                    <div className="mt-6 pt-5 border-t border-border-light flex items-center justify-center gap-2 text-caption uppercase tracking-[0.2em] text-text-muted font-bold">
                        <Shield className="h-3.5 w-3.5 text-primary/80 fill-current" />
                        256-Bit Encrypted Data Pipe
                    </div>
                </div>
            </div>
        </div>
    );
}