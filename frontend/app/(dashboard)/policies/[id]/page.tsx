"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft, Save, Download,
    History, Eye, Edit3, Sparkles
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

type PolicyRecord = {
    id: string;
    title: string;
    website: string;
    lastUpdated: string;
    content: string;
    aiSuggestion: string;
    complianceNote: string;
};

const POLICY_LIBRARY: Record<string, PolicyRecord> = {
    "1": {
        id: "1",
        title: "Privacy Policy - SaaS Platform",
        website: "northline.app",
        lastUpdated: "3 hours ago",
        aiSuggestion: "Add a dedicated section clarifying retention windows for support chat transcripts.",
        complianceNote: "GDPR Articles 13 and 14 coverage is complete for collected personal data categories.",
        content: `# Privacy Policy - SaaS Platform

Last Updated: April 24, 2026

## 1. Introduction
Northline Inc. ("Northline", "we", "our") is committed to protecting your personal data while providing our compliance automation services.

## 2. Information We Collect
- Account data: name, work email, company name, login activity.
- Product usage data: scans run, monitored domains, issue history.
- Support data: support requests, chat metadata, and attachments.

## 3. Legal Bases for Processing
We process data under contract performance, legitimate interests, and legal obligations where applicable.

## 4. How We Use Information
- Deliver and improve compliance scanning and monitoring features.
- Provide support and security alerts.
- Produce audit records and compliance reports requested by customers.

## 5. Data Retention
- Account data: retained for account lifetime plus 30 days after deletion request.
- Audit logs: retained for 24 months for regulatory traceability.
- Support records: retained for 12 months.

## 6. Data Sharing
We share data only with vetted subprocessors required to operate our service.

## 7. Your Rights
Users may request access, correction, deletion, portability, or restriction by emailing privacy@northline.app.

## 8. Contact
Privacy team: privacy@northline.app
DPO contact: dpo@northline.app
`,
    },
    "2": {
        id: "2",
        title: "Terms of Service - Subscription Plans",
        website: "northline.app",
        lastUpdated: "1 day ago",
        aiSuggestion: "Clarify SLA remedies for Enterprise plans when monthly uptime drops below commitment.",
        complianceNote: "Key subscription, termination, and acceptable use clauses are present and internally consistent.",
        content: `# Terms of Service - Subscription Plans

Last Updated: April 23, 2026

## 1. Agreement
By accessing Northline services, you agree to these Terms.

## 2. Subscription and Billing
- Plans are billed monthly or annually in advance.
- Trial accounts convert only after explicit customer confirmation.
- Taxes are applied where required by law.

## 3. Acceptable Use
Customers must not use the service for unlawful activity, credential stuffing, or unauthorized scanning targets.

## 4. Service Availability
Northline targets 99.9% monthly uptime for paid plans.

## 5. Termination
Either party may terminate in accordance with contract terms; data export remains available for 30 days.

## 6. Limitation of Liability
Liability is limited to fees paid in the preceding 12 months, except where prohibited by law.
`,
    },
    "3": {
        id: "3",
        title: "Cookie Policy - Consent Preferences",
        website: "checkout.northline.app",
        lastUpdated: "Just now",
        aiSuggestion: "Add explicit examples for analytics and advertising cookies under each consent category.",
        complianceNote: "Consent categories and withdrawal controls satisfy baseline ePrivacy expectations.",
        content: `# Cookie Policy - Consent Preferences

Last Updated: April 24, 2026

## 1. What Are Cookies?
Cookies are small text files stored on your device to support authentication, preferences, and analytics.

## 2. Cookie Categories
- Strictly Necessary: required for login and core functionality.
- Functional: remembers language and region preferences.
- Analytics: helps us measure product performance.
- Marketing: used for campaign attribution where consent is given.

## 3. Consent Management
Users can accept or reject non-essential cookies and update choices through the preference center at any time.

## 4. Third-Party Cookies
We use selected providers for analytics and security monitoring; full list is available in our subprocessor register.

## 5. Contact
For cookie-related requests, email privacy@northline.app.
`,
    },
    "4": {
        id: "4",
        title: "GDPR Data Processing Notice",
        website: "docs.northline.app",
        lastUpdated: "5 days ago",
        aiSuggestion: "Expand transfer safeguards section with SCC references for all non-EEA subprocessors.",
        complianceNote: "Data processing roles, lawful basis, and data subject rights are clearly documented.",
        content: `# GDPR Data Processing Notice

Last Updated: April 19, 2026

## 1. Roles and Responsibilities
Northline acts as a processor for customer data submitted through product workflows.

## 2. Processing Purposes
Data is processed for scanning, monitoring, issue reporting, and compliance analytics requested by customers.

## 3. International Transfers
Where transfers occur outside the EEA, Northline relies on SCCs and supplementary safeguards.

## 4. Security Measures
Encryption in transit and at rest, access controls, audit logging, and incident response procedures are enforced.

## 5. Data Subject Rights Support
Northline provides tooling and support for access, correction, deletion, and portability requests.
`,
    },
    "5": {
        id: "5",
        title: "CCPA Consumer Rights Notice",
        website: "northline.app",
        lastUpdated: "2 hours ago",
        aiSuggestion: "Add explicit processing disclosure for customer support vendors and retention periods.",
        complianceNote: "Right-to-know and right-to-delete sections are complete and operational.",
        content: `# CCPA Consumer Rights Notice

Last Updated: April 24, 2026

## 1. Categories of Personal Information
Identifiers, internet activity, and customer account information may be collected to provide services.

## 2. Consumer Rights
California residents may request access, deletion, and correction of personal information.

## 3. Do Not Sell or Share
Northline does not sell personal information.

## 4. Verification Process
Requests are verified before action to protect account security.

## 5. Contact
Submit requests at privacy@northline.app with subject line "CCPA Request".
`,
    },
};

