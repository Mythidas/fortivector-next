import ModeToggle from "@/components/mode-toggle";
import HeaderAuth from "@/components/header-auth";
import { SidebarTrigger } from "./ui/sidebar";

export default function AppNavbar() {
  return (
    <header className="flex h-14 z-50 w-full border-b border-border shadow">
      <div className="flex w-full h-14 px-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="flex md:hidden" />
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}