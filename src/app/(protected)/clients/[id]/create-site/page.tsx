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
import { createClientAction, createSiteAction } from "@/lib/actions/client-actions";
import SiteForm from "@/lib/components/forms/site-form";
import { getClient } from "@/lib/functions/database/clients";

type Props = {
  params: Promise<{ id: string }>;

}

export default async function CreateClient({ params }: Props) {
  const pParams = await params;
  const supabase = await createClient();
  const client = await getClient(supabase, pParams.id);
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
        </CardHeader>
        <CardContent>
          <SiteForm
            site={{
              id: "",
              client_id: client.id,
              tenant_id: client.tenant_id,
              name: ""
            }}
            footer={{
              submit_text: "Create Site",
              pending_text: "Creating Site...",
              cancel_route: `/clients/${client.id}?tab=sites`
            }}
            action={createSiteAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}