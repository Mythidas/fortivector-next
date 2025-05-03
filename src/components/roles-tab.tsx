'use client';

import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoreHorizontal, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RouteButton from "@/components/route-button";
import { Badge } from "@/components/ui/badge";
import { Roles, Users } from "@/lib/schema/database";
import { useState } from "react";

export default function RolesTab({ users, roles }: { users: Users[], roles: Roles[] }) {
  const [search, setSearch] = useState("");

  function filterRoles(role: Roles) {
    const lowerSearch = search.toLowerCase();
    const lowerRoleName = role.name.toLowerCase();
    const lowerRoleDesc = role.description.toLowerCase();
    return lowerRoleName.includes(lowerSearch) || lowerRoleDesc.includes(lowerSearch);
  }

  return (
    <TabsContent value="roles">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            placeholder="Search roles..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <RouteButton route="/users/create-role">
          <ShieldCheck className="h-4 w-4 mr-2" />
          Add Role
        </RouteButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.filter(filterRoles).map((role) => (
          <Card key={role.id} className="justify-between">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{role.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled={!role.tenant_id}>
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={!role.tenant_id} className="text-red-600">
                      Delete Role
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span>Users {users.filter((usr) => usr.role_id === role.id).length}</span>
                <Badge variant="secondary">
                  {!role.tenant_id ? "Pre-defined" : "Custom"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  );
}