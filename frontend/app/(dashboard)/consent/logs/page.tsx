"use client";

import React, { useState } from "react";
import { Cookie, History, Globe, ShieldCheck, Download, Search, Laptop, Smartphone } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const initialLogs = [
  { id: "log_user_7b29a1", token: "uuid_a83f-92bd-1002", necessary: true, analytics: true, functional: true, marketing: false, region: "United States (CA)", device: "desktop", time: "2 mins ago" },
  { id: "log_user_9c18d3", token: "uuid_472b-88a1-3091", necessary: true, analytics: false, functional: true, marketing: false, region: "Germany (BY)", device: "mobile", time: "12 mins ago" },
  { id: "log_user_2f90a2", token: "uuid_bc93-55d2-0941", necessary: true, analytics: true, functional: true, marketing: true, region: "United Kingdom (ENG)", device: "desktop", time: "34 mins ago" },
  { id: "log_user_4e11f0", token: "uuid_d73b-741a-8831", necessary: true, analytics: false, functional: false, marketing: false, region: "Brazil (SP)", device: "mobile", time: "1 hour ago" },
];

export default function ConsentLogsPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");

  const handleExport = () => {
    toast.success("Consent audit logs exported (CSV)!");
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardPageShell
      title="Consent Receipts & Logs"
      subtitle="Cryptographically signed receipts logged automatically for regulatory audit proof."
      icon={History}
      actions={[
        { label: "Export Audit Log", href: "/dashboard/consent/logs", primary: true, onClick: handleExport },
      ]}
    >
      {/* Search Filter row */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-border-light mb-6 shadow-card">
        <Search className="h-4.5 w-4.5 text-text-muted shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Filter logs by User ID or Geolocation region..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 text-sm outline-none bg-transparent placeholder-text-muted text-text-primary"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white border border-border-light rounded-3xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-secondary text-xs font-semibold uppercase tracking-wider text-text-primary border-b border-border-light">
              <tr>
                <th className="px-5 py-4">Telemetry Token ID</th>
                <th className="px-5 py-4">Visitor Region</th>
                <th className="px-5 py-4">Consent Status</th>
                <th className="px-5 py-4">Device</th>
                <th className="px-5 py-4 text-right">Logged Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-t border-bg-tertiary hover:bg-bg-secondary/50">
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text-primary">{log.id}</span>
                      <span className="text-[10px] font-mono text-text-muted">{log.token}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 font-medium text-text-secondary">
                      <Globe className="h-4 w-4 text-brand-orange shrink-0" />
                      {log.region}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-success-light text-success text-[10px] font-bold uppercase">Necessary</span>
                      {log.analytics && <span className="px-2 py-0.5 rounded bg-brand-orange-light text-brand-orange text-[10px] font-bold uppercase">Analytics</span>}
                      {log.functional && <span className="px-2 py-0.5 rounded bg-info-light text-info text-[10px] font-bold uppercase">Functional</span>}
                      {log.marketing && <span className="px-2 py-0.5 rounded bg-error-light text-error text-[10px] font-bold uppercase">Marketing</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {log.device === "desktop" ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold"><Laptop className="h-4 w-4 text-text-muted" /> Desktop</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold"><Smartphone className="h-4 w-4 text-text-muted" /> Mobile</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right text-xs font-bold text-text-muted">
                    {log.time}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-text-muted font-medium">
                    No matching compliance logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardPageShell>
  );
}
