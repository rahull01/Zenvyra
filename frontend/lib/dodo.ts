// Dodo Payments SDK wrapper
interface DodoConfig {
    clientId: string;
    environment: "sandbox" | "production";
}

class DodoPayments {
    private config: DodoConfig;

    constructor(config: DodoConfig) {
        this.config = config;
    }

    async createCheckoutSession(params: {
        plan: string;
        successUrl: string;
        cancelUrl: string;
    }): Promise<{ checkoutUrl: string; sessionId: string }> {
        const response = await fetch("/api/subscription/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error("Failed to create checkout session");
        }

        return response.json();
    }

    async verifyWebhook(payload: any, signature: string): Promise<boolean> {
        // Implement webhook verification
        return true;
    }
}

export const dodo = new DodoPayments({
    clientId: process.env.NEXT_PUBLIC_DODO_CLIENT_ID || "",
    environment: (process.env.NEXT_PUBLIC_DODO_ENV as any) || "sandbox",
});

export default dodo;