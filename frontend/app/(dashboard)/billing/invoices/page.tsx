"use client";

import React from "react";
import { CreditCard, ArrowLeft, Download, CheckCircle, ExternalLink } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const invoices = [
  { id: "INV-2026-005", date: "May 01, 2026", desc: "Enterprise Plan - Monthly", amount: "$499.00", status: "Paid" },
  { id: "INV-2026-004", date: "Apr 01, 2026", desc: "Enterprise Plan - Monthly", amount: "$499.00", status: "Paid" },
  { id: "INV-2026-003", date: "Mar 01, 2026", desc: "Enterprise Plan - Monthly", amount: "$499.00", status: "Paid" },
  { id: "INV-2026-002", date: "Feb 01, 2026", desc: "Enterprise Plan - Monthly", amount: "$499.00", status: "Paid" },
];

export default function InvoicesPage() {
  const handleDownload = (id: string) => {
    // Handle download
  };

  return (
    <DashboardPageShell
      title="Invoice Statements"
      subtitle="View payment transactions, subscription billing intervals, and download PDF receipts."
      icon={CreditCard}
    >
      <div className="mb-6">
        <Link
          href="/billing"
          className="inline-flex items-center gap-2 text-caption font-bold text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Billing Profile
        </Link>
      </div>

      {/* Invoices table card */}
      <div className="bg-background-primary border border-border-light rounded-3xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background-secondary text-caption font-semibold uppercase tracking-wider text-text-primary border-b border-border-light">
              <tr>
                <th className="px-5 py-4">Invoice Reference</th>
                <th className="px-5 py-4">Billing Date</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">Amount Charged</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">PDF Download</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-border-light hover:bg-background-secondary/50">
                  <td className="px-5 py-4 font-bold text-text-primary">
                    {inv.id}
                  </td>
                  <td className="px-5 py-4 text-text-secondary font-medium">
                    {inv.date}
                  </td>
                  <td className="px-5 py-4 text-text-secondary font-semibold">
                    {inv.desc}
                  </td>
                  <td className="px-5 py-4 font-extrabold text-text-primary">
                    {inv.amount}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-caption font-bold text-status-success bg-status-success/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      onClick={() => handleDownload(inv.id)}
                      variant="outline"
                      className="border-border-medium hover:bg-background-secondary text-caption font-bold py-1.5 rounded-xl gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardPageShell>
  );
}
