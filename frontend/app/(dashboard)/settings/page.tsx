"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User, Building2, Bell, Shield, Key, Globe,
    Palette, Save, Camera, Trash2, AlertTriangle
} from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);

    const [profile, setProfile] = useState({
        fullName: "Alex Chen",
        email: "alex@acme.com",
        company: "Acme Inc.",
        industry: "Technology",
        website: "https://acme.com",
        bio: "Compliance lead at Acme Inc.",
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        slackAlerts: false,
        weeklyReports: true,
        marketingEmails: false,
        securityAlerts: true,
        teamActivity: true,
    });

    const [security, setSecurity] = useState({
        twoFactor: false,
        apiKey: "sk_live_xxxxxxxxxxxx",
        lastPasswordChange: "2 months ago",
    });

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "company", label: "Company", icon: Building2 },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "appearance", label: "Appearance", icon: Palette },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-display-3 font-display text-text-primary mb-2">
                    Account Settings
                </h1>
                <p className="text-text-secondary">
                    Manage your profile, preferences, and security
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="lg:w-64 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? "bg-primary/20 text-primary"
                                    : "text-text-tertiary hover:bg-background-tertiary/50 hover:text-text-secondary"
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="glass-card rounded-2xl p-8"
                    >
                        {activeTab === "profile" && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-3xl font-bold text-white">
                                            AC
                                        </div>
                                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-background-tertiary hover:bg-background-secondary rounded-full flex items-center justify-center border-2 border-background-primary transition-colors">
                                            <Camera className="w-4 h-4 text-text-secondary" />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="text-heading-3">Profile Photo</h3>
                                        <p className="text-sm text-text-tertiary">
                                            JPG, PNG or GIF. Max 2MB.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.fullName}
                                            onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                                            className="w-full px-4 py-3 bg-background-tertiary/50 border border-border-medium rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-3 bg-background-tertiary/50 border border-border-medium rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={profile.bio}
                                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                                            className="w-full px-4 py-3 bg-background-tertiary/50 border border-border-medium rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "company" && (
                            <div className="space-y-6">
                                <h3 className="text-heading-3 mb-6">Company Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.company}
                                            onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                                            className="w-full px-4 py-3 bg-background-tertiary/50 border border-border-medium rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Industry
                                        </label>
                                        <select className="w-full px-4 py-3 bg-background-tertiary/50 border border-border-medium rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                                            <option>Technology</option>
                                            <option>Healthcare</option>
                                            <option>Finance</option>
                                            <option>Education</option>
                                            <option>Retail</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Company Website
                                        </label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                                            <input
                                                type="url"
                                                value={profile.website}
                                                onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                                                className="w-full pl-11 pr-4 py-3 bg-background-tertiary/50 border border-border-medium rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="space-y-6">
                                <h3 className="text-heading-3 mb-6">Notification Preferences</h3>
                                <div className="space-y-4">
                                    {[
                                        { key: "emailAlerts", label: "Email Alerts", description: "Get notified about critical compliance issues" },
                                        { key: "slackAlerts", label: "Slack Alerts", description: "Receive notifications in your Slack workspace" },
                                        { key: "weeklyReports", label: "Weekly Reports", description: "Receive a summary of your compliance status" },
                                        { key: "marketingEmails", label: "Marketing Emails", description: "Get updates about new features and offers" },
                                        { key: "securityAlerts", label: "Security Alerts", description: "Get notified about security-related changes" },
                                        { key: "teamActivity", label: "Team Activity", description: "Get notified when team members make changes" },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-background-tertiary/30">
                                            <div>
                                                <p className="font-medium text-text-primary">{item.label}</p>
                                                <p className="text-sm text-text-tertiary">{item.description}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={notifications[item.key as keyof typeof notifications]}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-border-medium peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-6">
                                <h3 className="text-heading-3 mb-6">Security Settings</h3>

                                <div className="p-4 rounded-xl bg-background-tertiary/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-medium text-text-primary">Two-Factor Authentication</p>
                                            <p className="text-sm text-text-tertiary">Add an extra layer of security</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-border-medium peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-background-tertiary/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-medium text-text-primary">API Key</p>
                                            <p className="text-sm text-text-tertiary">For programmatic access</p>
                                        </div>
                                        <button className="px-4 py-2 bg-background-tertiary hover:bg-background-secondary text-text-secondary rounded-lg text-sm transition-all">
                                            Regenerate
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-background-primary rounded-lg">
                                        <Key className="w-4 h-4 text-text-tertiary" />
                                        <code className="text-sm text-text-secondary font-mono">{security.apiKey}</code>
                                        <button className="ml-auto text-primary hover:text-primary-hover text-sm">
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-background-tertiary/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-text-primary">Password</p>
                                            <p className="text-sm text-text-tertiary">Last changed {security.lastPasswordChange}</p>
                                        </div>
                                        <button className="px-4 py-2 bg-background-tertiary hover:bg-background-secondary text-text-secondary rounded-lg text-sm transition-all">
                                            Change Password
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-status-error/10 border border-status-error/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-status-error">Delete Account</p>
                                            <p className="text-sm text-text-tertiary">Permanently delete your account and all data</p>
                                        </div>
                                        <button className="px-4 py-2 bg-status-error/20 hover:bg-status-error/30 text-status-error rounded-lg text-sm font-medium transition-all">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "appearance" && (
                            <div className="space-y-6">
                                <h3 className="text-heading-3 mb-6">Appearance</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-background-tertiary/30">
                                        <div>
                                            <p className="font-medium text-text-primary">Dark Mode</p>
                                            <p className="text-sm text-text-tertiary">Toggle dark/light theme</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-border-medium peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="p-4 rounded-xl bg-background-tertiary/30">
                                        <p className="font-medium text-text-primary mb-4">Accent Color</p>
                                        <div className="flex gap-3">
                                            {["#0ea5e9", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6"].map((color) => (
                                                <button
                                                    key={color}
                                                    className="w-10 h-10 rounded-full border-2 border-transparent hover:border-white transition-all"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-background-tertiary/30">
                                        <p className="font-medium text-text-primary mb-4">Font Size</p>
                                        <div className="flex gap-2">
                                            {["Small", "Medium", "Large"].map((size) => (
                                                <button
                                                    key={size}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${size === "Medium"
                                                            ? "bg-primary/20 text-primary border border-primary/50"
                                                            : "bg-background-primary text-text-tertiary border border-border-medium"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="flex justify-end pt-6 mt-6 border-t border-border-light">
                            <motion.button
                                onClick={handleSave}
                                disabled={isSaving}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all duration-300 shadow-button disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {isSaving ? "Saving..." : "Save Changes"}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}