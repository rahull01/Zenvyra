"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, Building2, Check, Eye, EyeOff, Globe, Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/hooks/useAuth";
import api from "@/lib/api";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Services",
  "Other",
];

const employeeCounts = ["1-10", "11-50", "51-200", "201-500", "500+"];
const accountTypes = ["Business/SMB", "Agency", "Ecommerce", "SaaS"];
const regions = ["UK", "USA", "EU", "Global", "Custom"];
const platforms = ["Shopify", "WordPress", "Webflow", "WooCommerce", "GTM", "Custom React/Next", "Other"];
const aiUsageOptions = ["Chatbot", "AI support", "AI recommendations", "AI scoring/decisioning", "Content generation", "No AI"];

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
    websiteUrl: "",
    accountType: "",
    primaryRegion: "",
    platform: "",
    aiUsage: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const validateStep1 = () => {
    if (formData.fullName.trim().length < 2) {
      toast.error("Full name must be at least 2 characters.");
      return false;
    }
    if (!formData.email.includes("@")) {
      toast.error("Enter a valid email.");
      return false;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password)) {
      toast.error("Password needs uppercase, lowercase, number, and special character.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.companyName.trim()) {
      toast.error("Company name is required.");
      return false;
    }
    if (!formData.industry) {
      toast.error("Select an industry.");
      return false;
    }
    if (!formData.employeeCount) {
      toast.error("Select company size.");
      return false;
    }
    if (!formData.accountType) {
      toast.error("Select account type.");
      return false;
    }
    if (!formData.primaryRegion) {
      toast.error("Select primary launch region.");
      return false;
    }
    if (!formData.platform) {
      toast.error("Select website platform.");
      return false;
    }
    if (formData.aiUsage.length === 0) {
      toast.error("Select AI usage.");
      return false;
    }
    if (!agreedToTerms) {
      toast.error("Agree to the terms to continue.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    try {
      const response = await api.post("/auth/signup", {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        companyName: formData.companyName.trim(),
        industry: formData.industry,
        employeeCount: formData.employeeCount,
        websiteUrl: formData.websiteUrl.trim(),
        accountType: normalizeAccountType(formData.accountType),
        primaryRegion: formData.primaryRegion,
        platform: formData.platform,
        aiUsage: formData.aiUsage,
      });

      const tokenFromResponse = response.data?.token || response.data?.accessToken || response.data?.jwtToken;
      login(response.data.user, tokenFromResponse);
      toast.success("Account created.");
      router.push("/onboarding");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create account.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
            step >= 1 ? "bg-accent text-white" : "bg-background-tertiary text-text-secondary"
          }`}
        >
          {step > 1 ? <Check className="h-5 w-5" /> : "1"}
        </div>
        <div className={`h-1 w-16 rounded-full transition-all ${step > 1 ? "bg-accent" : "bg-background-tertiary"}`} />
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
            step >= 2 ? "bg-accent text-white" : "bg-background-tertiary text-text-secondary"
          }`}
        >
          2
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-5">
          <TextInput
            label="Full Name"
            icon={User}
            value={formData.fullName}
            onChange={(value) => updateField("fullName", value)}
            placeholder="Jane Doe"
            autoComplete="name"
          />
          <TextInput
            label="Work Email"
            icon={Mail}
            type="email"
            value={formData.email}
            onChange={(value) => updateField("email", value)}
            placeholder="jane@company.com"
            autoComplete="email"
          />
          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={(value) => updateField("password", value)}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            placeholder="Min 8 characters"
          />
          <PasswordInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(value) => updateField("confirmPassword", value)}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            placeholder="Repeat password"
          />

          <motion.button
            type="button"
            onClick={handleNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-semibold text-white transition hover:bg-primary-hover"
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            label="Company Name"
            icon={Building2}
            value={formData.companyName}
            onChange={(value) => updateField("companyName", value)}
            placeholder="Company Inc."
            autoComplete="organization"
          />
          <TextInput
            label="Website URL"
            icon={Globe}
            value={formData.websiteUrl}
            onChange={(value) => updateField("websiteUrl", value)}
            placeholder="https://company.com"
            autoComplete="url"
          />

          <ChoiceGrid
            label="Account Type"
            value={formData.accountType}
            options={accountTypes}
            onChange={(value) => updateField("accountType", value)}
          />

          <ChoiceGrid
            label="Primary Region"
            value={formData.primaryRegion}
            options={regions}
            onChange={(value) => updateField("primaryRegion", value)}
          />

          <ChoiceGrid
            label="Platform"
            value={formData.platform}
            options={platforms}
            onChange={(value) => updateField("platform", value)}
          />

          <MultiChoiceGrid
            label="Website AI usage"
            icon={Bot}
            values={formData.aiUsage}
            options={aiUsageOptions}
            onChange={(values) => setFormData((previous) => ({ ...previous, aiUsage: values }))}
          />

          <ChoiceGrid
            label="Industry"
            value={formData.industry}
            options={industries}
            onChange={(value) => updateField("industry", value)}
          />

          <ChoiceGrid
            label="Company Size"
            value={formData.employeeCount}
            options={employeeCounts}
            onChange={(value) => updateField("employeeCount", value)}
          />

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(event) => setAgreedToTerms(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border-medium text-accent focus:ring-accent/20"
            />
            <span className="text-sm text-text-secondary">I agree to the Terms of Service and Privacy Policy.</span>
          </label>

          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={() => setStep(1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-xl border border-border-light bg-background-secondary py-3.5 font-semibold text-text-secondary transition hover:bg-background-tertiary"
            >
              Back
            </motion.button>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
}

function normalizeAccountType(value: string) {
  if (value === "Business/SMB") return "BUSINESS";
  return value.toUpperCase();
}

function TextInput({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-primary">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-border-light bg-surface-card py-3 pl-11 pr-4 text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-primary">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border-light bg-surface-card py-3 pl-11 pr-12 text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}

function ChoiceGrid({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-text-primary">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              value === option
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-border-light bg-background-secondary text-text-secondary hover:bg-background-tertiary"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiChoiceGrid({
  label,
  icon: Icon,
  values,
  options,
  onChange,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  values: string[];
  options: string[];
  onChange: (value: string[]) => void;
}) {
  const toggle = (option: string) => {
    if (option === "No AI") {
      onChange(["No AI"]);
      return;
    }
    const withoutNoAi = values.filter((value) => value !== "No AI");
    if (withoutNoAi.includes(option)) {
      onChange(withoutNoAi.filter((value) => value !== option));
    } else {
      onChange([...withoutNoAi, option]);
    }
  };

  return (
    <div>
      <label className="mb-3 flex items-center gap-2 text-sm font-medium text-text-primary">
        {Icon && <Icon className="h-4 w-4 text-accent" />}
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              values.includes(option)
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-border-light bg-background-secondary text-text-secondary hover:bg-background-tertiary"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
