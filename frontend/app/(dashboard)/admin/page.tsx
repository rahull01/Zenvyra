"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Database,
  Globe,
  Loader2,
  Mail,
  Monitor,
  RefreshCw,
  ShieldCheck,
  Users,
  Webhook,
  Wrench,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import api from "@/lib/api";

type OpsOverview = {
  totalUsers: number;
  activeUsers: number;
  agencyAccounts: number;
  totalWebsites: number;
  monitoredWebsites: number;
  averageScore: number;
  openIssues: number;
  pendingDsars: number;
  activeSubscriptions: number;
  monthlyRecurringRevenueEstimate: number;
  failedWebhookCount: number;
  recentScanCount: number;
  systemHealthStates: Record<string, any>[];
  highRiskAccounts: Record<string, any>[];
  launchChecklist: Record<string, any>[];
};

type OpsTable = {
  name: string;
  total: number;
  items: Record<string, any>[];
};

const emptyTable: OpsTable = { name: "", total: 0, items: [] };

export default function AdminOpsPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OpsOverview | null>(null);
  const [tables, setTables] = useState<Record<string, OpsTable>>({});
  const [updatingTask, setUpdatingTask] = useState("");

  const loadAdmin = async () => {
    setLoading(true);
    try {
      const [overviewResult, users, websites, subscriptions, webhooks, emails, monitoring, scans, backups, setupTasks] = await Promise.all([
        api.get<OpsOverview>("/admin/ops/overview"),
        api.get<OpsTable>("/admin/ops/users"),
        api.get<OpsTable>("/admin/ops/websites"),
        api.get<OpsTable>("/admin/ops/subscriptions"),
        api.get<OpsTable>("/admin/ops/webhooks"),
        api.get<OpsTable>("/admin/ops/emails"),
        api.get<OpsTable>("/admin/ops/monitoring"),
        api.get<OpsTable>("/admin/ops/scans"),
        api.get<OpsTable>("/admin/ops/backups"),
        api.get<OpsTable>("/admin/ops/setup-tasks"),
      ]);
      setOverview(overviewResult.data);
      setTables({
        users: users.data,
        websites: websites.data,
        subscriptions: subscriptions.data,
        webhooks: webhooks.data,
        emails: emails.data,
        monitoring: monitoring.data,
        scans: scans.data,
        backups: backups.data,
        setupTasks: setupTasks.data,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to load admin operations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  const updateSetupTask = async (id: string, setupStatus: string) => {
    setUpdatingTask(id);
    try {
      await api.patch(`/admin/ops/setup-tasks/${id}`, { setupStatus });
      toast.success("Setup task updated.");
      await loadAdmin();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to update setup task");
    } finally {
      setUpdatingTask("");
    }
  };

  const kpis = useMemo(
    () => [
      { label: "Users", value: String(overview?.totalUsers || 0), icon: Users },
      { label: "Websites", value: `${overview?.monitoredWebsites || 0}/${overview?.totalWebsites || 0}`, icon: Globe },
      { label: "MRR estimate", value: money(overview?.monthlyRecurringRevenueEstimate || 0), icon: CreditCard },
      { label: "Avg score", value: `${Math.round(overview?.averageScore || 0)}/100`, icon: ShieldCheck },
    ],
    [overview],
  );

  return (
    <DashboardPageShell
      title="Admin Ops"
      subtitle="Founder control room for revenue, users, monitoring, webhooks, email, backups, and launch readiness."
      icon={Monitor}
      actions={[
        { label: "Refresh", href: "#", onClick: loadAdmin },
        { label: "Open runbook", href: "/docs/ops/production-launch", primary: true },
      ]}
    >
      {loading ? (
        <div className="standard-card text-center text-text-secondary">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading admin operations...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="standard-card !p-5 hover:!translate-y-0">
                <kpi.icon className="h-5 w-5 text-accent" />
                <p className="mt-4 text-sm font-semibold text-text-secondary">{kpi.label}</p>
                <p className="mt-1 text-2xl font-bold text-text-primary">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Panel title="Launch Health" icon={CheckCircle2}>
              <div className="divide-y divide-border-light">
                {(overview?.systemHealthStates || []).map((item) => (
                  <StatusRow key={item.label} label={item.label} detail={item.detail} status={item.status} />
                ))}
                {(overview?.launchChecklist || []).map((item) => (
                  <StatusRow key={item.label} label={item.label} detail="Required before advanced direct launch." status={item.status} />
                ))}
              </div>
            </Panel>

            <Panel title="Revenue and Subscriptions" icon={CreditCard}>
              <MetricGrid
                rows={[
                  ["Active subscriptions", overview?.activeSubscriptions || 0],
                  ["Agency accounts", overview?.agencyAccounts || 0],
                  ["Failed webhooks", overview?.failedWebhookCount || 0],
                  ["Recent scans", overview?.recentScanCount || 0],
                ]}
              />
              <CompactTable rows={(tables.subscriptions || emptyTable).items.slice(0, 5)} columns={["plan", "status", "amount"]} />
            </Panel>
          </div>

          <Panel title="Done-for-You Setup Tasks" icon={Wrench}>
            <SetupTaskTable
              rows={(tables.setupTasks || emptyTable).items}
              updatingTask={updatingTask}
              onUpdate={updateSetupTask}
            />
          </Panel>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Users and Agency Accounts" icon={Users}>
              <CompactTable rows={(tables.users || emptyTable).items.slice(0, 8)} columns={["email", "accountType", "status", "plan"]} />
            </Panel>
            <Panel title="Websites and Monitoring" icon={Globe}>
              <CompactTable rows={(tables.websites || emptyTable).items.slice(0, 8)} columns={["url", "score", "monitoringEnabled", "openIssues"]} />
            </Panel>
            <Panel title="Failed Webhooks" icon={Webhook}>
              <CompactTable rows={(tables.webhooks || emptyTable).items.filter((row) => row.status === "failed").slice(0, 8)} columns={["event", "status", "retryCount", "nextRetryAt", "lastError"]} />
            </Panel>
            <Panel title="Email Delivery Status" icon={Mail}>
              <CompactTable rows={(tables.emails || emptyTable).items.slice(0, 8)} columns={["title", "type", "priority", "createdAt"]} />
            </Panel>
            <Panel title="Monitoring Alerts" icon={AlertTriangle}>
              <CompactTable rows={(tables.monitoring || emptyTable).items.slice(0, 8)} columns={["url", "severity", "owner", "status"]} />
            </Panel>
            <Panel title="Recent Scan Operations" icon={RefreshCw}>
              <CompactTable rows={(tables.scans || emptyTable).items.slice(0, 8)} columns={["url", "status", "score", "issuesCount", "scannedAt"]} />
            </Panel>
            <Panel title="Backup Status" icon={Database}>
              <CompactTable rows={(tables.backups || emptyTable).items} columns={["name", "status", "detail"]} />
            </Panel>
          </div>

          <Panel title="High-Risk Accounts" icon={AlertTriangle}>
            <CompactTable rows={overview?.highRiskAccounts || []} columns={["url", "score", "openIssues", "websiteId"]} />
          </Panel>
        </div>
      )}
    </DashboardPageShell>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <section className="standard-card !p-0 hover:!translate-y-0">
      <div className="flex items-center gap-2 border-b border-border-light p-5">
        <Icon className="h-5 w-5 text-accent" />
        <h2 className="font-bold text-text-primary">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function StatusRow({ label, detail, status }: { label: string; detail?: string; status?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="font-semibold text-text-primary">{label}</p>
        <p className="mt-1 text-sm text-text-secondary">{detail}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusClass(status)}`}>{status || "review"}</span>
    </div>
  );
}

function MetricGrid({ rows }: { rows: [string, string | number][] }) {
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-border-light bg-background-secondary p-3">
          <p className="text-xs font-semibold text-text-secondary">{label}</p>
          <p className="mt-1 text-xl font-bold text-text-primary">{value}</p>
        </div>
      ))}
    </div>
  );
}

function CompactTable({ rows, columns }: { rows: Record<string, any>[]; columns: string[] }) {
  if (rows.length === 0) return <p className="text-sm text-text-secondary">No records to show.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-text-tertiary">
          <tr>{columns.map((column) => <th key={column} className="pb-2 pr-4">{column}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {rows.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((column) => (
                <td key={column} className="max-w-[260px] truncate py-3 pr-4 text-text-secondary">
                  {formatCell(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const setupStatusOptions = [
  "READY_FOR_OPERATOR",
  "SCAN_RUNNING",
  "REPORT_BUILDING",
  "HANDOFF_READY",
  "INSTALL_PENDING",
  "VERIFIED",
];

function SetupTaskTable({
  rows,
  updatingTask,
  onUpdate,
}: {
  rows: Record<string, any>[];
  updatingTask: string;
  onUpdate: (id: string, status: string) => void;
}) {
  if (rows.length === 0) return <p className="text-sm text-text-secondary">No setup package tasks yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-text-tertiary">
          <tr>
            {["website", "payment", "setup", "platform", "action", "report"].map((column) => (
              <th key={column} className="pb-2 pr-4">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="max-w-[260px] truncate py-3 pr-4 text-text-secondary">{row.websiteUrl || "-"}</td>
              <td className="py-3 pr-4">
                <span className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${statusClass(row.paymentStatus === "PAID" ? "ok" : "required")}`}>
                  {String(row.paymentStatus || "PENDING").replaceAll("_", " ")}
                </span>
              </td>
              <td className="py-3 pr-4 text-text-secondary">{String(row.setupStatus || "-").replaceAll("_", " ")}</td>
              <td className="py-3 pr-4 text-text-secondary">{row.platform || "-"}</td>
              <td className="py-3 pr-4">
                <select
                  value={row.setupStatus || "READY_FOR_OPERATOR"}
                  disabled={updatingTask === row.id}
                  onChange={(event) => onUpdate(String(row.id), event.target.value)}
                  className="rounded-lg border border-border-light bg-background-secondary px-3 py-2 text-xs font-semibold text-text-primary"
                >
                  {setupStatusOptions.map((status) => (
                    <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
                  ))}
                </select>
              </td>
              <td className="py-3 pr-4">
                {row.websiteId ? (
                  <Link href={`/dashboard/websites/${row.websiteId}/proof-report`} className="text-xs font-bold text-accent hover:underline">
                    Open report
                  </Link>
                ) : (
                  <span className="text-xs text-text-tertiary">No website</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function statusClass(status?: string) {
  if (status === "ok" || status === "ready") return "bg-status-success/10 text-status-success";
  if (status === "blocked" || status === "required") return "bg-status-error/10 text-status-error";
  return "bg-status-warning/10 text-status-warning";
}

function formatCell(value: any) {
  if (value == null) return "-";
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (typeof value === "number") return String(value);
  return String(value);
}

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}
