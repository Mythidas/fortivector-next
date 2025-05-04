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
import RouteButton from "@/lib/components/protected/route-button";
import { FormMessage, Message } from "@/lib/components/form-message";
import { editUserAction } from "@/lib/actions/user-actions";
import EditUserForm from "@/lib/components/forms/edit-user-form";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";

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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/users">Users</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Edit User</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Enter the details for the user account.
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