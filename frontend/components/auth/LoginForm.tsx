"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
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
            const data = response.data;

            login(data.token, data.user);
            toast.success("Identity verified. Welcome back.");
            router.push("/dashboard");
        } catch (error: any) {
            const message = error.response?.data?.message || "Verification failed. Please check your credentials.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* OAuth */}
            <div className="grid grid-cols-2 gap-4">
                <Button
                    type="button"
                    variant="outline"
                    className="h-14 rounded-2xl border-bg-tertiary bg-bg-secondary/50 text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="h-14 rounded-2xl border-bg-tertiary bg-bg-secondary/50 text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-all duration-300"
                >
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                </Button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-bg-tertiary" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-bg-primary text-text-muted font-bold uppercase tracking-widest">Or access via protocol</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Identity (Email)</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="operator@nexus.com"
                            required
                            className="pl-12 h-14 rounded-2xl bg-bg-secondary/50 border-bg-tertiary focus:border-accent/50 transition-all duration-300"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Access Key</label>
                        <Link href="/forgot" className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">Lost access?</Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="pl-12 pr-12 h-14 rounded-2xl bg-bg-secondary/50 border-bg-tertiary focus:border-accent/50 transition-all duration-300"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-glow-accent transition-all duration-300"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            Verify Identity
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
