'use server'

import AppNavbar from "@/lib/components/app-navbar";
import AppSidebar from "@/lib/components/app-sidebar";
import { SidebarProvider } from "@/lib/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider>
      <div className="flex size-full">
        <AppSidebar />
        <div className="flex flex-col size-full">
          <AppNavbar />
          <div className="flex size-full flex-col p-6 overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}