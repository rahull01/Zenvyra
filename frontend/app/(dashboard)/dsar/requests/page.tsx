"use client";

import React, { useState } from "react";
import { Fingerprint, Clock, Search, ShieldCheck, Download, AlertCircle } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";

const initialRequests = [
  { id: "dsar_req_82f1", email: "james.k@gmail.com", type: "Data Access (GDPR)", date: "May 20, 2026", daysLeft: 27, status: "pending_verify" },
  { id: "dsar_req_901c", email: "hannah.s@outlook.com", type: "Data Deletion (CCPA)", date: "May 14, 2026", daysLeft: 21, status: "processing" },
  { id: "dsar_req_5e11", email: "bruno.m@yahoo.com.br", type: "Revoke Consent (LGPD)", date: "May 02, 2026", daysLeft: 9, status: "completed" },
];

export default function DsarRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAction = (id: string, actionName: string) => {
  };

  const filteredRequests = requests.filter(
    (r) =>
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardPageShell
      title="DSAR Request Log"
      subtitle="Verify client identities, monitor regulatory deadline timers, and export data records."
      icon={Fingerprint}
    >
      {/* Search row */}
      <div className="flex items-center gap-3 bg-background-primary p-3 rounded-2xl border border-border-light mb-6 shadow-card">
        <Search className="h-4.5 w-4.5 text-text-muted shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Filter requests by email or regulation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 text-sm outline-none bg-transparent placeholder-text-muted text-text-primary"
        />
      </div>

      {/* Requests table */}
      <div className="bg-background-primary border border-border-light rounded-3xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background-secondary text-caption font-semibold uppercase tracking-wider text-text-primary border-b border-border-light">
              <tr>
                <th className="px-5 py-4">Requester Email</th>
                <th className="px-5 py-4">Right Invoked</th>
                <th className="px-5 py-4">Compliance SLA</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id} className="border-t border-border-light hover:bg-background-secondary/50">
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text-primary">{req.email}</span>
                      <span className="text-[10px] text-text-muted font-medium mt-0.5">ID: {req.id} • Submitted {req.date}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-text-secondary font-semibold">{req.type}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Clock className={`h-4 w-4 shrink-0 ${req.daysLeft < 10 ? "text-status-error" : "text-text-muted"}`} />
                      <span className={req.daysLeft < 10 ? "text-status-error" : "text-text-secondary"}>
                        {req.daysLeft} days remaining
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.status === "completed"
                          ? "bg-status-success/10 text-status-success"
                          : req.status === "processing"
                          ? "bg-status-info/10 text-status-info"
                          : "bg-status-warning/10 text-status-warning"
                      }`}
                    >
                      {req.status === "completed"
                        ? "Completed"
                        : req.status === "processing"
                        ? "Compiling"
                        : "Verify Identity"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {req.status === "pending_verify" && (
                      <Button
                        onClick={() => handleAction(req.id, "Verify Identity")}
                        className="bg-primary hover:bg-primary-hover text-white text-caption font-bold py-1.5 rounded-xl"
                      >
                        Verify Identity
                      </Button>
                    )}
                    {req.status === "processing" && (
                      <Button
                        onClick={() => handleAction(req.id, "Compile Package")}
                        className="bg-secondary-dark hover:bg-primary text-white text-caption font-bold py-1.5 rounded-xl"
                      >
                        Compile Package
                      </Button>
                    )}
                    {req.status === "completed" && (
                      <Button
                        onClick={() => handleAction(req.id, "Download Receipt")}
                        variant="outline"
                        className="border-border-medium hover:bg-background-secondary text-caption font-bold py-1.5 rounded-xl gap-1"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Audit Receipt
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-text-muted font-medium">
                    No active privacy requests in the log.
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
