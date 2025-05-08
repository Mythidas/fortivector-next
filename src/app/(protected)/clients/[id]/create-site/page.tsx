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
import { createClientAction, createSiteAction } from "@/lib/actions/client-actions";
import CreateSiteForm from "@/lib/components/forms/create-site-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Message>;
}

export default async function CreateClient(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const client = await db.getClient(supabase, params.id);
  if (!client) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch client. Contact support.
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
          <BreadcrumbLink href={`/clients/${client.id}?tab=sites`}>{client.name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Create Site</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>
            Enter the details for the new site.
          </CardDescription>
          <FormMessage message={searchParams} />
        </CardHeader>
        <CardContent>
          <CreateSiteForm client={client} action={createSiteAction} />
        </CardContent>
      </Card>
    </div>
  );
}