import { Sidebar } from "@/components/layout/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login"); 
  }

  return (
  <div className="flex min-h-screen bg-background text-foreground">
    <Sidebar user={session.user} />

    <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
      <div className="mx-auto max-w-7xl p-6 lg:p-10">
        {children}
      </div>
    </main>
  </div>
);
}