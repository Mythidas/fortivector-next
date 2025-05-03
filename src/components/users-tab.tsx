'use client';

import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RouteButton from "@/components/route-button";
import { Roles, Users } from "@/lib/schema/database";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/lib/server/db";

export default function UsersTab({ users, roles, currentUser }: { users: Users[]; roles: Roles[]; currentUser: string }) {
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
    <TabsContent value="users">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            placeholder="Search users..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <RouteButton route="/users/create-user">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </RouteButton>
      </div>

      <Card>
        <CardContent className="p-0">
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
                    {user.last_sign_in?.toISOString() || ""}
                  </TableCell>
                  <TableCell>
                    {roles.find((role) => role.id === user.role_id)?.name}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/users/edit-user/${user.id}`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(user.id)} disabled={currentUser === user.id}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
}