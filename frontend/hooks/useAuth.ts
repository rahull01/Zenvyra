import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    email: string;
    fullName: string;
    companyName?: string;
    avatar?: string;
    plan?: string;
    accountType?: string;
    onboardingCompleted?: boolean;
    role?: string;
    primaryRegion?: string;
    platform?: string;
    websiteUrl?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (user: User) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,

            login: (user) => {
                set({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },

            updateUser: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null,
            })),

            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user }),
        }
    )
);
