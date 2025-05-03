'use server'

import AppNavbar from "@/components/app-navbar";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/sign-in");
  } else {
    supabase.auth.refreshSession();
  }

  return (
    <SidebarProvider>
      <div className="flex size-full">
        <AppSidebar />
        <div className="flex flex-col size-full">
          <AppNavbar />
          <div className="flex size-full flex-col p-4">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}