"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus, Users, Mail, Shield, Crown, User, Trash2,
    MoreVertical, CheckCircle, XCircle, Search
} from "lucide-react";

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: "owner" | "admin" | "member" | "viewer";
    avatar: string;
    status: "active" | "pending" | "inactive";
    lastActive: string;
}

const mockTeam: TeamMember[] = [
    {
        id: "1",
        name: "Alex Chen",
        email: "alex@acme.com",
        role: "owner",
        avatar: "AC",
        status: "active",
        lastActive: "Just now",
    },
    {
        id: "2",
        name: "Sarah Miller",
        email: "sarah@acme.com",
        role: "admin",
        avatar: "SM",
        status: "active",
        lastActive: "5 min ago",
    },
    {
        id: "3",
        name: "James Wilson",
        email: "james@acme.com",
        role: "member",
        avatar: "JW",
        status: "active",
        lastActive: "2 hours ago",
    },
    {
        id: "4",
        name: "Emily Davis",
        email: "emily@acme.com",
        role: "viewer",
        avatar: "ED",
        status: "pending",
        lastActive: "Invitation sent",
    },
];

const rolePermissions = {
    owner: ["Full access", "Billing", "Team management", "Delete account"],
    admin: ["All features", "Team management", "No billing"],
    member: ["Scan & monitor", "View reports", "No team management"],
    viewer: ["View only", "No actions", "Read-only access"],
};

export default function TeamPage() {
    const [team, setTeam] = useState<TeamMember[]>(mockTeam);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"admin" | "member" | "viewer">("member");
    const [searchQuery, setSearchQuery] = useState("");

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;

        const newMember: TeamMember = {
            id: Date.now().toString(),
            name: inviteEmail.split("@")[0],
            email: inviteEmail,
            role: inviteRole,
            avatar: inviteEmail.substring(0, 2).toUpperCase(),
            status: "pending",
            lastActive: "Invitation sent",
        };

        setTeam(prev => [...prev, newMember]);
        setShowInviteModal(false);
        setInviteEmail("");
    };

    const handleRemove = (id: string) => {
        setTeam(prev => prev.filter(m => m.id !== id));
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "owner": return <Crown className="w-4 h-4 text-yellow-400" />;
            case "admin": return <Shield className="w-4 h-4 text-primary" />;
            case "member": return <User className="w-4 h-4 text-status-success" />;
            default: return <User className="w-4 h-4 text-text-tertiary" />;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "owner": return "bg-yellow-500/20 text-yellow-400";
            case "admin": return "bg-primary/20 text-primary";
            case "member": return "bg-status-success/20 text-status-success";
            default: return "bg-background-tertiary text-text-tertiary";
        }
    };

    const filteredTeam = team.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-display-3 font-display text-text-primary mb-2">
                        Team Management
                    </h1>
                    <p className="text-text-secondary">
                        Manage team members and their permissions
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all duration-300 shadow-button"
                >
                    <Plus className="w-5 h-5" />
                    Invite Member
                </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Members", value: team.length, icon: Users },
                    { label: "Active", value: team.filter(m => m.status === "active").length, icon: CheckCircle },
                    { label: "Pending", value: team.filter(m => m.status === "pending").length, icon: Mail },
                    { label: "Seats Available", value: "2/5", icon: Shield },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <stat.icon className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-text-primary mb-1">{stat.value}</p>
                        <p className="text-sm text-text-tertiary">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search team members..."
                    className="w-full pl-12 pr-4 py-3 bg-background-tertiary/60 border border-border-medium rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
            </div>

            {/* Team List */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-background-tertiary/50">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-medium text-text-tertiary">Member</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-text-tertiary">Role</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-text-tertiary">Status</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-text-tertiary">Last Active</th>
                            <th className="text-right px-6 py-4 text-sm font-medium text-text-tertiary">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                        {filteredTeam.map((member, index) => (
                            <motion.tr
                                key={member.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-background-tertiary/30 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-bold text-sm">
                                            {member.avatar}
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-primary">{member.name}</p>
                                            <p className="text-sm text-text-tertiary">{member.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-medium ${getRoleColor(member.role)}`}>
                                        {getRoleIcon(member.role)}
                                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-medium ${member.status === "active"
                                            ? "bg-status-success/20 text-status-success"
                                            : member.status === "pending"
                                                ? "bg-status-warning/20 text-status-warning"
                                                : "bg-background-tertiary text-text-tertiary"
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === "active" ? "bg-status-success animate-pulse" :
                                                member.status === "pending" ? "bg-status-warning" :
                                                    "bg-text-tertiary"
                                            }`} />
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-text-tertiary">
                                    {member.lastActive}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                                            <Mail className="w-4 h-4 text-text-tertiary" />
                                        </button>
                                        {member.role !== "owner" && (
                                            <button
                                                onClick={() => handleRemove(member.id)}
                                                className="p-2 hover:bg-status-error/20 rounded-lg transition-colors group"
                                            >
                                                <Trash2 className="w-4 h-4 text-text-tertiary group-hover:text-status-error transition-colors" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Role Permissions Info */}
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-heading-3 mb-6">Role Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(rolePermissions).map(([role, permissions]) => (
                        <div key={role} className="p-4 rounded-xl bg-background-tertiary/30">
                            <div className="flex items-center gap-2 mb-4">
                                {getRoleIcon(role)}
                                <span className="font-semibold text-text-primary capitalize">{role}</span>
                            </div>
                            <ul className="space-y-2">
                                {permissions.map((perm, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                                        <CheckCircle className="w-3 h-3 text-status-success flex-shrink-0" />
                                        {perm}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-2xl p-8 w-full max-w-md"
                    >
                        <h2 className="text-heading-2 mb-4">Invite Team Member</h2>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="colleague@company.com"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-background-tertiary/50 border border-border-medium rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Role
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(["admin", "member", "viewer"] as const).map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setInviteRole(role)}
                                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${inviteRole === role
                                                    ? "bg-primary/20 text-primary border border-primary/50"
                                                    : "bg-background-tertiary/50 text-text-tertiary border border-border-medium hover:bg-background-tertiary"
                                                }`}
                                        >
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="flex-1 py-3 bg-background-tertiary hover:bg-background-secondary text-text-secondary font-semibold rounded-xl transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all duration-300 shadow-button"
                                >
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}