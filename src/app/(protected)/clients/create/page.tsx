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
import ClientForm from "@/lib/components/forms/client-form";
import { createClientAction } from "@/lib/actions/client-actions";
import { getTenant } from "@/lib/functions/database/tenant";

export default async function CreateClient() {
  const supabase = await createClient();
  const tenant = await getTenant(supabase);

  if (!tenant) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch tenant. Contact support.
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Create Client</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>
            Enter the details for the new user client.
          </CardDescription>

        </CardHeader>
        <CardContent>
          <ClientForm
            client={{
              id: "",
              tenant_id: tenant.id,
              name: ""
            }}
            footer={{
              submit_text: "Create Client",
              pending_text: "Creating Client...",
              cancel_route: "/clients"
            }}
            action={createClientAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}