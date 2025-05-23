'use client'

import { Avatar, AvatarFallback } from "@/lib/components/ui/avatar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/lib/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { Button } from "@/lib/components/ui/button";
import { MoreHorizontal, UserPlus } from "lucide-react";
import DropDownItem from "@/lib/components/ux/drop-down-item";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/lib/context/user-context";
import { Input } from "@/lib/components/ui/input";
import RouteButton from "@/lib/components/ux/route-button";
import { Card, CardContent } from "@/lib/components/ui/card";
import { Users } from "@/lib/schema/database/users";
import { Roles } from "@/lib/schema/database/roles";
import { deleteUser } from "@/lib/functions/database/users";
import DeleteForm from "@/lib/components/forms/delete-form";
import { deleteUserAction } from "@/lib/actions/users";

type Props = {
  users: Users[];
  roles: Roles[];
}

export default function UsersTable({ users, roles }: Props) {
  const context = useUser();
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filterUsers(user: Users) {
    const lowerSearch = search.toLowerCase();
    const lowerFirstName = user.first_name.toLowerCase();
    const lowerLastName = user.last_name.toLowerCase();
    const lowerEmail = user.email.toLowerCase();
    return lowerEmail.includes(lowerSearch) || lowerFirstName.includes(lowerSearch) || lowerLastName.includes(lowerSearch);
  }

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    const result = await deleteUser(id);

    if (!result) {
      alert("Failed to delete user.");
    } else {
      router.push("/users?tab=users");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            placeholder="Search users..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <RouteButton route="/users/create" module="users" level="edit">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </RouteButton>
      </div>
      <Card className="py-2">
        <Table>
          <TableCaption>Total Users: {users.length}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.filter(filterUsers).map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.first_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      {`${user.first_name} ${user.last_name}`}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.last_sign_in || "").toDateString() || ""}
                </TableCell>
                <TableCell>
                  {roles.find((role) => role.id === user.role_id)?.name}
                </TableCell>
                <TableCell>
                  <DeleteForm id={user.id} action={deleteUserAction}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropDownItem route={`/users/${user.id}`} module="users" level="edit">
                          Edit
                        </DropDownItem>
                        <DropDownItem form={user.id} type="submit" variant="destructive" module="users" level="full" disabled={user.id === context?.id}>
                          Delete
                        </DropDownItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DeleteForm>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}