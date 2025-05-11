import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { createClient } from "@/utils/supabase/server";

import { editUserAction } from "@/lib/actions/user-actions";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import UserForm from "@/lib/components/forms/user-form";
import { getRoles } from "@/lib/functions/database/roles";
import { getUser } from "@/lib/functions/database/users";

type Props = {
  params: Promise<{ id: string }>;
}

export default async function EditUser(props: Props) {
  const params = await props.params;
  const supabase = await createClient();
  const roles = await getRoles(supabase);
  const user = await getUser(supabase, params.id);
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

        </CardHeader>
        <CardContent>
          <UserForm
            user={user}
            roles={roles}
            footer={{
              submit_text: "Update Users",
              pending_text: "Updating Users...",
              cancel_route: "/users"
            }}
            action={editUserAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}