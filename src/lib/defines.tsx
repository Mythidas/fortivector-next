import { InfoIcon, ShieldIcon, LayoutDashboardIcon, UsersIcon, HelpCircle } from "lucide-react";

// ROLES
export const permissionCategories = [
  {
    id: "user-management",
    name: "User Management",
    icon: <UsersIcon className="h-4 w-4 mr-2" />,
    permissions: [
      { id: "user_access", name: "User Accounts", description: "Access to user accounts" },
      // Add more user management permissions here
    ]
  },
  {
    id: "role-management",
    name: "Role Management",
    icon: <ShieldIcon className="h-4 w-4 mr-2" />,
    permissions: [
      { id: "role_access", name: "Role Configuration", description: "Access to role settings" },
      // Add more role management permissions here
    ]
  },
  {
    id: "dashboard-access",
    name: "Dashboard Access",
    icon: <LayoutDashboardIcon className="h-4 w-4 mr-2" />,
    permissions: [
      { id: "dashboard_access", name: "Analytics Dashboard", description: "Access to analytics" },
      // Add more dashboard permissions here
    ]
  },
  // You can add more categories here as needed
];

export const accessLevels = [
  { value: "none", label: "None" },
  { value: "read", label: "Read" },
  { value: "edit", label: "Edit" },
  { value: "full", label: "Full" },
];