const FALLBACK_POLICY = POLICY_LIBRARY["1"];

export default function PolicyDetailPage() {
    const { id } = useParams();
    const policyId = Array.isArray(id) ? id[0] : id;
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    const policy = useMemo(() => POLICY_LIBRARY[policyId ?? ""] || FALLBACK_POLICY, [policyId]);

    useEffect(() => {
        const fetchPolicy = async () => {
            await new Promise(resolve => setTimeout(resolve, 900));
            setContent(policy.content);
            setLoading(false);
        };

        fetchPolicy();
    }, [policy]);

    const handleSave = () => {
        toast.success("Policy saved successfully!");
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/policies"
                        className="p-2 hover:bg-surface-800 rounded-xl transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-surface-400" />
                    </Link>
                    <div>
                        <h1 className="text-heading-1 font-display text-surface-100">
                            {policy.title}
                        </h1>
                        <p className="text-sm text-surface-500">
                            {policy.website} - Last updated {policy.lastUpdated}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                            isEditing
                            ? "bg-surface-800 border-surface-700 text-surface-100"
                            : "bg-brand-500/10 border-brand-500/20 text-brand-400 hover:bg-brand-500/20"
                        }`}
                    >
                        {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        {isEditing ? "Preview" : "Edit"}
                    </button>
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    ) : (
                        <button className="flex items-center gap-2 px-6 py-2 bg-surface-800 hover:bg-surface-700 text-surface-100 font-semibold rounded-xl transition-all duration-300">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    )}
                </div>
            </div>

            {/* Editor/Preview Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="glass-card rounded-2xl overflow-hidden">
                        {isEditing ? (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-[600px] p-8 bg-transparent text-surface-200 font-mono text-sm focus:outline-none resize-none"
                            />
                        ) : (
                            <div className="p-12 prose prose-invert max-w-none">
                                <div className="whitespace-pre-wrap text-surface-300 leading-relaxed">
                                    {content}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* AI Suggestions */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-heading-3 flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-brand-400" />
                            AI Insights
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
                                <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
                                    Suggestion
                                </p>
                                <p className="text-sm text-surface-300">
                                    {policy.aiSuggestion}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-success/10 border border-success/20">
                                <p className="text-xs font-semibold text-success uppercase tracking-wider mb-1">
                                    Compliant
                                </p>
                                <p className="text-sm text-surface-300">
                                    {policy.complianceNote}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Version History */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-heading-3 flex items-center gap-2 mb-4">
                            <History className="w-5 h-5 text-surface-400" />
                            History
                        </h3>
                        <div className="space-y-3">
                            {[
                                { date: "Today", user: "AI Assistant", type: "Regulation Sync" },
                                { date: "2 days ago", user: "Legal Team", type: "Manual Review" },
                                { date: "1 week ago", user: "AI Assistant", type: "Initial Draft" },
                            ].map((v, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-surface-800/50 last:border-0">
                                    <div>
                                        <p className="text-surface-200">{v.type}</p>
                                        <p className="text-xs text-surface-500">{v.date} by {v.user}</p>
                                    </div>
                                    <button className="text-brand-400 hover:text-brand-300 text-xs">
                                        Restore
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
