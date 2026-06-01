import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-primary">
      <Sidebar />
      <main className="pl-[260px]">
        <TopBar />
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}