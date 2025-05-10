'use client';

import { Input } from "@/lib/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/lib/components/ui/button";
import {
  Card,
  CardContent,
} from "@/lib/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";
import { Avatar, AvatarFallback } from "@/lib/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { Roles, UserInvites } from "@/lib/schema/database";
import { useState } from "react";
import { Badge } from "@/lib/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import DropDownItem from "@/lib/components/ux/drop-down-item";

type Props = {
  roles: Roles[];
  invites: UserInvites[];
}

export default function InvitesTable({ invites, roles }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filterInvites(user: UserInvites) {
    const lowerSearch = search.toLowerCase();
    const lowerFirstName = user.first_name.toLowerCase();
    const lowerLastName = user.last_name.toLowerCase();
    const lowerEmail = user.email.toLowerCase();
    return lowerEmail.includes(lowerSearch) || lowerFirstName.includes(lowerSearch) || lowerLastName.includes(lowerSearch);
  }

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this invite?");
    if (!confirm) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("user_invites")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete failed:", error.message);
      alert("Failed to delete invite.");
    } else {
      router.push("/users?tab=invites");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            placeholder="Search invites..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="py-2">
        <CardContent className="p-0">
          <Table>
            <TableCaption>Total Invites: {invites.length}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.filter(filterInvites).map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {invite.first_name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">
                        {`${invite.first_name} ${invite.last_name}`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{invite.email}</TableCell>
                  <TableCell>
                    {roles.find((role) => role.id === invite.role_id)?.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={(new Date(invite.expires_at).getTime() > new Date().getTime()) ? "default" : "destructive"}>
                      {(() => {
                        const expireDate = new Date(invite.expires_at);
                        const now = new Date();
                        const hoursLeft = Math.floor((expireDate.getTime() - now.getTime()) / (1000 * 60 * 60))

                        return hoursLeft > 0 ? `${hoursLeft} hours left` : "Expired";
                      })()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          // Generate the signup link - replace with your actual link creation logic
                          const signupLink = `${process.env.NEXT_PUBLIC_ORIGIN}/auth/sign-up?invite=${encodeURI(invite.invite_token)}`;

                          // Copy to clipboard
                          navigator.clipboard.writeText(signupLink)
                            .then(() => {
                              // You could add a toast notification here
                              toast("Copied to clipboard.", {
                                action: {
                                  label: "Close",
                                  onClick: () => { },
                                },
                              })
                            })
                            .catch(err => {
                              toast("Failed to copy.", {
                                description: err,
                                action: {
                                  label: "Close",
                                  onClick: () => { },
                                },
                              })
                            });
                        }}>
                          Copy Signup Link
                        </DropdownMenuItem>
                        <DropDownItem className="text-red-600" onClick={() => handleDelete(invite.id)} module="users" level="edit">
                          Delete
                        </DropDownItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}