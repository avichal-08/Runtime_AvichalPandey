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
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-zinc-800 bg-zinc-950/50 backdrop-blur-xl md:block">
        <Sidebar user={session.user} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72">
        <div className="mx-auto max-w-7xl p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}