"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Eye, EyeOff, ArrowRight, Check, Loader2, ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/hooks/useAuth";
import api from "@/lib/api";
import SocialButtons from "@/components/auth/SocialButtons";

const industries = [
    "Technology", "Healthcare", "Finance", "Education",
    "Retail", "Manufacturing", "Services", "Other"
];

const employeeCounts = [
    "1-10", "11-50", "51-200", "201-500", "500+"
];

export default function SignupPage() {
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
            toast.error("Enter your full name.");
            return false;
        }
        if (!formData.email || !formData.email.includes("@")) {
            toast.error("Enter a valid email address.");
            return false;
        }
        if (!formData.password || formData.password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.companyName) {
            toast.error("Enter your company name.");
            return false;
        }
        if (!formData.industry) {
            toast.error("Choose an industry.");
            return false;
        }
        if (!formData.employeeCount) {
            toast.error("Choose your company size.");
            return false;
        }
        if (!agreedToTerms) {
            toast.error("Please agree to the terms.");
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
            const signupData = {
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                companyName: formData.companyName,
                industry: formData.industry,
                employeeCount: formData.employeeCount
            };
            
            const response = await api.post("/auth/signup", signupData);

            if (response.status === 200 || response.status === 201) {
                const data = response.data;
                login(data.token, data.user);
                toast.success("Account created. Welcome.");
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Could not create your account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8 text-center sm:text-left">
                <motion.div 
                    initial={false}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full mb-4"
                >
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span className="text-[10px] font-black text-brand-700 uppercase tracking-widest">Create account</span>
                </motion.div>
                <h2 className="text-3xl font-display font-black text-slate-900 mb-2 tracking-tight">
                    {step === 1 ? "Start your account" : "Tell us about your company"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                    {step === 1 
                        ? "Use your email or continue with a provider." 
                        : "This helps tailor your compliance workspace."}
                </p>
            </div>

            {/* Steps Progress */}
            <div className="flex items-center gap-4 mb-10">
                {[1, 2].map((s) => (
                    <div key={s} className="flex-1 flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-500 ${
                            step >= s ? "bg-slate-900 text-white shadow-glow" : "bg-slate-100 text-slate-400"
                        }`}>
                            {step > s ? <Check className="w-4 h-4" /> : s}
                        </div>
                        <div className={`flex-1 h-1 rounded-full ${
                            step > s ? "bg-brand-500" : "bg-slate-100"
                        }`} />
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={false}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <SocialButtons />

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 bg-white px-6">
                                or continue with email
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => updateField("fullName", e.target.value)}
                                    placeholder="Full name"
                                    className="input-field"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    placeholder="name@company.com"
                                    className="input-field"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => updateField("password", e.target.value)}
                                            placeholder="Create a password"
                                            className="input-field pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                                        placeholder="Repeat password"
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="button" 
                            onClick={handleNext} 
                            className="brand-button w-full flex items-center justify-center gap-3 py-4 text-sm font-black uppercase tracking-widest"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        key="step2"
                        initial={false}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleSubmit}
                        method="POST"
                        className="space-y-6"
                    >
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Company name</label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => updateField("companyName", e.target.value)}
                                    placeholder="Acme Corp"
                                    className="input-field"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Industry</label>
                                <select
                                    value={formData.industry}
                                    onChange={(e) => updateField("industry", e.target.value)}
                                    className="input-field appearance-none bg-[right_1.5rem_center] bg-no-repeat bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
                                >
                                    <option value="" disabled>Select industry</option>
                                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Company size</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {employeeCounts.map(count => (
                                        <button
                                            key={count}
                                            type="button"
                                            onClick={() => updateField("employeeCount", count)}
                                            className={`py-3 text-[10px] font-black rounded-xl border transition-all duration-300 ${
                                                formData.employeeCount === count 
                                                    ? "bg-slate-900 text-white border-slate-900 shadow-glow" 
                                                    : "bg-white text-slate-500 border-slate-200 hover:border-brand-500/50 hover:text-slate-900"
                                            }`}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="h-4 w-4 rounded-md border-slate-300 text-brand-600 focus:ring-brand-500/20"
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                                    I agree to the
                                    <Link href="/terms" className="mx-1 text-brand-600 hover:underline">Service Terms</Link>
                                    and
                                    <Link href="/privacy" className="mx-1 text-brand-600 hover:underline">Privacy Policy</Link>.
                                </span>
                            </label>
                        </div>

                        <div className="flex gap-4">
                            <button type="button" onClick={() => setStep(1)} className="secondary-button flex-1 py-4 text-[10px] font-black uppercase tracking-widest">Back</button>
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="brand-button flex-1 py-4 text-[10px] font-black uppercase tracking-widest"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Create account"}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Login Link */}
            <div className="mt-10 text-center">
                <p className="text-sm text-slate-500 font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="text-brand-600 font-black hover:underline underline-offset-4 decoration-2">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
