"use client";

import Navigation from "@/components/marketing/Navigation";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background-primary">
      <Navigation />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
