'use client';

import { Input } from "@/lib/components/ui/input";
import { Button } from "@/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { MoreHorizontal, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import RouteButton from "@/lib/components/ux/route-button";
import { Badge } from "@/lib/components/ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DropDownItem from "@/lib/components/ux/drop-down-item";
import { Users } from "@/lib/schema/database/users";
import { Roles } from "@/lib/schema/database/roles";
import DeleteForm from "@/lib/components/forms/delete-form";
import { deleteRoleAciton } from "@/lib/actions/roles";

type Props = {
  users: Users[];
  roles: Roles[];
}

export default function RolesTable({ users, roles }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filterRoles(role: Roles) {
    const lowerSearch = search.toLowerCase();
    const lowerRoleName = role.name.toLowerCase();
    const lowerRoleDesc = role.description.toLowerCase();
    return lowerRoleName.includes(lowerSearch) || lowerRoleDesc.includes(lowerSearch);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            placeholder="Search roles..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <RouteButton route="/users/role/create" module="roles" level="edit">
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
                <DeleteForm id={role.id} action={deleteRoleAciton}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropDownItem disabled={!role.tenant_id} route={`/users/role/${role.id}`} module="roles" level="edit">
                        Edit
                      </DropDownItem>
                      <DropDownItem form={role.id} disabled={!role.tenant_id || users.filter((usr) => usr.role_id === role.id).length > 0} type="submit" variant="destructive" module="roles" level="full">
                        Delete
                      </DropDownItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DeleteForm>
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
    </>
  );
}