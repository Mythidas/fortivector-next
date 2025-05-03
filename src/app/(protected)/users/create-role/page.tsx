import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import * as db from "@/lib/client/db";
import RouteButton from "@/lib/components/route-button";
import { FormMessage, Message } from "@/lib/components/form-message";
import { createInviteAction, createRoleAction } from "@/lib/actions/user-actions";
import CreateRoleForm from "@/lib/components/forms/create-role-form";

export default async function CreateRole(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const tenant = await db.getTenant(supabase);
  if (!tenant) {
    return (
      <Card>
        <CardHeader>
          Failed to find tenant. Contact support.
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
        <h1 className="text-2xl font-bold tracking-tight">Create New Role</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
          <CardDescription>
            Enter the details for the new role.
          </CardDescription>
          <FormMessage message={searchParams} />
        </CardHeader>
        <CardContent>
          <CreateRoleForm tenantId={tenant.id} action={createRoleAction} />
        </CardContent>
      </Card>
    </div>
  );
}