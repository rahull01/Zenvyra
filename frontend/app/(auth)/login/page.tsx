"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/hooks/useAuth";
import api from "@/lib/api";
import SocialButtons from "@/components/auth/SocialButtons";

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/auth/login", { email, password });

            if (response.status === 200) {
                const data = response.data;
                login(data.token, data.user);
                toast.success("Welcome back.");
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Could not sign in. Check your email and password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-10 text-center sm:text-left">
                <motion.div 
                    initial={false}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full mb-6"
                >
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span className="text-[10px] font-black text-brand-700 uppercase tracking-widest">Secure sign in</span>
                </motion.div>
                <h2 className="text-3xl font-display font-black text-slate-900 mb-3 tracking-tight">
                    Welcome back
                </h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Sign in to your ComplianceAI workspace.
                </p>
            </div>

            {/* Social Authentication */}
            <SocialButtons />

            {/* Divider */}
            <div className="relative py-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 bg-white px-6">
                    or continue with email
                </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                            <Link href="/forgot-password" title="Forgot password?" className="text-xs font-bold text-brand-600 hover:text-brand-500 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="input-field pr-14 group-focus-within:border-brand-500/50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="brand-button w-full flex items-center justify-center gap-3 py-4 text-sm font-black uppercase tracking-widest"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign in
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Signup Link */}
            <div className="mt-10 text-center">
                <p className="text-sm text-slate-500 font-medium">
                    New to ComplianceAI?{" "}
                    <Link href="/signup" className="text-brand-600 font-black hover:underline underline-offset-4 decoration-2">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
