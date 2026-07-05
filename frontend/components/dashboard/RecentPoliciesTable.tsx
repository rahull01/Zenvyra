"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, FileEdit, Loader2, MoreHorizontal } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type Policy = {
  id: string;
  title?: string;
  name?: string;
  type?: string;
  websiteId?: string;
  status?: string;
  updatedAt?: string;
};

const statusStyles: Record<string, string> = {
  published: "bg-status-success/10 text-status-success border-status-success/20",
  draft: "bg-status-warning/10 text-status-warning border-status-warning/20",
  draft_ready: "bg-status-warning/10 text-status-warning border-status-warning/20",
  archived: "bg-status-error/10 text-status-error border-status-error/20",
};

export const RecentPoliciesTable = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get<Policy[]>("/policies")
      .then((response) => {
        if (mounted) setPolicies(response.data || []);
      })
      .catch(() => {
        if (mounted) setPolicies([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-border-light bg-background-primary shadow-card">
      <div className="flex items-center justify-between border-b border-border-light p-6">
        <h3 className="text-lg font-bold text-text-primary">Recent Policies</h3>
        <Link href="/policies" className="text-sm font-bold text-primary hover:underline">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">
            <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
            Loading policies...
          </div>
        ) : policies.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-secondary">No policies yet.</div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-background-secondary/50">
                <th className="px-6 py-4 text-caption font-bold uppercase tracking-wider text-text-tertiary">Policy Name</th>
                <th className="px-6 py-4 text-caption font-bold uppercase tracking-wider text-text-tertiary">Type</th>
                <th className="px-6 py-4 text-caption font-bold uppercase tracking-wider text-text-tertiary">Website</th>
                <th className="px-6 py-4 text-caption font-bold uppercase tracking-wider text-text-tertiary">Status</th>
                <th className="px-6 py-4 text-right text-caption font-bold uppercase tracking-wider text-text-tertiary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {policies.slice(0, 5).map((policy) => {
                const status = policy.status || "draft";
                return (
                  <tr key={policy.id} className="group transition-colors hover:bg-background-secondary/50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-text-primary">{policy.title || policy.name || policy.type || "Policy"}</span>
                        <span className="text-xs text-text-tertiary">Updated {formatRelative(policy.updatedAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{policy.type || "privacy"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                        <span className="max-w-[120px] truncate">{policy.websiteId || "Account-wide"}</span>
                        <ExternalLink className="h-3 w-3 text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-caption font-bold", statusStyles[status] || "bg-background-tertiary text-text-secondary border-border-light")}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Link href={`/policies/${policy.id}`} className="rounded-lg p-2 text-text-tertiary transition-all hover:bg-primary-light hover:text-primary">
                          <FileEdit className="h-4 w-4" />
                        </Link>
                        <Link href={`/policies/${policy.id}/preview`} className="rounded-lg p-2 text-text-tertiary transition-all hover:bg-background-secondary">
                          <MoreHorizontal className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

function formatRelative(value?: string) {
  if (!value) return "recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
}
