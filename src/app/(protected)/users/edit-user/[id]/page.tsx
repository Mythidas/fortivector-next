import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import * as db from "@/lib/client/db";
import RouteButton from "@/components/route-button";
import { FormMessage, Message } from "@/components/form-message";
import { editUserAction } from "@/lib/actions/user-actions";
import EditUserForm from "@/components/forms/edit-user-form";

type Params = Promise<{ id: string }>

export default async function EditUser(props: { params: Params; searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const supabase = await createClient();
  const roles = await db.getRoles(supabase);
  const user = await db.getUser(supabase, params.id);
  if (!user) {
    return (
      <Card>
        <CardHeader>
          Failed to find user. Contact support.
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <RouteButton
          variant="ghost"
          size="sm"
          className="mr-2"
          route="/users"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </RouteButton>
        <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Enter the details for the new user account.
          </CardDescription>
          <FormMessage message={searchParams} />
        </CardHeader>
        <CardContent>
          <EditUserForm user={user} roles={roles} action={editUserAction} />
        </CardContent>
      </Card>
    </div>
  );
}