import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { createRoleAction } from "@/lib/actions/user-actions";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import RoleForm from "@/lib/components/forms/role-form";
import { getTenant } from "@/lib/functions/database/tenant";

export default async function CreateRole() {
  const supabase = await createClient();
  const tenant = await getTenant(supabase);
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
          <RoleForm
            role={{
              id: "",
              tenant_id: tenant.id,
              description: "",
              name: "",
              access_rights: {
                users: "read",
                roles: "read",
                dashboard: "read",
                "clients": "read",
                "controls": "read",
                "sites": "read",
                "systems": "read"
              }
            }}
            footer={{
              submit_text: "Create Role",
              pending_text: "Creating Role",
              cancel_route: "/users?tab=roles"
            }}
            action={createRoleAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}