import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import UserForm from "@/lib/components/forms/user-form";
import { getTenant } from "@/lib/functions/database/tenants";
import { getRoles } from "@/lib/functions/database/roles";
import { createInviteAction } from "@/lib/actions/users";

export default async function CreateUser() {
  const supabase = await createClient();
  const roles = await getRoles(supabase);
  const tenant = await getTenant(supabase);

  if (!roles || !tenant) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch data. Contact Support.
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
          <BreadcrumbPage>Create User</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Enter the details for the new user account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            user={{
              id: "",
              role_id: "",
              first_name: "",
              last_name: "",
              tenant_id: tenant.id,
              email: ""
            }}
            roles={roles}
            footer={{
              submit_text: "Create User",
              pending_text: "Creating User...",
              cancel_route: `/users`
            }}
            action={createInviteAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}