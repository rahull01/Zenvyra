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
                // The backend already sets the HttpOnly `zenvyra_access` /
                // `zenvyra_refresh` cookies on a successful login response.
                // The JWT lives in HttpOnly cookies and is sent automatically
                // by the browser. We do NOT attempt to read or store the JWT
                // here.
                set({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            logout: () => {
                // The backend `/auth/logout` endpoint clears the HttpOnly
                // cookies. Callers should invoke `/auth/logout` before calling
                // this so the cookies are cleared server-side. We just clear
                // local state here.
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
