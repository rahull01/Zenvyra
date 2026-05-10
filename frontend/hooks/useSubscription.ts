import { useState, useCallback } from "react";
import toast from "react-hot-toast";

interface Subscription {
    id: string;
    plan: string;
    status: "active" | "cancelled" | "past_due";
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
}

export function useSubscription() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const createCheckout = useCallback(async (planId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/subscription/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planId }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create checkout");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const cancelSubscription = useCallback(async () => {
        try {
            await fetch("/api/subscription/cancel", { method: "POST" });
            toast.success("Subscription will cancel at period end");
        } catch {
            toast.error("Failed to cancel subscription");
        }
    }, []);

    return {
        subscription,
        isLoading,
        createCheckout,
        cancelSubscription,
    };
}