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
import RouteButton from "@/lib/components/ui/protected/route-button";
import { FormMessage, Message } from "@/lib/components/form-message";
import { createInviteAction } from "@/lib/actions/user-actions";
import CreateUserForm from "@/lib/components/forms/create-user-form";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";

export default async function CreateUser(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const roles = await db.getRoles(supabase);
  const tenant = await db.getTenant(supabase);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/users">Users</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Create User</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Enter the details for the new user account.
          </CardDescription>
          <FormMessage message={searchParams} />
        </CardHeader>
        <CardContent>
          <CreateUserForm tenantId={tenant?.id || ""} roles={roles} action={createInviteAction} />
        </CardContent>
      </Card>
    </div>
  );
}