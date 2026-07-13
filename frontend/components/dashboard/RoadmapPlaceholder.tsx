"use client";

import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export type RoadmapPlaceholderProps = {
  description?: string;
};

export default function RoadmapPlaceholder({ description }: RoadmapPlaceholderProps) {
  return (
    <div className="standard-card hover:!translate-y-0">
      <div className="flex flex-col items-center gap-4 py-8 text-center sm:py-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
          <Construction className="h-7 w-7 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">Coming soon</h3>
          <p className="mt-2 max-w-md text-sm text-text-secondary">
            {description ||
              "This workspace is on the roadmap. Use the AI Act, Scanner, Websites, and Policies workflows that are live today."}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="btn-secondary inline-flex !px-5 !py-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
