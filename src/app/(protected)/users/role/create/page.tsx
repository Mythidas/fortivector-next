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
import * as db from "@/utils/server/db";
import RouteButton from "@/lib/components/ux/route-button";

import { createInviteAction, createRoleAction } from "@/lib/actions/user-actions";
import CreateRoleForm from "@/lib/components/forms/create-role-form";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";

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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/users?tab=roles">Roles</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Create Role</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
          <CardDescription>
            Enter the details for the new role.
          </CardDescription>

        </CardHeader>
        <CardContent>
          <CreateRoleForm tenantId={tenant.id} action={createRoleAction} />
        </CardContent>
      </Card>
    </div>
  );
}