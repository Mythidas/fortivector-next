import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import * as db from "@/lib/client/db";
import RouteButton from "@/lib/components/route-button";
import { FormMessage, Message } from "@/lib/components/form-message";
import { editRoleAction } from "@/lib/actions/user-actions";
import EditRoleForm from "@/lib/components/forms/edit-role-form";

type Params = Promise<{ id: string }>

export default async function EditRole(props: { params: Params; searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const supabase = await createClient();
  const role = await db.getRole(supabase, params.id);
  if (!role) {
    return (
      <Card>
        <CardHeader>
          Failed to find role. Contact support.
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
          route="/users?tab=roles"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </RouteButton>
        <h1 className="text-2xl font-bold tracking-tight">Edit Role</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
          <CardDescription>
            Enter the details for the role.
          </CardDescription>
          <FormMessage message={searchParams} />
        </CardHeader>
        <CardContent>
          <EditRoleForm role={role} action={editRoleAction} />
        </CardContent>
      </Card>
    </div>
  );
}