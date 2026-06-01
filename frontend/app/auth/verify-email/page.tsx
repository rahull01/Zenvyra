"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, RefreshCw, ArrowRight, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [message, setMessage] = useState("We are verifying your security credentials...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid email verification token.");
            return;
        }

        const verify = async () => {
            // Simulate API call
            setTimeout(() => {
                setStatus("success");
                setMessage("Your email address has been successfully verified!");
                setTimeout(() => {
                    router.push("/onboarding");
                }, 4000);
            }, 1500);
        };

        verify();
    }, [token, router]);

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
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
                        Security Verification
                    </h1>
                    <p className="mt-2 text-sm text-text-secondary">
                        ComplianceAI cryptographically signs validation protocols.
                    </p>
                </div>

                <div className="py-4">
                    {status === "verifying" && (
                        <div className="text-center space-y-6">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shadow-lg">
                                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                            </div>
                            <p className="text-sm font-semibold text-text-primary animate-pulse">{message}</p>
                        </div>
                    )}
                    
                    {status === "success" && (
                        <div className="text-center space-y-6">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-success/10 border border-status-success/20 shadow-lg">
                                <CheckCircle2 className="h-8 w-8 text-status-success" />
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-bold text-status-success">{message}</p>
                                <p className="text-xs text-text-secondary">Redirecting to onboarding workspace setup...</p>
                            </div>

                            <Link
                                href="/onboarding"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-6 py-3.5 text-sm font-bold text-white shadow-button"
                            >
                                Go to Onboarding
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                    
                    {status === "error" && (
                        <div className="text-center space-y-6">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-error/10 border border-status-error/20 shadow-lg">
                                <AlertCircle className="h-8 w-8 text-status-error" />
                            </div>

                            <p className="text-sm font-semibold text-status-error">{message}</p>

                            <div className="pt-4 flex flex-col gap-3">
                                <Link
                                    href="/auth/signup"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-6 py-3.5 text-sm font-bold text-white shadow-button"
                                >
                                    Create New Account
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                             
                                <Link
                                    href="/auth/login"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-light bg-background-secondary hover:bg-background-tertiary px-6 py-3.5 text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
                                >
                                    <ArrowLeft className="w-4 w-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Trust Seal Footer inside Card */}
                <div className="mt-6 pt-5 border-t border-border-light flex items-center justify-center gap-2 text-caption uppercase tracking-[0.2em] text-text-muted font-bold">
                    <Shield className="h-3.5 w-3.5 text-primary/80 fill-current" />
                    256-Bit Encrypted Data Pipe
                </div>
            </div>
        </div>
    );
}
 
export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary p-8">
            <Suspense fallback={<div className="flex items-center justify-center text-text-secondary font-semibold text-sm">Loading Secure Channel...</div>}>
                <VerifyEmailForm />
            </Suspense>
        </div>
    );
}