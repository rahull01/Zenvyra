"use client";

import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export type DashboardActionItem = {
  label: string;
  href: string;
  primary?: boolean;
  onClick?: () => void;
};

export type DashboardPageShellProps = {
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  actions?: DashboardActionItem[];
  stats?: { label: string; value: string; trend?: string }[];
};

export default function DashboardPageShell({
  title,
  subtitle,
  icon: Icon,
  children,
  actions = [],
  stats = [],
}: DashboardPageShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-light">
              <Icon className="h-6 w-6 text-accent" aria-hidden />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
          </div>
        </div>
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {actions.map((action) =>
              action.onClick ? (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className={action.primary ? "btn-primary !py-2.5 !px-5 text-sm" : "btn-secondary !py-2.5 !px-5 text-sm"}
                >
                  {action.label}
                  {action.primary && <ArrowRight className="h-4 w-4" />}
                </button>
              ) : (
                <Link
                  key={action.href}
                  href={action.href}
                  className={action.primary ? "btn-primary !py-2.5 !px-5 text-sm" : "btn-secondary !py-2.5 !px-5 text-sm"}
                >
                  {action.label}
                  {action.primary && <ArrowRight className="h-4 w-4" />}
                </Link>
              )
            )}
          </div>
        )}
      </div>

      {stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="standard-card !p-5 hover:!translate-y-0">
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
              {stat.trend && (
                <p className="mt-2 text-xs font-semibold text-success">{stat.trend}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {children ?? (
        <div className="standard-card">
          <p className="text-sm text-text-secondary">
            This workspace is ready. Connect your website or run a scan to populate live data.
          </p>
        </div>
      )}
    </div>
  );
}
