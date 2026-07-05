"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, ClipboardCheck, Building2, ShieldAlert, Users2, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewPolicyWizardPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    websiteUrl: "",
    country: "United States",
    state: "California",
    collectsEmail: false,
    collectsBilling: false,
    collectsLocation: false,
    thirdParties: [] as string[],
    userRights: [] as string[],
  });

  const nextStep = () => {
    if (step === 1 && (!formData.businessName || !formData.websiteUrl)) {
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const toggleThirdParty = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      thirdParties: prev.thirdParties.includes(id)
        ? prev.thirdParties.filter((x) => x !== id)
        : [...prev.thirdParties, id],
    }));
  };

  const toggleUserRight = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      userRights: prev.userRights.includes(id)
        ? prev.userRights.filter((x) => x !== id)
        : [...prev.userRights, id],
    }));
  };

  const handlePublish = () => {
    // Handle publish
  };

  return (
    <main className="min-h-screen bg-background-secondary p-6 md:p-10 text-text-primary">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Generate Compliance Policy</h1>
          <p className="text-caption text-text-muted mt-1 font-semibold uppercase tracking-wider">
            Step {step} of 5 — {step === 1 ? "Business Profile" : step === 2 ? "Data Collection" : step === 3 ? "Third Parties" : step === 4 ? "User Rights" : "Review & Publish"}
          </p>
        </div>
        <Link href="/policies">
          <Button variant="outline" className="border-border-medium rounded-xl text-caption font-bold">
            Exit Wizard
          </Button>
        </Link>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-border-light h-1.5 rounded-full overflow-hidden mb-10 flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`flex-1 h-full transition-all duration-350 ${
              s <= step ? "bg-primary" : "bg-border-light"
            }`}
          />
        ))}
      </div>

      {/* Main Form container */}
      <div className="mx-auto max-w-3xl bg-background-primary border border-border-light rounded-3xl p-6 md:p-8 shadow-card min-h-[400px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border-light pb-3">
                <Building2 className="text-primary h-5 w-5" />
                Business Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-caption font-bold text-text-muted uppercase tracking-wider">Business Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-caption font-bold text-text-muted uppercase tracking-wider">Website URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.company.com"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-caption font-bold text-text-muted uppercase tracking-wider">Country Location</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>
                {formData.country === "United States" && (
                  <div className="space-y-2">
                    <label className="text-caption font-bold text-text-muted uppercase tracking-wider">State</label>
                    <input
                      type="text"
                      placeholder="e.g. California"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border-light pb-3">
                <ShieldAlert className="text-primary h-5 w-5" />
                Data & Information Collected
              </h3>
              <p className="text-sm text-text-secondary">Select the categories of personal data you collect from users.</p>
              <div className="space-y-3">
                {[
                  { id: "collectsEmail", label: "Email Address, Name, and Phone Numbers" },
                  { id: "collectsBilling", label: "Billing addresses, Payment Card info, bank credentials" },
                  { id: "collectsLocation", label: "Precise Geolocation and IP addresses" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-4 bg-background-secondary/40 border border-border-light rounded-2xl hover:border-primary/20 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData[item.id as keyof typeof formData] as boolean}
                      onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                      className="rounded text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-sm font-semibold text-text-primary">{item.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border-light pb-3">
                <Users2 className="text-primary h-5 w-5" />
                Third Party Integrations & Subprocessors
              </h3>
              <p className="text-sm text-text-secondary">Select all vendors that process customer data on your behalf.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { id: "stripe", name: "Stripe", role: "Payment Gateway" },
                  { id: "google-analytics", name: "Google Analytics", role: "Site Monitoring" },
                  { id: "salesforce", name: "Salesforce", role: "Customer CRM" },
                  { id: "hubspot", name: "HubSpot", role: "Marketing & Leads" },
                  { id: "intercom", name: "Intercom", role: "Customer Support Chat" },
                  { id: "sentry", name: "Sentry", role: "Error Telemetry" },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleThirdParty(item.id)}
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-colors ${
                      formData.thirdParties.includes(item.id)
                        ? "border-primary bg-primary-light/40"
                        : "border-border-light hover:border-primary/20"
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">{item.name}</h4>
                      <p className="text-caption text-text-muted font-semibold uppercase mt-0.5">{item.role}</p>
                    </div>
                    {formData.thirdParties.includes(item.id) && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border-light pb-3">
                <FileText className="text-primary h-5 w-5" />
                Visitor rights & Legal frameworks
              </h3>
              <p className="text-sm text-text-secondary">Select privacy frameworks you intend to grant users control over.</p>
              <div className="space-y-3">
                {[
                  { id: "gdpr-access", label: "Right to access, edit, export, and delete personal files (GDPR)" },
                  { id: "ccpa-optout", label: "Right to opt out of the sale or sharing of user records (CCPA/CPRA)" },
                  { id: "lgpd-confirm", label: "Confirmation of active processing and consent revocation (LGPD)" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-4 bg-background-secondary/40 border border-border-light rounded-2xl hover:border-primary/20 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.userRights.includes(item.id)}
                      onChange={() => toggleUserRight(item.id)}
                      className="rounded text-primary focus:ring-primary h-4 w-4 mt-0.5"
                    />
                    <span className="text-sm font-semibold text-text-primary leading-tight">{item.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-6"
            >
              <div className="mx-auto h-14 w-14 bg-primary-light text-primary rounded-full flex items-center justify-center mb-4">
                <ClipboardCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Wizard Complete!</h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
                We've gathered all business parameters. Verify details below to auto-generate the custom privacy policy document.
              </p>

              <div className="bg-background-secondary/50 border border-border-light rounded-2xl p-5 text-left text-sm space-y-2 max-w-lg mx-auto">
                <div><strong>Business Name:</strong> {formData.businessName}</div>
                <div><strong>Website Domain:</strong> {formData.websiteUrl}</div>
                <div><strong>Compliance Jurisdictions:</strong> {formData.country} {formData.country === "United States" ? `(${formData.state})` : ""}</div>
                <div><strong>Third Party Processing:</strong> {formData.thirdParties.length > 0 ? formData.thirdParties.join(", ") : "None selected"}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons Row */}
        <div className="flex justify-between items-center gap-4 pt-6 border-t border-border-light mt-8">
          <Button
            variant="outline"
            disabled={step === 1}
            onClick={prevStep}
            className="border-border-medium rounded-xl text-caption font-bold py-2.5 px-4"
          >
            <ChevronLeft className="mr-1.5 h-4 w-4" />
            Previous
          </Button>

          {step === 5 ? (
            <Link href="/policies">
              <Button
                onClick={handlePublish}
                className="bg-primary hover:bg-primary-hover text-white rounded-xl font-bold px-6"
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Publish Policy
              </Button>
            </Link>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-primary hover:bg-primary-hover text-white rounded-xl font-bold px-6"
            >
              Next Step
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
