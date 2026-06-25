"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, Check, ArrowLeft, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Invalid or missing password reset token.");
            return;
        }
         
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
 
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
            setError("Use at least 8 characters with uppercase, lowercase, number, and special character.");
            return;
        }
 
        setIsLoading(true);
 
        try {
            await api.post("/auth/reset-password", { token, password });
            setIsSubmitted(true);
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        } catch (error: any) {
            setError(error?.response?.data?.message || "Unable to reset password. Request a new reset link.");
        } finally {
            setIsLoading(false);
        }
    };
 
    return (
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
                        <Lock className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
                        {isSubmitted ? "Reset Complete" : "Set New Password"}
                    </h2>
                    <p className="text-sm text-text-secondary mt-2">
                        {isSubmitted
                            ? "Your password has been securely updated. Redirecting to login..."
                            : "Provide a strong, new password for your account"}
                    </p>
                </div>

                {isSubmitted ? (
                    <div className="text-center space-y-6">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-success/10 text-status-success border border-status-success/20 shadow-lg">
                            <Check className="h-8 w-8" />
                        </div>

                        <div className="rounded-xl border border-border-light bg-background-secondary p-4">
                            <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                                Redirecting you to login in a few seconds...
                            </p>
                            <Link href="/auth/login" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                                Go to login now
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="rounded-xl border border-status-error/20 bg-status-error/10 p-3 text-sm font-medium text-status-error">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="block text-caption font-bold uppercase tracking-[0.05em] text-text-secondary">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-xl border border-border-light bg-background-primary py-3 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-caption font-bold uppercase tracking-[0.05em] text-text-secondary">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-xl border border-border-light bg-background-primary py-3 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Rules Indicators */}
                        <div className="space-y-2 pt-2 text-sm">
                            <div className="flex items-center gap-2.5">
                                <span className={`h-2 w-2 rounded-full transition-all duration-350 ${password.length >= 8 ? "bg-status-success shadow-md shadow-status-success/20" : "bg-background-tertiary"}`} />
                                <span className={password.length >= 8 ? "text-text-primary font-medium" : "text-text-tertiary"}>At least 8 characters</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className={`h-2 w-2 rounded-full transition-all duration-350 ${/[0-9]/.test(password) ? "bg-status-success shadow-md shadow-status-success/20" : "bg-background-tertiary"}`} />
                                <span className={/[0-9]/.test(password) ? "text-text-primary font-medium" : "text-text-tertiary"}>Contains at least one number</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className={`h-2 w-2 rounded-full transition-all duration-350 ${/[A-Z]/.test(password) && /[a-z]/.test(password) && /[@$!%*?&]/.test(password) ? "bg-status-success shadow-md shadow-status-success/20" : "bg-background-tertiary"}`} />
                                <span className={/[A-Z]/.test(password) && /[a-z]/.test(password) && /[@$!%*?&]/.test(password) ? "text-text-primary font-medium" : "text-text-tertiary"}>Uppercase, lowercase, and special character</span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl py-3 shadow-button"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
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
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary p-8">
            <Suspense fallback={<div className="flex items-center justify-center text-text-secondary font-semibold text-sm">Loading Secure Channel...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
