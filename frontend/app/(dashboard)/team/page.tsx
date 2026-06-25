"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Mail, Plus, Search, Shield, Trash2, User, Users } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

type TeamMember = {
  userId: string;
  email: string;
  role: string;
  joinedAt?: string;
  permissions?: string[];
};

type Team = {
  id: string;
  name?: string;
  ownerId: string;
  members?: TeamMember[];
  createdAt?: string;
};

const rolePermissions = {
  admin: ["All features", "Team management", "No billing"],
  member: ["Scan and monitor", "View reports"],
  viewer: ["View only", "Read-only access"],
};

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member" | "viewer">("member");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);

  const loadTeams = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<Team[]>("/team");
      setTeams(response.data || []);
      setSelectedTeamId((current) => current || response.data?.[0]?.id || "");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to load teams");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const selectedTeam = teams.find((team) => team.id === selectedTeamId) || teams[0] || null;
  const members = useMemo(() => selectedTeam?.members || [], [selectedTeam]);
  const filteredMembers = useMemo(
    () => members.filter((member) => member.email.toLowerCase().includes(searchQuery.toLowerCase())),
    [members, searchQuery],
  );

  const createTeam = async () => {
    try {
      const response = await api.post<Team>("/team", { name: "Compliance Team" });
      setTeams((previous) => [response.data, ...previous]);
      setSelectedTeamId(response.data.id);
      toast.success("Team created.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to create team");
    }
  };

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inviteEmail || !selectedTeam) return;

    setInviting(true);
    try {
      const response = await api.post<Team>(
        `/team/${selectedTeam.id}/members?email=${encodeURIComponent(inviteEmail)}&role=${encodeURIComponent(inviteRole)}`,
      );
      setTeams((previous) => previous.map((team) => (team.id === response.data.id ? response.data : team)));
      setShowInviteModal(false);
      setInviteEmail("");
      toast.success("Member added.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to add member");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!selectedTeam) return;
    try {
      await api.delete(`/team/${selectedTeam.id}/members/${encodeURIComponent(memberId)}`);
      await loadTeams();
      toast.success("Member removed.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to remove member");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-3 font-display text-text-primary mb-2">Team Management</h1>
          <p className="text-text-secondary">Manage persisted teams and registered team members.</p>
        </div>
        <div className="flex gap-3">
          {teams.length === 0 && (
            <button onClick={createTeam} className="flex items-center gap-2 rounded-xl bg-background-secondary px-6 py-3 font-semibold text-text-primary">
              <Users className="h-5 w-5" />
              Create Team
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInviteModal(true)}
            disabled={!selectedTeam}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-button transition hover:bg-primary-hover disabled:opacity-60"
          >
            <Plus className="h-5 w-5" />
            Add Member
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border-light bg-surface-card p-10 text-center text-text-secondary">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading team...
        </div>
      ) : teams.length === 0 ? (
        <div className="rounded-2xl border border-border-light bg-surface-card p-10 text-center">
          <Users className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-2xl font-bold text-text-primary">No team yet</h2>
          <p className="mt-2 text-sm text-text-secondary">Create a team to collaborate on websites and policies.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {[
              { label: "Teams", value: teams.length, icon: Users },
              { label: "Members", value: members.length, icon: User },
              { label: "Admins", value: members.filter((member) => member.role === "admin").length, icon: Shield },
              { label: "Active", value: members.length, icon: CheckCircle },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-border-light bg-surface-card p-6 shadow-card"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mb-1 text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-sm text-text-tertiary">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <select
              value={selectedTeam?.id || ""}
              onChange={(event) => setSelectedTeamId(event.target.value)}
              className="rounded-xl border border-border-medium bg-background-tertiary/60 px-4 py-3 text-text-primary"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name || "Compliance Team"}</option>
              ))}
            </select>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search team members..."
                className="w-full rounded-xl border border-border-medium bg-background-tertiary/60 py-3 pl-12 pr-4 text-text-primary placeholder-text-muted transition focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border-light bg-surface-card shadow-card">
            <table className="w-full">
              <thead className="bg-background-tertiary/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-tertiary">Member</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-tertiary">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-tertiary">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-text-tertiary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredMembers.map((member, index) => (
                  <motion.tr
                    key={member.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="transition-colors hover:bg-background-tertiary/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                          {member.email.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{member.email}</p>
                          <p className="text-sm text-text-tertiary">{member.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-medium ${roleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-tertiary">{formatDate(member.joinedAt)}</td>
                    <td className="px-6 py-4 text-right">
                      {member.role !== "admin" && (
                        <button onClick={() => handleRemove(member.userId)} className="rounded-lg p-2 transition-colors hover:bg-status-error/20">
                          <Trash2 className="h-4 w-4 text-text-tertiary hover:text-status-error" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-border-light bg-surface-card p-6 shadow-card">
            <h3 className="mb-6 text-heading-3">Role Permissions</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {Object.entries(rolePermissions).map(([role, permissions]) => (
                <div key={role} className="rounded-xl bg-background-tertiary/30 p-4">
                  <span className="font-semibold capitalize text-text-primary">{role}</span>
                  <ul className="mt-4 space-y-2">
                    {permissions.map((permission) => (
                      <li key={permission} className="flex items-center gap-2 text-sm text-text-secondary">
                        <CheckCircle className="h-3 w-3 flex-shrink-0 text-status-success" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {showInviteModal && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl border border-border-light bg-surface-card p-8 shadow-card">
            <h2 className="mb-4 text-heading-2">Add Team Member</h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder="colleague@company.com"
                    required
                    className="w-full rounded-xl border border-border-medium bg-background-tertiary/50 py-3 pl-11 pr-4 text-text-primary placeholder-text-muted"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["admin", "member", "viewer"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setInviteRole(role)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                        inviteRole === role ? "border-primary/50 bg-primary/20 text-primary" : "border-border-medium bg-background-tertiary/50 text-text-tertiary"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 rounded-xl bg-background-tertiary py-3 font-semibold text-text-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={inviting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-60">
                  {inviting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Add
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function roleColor(role: string) {
  if (role === "admin") return "bg-primary/20 text-primary";
  if (role === "member") return "bg-status-success/20 text-status-success";
  return "bg-background-tertiary text-text-tertiary";
}

function formatDate(value?: string) {
  if (!value) return "unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}
