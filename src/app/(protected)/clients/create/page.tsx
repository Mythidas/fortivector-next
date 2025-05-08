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
import * as db from "@/lib/server/db";
import RouteButton from "@/lib/components/ui/protected/route-button";
import { FormMessage, Message } from "@/lib/components/form-message";
import { createInviteAction } from "@/lib/actions/user-actions";
import CreateUserForm from "@/lib/components/forms/create-user-form";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import CreateClientForm from "@/lib/components/forms/create-client-form";
import { createClientAction } from "@/lib/actions/client-actions";

export default async function CreateClient(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const tenant = await db.getTenant(supabase);

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
          <FormMessage message={searchParams} />
        </CardHeader>
        <CardContent>
          <CreateClientForm tenantId={tenant.id} action={createClientAction} />
        </CardContent>
      </Card>
    </div>
  );
}