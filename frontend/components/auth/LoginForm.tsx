"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.user);
      toast.success("Signed in.");
      router.push(authRedirectPath(response.data.user));
    } catch (error: any) {
      const message = error.response?.data?.message || "Sign in failed. Check your credentials.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="ml-1 text-caption font-semibold uppercase tracking-[0.12em] text-text-secondary">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
            className="h-14 rounded-2xl border-border-light bg-surface-card pl-12 text-text-primary placeholder:text-text-secondary focus:border-accent focus:ring-accent/10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-caption font-semibold uppercase tracking-[0.12em] text-text-secondary">
            Password
          </label>
          <Link href="/auth/forgot-password" className="text-caption font-semibold text-accent hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            className="h-14 rounded-2xl border-border-light bg-surface-card pl-12 pr-12 text-text-primary placeholder:text-text-secondary focus:border-accent focus:ring-accent/10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-text-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="h-14 w-full rounded-2xl text-sm font-bold">
        {isLoading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <>
            Sign In
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}

function authRedirectPath(user: any) {
  if (user?.role === "ROLE_ADMIN") return "/admin";
  if (user?.onboardingCompleted === false) return "/onboarding";
  if (String(user?.accountType || "").toUpperCase() === "AGENCY") return "/agency";
  return "/dashboard";
}
