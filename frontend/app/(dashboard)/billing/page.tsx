"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    CreditCard, Zap, Shield, Crown, Check, ArrowRight,
    Download, Calendar, AlertTriangle, RefreshCw
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const plans = [
    {
        id: "starter",
        name: "Starter",
        price: 99,
        features: ["3 websites", "Basic scans", "Email alerts"],
        current: false,
    },
    {
        id: "pro",
        name: "Pro",
        price: 299,
        features: ["10 websites", "AI auto-fix", "24/7 monitoring", "5 competitors"],
        current: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: 799,
        features: ["Unlimited", "White-label", "SSO", "Dedicated manager"],
        current: false,
    },
];

const invoices = [
    { id: "INV-2024-001", date: "Jan 1, 2024", amount: 299, status: "paid" },
    { id: "INV-2023-012", date: "Dec 1, 2023", amount: 299, status: "paid" },
    { id: "INV-2023-011", date: "Nov 1, 2023", amount: 299, status: "paid" },
    { id: "INV-2023-010", date: "Oct 1, 2023", amount: 99, status: "paid" },
];

export default function BillingPage() {
    const [isAnnual, setIsAnnual] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async (planId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/subscription/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planId }),
            });
            const data = await response.json();
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (error) {
            toast.error("Failed to process upgrade");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-display-3 font-display text-surface-100 mb-2">
                    Billing & Subscription
                </h1>
                <p className="text-surface-400">
                    Manage your plan, payment methods, and invoices
                </p>
            </div>

            {/* Current Plan */}
            <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-brand-500/10 to-accent/5 border-brand-500/20">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-brand-500/20 text-brand-400 rounded-full text-sm font-medium">
                                Current Plan
                            </span>
                            <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm font-medium">
                                Active
                            </span>
                        </div>
                        <h2 className="text-heading-1 mb-2">Pro Plan</h2>
                        <p className="text-surface-400 mb-4">
                            $299/month billed annually. Next billing date: Feb 1, 2024
                        </p>
                        <div className="flex items-center gap-4 text-sm text-surface-500">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Renews in 12 days
                            </span>
                            <span className="flex items-center gap-1">
                                <CreditCard className="w-4 h-4" />
                                Visa ending in 4242
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-surface-800 hover:bg-surface-700 text-surface-300 rounded-xl transition-all">
                            Update Payment
                        </button>
                        <button className="px-4 py-2 bg-error/20 hover:bg-error/30 text-error rounded-xl transition-all">
                            Cancel Plan
                        </button>
                    </div>
                </div>
            </div>

            {/* Usage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Websites", used: 7, total: 10, color: "bg-brand-500" },
                    { label: "Team Members", used: 3, total: 5, color: "bg-success" },
                    { label: "Competitors", used: 3, total: 5, color: "bg-warning" },
                ].map((item) => (
                    <div key={item.label} className="glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-surface-500">{item.label}</p>
                            <p className="text-sm font-medium text-surface-200">
                                {item.used} / {item.total}
                            </p>
                        </div>
                        <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${item.color}`}
                                style={{ width: `${(item.used / item.total) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-surface-500 mt-2">
                            {item.total - item.used} remaining
                        </p>
                    </div>
                ))}
            </div>

            {/* Plans */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-heading-3">Change Plan</h3>
                    <div className="flex items-center gap-3">
                        <span className={`text-sm ${!isAnnual ? "text-surface-100" : "text-surface-500"}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative w-14 h-8 bg-surface-800 rounded-full p-1 transition-colors"
                        >
                            <motion.div
                                className="w-6 h-6 bg-brand-500 rounded-full shadow-lg"
                                animate={{ x: isAnnual ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={`text-sm ${isAnnual ? "text-surface-100" : "text-surface-500"}`}>
                            Annually
                        </span>
                        {isAnnual && (
                            <span className="px-2 py-1 bg-success/20 text-success text-xs font-medium rounded-full">
                                Save 20%
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            whileHover={{ y: -5 }}
                            className={`glass-card rounded-2xl p-6 ${plan.current
                                    ? "border-2 border-brand-500/50 bg-brand-500/5"
                                    : ""
                                }`}
                        >
                            {plan.current && (
                                <div className="mb-4">
                                    <span className="px-3 py-1 bg-brand-500/20 text-brand-400 rounded-full text-xs font-medium">
                                        Current Plan
                                    </span>
                                </div>
                            )}
                            <h4 className="text-heading-3 mb-2">{plan.name}</h4>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-bold text-surface-100">
                                    ${isAnnual ? Math.round(plan.price * 0.8) : plan.price}
                                </span>
                                <span className="text-surface-500">/month</span>
                            </div>
                            <ul className="space-y-2 mb-6">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-surface-400">
                                        <Check className="w-4 h-4 text-success" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            {plan.current ? (
                                <button
                                    disabled
                                    className="w-full py-3 bg-surface-800 text-surface-500 font-semibold rounded-xl cursor-not-allowed"
                                >
                                    Current Plan
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={isLoading}
                                    className="w-full py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow disabled:opacity-50"
                                >
                                    {isLoading ? "Processing..." : "Upgrade"}
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Invoices */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-surface-800/50">
                    <h3 className="text-heading-3">Invoice History</h3>
                </div>
                <table className="w-full">
                    <thead className="bg-surface-800/50">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-medium text-surface-400">Invoice</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-surface-400">Date</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-surface-400">Amount</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-surface-400">Status</th>
                            <th className="text-right px-6 py-4 text-sm font-medium text-surface-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-800/50">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-surface-800/30 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-surface-200">{invoice.id}</td>
                                <td className="px-6 py-4 text-sm text-surface-400">{invoice.date}</td>
                                <td className="px-6 py-4 text-sm text-surface-200">${invoice.amount}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-success/20 text-success rounded-full text-xs font-medium">
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-surface-800 rounded-lg transition-colors">
                                        <Download className="w-4 h-4 text-surface-400" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}