"use client";

import { usePathname } from "next/navigation";
import ZenvyraNav from "@/components/zenvyra/ZenvyraNav";

const DASHBOARD_PREFIXES = new Set([
  "/dashboard",
  "/scan",
  "/websites",
  "/policies",
  "/competitors",
  "/team",
  "/settings",
  "/billing",
]);

export default function GlobalHeader() {
  const pathname = usePathname();
  const firstSegment = pathname.split("/")[1];
  const isDashboardRoute = DASHBOARD_PREFIXES.has(`/${firstSegment}`);

  if (isDashboardRoute) return null;

  return <ZenvyraNav />;
}
