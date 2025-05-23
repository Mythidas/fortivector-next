'use server'

import AppNavbar from "@/lib/components/ux/app-navbar";
import AppSidebar from "@/lib/components/ux/app-sidebar";
import { SidebarProvider } from "@/lib/components/ui/sidebar";
import { UserProvider } from "@/lib/providers/user-provider";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex size-full">
        <AppSidebar />
        <div className="flex flex-col size-full">
          <AppNavbar />
          <UserProvider>
            <div className="flex size-full flex-col p-6 overflow-x-hidden overflow-y-auto">
              {children}
            </div>
          </UserProvider>
        </div>
      </div>
    </SidebarProvider>
  );
}