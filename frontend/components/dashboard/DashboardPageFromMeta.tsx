"use client";

import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { DASHBOARD_PAGE_META } from "@/lib/dashboard-pages";
import { ICONS } from "@/lib/icons";

export default function DashboardPageFromMeta({ pageKey }: { pageKey: string }) {
  const meta = DASHBOARD_PAGE_META[pageKey];
  if (!meta) return null;
  const Icon = ICONS[meta.iconName];

  return (
    <DashboardPageShell
      title={meta.title}
      subtitle={meta.subtitle}
      icon={Icon}
      actions={meta.actions}
      stats={meta.stats}
    />
  );
}
