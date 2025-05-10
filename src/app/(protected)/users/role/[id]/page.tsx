import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import * as db from "@/utils/server/db";
import { editRoleAction } from "@/lib/actions/user-actions";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import RoleForm from "@/lib/components/forms/role-form";

type Props = {
  params: Promise<{ id: string }>;
}

export default async function EditRole({ params }: Props) {
  const pParams = await params;
  const supabase = await createClient();
  const role = await db.getRole(supabase, pParams.id);
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/users?tab=roles">Roles</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Edit Role</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
          <CardDescription>
            Enter the details for the role.
          </CardDescription>

        </CardHeader>
        <CardContent>
          <RoleForm
            role={role}
            action={editRoleAction}
            footer={{
              submit_text: "Update Role",
              pending_text: "Updating Role..."
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}