"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Eye, EyeOff, Mail, Lock, User, Building2,
    ArrowRight, Check, Chrome, Github
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/hooks/useAuth";
import api from "@/lib/api";

const industries = [
    "Technology", "Healthcare", "Finance", "Education",
    "Retail", "Manufacturing", "Services", "Other"
];

const employeeCounts = [
    "1-10", "11-50", "51-200", "201-500", "500+"
];

export default function SignupForm() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        industry: "",
        employeeCount: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep1 = () => {
        if (!formData.fullName || formData.fullName.length < 2) {
            toast.error("Full name must be at least 2 characters");
            return false;
        }
        if (!formData.email || !formData.email.includes("@")) {
            toast.error("Please enter a valid email");
            return false;
        }
        if (!formData.password || formData.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.companyName) {
            toast.error("Company name is required");
            return false;
        }
        if (!formData.industry) {
            toast.error("Please select an industry");
            return false;
        }
        if (!formData.employeeCount) {
            toast.error("Please select company size");
            return false;
        }
        if (!agreedToTerms) {
            toast.error("Please agree to the terms");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setIsLoading(true);
        try {
            const response = await api.post("/auth/signup", {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                companyName: formData.companyName,
                industry: formData.industry,
                employeeCount: formData.employeeCount,
            });

            const data = response.data;

            login(data.token, data.user);
            toast.success("Account created successfully!");
            router.push("/dashboard");
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to create account";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-center gap-4 mb-8">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 1 ? "bg-brand-500 text-white" : "bg-surface-800 text-surface-500"
                    }`}>
                    {step > 1 ? <Check className="w-5 h-5" /> : "1"}
                </div>
                <div className={`w-16 h-1 rounded-full transition-all ${step > 1 ? "bg-brand-500" : "bg-surface-800"}`} />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 2 ? "bg-brand-500 text-white" : "bg-surface-800 text-surface-500"
                    }`}>
                    2
                </div>
            </div>

            {step === 1 ? (
                <>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-800 hover:bg-surface-700 rounded-xl text-surface-300 hover:text-surface-100 transition-all duration-200 border border-surface-700/50"
                        >
                            <Chrome className="w-5 h-5" />
                            <span className="text-sm font-medium">Google</span>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-800 hover:bg-surface-700 rounded-xl text-surface-300 hover:text-surface-100 transition-all duration-200 border border-surface-700/50"
                        >
                            <Github className="w-5 h-5" />
                            <span className="text-sm font-medium">GitHub</span>
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-surface-800" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-surface-900/60 text-surface-500">Or use email</span>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-surface-300 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => updateField("fullName", e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-11 pr-4 py-3 bg-surface-800/50 border border-surface-700/50 rounded-xl text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-300 mb-2">Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    placeholder="john@company.com"
                                    className="w-full pl-11 pr-4 py-3 bg-surface-800/50 border border-surface-700/50 rounded-xl text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => updateField("password", e.target.value)}
                                    placeholder="Min 8 characters"
                                    className="w-full pl-11 pr-12 py-3 bg-surface-800/50 border border-surface-700/50 rounded-xl text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="mt-1.5 text-xs text-surface-500">
                                Must contain uppercase, lowercase, number, and special character
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-300 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                                    placeholder="Repeat password"
                                    className="w-full pl-11 pr-4 py-3 bg-surface-800/50 border border-surface-700/50 rounded-xl text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <motion.button
                            onClick={handleNext}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow flex items-center justify-center gap-2"
                        >
                            Continue
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-surface-300 mb-2">Company Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => updateField("companyName", e.target.value)}
                                placeholder="Acme Inc."
                                className="w-full pl-11 pr-4 py-3 bg-surface-800/50 border border-surface-700/50 rounded-xl text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-surface-300 mb-3">Industry</label>
                        <div className="grid grid-cols-2 gap-2">
                            {industries.map((industry) => (
                                <button
                                    key={industry}
                                    type="button"
                                    onClick={() => updateField("industry", industry)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${formData.industry === industry
                                            ? "bg-brand-500/20 text-brand-400 border border-brand-500/50"
                                            : "bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:bg-surface-700/50"
                                        }`}
                                >
                                    {industry}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-surface-300 mb-3">Company Size</label>
                        <div className="flex flex-wrap gap-2">
                            {employeeCounts.map((count) => (
                                <button
                                    key={count}
                                    type="button"
                                    onClick={() => updateField("employeeCount", count)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${formData.employeeCount === count
                                            ? "bg-brand-500/20 text-brand-400 border border-brand-500/50"
                                            : "bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:bg-surface-700/50"
                                        }`}
                                >
                                    {count}
                                </button>
                            ))}
                        </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500/20"
                        />
                        <span className="text-sm text-surface-400">
                            I agree to the Terms of Service and Privacy Policy
                        </span>
                    </label>

                    <div className="flex gap-3">
                        <motion.button
                            type="button"
                            onClick={() => setStep(1)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-3.5 bg-surface-800 hover:bg-surface-700 text-surface-300 font-semibold rounded-xl transition-all duration-200 border border-surface-700/50"
                        >
                            Back
                        </motion.button>
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            )}
        </div>
    );
}