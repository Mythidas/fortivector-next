import AppNavbar from "@/components/app-navbar";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
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