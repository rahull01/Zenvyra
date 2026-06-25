"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, HelpCircle, LogOut, Search, User } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuth";
import api from "@/lib/api";

export const TopBar = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user?.fullName || user?.email || "Account";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";

  const signOut = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Local sign-out should still complete if the network is unavailable.
    }
    logout();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border-light bg-background-primary px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search policies, websites, settings..."
            aria-label="Search"
            className="w-full rounded-lg border border-border-light bg-background-secondary py-2 pl-10 pr-4 text-body-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-6">
        <div className="flex items-center gap-1 border-r border-border-light pr-2 sm:gap-3 sm:pr-4 lg:pr-6">
          <Link
            href="/dashboard/ai-insights"
            className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-secondary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Link>
          <Link
            href="/dashboard/support"
            className="hidden rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-secondary sm:inline-flex"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </Link>
        </div>

        <div className="relative hidden sm:block">
          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="group flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-background-secondary"
            aria-label="User menu"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white" aria-hidden="true">
              {initials}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-body-sm font-semibold leading-none text-text-primary">{displayName}</p>
              <p className="mt-1 text-caption text-text-secondary">{user?.plan || "free"} plan</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-text-tertiary group-hover:text-text-secondary sm:block" aria-hidden="true" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-border-light bg-surface-card shadow-card">
              <div className="border-b border-border-light px-4 py-3">
                <p className="text-sm font-semibold text-text-primary">{displayName}</p>
                <p className="mt-1 truncate text-xs text-text-secondary">{user?.email}</p>
              </div>
              <Link
                href="/dashboard/settings/account"
                className="flex items-center gap-2 px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-background-secondary hover:text-text-primary"
              >
                <User className="h-4 w-4" />
                Account settings
              </Link>
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-status-error transition-colors hover:bg-status-error/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
