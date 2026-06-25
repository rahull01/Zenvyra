"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, CreditCard, Loader2, RefreshCw, ShieldCheck, Wrench } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { PRICING_PLANS, planName } from "@/lib/pricing-plans";

type Subscription = {
  plan: string;
  planName?: string;
  status: string;
  amount?: number;
  currency?: string;
  currentPeriodEnd?: string;
  nextBillingDate?: string;
};

type Usage = {
  plan: string;
  limits: Record<string, number>;
  currentUsage: Record<string, number>;
};

type SetupPackageOrder = {
  id: string;
  websiteUrl?: string;
  platform?: string;
  paymentStatus: string;
  setupStatus: string;
  amountCents?: number;
  currency?: string;
  checkoutUrl?: string;
  requestedAt?: string;
};

export default function BillingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [setupOrders, setSetupOrders] = useState<SetupPackageOrder[]>([]);
  const [requestingSetup, setRequestingSetup] = useState(false);

  const loadBilling = async () => {
    setLoading(true);
    try {
      const [subscriptionResponse, usageResponse, setupResponse] = await Promise.all([
        api.get<Subscription>("/subscription/current"),
        api.get<{ data: Usage }>("/dashboard/usage"),
        api.get<SetupPackageOrder[]>("/setup-package/status"),
      ]);
      setSubscription(subscriptionResponse.data);
      setUsage(usageResponse.data.data);
      setSetupOrders(setupResponse.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to load billing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBilling();
  }, []);

  const handleCheckout = async (planId: string) => {
    if (planId === "free") {
      toast("Free plan is active without checkout.");
      return;
    }
    setCheckoutPlan(planId);
    try {
      const response = await api.post<{ checkoutUrl: string }>("/subscription/create", { plan: planId });
      window.location.href = response.data.checkoutUrl;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create checkout session");
    } finally {
      setCheckoutPlan(null);
    }
  };

  const currentPlan = subscription?.plan || usage?.plan || "free";
  const renewalDate = subscription?.nextBillingDate || subscription?.currentPeriodEnd;
  const latestSetup = setupOrders[0];

  const requestSetupPackage = async () => {
    setRequestingSetup(true);
    try {
      const response = await api.post<{ checkoutUrl?: string; message?: string }>("/setup-package/request", {
        currency: "USD",
      });
      toast.success(response.data.message || "Setup package request created.");
      await loadBilling();
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to request setup package");
    } finally {
      setRequestingSetup(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-display-3 font-display text-text-primary mb-2">Billing & Subscription</h1>
          <p className="text-text-secondary">Manage your plan and usage from live subscription data.</p>
        </div>
        <button
          onClick={loadBilling}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-border-light px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-background-secondary disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-10 text-center text-text-secondary">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading billing...
        </div>
      ) : (
        <>
          <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-primary/10 to-primary-hover/5 border-primary/20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">Current Plan</span>
                  <span className="px-3 py-1 bg-status-success/20 text-status-success rounded-full text-sm font-medium">
                    {subscription?.status || "active"}
                  </span>
                </div>
                <h2 className="text-heading-1 mb-2">{subscription?.planName || planName(currentPlan)} Plan</h2>
                <p className="text-text-secondary mb-4">
                  {currentPlan === "free" ? "No payment method required." : `Renews ${formatDate(renewalDate)}.`}
                </p>
                <div className="flex items-center gap-4 text-sm text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(renewalDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    Managed by Dodo Payments
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["websites", "policies", "scans"].map((key) => {
              const used = Number(usage?.currentUsage?.[key] || 0);
              const total = Number(usage?.limits?.[key] || 0);
              const percentage = total > 0 ? Math.min(100, (used / total) * 100) : 0;
              return (
                <div key={key} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm capitalize text-text-tertiary">{key}</p>
                    <p className="text-sm font-medium text-text-primary">{used} / {total || "unlimited"}</p>
                  </div>
                  <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-card rounded-2xl border-primary/20 bg-gradient-to-br from-primary/10 to-background-primary p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
                  <Wrench className="h-4 w-4" />
                  Done-for-You Setup Package
                </div>
                <h3 className="text-heading-2 text-text-primary">$199 founder-led setup per website</h3>
                <p className="mt-3 text-text-secondary">
                  Includes website scan, privacy proof score, policy drafts, cookie/banner setup config, consent logging setup,
                  public trust certificate, proof pack report, install handoff, and one setup revision.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {["Auto-fix where platform access allows", "Guided fix steps everywhere else", "Admin operator task queue", "Handoff and install verification"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                      <ShieldCheck className="h-4 w-4 text-status-success" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full rounded-xl border border-border-light bg-background-secondary p-5 lg:max-w-sm">
                <p className="text-sm font-semibold text-text-secondary">Latest setup status</p>
                {latestSetup ? (
                  <div className="mt-3 space-y-3">
                    <p className="truncate text-lg font-bold text-text-primary">{latestSetup.websiteUrl || "Website pending"}</p>
                    <div className="flex flex-wrap gap-2">
                      <StatusPill label={latestSetup.paymentStatus} />
                      <StatusPill label={latestSetup.setupStatus} />
                    </div>
                    <p className="text-sm text-text-secondary">
                      Requested {formatDate(latestSetup.requestedAt)}. Payment remains pending until checkout/webhook confirmation.
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-text-secondary">No setup package requested yet.</p>
                )}
                <button
                  onClick={requestSetupPackage}
                  disabled={requestingSetup}
                  className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
                >
                  {requestingSetup ? "Creating request..." : latestSetup ? "Request another website setup" : "Request setup package"}
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-heading-3">Change Plan</h3>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${!isAnnual ? "text-text-primary" : "text-text-tertiary"}`}>Monthly</span>
                <button onClick={() => setIsAnnual(!isAnnual)} className="relative w-14 h-8 bg-background-tertiary rounded-full p-1 transition-colors">
                  <motion.div className="w-6 h-6 bg-primary rounded-full shadow-lg" animate={{ x: isAnnual ? 24 : 0 }} />
                </button>
                <span className={`text-sm ${isAnnual ? "text-text-primary" : "text-text-tertiary"}`}>Annually</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRICING_PLANS.map((plan) => {
                const isCurrent = plan.id === currentPlan;
                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -5 }}
                    className={`glass-card rounded-2xl p-6 ${isCurrent ? "border-2 border-primary/50 bg-primary/5" : ""}`}
                  >
                    {isCurrent && <span className="mb-4 inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-caption font-medium">Current Plan</span>}
                    <h4 className="text-heading-3 mb-2">{plan.name}</h4>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-text-primary">${isAnnual ? plan.annualMonthlyPrice : plan.monthlyPrice}</span>
                      <span className="text-text-tertiary">/month</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                          <Check className="w-4 h-4 text-status-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleCheckout(plan.id)}
                      disabled={isCurrent || checkoutPlan === plan.id}
                      className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all duration-300 shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCurrent ? "Current Plan" : checkoutPlan === plan.id ? "Processing..." : plan.id === "free" ? "Included" : "Upgrade"}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-background-tertiary px-3 py-1 text-xs font-bold uppercase text-text-secondary">
      {label.replaceAll("_", " ")}
    </span>
  );
}

function formatDate(value?: string) {
  if (!value) return "No renewal scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No renewal scheduled";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}
