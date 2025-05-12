'use client';

import { Building2, ChartArea, FolderCog, ShieldUser } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/lib/components/ui/sidebar"
import { usePathname } from 'next/navigation';

const applicationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: ChartArea,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Building2
  },
]

const adminItems = [
  {
    title: "Systems",
    url: "/systems",
    icon: FolderCog
  },
  {
    title: "Users",
    url: "/users",
    icon: ShieldUser,
  }
]

export default function AppSidebar() {
  const pathname = usePathname(); // always safe

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="p-2">Fortivector</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {applicationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === '/' ? pathname === '/' : pathname.includes(item.url)}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Backend</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === '/' ? pathname === '/' : pathname.includes(item.url)}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
